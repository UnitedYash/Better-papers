from fastapi import APIRouter, HTTPException
import boto3
import os
import json
from dotenv import load_dotenv
from os.path import join, dirname

router = APIRouter()



dotenv_path = join(dirname(__file__), '..', '..', '..', '.env')
load_dotenv(dotenv_path)
BUCKET_NAME = os.environ.get("BUCKET_NAME")
s3_client = boto3.client("s3")



@router.get("/categories")
async def get_categories():
    try:
        response = s3_client.list_objects_v2(Bucket=BUCKET_NAME)
        objects = response.get("Contents", [])
        categories = [obj["Key"].replace(".json", "") for obj in objects if obj["Key"].endswith(".json")]
        return {"categories": categories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{category}") 
async def get_papers_from_s3(category: str):
    key = f"{category}.json" 
    try:
        obj = s3_client.get_object(Bucket=BUCKET_NAME, Key=key)
        data = json.loads(obj["Body"].read())
        return {"category": category, "papers": data}
    except s3_client.exceptions.NoSuchKey:
        raise HTTPException(status_code=404, detail="Category not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

