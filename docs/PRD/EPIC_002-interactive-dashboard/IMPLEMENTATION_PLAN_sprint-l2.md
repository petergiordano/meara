# EPIC-002 Sprint L2: GTM Investment Dashboard - Implementation Plan

**Created:** 2025-10-14
**Status:** Planning
**Est. Duration:** 3-4 weeks (20-25 days)
**Branch:** `feature/epic-002-sprint-l2-gtm-dashboard`

---

## 🎯 Sprint Overview

**Goal:** Build a pre-investment GTM scalability assessment dashboard for Scale VP investment partners to evaluate prospective portfolio companies.

**Key Differentiator from Sprint L1:**
- **Sprint L1** = Post-investment MEARA marketing analysis (9 dimensions)
- **Sprint L2** = Pre-investment GTM scalability scoring (6 sections: Executive Thesis, Core Tension, Strategic Pivot, GTM Evolution, Action Plan, Risk Matrix)

---

## 📋 Constitutional Compliance Checklist

Before starting, ensure adherence to project constitution:

- [ ] **Article I: Library-First Principle** - All components built as reusable libraries
- [ ] **Article III: Test-First Imperative** - Write tests BEFORE implementation (TDD)
- [ ] **Article VII: Simplicity** - Max 3 projects for initial implementation
- [ ] **Article VIII: Anti-Abstraction** - Use D3.js/Recharts directly, no wrappers
- [ ] **Article IX: Integration-First Testing** - Use real `MEA_CONFIG.json` data

---

## 📦 Phase 1: Data Model & Backend (Week 1, 5 days)

### Objectives
- Define `MEA_CONFIG.json` schema contract
- Build backend transformer library
- Write comprehensive tests
- Create API endpoint

### Tasks

#### Day 1-2: Schema Design & Contract Tests
- [ ] Create `deploy/railway_backend/mea_config_schema.json`
  - Define complete JSON Schema for `MEA_CONFIG.json`
  - Include validation rules, required fields, type constraints
  - Document each field with descriptions and examples
  - **Reference:** Lines 64-216 in FUNCTIONAL_SPEC_sprint-l2-gtm-dashboard.md

- [ ] Create `deploy/railway_backend/test_gtm_dashboard_api.py`
  - Write 20+ contract tests (Article III: TDD)
  - Test each section: Executive Thesis, Core Tension, Strategic Pivot, GTM Evolution, Action Plan, Risk Matrix
  - Validate nested structures (gtmBreakdown, acvExpansion, influenceMap, etc.)
  - Test error handling for malformed/missing data
  - **Success Criteria:** All tests FAIL initially (Red phase of TDD)

#### Day 3-4: Backend Transformer Library
- [ ] Create `deploy/railway_backend/gtm_dashboard_transformer.py`
  - **Article I compliant:** Library-first design
  - Input: `MEA_CONFIG.json` dictionary
  - Output: Transformed data optimized for frontend rendering
  - Functions:
    - `transform_executive_thesis()` - Process GTM score, ARR composition, strategic opportunity
    - `transform_core_tension()` - Process asset/liability, influence map data
    - `transform_strategic_pivot()` - Process competitive positioning matrix
    - `transform_gtm_evolution()` - Process 3-phase roadmap
    - `transform_action_plan()` - Process Gantt chart data with milestones/KPIs
    - `transform_risk_matrix()` - Process risk heatmap with mitigation strategies
  - CLI interface for standalone testing
  - **Success Criteria:** Tests pass (Green phase of TDD)

#### Day 5: API Endpoint
- [ ] Update `deploy/railway_backend/main.py`
  - Add GET `/api/gtm/dashboard/{companyId}` endpoint
  - Load `MEA_CONFIG.json` from file or database (depending on storage strategy)
  - Call `gtm_dashboard_transformer` library
  - Return transformed JSON
  - Add CORS support for frontend
  - Error handling for missing/invalid company IDs

- [ ] Create sample `MEA_CONFIG.json` for AI-Solutions Inc. (from spec)
  - Store in `deploy/railway_backend/sample_data/ai-solutions_inc_mea_config.json`
  - Use for testing and demo purposes

### Deliverables
- ✅ `mea_config_schema.json` - JSON Schema contract
- ✅ `test_gtm_dashboard_api.py` - 20+ passing tests
- ✅ `gtm_dashboard_transformer.py` - Library-first transformer
- ✅ `/api/gtm/dashboard/{companyId}` - Working endpoint
- ✅ Sample data file for AI-Solutions Inc.

---

## 🎨 Phase 2: Core Visualizations (Week 2-3, 10 days)

### Section 1: Executive Thesis (Days 6-8, 3 days)

#### Components to Build
- [ ] `components/gtm/GtmScalabilityGauge.tsx`
  - **Visualization:** Half-circle gauge with animated needle
  - **Data:** `gtmScore.value` (0-100), `gtmScore.label`, `gtmScore.colorThresholds`
  - **Interactions:**
    - Hover: Display `gtmScore.tooltip`
    - Click: Open `RadarChartModal` with GTM breakdown
  - **Styling:** Color zones (Red <20, Amber 20-50, Green >50)

- [ ] `components/gtm/RadarChartModal.tsx`
  - **Visualization:** Radar chart with 5 pillars (Lead Gen, MarTech, Data/Analytics, Playbook, Team)
  - **Data:** `gtmBreakdown` array with company scores vs. benchmarks
  - **Features:**
    - Overlay company score (semi-transparent red) on benchmark (green)
    - Display evidence snippet below chart
  - **Reusable:** Modal wrapper, can be used for other radar charts

- [ ] `components/gtm/ArrStackedBar.tsx`
  - **Visualization:** Horizontal stacked bar chart
  - **Data:** `arrData.currentValue`, `arrData.composition` (segments with colors)
  - **Interactions:**
    - Hover: Show segment tooltip with `composition.tooltip` and client logos
    - Click: Open modal with `growthPatternSummary` and historical trend (if available)

- [ ] `components/gtm/StrategicOpportunityDonut.tsx`
  - **Visualization:** Donut chart (inner = baseline ACV, outer = potential ACV)
  - **Data:** `acvExpansion.baselineAcv`, `acvExpansion.potentialAcv`
  - **Styling:** Outer ring emphasized (brighter color, subtle glow)
  - **Interaction:** Click opens `AcvWaterfallModal`

- [ ] `components/gtm/AcvWaterfallModal.tsx`
  - **Visualization:** Waterfall chart
  - **Data:** `acvExpansion.steps` (baseline → +increments → potential)
  - **Features:**
    - Green bars for incremental increases
    - Hover: Display step `justification` as tooltip
    - Currency formatting ($120,000 → $300,000)

#### Tests
- [ ] Unit tests for each component with mock data
- [ ] Integration test: Fetch `/api/gtm/dashboard/ai-solutions` and render Section 1

### Section 2: Core Tension (Days 9-10, 2 days)

#### Components to Build
- [ ] `components/gtm/LeakyFunnel.tsx`
  - **Visualization:** SVG-based funnel with 5 stages (Visitors → Closed Won)
  - **Animation:** Subtle "leak" particles/drips for untracked stages
  - **Data:** `coreTension.liability.missingTechStack`, `missingTechSummary`
  - **Interaction:** Click triggers animation showing missing tech stack logos with red 'X'

- [ ] `components/gtm/InfluenceMap.tsx`
  - **Visualization:** Network graph
  - **Data:** `influenceMap.centerNode` (CEO/Founder), `influenceMap.connections` (clients)
  - **Styling:** Scale Blue connecting lines, node sizes proportional to importance
  - **Interaction:** Hover client node → display `connection.quote` tooltip
  - **Summary:** Display `influenceMap.summary` below graphic

#### Tests
- [ ] Unit tests for LeakyFunnel animations
- [ ] Unit tests for InfluenceMap network rendering
- [ ] Integration test: Render Section 2 with complete data

### Section 3: Strategic Pivot (Days 11-12, 2 days)

#### Component to Build
- [ ] `components/gtm/CompetitiveMoatMatrix.tsx`
  - **Visualization:** 2x2 grid (axes: Industry Focus × Solution Scope)
  - **Data:** `strategicPivot.competitors` array (with x, y coordinates)
  - **Features:**
    - Company node (isSelf: true) is larger, Scale Green, with glow/star icon
    - Competitor nodes are standard size, clickable
  - **Interactions:**
    - Hover: Display `competitor.details` or `competitor.differentiator` tooltip
    - Click: Open `CompetitorDetailModal` with full competitive intel
  - **Styling:** Subtle quadrant background gradients

- [ ] `components/gtm/CompetitorDetailModal.tsx`
  - Reusable modal for displaying deep competitive analysis
  - Can link to external `detailsLink` if provided

#### Tests
- [ ] Unit tests for matrix positioning logic
- [ ] Unit tests for hover/click interactions
- [ ] Integration test: Render Section 3 with 3+ competitors

### Section 4: GTM Evolution (Days 13-14, 2 days)

#### Component to Build
- [ ] `components/gtm/GtmEvolutionRoadmap.tsx`
  - **Visualization:** Horizontal timeline with 3 phases (Initial → Accelerated → Scaled)
  - **Data:** `gtmEvolutionRoadmap.phases` array
  - **Features:**
    - Each phase is a distinct column
    - Elements displayed as rows within each phase
    - Investment impact text centrally positioned
  - **Interactions:**
    - Hover element → display `element.tooltip`
    - Click phase title → open modal with deliverables and budget allocation

#### Tests
- [ ] Unit tests for timeline rendering
- [ ] Integration test: Render 3-phase roadmap

---

## 🛠️ Phase 3: Planning & Risk Views (Week 3, 3 days)

### Section 5: Action Plan (Days 15-16, 2 days)

#### Component to Build
- [ ] `components/gtm/GanttChart.tsx`
  - **Visualization:** Horizontal timeline (1-12 months)
  - **Data:** `actionPlan.phases` array with `startMonth`, `endMonth`, `milestones`, `kpi`
  - **Features:**
    - Phase bars (Scale Blue)
    - Milestone icons (diamonds) positioned at specific months
    - KPI mini-sparkline showing current vs. target
  - **Interactions:**
    - Hover milestone → display `milestone.impact` tooltip
    - Click phase bar → expand section below with detailed checklist and KPI details

#### Tests
- [ ] Unit tests for Gantt rendering logic
- [ ] Integration test: Render 2-phase action plan with milestones

### Section 6: Risk Matrix (Day 17, 1 day)

#### Component to Build
- [ ] `components/gtm/RiskHeatmap.tsx`
  - **Visualization:** 3x3 grid with gradient background (light green → deep red)
  - **Data:** `riskMatrix.risks` array (with `impact`, `likelihood`, `color`)
  - **Features:**
    - Risk nodes plotted on grid
    - Node color matches `risk.color` (red = high, amber = medium)
  - **Interactions:**
    - Hover: Display risk name, impact/likelihood scores tooltip
    - Click: Open `RiskDetailModal` with `risk.mitigation` and owner

- [ ] `components/gtm/RiskDetailModal.tsx`
  - Reusable modal for risk deep-dive

#### Tests
- [ ] Unit tests for heatmap plotting
- [ ] Integration test: Render risk matrix with 3+ risks

---

## 🧩 Phase 4: Global Components & Integration (Week 4, 5 days)

### Day 18-19: Global Components

- [ ] `components/gtm/DashboardLayout.tsx`
  - App shell with Scale VP branding
  - Fixed header: Logo (left), "MEA Dashboard: [companyName]" (center), "Analysis Date: [analysisDate]" (right)
  - Main content area: White background, divided into 6 sections
  - Footer: Subtle Scale VP branding, copyright

- [ ] `components/gtm/Modal.tsx`
  - Reusable modal wrapper
  - Semi-transparent dark background overlay
  - White content area with close button (X icon)
  - Smooth fade-in/fade-out transitions (200-300ms)

- [ ] `components/gtm/Tooltip.tsx`
  - Minimalist white background with subtle shadow
  - Dark charcoal text
  - Appear quickly on hover (150ms delay)
  - Dynamic positioning to avoid obscuring content

### Day 20-21: Dashboard Integration

- [ ] `app/gtm/[companyId]/page.tsx`
  - Main GTM dashboard page
  - Fetch data from `/api/gtm/dashboard/{companyId}`
  - Render all 6 sections in order
  - Loading state while fetching
  - Error handling for 404/500 errors

- [ ] Update `app/globals.css` with GTM-specific animations
  - Gauge needle animation
  - Funnel leak animation
  - Network graph node pulse
  - Modal transitions

### Day 22-23: Polish & Testing

- [ ] Responsive design testing (desktop 1920x1080, tablet 1024x768)
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Performance optimization
  - Lazy loading for heavy components (Gantt, Heatmap)
  - Memoization for expensive calculations
  - Image optimization for logos
- [ ] Accessibility audit (WCAG AA compliance)
  - Keyboard navigation
  - Screen reader support
  - Color contrast validation

### Day 24-25: User Acceptance Testing

- [ ] Internal testing with sample data (AI-Solutions Inc.)
- [ ] Create 2-3 additional sample companies for demo
- [ ] User testing with 2-3 Scale partners
- [ ] Iterate based on feedback
- [ ] Documentation and handoff

---

## 📊 Success Criteria

### Technical
- [ ] All 20+ backend tests passing (100% pass rate)
- [ ] All frontend component tests passing
- [ ] End-to-end test: Load dashboard for 3 sample companies
- [ ] Dashboard loads in < 2 seconds (p90)
- [ ] No console errors or warnings
- [ ] Mobile-responsive (works on tablet, optimized for desktop)

### Functional
- [ ] All 6 sections render correctly with sample data
- [ ] All interactive elements work (hover, click, modals)
- [ ] Animations are smooth and purposeful
- [ ] Tooltips display correctly and dynamically position
- [ ] Error states handled gracefully

### User Acceptance
- [ ] 2-3 Scale partners can navigate dashboard without guidance
- [ ] Partners can identify GTM score and top risks in < 30 seconds
- [ ] User feedback score > 4.0/5
- [ ] No critical bugs reported during UAT

---

## 🚨 Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Complex visualizations take longer than estimated** | Medium | High | Start with simplest version, iterate; use proven libraries (Recharts, D3.js) |
| **Sample data incomplete or doesn't match spec** | Low | Medium | Work closely with functional spec; create robust mock data generator |
| **Performance issues with heavy animations** | Medium | Medium | Profile early; use React.memo, lazy loading; optimize animations |
| **User feedback requires major rework** | Low | High | Conduct quick prototype review before Phase 2; early UAT feedback |
| **Backend API not ready on time** | Low | Critical | Mock API responses for frontend development; parallel backend work |

---

## 📚 Resources

### Required Reading
- [FUNCTIONAL_SPEC_sprint-l2-gtm-dashboard.md](./FUNCTIONAL_SPEC_sprint-l2-gtm-dashboard.md) - Complete spec with data contract
- [Constitution](../../../memory/constitution.md) - 12 development principles
- [MASTER_ROADMAP.md](../MASTER_ROADMAP.md) - Sprint L2 context

### Design References
- Scale VP Brand Guidelines (colors, fonts, logo)
- Sprint L1 dashboard for component consistency
- Looker Studio / Datadog for visualization inspiration

### Technical Stack
- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Visualization:** Recharts (charts), D3.js (custom SVG animations)
- **Backend:** FastAPI, Python 3.11
- **Testing:** Jest, React Testing Library, Pytest

---

## 📝 Daily Standup Format

**What I did yesterday:**
- List completed tasks

**What I'm doing today:**
- List planned tasks (reference phase/day in plan)

**Blockers:**
- Any blockers requiring intervention

**Tests status:**
- X/20 tests passing

---

**Document Owner:** Claude Code
**Next Review:** Weekly progress check-ins with Peter Giordano
