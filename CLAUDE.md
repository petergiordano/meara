# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MEARA (Marketing Effectiveness Analysis Reporting Agent) is an AI-powered marketing analysis platform for Scale Venture Partners. It analyzes B2B SaaS company websites to generate comprehensive marketing effectiveness reports.

**Architecture:** Two-service deployment
- **Frontend:** Next.js 15 (Turbopack) on Vercel
- **Backend:** FastAPI + OpenAI Assistants on Railway

## Development Commands

### Frontend (Next.js on Vercel)
```bash
cd deploy/vercel_frontend

# Development
npm run dev          # Start dev server with Turbopack (localhost:3000)

# Testing
npm test             # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Production
npm run build        # Build for production with Turbopack
npm start            # Start production server
```

### Backend (FastAPI on Railway)
```bash
cd deploy/railway_backend

# Activate virtual environment
source venv/bin/activate

# Development
python3 main.py      # Start FastAPI server (localhost:8000)

# The backend runs DeepStack analysis and MEARA workflow orchestration
```

### Running Both Services Locally
```bash
# Terminal 1: Backend
cd deploy/railway_backend && source venv/bin/activate && python3 main.py

# Terminal 2: Frontend
cd deploy/vercel_frontend && npm run dev
```

## Architecture & Data Flow

### Two-Phase Analysis Workflow

**Phase 1: DeepStack Collection (2-3 minutes)**
1. User submits company name + URL → Frontend (`page.tsx`)
2. POST `/api/analyze` → Backend (`main.py`)
3. Backend runs `deepstack.py` (Playwright-based web scraper)
4. Returns DeepStack JSON with website metadata, tech stack, content
5. Frontend displays results + "Continue to Full Analysis" button

**Phase 2: Full MEARA Analysis (10-12 minutes)**
1. User clicks "Continue" → `ContinueAnalysisButton.tsx`
2. POST `/api/analyze/full` → Backend orchestrator
3. Backend runs 16-step OpenAI Assistant workflow (`meara_orchestrator.py`)
   - Ground Truth extraction
   - Deep Research Brief generation (if not uploaded)
   - 9 dimension analysis (Message Clarity, Value Prop, CTA, Social Proof, etc.)
   - Recommendations synthesis
4. Returns markdown report
5. Frontend navigates to `/results/[analysisJobId]` → `ReportViewer.tsx`

### Key Backend Endpoints

| Endpoint | Purpose | Phase |
|----------|---------|-------|
| `POST /api/analyze` | Start DeepStack analysis | 1 |
| `GET /api/status/{job_id}` | Poll DeepStack progress | 1 |
| `GET /api/results/{job_id}` | Get DeepStack JSON | 1 |
| `POST /api/analyze/full` | Start MEARA analysis | 2 |
| `GET /api/analysis/status/{analysis_job_id}` | Poll MEARA progress (5 stages) | 2 |
| `GET /api/analysis/report/{analysis_job_id}` | Get final markdown report | 2 |

### Project Structure

```
meara/
├── deploy/
│   ├── vercel_frontend/          # Next.js 15 app
│   │   ├── app/
│   │   │   ├── page.tsx          # Main analysis form + DeepStack results
│   │   │   └── results/[id]/
│   │   │       └── page.tsx      # Full MEARA report viewer
│   │   ├── components/
│   │   │   ├── ContinueAnalysisButton.tsx  # Triggers Phase 2
│   │   │   ├── ProgressTracker.tsx         # 5-stage progress UI
│   │   │   ├── ReportViewer.tsx            # Markdown report display
│   │   │   └── DownloadButton.tsx          # Export MD/PDF
│   │   └── lib/
│   │       └── railwayApi.ts     # API client for Railway backend
│   │
│   └── railway_backend/          # FastAPI service
│       ├── main.py               # API routes + job orchestration
│       ├── deepstack.py          # Playwright web scraper
│       └── meara_orchestrator.py # OpenAI Assistants workflow
│
├── docs/PRD/                     # Product requirements & specs
│   ├── MASTER_ROADMAP.md         # **SOURCE OF TRUTH for project state**
│   ├── EPIC_001-.../             # Progressive Analysis Platform
│   ├── EPIC_002-.../             # Interactive Dashboard (planned)
│   ├── EPIC_003-.../             # Analysis Library (planned)
│   └── EPIC_004-.../             # Fast-Track MEARA (planned)
│
└── docs/spec-driven/             # Development methodology
    ├── _spec-driven.md           # Spec-driven development manifesto
    └── SLC-Framework_*.md        # Simple, Lovable, Complete philosophy
│
└── memory/
    └── constitution.md           # 12 articles of development principles
```

## Constitutional Development Principles

**This project follows a constitution-based development model.** Before implementing any feature, review:

1. **`memory/constitution.md`** - 12 immutable development articles
2. **`docs/PRD/MASTER_ROADMAP.md`** - Current Epic/Phase/Sprint status

### Key Constitutional Requirements

**Article I: Library-First Principle**
- Every feature MUST begin as a standalone library
- No feature implemented directly in application code
- Exception requires documented justification

**Article III: Test-First Imperative (NON-NEGOTIABLE)**
- Write tests BEFORE implementation
- Get tests approved by user
- Confirm tests FAIL (Red phase) before writing code
- **TDD cycle:** Red → Green → Refactor

**Article VII & VIII: Simplicity & Anti-Abstraction**
- Maximum 3 projects for initial implementation
- Use framework features directly (no unnecessary wrappers)
- Question every abstraction
- No future-proofing

**Article IX: Integration-First Testing**
- Prefer real databases over mocks
- Use actual service instances over stubs
- Contract tests mandatory before implementation

## Spec-Driven Development Workflow

**ALWAYS check `docs/PRD/MASTER_ROADMAP.md` before starting work.**

### Workflow Steps

1. **Read MASTER_ROADMAP.md** - Identify current Epic and Phase
2. **Review Epic Specs** - Read PRD, DESIGN_SPEC, FUNCTIONAL_SPEC, TECHNICAL_SPEC
3. **Verify Constitutional Compliance** - Check Articles I, III, VII, VIII, IX
4. **Write Tests First** - Get approval, confirm tests fail
5. **Implement** - Write minimal code to pass tests
6. **Refactor** - Improve while keeping tests green
7. **Update Docs** - Keep MASTER_ROADMAP.md in sync

### Never Do This
- ❌ Skip reading specs before implementing
- ❌ Implement without tests
- ❌ Violate constitutional principles without documented justification
- ❌ Guess at requirements (use `[NEEDS CLARIFICATION]` markers)
- ❌ Add features not in current Epic scope

### Always Do This
- ✅ Check MASTER_ROADMAP.md before starting work
- ✅ Follow library-first principle
- ✅ Write CLI interfaces for libraries
- ✅ Use integration tests over mocks
- ✅ Maintain simplicity (max 3 projects)

## SLC Framework (Simple, Lovable, Complete)

All features must satisfy:

**Simple:** Focus on core value proposition, ruthless prioritization, intuitive UX
**Lovable:** Delightful touches, solve real pain, gather feedback
**Complete:** Fulfill promise, no embarrassing releases, standalone value

## Context & Additional Notes

### Scale VP Branding
- Uses Scale Venture Partners logo and colors
- Primary: `#224f41` (dark green), `#0d71a9` (blue)
- Accent: `#e5a819` (gold), `#7da399` (sage green)
- Fonts: Work Sans (headings), Outfit (body)

### DeepStack vs MEARA
- **DeepStack:** Fast (2-3 min), cheap (~$0.50), collects website data
- **MEARA:** Comprehensive (10-12 min), expensive (~$6.45), generates strategic analysis

### File Upload Support
- Deep Research Brief (DRB): Optional upload in Phase 1
- Additional Context Files: Optional upload in Phase 2 (investor memos, pitch decks)
- Both stored in `context_inputs/{company_name}/`

### Current Development Status
- **✅ Complete:** EPIC_001 Phase 1 (Full analysis workflow + markdown export)
- **⏳ Planned:** EPIC_002 (Interactive dashboard), EPIC_003 (Analysis library), EPIC_004 (Fast-track mode)

## Testing Strategy

### Frontend Tests (Jest + React Testing Library)
```bash
cd deploy/vercel_frontend
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # Coverage report
```

### Backend Tests
- Backend currently has no formal test suite
- Manual testing via Postman/curl
- Integration testing through frontend

## Deployment

**Frontend:** Vercel (automatic from `main` branch)
- Production: `https://meara-app.vercel.app`
- Environment variable: `NEXT_PUBLIC_RAILWAY_API`

**Backend:** Railway (automatic from `main` branch)
- Production: `https://meara-production.up.railway.app`
- Requires: OpenAI API key, Playwright browser binaries

## Important Implementation Details

### API Client Pattern
The frontend uses `lib/railwayApi.ts` for all backend communication. Always use these functions instead of raw fetch:
- `startFullAnalysis()` - Handles FormData multipart uploads
- `getAnalysisStatus()` - Polls with 5-second timeout
- `getAnalysisReport()` - Fetches final markdown with 10-second timeout

### Progress Tracking
Backend maps 16 workflow steps → 5 user-facing stages (see `STAGE_MAPPING` in `main.py`):
1. Preparing analysis (steps 1-4)
2. Collecting evidence (steps 5-7)
3. Evaluating dimensions (steps 8-11)
4. Building recommendations (steps 12-13)
5. Finalizing report (steps 14-16)

### File Naming Conventions
- DeepStack output: `deepstack_output-{domain}.json`
- MEARA report: `meara_report_{company_name}_{timestamp}.md`
- Context files: `context_{filename}` in `context_inputs/{company_name}/`

### Known Limitations
- Backend uses in-memory job storage (not persistent across restarts)
- No authentication/authorization (Scale team only)
- No database (planned for EPIC_003)
- No rate limiting (add before public launch)
