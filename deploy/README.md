# MEARA Agent Builder Deployment Guide

Automated deployment scripts for translating MEARA's modular architecture into OpenAI Agent Builder workflows.

## 📋 Prerequisites

- **OpenAI API Key** with Agent Builder beta access
- **Python 3.8+** installed
- **OpenAI Python SDK** v1.0+
- **MEARA framework documents** in parent directory

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
pip install openai
export OPENAI_API_KEY="your-api-key-here"
```

### Step 2: Create Vector Store

```bash
python 1_setup_vector_store.py
```

**What this does:**
- Creates a vector store named "MEARA_Framework_Knowledge"
- Uploads all 8 MEARA framework documents from `meara_doc_modules/`:
  - MEARA_System_Instructions.md
  - Instruct_Executive_Summary.md
  - Instruct_Marketing_Analysis.md
  - Marketing_Analysis_Methodology.md
  - Marketing_Analysis_Rubrics.md
  - Strategic_Elements_Framework.md
  - Scale_Brand_Design_and_Color_Palette_Guidelines.md
  - Prompt_for_DeepR_B2B_SaaS_Marketing_Insights.md
- Configures optimal chunking (800 tokens, 400 overlap)
- Saves vector store ID for deployment

**Output:**
```
✓ Vector store created: vs_abc123...
✓ 8 files uploaded successfully
VECTOR_STORE_ID='vs_abc123...'
```

**Copy the `VECTOR_STORE_ID` - you'll need it for Step 3!**

### Step 3: Deploy Workflow

1. Open `2_deploy_workflow.py`
2. Replace this line:
   ```python
   VECTOR_STORE_ID = "PASTE_YOUR_VECTOR_STORE_ID_HERE"
   ```
   With your actual vector store ID:
   ```python
   VECTOR_STORE_ID = "vs_abc123..."
   ```

3. Run deployment:
   ```bash
   python 2_deploy_workflow.py
   ```

**What this does:**
- Creates 15-node workflow in Agent Builder
- Configures 7 specialist agents with framework-embedded instructions
- Sets up logic nodes for workflow orchestration
- Connects File Search nodes to vector store
- Adds guardrails for citation validation and PII protection

**Output:**
```
✓ Workflow deployed successfully!
Workflow ID: wf_xyz789...
Nodes: 15
Edges: 15
```

### Step 4: Test Workflow

```bash
python 3_test_workflow.py
```

**What this does:**
- Runs 3 test cases:
  1. Basic SaaS (no Deep Research Brief)
  2. AI company with DRB
  3. Enterprise B2B with complex buying committee
- Validates all expected outputs
- Checks citation format compliance
- Verifies strategic framework application
- Saves results to `test_results/` directory

**Expected output:**
```
3/3 tests passed
🎉 All tests passed! Workflow is ready for production.
```

## 🏗️ Architecture Overview

### 15-Node Workflow Structure

```
START (Input Collection)
  ↓
IF/ELSE: DRB Check
  ├→ [No DRB] → AGENT: Research Agent (creates DRB)
  └→ [Has DRB] → AGENT: Evidence Collector
                    ↓
                AGENT: Dimension Evaluator
                    ↓
                FILE SEARCH: Strategic Framework
                    ↓
                AGENT: Strategic Verifier
                    ↓
                IF/ELSE: High Priority Elements?
                    ↓
                AGENT: Root Cause Analyst
                    ↓
                AGENT: Recommendation Builder
                    ↓
                AGENT: Report Assembler (Main Report: 250-350 lines)
                    ↓
                AGENT: Table Generator (9 Detailed Tables: 150-200 lines)
                    ↓
                GUARDRAIL: Citation Validator
                    ↓
                GUARDRAIL: PII Protection
                    ↓
                END (Final Report)
```

### Agent Configuration Details

#### 1. **Research Agent** (Optional - runs if no DRB provided)
- **Model:** gpt-4o
- **Temperature:** 0.3
- **Tools:** Web Search, File Search
- **Purpose:** Execute Deep Research Protocol
- **Output:** Deep Research Brief with Breakthrough Sparks

#### 2. **Evidence Collector**
- **Model:** gpt-4o
- **Temperature:** 0.2
- **Tools:** Web Search, File Search
- **Purpose:** Gather current evidence across 9 dimensions
- **Output:** Structured evidence collection with citations

#### 3. **Dimension Evaluator**
- **Model:** gpt-4o
- **Temperature:** 0.3
- **Tools:** File Search (Rubrics access)
- **Purpose:** Evaluate all 9 marketing dimensions
- **Output:** Ratings, strengths, opportunities per dimension

#### 4. **Strategic Verifier**
- **Model:** gpt-4o
- **Temperature:** 0.2
- **Tools:** File Search (Framework access)
- **Purpose:** Apply Strategic Elements Framework
- **Output:** Strategic verification table with priorities

#### 5. **Root Cause Analyst**
- **Model:** gpt-4o
- **Temperature:** 0.3
- **Tools:** File Search
- **Purpose:** Identify 3-5 fundamental root causes
- **Output:** Root causes with cross-dimensional impacts

#### 6. **Recommendation Builder**
- **Model:** gpt-4o
- **Temperature:** 0.4
- **Tools:** File Search
- **Purpose:** Develop strategic recommendations
- **Output:** 5-7 recommendations with priority matrix

#### 7. **Report Assembler**
- **Model:** gpt-4o
- **Temperature:** 0.3
- **Tools:** File Search
- **Purpose:** Assemble main report body (250-350 lines)
- **Output:** Formatted markdown report (without detailed tables)

#### 8. **Table Generator**
- **Model:** gpt-4o
- **Temperature:** 0.2
- **Tools:** File Search
- **Purpose:** Generate 9 detailed dimension analysis tables as appendix
- **Output:** Comprehensive tables with sub-element ratings and evidence

### Logic Nodes (CEL Expressions)

**DRB Check:**
```cel
input.deep_research_brief != null && input.deep_research_brief.length() > 100
```

**Strategic Priority Check:**
```cel
state.strategic_verification.high_priority_count > 0
```

### State Variables

Data passed between agents via state:
- `company_name`
- `company_url`
- `deep_research_brief`
- `evidence_collection`
- `dimension_evaluations`
- `strategic_verification`
- `root_causes`
- `recommendations`
- `final_report`

## 📊 Cost Analysis

### Per Analysis Costs

**Vector Store:**
- Storage: ~5MB = $0.0005/day ($0.015/month)
- Queries: Included in agent calls

**Agent Execution (typical analysis):**
- Research Agent: ~100K tokens = $1.50
- Evidence Collector: ~80K tokens = $1.20
- Dimension Evaluator: ~60K tokens = $0.90
- Strategic Verifier: ~30K tokens = $0.45
- Root Cause Analyst: ~40K tokens = $0.60
- Recommendation Builder: ~50K tokens = $0.75
- Report Assembler: ~50K tokens = $0.75
- Table Generator: ~40K tokens = $0.60

**Total per analysis: ~$6.75**

**Monthly (10 analyses):** ~$65

## 🔧 Customization

### Modifying Agent Instructions

Edit instructions in `2_deploy_workflow.py`:

```python
AGENT_INSTRUCTIONS = {
    "evidence_collector": """
    Your custom instructions here...
    """
}
```

### Adjusting Model Settings

Change model or temperature:

```python
workflow["nodes"].append({
    "id": "evidence_collector",
    "type": "agent",
    "config": {
        "model": "gpt-4o-mini",  # Use smaller model
        "temperature": 0.1,       # More deterministic
        ...
    }
})
```

### Adding Custom Logic

Insert new If/Else nodes:

```python
workflow["nodes"].append({
    "id": "custom_check",
    "type": "if_else",
    "config": {
        "condition": "state.dimension_evaluations.ai_rating == 'Critical Gap'",
        "true_branch": "ai_specialist_agent",
        "false_branch": "continue_workflow"
    }
})
```

## 🐛 Troubleshooting

### Issue: Vector Store Upload Fails

**Symptom:** "File upload timed out"

**Solution:**
```bash
# Check file sizes
ls -lh ../*.md

# If Methodology.md > 10MB, split it:
python split_large_docs.py
```

### Issue: Agent Instructions Too Long

**Symptom:** "Instructions exceed token limit"

**Solution:**
- Move detailed instructions to vector store
- Reference in agent instructions:
  ```python
  instructions = """
  Refer to Marketing Analysis Methodology in vector store.
  Execute Step 2: Evidence Collection.
  """
  ```

### Issue: CEL Expression Errors

**Symptom:** "Invalid CEL syntax"

**Check:**
- No undefined variables
- Correct comparison operators
- Proper null handling

**Example Fix:**
```python
# ✗ Bad
"state.drb.length > 100"

# ✓ Good
"state.drb != null && state.drb.length() > 100"
```

### Issue: Missing Citations in Output

**Symptom:** Guardrail blocking output

**Solution:**
- Lower hallucination detection threshold
- Add citation reminder to agent instructions:
  ```python
  CRITICAL: Every finding MUST include:
  'Quote' [Source: URL, accessed YYYY-MM-DD]
  ```

## 📈 Monitoring & Optimization

### Track Workflow Performance

```python
# Get workflow run statistics
runs = client.beta.workflows.runs.list(workflow_id=workflow_id)

for run in runs:
    print(f"Run {run.id}:")
    print(f"  Duration: {run.elapsed_time}s")
    print(f"  Tokens: {run.total_tokens}")
    print(f"  Cost: ${run.total_cost}")
```

### Optimize Token Usage

**Strategies:**
1. Use `gpt-4o-mini` for simple tasks (Evidence Collection, Report Assembly)
2. Reduce temperature for deterministic outputs
3. Limit File Search `max_results` to 10-15
4. Cache vector store queries when possible

**Estimated savings: 30-40% cost reduction**

### Performance Benchmarks

| Metric | Target | Typical |
|--------|--------|---------|
| Total Duration | <10 min | 8-12 min |
| Token Usage | <500K | 400-600K |
| Cost per Analysis | <$5 | $4.50-6.50 |
| Citation Count | >20 | 25-40 |

## 🔐 Security Best Practices

1. **API Key Management**
   ```bash
   # Use environment variables
   export OPENAI_API_KEY="sk-..."

   # Or use .env file (add to .gitignore)
   echo "OPENAI_API_KEY=sk-..." > .env
   ```

2. **PII Protection**
   - Guardrail automatically redacts PII
   - Review outputs before sharing
   - Use separate vector store per client if needed

3. **Access Control**
   - Restrict workflow access to authorized users
   - Use OpenAI organization permissions
   - Audit workflow runs regularly

## 📚 Additional Resources

- [OpenAI Agent Builder Docs](https://platform.openai.com/docs/guides/agents/agent-builder)
- [File Search Best Practices](https://platform.openai.com/docs/guides/agents/retrieval)
- [CEL Expression Guide](https://github.com/google/cel-spec)
- [MEARA Implementation Guide](../MEARA_OpenAI_Agent_Builder_Implementation.md)

## 🆘 Support

**Issues with deployment scripts:**
1. Check logs in `deploy/logs/`
2. Review test results in `test_results/`
3. Verify vector store status in OpenAI dashboard

**Questions about MEARA framework:**
1. Review original implementation guide
2. Check framework documents in parent directory
3. Consult methodology for step-by-step process

## 📝 Next Steps

After successful deployment:

1. **Run Production Analysis**
   ```bash
   # In Agent Builder UI
   - Input company name and URL
   - Optionally provide Deep Research Brief
   - Run workflow
   - Download final report
   ```

2. **Integrate with External Tools**
   - Connect to Google Drive for report storage
   - Add Slack notifications for completion
   - Integrate with CRM for company data

3. **Scale for Team Use**
   - Create template workflows for common scenarios
   - Set up batch processing for multiple companies
   - Build dashboard for tracking analysis status

---

**Version:** 1.0
**Last Updated:** 2025-10-10
**Maintained By:** MEARA Team
