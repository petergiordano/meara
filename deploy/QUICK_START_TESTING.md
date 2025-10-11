# MEARA Quick Start Testing Guide

**For:** New Claude Code AI in VS Code
**Purpose:** Get testing immediately without reading the full guide

---

## 🎯 What You Need to Know

**The MEARA pipeline has 4 steps:**
1. DeepStack Collector → JSON (automated)
2. L3 Ground Truth → Markdown (manual via Gemini Gem)
3. Deep Research Brief → Markdown (manual via Deep Research tool)
4. MEARA Analysis → Final Report (automated - 6 AI agents)

**Location of everything:**
- DeepStack: `/Users/petergiordano/Documents/GitHub/deepstack/`
- MEARA: `/Users/petergiordano/Documents/GitHub/meara/`
- Railway Backend: `/Users/petergiordano/Documents/GitHub/meara/deploy/railway_backend/`

---

## ⚡ Fastest Way to Test

### Option 1: Test MEARA Only (Recommended First)

If you already have a Deep Research Brief:

```bash
cd /Users/petergiordano/Documents/GitHub/meara

python deploy/4_run_analysis.py \
  --company "GGWP" \
  --url "https://ggwp.com" \
  --drb "path/to/existing_drb.md"

# Takes 8-12 minutes
# Outputs: analysis_results/GGWP_{timestamp}_report.md
```

**This tests:**
- ✅ 6 OpenAI Assistants working
- ✅ 14-step workflow execution
- ✅ Report generation (300+ lines, 20+ citations)

---

### Option 2: Test DeepStack Only

```bash
cd /Users/petergiordano/Documents/GitHub/deepstack

python3 deepstack.py -u https://ggwp.com

# Takes 2-3 minutes
# Outputs: output/deepstack_output-ggwp.com.json
```

**This tests:**
- ✅ Website crawling with Playwright
- ✅ MarTech detection
- ✅ UX/performance analysis

---

### Option 3: Test Railway Backend

```bash
cd /Users/petergiordano/Documents/GitHub/meara/deploy/railway_backend

# First time setup
./setup.sh
source venv/bin/activate

# Start server
python3 main.py
# Server at http://localhost:8000

# In another terminal, test
./test_api.sh
```

**This tests:**
- ✅ FastAPI backend
- ✅ Background job processing
- ✅ DeepStack integration in cloud-ready format

---

## 🔍 What to Check

### MEARA Report Quality
```bash
cd /Users/petergiordano/Documents/GitHub/meara/analysis_results

# Check length
wc -l GGWP_*_report.md
# Want: 300-450 lines

# Count citations
grep -o '\[Source:' GGWP_*_report.md | wc -l
# Want: 20-40 citations

# View
code GGWP_*_report.md
```

**Report should have:**
- Executive Summary
- 9 Dimension evaluations
- 3-5 Root causes with evidence
- 5-7 Recommendations
- Detailed rubric tables
- Priority matrix

---

## 🐛 Quick Fixes

### Playwright Not Found
```bash
playwright install chromium
```

### Assistant Not Found
```bash
cd /Users/petergiordano/Documents/GitHub/meara/deploy
python 2b_deploy_assistants.py
```

### Missing .env
```bash
cd /Users/petergiordano/Documents/GitHub/meara
echo "OPENAI_API_KEY=sk-proj-your-key-here" > .env
```

---

## 📖 Full Documentation

**For complete details, see:**
`/Users/petergiordano/Documents/GitHub/meara/deploy/CLAUDE_CODE_TESTING_GUIDE.md`

Contains:
- Complete architecture diagrams
- Step-by-step testing workflow
- Expected outputs at each stage
- Troubleshooting guide
- Performance metrics
- Configuration details

---

## 💡 Testing Strategy

**Recommended Order:**

1. **Test MEARA workflow** (Step 4 only) - Verify 6 agents work
2. **Test DeepStack** (Step 1 only) - Verify website analysis works
3. **Test Railway Backend** - Verify cloud-ready backend works
4. **End-to-end** - Run full pipeline with manual L3/DRB steps

**Why this order?**
- MEARA is the most complex part (6 agents, 14 steps)
- DeepStack is independent and simple
- Railway backend is optional (for cloud deployment)
- Full pipeline requires manual steps (L3 + DRB)

---

## 🎯 Success Criteria

✅ **MEARA Test Passes If:**
- All 14 steps complete without errors
- Report is 300+ lines
- Report has 20+ citations
- Total time: 8-12 minutes
- Output saved in `analysis_results/`

✅ **DeepStack Test Passes If:**
- JSON file created in `output/`
- Contains 5 analytical areas
- MarTech providers detected
- File size: 50-500 KB
- Total time: 2-3 minutes

✅ **Railway Backend Passes If:**
- API health check responds
- Can start analysis (returns job_id)
- Job status updates with progress
- Returns DeepStack JSON when complete
- Total time: 2-3 minutes per analysis

---

**Start Testing:** Pick Option 1, 2, or 3 above and run the commands!
