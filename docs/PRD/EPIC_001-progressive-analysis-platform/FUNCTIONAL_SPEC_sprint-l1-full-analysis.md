# Functional Specification: Sprint L.1 - Full MEARA Analysis

**Version:** 1.0
**Last Updated:** 2025-10-13
**Status:** ✅ Approved

---

## Feature Overview

Sprint L.1 ("Lovable" phase) implements the full MEARA analysis workflow that runs 7 OpenAI Assistants to generate a comprehensive marketing effectiveness analysis report. After DeepStack Collector completes its 2-3 minute website analysis, users can choose to continue to a full 8-10 minute analysis that provides deep strategic insights.

**Core Capability:** Users can initiate a comprehensive MEARA analysis with a single button click, monitor progress through 5 distinct stages with personality and visual feedback, and receive a formatted report with download options.

**User Impact:** Transforms the fragmented experience (download JSON → run Python scripts → wait → find file) into a delightful, progressive web experience where users stay in one browser tab and receive professional reports without any technical knowledge.

**Business Value:** Makes MEARA's powerful AI analysis accessible to non-technical marketing consultants and agency professionals, expanding the addressable market from technical users only to the broader marketing industry.

---

## Core Features

### Feature 1: Continue to Full Analysis

**Description:** After DeepStack Collector successfully completes website analysis, users see a clear "Continue to Full Analysis" button alongside the existing "Download Results" button. Clicking this button initiates the 7-assistant MEARA workflow that takes 6-8 minutes.

**User Capability:** Users can seamlessly progress from quick website analysis to comprehensive strategic analysis by clicking one button, without needing to download files, run command-line tools, or understand technical workflows.

**Business Rules:**

1. **Button Visibility Rule:** Continue button only appears when DeepStack status = "completed"
   - Applies when: DeepStack job finishes successfully (progress = 100, status = "completed")
   - Expected behavior: Button becomes visible and enabled next to "Download Results" button
   - Exception handling: If DeepStack fails, only show retry/error options, not Continue button

2. **Single Submission Rule:** Prevent duplicate analysis submissions for same DeepStack job
   - Applies when: User clicks Continue button
   - Expected behavior: Button becomes disabled with "Starting Analysis..." state, subsequent clicks ignored
   - Exception handling: If API call fails, re-enable button with error message

3. **Context Preservation Rule:** Full analysis uses the same company data from DeepStack job
   - Applies when: Initiating full analysis
   - Expected behavior: deepstack_job_id automatically passed to `/api/analyze/full` endpoint
   - Exception handling: If job_id is missing/invalid, show error: "Please complete DeepStack analysis first"

**Validation Logic:**

- **Input validation:**
  - deepstack_job_id: string (UUID format), required
    - Example valid: `"550e8400-e29b-41d4-a716-446655440000"`
    - Example invalid: `"abc123"` (reason: not valid UUID format)

- **Business validation:**
  - DeepStack job must exist: API returns 404 if job not found → Error: "Analysis not found. Please refresh and try again."
  - DeepStack job must be completed: API returns 400 if status != "completed" → Error: "Please wait for DeepStack analysis to complete first."

**Success Criteria:**

- [ ] User can successfully click Continue button after DeepStack completes
- [ ] System validates DeepStack job exists and is completed before proceeding
- [ ] Error messages are clear and actionable
- [ ] Edge cases handled gracefully (see Edge Case Matrix below)
- [ ] Button state clearly indicates processing (disabled + loading state)

**User Story Mapping:**

- Traces to PRD User Story: US-L1.1 "Continue to Full Analysis"
- Acceptance Criteria covered: AC-1 (button visibility), AC-2 (single click), AC-3 (error handling)

---

### Feature 2: Multi-Stage Progress Tracking

**Description:** While the 7 OpenAI Assistants run (6-8 minutes), users see a beautiful multi-stage progress component that condenses 15 internal workflow steps into 5 user-facing stages with personality, icons, names, and estimated time remaining.

**User Capability:** Users can monitor analysis progress through 5 meaningful stages that communicate what's happening (not just "processing..."), understand how much time remains, and feel confident the system is working even during the long wait.

**Business Rules:**

1. **Progress Stage Mapping Rule:** Map 15 internal steps to 5 user-facing stages
   - Applies when: Backend returns current_step (1-15)
   - Expected behavior: Frontend maps to stage 1-5 using this mapping:
     - Steps 1-3 → Stage 1: "Preparing analysis" 🔬
     - Steps 4-6 → Stage 2: "Collecting evidence" 📊
     - Steps 7-10 → Stage 3: "Evaluating dimensions" 📈
     - Steps 11-12 → Stage 4: "Building recommendations" 💡
     - Steps 13-15 → Stage 5: "Finalizing report" 📝
   - Exception handling: If step > 15 or step < 1, treat as step 15 (final stage)

2. **Progress Polling Rule:** Poll status endpoint every 2 seconds while status = "running"
   - Applies when: Analysis is in progress
   - Expected behavior: Make GET request to `/api/analysis/status/{analysis_job_id}` every 2000ms
   - Exception handling: If 3 consecutive polls fail, show error and offer retry

3. **Estimated Time Rule:** Show estimated time remaining based on progress
   - Applies when: Progress > 0 and status = "running"
   - Expected behavior: Display "About X minutes remaining" calculated as: `(8 minutes total) * (1 - progress/100)`
   - Exception handling: Don't show time if progress = 0, show "Starting..." instead

**Validation Logic:**

- **Input validation from API:**
  - current_step: integer (1-15), required
  - current_stage: integer (1-5), required
  - stage_name: string, required
  - stage_icon: string (emoji), required
  - progress: integer (0-100), required

- **Business validation:**
  - Progress never decreases: If new progress < old progress, ignore update (log warning)
  - Stage progression is forward: If new stage < old stage (except on page reload), ignore update

**Success Criteria:**

- [ ] User sees 5 distinct stages with icons and names
- [ ] Progress bar updates smoothly as steps advance
- [ ] Estimated time remaining updates every 2 seconds
- [ ] Stages transition at correct step thresholds (3, 6, 10, 12)
- [ ] Polling stops when status changes to "completed" or "failed"
- [ ] Component handles network errors gracefully with retry option

**User Story Mapping:**

- Traces to PRD User Story: US-L1.2 "Multi-Stage Progress Display"
- Acceptance Criteria covered: AC-4 (5 stages visible), AC-5 (polling), AC-6 (time remaining)

---

### Feature 3: Report Viewer with Markdown Rendering

**Description:** When analysis completes, users see the comprehensive MEARA report rendered beautifully with proper markdown formatting, collapsible sections, syntax highlighting for any code snippets, and a clean, professional layout matching Scale VP brand guidelines.

**User Capability:** Users can read the strategic analysis report directly in their browser with proper formatting, navigate through sections, and understand the insights without needing to download or open external tools.

**Business Rules:**

1. **Automatic Report Loading Rule:** Fetch report immediately when status changes to "completed"
   - Applies when: Polling detects status = "completed"
   - Expected behavior: Make GET request to `/api/analysis/report/{analysis_job_id}` and render
   - Exception handling: If fetch fails, show error with retry button: "Failed to load report. Retry"

2. **Markdown Rendering Rule:** Render all markdown syntax properly
   - Applies when: Displaying report content
   - Expected behavior: Support headings (H1-H6), lists, bold, italic, links, code blocks, tables
   - Exception handling: If markdown is malformed, render as plain text (don't crash)

3. **Section Navigation Rule:** Allow users to jump to sections via table of contents
   - Applies when: Report has multiple H2/H3 sections
   - Expected behavior: Auto-generate TOC from headings, smooth scroll to section on click
   - Exception handling: If no headings, don't show TOC

**Validation Logic:**

- **Input validation from API:**
  - report_markdown: string (markdown text), required
    - Example valid: `"# Executive Summary\n\n**Key Finding:** ..."`
    - Example invalid: `null` (reason: report must exist)

- **Business validation:**
  - Report not empty: If report_markdown.length < 100, show warning: "Report seems incomplete"
  - Report structure valid: Must contain at least one heading (H1 or H2)

**Success Criteria:**

- [ ] All markdown syntax renders correctly (headings, lists, bold, italic, links, tables)
- [ ] Code blocks have syntax highlighting (if present)
- [ ] Links open in new tab
- [ ] Images display if included in markdown
- [ ] Table of contents auto-generates for navigation
- [ ] Report is mobile-responsive and accessible (WCAG 2.1 AA)

**User Story Mapping:**

- Traces to PRD User Story: US-L1.3 "Report Viewer"
- Acceptance Criteria covered: AC-7 (markdown rendering), AC-8 (navigation), AC-9 (formatting)

---

### Feature 4: Download Functionality (MD/PDF)

**Description:** Users can download the MEARA report in two formats: Markdown (.md) for technical users who want to edit/version control, and PDF for executives who want a polished, printable document.

**User Capability:** Users can save the report to their local machine in their preferred format for sharing with clients, including in presentations, or archiving for future reference.

**Business Rules:**

1. **Download Format Rule:** Offer two download options with clear labels
   - Applies when: Report is successfully loaded
   - Expected behavior: Show two buttons: "Download Markdown" and "Download PDF"
   - Exception handling: If report not loaded, buttons disabled with tooltip: "Report not ready"

2. **Filename Convention Rule:** Use consistent, descriptive filenames
   - Applies when: User clicks download button
   - Expected behavior: Filename format: `MEARA_Report_{company_name}_{date}.{ext}`
   - Exception handling: Sanitize company name (remove special chars, spaces to underscores)

3. **PDF Generation Rule:** Generate PDF from markdown with proper formatting
   - Applies when: User clicks "Download PDF"
   - Expected behavior: Convert markdown to HTML → PDF with page breaks, headers, footers
   - Exception handling: If PDF generation fails, offer MD download instead with error message

**Validation Logic:**

- **Input validation:**
  - company_name: string, required (from analysis job metadata)
  - report_markdown: string, required
  - date: ISO 8601 date string, auto-generated

- **Business validation:**
  - Report content exists: Can't download empty report
  - Browser supports download: If File API not available, fallback to opening in new tab

**Success Criteria:**

- [ ] Markdown download works in all major browsers (Chrome, Firefox, Safari, Edge)
- [ ] PDF download generates readable, well-formatted document
- [ ] PDF includes company name, date, Scale VP branding in header/footer
- [ ] Filenames are descriptive and properly sanitized
- [ ] Download doesn't interrupt user's current page (no navigation away)

**User Story Mapping:**

- Traces to PRD User Story: US-L1.4 "Download Report"
- Acceptance Criteria covered: AC-10 (MD download), AC-11 (PDF download), AC-12 (filenames)

---

## Data Flow

### Flow 1: Initiate Full Analysis

```
User Clicks "Continue" → Frontend Validation → API Call → Backend Processing → Response → UI Update
```

**Detailed Steps:**

1. **User Action:** User clicks "Continue to Full Analysis" button
   - Input provided:
     - deepstack_job_id: string (UUID from parent component state)
   - Trigger: Button click event
   - Client-side validation:
     - Check deepstack_job_id exists in component state
     - Check DeepStack status is "completed"

2. **API Call:** POST request to start full analysis
   - Method: `POST`
   - Endpoint: `https://meara-production.up.railway.app/api/analyze/full`
   - Headers required:
     - `Content-Type: multipart/form-data`
   - Payload structure:
     ```typescript
     const formData = new FormData();
     formData.append('deepstack_job_id', jobId);
     // Optional: additional context files uploaded by user
     ```

3. **Backend Processing:**
   - Business logic applied:
     1. Validate DeepStack job exists and status = "completed"
     2. Create new analysis_job_id (UUID)
     3. Queue MEARA workflow (15 steps with 7 OpenAI Assistants)
     4. Return immediately with job ID (don't wait for completion)
   - Data transformations:
     - deepstack_job_id (string) → Analysis job record in memory store
   - External API calls (if any):
     - Service: OpenAI Assistants API
     - Purpose: Run 7 AI agents for analysis (happens async in background)
     - Timeout handling: Individual assistant calls timeout after 120s, overall workflow max 15 minutes

4. **Response:**
   - Success response (HTTP 200):
     ```json
     {
       "analysis_job_id": "uuid",
       "status": "queued",
       "estimated_time_minutes": 8,
       "deepstack_job_id": "original_uuid"
     }
     ```
   - Error responses:
     - 404: `{"error": "DeepStack job not found", "detail": "Invalid job ID"}`
     - 400: `{"error": "DeepStack analysis not complete", "detail": "Status: running"}`
     - 500: `{"error": "Internal server error", "requestId": "..."}`

5. **UI Update:**
   - Success state:
     - Display: Hide Continue button, show ProgressTracker component
     - Navigation: Stay on same page, scroll to progress tracker
     - Notifications: None (progress is self-explanatory)
   - Loading states: Button shows "Starting Analysis..." with spinner
   - Error states: Show error toast, keep Continue button visible with retry

**Performance Requirements:**

- Total flow completion: < 500ms (target), < 1000ms (maximum)
- API response time: < 300ms
- UI state update: < 100ms

---

### Flow 2: Poll Analysis Progress

```
Timer Fires → API Request → Response Parsing → State Update → UI Render → Schedule Next Poll
```

**Detailed Steps:**

1. **Timer Fires:** setInterval triggers every 2000ms while status = "running"
   - Condition: Only poll if analysis_job_id exists and status not in ["completed", "failed"]
   - Cancel polling if: Component unmounts, analysis completes, or 3 consecutive errors

2. **API Request:** GET request to check progress
   - Method: `GET`
   - Endpoint: `https://meara-production.up.railway.app/api/analysis/status/{analysis_job_id}`
   - Headers required: None
   - Query parameters: None

3. **Response Parsing:**
   - Success response (HTTP 200):
     ```json
     {
       "analysis_job_id": "uuid",
       "status": "running",
       "company_name": "Example Corp",
       "company_url": "https://example.com",
       "current_step": 7,
       "current_stage": 3,
       "stage_name": "Evaluating dimensions",
       "stage_icon": "📈",
       "progress": 46,
       "error": null,
       "deepstack_job_id": "original_uuid"
     }
     ```
   - Completed response (HTTP 200):
     ```json
     {
       "status": "completed",
       "progress": 100,
       "current_step": 15,
       "current_stage": 5
     }
     ```
   - Error responses:
     - 404: Analysis job not found (rare, should not happen)
     - 500: Server error (retry after delay)

4. **State Update:**
   - Update React state with new progress values
   - If status changed to "completed": Stop polling, trigger report fetch
   - If status changed to "failed": Stop polling, show error UI
   - Calculate estimated time remaining: `Math.ceil((8 * 60) * (1 - progress/100) / 60)` minutes

5. **UI Render:**
   - Update progress bar width: `{progress}%`
   - Update stage indicator: Highlight current stage, gray out previous stages
   - Update stage name and icon
   - Update estimated time: "About {X} minutes remaining"

6. **Schedule Next Poll:**
   - If status still "running": Continue polling after 2000ms
   - If status "completed": Stop polling, proceed to report fetch
   - If status "failed": Stop polling, show error with retry button

**Performance Requirements:**

- Poll request/response: < 200ms (target), < 500ms (maximum)
- State update + render: < 50ms
- Total poll cycle: < 300ms (keeps UI responsive)

---

### Flow 3: Fetch and Display Report

```
Completion Detected → Fetch Report → Markdown Processing → Render → Enable Downloads
```

**Detailed Steps:**

1. **Completion Detected:** Progress polling detects status = "completed"
   - Trigger: Status changes from "running" to "completed"
   - Validation: Confirm analysis_job_id still valid

2. **Fetch Report:** GET request to retrieve markdown report
   - Method: `GET`
   - Endpoint: `https://meara-production.up.railway.app/api/analysis/report/{analysis_job_id}`
   - Headers required: None

3. **Markdown Processing:**
   - Parse markdown text into React components (using react-markdown)
   - Generate table of contents from H2/H3 headings
   - Add IDs to headings for anchor links
   - Sanitize any HTML (if present) to prevent XSS

4. **Render:**
   - Success state:
     - Display: Show ReportViewer component with rendered markdown
     - Scroll behavior: Smooth scroll to top of report
     - Animation: Fade-in animation (300ms)
     - Celebration: Brief success animation (confetti or checkmark)
   - Loading state: Show skeleton loader while fetching
   - Error state: Show error message with retry button

5. **Enable Downloads:**
   - Make download buttons active (change from disabled to enabled)
   - Prepare data for downloads:
     - MD: Raw markdown text
     - PDF: Convert markdown to HTML → jsPDF
   - Add click handlers for both buttons

**Performance Requirements:**

- Report fetch: < 500ms (target), < 1000ms (maximum)
- Markdown processing: < 200ms
- Render time: < 300ms
- Total time to display: < 1500ms

---

### Flow 4: Download Report

```
User Clicks Download → Prepare File → Browser Download API → File Saved
```

**Detailed Steps:**

1. **User Clicks Download:** User clicks either "Download Markdown" or "Download PDF"
   - Validation: Report data exists in component state
   - Loading state: Show spinner on clicked button

2. **Prepare File:**
   - **For Markdown:**
     - Create Blob from markdown text: `new Blob([markdownText], { type: 'text/markdown' })`
     - Generate filename: `MEARA_Report_${sanitizedCompanyName}_${date}.md`
   - **For PDF:**
     - Convert markdown to HTML using react-markdown server-side render
     - Generate PDF using jsPDF with custom styling
     - Add header/footer with Scale VP branding
     - Generate filename: `MEARA_Report_${sanitizedCompanyName}_${date}.pdf`

3. **Browser Download API:**
   - Use FileSaver.js `saveAs()` method:
     ```typescript
     import { saveAs } from 'file-saver';
     saveAs(blob, filename);
     ```
   - Browser triggers download dialog
   - File saved to user's default Downloads folder

4. **UI Feedback:**
   - Success: Show success toast: "Report downloaded successfully"
   - Error: Show error toast: "Download failed. Please try again."
   - Reset button state: Remove spinner, return to normal state

**Performance Requirements:**

- File preparation: < 500ms for MD, < 2000ms for PDF
- Total download initiation: < 3000ms

---

## Integration Points

### Internal Integrations

| System/Module | Integration Type | Data Exchanged | Dependency Level | Failure Handling |
|---------------|------------------|----------------|------------------|------------------|
| DeepStack Results | React props | job_id, company_name, company_url, result | Required | Block Continue button if missing |
| Progress Tracker | React component | analysis_job_id, progress state | Required | Show error if polling fails 3x |
| Report Viewer | React component | markdown text, metadata | Required | Show error with retry button |

**Integration Details:**

#### DeepStack Results Integration

- **Purpose:** Carry forward company data from DeepStack analysis to full MEARA analysis
- **Data passed:**
  - `jobId` (string): DeepStack job UUID
  - `companyName` (string): Company name entered by user
  - `companyUrl` (string): URL analyzed by DeepStack
  - `result` (object): DeepStack analysis JSON (for reference, not sent to backend)
- **Component communication:** Props passed from parent `page.tsx` to child components
- **Failure scenarios:**
  - Missing job_id: Disable Continue button, show error: "Analysis data not found"
  - Invalid job_id format: Same as above
  - DeepStack not completed: Continue button disabled until status = "completed"

---

### External Integrations

| Service | Purpose | API Version | Auth Method | Rate Limits | SLA |
|---------|---------|-------------|-------------|-------------|-----|
| Railway Backend (MEARA API) | Run full analysis workflow | v1 | None (public) | None | 99.5% |
| OpenAI Assistants API | 7 AI agents for analysis | v1 | API Key (backend-only) | 10k tokens/min | 99.9% |

**External Integration Details:**

#### Railway Backend (MEARA API) Integration

- **Purpose:** Execute the 7-assistant MEARA workflow and return strategic analysis
- **Documentation:** Internal (see `railway_backend/main.py` lines 291-462)
- **Endpoints used:**
  - `POST /api/analyze/full` - Start full analysis (multipart/form-data)
  - `GET /api/analysis/status/{id}` - Poll progress (JSON response)
  - `GET /api/analysis/report/{id}` - Fetch final report (JSON with markdown)
- **Data exchanged:**
  - Request: deepstack_job_id (UUID), optional context files
  - Response: analysis_job_id, progress updates, final markdown report
- **Error handling:**
  - Service unavailable (503): Show "Analysis service temporarily unavailable. Try again in a few minutes."
  - Timeout (504): Show "Analysis taking longer than expected. Please refresh to check status."
  - Rate limit (429): Should not happen (no rate limits), but show "Too many requests, please wait."
  - Invalid job (404): Show "Analysis not found. Please start over."
- **Cost implications:** $6.45 per analysis (OpenAI API costs), paid by backend service
- **Webhook callbacks:** None (polling-based architecture)

---

## State Management

### Application State

```typescript
interface FullAnalysisState {
  // Analysis job tracking
  analysisJobId: string | null;
  status: 'idle' | 'starting' | 'running' | 'completed' | 'failed';
  error: string | null;

  // Progress tracking
  currentStep: number;        // 1-15 (backend workflow step)
  currentStage: number;       // 1-5 (user-facing stage)
  stageName: string;          // e.g., "Collecting evidence"
  stageIcon: string;          // emoji, e.g., "📊"
  progress: number;           // 0-100 percentage
  estimatedMinutesRemaining: number;

  // Report data
  reportMarkdown: string | null;
  reportLoaded: boolean;

  // UI state
  isPolling: boolean;
  pollErrorCount: number;
  showReport: boolean;
  downloadingMD: boolean;
  downloadingPDF: boolean;

  // Company metadata (from DeepStack)
  companyName: string;
  companyUrl: string;
  deepstackJobId: string;
}
```

### State Transitions

```
[Idle State]
  ↓ [User Action: Click "Continue to Full Analysis"]
[Starting State]
  ↓ [API Success: analysis_job_id received]
[Running State] ←─── [Polling every 2s]
  ↓ [Progress updates: current_step, progress increase]
[Running State (continues until progress = 100)]
  ↓ [Backend: status = "completed"]
[Completed State]
  ↓ [Auto-fetch report]
[Report Loaded State]
  ↓ [User Action: Click "Download"]
[Downloading State] → [Report Loaded State]

[Error State] ← Can transition from any state on error
  ↓ [User Action: Click "Retry"]
[Return to appropriate previous state]
```

**State Persistence:**

- **Session storage:** Analysis job ID and progress state (survives page refresh)
  - `analysisJobId`: Persist to resume after accidental refresh
  - `currentStep`, `progress`: Show last known progress on reload
  - Clear on: Analysis completion or user navigates away

- **Local storage:** None (no long-term persistence needed)

- **Server state:** All analysis data (stored in Railway backend memory)
  - Analysis jobs persist for 24 hours after completion
  - Can resume polling with saved `analysisJobId`
  - Report remains accessible via `analysis_job_id` for 24 hours

**State Synchronization:**

- **Polling strategy:**
  - Frequency: Every 2000ms (2 seconds) while status = "running"
  - Stop conditions: status = "completed", status = "failed", or 3 consecutive poll failures
  - Resume on page reload: Check sessionStorage for `analysisJobId`, resume polling if found
- **Optimistic updates:** None (all updates server-driven via polling)
- **Conflict resolution:** N/A (single user, no concurrent edits)

---

## Edge Cases & Error Handling

### Edge Case Matrix

| Scenario | System Behavior | User Experience | Technical Handling | Recovery Action |
|----------|----------------|-----------------|-------------------|-----------------|
| Browser refresh during analysis | Resume polling from last known state | Show progress bar with last known progress + "Reconnecting..." | Check sessionStorage for analysisJobId, resume polling | Automatic reconnection |
| Network drops mid-analysis | Queue API calls, retry with backoff | Show "Connection lost" warning banner, keep progress visible | 3 retries with exponential backoff (1s, 2s, 4s) | Auto-retry, manual retry button |
| Backend analysis timeout (>15min) | Mark as failed after 15 minutes | "Analysis timed out. Please try again or contact support." | Stop polling after 15 min, mark status = "failed" | Offer "Start Over" button |
| OpenAI API rate limit hit | Backend queues request, retries | "Analysis paused briefly. Continuing..." | Backend handles rate limiting with exponential backoff | Automatic retry by backend |
| Malformed markdown in report | Render as plain text fallback | Report displays but without formatting | Catch markdown parsing errors, show plain text | Offer raw markdown download |
| Browser doesn't support File API | Open report in new tab instead | "Opening report in new tab..." | Feature detection: if (!window.Blob) { openInNewTab() } | Fallback to new tab |
| Extremely long report (>1MB) | Virtualize rendering for performance | Smooth scrolling, lazy-load sections | Use react-window for large reports | Paginate sections |
| PDF generation fails | Fallback to markdown download | "PDF unavailable, downloading markdown instead" | Catch jsPDF errors, offer MD download | Markdown-only fallback |
| Multiple analyses for same company | Allow concurrent analyses | Each gets unique analysis_job_id, no conflicts | Backend creates new job for each request | Support multiple analyses |
| User navigates away mid-analysis | Clear sessionStorage on navigate | Confirm dialog: "Analysis in progress. Leave anyway?" | beforeunload event listener | User confirmation |

---

### Error Categories

#### 1. Validation Errors (User-caused, Recoverable)

| Error Code | Scenario | User Message | Technical Details | Recovery |
|------------|----------|--------------|-------------------|----------|
| VAL001 | DeepStack job not completed | "Please wait for DeepStack analysis to complete before continuing." | DeepStack status != "completed" | Wait for DeepStack to finish |
| VAL002 | Missing DeepStack job ID | "Analysis data not found. Please refresh and try again." | jobId is null/undefined | Refresh page or restart analysis |
| VAL003 | Invalid analysis job ID format | "Invalid analysis ID. Please start a new analysis." | UUID format validation failed | Start new analysis |

#### 2. Network Errors (System issues, Temporary)

| Error Code | Scenario | User Message | Technical Action | Monitoring |
|------------|----------|--------------|-----------------|------------|
| NET001 | API request timeout | "Request timed out. Retrying..." | Automatic retry (3x with backoff) | Alert if >5% requests timeout |
| NET002 | Network offline | "You're offline. Reconnecting..." | Queue requests, retry when online | Track offline periods |
| NET003 | CORS error | "Unable to reach analysis service. Please try again." | Log CORS error, check backend CORS config | Alert DevOps immediately |

#### 3. Backend Errors (Service issues, May require intervention)

| Error Code | Scenario | User Message | Technical Action | Monitoring |
|------------|----------|--------------|-----------------|------------|
| SRV001 | Analysis service unavailable (503) | "Analysis service temporarily unavailable. Please try again in a few minutes." | Show retry button, log incident | Alert on-call if >5min |
| SRV002 | OpenAI API failure | "AI service encountered an error. Our team has been notified." | Backend logs error, retries with backoff | Alert if OpenAI downtime |
| SRV003 | Internal server error (500) | "Something went wrong. Please try again or contact support." | Log full stack trace with requestId | Alert on all 500 errors |

---

### Error Handling Best Practices

**General Principles:**

1. **Be specific:** "DeepStack analysis not complete" not "Cannot continue"
2. **Be actionable:** "Please wait 2 minutes for analysis to finish" not "Error occurred"
3. **Be reassuring:** "Reconnecting..." not "Connection failed"
4. **Be contextual:** Show errors where they occur (inline, not modal)
5. **Be persistent:** Keep errors visible until resolved (sticky banner for critical errors)

**Error Message Template:**

```
[What went wrong] + [Why it matters] + [What to do next]

Examples:
❌ Bad: "Error 503"
✅ Good: "Analysis service is temporarily down. Your work is saved. Please try again in a few minutes."

❌ Bad: "Network error"
✅ Good: "Connection lost. Don't worry—we'll reconnect automatically. Keep this tab open."

❌ Bad: "Failed to download"
✅ Good: "PDF download failed. Try downloading the markdown version instead, or contact support if this persists."
```

---

## Security Considerations

### Authentication & Authorization

**Authentication Method:** None (public service)

**Security Notes:**
- No authentication required for current MVP (all analyses are anonymous)
- Future consideration: Add user accounts to save analysis history
- Analysis job IDs are UUIDs (hard to guess, provides some security through obscurity)

---

### Data Protection

**Sensitive Data Handling:**

- [ ] No PII (Personally Identifiable Information) collected in MVP
- [ ] Company URLs and names are NOT considered sensitive (public information)
- [ ] Analysis results are temporary (24-hour retention)
- [ ] HTTPS/TLS enforced for all communication (Vercel + Railway auto-HTTPS)
- [ ] No authentication tokens or session data (stateless)
- [ ] XSS prevention via React's built-in escaping + markdown sanitization

**Data Access Controls:**

| Data Type | Storage | Encryption | Access Control | Retention |
|-----------|---------|------------|----------------|-----------|
| Analysis job IDs | Railway backend memory | In transit (HTTPS) | Anyone with job ID | 24 hours |
| Company URLs | Railway backend memory | In transit (HTTPS) | Anyone with job ID | 24 hours |
| Reports | Railway backend memory | In transit (HTTPS) | Anyone with job ID | 24 hours |
| User input (context files) | Railway backend disk | In transit + at rest | Anyone with job ID | 24 hours |

---

### Privacy Compliance

**GDPR/CCPA Requirements:**

- [ ] **Right to deletion:** Not applicable (no user accounts, data auto-deletes after 24h)
- [ ] **Data collection notice:** Add notice: "We analyze public website data. Reports are stored for 24 hours then automatically deleted."
- [ ] **Cookie policy:** No cookies used (session storage only, no tracking)
- [ ] **Privacy policy:** Update to mention temporary storage of analysis results

**Data Retention:**

| Data Type | Retention Period | Deletion Method | Rationale |
|-----------|-----------------|-----------------|-----------|
| Analysis results | 24 hours | Automatic memory purge | Temporary analysis, no long-term storage needed |
| Uploaded context files | 24 hours | Automatic file deletion | Privacy-first, minimize data storage |

---

## Performance Requirements

### Response Time Targets

| Action | Target (P50) | Acceptable (P95) | Maximum (P99) | Notes |
|--------|--------------|------------------|---------------|-------|
| Click Continue button | < 100ms | < 200ms | < 300ms | Button feedback instant |
| API call to start analysis | < 300ms | < 500ms | < 1000ms | Fast job creation |
| Progress polling request | < 200ms | < 400ms | < 600ms | Every 2s, must be fast |
| Fetch report | < 500ms | < 1000ms | < 2000ms | One-time fetch |
| Render markdown report | < 200ms | < 500ms | < 1000ms | Client-side rendering |
| Generate PDF | < 1000ms | < 2000ms | < 3000ms | Client-side PDF generation |
| Download file | < 500ms | < 1000ms | < 2000ms | Browser download initiation |

### Scalability Targets

**Load Capacity:**

- Concurrent users: 50 active analyses at once (Railway backend constraint)
- Requests per second: ~25 RPS (50 users × 0.5 req/s polling)
- Full analysis duration: 6-8 minutes average, 15 minutes maximum
- Report size: 50-200 KB markdown text (typical)

**Resource Limits:**

- Max report size: 1 MB markdown text (backend limit)
- Max PDF size: 5 MB (client-side generation limit)
- Max polling duration: 15 minutes (then timeout)
- Max concurrent polls per user: 1 (prevent poll flooding)

---

### Optimization Strategies

**Frontend Optimization:**

- [ ] Polling debouncing: Prevent multiple simultaneous polls per analysis
- [ ] Report memoization: Cache rendered markdown to avoid re-processing on re-render
- [ ] Lazy load PDF library: Only load jsPDF when user clicks PDF download
- [ ] Virtualize long reports: Use react-window if report > 1000 lines

**Backend Optimization:**

- [ ] Backend handles optimization (outside Sprint L.1 scope)

**Monitoring & Alerting:**

- [ ] Track polling request durations (alert if P95 > 600ms)
- [ ] Track analysis failure rate (alert if > 5%)
- [ ] Track report fetch errors (alert if > 2%)
- [ ] Monitor PDF generation failures (alert if > 10%)

---

## Testing Requirements

### Test Coverage Targets

- **Unit tests:** 80% code coverage minimum for all components
- **Integration tests:** All Railway API endpoints (3 endpoints)
- **E2E tests:** Complete user journey (DeepStack → Continue → Progress → Report → Download)
- **Performance tests:** Polling stability under slow network conditions
- **Accessibility tests:** WCAG 2.1 AA compliance (keyboard navigation, screen readers)

---

### Test Scenarios

#### Happy Path Tests

1. **Scenario: Complete full analysis workflow**
   - **Given:** DeepStack analysis completed successfully (job_id exists, status = "completed")
   - **When:**
     1. User clicks "Continue to Full Analysis" button
     2. System polls progress every 2s
     3. Progress advances through 5 stages
     4. Analysis completes after ~8 minutes
     5. Report loads automatically
     6. User downloads markdown and PDF
   - **Then:**
     - Continue button disabled during analysis
     - Progress bar shows 0% → 100% smoothly
     - All 5 stages display with correct icons
     - Estimated time updates accurately
     - Report renders with proper markdown formatting
     - Both downloads succeed with correct filenames
   - **Verification:**
     - [ ] Continue button state changes correctly
     - [ ] API calls made to correct endpoints
     - [ ] Polling stops when status = "completed"
     - [ ] Report markdown renders all headings, lists, bold, italic
     - [ ] PDF contains all report content with branding

2. **Scenario: Resume analysis after page refresh**
   - **Given:** Analysis in progress (status = "running", progress = 45%)
   - **When:** User refreshes browser page
   - **Then:** Progress tracker resumes from last known state, continues polling
   - **Verification:**
     - [ ] sessionStorage persists analysisJobId
     - [ ] Polling resumes automatically
     - [ ] Progress bar shows correct percentage
     - [ ] No duplicate API calls

---

#### Edge Case Tests

1. **Scenario: Network drops during analysis**
   - **Given:** Analysis running (status = "running")
   - **When:** Network connection lost (simulate offline)
   - **Then:**
     - System shows "Connection lost" warning
     - Retries 3 times with exponential backoff
     - If network returns, resumes polling automatically
     - If network stays down, shows manual retry button
   - **Verification:**
     - [ ] Warning banner appears when offline
     - [ ] Retry attempts logged (1s, 2s, 4s delays)
     - [ ] Polling resumes when online
     - [ ] Manual retry button works

2. **Scenario: Malformed markdown in report**
   - **Given:** Backend returns report with invalid markdown syntax
   - **When:** Report viewer attempts to render
   - **Then:**
     - System catches markdown parsing error
     - Renders as plain text fallback
     - Shows warning: "Report formatting unavailable. Displaying plain text."
     - Markdown download still works (raw text)
   - **Verification:**
     - [ ] No crash or blank screen
     - [ ] Plain text displays correctly
     - [ ] Warning message shown
     - [ ] MD download provides raw text

---

#### Error Handling Tests

1. **Scenario: API returns 404 (job not found)**
   - **Given:** User clicks "Continue" with invalid job_id
   - **When:** API returns 404 error
   - **Then:**
     - System shows error: "Analysis not found. Please start a new analysis."
     - Continue button re-enabled
     - Error logged for debugging
   - **Verification:**
     - [ ] Error message displays clearly
     - [ ] Button returns to clickable state
     - [ ] No infinite error loop

2. **Scenario: Analysis timeout (>15 minutes)**
   - **Given:** Analysis running for >15 minutes (OpenAI API issues)
   - **When:** 15-minute timeout threshold reached
   - **Then:**
     - Polling stops automatically
     - Status changed to "failed"
     - Error: "Analysis timed out. Please try again or contact support."
     - "Start Over" button offered
   - **Verification:**
     - [ ] Polling stops after 15 minutes
     - [ ] Timeout error displayed
     - [ ] Start Over button returns to initial state

---

## Acceptance Checklist

### Functional Acceptance

- [ ] Continue button appears only when DeepStack completes
- [ ] Continue button disabled during analysis initiation
- [ ] Analysis job ID received from backend successfully
- [ ] Progress polling starts automatically
- [ ] Progress bar updates every 2 seconds
- [ ] All 5 stages display with correct icons and names
- [ ] Estimated time remaining updates accurately
- [ ] Polling stops when analysis completes
- [ ] Report fetches automatically on completion
- [ ] Markdown renders with all formatting (headings, lists, bold, links)
- [ ] Table of contents generates from headings
- [ ] Markdown download works with correct filename
- [ ] PDF download works with proper formatting
- [ ] Error messages are clear and actionable

### Quality Acceptance

- [ ] Unit tests pass (≥80% coverage)
- [ ] Integration tests pass (all 3 API endpoints)
- [ ] E2E test passes (full workflow)
- [ ] Performance targets met (polling < 600ms P95)
- [ ] No console errors or warnings
- [ ] Accessibility: keyboard navigation works
- [ ] Accessibility: screen reader announces progress
- [ ] Works in Chrome, Firefox, Safari, Edge (latest versions)
- [ ] Mobile responsive (all components adapt to mobile)
- [ ] PDF generation works on mobile browsers

### Documentation Acceptance

- [ ] Component documentation complete (props, usage)
- [ ] API integration documented (endpoints, payloads)
- [ ] Error handling documented (all error codes)
- [ ] Testing guide written (how to run tests)

---

## Dependencies & Prerequisites

### External Dependencies

| Dependency | Version | Purpose | Criticality | Fallback |
|------------|---------|---------|-------------|----------|
| react-markdown | ^9.0.0 | Render markdown reports | Critical | Plain text fallback |
| file-saver | ^2.0.5 | Download files (MD/PDF) | Critical | Open in new tab fallback |
| jsPDF | ^2.5.0 | Generate PDF from HTML | Medium | MD-only fallback |
| Railway Backend API | v1 | Full analysis workflow | Critical | Show maintenance message |

### Internal Dependencies

| Module/Feature | Relationship | Required Version | Migration Plan |
|----------------|--------------|------------------|----------------|
| DeepStack Results | Must complete first | Current | N/A |
| React 18+ | Required for concurrent features | 18.x | N/A |
| Next.js App Router | Required for routing | 15.x | N/A |

### Data Prerequisites

- [ ] Railway backend deployed and accessible at `https://meara-production.up.railway.app`
- [ ] CORS configured on Railway backend to allow Vercel domain
- [ ] OpenAI API key configured on Railway backend
- [ ] 7 OpenAI Assistants deployed and operational (already done)

---

## Rollout Strategy

### Phased Rollout

**Phase 1: Internal Alpha (Week 1)**
- Audience: Development team only (Peter + Claude Code)
- Goal: Validate core functionality, fix critical bugs
- Success criteria: Complete user journey works end-to-end
- Testing: Manual testing + automated test suite

**Phase 2: Limited Beta (Week 2)**
- Audience: 5-10 friendly users (early adopters)
- Goal: Gather real-world feedback, identify UX improvements
- Success criteria: 80% task completion rate, < 2% error rate
- Rollback trigger: >5% of analyses fail

**Phase 3: General Availability (Week 3)**
- Audience: All users (public launch)
- Goal: Full production rollout
- Success criteria: See Success Metrics section
- Monitoring: Enhanced monitoring for 48 hours

### Feature Flags

Not applicable (no feature flags needed for Sprint L.1)

### Rollback Plan

**Rollback Triggers:**
- Error rate > 5%
- Polling failures > 10%
- Report rendering failures > 10%
- Critical bug discovered

**Rollback Process:**
1. Remove "Continue to Full Analysis" button from UI
2. Add maintenance message: "Full analysis temporarily unavailable. DeepStack analysis still works."
3. Monitor for 30 minutes
4. Notify users via status banner
5. Schedule post-mortem

---

## Success Metrics

### Key Performance Indicators (KPIs)

| Metric | Baseline | Target | Measurement Method | Review Frequency |
|--------|----------|--------|-------------------|------------------|
| User completion rate | N/A | >80% | % of users who click Continue and get report | Daily |
| Time to report | N/A | <12 min | 95th percentile end-to-end time | Weekly |
| Error rate | N/A | <5% | % of analyses that fail | Daily |
| Polling stability | N/A | <2% | % of polls that fail | Daily |
| Download success rate | N/A | >95% | % of downloads that complete | Weekly |

### User Satisfaction Metrics

- **Task completion rate:** >80% (users who start analysis get report)
- **Time on task:** 8-12 minutes (expected, minimal user interaction)
- **Error recovery rate:** >70% (users who retry after error succeed)

### Technical Metrics

- **Error rate:** < 5% (analyses that fail)
- **Polling uptime:** > 98% (successful polls)
- **P95 polling latency:** < 600ms
- **Report fetch success:** > 98%
- **PDF generation success:** > 90% (fallback to MD acceptable)

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-13 | Claude Code (with Peter Giordano) | Initial draft for Sprint L.1 |

---

## Appendix

### Glossary

| Term | Definition |
|------|------------|
| DeepStack | Website analysis tool (Playwright-based) that collects evidence (2-3 minutes) |
| MEARA | Marketing Effectiveness Analysis framework with 7 dimensions |
| OpenAI Assistants | 7 pre-configured AI agents that analyze different dimensions |
| Stage | User-facing progress indicator (5 total: Preparing, Collecting, Evaluating, Building, Finalizing) |
| Step | Internal workflow step (15 total, mapped to 5 stages) |
| Railway | Cloud platform hosting the Python/FastAPI backend |
| Vercel | Cloud platform hosting the Next.js frontend |

### Related Documents

- [Product Requirements Document (PRD)](./README.md) - Epic 001 Overview
- [Technical Specification](./TECHNICAL_SPEC_sprint-l1-full-analysis.md) - Implementation details
- [Sprint Planning](./SPRINTS.md) - Timeline and tasks
- [Backend API Code](../../deploy/railway_backend/main.py) - Lines 291-462 (full analysis endpoints)

### References

- [React Markdown Documentation](https://github.com/remarkjs/react-markdown)
- [FileSaver.js Documentation](https://github.com/eligrey/FileSaver.js)
- [jsPDF Documentation](https://github.com/parallax/jsPDF)
- [OpenAI Assistants API](https://platform.openai.com/docs/assistants/overview)
