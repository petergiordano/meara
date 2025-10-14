# EPIC-004: Fast-Track MEARA

> **One-sentence value proposition:** Lightweight 2-3 minute MEARA analysis option delivering quick insights at 1/3 the cost for screening and volume use cases.

**Status:** 🟡 Planning
**Priority:** 🟠 Medium
**Complexity:** 🔥🔥 Medium

---

## 📋 Quick Navigation

| Document | Purpose | Status |
|----------|---------|--------|
| [Product Requirements (PRD)](./PRD_fast-track-meara.md) | Complete feature requirements and cost analysis | ✅ Complete |
| [Design Specification](./DESIGN_SPEC_fast-track-meara.md) | UI for Fast-Track mode selection | ⏳ Not Started |
| [Functional Specification](./FUNCTIONAL_SPEC_fast-track-meara.md) | Feature details and workflow | ⏳ Not Started |
| [Technical Specification](./TECHNICAL_SPEC_fast-track-meara.md) | Implementation without DeepStack/DRB | ⏳ Not Started |
| [Sprint Planning](./SPRINTS.md) | Timeline, phases, and tasks | ⏳ Not Started |

---

## 🎯 Epic Overview

### Problem Statement
Standard MEARA takes 10-12 minutes and costs ~$6.45, requiring DeepStack analysis and Deep Research Brief generation. For screening 10+ companies, quarterly portfolio reviews, or budget-constrained scenarios, users need a faster, cheaper option that trades depth for speed. Currently, there's no alternative for users who want "good enough" insights quickly.

### Solution Summary
Create Fast-Track MEARA mode that skips DeepStack and DRB generation, instead performing lightweight website scraping and analyzing 6 core dimensions (vs 9 full dimensions). Completes in 2-3 minutes at ~$2 cost using GPT-4o-mini. Produces a concise 5-8 page report with surface-level insights and clear upgrade path to Standard MEARA if deeper analysis is needed.

### Success Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Completion time (p90) | < 3 minutes | Backend timing logs |
| API cost per analysis | < $2.50 | OpenAI usage tracking |
| % of analyses using Fast-Track | 30-40% within 3 months | Usage analytics |
| Upgrade rate (Fast-Track → Standard) | 15-20% | Conversion tracking |

---

## 👥 Key Stakeholders

| Role | Name | Responsibility |
|------|------|----------------|
| **Product Owner** | Peter Giordano | Final approval on requirements and pricing |
| **Tech Lead** | TBD | Architecture decisions for lightweight workflow |
| **Backend Developer** | TBD | Implement Fast-Track pipeline |
| **Frontend Developer** | TBD | Mode selection UI |
| **QA Lead** | TBD | Test strategy and quality validation |

---

## 📅 Timeline

| Milestone | Target Date | Status | Notes |
|-----------|-------------|--------|-------|
| Specs Complete | TBD | ⏳ Pending | All spec docs reviewed and approved |
| Phase 1: MVP | TBD | ⏳ Pending | Basic Fast-Track pipeline |
| Phase 2: Polish | TBD | ⏳ Pending | Report formatting and export |
| Phase 3: Optimization | TBD | ⏳ Pending | Cost/latency optimization |
| Production Launch | TBD | ⏳ Pending | General availability |

---

## 🚀 Quick Start for Developers

### Prerequisites
- [ ] Read [Project Constitution](../../../memory/constitution.md)
- [ ] Review [SLC Framework](../../../docs/SLC-Framework.md)
- [ ] Understand [Spec-Driven Development](../../../docs/spec-driven.md)
- [ ] Complete EPIC_001 Phase 1 (Standard MEARA working)

### Getting Started
1. **Read the specs in order:**
   - Start with [PRD](./PRD_fast-track-meara.md) for complete requirements
   - Review DESIGN_SPEC (when created) for UI changes
   - Study FUNCTIONAL_SPEC (when created) for workflow details
   - Dive into TECHNICAL_SPEC (when created) for implementation

2. **Set up your environment:**
   ```bash
   # Backend (Railway)
   cd /Users/petergiordano/Documents/GitHub/meara/railway_backend

   # Create feature branch
   git checkout -b feature/004-fast-track-meara

   # Test lightweight scraping
   # Install Playwright if not already installed
   pip install playwright
   playwright install chromium

   # Frontend (Vercel)
   cd /Users/petergiordano/Documents/GitHub/meara/deploy/vercel_frontend
   git checkout feature/004-fast-track-meara
   ```

3. **Understand the workflow:**
   - No DeepStack call
   - Direct website fetch (Playwright)
   - 6 dimensions instead of 9
   - GPT-4o-mini instead of GPT-4o
   - Concise 5-8 page report

---

## 📊 Epic Scope

### In Scope
- **Mode Selection UI**: Radio button on home page (Standard vs Fast-Track)
- **Lightweight Website Fetch**: Direct scraping of homepage, /about, /product, /pricing
- **6 Core Dimensions**: Message Clarity, Value Prop, CTA Effectiveness, Social Proof, Website UX, Content Quality
- **GPT-4o-mini Analysis**: Faster, cheaper model for dimension scoring
- **Concise Report**: 5-8 pages with exec summary, top 3 recommendations, dimension scores
- **Upgrade Path**: CTA in report to upgrade to Standard MEARA
- **Cost/Time Display**: Show estimated time and cost on mode selection

### Out of Scope (Deferred)
- **Bulk Fast-Track**: Run Fast-Track on 10+ companies at once (defer to V2)
- **Hybrid Mode**: Start with Fast-Track, auto-upgrade if critical issues found (defer to V3)
- **Fast-Track Library**: Store Fast-Track analyses separately (defer to Analysis Library epic)
- **Comparison**: Compare Fast-Track vs Standard for same company (defer to V2)

### Dependencies
- **Depends on:** EPIC_001 Phase 1 (Standard MEARA working) - COMPLETE
- **Blocks:** None (standalone feature)
- **External dependencies:**
  - Playwright for website scraping (already installed)
  - GPT-4o-mini API access (already available)

---

## 🎨 SLC Framework Application

### Simple
**Core Value Proposition:** Get 80% of the insights in 20% of the time and cost.

**Ruthless Prioritization:**
- ✅ Must-have: Mode selection, lightweight scraping, 6 dimensions, concise report, upgrade CTA
- ⏳ Nice-to-have: Bulk Fast-Track, hybrid mode, comparison
- ❌ Out of scope: Separate library, advanced analytics

**Intuitive Experience:**
- Mode selection on home page with clear comparison table
- Progress tracker shows 3 steps (vs 5 for Standard)
- Report clearly labeled "Fast-Track Analysis" with upgrade option

### Lovable
**Delightful Touches:**
- **Speed indicator**: Real-time countdown showing "2:15 remaining"
- **Cost savings**: Show "Saved $4.45 vs Standard" in report
- **Smart upgrade**: "Want deeper insights? Upgrade now" button pre-fills form

**Pain Point Solution:**
- Solves "I want to screen 10 companies but can't spend $65" problem
- Enables quarterly portfolio reviews within budget
- Provides "sanity check" before full due diligence

**User Feedback Integration:**
- Test with Scale team on 3-5 companies
- Validate that 80% accuracy is acceptable trade-off

### Complete
**Promise Fulfillment:**
- Delivers in promised 2-3 minutes
- Stays under $2.50 cost target
- Provides actionable recommendations (even if less evidence)

**No Dead Ends:**
- Every Fast-Track report has upgrade path
- Upgrade pre-fills company info (no re-entry)
- Clear disclaimer about analysis depth

**Quality Standards:**
- Success rate: > 95% (vs 98% for Standard)
- 80-85% accuracy vs Standard MEARA (acceptable trade-off)
- Report still follows Scale VP branding

---

## 🔄 Development Status

### Current Phase
**Phase:** Planning (PRD Complete)
**Sprint:** N/A
**Progress:** 10% complete (PRD drafted)

### Recent Updates
| Date | Update | Author |
|------|--------|--------|
| 2025-10-14 | Created EPIC_004 structure and PRD | Claude Code |
| TBD | Workflow design approved | Tech Lead |

### Blockers & Risks
| Status | Issue | Impact | Mitigation | Owner |
|--------|-------|--------|------------|-------|
| 🟡 Monitoring | GPT-4o-mini may not be accurate enough | Medium | Test accuracy vs Standard on 10 companies | Tech Lead |
| 🟡 Monitoring | Website scraping may fail for JS-heavy sites | Medium | Use Playwright for all sites | Backend Dev |
| 🟢 Low | Cannibalization of Standard MEARA | Low | Make Standard the recommended default | Product |

---

## 📈 Progress Tracking

### Feature Completion
```
[=>                                    ] 10% Complete

Specs Complete: 1/5 (PRD done)
Mode Selection UI: Not started
Backend Pipeline: Not started
Report Generation: Not started
Testing: Not started
```

### Implementation Phases (from PRD)
- **Phase 1**: MVP (1 week) - Basic Fast-Track pipeline
- **Phase 2**: Polish (3 days) - Report formatting and export
- **Phase 3**: Optimization (1 week) - Cost/latency optimization

---

## 📚 Related Documentation

### Internal Resources
- [EPIC_001: Progressive Analysis Platform](../EPIC_001-progressive-analysis-platform/README.md)
- [Project Constitution](../../../memory/constitution.md)
- [SLC Framework](../../../docs/SLC-Framework.md)

### External References
- [Playwright Documentation](https://playwright.dev/python/)
- [OpenAI GPT-4o-mini Pricing](https://openai.com/pricing)

### Cost Analysis
See [PRD Section: Cost Breakdown](./PRD_fast-track-meara.md#cost-breakdown) for detailed comparison.

**Standard MEARA**: ~$6.45 (DeepStack $0.50 + GPT-4o $5.95)
**Fast-Track MEARA**: ~$1.80 (Scraping $0.10 + GPT-4o-mini $1.70)
**Savings**: $4.65 per analysis

---

## 🤝 Contributing

### How to Contribute
1. Review the PRD thoroughly (especially workflow and cost analysis)
2. Follow the [Git Workflow](../../../docs/git-workflow.md)
3. Write tests first (TDD)
4. Test accuracy vs Standard MEARA on 10 companies
5. Ensure constitution compliance

### Testing Strategy
```python
# Test accuracy: Run both modes on same company
companies = ["GGWP", "CompanyB", "CompanyC", ...]

for company in companies:
    standard_result = run_standard_meara(company)
    fast_track_result = run_fast_track_meara(company)

    # Compare top 3 recommendations
    accuracy = compare_recommendations(standard_result, fast_track_result)

    # Target: 80-85% overlap
    assert accuracy > 0.80
```

---

## 💬 Communication

### Questions?
- For product questions: @Peter Giordano
- For technical questions: @Tech Lead (TBD)
- For backend questions: @Backend Developer (TBD)
- For frontend questions: @Frontend Developer (TBD)

---

**Last Updated:** 2025-10-14
**Document Owner:** Peter Giordano
**Next Review Date:** After workflow testing
