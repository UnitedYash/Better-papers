from fastapi import APIRouter, HTTPException
from typing import List
import httpx
import feedparser

from datetime import datetime, timedelta, timezone
from dateutil import parser as date_parser


router = APIRouter()

ARXIV_API_URL = "https://export.arxiv.org/api/query"

@router.get("/{category}", response_model=List[dict])
async def get_papers(category:str):
    # get time from seven days ago
    seven_days_ago = datetime.now(timezone.utc) - timedelta(days=7)
    query = f"cat:{category}"
    params = {
        "search_query": query,
        "start": 0,
        "max_results": 50,
        "sortBy": "submittedDate",
        "sortOrder": "descending"
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(ARXIV_API_URL, params=params, timeout=10)
            response.raise_for_status()
        except:
            raise HTTPException(status_code=500, detail=str(e))
    
    feed = feedparser.parse(response.text)

    papers = []

    for entry in feed.entries:
        published = date_parser.parse(entry.published)
        if (published < seven_days_ago):
            continue
        
        papers.append({
            "title": entry.title,
            "authors": [author.name for author in entry.authors],
            "summary": entry.summary,
            "published": published.isoformat(),
            "link": entry.link
        })
    
    
    return papers





