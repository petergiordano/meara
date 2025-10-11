# MEARA Agent Builder Deployment Checklist

Use this checklist to ensure successful deployment of MEARA to OpenAI Agent Builder.

## Pre-Deployment

### 1. Environment Setup
- [ ] Python 3.8+ installed
- [ ] OpenAI API key obtained
- [ ] Agent Builder beta access confirmed
- [ ] Dependencies installed: `pip install -r requirements.txt`
- [ ] API key set: `export OPENAI_API_KEY="sk-..."`

### 2. Framework Documents Ready (in meara_doc_modules/)
- [ ] MEARA_System_Instructions.md exists
- [ ] Instruct_Executive_Summary.md exists
- [ ] Instruct_Marketing_Analysis.md exists
- [ ] Marketing_Analysis_Methodology.md exists
- [ ] Marketing_Analysis_Rubrics.md exists
- [ ] Strategic_Elements_Framework.md exists
- [ ] Scale_Brand_Design_and_Color_Palette_Guidelines.md exists
- [ ] Prompt_for_DeepR_B2B_SaaS_Marketing_Insights.md exists

### 3. File Validation
- [ ] All documents are valid markdown
- [ ] No files exceed 512MB
- [ ] Total content < 5M tokens
- [ ] Documents contain proper formatting

## Deployment Steps

### Step 1: Vector Store Creation
- [ ] Run: `python 1_setup_vector_store.py`
- [ ] Verify: "✓ Vector store created" message
- [ ] Verify: All 8 files uploaded successfully from meara_doc_modules/
- [ ] Copy: VECTOR_STORE_ID value
- [ ] Save: Vector store ID in safe location

**Vector Store ID:** `_________________________`

### Step 2: Workflow Deployment
- [ ] Open: `2_deploy_workflow.py`
- [ ] Update: VECTOR_STORE_ID with your ID
- [ ] Run: `python 2_deploy_workflow.py`
- [ ] Verify: "✓ Workflow deployed successfully"
- [ ] Copy: Workflow ID
- [ ] Save: Workflow ID in safe location

**Workflow ID:** `_________________________`

### Step 3: Testing
- [ ] Run: `python 3_test_workflow.py`
- [ ] Input: Your workflow ID
- [ ] Verify: Test 1 passes (Basic SaaS)
- [ ] Verify: Test 2 passes (AI Company with DRB)
- [ ] Verify: Test 3 passes (Enterprise B2B)
- [ ] Check: All expected outputs present
- [ ] Check: Citation format valid (20+ citations)
- [ ] Check: Strategic elements assessed (all 8)
- [ ] Review: Test results in `test_results/` folder

**Test Results:**
- Test 1: ☐ Pass ☐ Fail
- Test 2: ☐ Pass ☐ Fail
- Test 3: ☐ Pass ☐ Fail

## Post-Deployment

### 4. Configuration Verification
- [ ] Agent Builder UI accessible
- [ ] Workflow visible in canvas
- [ ] All 14 nodes present
- [ ] Node connections correct
- [ ] Vector store linked properly
- [ ] State variables configured

### 5. Production Readiness
- [ ] Run sample analysis with real company
- [ ] Verify output format matches expectations
- [ ] Check report completeness (all sections)
- [ ] Validate citation quality
- [ ] Review recommendation quality
- [ ] Confirm cost within budget (~$5-7/analysis)

### 6. Documentation
- [ ] Save workflow configuration backup
- [ ] Document any customizations made
- [ ] Record deployment date and version
- [ ] Share workflow ID with team
- [ ] Update internal wiki/docs

## Ongoing Maintenance

### Weekly
- [ ] Review workflow run statistics
- [ ] Monitor error rates
- [ ] Check cost trends
- [ ] Review output quality samples

### Monthly
- [ ] Update framework documents if needed
- [ ] Re-upload to vector store
- [ ] Test workflow with updates
- [ ] Optimize based on usage patterns

### Quarterly
- [ ] Full framework review
- [ ] Consider model upgrades (gpt-5, etc.)
- [ ] Evaluate new Agent Builder features
- [ ] Gather user feedback
- [ ] Plan enhancements

## Troubleshooting Reference

### Common Issues

**Issue: Vector store creation fails**
- Check file sizes (max 512MB)
- Verify file format (valid markdown)
- Confirm API key has permissions
- Try uploading files individually

**Issue: Workflow deployment fails**
- Verify vector store ID is correct
- Check OpenAI API status
- Review error message in logs
- Try manual import via UI

**Issue: Test cases fail**
- Check workflow ID is correct
- Verify all nodes connected
- Review agent instructions syntax
- Check CEL expressions valid

**Issue: High costs**
- Review token usage per agent
- Consider using gpt-4o-mini for simple tasks
- Optimize web search count
- Reduce File Search max_results

**Issue: Poor output quality**
- Review agent instruction clarity
- Increase temperature for creativity
- Add more specific examples
- Enhance framework documents

## Support Resources

**OpenAI Documentation:**
- Agent Builder Guide: https://platform.openai.com/docs/guides/agents/agent-builder
- File Search: https://platform.openai.com/docs/guides/agents/retrieval
- CEL Expressions: https://github.com/google/cel-spec

**MEARA Resources:**
- Implementation Guide: `../MEARA_OpenAI_Agent_Builder_Implementation.md`
- Framework Docs: `../*.md`
- Deployment README: `./README.md`

**Team Contact:**
- Technical Issues: [your-email]
- Framework Questions: [framework-owner]
- API Access: [admin-contact]

## Sign-off

**Deployed By:** _________________________

**Date:** _________________________

**Version:** _________________________

**Status:**
- ☐ Fully Deployed & Tested
- ☐ Partially Deployed (note issues)
- ☐ Deployment Failed (see notes)

**Notes:**
_______________________________________________
_______________________________________________
_______________________________________________
_______________________________________________

---

**Next Review Date:** _________________________

**Assigned Reviewer:** _________________________
