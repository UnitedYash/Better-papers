# app/main.py
from fastapi import FastAPI
from app.api import papers  # import the router

app = FastAPI(title="Better Papers API")

# include the papers router under /papers
app.include_router(papers.router, prefix="/papers", tags=["papers"])

@app.get("/")
async def root():
    return {"message": "Welcome to Better Papers API!"}