"""
Railway Backend for DeepStack Website Analysis
FastAPI service that runs DeepStack Collector and returns results
"""

from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
import subprocess
import json
from pathlib import Path
from typing import Optional
import os
import sys

app = FastAPI(
    title="DeepStack Analysis API",
    description="Backend service for running website analysis with DeepStack Collector",
    version="1.0.0"
)

# Allow Vercel frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-app.vercel.app",  # Replace with your Vercel URL
        "http://localhost:3000",        # Local development
        "http://localhost:5173",        # Vite dev server
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory job store (use Redis/Postgres for production)
jobs = {}

class AnalysisRequest(BaseModel):
    company_name: str
    company_url: str
    job_id: Optional[str] = None

class JobStatus(BaseModel):
    job_id: str
    status: str
    company_name: str
    company_url: str
    progress: int
    error: Optional[str] = None
    estimated_time_minutes: Optional[int] = None

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "DeepStack Analysis API",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health():
    """Detailed health check"""
    deepstack_path = Path("deepstack.py")
    return {
        "status": "healthy",
        "deepstack_available": deepstack_path.exists(),
        "active_jobs": len([j for j in jobs.values() if j["status"] in ["queued", "running"]]),
        "completed_jobs": len([j for j in jobs.values() if j["status"] == "completed"])
    }

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
    background_tasks.add_task(run_deepstack_analysis, job_id, request.company_name, request.company_url)

    return {
        "job_id": job_id,
        "status": "queued",
        "estimated_time_minutes": 2
    }

async def run_deepstack_analysis(job_id: str, company_name: str, url: str):
    """Background task to run DeepStack"""
    try:
        jobs[job_id]["status"] = "running"
        jobs[job_id]["progress"] = 10

        # Ensure output directory exists
        output_dir = Path("output")
        output_dir.mkdir(exist_ok=True)

        jobs[job_id]["progress"] = 20

        # Run DeepStack collector
        # Assumes deepstack.py is in the Railway service directory
        deepstack_script = Path("deepstack.py")

        if not deepstack_script.exists():
            # Try parent directory
            deepstack_script = Path("../deepstack/deepstack.py")

        if not deepstack_script.exists():
            raise FileNotFoundError("deepstack.py not found")

        jobs[job_id]["progress"] = 30

        result = subprocess.run(
            [sys.executable, str(deepstack_script), "-u", url],
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout
        )

        jobs[job_id]["progress"] = 90

        if result.returncode == 0:
            # Find output file
            domain = extract_domain(url)
            output_path = output_dir / f"deepstack_output-{domain}.json"

            if output_path.exists():
                with open(output_path) as f:
                    data = json.load(f)

                jobs[job_id]["status"] = "completed"
                jobs[job_id]["progress"] = 100
                jobs[job_id]["result"] = data
                jobs[job_id]["output_file"] = str(output_path)
            else:
                # Check for any JSON files in output
                json_files = list(output_dir.glob("deepstack_output-*.json"))
                if json_files:
                    latest_file = max(json_files, key=lambda p: p.stat().st_mtime)
                    with open(latest_file) as f:
                        data = json.load(f)

                    jobs[job_id]["status"] = "completed"
                    jobs[job_id]["progress"] = 100
                    jobs[job_id]["result"] = data
                    jobs[job_id]["output_file"] = str(latest_file)
                else:
                    jobs[job_id]["status"] = "failed"
                    jobs[job_id]["error"] = f"Output file not found: {output_path}"
                    jobs[job_id]["stderr"] = result.stderr
        else:
            jobs[job_id]["status"] = "failed"
            jobs[job_id]["error"] = "DeepStack execution failed"
            jobs[job_id]["stderr"] = result.stderr
            jobs[job_id]["stdout"] = result.stdout

    except subprocess.TimeoutExpired:
        jobs[job_id]["status"] = "failed"
        jobs[job_id]["error"] = "Analysis timed out after 5 minutes"
    except Exception as e:
        jobs[job_id]["status"] = "failed"
        jobs[job_id]["error"] = str(e)

@app.get("/api/status/{job_id}")
async def get_status(job_id: str):
    """Get analysis status"""
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")

    job = jobs[job_id]
    return {
        "job_id": job_id,
        "status": job["status"],
        "company_name": job["company_name"],
        "company_url": job["company_url"],
        "progress": job["progress"],
        "error": job.get("error")
    }

@app.get("/api/results/{job_id}")
async def get_results(job_id: str):
    """Get analysis results"""
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")

    job = jobs[job_id]

    if job["status"] == "running" or job["status"] == "queued":
        raise HTTPException(
            status_code=400,
            detail=f"Analysis not complete. Current status: {job['status']}"
        )

    if job["status"] == "failed":
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {job.get('error', 'Unknown error')}"
        )

    return {
        "job_id": job_id,
        "company_name": job["company_name"],
        "company_url": job["company_url"],
        "result": job.get("result", {})
    }

@app.get("/api/jobs")
async def list_jobs():
    """List all jobs (for debugging)"""
    return {
        "total_jobs": len(jobs),
        "jobs": [
            {
                "job_id": job_id,
                "status": job["status"],
                "company_name": job["company_name"],
                "progress": job["progress"]
            }
            for job_id, job in jobs.items()
        ]
    }

@app.get("/api/debug/{job_id}")
async def debug_job(job_id: str):
    """Get full job details including stderr/stdout for debugging"""
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return jobs[job_id]

def extract_domain(url: str) -> str:
    """Extract domain from URL for filename"""
    from urllib.parse import urlparse
    parsed = urlparse(url)
    domain = parsed.netloc.replace('www.', '').replace(':', '_')
    return domain

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
