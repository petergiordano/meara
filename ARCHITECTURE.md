# MEARA Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   VERCEL (Frontend Host)                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Next.js 15 Application                       │  │
│  │                                                            │  │
│  │  • page.tsx                  (Landing page + Phase 1 UI)  │  │
│  │  • results/[id]/page.tsx     (Phase 2 report viewer)      │  │
│  │  • lib/railwayApi.ts         (API client)                 │  │
│  │  • components/               (UI components)              │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API calls
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   RAILWAY (Backend Host)                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                FastAPI Application                        │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐   │  │
│  │  │          main.py (API Router)                      │   │  │
│  │  │  • POST /api/analyze         (Phase 1 start)       │   │  │
│  │  │  • GET  /api/status/{id}     (Phase 1 polling)     │   │  │
│  │  │  • GET  /api/results/{id}    (Phase 1 results)     │   │  │
│  │  │  • POST /api/analyze/full    (Phase 2 start)       │   │  │
│  │  │  • GET  /api/analysis/status (Phase 2 polling)     │   │  │
│  │  │  • GET  /api/analysis/report (Phase 2 results)     │   │  │
│  │  └────────────────────────────────────────────────────┘   │  │
│  │                   │                      │                 │  │
│  │         ┌─────────┘                      └─────────┐       │  │
│  │         ▼                                          ▼       │  │
│  │  ┌──────────────────┐              ┌─────────────────────┐│  │
│  │  │  deepstack.py    │              │ meara_orchestrator  ││  │
│  │  │  (Web Scraper)   │              │ .py (Workflow)      ││  │
│  │  │                  │              │                     ││  │
│  │  │  Uses Playwright │              │  Coordinates 16     ││  │
│  │  │  to crawl site   │              │  OpenAI Assistant   ││  │
│  │  │  and collect:    │              │  steps              ││  │
│  │  │  • Homepage      │              │                     ││  │
│  │  │  • Tech stack    │              └─────────────────────┘│  │
│  │  │  • Content       │                        │            │  │
│  │  └──────────────────┘                        │            │  │
│  └───────────────────────────────────────────────│────────────┘  │
└─────────────────────────────────────────────────│────────────────┘
                                                   │
                                                   │ OpenAI API calls
                                                   ▼
                                    ┌──────────────────────────────┐
                                    │     OpenAI Assistants API     │
                                    │                               │
                                    │  8 specialized assistants:    │
                                    │  • Ground Truth              │
                                    │  • Deep Research Brief       │
                                    │  • Message Clarity           │
                                    │  • Value Proposition         │
                                    │  • Call-to-Action            │
                                    │  • Social Proof              │
                                    │  • Trust & Credibility       │
                                    │  • Lead Capture              │
                                    │  • Objection Handling        │
                                    │  • Recommendations           │
                                    └──────────────────────────────┘
```

## Data Flow: Phase 1 (DeepStack Collection)

**Duration:** 2-3 minutes
**Cost:** ~$0.50
**Purpose:** Fast website data collection

```
1. User enters company name + URL in page.tsx
   │
   ▼
2. Frontend POST /api/analyze → Railway backend
   │
   ▼
3. Backend executes deepstack.py (Playwright browser automation)
   │
   ├─▶ Crawls homepage
   ├─▶ Detects tech stack
   ├─▶ Extracts content
   └─▶ Saves to deepstack_output-{domain}.json
   │
   ▼
4. Frontend polls GET /api/status/{job_id} every 2 seconds
   │
   ▼
5. Backend returns status: "pending" | "completed" | "failed"
   │
   ▼
6. Frontend fetches GET /api/results/{job_id}
   │
   ▼
7. Frontend displays DeepStack JSON results in page.tsx
   │
   └─▶ Shows "Continue to Full Analysis" button
```

## Data Flow: Phase 2 (Full MEARA Analysis)

**Duration:** 10-12 minutes
**Cost:** ~$6.45
**Purpose:** Comprehensive GTM scalability analysis

```
1. User clicks "Continue to Full Analysis" button
   │
   ▼
2. Frontend POST /api/analyze/full → Railway backend
   │  (includes: deepstack_job_id, company_name, company_url, optional files)
   │
   ▼
3. Backend starts meara_orchestrator.py workflow
   │
   ├─▶ Step 1-4:   Ground Truth extraction
   │   │           (OpenAI Assistant analyzes DeepStack data)
   │   │
   ├─▶ Step 5-7:   Deep Research Brief generation
   │   │           (if not uploaded by user)
   │   │
   ├─▶ Step 8-11:  9 Dimension Analysis
   │   │           • Message Clarity
   │   │           • Value Proposition
   │   │           • Call-to-Action
   │   │           • Social Proof
   │   │           • Trust & Credibility
   │   │           • Lead Capture
   │   │           • Objection Handling
   │   │           • Product-Market Fit
   │   │           • Visual Design
   │   │
   ├─▶ Step 12-13: Recommendations synthesis
   │   │
   └─▶ Step 14-16: Final report generation
       │           (Markdown formatted)
   │
   ▼
4. Frontend polls GET /api/analysis/status/{analysis_job_id} every 5 seconds
   │
   ├─▶ Stage 1: Preparing analysis (steps 1-4)
   ├─▶ Stage 2: Collecting evidence (steps 5-7)
   ├─▶ Stage 3: Evaluating dimensions (steps 8-11)
   ├─▶ Stage 4: Building recommendations (steps 12-13)
   └─▶ Stage 5: Finalizing report (steps 14-16)
   │
   ▼
5. Backend returns status + current_stage + current_step
   │
   ▼
6. When completed, frontend navigates to /results/[analysis_job_id]
   │
   ▼
7. ReportViewer.tsx fetches GET /api/analysis/report/{analysis_job_id}
   │
   ▼
8. Frontend displays markdown report with:
   │  • Executive summary
   │  • 9 dimension scores (1-10)
   │  • Detailed analysis
   │  • Actionable recommendations
   └─▶ User can download as MD or PDF
```

## Key Components

### Frontend (Next.js on Vercel)

| File | Purpose | Phase |
|------|---------|-------|
| `app/page.tsx` | Landing page + DeepStack results display | 1 |
| `app/results/[id]/page.tsx` | Full analysis report viewer | 2 |
| `lib/railwayApi.ts` | HTTP client for Railway API | Both |
| `components/ContinueAnalysisButton.tsx` | Triggers Phase 2 | 1→2 |
| `components/ProgressTracker.tsx` | Shows 5-stage progress | 2 |
| `components/ReportViewer.tsx` | Renders markdown report | 2 |
| `components/DownloadButton.tsx` | Export MD/PDF | 2 |

### Backend (FastAPI on Railway)

| File | Purpose | Phase |
|------|---------|-------|
| `main.py` | FastAPI router + job orchestration | Both |
| `deepstack.py` | Playwright web scraper | 1 |
| `meara_orchestrator.py` | OpenAI Assistants workflow coordinator | 2 |

### External Services

| Service | Purpose | When Used |
|---------|---------|-----------|
| **Vercel** | Hosts Next.js frontend | Always (user-facing) |
| **Railway** | Hosts FastAPI backend | Always (API server) |
| **OpenAI Assistants API** | Runs 16-step analysis workflow | Phase 2 only |
| **Playwright** | Browser automation for scraping | Phase 1 only |

## State Management

### Phase 1: In-Memory Job Storage
```python
# main.py
deepstack_jobs = {}  # job_id → {status, output_file, error}
```

### Phase 2: In-Memory Analysis Storage
```python
# main.py
analysis_jobs = {}  # analysis_job_id → {status, current_step, report_path, error}
```

**Note:** Jobs are NOT persistent. Railway restarts clear all job data.

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_RAILWAY_API=https://meara-production.up.railway.app
```

### Backend (Railway dashboard)
```
OPENAI_API_KEY=sk-proj-...
PORT=8000
```

## File System Layout

```
deploy/railway_backend/
├── output/                          # DeepStack JSON outputs
│   └── deepstack_output-*.json
├── context_inputs/{company_name}/   # User-uploaded files
│   ├── drb_{company_name}.txt       # Deep Research Brief
│   └── context_*.pdf                # Additional context
├── analysis_results/                # MEARA markdown reports
│   └── meara_report_*.md
└── assistant_docs/                  # OpenAI Assistant knowledge base
    └── meara_doc_modules_v6/
```

## Error Handling

### Phase 1 Errors
- Playwright timeout → DeepStack job marked "failed"
- Invalid URL → Validation error returned immediately
- Network errors → Job marked "failed" with error message

### Phase 2 Errors
- OpenAI API errors → Analysis marked "failed", step logged
- Missing DeepStack data → Validation error before starting
- Timeout (rare) → Analysis marked "failed" at current step

## Performance Characteristics

| Metric | Phase 1 (DeepStack) | Phase 2 (MEARA) |
|--------|---------------------|-----------------|
| **Duration** | 2-3 minutes | 10-12 minutes |
| **Cost** | ~$0.50 | ~$6.45 |
| **API Calls** | 1 (to backend) | 16+ (to OpenAI) |
| **Network** | Heavy (scraping) | Light (API only) |
| **CPU** | High (Playwright) | Low (orchestration) |

## Deployment Workflow

```
1. Developer pushes to GitHub main branch
   │
   ├─▶ Vercel detects push
   │   ├─▶ Builds Next.js app (Turbopack)
   │   ├─▶ Runs TypeScript checks
   │   ├─▶ Runs Jest tests
   │   └─▶ Deploys to meara-app.vercel.app
   │
   └─▶ Railway detects push
       ├─▶ Builds Docker image (Nixpacks)
       ├─▶ Installs Python dependencies
       ├─▶ Installs Playwright browsers
       └─▶ Deploys to meara-production.up.railway.app
```

## Security Notes

- **No authentication** - Scale team only (add before public launch)
- **CORS** - Currently set to `["*"]` to support all Vercel deployment URLs
- **Rate limiting** - Not implemented (add before public launch)
- **File uploads** - No virus scanning (add before public launch)

## Known Limitations

1. **Non-persistent storage** - Railway restarts clear all job data
2. **No database** - Planned for EPIC_003 (Analysis Library)
3. **Single-user design** - No multi-tenancy support
4. **No retry logic** - Failed jobs must be restarted manually
5. **No job cleanup** - Old job data accumulates in memory

## Future Architecture (Planned)

- Add PostgreSQL for persistent storage (EPIC_003)
- Add Redis for job queuing (EPIC_003)
- Add authentication/authorization (EPIC_003)
- Add rate limiting (EPIC_003)
- Split backend into microservices (EPIC_004)
