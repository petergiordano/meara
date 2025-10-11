# Railway Backend for DeepStack Analysis

FastAPI backend service that runs DeepStack Collector for website analysis in a persistent cloud environment.

## 🎯 Purpose

This backend solves the "lynchpin" problem: **running DeepStack Collector programmatically in the cloud** with browser automation (Playwright), which cannot run in Vercel's serverless environment.

## 🏗️ Architecture

```
Vercel Frontend
    ↓ HTTP Request
Railway Backend (this service)
    ↓ Runs DeepStack
Returns JSON Results
```

## 📋 Prerequisites

- Railway account ([railway.app](https://railway.app))
- Railway CLI installed: `npm install -g @railway/cli`
- DeepStack Collector code

## 🚀 Local Testing

### 1. Setup Virtual Environment

```bash
cd /Users/petergiordano/Documents/GitHub/meara/deploy/railway_backend

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Install Playwright Browser

```bash
playwright install chromium
```

### 3. Copy DeepStack Code

```bash
# Copy DeepStack Collector into this directory
cp ../../deepstack/deepstack.py .
cp -r ../../deepstack/src .
```

Your directory structure should look like:
```
railway_backend/
├── main.py              # FastAPI app (this file)
├── deepstack.py         # DeepStack Collector
├── src/                 # DeepStack source code
├── requirements.txt
├── Procfile
├── railway.json
└── output/              # Created automatically
```

### 4. Run Locally

```bash
python3 main.py
```

The API will be available at `http://localhost:8000`

### 5. Test the API

```bash
# Health check
curl http://localhost:8000/health

# Start analysis
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "GGWP",
    "company_url": "https://ggwp.com"
  }'

# This returns a job_id, use it to check status:
curl http://localhost:8000/api/status/{job_id}

# Get results when complete:
curl http://localhost:8000/api/results/{job_id}
```

## ☁️ Deploy to Railway

### Step 1: Login to Railway

```bash
railway login
```

### Step 2: Initialize Project

```bash
railway init
```

Choose:
- Create new project
- Name: "deepstack-analysis-backend"

### Step 3: Deploy

```bash
railway up
```

This will:
1. Upload your code
2. Install dependencies from `requirements.txt`
3. Install Playwright chromium browser
4. Start the FastAPI server

### Step 4: Get Public URL

```bash
railway domain
```

This returns your public URL, e.g., `https://deepstack-analysis-backend.up.railway.app`

### Step 5: Configure Environment Variables

In Railway dashboard or via CLI:

```bash
railway variables set CORS_ORIGINS=https://your-app.vercel.app,http://localhost:3000
```

## 📡 API Endpoints

### `GET /`
Health check endpoint

**Response:**
```json
{
  "service": "DeepStack Analysis API",
  "status": "running",
  "version": "1.0.0"
}
```

### `GET /health`
Detailed health status

**Response:**
```json
{
  "status": "healthy",
  "deepstack_available": true,
  "active_jobs": 2,
  "completed_jobs": 15
}
```

### `POST /api/analyze`
Start a new analysis job

**Request Body:**
```json
{
  "company_name": "Acme Corp",
  "company_url": "https://acme.com",
  "job_id": "optional-custom-id"
}
```

**Response:**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "queued",
  "estimated_time_minutes": 2
}
```

### `GET /api/status/{job_id}`
Check job progress

**Response:**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "running",
  "company_name": "Acme Corp",
  "company_url": "https://acme.com",
  "progress": 60,
  "error": null
}
```

Status values: `queued`, `running`, `completed`, `failed`

### `GET /api/results/{job_id}`
Get completed analysis results

**Response:**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "company_name": "Acme Corp",
  "company_url": "https://acme.com",
  "result": {
    "collection_metadata": {...},
    "url_analysis_results": {...},
    "data": {
      "marketing_technology_data_foundation": {...},
      "organic_presence_content_signals": {...},
      "user_experience_performance_clues": {...},
      "conversion_funnel_effectiveness": {...},
      "competitive_posture_strategic_tests": {...}
    }
  }
}
```

### `GET /api/jobs`
List all jobs (debugging)

## 🔧 Configuration

### CORS Settings

Edit `main.py` line 23-28 to add your Vercel URL:

```python
allow_origins=[
    "https://your-actual-app.vercel.app",  # ← Update this
    "http://localhost:3000",
    "http://localhost:5173",
],
```

### Timeout Settings

Default: 300 seconds (5 minutes)

Edit `main.py` line 111:
```python
timeout=300  # Increase if analyses take longer
```

## 🐛 Troubleshooting

### Issue: "deepstack.py not found"

**Solution:** Copy DeepStack code into railway_backend directory:
```bash
cp ../../deepstack/deepstack.py .
cp -r ../../deepstack/src .
```

### Issue: Playwright browser fails

**Solution:** Ensure `railway.json` includes browser installation:
```json
"buildCommand": "pip install -r requirements.txt && playwright install chromium"
```

### Issue: Timeout errors

**Solution:** Increase timeout in `main.py` or upgrade Railway plan for more compute.

### Issue: CORS errors from frontend

**Solution:** Add your Vercel URL to `allow_origins` in `main.py`

## 💰 Costs

- **Railway Starter:** $5/month
- **Railway Pro:** $20/month (if need more compute/memory)

## 🔗 Next Steps

1. ✅ Test locally
2. ✅ Deploy to Railway
3. ✅ Get public URL
4. ⏭️ Build Vercel frontend
5. ⏭️ Connect frontend to this backend
6. ⏭️ Test end-to-end

## 📚 Related Documentation

- [Railway Docs](https://docs.railway.app)
- [FastAPI Docs](https://fastapi.tiangolo.com)
- [Playwright Docs](https://playwright.dev/python)
- [DeepStack Workflow](/Users/petergiordano/Documents/GitHub/deepstack-workflow/)
- [Vercel Deployment Plan](/Users/petergiordano/Documents/GitHub/meara/deploy/vercel_deployment_plan.md)

---

**Status:** Ready for local testing and Railway deployment
**Purpose:** Solves cloud website scraping challenge for DeepStack
**Next:** Create Vercel frontend to call this API
