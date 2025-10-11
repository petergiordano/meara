# MEARA Assistants API Deployment Guide

## ✅ Deployment Status: COMPLETE

**Date:** 2025-10-10
**Method:** Assistants API (Option 2)
**Status:** 7 assistants deployed, orchestration scripts created

---

## 📦 What Was Deployed

### Vector Store
- **ID:** `vs_68e95e3ceca08191a9bd1c3f4ba72977`
- **Name:** MEARA_Framework_Knowledge
- **Files:** 6 framework documents uploaded
- **Status:** ✅ Active

### Assistants Created

| # | Name | Assistant ID | Model | Temp |
|---|------|--------------|-------|------|
| 1 | MEARA Research Agent | `asst_kj9XIF8vHPU4uvnfO2SFROMI` | gpt-4o | 0.3 |
| 2 | MEARA Evidence Collector | `asst_1loxvdqDrBzmE05YmMQWCSJ8` | gpt-4o | 0.2 |
| 3 | MEARA Dimension Evaluator | `asst_pv1z8KCB0fR7CWIZHg4kCnE0` | gpt-4o | 0.3 |
| 4 | MEARA Strategic Verifier | `asst_1IdBS3M8hbauF5QKtorTE41j` | gpt-4o | 0.2 |
| 5 | MEARA Root Cause Analyst | `asst_DikiQa7WlelN8Wy2xUmBKlps` | gpt-4o | 0.3 |
| 6 | MEARA Recommendation Builder | `asst_dippMOM24x4rXz2fR53xU2K0` | gpt-4o | 0.4 |
| 7 | MEARA Report Assembler | `asst_lyKHCq3B3vUU0vTFQNimkVI6` | gpt-4o | 0.3 |

All assistants are connected to the vector store for framework knowledge access.

---

## 🚀 How to Run MEARA Analysis

### Quick Start

```bash
# Basic analysis (will create Deep Research Brief automatically)
python 4_run_analysis.py --company "Acme Corp" --url "https://acme.com"

# Analysis with existing Deep Research Brief
python 4_run_analysis.py --company "Acme Corp" --url "https://acme.com" --drb drb.txt
```

### Workflow Execution

The orchestration script (`3_orchestrate_workflow.py`) implements the complete 14-node workflow:

1. **Input Collection** - Captures company name, URL, optional DRB
2. **DRB Check** - Logic to determine if Deep Research needed
3. **Research Agent** - Creates DRB (if needed)
4. **Evidence Collector** - Gathers evidence across 9 dimensions
5. **Dimension Evaluator** - Rates marketing effectiveness
6. **Strategic Framework Search** - Loads framework from vector store
7. **Strategic Verifier** - Checks 8 strategic elements
8. **Strategic Priority Check** - Logic to flag high-priority elements
9. **Root Cause Analyst** - Identifies 3-5 root causes
10. **Recommendation Builder** - Develops 5-7 strategic recommendations
11. **Report Assembler** - Creates complete markdown report
12. **Citation Validator** - Validates citation format and count
13. **PII Protection** - Redacts any personal information
14. **END** - Saves results to files

---

## 📂 Output

Analysis results are saved to `analysis_results/` directory:

- `{CompanyName}_{Timestamp}_report.md` - Final markdown report
- `{CompanyName}_{Timestamp}_state.json` - Complete analysis state (all intermediate results)

---

## 🔧 Scripts Overview

### Deployment Scripts

| Script | Purpose | Status |
|--------|---------|--------|
| `1_setup_vector_store.py` | Upload framework docs to vector store | ✅ Complete |
| `2_deploy_workflow.py` | Create Agent Builder workflow config | ⚠️ Not used (no API available) |
| `2b_deploy_assistants.py` | Deploy 7 assistants via Assistants API | ✅ Complete |

### Execution Scripts

| Script | Purpose |
|--------|---------|
| `3_orchestrate_workflow.py` | Orchestrate all 7 assistants following workflow logic |
| `4_run_analysis.py` | Simple CLI interface for running analysis |

### Configuration Files

| File | Purpose |
|------|---------|
| `assistant_config.json` | Assistant IDs and configuration |
| `vector_store_config.txt` | Vector store ID |
| `.env` (parent dir) | OpenAI API key |

---

## ⚙️ How Orchestration Works

The orchestration script (`3_orchestrate_workflow.py`) acts as the workflow engine:

1. **State Management** - `WorkflowState` class tracks data between steps
2. **Sequential Execution** - Calls assistants in correct order
3. **Logic Implementation** - Python if/else statements for workflow logic:
   - DRB Check: `if drb and len(drb) > 100`
   - Strategic Priority Check: `if high_priority_count > 0`
4. **Data Passing** - Each assistant receives relevant state data as JSON
5. **Response Parsing** - Extracts JSON from assistant responses
6. **Guardrails** - Python functions for citation validation and PII protection
7. **Result Saving** - Writes final report and complete state to files

---

## 💰 Cost Estimate

**Per Analysis:**
- Research Agent: ~100K tokens = $1.50
- Evidence Collector: ~80K tokens = $1.20
- Dimension Evaluator: ~60K tokens = $0.90
- Strategic Verifier: ~30K tokens = $0.45
- Root Cause Analyst: ~40K tokens = $0.60
- Recommendation Builder: ~50K tokens = $0.75
- Report Assembler: ~70K tokens = $1.05

**Total: ~$6.45/analysis**

**Vector Store:** $0.015/month

---

## 🔍 Monitoring

View assistants in OpenAI Dashboard:
1. Go to https://platform.openai.com/assistants
2. You'll see all 7 MEARA assistants listed
3. Click any assistant to view:
   - Configuration
   - Connected vector store
   - Usage statistics

---

## 🛠️ Maintenance

### Update Assistant Instructions

Edit instructions in `2b_deploy_assistants.py` and redeploy:

```bash
python 2b_deploy_assistants.py
```

Note: This creates NEW assistants. To update existing ones, you'll need to use the OpenAI API:

```python
client.beta.assistants.update(
    assistant_id="asst_xxx",
    instructions="Updated instructions..."
)
```

### Update Framework Documents

1. Edit framework .md files in parent directory
2. Re-run vector store setup:
   ```bash
   python 1_setup_vector_store.py
   ```
3. Update `VECTOR_STORE_ID` in scripts
4. Redeploy assistants with new vector store ID

---

## 🐛 Troubleshooting

### Issue: "Assistant configuration not found"
**Solution:** Run `python 2b_deploy_assistants.py` to create assistants

### Issue: "API key not found"
**Solution:** Check `.env` file has: `OPENAI_API_KEY=sk-...`

### Issue: Assistant runs timeout
**Solution:** Increase timeout in `3_orchestrate_workflow.py` line ~90:
```python
while run.status in ["queued", "in_progress", "cancelling"]:
    time.sleep(2)  # Increase from 1 to 2 seconds
```

### Issue: JSON parsing errors
**Solution:** Assistant may be returning markdown. Check response format in `2b_deploy_assistants.py`

---

## 📊 Next Steps

1. **Test with Real Company**
   ```bash
   python 4_run_analysis.py -c "YourCompany" -u "https://yourcompany.com"
   ```

2. **Review Output Quality**
   - Check citation count (should be 20+)
   - Verify all 9 dimensions evaluated
   - Confirm 5-7 recommendations present

3. **Optimize for Performance**
   - Use gpt-4o-mini for simpler tasks (Evidence Collection, Report Assembly)
   - Adjust temperatures based on output quality
   - Cache common vector store queries

4. **Scale Usage**
   - Batch process multiple companies
   - Integrate with CRM systems
   - Build API wrapper for team access

---

## 📝 Notes

- **Agent Builder UI:** Assistants created via API won't appear in Agent Builder workflow canvas
- **Workflow Visualization:** The orchestration is code-based, not visual
- **Manual Updates:** Agent Builder workflows must be built manually in UI
- **Flexibility:** Code-based orchestration is easier to version control and modify

---

**Deployment Complete!** 🎉

Your MEARA system is now ready to analyze B2B SaaS marketing effectiveness.
