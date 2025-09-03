import os
import json
import asyncio
import boto3
from datetime import datetime, timedelta, timezone
from dateutil import parser as date_parser
import httpx
from os.path import join, dirname
import feedparser
from dotenv import load_dotenv


dotenv_path = join(dirname(__file__), '..', '..', '.env')
load_dotenv(dotenv_path)

ARXIV_API_URL = "https://export.arxiv.org/api/query"
BUCKET_NAME = os.environ.get("BUCKET_NAME")
CATEGORIES = [
    # Computer Science
    "cs.LG",  # Machine Learning
    "cs.AI",  # Artificial Intelligence
    "cs.CL",  # NLP
    "cs.CV",  # Computer Vision
    "cs.CR",  # Cryptography
    "cs.RO",  # Robotics
    "cs.SE",  # Software Engineering
    "cs.DB",  # Databases
    "cs.OS",  # Operating Systems
    "cs.PL",  # Programming Languages

    # Math
    "math.CO",  # Combinatorics
    "math.PR",  # Probability
    "math.ST",  # Statistics
    "math.NT",  # Number Theory
    "math.AG",  # Algebraic Geometry
    "math.MG",  # Metric Geometry
    "math.DS",  # Dynamical Systems
    "math.FA",  # Functional Analysis

    # Physics (popular subfields)
    "astro-ph.CO",     # Cosmology
    "astro-ph.HE",     # High Energy
    "astro-ph.GA",     # Galaxies
    "cond-mat.mes-hall", # Mesoscale/Nanoscale Physics
    "cond-mat.soft",     # Soft Condensed Matter
    "cond-mat.stat-mech", # Statistical Mechanics
    "physics.optics",  # Optics
    "physics.plasm-ph",# Plasma Physics
    "physics.bio-ph",  # Biological Physics

    # Quantum / Finance / Biology
    "quant-ph",         # Quantum Physics
    "q-bio.BM",  # Biomolecules
    "q-bio.NC",  # Neurons
    "q-fin.CP",  # Computational Finance
]


s3_client = boto3.client("s3")

# fetch the papers from arxiv
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
        except Exception as e:
            print(f"Failed to fetch papers for {category}: {e}")
            return []
    
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

def upload_to_s3(category: str, papers: list):
    json_data = json.dumps(papers)
    s3_client.put_object(
        Bucket=BUCKET_NAME,
        Key=f"{category}.json",
        Body=json_data,
        ContentType="application/json"
    )
    print(f"Uploaded {category}.json to {BUCKET_NAME}")


async def main():
    tasks = [get_papers(cat) for cat in CATEGORIES]
    results = await asyncio.gather(*tasks)
    for cat, papers in zip(CATEGORIES, results):
        upload_to_s3(cat, papers)

if __name__ == "__main__":
    asyncio.run(main())