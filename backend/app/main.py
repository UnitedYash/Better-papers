# app/main.py
from fastapi import FastAPI
from app.api import s3_papers

app = FastAPI(title="Better Papers API")

app.include_router(s3_papers.router, prefix="/papers")

@app.get("/")
async def root():
    return {"message": "Welcome to Better Papers Papers!"}