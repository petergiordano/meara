# EPIC-003: Analysis Library

> **One-sentence value proposition:** Centralized library system enabling Scale employees to discover, compare, and collaborate on MEARA analyses across the portfolio.

**Status:** 🟡 Planning
**Priority:** 🔴 High
**Complexity:** 🔥🔥🔥 High

---

## 📋 Quick Navigation

| Document | Purpose | Status |
|----------|---------|--------|
| [Product Requirements (PRD)](./PRD_analysis-library.md) | Complete system design with database schema and API | ✅ Complete |
| [Design Specification](./DESIGN_SPEC_analysis-library.md) | UI/UX for library page and comparison views | ⏳ Not Started |
| [Functional Specification](./FUNCTIONAL_SPEC_analysis-library.md) | Feature details and business logic | ⏳ Not Started |
| [Technical Specification](./TECHNICAL_SPEC_analysis-library.md) | Architecture and implementation details | ⏳ Not Started |
| [Sprint Planning](./SPRINTS.md) | Timeline, phases, and tasks | ⏳ Not Started |

---

## 🎯 Epic Overview

### Problem Statement
After Phase 1, MEARA analyses are generated and downloaded as files (markdown/PDF), but there's no central repository to store, search, or share them. Scale employees can't easily discover past analyses ("What did we learn about company X?"), compare companies ("How does this prospect stack up against our best performers?"), or build institutional knowledge across the portfolio. Every analysis is isolated, and valuable insights are lost.

### Solution Summary
Build a centralized PostgreSQL-backed library system where all MEARA analyses are automatically saved with structured metadata (scores, recommendations, tags, sector). Create a searchable web interface with filtering by sector/stage/date, full-text search across recommendations and insights, and side-by-side comparison views. Enable team collaboration with sharing controls and access management for Scale employees.

### Success Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| % of analyses saved to library | 100% (auto-save) | Backend tracking |
| Library views per week | > 20 views | Analytics |
| Comparisons performed per month | > 10 comparisons | Feature usage tracking |
| Time to find past analysis | < 30 seconds | User testing |

---

## 👥 Key Stakeholders

| Role | Name | Responsibility |
|------|------|----------------|
| **Product Owner** | Peter Giordano | Final approval on requirements and priorities |
| **Tech Lead** | TBD | Database design and backend architecture |
| **Backend Developer** | TBD | API implementation and PostgreSQL setup |
| **Frontend Developer** | TBD | Library UI and search interface |
| **QA Lead** | TBD | Test strategy and quality assurance |

---

## 📅 Timeline

| Milestone | Target Date | Status | Notes |
|-----------|-------------|--------|-------|
| Specs Complete | TBD | ⏳ Pending | All spec docs reviewed and approved |
| Database Schema Finalized | TBD | ⏳ Pending | PostgreSQL tables created |
| Phase 1: Basic Storage | TBD | ⏳ Pending | Auto-save on analysis complete |
| Phase 2: Browse & Search | TBD | ⏳ Pending | Library page with filters |
| Phase 3: View & Download | TBD | ⏳ Pending | Link to results page |
| Phase 4: Comparison | TBD | ⏳ Pending | Side-by-side analysis comparison |
| Phase 5: Advanced Features | TBD | ⏳ Pending | Tagging, access control, comments |
| Production Launch | TBD | ⏳ Pending | General availability for Scale team |

---

## 🚀 Quick Start for Developers

### Prerequisites
**Before starting, read these essential documents:**
- **[CLAUDE.md](../../../CLAUDE.md)** - Development guide with commands, architecture, and workflow
- **[Constitution](../../../memory/constitution.md)** - 12 immutable development principles
- **[MASTER_ROADMAP.md](../MASTER_ROADMAP.md)** - Current project status and Epic priorities
- **[SLC Framework](../../spec-driven/SLC-Framework_Simple-Lovable-Complete.md)** - Product philosophy
- **Prerequisite:** Complete EPIC_001 Phase 1 (Results display + markdown export)
- **Required:** PostgreSQL experience (for backend developers)

### Getting Started
1. **Read the specs in order:**
   - Start with [PRD](./PRD_analysis-library.md) for system design and database schema
   - Review DESIGN_SPEC (when created) for library UI
   - Study FUNCTIONAL_SPEC (when created) for detailed features
   - Dive into TECHNICAL_SPEC (when created) for implementation

2. **Set up your environment:**
   ```bash
   # Backend (Railway)
   cd /Users/petergiordano/Documents/GitHub/meara/railway_backend

   # Create feature branch
   git checkout -b feature/003-analysis-library

   # Set up PostgreSQL locally (or use Railway)
   # Install PostgreSQL dependencies
   pip install psycopg2-binary sqlalchemy

   # Frontend (Vercel)
   cd /Users/petergiordano/Documents/GitHub/meara/deploy/vercel_frontend
   git checkout feature/003-analysis-library
   ```

3. **Database Setup:**
   - Provision PostgreSQL on Railway
   - Run schema migrations (see PRD for SQL)
   - Seed with 2-3 test analyses

---

## 📊 Epic Scope

### In Scope
- **Auto-Save System**: Every completed analysis automatically saved to library
- **PostgreSQL Database**: Tables for analyses, tags, shares
- **Library Page**: Browse all analyses with cards showing company/date/score
- **Search & Filter**: Full-text search, filter by sector/stage/date/analyst
- **Single Analysis View**: Link from library to existing results page
- **Comparison View**: Select 2-5 analyses for side-by-side comparison
- **Access Control**: All Scale employees can view, analyst can mark private
- **Download from Library**: Export any analysis as markdown/PDF
- **Tags System**: Sector, stage, issue type tags for organization

### Out of Scope (Deferred to Future Epics)
- **External Sharing**: Shareable links outside Scale (defer to V2)
- **Comments & Annotations**: Collaborative feedback on analyses (defer to V2)
- **Export to Google Slides**: Presentation generation (defer to future)
- **AI-Powered Insights**: "Companies similar to X" recommendations (defer to V3)
- **Version History**: Track changes to analysis over time (defer to V3)
- **Portfolio Analytics**: Aggregate insights across all analyses (separate epic)

### Dependencies
- **Depends on:** EPIC_001 Phase 1 (Results display page) - COMPLETE
- **Blocks:** None (standalone feature)
- **External dependencies:**
  - PostgreSQL database provisioned on Railway
  - Backend API must support structured JSON storage
  - May need full-text search extension (PostgreSQL built-in)

---

## 🎨 SLC Framework Application

### Simple
**Core Value Proposition:** Save every analysis automatically, find any past analysis in 30 seconds with search and filters.

**Ruthless Prioritization:**
- ✅ Must-have: Auto-save, browse, search, filter, single view, comparison (2-5 analyses)
- ⏳ Nice-to-have: Advanced tags, AI recommendations, portfolio trends
- ❌ Out of scope: External sharing, comments, version history

**Intuitive Experience:**
- Library page uses familiar card-based layout (like Notion or Linear)
- Search bar prominent at top
- Filters use standard dropdowns (sector, stage, date)
- Comparison uses checkbox selection pattern

### Lovable
**Delightful Touches:**
- **Quick preview**: Hover over analysis card shows top recommendation
- **Smart defaults**: Filter defaults to "Last 30 days" for relevance
- **Visual scores**: Color-coded score badges (red < 50, yellow 50-75, green > 75)

**Pain Point Solution:**
- Solves "Where did we analyze company X?" with instant search
- Eliminates "How does this compare to Y?" manual comparison
- Builds institutional knowledge: "What recommendations work?"

**User Feedback Integration:**
- User test with 3-5 Scale employees after Phase 2
- Iterate search/filter based on how they actually look for analyses

### Complete
**Promise Fulfillment:**
- All analyses are saved (100% auto-save)
- All analyses are findable (search + filters)
- All analyses can be compared (side-by-side view)

**No Dead Ends:**
- Every search result links to full analysis
- Every comparison view has "View Full Analysis" button
- Empty states have clear CTAs ("Run your first analysis")

**Quality Standards:**
- Search response time: < 500ms
- Library page load: < 2 seconds
- Database supports 1000+ analyses without performance degradation
- Accessibility: WCAG AA compliant

---

## 🔄 Development Status

### Current Phase
**Phase:** Planning (PRD Complete)
**Sprint:** N/A
**Progress:** 10% complete (PRD drafted)

### Recent Updates
| Date | Update | Author |
|------|--------|--------|
| 2025-10-14 | Created EPIC_003 structure and PRD | Claude Code |
| TBD | Database schema approved | Tech Lead |

### Blockers & Risks
| Status | Issue | Impact | Mitigation | Owner |
|--------|-------|--------|------------|-------|
| 🟡 Monitoring | PostgreSQL not yet provisioned on Railway | High | Provision immediately | Tech Lead |
| 🟡 Monitoring | Backend doesn't store structured JSON yet | Medium | Add storage endpoint | Backend Dev |
| 🟢 Low | Full-text search complexity | Low | Use PostgreSQL built-in | Backend Dev |

---

## 📈 Progress Tracking

### Feature Completion
```
[=>                                    ] 10% Complete

Specs Complete: 1/5 (PRD done)
Database Design: Complete (in PRD)
Backend APIs: Not started
Frontend UI: Not started
Testing: Not started
```

### Implementation Phases (from PRD)
- **Phase 1**: Basic Storage (1 week) - Auto-save to database
- **Phase 2**: Browse & Search (1 week) - Library page with filters
- **Phase 3**: View & Download (3 days) - Link to results page
- **Phase 4**: Comparison (1 week) - Side-by-side view
- **Phase 5**: Advanced Features (2 weeks) - Tags, access control, comments

---

## 📚 Related Documentation

### Internal Resources
- [EPIC_001: Progressive Analysis Platform](../EPIC_001-progressive-analysis-platform/README.md)
- [EPIC_002: Interactive Dashboard](../EPIC_002-interactive-dashboard/README.md)
- [Project Constitution](../../../memory/constitution.md)
- [SLC Framework](../../../docs/SLC-Framework.md)

### External References
- [PostgreSQL Full-Text Search](https://www.postgresql.org/docs/current/textsearch.html)
- [Railway PostgreSQL Setup](https://docs.railway.app/databases/postgresql)
- [SQLAlchemy ORM Documentation](https://docs.sqlalchemy.org/)

### Database Schema
See [PRD Section: Database Schema](./PRD_analysis-library.md#database-schema) for complete SQL definitions.

---

## 🤝 Contributing

### How to Contribute
1. Review the PRD thoroughly (especially database schema)
2. Follow the [Git Workflow](../../../docs/git-workflow.md)
3. Write tests first (TDD) - especially for API endpoints
4. Run database migrations in development before production
5. Ensure constitution compliance

### Database Migration Process
```bash
# Create migration
alembic revision -m "Add analyses table"

# Run migration
alembic upgrade head

# Rollback if needed
alembic downgrade -1
```

---

## 💬 Communication

### Questions?
- For product questions: @Peter Giordano
- For database questions: @Tech Lead (TBD)
- For backend questions: @Backend Developer (TBD)
- For frontend questions: @Frontend Developer (TBD)

---

**Last Updated:** 2025-10-14
**Document Owner:** Peter Giordano
**Next Review Date:** After database schema approval
