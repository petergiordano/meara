# Vercel Deployment Plan: Simple Website Analysis Tool

## 🎯 Goal

Deploy a minimal viable website analysis tool that works in the cloud, solving the "lynchpin" problem of programmatic website scraping from a cloud service.

---

## 🚨 The Core Challenge

**Problem:** DeepStack Collector needs to:
1. Visit websites programmatically
2. Execute JavaScript (for SPAs)
3. Detect MarTech/tracking scripts
4. Analyze page structure

**Why Vercel Alone Won't Work:**
- ❌ Vercel is serverless (functions timeout at 10-60 seconds)
- ❌ Can't run Playwright/Puppeteer easily (large binary)
- ❌ Cold starts make browser automation unreliable
- ❌ Functions are ephemeral (no persistent connections)

---

## ✅ Recommended Architecture: Vercel + Railway

```
┌─────────────────────────────────┐
│   VERCEL (Frontend + API)       │
│   - React UI                    │
│   - Upload interface            │
│   - Results display             │
│   - API routes (lightweight)   │
└─────────────────────────────────┘
            ↓ HTTP Request
┌─────────────────────────────────┐
│   RAILWAY (Backend Worker)      │
│   - DeepStack Collector         │
│   - Playwright browser          │
│   - Heavy processing            │
│   - Persistent process          │
└─────────────────────────────────┘
            ↓ Results
┌─────────────────────────────────┐
│   STORAGE (S3 or PostgreSQL)    │
│   - DeepStack JSON outputs      │
│   - Job status/metadata         │
└─────────────────────────────────┘
```

---

## 🏗️ Implementation Plan

### Phase 1: Railway Backend (Week 1)

Deploy DeepStack as a standalone API service on Railway.

#### File: `railway_backend/main.py`

```python
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
import subprocess
import json
from pathlib import Path

app = FastAPI()

# Allow Vercel frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-app.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory job store (use Redis/Postgres for production)
jobs = {}

class AnalysisRequest(BaseModel):
    company_name: str
    company_url: str
    job_id: str = None

@app.post("/api/analyze")
async def start_analysis(request: AnalysisRequest, background_tasks: BackgroundTasks):
    """
    Start DeepStack analysis for a URL

    Returns job_id immediately, runs analysis in background
    """
    job_id = request.job_id or str(uuid.uuid4())

    jobs[job_id] = {
        "status": "queued",
        "company_name": request.company_name,
        "company_url": request.company_url,
        "progress": 0
    }

    # Run DeepStack in background
    background_tasks.add_task(run_deepstack_analysis, job_id, request.company_url)

    return {
        "job_id": job_id,
        "status": "queued",
        "estimated_time_minutes": 2
    }

async def run_deepstack_analysis(job_id: str, url: str):
    """Background task to run DeepStack"""
    try:
        jobs[job_id]["status"] = "running"
        jobs[job_id]["progress"] = 10

        # Run DeepStack collector
        # Assumes deepstack.py is in the same directory or installed
        result = subprocess.run(
            ["python3", "deepstack.py", "-u", url],
            capture_output=True,
            text=True,
            timeout=300
        )

        jobs[job_id]["progress"] = 90

        if result.returncode == 0:
            # Find output file
            output_path = Path(f"output/deepstack_output-{extract_domain(url)}.json")

            if output_path.exists():
                with open(output_path) as f:
                    data = json.load(f)

                jobs[job_id]["status"] = "completed"
                jobs[job_id]["progress"] = 100
                jobs[job_id]["result"] = data
            else:
                jobs[job_id]["status"] = "failed"
                jobs[job_id]["error"] = "Output file not found"
        else:
            jobs[job_id]["status"] = "failed"
            jobs[job_id]["error"] = result.stderr

    except Exception as e:
        jobs[job_id]["status"] = "failed"
        jobs[job_id]["error"] = str(e)

@app.get("/api/status/{job_id}")
async def get_status(job_id: str):
    """Get analysis status"""
    if job_id not in jobs:
        return {"error": "Job not found"}, 404

    return jobs[job_id]

@app.get("/api/results/{job_id}")
async def get_results(job_id: str):
    """Get analysis results"""
    if job_id not in jobs:
        return {"error": "Job not found"}, 404

    job = jobs[job_id]

    if job["status"] != "completed":
        return {
            "error": "Analysis not complete",
            "status": job["status"]
        }, 400

    return {
        "job_id": job_id,
        "company_name": job["company_name"],
        "result": job["result"]
    }

def extract_domain(url: str) -> str:
    from urllib.parse import urlparse
    parsed = urlparse(url)
    return parsed.netloc.replace('www.', '').replace(':', '_')

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

#### File: `railway_backend/requirements.txt`

```txt
fastapi
uvicorn
pydantic
playwright
beautifulsoup4
requests
python-dotenv
```

#### File: `railway_backend/Procfile`

```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

#### Deploy to Railway:

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
cd railway_backend
railway init

# 4. Deploy
railway up

# 5. Get URL
railway domain
# -> https://your-app.railway.app
```

---

### Phase 2: Vercel Frontend (Week 1)

Simple React app to submit URLs and display results.

#### File: `vercel_frontend/pages/index.tsx`

```typescript
import { useState } from 'react';

export default function Home() {
  const [companyName, setCompanyName] = useState('');
  const [companyUrl, setCompanyUrl] = useState('');
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const RAILWAY_API = process.env.NEXT_PUBLIC_RAILWAY_API || 'https://your-app.railway.app';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Start analysis
      const response = await fetch(`${RAILWAY_API}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: companyName,
          company_url: companyUrl
        })
      });

      const data = await response.json();
      setJobId(data.job_id);

      // Poll for status
      pollStatus(data.job_id);

    } catch (error) {
      alert('Error starting analysis: ' + error.message);
      setLoading(false);
    }
  };

  const pollStatus = async (id) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${RAILWAY_API}/api/status/${id}`);
        const data = await response.json();

        setStatus(data);

        if (data.status === 'completed') {
          clearInterval(interval);
          fetchResults(id);
        } else if (data.status === 'failed') {
          clearInterval(interval);
          setLoading(false);
          alert('Analysis failed: ' + data.error);
        }
      } catch (error) {
        console.error('Status check failed:', error);
      }
    }, 2000); // Poll every 2 seconds
  };

  const fetchResults = async (id) => {
    try {
      const response = await fetch(`${RAILWAY_API}/api/results/${id}`);
      const data = await response.json();
      setResult(data.result);
      setLoading(false);
    } catch (error) {
      alert('Error fetching results: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Website Analysis Tool</h1>

      {!result ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />

          <input
            type="url"
            placeholder="https://company.com"
            value={companyUrl}
            onChange={(e) => setCompanyUrl(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze Website'}
          </button>
        </form>
      ) : null}

      {status && loading ? (
        <div className="progress">
          <p>Status: {status.status}</p>
          <p>Progress: {status.progress}%</p>
        </div>
      ) : null}

      {result ? (
        <div className="results">
          <h2>Analysis Complete!</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
          <button onClick={() => {
            const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${companyName}_deepstack.json`;
            a.click();
          }}>
            Download JSON
          </button>
        </div>
      ) : null}
    </div>
  );
}
```

#### File: `vercel_frontend/vercel.json`

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

#### Deploy to Vercel:

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
cd vercel_frontend
vercel

# 4. Production deployment
vercel --prod
```

---

## 🔒 Alternative: Scraping Service API

If DeepStack deployment is too complex, use a scraping service:

### Option: ScrapingBee

```python
# File: deploy/scraping_service.py

import requests
import os

SCRAPINGBEE_API_KEY = os.getenv("SCRAPINGBEE_API_KEY")

def analyze_website_with_scrapingbee(url: str):
    """
    Use ScrapingBee to fetch website data
    Then analyze locally
    """

    # Fetch page with ScrapingBee
    response = requests.get(
        'https://app.scrapingbee.com/api/v1/',
        params={
            'api_key': SCRAPINGBEE_API_KEY,
            'url': url,
            'render_js': 'true',  # Execute JavaScript
            'premium_proxy': 'true',  # Use rotating proxies
            'extract_rules': {
                'scripts': {
                    'selector': 'script',
                    'type': 'list',
                    'output': 'text'
                },
                'meta_tags': {
                    'selector': 'meta',
                    'type': 'list',
                    'output': 'html'
                }
            }
        }
    )

    html = response.content

    # Now analyze the HTML locally (no browser needed)
    # This is lightweight and can run in serverless
    return analyze_html(html)
```

**Pros:**
- ✅ Works in Vercel serverless
- ✅ Handles JavaScript rendering
- ✅ No browser dependencies
- ✅ Rotating IPs (avoid blocking)

**Cons:**
- ⚠️ Costs ~$0.01 per request
- ⚠️ Less control than running own browser

---

## 📊 Architecture Comparison

| Approach | Complexity | Cost/mo | Pros | Cons |
|----------|------------|---------|------|------|
| **Vercel + Railway** | Medium | $5-20 | Full control, fast | Need 2 services |
| **ScrapingBee API** | Low | $50+ | Simple, reliable | Ongoing cost |
| **AWS Lambda + Playwright** | High | $10-30 | Scalable | Complex setup |

**Recommendation:** Start with **Vercel + Railway** (best balance)

---

## 🚀 Quick Start Implementation

### Step 1: Test Railway Locally

```bash
cd /Users/petergiordano/Documents/GitHub/meara/deploy

# Create Railway backend
mkdir railway_backend
cd railway_backend

# Create files above (main.py, requirements.txt)

# Test locally
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Copy DeepStack
cp ../../deepstack/deepstack.py .
cp -r ../../deepstack/src .

# Run
python3 main.py

# Test at http://localhost:8000
```

### Step 2: Deploy Railway

```bash
railway init
railway up
railway domain

# Note the URL: https://your-app.railway.app
```

### Step 3: Create Vercel Frontend

```bash
cd ..
npx create-next-app@latest vercel_frontend

# Create pages/index.tsx (above)
# Add RAILWAY_API to .env.local

# Deploy
cd vercel_frontend
vercel
```

---

## ✅ Success Criteria

**Phase 1 Complete When:**
- [ ] Railway API responds to POST /api/analyze
- [ ] DeepStack runs successfully in Railway
- [ ] Returns JSON results
- [ ] Vercel frontend can submit URLs
- [ ] Results display correctly

**Ready for Next Phase:**
- [ ] Add L3 generation (Gemini API)
- [ ] Add Deep Research (Perplexity API)
- [ ] Add MEARA analysis (OpenAI)

---

## 💰 Cost Estimate

### Railway (Backend):
- **Starter:** $5/month
- **Pro:** $20/month (if need more compute)

### Vercel (Frontend):
- **Hobby:** $0/month (free tier sufficient)

### Total: $5-20/month for infrastructure

---

## 🔧 Next Steps

1. **This Week:**
   - [ ] Create Railway backend with DeepStack
   - [ ] Test locally
   - [ ] Deploy to Railway
   - [ ] Get working API endpoint

2. **Next Week:**
   - [ ] Create Vercel frontend
   - [ ] Connect to Railway API
   - [ ] Test end-to-end
   - [ ] Deploy to production

3. **Week 3:**
   - [ ] Add Gemini API for L3
   - [ ] Add Perplexity API for Deep Research
   - [ ] Complete full pipeline

---

Would you like me to create the actual Railway backend files now?
