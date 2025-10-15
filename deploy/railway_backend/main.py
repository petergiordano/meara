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
    allow_origins=["*"],  # Allow all origins (Vercel generates unique URLs per deployment)
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

        print(f"[DeepStack] Starting analysis for {url}")
        print(f"[DeepStack] Python: {sys.executable}")
        print(f"[DeepStack] Script: {deepstack_script}")

        result = subprocess.run(
            [sys.executable, str(deepstack_script), "-u", url],
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout
        )

        print(f"[DeepStack] Return code: {result.returncode}")
        if result.stdout:
            print(f"[DeepStack] STDOUT: {result.stdout[:500]}")  # First 500 chars
        if result.stderr:
            print(f"[DeepStack] STDERR: {result.stderr[:500]}")  # First 500 chars

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
    additional_context_files: List[UploadFile] = File(default=[])
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

@app.get("/api/analysis/dashboard/test-ggwp")
async def get_test_dashboard():
    """
    Test endpoint serving mock GGWP dashboard data

    Use this to preview the dashboard without running a full analysis:
    http://localhost:3000/results/test-ggwp/dashboard

    Returns pre-built GGWP dashboard data for testing and demo purposes
    """
    mock_data_path = Path("test_mock_dashboard_data.json")

    if not mock_data_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Mock data file not found. Run from railway_backend directory."
        )

    with open(mock_data_path) as f:
        return json.load(f)

# ============================================================================
# GTM INVESTMENT DASHBOARD ENDPOINTS (Sprint L2)
# ============================================================================

@app.get("/api/gtm/dashboard/{company_id}")
async def get_gtm_dashboard(company_id: str):
    """
    Get GTM Investment Dashboard data for Scale VP investment partners

    Sprint L2 endpoint for pre-investment GTM scalability assessment.
    Returns MEA_CONFIG data transformed for frontend rendering.

    Args:
        company_id: Company identifier (e.g., "comp_ai_solutions_inc")

    Returns:
        Transformed GTM dashboard data with:
        - Executive Thesis (GTM score, ARR composition, ACV expansion)
        - Core Tension (asset/liability, influence map)
        - Strategic Pivot (competitive positioning)
        - GTM Evolution (3-phase roadmap)
        - Action Plan (Gantt chart with milestones)
        - Risk Matrix (3x3 heatmap)

    Example:
        GET /api/gtm/dashboard/comp_ai_solutions_inc
    """
    # Load MEA_CONFIG from sample data
    # In production, this would query a database
    sample_data_dir = Path("sample_data")

    # Map company_id to filename
    company_file_map = {
        "comp_ai_solutions_inc": "ai-solutions_inc_mea_config.json"
    }

    if company_id not in company_file_map:
        raise HTTPException(
            status_code=404,
            detail=f"Company not found: {company_id}. Available: {list(company_file_map.keys())}"
        )

    config_file = sample_data_dir / company_file_map[company_id]

    if not config_file.exists():
        raise HTTPException(
            status_code=500,
            detail=f"Configuration file not found: {config_file}"
        )

    # Load MEA_CONFIG
    try:
        with open(config_file) as f:
            mea_config = json.load(f)
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Invalid JSON in config file: {e}"
        )

    # Transform using library
    from gtm_dashboard_transformer import transform_mea_config

    try:
        transformed_data = transform_mea_config(mea_config)
        return transformed_data
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Transformation failed: {str(e)}"
        )


@app.get("/api/analysis/dashboard/{analysis_job_id}")
async def get_analysis_dashboard(analysis_job_id: str):
    """
    Get structured dashboard data for interactive visualization (Sprint L1)

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

# ============================================================================
# GTM SCALABILITY BRIEFING ENDPOINTS (Dashboard Overhaul)
# ============================================================================

@app.get("/api/gtm/briefing/{company_id}")
async def get_gtm_briefing(company_id: str):
    """
    Get GTM Scalability Briefing data for narrative report view

    Returns JSON matching the gtm_scalability_briefing_v2.html prototype schema.
    This is a narrative-focused view with:
    - GTM Maturity Model (AD-HOC → REPEATABLE → SCALABLE → OPTIMIZED)
    - Core Narrative
    - Foundation vs Bottlenecks
    - Strategic Pillars (expandable)
    - Execution Roadmap (3 phases)

    Args:
        company_id: Company identifier or analysis_job_id

    Returns:
        Briefing data matching GtmScalabilityBriefingData schema

    Example:
        GET /api/gtm/briefing/ggwp
        GET /api/gtm/briefing/test-ggwp  # Returns GGWP example data
        GET /api/gtm/briefing/{analysis_job_id}  # Returns briefing for completed analysis
    """
    # Check if this is an analysis_job_id from a completed MEARA analysis
    if company_id in analysis_jobs:
        job = analysis_jobs[company_id]
        if job["status"] == "completed":
            # Use actual company name from the analysis
            actual_company_name = job.get("company_name", "Company")
        else:
            # Fall through to template data
            actual_company_name = "Company"
    elif company_id == "test-ggwp" or company_id == "ggwp":
        actual_company_name = "GGWP"
    else:
        # Generic company name for any other ID
        actual_company_name = "Company"

    # Return template briefing data (generic enough to work for any company)
    # TODO: In future, parse MEARA report to extract actual data
    from datetime import datetime
    current_date = datetime.now().strftime("%B %d, %Y")

    return {
            "companyName": actual_company_name,
            "reportDate": current_date,
            "preparedBy": "Scale VP GTM Platform Team",
            "strategicVerdict": {
                "maturityStage": "REPEATABLE",
                "maturityDescriptor": "Success is driven by heroic, founder-led efforts but lacks the systems for predictable, scalable growth.",
                "coreNarrative": [
                    "GGWP has achieved impressive early traction by leveraging two world-class, but fundamentally unscalable, assets: a technically excellent product that solves an acute pain point and the unparalleled industry credibility of its founding team. This is the story of a company that has perfected the art of building a great product and leveraging a powerful network to land foundational accounts.",
                    "However, the very strengths that have propelled GGWP to this point are now its primary bottlenecks to scalable growth. The company's go-to-market (GTM) engine is a pristine, impeccably crafted \"digital Savile Row suit with no pockets\"—a perfect exterior with no infrastructure to capture, measure, or optimize a sales funnel. The next phase of growth requires a deliberate architectural shift to a predictable, data-driven, and scalable revenue engine."
                ]
            },
            "coreAnalysis": {
                "foundation": [
                    {
                        "title": "Technically Excellent Product",
                        "description": "Solves an acute, validated pain point with a best-in-class solution that customers love."
                    },
                    {
                        "title": "The \"Thresh Moat\"",
                        "description": "Unparalleled founder credibility (CEO Dennis Fong) that has secured marquee logos like Meta, Netflix, and Krafton."
                    },
                    {
                        "title": "Proven Market Fit",
                        "description": "Achieved an estimated $6M+ ARR with remarkable capital efficiency, proving strong demand."
                    }
                ],
                "bottlenecks": [
                    {
                        "title": "Un-instrumented GTM Engine",
                        "description": "Critically constrains lead generation and prevents the creation of a predictable sales funnel."
                    },
                    {
                        "title": "Single, High-Friction Conversion Path",
                        "description": "Alienates the majority of prospects who are not yet ready for a sales conversation, limiting pipeline."
                    },
                    {
                        "title": "Positioned as a Cost Center",
                        "description": "The \"moderation\" narrative limits deal size and confines sales to under-resourced Trust & Safety budgets."
                    }
                ]
            },
            "pillars": [
                {
                    "title": "The \"Thresh Moat\" is a powerful but unscalable foundation",
                    "points": [
                        "GGWP's early success is a direct result of founder-led sales, leveraging CEO Dennis \"Thresh\" Fong's legendary status and deep industry network to bypass traditional GTM friction.",
                        "This reliance on a founder's network is the definition of an unscalable growth model. The critical challenge is to transfer the trust embodied in the founder's personal brand to the GGWP corporate brand through scalable channels."
                    ]
                },
                {
                    "title": "The website is a digital brochure, not a conversion engine",
                    "points": [
                        "The company's website demonstrates best-in-class on-page SEO and design but completely lacks the foundational tools of a modern marketing engine for measurement and optimization.",
                        "The buyer's journey is a dead end. The only conversion path is a high-friction \"Talk to an Expert\" CTA, with no low-friction options like newsletters or content downloads. This is a critical architectural flaw that throttles lead generation."
                    ]
                },
                {
                    "title": "The category must be redefined from cost center to revenue driver",
                    "points": [
                        "GGWP's most powerful strategic lever is to redefine its category from \"Trust & Safety\" to \"Community Intelligence.\" Selling moderation is a cost-center sale; selling insights that reduce churn and improve product is a high-ROI, revenue-centric sale.",
                        "The \"Pulse\" sentiment analysis product is the key to this pivot. It transforms player chat from a liability to be managed into an asset to be mined for business intelligence, increasing player retention and LTV."
                    ]
                },
                {
                    "title": "The path to a predictable revenue engine must be built",
                    "points": [
                        "The immediate priority is to instrument the entire digital funnel with a marketing automation stack, conversion goals, and multiple engagement paths.",
                        "A dual-pronged GTM motion offers the clearest path to scale: a bottoms-up \"Land\" motion for the core product, and a top-down, high-ACV enterprise sale of the \"Pulse\" intelligence platform."
                    ]
                }
            ],
            "roadmap": [
                {
                    "phase": "Phase 1: Foundation (Weeks 1-6)",
                    "color": "blue",
                    "tasks": [
                        {
                            "icon": "⚡️",
                            "title": "Instrument the Funnel",
                            "description": "Deploy a tag manager, marketing automation platform, and conversion tracking pixels immediately."
                        },
                        {
                            "icon": "⚡️",
                            "title": "Launch Low-Friction Offer",
                            "description": "Create a data-driven report on player churn and feature it on the homepage with a lead capture form."
                        },
                        {
                            "icon": "⚡️",
                            "title": "Reposition the Narrative",
                            "description": "Revise the sales deck and discovery script to lead with the \"Community Intelligence\" value proposition."
                        }
                    ]
                },
                {
                    "phase": "Phase 2: Funnel Construction (Weeks 7-12)",
                    "color": "indigo",
                    "tasks": [
                        {
                            "icon": "🏛️",
                            "title": "Build Content for the Buyer's Journey",
                            "description": "Develop webinars, guides, and ROI calculators for each stage of the funnel."
                        },
                        {
                            "icon": "🏛️",
                            "title": "Systematize the \"Thresh Moat\"",
                            "description": "Launch a consistent founder-led content series to build a scalable brand asset."
                        },
                        {
                            "icon": "🏛️",
                            "title": "Launch Defensive Narrative",
                            "description": "Publish content to counter the \"Gaming Safety Coalition\" and highlight the value of an integrated platform."
                        }
                    ]
                },
                {
                    "phase": "Phase 3: Scale the Engine (Months 4-6+)",
                    "color": "purple",
                    "tasks": [
                        {
                            "icon": "🚀",
                            "title": "Launch Category Creation Campaign",
                            "description": "Execute a full campaign to establish and own \"Community Intelligence for Gaming.\""
                        },
                        {
                            "icon": "🚀",
                            "title": "Hire a Head of Marketing",
                            "description": "Bring in a proven marketing leader to build and scale the GTM engine."
                        },
                        {
                            "icon": "🚀",
                            "title": "Optimize and Scale",
                            "description": "Use data from the new funnel to A/B test landing pages and scale investment in proven channels."
                        }
                    ]
                }
            ]
        }

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
