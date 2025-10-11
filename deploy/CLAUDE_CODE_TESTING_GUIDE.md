# Complete MEARA Pipeline Testing Guide for Claude Code AI

**Purpose:** Comprehensive guide for testing and iterating on the full MEARA workflow from website analysis to strategic marketing recommendations.

**Audience:** New Claude Code AI instance in VS Code needing complete context to test the integrated system.

**Last Updated:** 2025-10-11

---

## 🎯 What This System Does

The MEARA pipeline automatically analyzes B2B SaaS companies' marketing effectiveness by:

1. **DeepStack Collector** - Analyzes website technical implementation (MarTech, UX, content)
2. **L3 Ground Truth** - Generates detailed technical evidence report
3. **Deep Research Brief** - Conducts strategic market/competitive research
4. **MEARA Analysis** - Evaluates marketing effectiveness across 9 dimensions using 6 AI agents

**Input:** Company name + URL
**Output:** 300+ line strategic marketing analysis with 20+ citations

---

## 📐 Complete Architecture

```
┌──────────────────────────────────────────────────────────┐
│                  FULL MEARA PIPELINE                      │
└──────────────────────────────────────────────────────────┘

STEP 1: DeepStack Collector (Python + Playwright)
  Location: /Users/petergiordano/Documents/GitHub/deepstack/
  Script: deepstack.py
  Input: Company URL (e.g., https://ggwp.com)
  Process:
    - Crawls website with Playwright browser
    - Detects MarTech stack (GTM, analytics, etc.)
    - Analyzes UX/performance
    - Extracts organic presence signals
  Output: deepstack_output-{domain}.json
  Time: 2-3 minutes
  Status: ✅ FULLY AUTOMATED

        ↓

STEP 2: L3 Ground Truth Generation (Gemini API)
  Location: /Users/petergiordano/Documents/GitHub/meara/deploy/
  Options:
    A. Manual: DeepStack Collector Gemini Gem (current)
    B. Automated: Railway Backend API (new - for testing)
    C. Future: Gemini API direct integration
  Input: DeepStack JSON from Step 1
  Process:
    - Analyzes JSON with AI
    - Generates structured technical report
    - Identifies areas for deeper investigation
  Output: {Company}_{timestamp}_L3_GroundTruth.md
  Time: 2-3 minutes
  Status: ⏸️ MANUAL (Railway backend available for testing)

        ↓

STEP 3: Deep Research Brief (Special AI Tool)
  Location: /Users/petergiordano/Documents/GitHub/meara/deploy/
  Tool Required: Gemini Deep Research OR Perplexity Deep Research
  Input: L3 Report + DeepR Methodology
  Process:
    - 5 research investigation areas:
      1. Competitive landscape
      2. Customer voice
      3. Hidden gems
      4. Cross-industry inspiration
      5. AI perception
  Output: {Company}_{timestamp}_DRB.md
  Time: 5-7 minutes
  Status: ⏸️ MANUAL (special AI tool required)
  Note: Cannot be automated with regular APIs

        ↓

STEP 4: MEARA Marketing Analysis (OpenAI Assistants)
  Location: /Users/petergiordano/Documents/GitHub/meara/deploy/
  Script: 3_orchestrate_workflow.py (called by 4_run_analysis.py)
  Input: Deep Research Brief + Framework docs
  Process: 15-step workflow with 7 specialist agents:
    [1/15] Input Collection
    [2/15] DRB Check (logic node)
    [3/15] Research Agent (if no DRB - skipped if DRB provided)
    [4/15] Evidence Collector Agent (web research)
    [5/15] Dimension Evaluator Agent (9 dimensions)
    [6/15] Strategic Framework Search (vector store)
    [7/15] Strategic Verifier Agent (8 elements)
    [8/15] Strategic Priority Check (logic node)
    [9/15] Root Cause Analyst Agent (3-5 causes)
    [10/15] Recommendation Builder Agent (5-7 recs)
    [11/15] Report Assembler Agent (main report: 250-350 lines)
    [12/15] Table Generator Agent (9 detailed tables: 150-200 lines)
    [13/15] Citation Validator (guardrail)
    [14/15] PII Protection (guardrail)
    [15/15] END - Save results
  Output: {Company}_{timestamp}_report.md (400-550 lines total, 21+ citations)
  Time: 9-14 minutes
  Status: ✅ FULLY AUTOMATED
```

---

## 🗂️ File Structure & Locations

### DeepStack Repository
```
/Users/petergiordano/Documents/GitHub/deepstack/
├── deepstack.py                          # Main collector script
├── src/
│   ├── deepstack_collector.py            # Core logic
│   ├── martech_detector.py               # MarTech identification
│   └── performance_analyzer.py           # UX analysis
├── output/                                # Generated JSON files
│   └── deepstack_output-{domain}.json    # Analysis results
└── docs/
    └── deepstack_analysis_pipeline_visualization.html
```

### MEARA Repository
```
/Users/petergiordano/Documents/GitHub/meara/
├── deploy/                                # Deployment scripts
│   ├── 1_setup_vector_store.py           # Setup framework docs
│   ├── 2b_deploy_assistants.py           # Deploy 7 AI agents
│   ├── 3_orchestrate_workflow.py         # 15-step workflow
│   ├── 4_run_analysis.py                 # CLI interface (simple)
│   ├── 5_full_pipeline.py                # Full pipeline (with pauses)
│   ├── assistant_config.json             # Assistant IDs
│   ├── railway_backend/                   # NEW: Cloud scraping solution
│   │   ├── main.py                        # FastAPI backend
│   │   ├── setup.sh                       # Local setup script
│   │   ├── test_api.sh                    # API testing
│   │   └── README.md                      # Deployment guide
│   ├── README.md                          # Deployment overview
│   ├── RAILWAY_BACKEND_COMPLETE.md        # Backend implementation
│   └── vercel_deployment_plan.md          # Architecture plan
├── analysis_results/                      # Output directory
│   ├── {Company}_{timestamp}_L3_GroundTruth.md
│   ├── {Company}_{timestamp}_DRB.md
│   ├── {Company}_{timestamp}_report.md    # Final MEA
│   └── {Company}_{timestamp}_state.json   # Workflow state
├── meara_doc_modules/                     # Gem knowledge files (NEW location)
│   ├── MEARA_System_Instructions.md       # System persona
│   ├── Instruct_Executive_Summary.md      # Summary generation
│   ├── Instruct_Marketing_Analysis.md     # Main orchestrator
│   ├── Marketing_Analysis_Methodology.md  # 9-step process
│   ├── Marketing_Analysis_Rubrics.md      # 9 dimension rubrics
│   ├── Strategic_Elements_Framework.md    # 8 strategic elements
│   ├── Scale_Brand_Design_and_Color_Palette_Guidelines.md
│   └── Prompt_for_DeepR_B2B_SaaS_Marketing_Insights.md
├── Prompt_for_DeepR_B2B_SaaS_Marketing_Insights.md → meara_doc_modules/ (symlink)
├── PIPELINE_AUTOMATION.md                 # This architecture doc
└── .env                                   # API keys
```

### DeepStack Workflow (Future Automation)
```
/Users/petergiordano/Documents/GitHub/deepstack-workflow/
├── README.md                              # Complete simplification guide
├── API_IMPLEMENTATION_PLAN.md             # Perplexity/Gemini API plan
├── block_1_l3_generation_prompt.md        # Simplified L3 instructions
├── block_2_research_prompt_constructor.md # Prompt builder
├── block_3_deepr_methodology.md           # Deep Research methodology
├── BUILD_GUIDE.md                         # Opal workflow guide
└── SUMMARY.md                             # Executive summary
```

---

## 🚀 Complete Testing Workflow

### Prerequisites

1. **Environment Setup:**
```bash
# Verify Python 3.8+
python3 --version

# Check API keys
cat /Users/petergiordano/Documents/GitHub/meara/.env
# Should contain:
# OPENAI_API_KEY=sk-proj-...
# (GEMINI_API_KEY - future)
```

2. **Install Dependencies:**
```bash
# DeepStack
cd /Users/petergiordano/Documents/GitHub/deepstack
pip install playwright beautifulsoup4 lxml requests
playwright install chromium

# MEARA
cd /Users/petergiordano/Documents/GitHub/meara
pip install openai python-dotenv
```

3. **Verify Assistants Deployed:**
```bash
cd /Users/petergiordano/Documents/GitHub/meara/deploy
cat assistant_config.json
# Should show 7+ assistants with IDs
```

---

### Test Scenario: Analyze GGWP

**Company:** GGWP (gaming toxicity prevention)
**URL:** https://ggwp.com
**Expected Output:** Complete MEA report with 300+ lines, 20+ citations

---

### STEP 1: Run DeepStack Collector

```bash
cd /Users/petergiordano/Documents/GitHub/deepstack

# Run collector
python3 deepstack.py -u https://ggwp.com

# Expected output:
# ✓ Analyzing https://ggwp.com
# ✓ MarTech detected: Google Tag Manager, Google Analytics
# ✓ Performance metrics collected
# ✓ Output saved: output/deepstack_output-ggwp.com.json

# Verify output exists
ls -lh output/deepstack_output-ggwp.com.json
# Should show ~50-200 KB JSON file

# Inspect JSON structure
cat output/deepstack_output-ggwp.com.json | head -50
```

**What to Verify:**
- [ ] JSON file created in `output/` directory
- [ ] Contains `collection_metadata`, `url_analysis_results`, `data` keys
- [ ] `data.marketing_technology_data_foundation.detected_martech_providers` has entries
- [ ] No errors in output
- [ ] File size reasonable (50-500 KB)

**Troubleshooting:**
- If timeout: Increase timeout in deepstack.py
- If browser error: Run `playwright install chromium`
- If connection error: Check URL is accessible

---

### STEP 2: Generate L3 Ground Truth Report

**Current Options:**

#### Option A: Manual (Gemini Gem)
```bash
# 1. Open DeepStack Collector Gemini Gem
# 2. Upload: output/deepstack_output-ggwp.com.json
# 3. Request: "Generate L3 Ground Truth report"
# 4. Save output as:
cd /Users/petergiordano/Documents/GitHub/meara/analysis_results
# Create file: GGWP_20251011_L3_GroundTruth.md
```

#### Option B: Railway Backend (Testing/Local)
```bash
cd /Users/petergiordano/Documents/GitHub/meara/deploy/railway_backend

# First-time setup
./setup.sh
source venv/bin/activate

# Start backend
python3 main.py
# Server runs at http://localhost:8000

# In another terminal, test API
./test_api.sh
# This will analyze GGWP and return DeepStack JSON
```

#### Option C: Skip for Testing (Use Existing DRB)
```bash
# If you have an existing DRB, skip Steps 2-3
# See STEP 4 Option C below
```

**What to Verify:**
- [ ] L3 report is 2500-4000 words
- [ ] Contains all 5 analytical areas:
  - Marketing Technology Data Foundation
  - Organic Presence & Content Signals
  - User Experience & Performance Clues
  - Conversion Funnel Effectiveness
  - Competitive Posture & Strategic Tests
- [ ] Includes "Areas for Deeper Investigation"
- [ ] Markdown formatted

**Expected L3 Structure:**
```markdown
# L3 Ground Truth: GGWP Client-Side Digital Footprint Analysis

## 1. Marketing Technology Data Foundation
### Detected Technologies
- Google Tag Manager (gtm.js)
- Google Analytics 4
...

## 2. Organic Presence & Content Signals
### SEO Optimization
- Meta tags present: title, description
...

[etc - 5 sections total]
```

---

### STEP 3: Generate Deep Research Brief

**This step requires a special AI Deep Research tool (Gemini Deep Research or Perplexity)**

```bash
cd /Users/petergiordano/Documents/GitHub/meara

# If running full pipeline (will pause here):
python deploy/5_full_pipeline.py \
  --company "GGWP" \
  --url "https://ggwp.com" \
  --l3-report "analysis_results/GGWP_20251011_L3_GroundTruth.md"

# This will create a research prompt file:
# analysis_results/GGWP_{timestamp}_DeepR_Prompt.md

# MANUAL STEP:
# 1. Open Gemini Deep Research (https://gemini.google.com - select Deep Research)
#    OR Perplexity Deep Research
# 2. Upload/paste the prompt from DeepR_Prompt.md
# 3. Execute the deep research (takes 5-7 minutes)
# 4. Save output as: analysis_results/GGWP_{timestamp}_DRB.md
```

**What the DeepR Prompt Contains:**
- Company information (GGWP, https://ggwp.com)
- L3 Ground Truth report (technical foundation)
- DeepR methodology (5 investigation areas)
- Output structure requirements

**Expected DRB Structure:**
```markdown
# Deep Research Brief: GGWP

## Executive Summary
[Key findings across 5 areas]

## 1. Unseen Competitive Landscape & Market Dynamics
[Research findings with citations]

## 2. True Voice of the Customer & Unarticulated Needs
[Research findings with citations]

## 3. Latent "Hidden Gems" & Underleveraged Assets
[Research findings with citations]

## 4. Peripheral Vision & Cross-Industry Inspiration
[Research findings with citations]

## 5. AI Engine Perception & "Digital Body Language"
[Research findings with citations]

## Strategic Imperatives
[Top 3-5 strategic recommendations]
```

**What to Verify:**
- [ ] DRB is 2000-3500 words (3-5 pages)
- [ ] All 5 investigation areas covered
- [ ] 15-25 citations with proper format
- [ ] Strategic imperatives section included
- [ ] Evidence-based (not generic)

---

### STEP 4: Run MEARA Analysis

Now the **fully automated** part begins. The 7 OpenAI Assistants will execute the 15-step workflow.

#### Option A: Full Pipeline (Start from DRB)
```bash
cd /Users/petergiordano/Documents/GitHub/meara

python deploy/5_full_pipeline.py \
  --company "GGWP" \
  --url "https://ggwp.com" \
  --drb "analysis_results/GGWP_20251011_DRB.md"
```

#### Option B: Simple Interface (Recommended)
```bash
cd /Users/petergiordano/Documents/GitHub/meara

python deploy/4_run_analysis.py \
  --company "GGWP" \
  --url "https://ggwp.com" \
  --drb "analysis_results/GGWP_20251011_DRB.md"
```

#### Option C: Direct Workflow (Advanced)
```bash
cd /Users/petergiordano/Documents/GitHub/meara/deploy

python 3_orchestrate_workflow.py "GGWP" "https://ggwp.com" \
  "../analysis_results/GGWP_20251011_DRB.md"
```

**Expected Output (Live Progress):**
```
====================================================================
MEARA Marketing Effectiveness Analysis
====================================================================

[1/14] Input Collection
  Company: GGWP
  URL: https://ggwp.com
  DRB Provided: Yes

[2/14] DRB Check
  Has DRB: True

[3/14] 🔬 Research Agent - Skipped (DRB provided)

[4/14] 📊 Evidence Collector - Gathering evidence across 9 dimensions
  Agent: MEARA Evidence Collector (asst_SLx0FHkidLwghd8WxZkQ5qL7)
  🤖 Assistant working...
  ✓ Completed in 62.3s

[5/14] 📈 Dimension Evaluator - Evaluating 9 dimensions
  Agent: MEARA Dimension Evaluator (asst_i8T1IuYOP9RfJqiQUszlEEeX)
  🤖 Assistant working...
  ✓ Completed in 58.7s

[6/14] Strategic Framework Search
  ✓ Framework loaded from vector store

[7/14] 🎯 Strategic Verifier - Checking 8 strategic elements
  Agent: MEARA Strategic Verifier (asst_P0wbDL7hcuEzrTE3I8Lwmzsg)
  🤖 Assistant working...
  ✓ Completed in 45.2s

[8/14] Strategic Priority Check
  High Priority Elements: 3
  Flag: True

[9/14] 🔍 Root Cause Analyst - Identifying 3-5 root causes
  Agent: MEARA Root Cause Analyst (asst_ALGVR7CIKRW8XxhXuykeoyHP)
  🤖 Assistant working...
  ✓ Completed in 51.8s

[10/14] 💡 Recommendation Builder - Developing 5-7 recommendations
  Agent: MEARA Recommendation Builder (asst_3yTtfyqiXyMSWmgLBjMrEiOI)
  🤖 Assistant working...
  ✓ Completed in 48.6s

[11/14] 📝 Report Assembler - Assembling final report
  Agent: MEARA Report Assembler (asst_R5BhmnZksgV0lYKUZ7p89xHA)
  🤖 Assistant working...
  ✓ Completed in 72.1s

[12/14] Citation Validator
  Citations found: 21
  ✓ Citation count acceptable

[13/14] PII Protection
  ✓ No PII detected

[14/14] Analysis Complete

============================================================
MEARA Analysis Complete!
============================================================
Total Time: 538.7s (9.0 minutes)

Step Timings:
  evidence_collector: 62.3s
  dimension_evaluator: 58.7s
  strategic_verifier: 45.2s
  rootcause_analyst: 51.8s
  recommendation_builder: 48.6s
  report_assembler: 72.1s

📁 Results saved:
  Report: /Users/petergiordano/Documents/GitHub/meara/analysis_results/GGWP_20251011_123456_report.md
  State: /Users/petergiordano/Documents/GitHub/meara/analysis_results/GGWP_20251011_123456_state.json

============================================================
✅ SUCCESS!
============================================================

Final report available at:
  /Users/petergiordano/Documents/GitHub/meara/analysis_results/GGWP_20251011_123456_report.md

You can now:
  1. View the report: open /Users/petergiordano/Documents/GitHub/meara/analysis_results/GGWP_20251011_123456_report.md
  2. Share with stakeholders
  3. Use insights to improve marketing effectiveness
```

**What to Verify:**
- [ ] All 15 steps complete without errors
- [ ] Each agent completes in reasonable time (30-90 seconds)
- [ ] Total time: 9-14 minutes
- [ ] Report file created
- [ ] State JSON saved

---

### STEP 5: Validate Output Quality

```bash
cd /Users/petergiordano/Documents/GitHub/meara/analysis_results

# Check report length
wc -l GGWP_20251011_123456_report.md
# Expected: 300-450 lines

# Count citations
grep -o '\[Source:' GGWP_20251011_123456_report.md | wc -l
# Expected: 20-40 citations

# View report structure
head -100 GGWP_20251011_123456_report.md

# Open in VS Code for full review
code GGWP_20251011_123456_report.md
```

**Expected Report Structure:**
```markdown
# GGWP - Marketing Effectiveness Analysis for GTM Scalability

## Executive Summary
[4-5 critical findings with evidence and quick wins]

## Consolidated Diligence Finding
[Executive verdict, 3 core pillars, path forward]

## Consolidated Action Plan
[3 strategic imperatives with key actions]

## Critical Issues Summary
[Top 3 issues with impact, root cause, solutions]

## Findings Relationship Map
```
Root Cause 1: Inadequate demand capture
  └─> Affects: [Brand Positioning] [Content & Messaging] [Lead Generation]
```

## Implementation Priority Matrix
```
HIGH IMPACT / QUICK WIN          | HIGH IMPACT / STRATEGIC INVESTMENT
• Fix conversion tracking        | • Rebuild thought leadership
• Add case studies              | • Implement Account-Based Marketing
                                |
--------------------------------+-----------------------------------
LOW IMPACT / CONSIDER           | LOW IMPACT / AVOID
• Update meta descriptions      | • Rebrand exercise
```

## Initial Findings by Dimension

### 1. Brand Positioning & Awareness
**Rating:** B- (Developing)
**Strengths:**
- Clear value proposition around gaming toxicity prevention
- Strong visual identity and messaging consistency
**Opportunities:**
- Limited brand awareness outside gaming community
- Underdeveloped thought leadership content

[8 more dimensions...]

## Root Cause Analysis

### Root Cause 1: Inadequate Demand Capture Systems
**Evidence:**
- No visible conversion tracking (GTM container empty) [Source: DeepStack analysis]
- Missing lead magnets on key pages
- Newsletter signup buried in footer
...

[2-4 more root causes...]

## Strategic Recommendations

### Recommendation 1: Implement Comprehensive Conversion Infrastructure
**Priority:** HIGH | Quick Win
**Implementation Steps:**
1. Deploy GTM with conversion event tracking (2 weeks)
2. Set up GA4 goals and funnels (1 week)
3. Implement lead scoring in CRM (3 weeks)
...

[4-6 more recommendations...]

## Phased Implementation Plan

### Phase 1 (Months 1-2): Foundation
**Goal:** Establish measurement and quick wins
**Initiatives:**
- Conversion tracking setup
- Case study content creation
- Email capture optimization
**Owner:** Marketing Operations

[3 more phases...]

## Detailed Dimension Analysis & Rubrics

### 1. Brand Positioning & Awareness - Detailed Rubric

| Sub-Element | Rating | Evidence | Gap Analysis |
|-------------|--------|----------|--------------|
| Brand Clarity | B | Strong gaming toxicity prevention messaging 'Quote' [Source: https://ggwp.com, accessed 2025-10-11] | Limited expansion beyond gaming vertical |
| Market Awareness | C+ | Low search volume for branded terms | Need thought leadership content |
| Differentiation | B- | Unique AI-powered approach | Competitors catching up |

[8 more dimension rubrics...]
```

**Quality Checklist:**
- [ ] **Length:** 300-450 lines ✅
- [ ] **Citations:** 20-40 citations with proper format `[Source: URL, accessed DATE]` ✅
- [ ] **Executive Summary:** 4-5 critical findings ✅
- [ ] **9 Dimensions:** All evaluated with ratings ✅
- [ ] **Root Causes:** 3-5 with 4-6 evidence points each ✅
- [ ] **Recommendations:** 5-7 with implementation steps ✅
- [ ] **Rubric Tables:** Detailed sub-element analysis for all 9 dimensions ✅
- [ ] **Priority Matrix:** 2x2 matrix present ✅
- [ ] **Relationship Map:** Shows root cause → dimension impacts ✅
- [ ] **No PII:** Email addresses redacted ✅

---

## 🔧 Railway Backend Integration

The Railway backend solves the "cloud scraping challenge" - running DeepStack Collector in the cloud with browser automation.

### Local Testing

```bash
cd /Users/petergiordano/Documents/GitHub/meara/deploy/railway_backend

# First-time setup (installs dependencies, Playwright, copies DeepStack)
./setup.sh

# Activate virtual environment
source venv/bin/activate

# Start FastAPI server
python3 main.py
# Server runs at http://localhost:8000

# In another terminal, test the API
./test_api.sh

# Or manual test:
curl http://localhost:8000/health

curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"company_name": "GGWP", "company_url": "https://ggwp.com"}'
# Returns: {"job_id": "uuid", "status": "queued"}

# Check status (poll every 2-5 seconds)
curl http://localhost:8000/api/status/{job_id}
# Returns: {"status": "running", "progress": 50}

# Get results when complete
curl http://localhost:8000/api/results/{job_id}
# Returns: {"result": {deepstack_json}}
```

### What Railway Backend Provides

**API Endpoints:**
- `POST /api/analyze` - Start DeepStack analysis (returns job_id)
- `GET /api/status/{job_id}` - Check progress (0-100%)
- `GET /api/results/{job_id}` - Get DeepStack JSON
- `GET /health` - Health check

**Why It Exists:**
- Vercel serverless functions timeout at 10-60 seconds
- DeepStack needs 2-3 minutes with Playwright browser
- Railway provides persistent backend ($5-20/month)
- Solves cloud web scraping challenge

**Current State:**
- ✅ Backend code complete
- ✅ Local testing scripts ready
- ⏭️ Not yet deployed to Railway
- ⏭️ Not yet integrated into full pipeline

**Future Integration:**
Once deployed to Railway, Step 1 can call the backend API instead of running deepstack.py locally:

```python
# In 5_full_pipeline.py, replace step_1_run_deepstack():
def step_1_run_deepstack(self):
    """Step 1: Run DeepStack via Railway API"""

    # Start analysis via Railway API
    response = requests.post(
        "https://your-app.railway.app/api/analyze",
        json={
            "company_name": self.company_name,
            "company_url": self.company_url
        }
    )
    job_id = response.json()["job_id"]

    # Poll for completion
    while True:
        status_response = requests.get(
            f"https://your-app.railway.app/api/status/{job_id}"
        )
        status = status_response.json()

        if status["status"] == "completed":
            # Get results
            results_response = requests.get(
                f"https://your-app.railway.app/api/results/{job_id}"
            )
            self.deepstack_json = results_response.json()["result"]
            break

        time.sleep(5)
```

---

## ⚙️ Configuration Files

### `.env` (MEARA root)
```bash
# Required
OPENAI_API_KEY=sk-proj-...

# Future (for L3 automation)
GEMINI_API_KEY=...
```

### `assistant_config.json` (deploy/)
```json
{
  "vector_store_id": "vs_68e95e3ceca08191a9bd1c3f4ba72977",
  "assistants": [
    {"key": "research_agent", "assistant_id": "asst_KMj8YNZ8gagc2IJOrnetiUv3"},
    {"key": "evidence_collector", "assistant_id": "asst_SLx0FHkidLwghd8WxZkQ5qL7"},
    {"key": "dimension_evaluator", "assistant_id": "asst_i8T1IuYOP9RfJqiQUszlEEeX"},
    {"key": "strategic_verifier", "assistant_id": "asst_P0wbDL7hcuEzrTE3I8Lwmzsg"},
    {"key": "rootcause_analyst", "assistant_id": "asst_ALGVR7CIKRW8XxhXuykeoyHP"},
    {"key": "recommendation_builder", "assistant_id": "asst_3yTtfyqiXyMSWmgLBjMrEiOI"},
    {"key": "report_assembler", "assistant_id": "asst_R5BhmnZksgV0lYKUZ7p89xHA"}
  ]
}
```

**To regenerate assistants:**
```bash
cd /Users/petergiordano/Documents/GitHub/meara/deploy
python 2b_deploy_assistants.py
# This will create/update assistant_config.json
```

---

## 🐛 Troubleshooting Guide

### Issue: DeepStack Timeout
**Symptom:** `TimeoutExpired` after 5 minutes
**Solution:**
```python
# In deepstack.py or 5_full_pipeline.py
result = subprocess.run(..., timeout=600)  # Increase to 10 minutes
```

### Issue: Playwright Browser Not Found
**Symptom:** `Executable doesn't exist at /path/to/chromium`
**Solution:**
```bash
playwright install chromium
```

### Issue: OpenAI Assistant Not Found
**Symptom:** `Assistant asst_xxx not found`
**Solution:**
```bash
# Redeploy assistants
cd /Users/petergiordano/Documents/GitHub/meara/deploy
python 2b_deploy_assistants.py
```

### Issue: Missing Citations in Report
**Symptom:** Guardrail shows `⚠ Warning: Low citation count`
**Status:** Fixed in latest assistant prompts
**Verify:** Assistants deployed after 2025-10-10

### Issue: Report Too Short
**Symptom:** Report < 200 lines
**Status:** Fixed - assistants now target 350-450 lines
**Verify:** Report includes detailed rubric tables for all 9 dimensions

### Issue: Railway Backend Connection Refused
**Symptom:** `Connection refused` when accessing localhost:8000
**Solution:**
```bash
# Check if server is running
ps aux | grep "python.*main.py"

# Restart server
cd /Users/petergiordano/Documents/GitHub/meara/deploy/railway_backend
source venv/bin/activate
python3 main.py
```

### Issue: Vector Store Files Not Found
**Symptom:** `FileNotFoundError` for framework documents
**Solution:**
```bash
# Verify framework docs exist
ls -la /Users/petergiordano/Documents/GitHub/meara/*.md

# Recreate vector store
cd /Users/petergiordano/Documents/GitHub/meara/deploy
python 1_setup_vector_store.py
```

### Issue: State JSON Shows Errors
**Symptom:** `state.json` shows `"status": "failed"`
**Solution:**
```bash
# Check state file for error details
cat analysis_results/*_state.json | jq '.error'

# Common causes:
# - Rate limit: Wait 1 minute, retry
# - Invalid input: Check DRB format
# - Assistant error: Redeploy assistants
```

---

## 📊 Expected Performance Metrics

| Metric | Target | Typical | Notes |
|--------|--------|---------|-------|
| **Step 1: DeepStack** | 2-3 min | 2-3 min | Consistent |
| **Step 2: L3 Generation** | 2-3 min | 2-3 min | Manual currently |
| **Step 3: Deep Research** | 5-7 min | 5-7 min | Manual Deep Research tool |
| **Step 4: MEARA Analysis** | 8-12 min | 8-12 min | Fully automated |
| **Total Pipeline** | 17-25 min | 20-25 min | With manual steps |
| **Report Length** | 300-450 lines | 303 lines | ✅ Target achieved |
| **Citation Count** | 20-40 | 21 | ✅ Target achieved |
| **Evidence per Dimension** | 5-8 | 6-7 | ✅ Good depth |
| **Root Causes** | 3-5 | 3-4 | ✅ Appropriate |
| **Recommendations** | 5-7 | 5-6 | ✅ Actionable |

---

## 🎯 Testing Checklist

### Pre-Test Verification
- [ ] Python 3.8+ installed
- [ ] OpenAI API key in `.env`
- [ ] Playwright chromium installed
- [ ] Assistant config file present with 6+ assistants
- [ ] Framework documents present in MEARA root

### Step 1: DeepStack
- [ ] `deepstack.py` runs without errors
- [ ] JSON output created in `output/` directory
- [ ] JSON contains all 5 analytical areas
- [ ] MarTech providers detected
- [ ] File size reasonable (50-500 KB)

### Step 2: L3 Report
- [ ] L3 report is 2500-4000 words
- [ ] All 5 analytical areas present
- [ ] Markdown formatted correctly
- [ ] Areas for deeper investigation included

### Step 3: Deep Research Brief
- [ ] DRB is 2000-3500 words
- [ ] All 5 investigation areas covered
- [ ] 15-25 citations with proper format
- [ ] Strategic imperatives section included

### Step 4: MEARA Analysis
- [ ] All 15 workflow steps complete
- [ ] No assistant errors
- [ ] Total time 9-14 minutes
- [ ] Report saved successfully

### Output Quality
- [ ] Report is 300-450 lines
- [ ] 20-40 citations with proper format
- [ ] All 9 dimensions evaluated
- [ ] 3-5 root causes with evidence
- [ ] 5-7 recommendations with steps
- [ ] Detailed rubric tables present
- [ ] Priority matrix included
- [ ] No PII in output

---

## 🚀 Quick Command Reference

```bash
# Complete workflow (with manual steps)
cd /Users/petergiordano/Documents/GitHub/deepstack
python3 deepstack.py -u https://ggwp.com

# Generate L3 (manual via Gemini Gem)
# Upload: output/deepstack_output-ggwp.com.json
# Request: "L3 Ground Truth report"
# Save: meara/analysis_results/GGWP_L3_GroundTruth.md

# Generate DRB (manual via Deep Research tool)
cd /Users/petergiordano/Documents/GitHub/meara
python deploy/5_full_pipeline.py -c "GGWP" -u "https://ggwp.com" \
  --l3-report "analysis_results/GGWP_L3_GroundTruth.md"
# Follow instructions to execute Deep Research
# Save: analysis_results/GGWP_DRB.md

# Run MEARA analysis
python deploy/4_run_analysis.py -c "GGWP" -u "https://ggwp.com" \
  --drb "analysis_results/GGWP_DRB.md"

# Test Railway backend (local)
cd /Users/petergiordano/Documents/GitHub/meara/deploy/railway_backend
./setup.sh
source venv/bin/activate
python3 main.py
# In another terminal:
./test_api.sh

# View results
cd /Users/petergiordano/Documents/GitHub/meara/analysis_results
code GGWP_*_report.md
```

---

## 📚 Additional Resources

| Document | Location | Purpose |
|----------|----------|---------|
| **Pipeline Overview** | `PIPELINE_AUTOMATION.md` | High-level architecture |
| **Deployment Guide** | `deploy/README.md` | Assistant setup |
| **Railway Backend** | `deploy/RAILWAY_BACKEND_COMPLETE.md` | Cloud scraping solution |
| **Workflow Code** | `deploy/3_orchestrate_workflow.py` | 15-step implementation |
| **Full Pipeline** | `deploy/5_full_pipeline.py` | End-to-end automation |
| **DeepStack Workflow** | `../deepstack-workflow/README.md` | Future automation plan |
| **API Integration Plan** | `../deepstack-workflow/API_IMPLEMENTATION_PLAN.md` | Perplexity/Gemini APIs |

---

## 🎓 Key Insights for Testing

### What's Fully Automated
✅ **DeepStack Collector** - Python script runs locally
✅ **MEARA Analysis** - 7 OpenAI Assistants execute 15-step workflow
✅ **Railway Backend** - FastAPI service for cloud scraping (ready, not deployed)

### What's Manual (Special AI Tools Required)
⏸️ **L3 Generation** - Requires Gemini Gem (or Railway backend for testing)
⏸️ **Deep Research** - Requires Gemini Deep Research or Perplexity Deep Research
**Why?** These are special AI capabilities beyond regular API calls

### Future Automation Path
1. **Gemini API** for L3 generation (code ready in API_IMPLEMENTATION_PLAN.md)
2. **Perplexity API** (`sonar-deep-research` model) for Deep Research ($5/query)
3. **Complete automation** - Zero manual steps, web interface for business users

### Testing Strategy
1. **Start with Step 4 only** - Use existing DRB to test MEARA workflow
2. **Add Step 1** - Test DeepStack Collector locally
3. **Test Railway Backend** - Verify cloud scraping works
4. **End-to-end** - Run all steps with manual L3/DRB generation
5. **Monitor quality** - Verify 300+ lines, 20+ citations

---

**Ready to Test!** Start with Step 4 using an existing DRB to verify the MEARA workflow, then work backwards through the pipeline.
