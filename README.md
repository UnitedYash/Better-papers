<img width="1137" height="648" alt="image" src="https://github.com/user-attachments/assets/1c90d829-6c5b-4b45-97e2-825bb630b1dd" />


# Better Papers Scraper

A serverless project that automatically scrapes research papers from ArXiv
 across multiple categories, processes them, and stores the results in AWS S3. Designed to run daily using AWS Lambda and EventBridge.

# Features

Scrapes multiple categories from ArXiv (Computer Science, Math, Physics, Quantum, Finance, Biology, etc.)

Fetches the latest papers from the past week

Stores results in JSON format in an S3 bucket

Fully serverless and automated

Async fetching for faster processing

Configurable via environment variables

# Technologies Used

Python 3.13 – main programming language

AWS Lambda – serverless function execution

AWS EventBridge – scheduled daily triggers

AWS S3 – storage for scraped JSON files

httpx – asynchronous HTTP requests

feedparser – parsing ArXiv RSS feeds

python-dateutil – handling dates and parsing timestamps

asyncio – concurrency for fetching multiple categories simultaneously

dotenv – managing environment variables

# Screenshots
<img width="1470" height="571" alt="image" src="https://github.com/user-attachments/assets/8980c60c-433a-4054-a83c-76ff58b7179e" />
<img width="1470" height="717" alt="image" src="https://github.com/user-attachments/assets/78180d7f-2cc6-46ad-ab9a-7279159917fe" />
<img width="936" height="831" alt="image" src="https://github.com/user-attachments/assets/b293e84e-7688-4921-89fa-33838118e9a2" />
<img width="1121" height="684" alt="image" src="https://github.com/user-attachments/assets/1b25600d-f731-4e28-b4e4-c8fc2f3f5b90" />
<img width="1211" height="724" alt="image" src="https://github.com/user-attachments/assets/8e27cf9d-ae14-4263-a9a5-4a2c5e0b1b38" />
<img width="1102" height="799" alt="image" src="https://github.com/user-attachments/assets/9ffed17e-7986-49f1-9e88-dde6a85337f5" />

# Setup

Clone the repository
```
git clone <repo-url>
cd better-papers
```

Set environment variables in .env:
```
BUCKET_NAME=your-s3-bucket-name

```
Install dependencies for Lambda Layer
```
mkdir -p layer/python
pip install -r requirements.txt -t layer/python
cd layer
zip -r ../layer.zip .
```

Upload Lambda Layer in AWS Console (or via CLI)

Package Lambda function
```
zip -r function.zip lambda_function.py
```

Create Lambda function and attach the Layer

Create EventBridge Rule to run daily

Example schedule: rate(1 day) or cron in UTC

Usage

Once deployed, Lambda will automatically scrape ArXiv daily and upload JSON files to S3.

JSON files are named after categories, e.g., cs.LG.json, math.CO.json.

Notes

Lambda timeout should be set to 60 seconds or more for multiple categories.

Lambda role must have s3:PutObject permissions for the target bucket.

EventBridge triggers run in UTC — adjust your schedule if needed.


