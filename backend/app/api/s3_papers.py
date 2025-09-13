import os
import boto3
import json
from fastapi import APIRouter, HTTPException

router = APIRouter()

# Read environment variables
BUCKET_NAME = os.environ.get("BUCKET_NAME")
AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.environ.get("AWS_DEFAULT_REGION")

# Sanity checks for missing environment variables
if not BUCKET_NAME:
    raise RuntimeError("BUCKET_NAME environment variable is missing")
if not AWS_ACCESS_KEY_ID or not AWS_SECRET_ACCESS_KEY:
    raise RuntimeError("AWS credentials are missing")
if not AWS_REGION:
    raise RuntimeError("AWS_DEFAULT_REGION is missing")

# Create S3 client using environment variables
s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION,
)

@router.get("/categories")
async def get_categories():
    try:
        response = s3_client.list_objects_v2(Bucket=BUCKET_NAME)
        objects = response.get("Contents", [])
        categories = [
            obj["Key"].replace(".json", "")
            for obj in objects
            if obj["Key"].endswith(".json")
        ]
        return {"categories": categories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{category}")
async def get_papers_from_s3(category: str):
    key = f"{category}.json"
    try:
        obj = s3_client.get_object(Bucket=BUCKET_NAME, Key=key)
        # decode bytes to string before loading JSON
        data = json.loads(obj["Body"].read().decode("utf-8"))
        return {"category": category, "papers": data}
    except s3_client.exceptions.NoSuchKey:
        raise HTTPException(status_code=404, detail="Category not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
