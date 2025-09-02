from fastapi import FastAPI
import requests
import feedparser

app = FastAPI()

@app.get("/")
async def root():
    url = (
        "http://export.arxiv.org/api/query?"
        "search_query=all:machine+learning+AND+cat:cs.LG"
        "&max_results=10&sortBy=submittedDate&sortOrder=descending"
    )

    feed = feedparser.parse(url)

    results = [
        {
            "title": entry.title,
            "link": entry.link,
            "published": entry.published,
            "abstract": entry.summary
        }
        for entry in feed.entries
    ]
    for paper in results:
        print(f"Title: {paper['title']}", flush=True)
        print(f"Abstract: {paper['abstract']}\n{'-'*80}", flush=True)
    return {"papers": results}