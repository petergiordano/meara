# Technical Specification: Sprint L.1 - Full MEARA Analysis

**Version:** 1.0
**Last Updated:** 2025-10-13
**Status:** ✅ Approved

---

## Executive Summary

**Purpose:** Implement the full MEARA analysis workflow in the Next.js frontend, connecting to the existing Railway backend API to provide users with a seamless, delightful experience from DeepStack completion to final report download.

**Scope:**
- Frontend components in Next.js 15.5.4 app
- API integration with Railway backend (already deployed at `https://meara-production.up.railway.app`)
- Real-time progress tracking via polling
- Markdown report rendering and download functionality
- No backend changes required (all endpoints already exist)

**Timeline:** 1 week implementation + 2 days testing

**Risk Level:** 🟡 Medium (dependent on Railway backend uptime, OpenAI API stability)

---

## Technology Stack

### Frontend

| Technology | Version | Purpose | Rationale | Alternatives Considered |
|------------|---------|---------|-----------|------------------------|
| Next.js | 15.5.4 | React framework | Already in use, App Router ideal for this flow | Remix (more complex migration) |
| React | 18.3.1 | UI framework | Industry standard, team expertise | Vue (team unfamiliar) |
| TypeScript | 5.x | Type safety | Catch errors at compile time, better DX | Flow (less popular) |
| Tailwind CSS | 3.x | Styling | Already configured, rapid development | Styled Components (more boilerplate) |
| react-markdown | 9.0.1 | Markdown rendering | Well-maintained, React-friendly | marked (requires sanitization) |
| file-saver | 2.0.5 | File downloads | Browser-compatible, simple API | Custom blob URLs (more code) |
| jspdf | 2.5.2 | PDF generation | Client-side, no server needed | html2pdf (slower) |

**Framework Selection Criteria:**
- [x] Team expertise available (Peter + Claude Code familiar with Next.js)
- [x] Strong community support (Next.js has excellent docs)
- [x] Long-term viability (Vercel-backed, active development)
- [x] Performance characteristics (React 18 concurrent features)
- [x] Integration with existing stack (already using Next.js 15)

---

### Backend

| Technology | Version | Purpose | Rationale | Alternatives Considered |
|------------|---------|---------|-----------|------------------------|
| FastAPI (Railway) | Existing | Backend API | Already deployed, Python-based | N/A (no changes) |
| OpenAI Assistants API | v1 | 7 AI agents | Already configured, 7 assistants deployed | N/A (no changes) |

**Note:** Sprint L.1 makes NO backend changes. All required endpoints already exist in `deploy/railway_backend/main.py` (lines 291-462).

---

### DevOps & Infrastructure

| Technology | Purpose | Rationale | Cost Estimate |
|------------|---------|-----------|---------------|
| Vercel | Frontend hosting | Zero-config Next.js deployment | $0 (hobby plan sufficient) |
| Railway | Backend hosting | Already deployed, handles long-running tasks | $5/month (current) |
| GitHub | Version control + CI/CD | Native integration with Vercel | $0 (public repo) |

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │             Next.js Frontend (Vercel)                  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  DeepStack Results (existing, completed)        │  │  │
│  │  │  - job_id, company_name, company_url           │  │  │
│  │  └────────────────┬────────────────────────────────┘  │  │
│  │                   │                                     │  │
│  │                   ▼                                     │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  ContinueAnalysisButton                         │  │  │
│  │  │  - Triggers POST /api/analyze/full              │  │  │
│  │  │  - Receives analysis_job_id                     │  │  │
│  │  └────────────────┬────────────────────────────────┘  │  │
│  │                   │                                     │  │
│  │                   ▼                                     │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  ProgressTracker                                │  │  │
│  │  │  - Polls GET /api/analysis/status/{id}          │  │  │
│  │  │  - Every 2s while status="running"              │  │  │
│  │  │  - Displays 5 stages with progress bar          │  │  │
│  │  └────────────────┬────────────────────────────────┘  │  │
│  │                   │                                     │  │
│  │                   ▼ (when completed)                    │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  ReportViewer                                   │  │  │
│  │  │  - Fetches GET /api/analysis/report/{id}       │  │  │
│  │  │  - Renders markdown with react-markdown         │  │  │
│  │  │  - Provides download buttons                    │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────┘
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────┐
│         Railway Backend (meara-production.up.railway.app)    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  POST /api/analyze/full                               │  │
│  │  - Accepts deepstack_job_id                           │  │
│  │  - Creates analysis_job_id                            │  │
│  │  - Runs MEARA workflow async (15 steps, 7 assistants)│  │
│  │  - Returns job ID immediately                         │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  GET /api/analysis/status/{analysis_job_id}          │  │
│  │  - Returns: current_step, current_stage, progress    │  │
│  │  - Updated every ~10s as workflow progresses          │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  GET /api/analysis/report/{analysis_job_id}          │  │
│  │  - Returns: markdown text, metadata                  │  │
│  │  - Only available when status="completed"             │  │
│  └───────────────────────────────────────────────────────┘  │
│                              │                               │
│                              ▼                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  meara_orchestrator.py (existing)                     │  │
│  │  - Runs 15-step workflow with 7 OpenAI Assistants    │  │
│  │  - Updates job status in-memory                       │  │
│  │  - Generates final markdown report                    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Key Architectural Decisions:**

1. **Polling vs WebSockets:** Polling chosen for simplicity
   - Benefits: No persistent connections, easier to debug, works everywhere
   - Trade-offs: Slightly higher latency (max 2s), more requests (but low frequency)

2. **Client-side PDF generation:** Avoid server-side PDF rendering
   - Benefits: Reduces server load, faster (no network round-trip), works offline
   - Trade-offs: Larger bundle size (+~200KB), limited styling control

3. **State Management:** React hooks (no Redux/Zustand)
   - Benefits: Simpler, fewer dependencies, sufficient for this use case
   - Trade-offs: State not shared across pages (acceptable, single-page flow)

---

## Constitution Compliance

### Article I: Library-First Principle

**Status:** ✅ Compliant

**Library Usage:**

| Component/Feature | Library Used | Justification |
|-------------------|--------------|---------------|
| Markdown rendering | react-markdown | Industry standard, well-maintained, React-native |
| File downloads | file-saver | Handles browser quirks, consistent API |
| PDF generation | jspdf | Mature library, client-side capable |
| HTTP requests | fetch API (native) | Built-in, no library needed |

**Rationale for Non-Library Components:**
- Progress tracking: Custom component (no library provides 5-stage mapping)
- Polling logic: Custom hook (simple 10-line implementation)
- Button states: Native React (no library needed)

---

### Article II: CLI Interface Mandate

**Status:** ⚠️ N/A (Web UI Only)

**Rationale:** Sprint L.1 is a web user interface. CLI interfaces not applicable. Core MEARA analysis is CLI-accessible via Python scripts (existing).

---

### Article III: Test-First Imperative

**Status:** ✅ Compliant

**TDD Workflow:**

1. **Write Failing Tests (Red):**
   ```bash
   cd deploy/vercel_frontend
   npm run test:watch
   # Write test for ContinueAnalysisButton, confirm it fails
   ```

2. **User Validation:**
   - Share test scenarios with Peter
   - Confirm tests capture requirements from FUNCTIONAL_SPEC
   - Get explicit approval before implementation

3. **Implement Code (Green):**
   ```bash
   # Write minimum code to pass tests
   npm run test
   # Confirm all tests pass
   ```

4. **Refactor:**
   ```bash
   # Improve code quality, extract reusable hooks
   npm run test
   # Confirm tests still pass after refactoring
   ```

**Test Coverage Enforcement:**
- Minimum coverage: 80% overall
- Critical paths: 100% coverage (polling logic, error handling)
- CI fails if coverage drops below threshold

**Test Structure:**
```
deploy/vercel_frontend/
├── __tests__/
│   ├── components/
│   │   ├── ContinueAnalysisButton.test.tsx
│   │   ├── ProgressTracker.test.tsx
│   │   ├── ReportViewer.test.tsx
│   │   └── DownloadButton.test.tsx
│   ├── hooks/
│   │   └── useAnalysisPolling.test.ts
│   └── integration/
│       └── full-analysis-flow.test.tsx
└── e2e/
    └── full-analysis.spec.ts (Playwright)
```

---

### Article VII: Simplicity Gate

**Project Structure Audit:**

- [x] Using ≤3 projects? **Yes**
  - Current project count: 1 (Next.js app)
  - Justification: N/A (well under limit)

- [x] No future-proofing? **Yes**
  - Speculative features removed: None added. Building exactly what FUNCTIONAL_SPEC defines.

- [x] Avoiding unnecessary features? **Yes**
  - Feature justification: Every feature traces to user story in FUNCTIONAL_SPEC

**Complexity Score:** 3/10 (target: ≤5)

**Complexity Tracking:**

| Feature | Complexity | Justification | Simplification Options |
|---------|-----------|---------------|----------------------|
| Continue Button | 2/10 | Simple API call + state management | N/A (already simple) |
| Progress Tracker | 4/10 | Polling logic + stage mapping | Use library (rejected: none fit) |
| Report Viewer | 2/10 | react-markdown handles complexity | N/A (library-based) |
| Downloads | 3/10 | file-saver + jspdf libraries | N/A (library-based) |

---

### Article VIII: Anti-Abstraction Gate

**Framework Usage Audit:**

- [x] Using framework directly (no unnecessary wrappers)? **Yes**
  - Examples: Direct Next.js `useRouter`, `fetch`, `useState` hooks
  - No custom API abstraction layer (directly call Railway endpoints)
  - No state management abstraction (direct useState, no Redux)

- [x] Single model representation per entity? **Yes**
  - Entities: AnalysisJob (one interface, no DTO/Model/Entity split)
  - Models per entity: 1:1

**Abstraction Violations:**

| Component | Issue | Justification | Remediation Plan |
|-----------|-------|---------------|------------------|
| None | N/A | N/A | N/A |

---

### Article IX: Integration-First Testing

**Contract Testing:**

- [x] Contracts defined before implementation? **Yes**
  - Location: This document (API Contracts section below)

- [x] Using real services in tests? **Yes (with mock server)**
  - Test approach: Mock Railway API responses (MSW - Mock Service Worker)
  - Rationale: Can't rely on Railway backend being available in CI, but contracts match exactly

**Integration Test Coverage:**

| Integration Point | Contract Defined | Contract Tests | Status |
|-------------------|-----------------|----------------|--------|
| POST /api/analyze/full | ✅ | ✅ | Pending |
| GET /api/analysis/status/{id} | ✅ | ✅ | Pending |
| GET /api/analysis/report/{id} | ✅ | ✅ | Pending |

**Test Strategy:**
- Unit tests: Mock Railway API with MSW (Mock Service Worker)
- Contract tests: Verify request/response formats match Railway backend
- E2E tests: Run against deployed Railway backend (manual + staging CI)

---

## API Contracts

### Railway Backend Endpoints

Base URL: `https://meara-production.up.railway.app`

---

#### POST /api/analyze/full

**Purpose:** Start full MEARA analysis with 7 OpenAI Assistants

**Authentication:** None

**Authorization:** None (public endpoint)

**Request:**

```typescript
// Content-Type: multipart/form-data

interface AnalyzeFullRequest {
  deepstack_job_id: string;          // Required: UUID from DeepStack analysis
  additional_context_files?: File[]; // Optional: PDF/TXT/MD files for context
}
```

**Request Example (JavaScript):**

```typescript
const formData = new FormData();
formData.append('deepstack_job_id', '550e8400-e29b-41d4-a716-446655440000');
// Optional: Add context files
formData.append('additional_context_files', pdfFile);

const response = await fetch('https://meara-production.up.railway.app/api/analyze/full', {
  method: 'POST',
  body: formData,
  // Note: Do NOT set Content-Type header (browser sets it automatically with boundary)
});
```

**Response (200 OK):**

```typescript
interface AnalyzeFullResponse {
  analysis_job_id: string;              // UUID for this analysis
  status: 'queued';                     // Initial status
  estimated_time_minutes: number;       // 8 (typical)
  deepstack_job_id: string;             // Echo back for reference
}
```

**Response Example:**

```json
{
  "analysis_job_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "status": "queued",
  "estimated_time_minutes": 8,
  "deepstack_job_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Responses:**

```typescript
// 404 Not Found - DeepStack job doesn't exist
{
  "detail": "DeepStack job not found"
}

// 400 Bad Request - DeepStack job not completed
{
  "detail": "DeepStack analysis not complete. Status: running"
}

// 500 Internal Server Error
{
  "detail": "Internal server error"
}
```

**Rate Limiting:** None

**Validation Rules:**
- `deepstack_job_id`: Must be valid UUID format, must exist in backend jobs store, must have status="completed"

---

#### GET /api/analysis/status/{analysis_job_id}

**Purpose:** Poll analysis progress (call every 2 seconds while running)

**Authentication:** None

**Path Parameters:**
- `analysis_job_id`: UUID of the analysis job

**Response (200 OK - Running):**

```typescript
interface AnalysisStatusResponse {
  analysis_job_id: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  company_name: string;
  company_url: string;
  current_step: number;                 // 1-15 (internal workflow step)
  current_stage: number;                // 1-5 (user-facing stage)
  stage_name: string;                   // e.g., "Collecting evidence"
  stage_icon: string;                   // emoji, e.g., "📊"
  progress: number;                     // 0-100 percentage
  error: string | null;                 // null if no error
  deepstack_job_id: string;
}
```

**Response Example (Running):**

```json
{
  "analysis_job_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "status": "running",
  "company_name": "Example Corp",
  "company_url": "https://example.com",
  "current_step": 7,
  "current_stage": 3,
  "stage_name": "Evaluating dimensions",
  "stage_icon": "📈",
  "progress": 46,
  "error": null,
  "deepstack_job_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response Example (Completed):**

```json
{
  "analysis_job_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "status": "completed",
  "company_name": "Example Corp",
  "company_url": "https://example.com",
  "current_step": 15,
  "current_stage": 5,
  "stage_name": "Finalizing report",
  "stage_icon": "📝",
  "progress": 100,
  "error": null,
  "deepstack_job_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Responses:**

```typescript
// 404 Not Found - Analysis job doesn't exist
{
  "detail": "Analysis job not found"
}
```

**Rate Limiting:** None (but frontend should limit to 1 request per 2 seconds)

---

#### GET /api/analysis/report/{analysis_job_id}

**Purpose:** Fetch final markdown report (only available when status="completed")

**Authentication:** None

**Path Parameters:**
- `analysis_job_id`: UUID of the analysis job

**Response (200 OK):**

```typescript
interface AnalysisReportResponse {
  analysis_job_id: string;
  company_name: string;
  company_url: string;
  report_markdown: string;              // Full markdown text (50-200 KB typical)
  report_file: string;                  // File path (backend reference, not used by frontend)
}
```

**Response Example:**

```json
{
  "analysis_job_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "company_name": "Example Corp",
  "company_url": "https://example.com",
  "report_markdown": "# MEARA Marketing Effectiveness Analysis\n\n## Executive Summary\n\n**Company:** Example Corp...",
  "report_file": "/path/to/file.md"
}
```

**Error Responses:**

```typescript
// 404 Not Found - Analysis job doesn't exist
{
  "detail": "Analysis job not found"
}

// 400 Bad Request - Analysis not complete
{
  "detail": "Analysis not complete. Status: running"
}
```

---

## Component Architecture

### Directory Structure

```
deploy/vercel_frontend/
├── app/
│   ├── page.tsx                          # Main page (existing, contains DeepStack)
│   └── globals.css
├── components/
│   ├── analysis/                         # NEW: Full analysis components
│   │   ├── ContinueAnalysisButton.tsx   # Trigger full analysis
│   │   ├── ProgressTracker.tsx          # Multi-stage progress display
│   │   ├── ReportViewer.tsx             # Markdown report renderer
│   │   └── DownloadButton.tsx           # MD/PDF download
│   └── ui/                               # Existing UI components
│       └── button.tsx
├── hooks/
│   └── useAnalysisPolling.ts            # NEW: Custom polling hook
├── lib/
│   └── api/
│       └── railway.ts                    # NEW: Railway API client
├── types/
│   └── analysis.ts                       # NEW: TypeScript interfaces
└── __tests__/                            # NEW: Test files
    ├── components/
    └── hooks/
```

**Directory Naming Conventions:**
- `kebab-case` for directories
- `PascalCase` for component files
- `camelCase` for utility files
- `SCREAMING_SNAKE_CASE` for constants

---

## Data Models

### TypeScript Types

```typescript
// types/analysis.ts

/**
 * Analysis job status returned from Railway API
 */
export interface AnalysisJob {
  analysis_job_id: string;
  status: AnalysisStatus;
  company_name: string;
  company_url: string;
  current_step: number;        // 1-15
  current_stage: number;       // 1-5
  stage_name: string;
  stage_icon: string;
  progress: number;            // 0-100
  error: string | null;
  deepstack_job_id: string;
}

export type AnalysisStatus = 'queued' | 'running' | 'completed' | 'failed';

/**
 * Report data with markdown content
 */
export interface AnalysisReport {
  analysis_job_id: string;
  company_name: string;
  company_url: string;
  report_markdown: string;
  report_file: string;
}

/**
 * Stage configuration (maps backend steps to frontend stages)
 */
export interface ProgressStage {
  stage: number;               // 1-5
  name: string;                // e.g., "Collecting evidence"
  icon: string;                // emoji, e.g., "📊"
  steps: number[];             // which workflow steps map to this stage
}

/**
 * Component state for full analysis flow
 */
export interface FullAnalysisState {
  // Job tracking
  analysisJobId: string | null;
  status: AnalysisStatus;
  error: string | null;

  // Progress
  currentStep: number;
  currentStage: number;
  stageName: string;
  stageIcon: string;
  progress: number;
  estimatedMinutesRemaining: number;

  // Report
  reportMarkdown: string | null;
  reportLoaded: boolean;

  // UI
  isPolling: boolean;
  pollErrorCount: number;
  showReport: boolean;
  downloadingMD: boolean;
  downloadingPDF: boolean;

  // Metadata
  companyName: string;
  companyUrl: string;
  deepstackJobId: string;
}
```

---

## Component Implementation Details

### 1. ContinueAnalysisButton Component

**File:** `components/analysis/ContinueAnalysisButton.tsx`

**Props:**
```typescript
interface ContinueAnalysisButtonProps {
  deepstackJobId: string;
  companyName: string;
  companyUrl: string;
  onAnalysisStarted: (analysisJobId: string) => void;
  disabled?: boolean;
}
```

**Functionality:**
- Renders button: "Continue to Full Analysis"
- Disabled states: `disabled` prop, or while API call in progress
- On click:
  1. Set button to loading state ("Starting Analysis...")
  2. Call `POST /api/analyze/full` with `deepstack_job_id`
  3. On success: Call `onAnalysisStarted(analysis_job_id)` callback
  4. On error: Show error toast, re-enable button

**State:**
```typescript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

**Test Coverage:**
- [ ] Renders correctly when enabled
- [ ] Disabled when `disabled` prop is true
- [ ] Shows loading state when clicked
- [ ] Calls API with correct payload
- [ ] Invokes callback on success
- [ ] Shows error message on API failure
- [ ] Re-enables button after error

---

### 2. ProgressTracker Component

**File:** `components/analysis/ProgressTracker.tsx`

**Props:**
```typescript
interface ProgressTrackerProps {
  analysisJobId: string;
  onComplete: (reportReady: boolean) => void;
}
```

**Functionality:**
- Displays 5-stage progress indicator with icons
- Polls `GET /api/analysis/status/{id}` every 2 seconds
- Shows progress bar (0-100%)
- Shows estimated time remaining
- Stops polling when status = "completed" or "failed"
- Calls `onComplete()` when analysis finishes

**State:**
```typescript
const {
  status,
  currentStage,
  stageName,
  stageIcon,
  progress,
  estimatedMinutes,
  error,
} = useAnalysisPolling(analysisJobId);
```

**Stages Displayed:**
1. 🔬 Preparing analysis (steps 1-3)
2. 📊 Collecting evidence (steps 4-6)
3. 📈 Evaluating dimensions (steps 7-10)
4. 💡 Building recommendations (steps 11-12)
5. 📝 Finalizing report (steps 13-15)

**Test Coverage:**
- [ ] Renders all 5 stages
- [ ] Highlights current stage
- [ ] Updates progress bar as step increases
- [ ] Shows estimated time remaining
- [ ] Stops polling when complete
- [ ] Calls onComplete callback
- [ ] Handles polling errors gracefully

---

### 3. ReportViewer Component

**File:** `components/analysis/ReportViewer.tsx`

**Props:**
```typescript
interface ReportViewerProps {
  analysisJobId: string;
  companyName: string;
}
```

**Functionality:**
- Fetches report from `GET /api/analysis/report/{id}`
- Renders markdown using `react-markdown`
- Generates table of contents from headings
- Provides download buttons (MD/PDF)

**Libraries Used:**
- `react-markdown`: Markdown rendering
- `remark-gfm`: GitHub Flavored Markdown support
- `rehype-raw`: Allow raw HTML (sanitized)

**State:**
```typescript
const [report, setReport] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

**Test Coverage:**
- [ ] Fetches report on mount
- [ ] Renders markdown with proper formatting
- [ ] Handles headings (H1-H6)
- [ ] Renders lists (ordered, unordered)
- [ ] Renders bold, italic, links
- [ ] Renders tables (if present)
- [ ] Generates table of contents
- [ ] Shows loading skeleton
- [ ] Shows error message on fetch failure

---

### 4. DownloadButton Component

**File:** `components/analysis/DownloadButton.tsx`

**Props:**
```typescript
interface DownloadButtonProps {
  format: 'markdown' | 'pdf';
  reportMarkdown: string;
  companyName: string;
  disabled?: boolean;
}
```

**Functionality:**
- Renders download button for MD or PDF
- For MD: Use `file-saver` to download blob
- For PDF: Convert markdown → HTML → PDF with `jspdf`
- Filename: `MEARA_Report_{company_name}_{date}.{ext}`

**Libraries Used:**
- `file-saver`: Browser-compatible file downloads
- `jspdf`: Client-side PDF generation
- `jspdf-autotable`: Table support in PDF (if needed)

**State:**
```typescript
const [isDownloading, setIsDownloading] = useState(false);
```

**Test Coverage:**
- [ ] Renders button with correct label
- [ ] Disabled when `disabled` prop true
- [ ] Shows loading spinner while generating
- [ ] MD download creates correct blob
- [ ] PDF download generates valid PDF
- [ ] Filenames are correctly formatted
- [ ] Handles download errors gracefully

---

### 5. useAnalysisPolling Hook

**File:** `hooks/useAnalysisPolling.ts`

**Purpose:** Custom hook to poll analysis status every 2 seconds

**Signature:**
```typescript
export function useAnalysisPolling(analysisJobId: string) {
  return {
    status: AnalysisStatus;
    currentStep: number;
    currentStage: number;
    stageName: string;
    stageIcon: string;
    progress: number;
    estimatedMinutes: number;
    error: string | null;
    isPolling: boolean;
  };
}
```

**Implementation:**
```typescript
export function useAnalysisPolling(analysisJobId: string) {
  const [state, setState] = useState<AnalysisJob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollCount = useRef(0);

  useEffect(() => {
    if (!analysisJobId) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `https://meara-production.up.railway.app/api/analysis/status/${analysisJobId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data: AnalysisJob = await response.json();
        setState(data);

        // Stop polling if completed or failed
        if (data.status === 'completed' || data.status === 'failed') {
          clearInterval(pollInterval);
        }

        pollCount.current = 0; // Reset error count on success
      } catch (err) {
        pollCount.current += 1;

        // Stop after 3 consecutive failures
        if (pollCount.current >= 3) {
          setError('Unable to fetch progress. Please refresh.');
          clearInterval(pollInterval);
        }
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(pollInterval);
  }, [analysisJobId]);

  return {
    status: state?.status ?? 'queued',
    currentStep: state?.current_step ?? 0,
    currentStage: state?.current_stage ?? 0,
    stageName: state?.stage_name ?? 'Initializing...',
    stageIcon: state?.stage_icon ?? '⏳',
    progress: state?.progress ?? 0,
    estimatedMinutes: Math.ceil((8 * 60) * (1 - (state?.progress ?? 0) / 100) / 60),
    error,
    isPolling: state?.status === 'running',
  };
}
```

**Test Coverage:**
- [ ] Starts polling on mount
- [ ] Polls every 2 seconds
- [ ] Updates state on successful poll
- [ ] Stops polling when status = "completed"
- [ ] Stops polling when status = "failed"
- [ ] Handles 3 consecutive errors
- [ ] Cleans up interval on unmount

---

## Testing Strategy

### Unit Tests (Jest + React Testing Library)

**Test Files:**
```
__tests__/
├── components/
│   ├── ContinueAnalysisButton.test.tsx
│   ├── ProgressTracker.test.tsx
│   ├── ReportViewer.test.tsx
│   └── DownloadButton.test.tsx
└── hooks/
    └── useAnalysisPolling.test.ts
```

**Example Test (ContinueAnalysisButton):**
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContinueAnalysisButton } from '@/components/analysis/ContinueAnalysisButton';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';

describe('ContinueAnalysisButton', () => {
  it('calls API and invokes callback on success', async () => {
    const onAnalysisStarted = jest.fn();

    render(
      <ContinueAnalysisButton
        deepstackJobId="test-job-id"
        companyName="Test Corp"
        companyUrl="https://test.com"
        onAnalysisStarted={onAnalysisStarted}
      />
    );

    const button = screen.getByText('Continue to Full Analysis');
    fireEvent.click(button);

    // Button shows loading state
    expect(screen.getByText('Starting Analysis...')).toBeInTheDocument();

    await waitFor(() => {
      expect(onAnalysisStarted).toHaveBeenCalledWith(expect.any(String));
    });
  });

  it('shows error message on API failure', async () => {
    server.use(
      http.post('*/api/analyze/full', () => {
        return HttpResponse.json({ detail: 'Job not found' }, { status: 404 });
      })
    );

    render(
      <ContinueAnalysisButton
        deepstackJobId="invalid-id"
        companyName="Test Corp"
        companyUrl="https://test.com"
        onAnalysisStarted={jest.fn()}
      />
    );

    const button = screen.getByText('Continue to Full Analysis');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Job not found/)).toBeInTheDocument();
    });
  });
});
```

---

### Integration Tests (Mock Service Worker)

**Setup MSW (Mock Service Worker):**
```typescript
// mocks/handlers.ts

import { http, HttpResponse } from 'msw';

export const handlers = [
  // POST /api/analyze/full
  http.post('https://meara-production.up.railway.app/api/analyze/full', async ({ request }) => {
    const formData = await request.formData();
    const jobId = formData.get('deepstack_job_id');

    if (!jobId) {
      return HttpResponse.json({ detail: 'Missing job ID' }, { status: 400 });
    }

    return HttpResponse.json({
      analysis_job_id: 'mock-analysis-id',
      status: 'queued',
      estimated_time_minutes: 8,
      deepstack_job_id: jobId,
    });
  }),

  // GET /api/analysis/status/:id
  http.get('https://meara-production.up.railway.app/api/analysis/status/:id', ({ params }) => {
    return HttpResponse.json({
      analysis_job_id: params.id,
      status: 'running',
      company_name: 'Test Corp',
      company_url: 'https://test.com',
      current_step: 5,
      current_stage: 2,
      stage_name: 'Collecting evidence',
      stage_icon: '📊',
      progress: 33,
      error: null,
      deepstack_job_id: 'mock-deepstack-id',
    });
  }),

  // GET /api/analysis/report/:id
  http.get('https://meara-production.up.railway.app/api/analysis/report/:id', ({ params }) => {
    return HttpResponse.json({
      analysis_job_id: params.id,
      company_name: 'Test Corp',
      company_url: 'https://test.com',
      report_markdown: '# MEARA Report\n\n## Executive Summary\n\nTest report content...',
      report_file: '/path/to/file.md',
    });
  }),
];
```

---

### E2E Tests (Playwright)

**Test File:** `e2e/full-analysis.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Full MEARA Analysis Flow', () => {
  test('should complete full analysis from DeepStack to report download', async ({ page }) => {
    // 1. Start with completed DeepStack analysis
    await page.goto('/');

    // Wait for DeepStack to complete (or navigate to pre-completed state)
    await expect(page.getByText('Analysis complete!')).toBeVisible({ timeout: 180000 });

    // 2. Click "Continue to Full Analysis"
    const continueButton = page.getByText('Continue to Full Analysis');
    await expect(continueButton).toBeVisible();
    await continueButton.click();

    // 3. Verify progress tracker appears
    await expect(page.getByText('Preparing analysis')).toBeVisible();
    await expect(page.getByRole('progressbar')).toBeVisible();

    // 4. Wait for progress to advance through stages
    await expect(page.getByText('Collecting evidence')).toBeVisible({ timeout: 120000 });
    await expect(page.getByText('Evaluating dimensions')).toBeVisible({ timeout: 180000 });

    // 5. Wait for completion (up to 10 minutes)
    await expect(page.getByText('Finalizing report')).toBeVisible({ timeout: 300000 });
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100', { timeout: 60000 });

    // 6. Verify report loads
    await expect(page.getByRole('heading', { name: /MEARA.*Analysis/ })).toBeVisible();

    // 7. Test markdown download
    const downloadMD = page.getByText('Download Markdown');
    await expect(downloadMD).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await downloadMD.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/MEARA_Report_.*\.md/);

    // 8. Test PDF download
    const downloadPDF = page.getByText('Download PDF');
    await expect(downloadPDF).toBeVisible();

    const downloadPromise2 = page.waitForEvent('download');
    await downloadPDF.click();
    const download2 = await downloadPromise2;
    expect(download2.suggestedFilename()).toMatch(/MEARA_Report_.*\.pdf/);
  });

  test('should resume progress after page refresh', async ({ page }) => {
    // Start analysis
    await page.goto('/');
    await page.getByText('Continue to Full Analysis').click();

    // Wait for progress to start
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', /[1-9]/);

    // Refresh page
    await page.reload();

    // Verify progress resumes
    await expect(page.getByRole('progressbar')).toBeVisible();
    await expect(page.getByText(/Collecting|Evaluating|Building|Finalizing/)).toBeVisible();
  });
});
```

---

## Deployment & Rollout

### Deployment Checklist

- [ ] All tests passing (unit, integration, e2e)
- [ ] TypeScript compiles without errors
- [ ] No console errors or warnings
- [ ] Railway backend accessible from Vercel
- [ ] CORS configured correctly on Railway
- [ ] Environment variables set (if any)
- [ ] Monitoring configured (Vercel Analytics)

### Deployment Process

**Step 1: Deploy to Preview (Staging)**
```bash
cd deploy/vercel_frontend
git checkout -b feature/sprint-l1-full-analysis
# (implement features)
git add .
git commit -m "feat(analysis): implement Sprint L.1 full analysis workflow"
git push origin feature/sprint-l1-full-analysis
```

Vercel automatically deploys preview at: `https://meara-app-{hash}.vercel.app`

**Step 2: Test on Preview**
- [ ] Manual testing: Complete full user journey
- [ ] Check Railway backend connectivity
- [ ] Test all error scenarios
- [ ] Test on mobile browsers

**Step 3: Merge to Main (Production)**
```bash
# After review approval
git checkout master
git merge feature/sprint-l1-full-analysis
git push origin master
```

Vercel automatically deploys to production: `https://meara-app.vercel.app`

**Step 4: Post-Deployment Monitoring**
- [ ] Monitor error rate in Vercel Analytics (target: <2%)
- [ ] Monitor Railway backend logs for increased load
- [ ] Track user completion rate (target: >80%)
- [ ] Gather user feedback via support channels

---

## Acceptance Criteria

### Technical Acceptance

- [ ] All tests pass (unit, integration, e2e)
- [ ] Code coverage ≥ 80%
- [ ] TypeScript strict mode enabled, no `any` types
- [ ] No console errors or warnings
- [ ] Lighthouse score > 90 (Performance, Accessibility, Best Practices)
- [ ] Works in latest Chrome, Firefox, Safari, Edge
- [ ] Mobile responsive (tested on iOS Safari, Chrome Android)

### Functional Acceptance

- [ ] Continue button appears only after DeepStack completes
- [ ] Progress tracker shows 5 stages with correct icons
- [ ] Polling updates progress every 2 seconds
- [ ] Report loads automatically when complete
- [ ] Markdown renders with proper formatting
- [ ] Markdown download works with correct filename
- [ ] PDF download works with Scale VP branding
- [ ] All error scenarios handled gracefully

### Constitution Compliance

- [ ] Library-First: Using react-markdown, file-saver, jspdf
- [ ] Test-First: TDD workflow followed, tests written before implementation
- [ ] Simplicity: No unnecessary abstraction, direct framework usage
- [ ] Anti-Abstraction: No wrappers around Next.js, fetch, or React
- [ ] Integration-First: Contract tests written for all Railway API endpoints

---

## Post-Launch Checklist

### Immediate (Day 1)
- [ ] Monitor Vercel Analytics for errors (alert if >2%)
- [ ] Monitor Railway backend logs for OpenAI API errors
- [ ] Check user completion rate (target: >80%)
- [ ] Team available for urgent issues

### Short-term (Week 1)
- [ ] Review user feedback from support channels
- [ ] Analyze usage patterns (how many use Continue vs Download Only)
- [ ] Optimize polling if network usage too high
- [ ] Address any quick wins or bugs

### Long-term (Month 1)
- [ ] Measure success against KPIs (see FUNCTIONAL_SPEC)
- [ ] Plan Sprint L.2 or next iteration
- [ ] Document lessons learned
- [ ] Update roadmap based on user feedback

---

## Appendix

### Glossary

| Term | Definition |
|------|------------|
| DeepStack | Playwright-based website analyzer (2-3 minute analysis) |
| MEARA | Marketing Effectiveness Analysis framework |
| OpenAI Assistants | Pre-configured AI agents (7 deployed for MEARA) |
| Railway | Cloud platform hosting Python/FastAPI backend |
| Vercel | Cloud platform hosting Next.js frontend |
| MSW | Mock Service Worker (API mocking library for tests) |
| Polling | Repeatedly checking status via API (every 2s) |

### Related Documents

- [Product Requirements Document (PRD)](./README.md)
- [Functional Specification](./FUNCTIONAL_SPEC_sprint-l1-full-analysis.md)
- [Sprint Planning](./SPRINTS.md)
- [Backend API Implementation](../../deploy/railway_backend/main.py)

### References

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React Markdown](https://github.com/remarkjs/react-markdown)
- [FileSaver.js](https://github.com/eligrey/FileSaver.js)
- [jsPDF](https://github.com/parallax/jsPDF)
- [Mock Service Worker](https://mswjs.io/)
- [Playwright](https://playwright.dev/)

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-13 | Claude Code (with Peter Giordano) | Initial technical specification for Sprint L.1 |
