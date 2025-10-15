# MEARA Framework Documentation

This directory contains the core instruction sets and methodologies that define how MEARA operates.

## Current Framework (v6.0)

**Version:** 6.0 - GTM Scalability Analysis
**Date:** October 2025
**Focus:** Go-To-Market scalability bottlenecks and strategic growth levers

### Core Documents

1. **GTM_Scalability_System_Instructions.md**
   - Main system role and orchestration instructions
   - Defines MEARA as a GTM Scalability Analysis agent
   - Authorizes web search and evidence collection protocols

2. **Instruct_Marketing_Analysis.md**
   - Primary analysis generation instructions
   - Output formatting and reporting structure
   - Evidence requirements and citation standards

3. **Instruct_Executive_Summary.md**
   - "Craig Method" for executive summary generation
   - Narrative-driven synthesis approach
   - Pillar-based storytelling framework

4. **Marketing_Analysis_Methodology.md**
   - 9-step analysis workflow
   - Evidence collection protocol
   - Scalability bottleneck identification process

5. **Marketing_Analysis_Rubrics.md**
   - Detailed evaluation criteria for 9 dimensions
   - Rating scales and qualitative assessment guidelines
   - Examples and benchmark standards

6. **Strategic_Elements_Framework.md**
   - 8 strategic elements to verify
   - Priority assessment criteria
   - Breakthrough opportunity identification

7. **Prompt_for_DeepR_B2B_SaaS_Marketing_Insights.md**
   - Deep Research Brief generation instructions
   - 5 research areas and investigation protocols
   - Output structure and evidence requirements

## Key Terminology Changes (v5 → v6)

| v5.0 Term | v6.0 Term |
|-----------|-----------|
| Marketing Effectiveness Analysis | GTM Scalability Analysis |
| Assessment | Analysis |
| Root Cause Analysis | Scalability Bottleneck Analysis |
| Recommendations | Strategic Growth Levers |

## Version History

### v6.0 (October 2025) - Current
- Shifted focus from marketing effectiveness to GTM scalability
- Renamed Root Cause → Scalability Bottleneck
- Renamed Recommendations → Strategic Growth Levers
- Updated all system instructions and prompts

### v5.0 (Archived)
- Original "Marketing Effectiveness Analysis" framework
- See `archive/v5/` for historical reference

## Usage

These documents are uploaded to the OpenAI Assistants API vector store and referenced by all 8 MEARA assistants during analysis execution. Updates to this framework require:

1. Editing the markdown files in this directory
2. Running `deploy/scripts/update_vector_store_v6.py` to upload changes
3. Updating assistant instructions if terminology changes
4. Testing full analysis workflow to verify integration

## Related Documentation

- **Assistant Configuration:** `deploy/assistant_config.json`
- **Deployment Guide:** `deploy/ASSISTANTS_API_DEPLOYMENT_GUIDE.md`
- **Workflow Orchestration:** `deploy/railway_backend/meara_orchestrator.py`
