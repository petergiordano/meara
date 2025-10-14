"""
Railway Backend for DeepStack Website Analysis
FastAPI service that runs DeepStack Collector and MEARA full analysis
"""

from fastapi import FastAPI, BackgroundTasks, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
import subprocess
import json
from pathlib import Path
from typing import Optional, List
import os
import sys
import shutil
import threading

app = FastAPI(
    title="DeepStack Analysis API",
    description="Backend service for running website analysis with DeepStack Collector",
    version="1.0.0"
)

# Allow Vercel frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://meara-app.vercel.app",  # Production Vercel URL
        "http://localhost:3000",         # Local development
        "http://localhost:5173",         # Vite dev server
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory job stores (use Redis/Postgres for production)
jobs = {}  # DeepStack jobs
analysis_jobs = {}  # MEARA full analysis jobs

# Progress stage mapping: 16 workflow steps → 5 user-facing stages
STAGE_MAPPING = {
    1: {"stage": 1, "name": "Preparing analysis", "icon": "🔬"},
    2: {"stage": 1, "name": "Preparing analysis", "icon": "🔬"},
    3: {"stage": 1, "name": "Processing technical data", "icon": "📋"},  # NEW: Ground Truth step
    4: {"stage": 1, "name": "Preparing analysis", "icon": "🔬"},
    5: {"stage": 2, "name": "Collecting evidence", "icon": "📊"},
    6: {"stage": 2, "name": "Collecting evidence", "icon": "📊"},
    7: {"stage": 2, "name": "Collecting evidence", "icon": "📊"},
    8: {"stage": 3, "name": "Evaluating dimensions", "icon": "📈"},
    9: {"stage": 3, "name": "Evaluating dimensions", "icon": "📈"},
    10: {"stage": 3, "name": "Evaluating dimensions", "icon": "📈"},
    11: {"stage": 3, "name": "Evaluating dimensions", "icon": "📈"},
    12: {"stage": 4, "name": "Building recommendations", "icon": "💡"},
    13: {"stage": 4, "name": "Building recommendations", "icon": "💡"},
    14: {"stage": 5, "name": "Finalizing report", "icon": "📝"},
    15: {"stage": 5, "name": "Finalizing report", "icon": "📝"},
    16: {"stage": 5, "name": "Finalizing report", "icon": "📝"},
}

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
async def start_analysis(
    background_tasks: BackgroundTasks,
    company_name: str = Form(...),
    company_url: str = Form(...),
    drb_file: Optional[UploadFile] = File(None)
):
    """
    Start DeepStack analysis for a URL with optional Deep Research Brief upload

    Accepts multipart/form-data with:
    - company_name: Company name
    - company_url: Company URL to analyze
    - drb_file: Optional Deep Research Brief file (PDF, TXT, MD)

    Returns job_id immediately, runs analysis in background
    """
    job_id = str(uuid.uuid4())

    # Create context directory for this company
    context_dir = Path("context_inputs") / company_name.replace(" ", "_").lower()
    context_dir.mkdir(parents=True, exist_ok=True)

    # Save uploaded file if provided
    drb_path = None
    if drb_file and drb_file.filename:
        drb_path = context_dir / f"drb_{drb_file.filename}"
        with open(drb_path, "wb") as f:
            shutil.copyfileobj(drb_file.file, f)
        print(f"Saved DRB file to: {drb_path}")

    jobs[job_id] = {
        "status": "queued",
        "company_name": company_name,
        "company_url": company_url,
        "progress": 0,
        "drb_file_path": str(drb_path) if drb_path else None
    }

    # Run DeepStack in background
    background_tasks.add_task(run_deepstack_analysis, job_id, company_name, company_url)

    return {
        "job_id": job_id,
        "status": "queued",
        "estimated_time_minutes": 2,
        "drb_uploaded": drb_path is not None
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
        "error": job.get("error"),
        "has_drb": job.get("drb_file_path") is not None
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

# ============================================================================
# MEARA FULL ANALYSIS ENDPOINTS (Sprint L.1)
# ============================================================================

@app.post("/api/analyze/full")
async def start_full_analysis(
    background_tasks: BackgroundTasks,
    deepstack_job_id: str = Form(...),
    additional_context_files: Optional[List[UploadFile]] = File(None)
):
    """
    Start full MEARA analysis using completed DeepStack results

    Accepts multipart/form-data with:
    - deepstack_job_id: Job ID from completed DeepStack analysis
    - additional_context_files: Optional additional context docs (investor memo, pitch deck, etc.)

    Returns analysis_job_id immediately, runs 15-step workflow in background
    """
    # Validate DeepStack job exists and is completed
    if deepstack_job_id not in jobs:
        raise HTTPException(status_code=404, detail="DeepStack job not found")

    deepstack_job = jobs[deepstack_job_id]
    if deepstack_job["status"] != "completed":
        raise HTTPException(
            status_code=400,
            detail=f"DeepStack analysis not complete. Status: {deepstack_job['status']}"
        )

    analysis_job_id = str(uuid.uuid4())

    # Get company info from DeepStack job
    company_name = deepstack_job["company_name"]
    company_url = deepstack_job["company_url"]

    # Get context directory
    context_dir = Path("context_inputs") / company_name.replace(" ", "_").lower()
    context_dir.mkdir(parents=True, exist_ok=True)

    # Save additional context files if provided
    additional_files = []
    if additional_context_files:
        for file in additional_context_files:
            if file.filename:
                file_path = context_dir / f"context_{file.filename}"
                with open(file_path, "wb") as f:
                    shutil.copyfileobj(file.file, f)
                additional_files.append(str(file_path))
                print(f"Saved context file: {file_path}")

    # Initialize analysis job
    analysis_jobs[analysis_job_id] = {
        "status": "queued",
        "company_name": company_name,
        "company_url": company_url,
        "deepstack_job_id": deepstack_job_id,
        "current_step": 0,
        "current_stage": 0,
        "stage_name": "Initializing",
        "stage_icon": "⏳",
        "progress": 0,
        "additional_context_files": additional_files,
        "drb_file_path": deepstack_job.get("drb_file_path")
    }

    # Run MEARA workflow in background
    background_tasks.add_task(
        run_meara_full_analysis,
        analysis_job_id,
        deepstack_job_id,
        company_name,
        company_url
    )

    return {
        "analysis_job_id": analysis_job_id,
        "status": "queued",
        "estimated_time_minutes": 10,  # Updated from 8 to 10 (adds ~2 min for Ground Truth)
        "deepstack_job_id": deepstack_job_id
    }

async def run_meara_full_analysis(
    analysis_job_id: str,
    deepstack_job_id: str,
    company_name: str,
    company_url: str
):
    """Background task to run MEARA full analysis workflow"""
    try:
        analysis_jobs[analysis_job_id]["status"] = "running"

        # Get DRB file path if exists
        drb_path = analysis_jobs[analysis_job_id].get("drb_file_path")
        drb_content = None
        if drb_path and Path(drb_path).exists():
            drb_content = Path(drb_path).read_text()

        # Import and run orchestrator
        # We'll import here to avoid startup issues if OpenAI not configured
        from meara_orchestrator import run_meara_workflow, STAGE_MAPPING as WORKFLOW_STAGES

        # Create progress callback to update status
        def update_progress(step_num: int):
            """Update progress based on workflow step"""
            stage_info = STAGE_MAPPING.get(step_num, STAGE_MAPPING[16])
            analysis_jobs[analysis_job_id]["current_step"] = step_num
            analysis_jobs[analysis_job_id]["current_stage"] = stage_info["stage"]
            analysis_jobs[analysis_job_id]["stage_name"] = stage_info["name"]
            analysis_jobs[analysis_job_id]["stage_icon"] = stage_info["icon"]
            analysis_jobs[analysis_job_id]["progress"] = int((step_num / 16) * 100)

        # Run workflow
        state, report_file = run_meara_workflow(
            company_name=company_name,
            company_url=company_url,
            deep_research_brief=drb_content,
            deepstack_job_id=deepstack_job_id
        )

        # Mark as completed
        analysis_jobs[analysis_job_id]["status"] = "completed"
        analysis_jobs[analysis_job_id]["current_step"] = 16
        analysis_jobs[analysis_job_id]["current_stage"] = 5
        analysis_jobs[analysis_job_id]["progress"] = 100
        analysis_jobs[analysis_job_id]["report_file"] = str(report_file)
        analysis_jobs[analysis_job_id]["final_report"] = state.final_report
        # Store workflow state for dashboard endpoint
        analysis_jobs[analysis_job_id]["workflow_state"] = state.to_dict()

    except Exception as e:
        analysis_jobs[analysis_job_id]["status"] = "failed"
        analysis_jobs[analysis_job_id]["error"] = str(e)
        print(f"MEARA analysis failed: {e}")
        import traceback
        traceback.print_exc()

@app.get("/api/analysis/status/{analysis_job_id}")
async def get_analysis_status(analysis_job_id: str):
    """Get MEARA analysis status with multi-stage progress"""
    if analysis_job_id not in analysis_jobs:
        raise HTTPException(status_code=404, detail="Analysis job not found")

    job = analysis_jobs[analysis_job_id]
    return {
        "analysis_job_id": analysis_job_id,
        "status": job["status"],
        "company_name": job["company_name"],
        "company_url": job["company_url"],
        "current_step": job.get("current_step", 0),
        "current_stage": job.get("current_stage", 0),
        "stage_name": job.get("stage_name", "Initializing"),
        "stage_icon": job.get("stage_icon", "⏳"),
        "progress": job["progress"],
        "error": job.get("error"),
        "deepstack_job_id": job.get("deepstack_job_id")
    }

@app.get("/api/analysis/report/{analysis_job_id}")
async def get_analysis_report(analysis_job_id: str):
    """Get final MEARA analysis report"""
    if analysis_job_id not in analysis_jobs:
        raise HTTPException(status_code=404, detail="Analysis job not found")

    job = analysis_jobs[analysis_job_id]

    if job["status"] != "completed":
        raise HTTPException(
            status_code=400,
            detail=f"Analysis not complete. Status: {job['status']}"
        )

    return {
        "analysis_job_id": analysis_job_id,
        "company_name": job["company_name"],
        "company_url": job["company_url"],
        "report_markdown": job.get("final_report", ""),
        "report_file": job.get("report_file")
    }

@app.get("/api/analysis/dashboard/{analysis_job_id}")
async def get_analysis_dashboard(analysis_job_id: str):
    """
    Get structured dashboard data for interactive visualization

    Returns JSON structured for the interactive dashboard:
    - Executive summary with top 3-5 recommendations
    - Critical issues requiring immediate attention
    - 9 dimension scores and analysis
    - Root causes and implementation roadmap

    This endpoint transforms the workflow state into dashboard-compatible JSON
    matching the dashboard_schema.json contract.
    """
    if analysis_job_id not in analysis_jobs:
        raise HTTPException(status_code=404, detail="Analysis job not found")

    job = analysis_jobs[analysis_job_id]

    if job["status"] != "completed":
        raise HTTPException(
            status_code=400,
            detail=f"Analysis not complete. Status: {job['status']}"
        )

    # Get workflow state from in-memory storage (preferred)
    workflow_state = job.get("workflow_state")

    # Fallback: Load from file if not in memory
    if not workflow_state:
        report_file_path = job.get("report_file")
        if not report_file_path:
            raise HTTPException(
                status_code=500,
                detail="Analysis state not found"
            )

        # Find corresponding state file
        report_path = Path(report_file_path)
        state_file = report_path.parent / report_path.name.replace("_report.md", "_state.json")

        if not state_file.exists():
            raise HTTPException(
                status_code=500,
                detail="Analysis state file not found"
            )

        # Load workflow state from file
        with open(state_file) as f:
            workflow_state = json.load(f)

    # Transform to dashboard format using the transformer library
    from dashboard_transformer import transform_workflow_state_to_dashboard, validate_dashboard_data
    from datetime import datetime

    try:
        dashboard_data = transform_workflow_state_to_dashboard(
            company_name=job["company_name"],
            company_url=job["company_url"],
            analysis_date=datetime.now().isoformat()[:10],
            analysis_job_id=analysis_job_id,
            workflow_state_dict=workflow_state
        )

        # Validate before returning
        validate_dashboard_data(dashboard_data)

        return dashboard_data

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate dashboard data: {str(e)}"
        )

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
