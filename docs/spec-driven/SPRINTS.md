# Sprint Planning: [Epic Name]

**Epic Number:** [XXX]  
**Version:** 1.0  
**Planning Date:** YYYY-MM-DD  
**Last Updated:** YYYY-MM-DD

---

## 📊 Planning Overview

### Project Summary
| Attribute | Value |
|-----------|-------|
| **Total Duration** | [X weeks/months] |
| **Number of Sprints** | [Y sprints] |
| **Sprint Length** | 2 weeks (standard) |
| **Team Size** | [Z developers + roles] |
| **Start Date** | YYYY-MM-DD |
| **Target Completion** | YYYY-MM-DD |
| **Slack Buffer** | [X% or Y days for unknowns] |

### Team Composition
| Role | Name | Allocation | Notes |
|------|------|------------|-------|
| Tech Lead | [Name] | 80% | [Other commitments] |
| Senior Dev | [Name] | 100% | Full-time on epic |
| Mid-Level Dev | [Name] | 100% | Full-time on epic |
| Designer | [Name] | 25% | Design support as needed |
| QA Engineer | [Name] | 50% | Testing and quality assurance |
| Product Owner | [Name] | 20% | Requirements and acceptance |

---

## 🎯 Epic Goals & Success Criteria

### Primary Goals
1. **[Goal 1]:** [Specific, measurable objective]
2. **[Goal 2]:** [Specific, measurable objective]
3. **[Goal 3]:** [Specific, measurable objective]

### Definition of Done (Epic Level)
- [ ] All must-have user stories complete
- [ ] Test coverage ≥ 80%
- [ ] All acceptance criteria met
- [ ] Performance benchmarks achieved
- [ ] Security review passed
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Documentation complete
- [ ] Production deployment successful
- [ ] Post-launch monitoring active

---

## 🏗️ Phase Breakdown

### Phase -1: Pre-Implementation Gates

**Duration:** [X days before Sprint 1]  
**Goal:** Validate architecture and ensure readiness

#### Constitution Compliance Gates

**Simplicity Gate (Article VII)**
- [ ] Using ≤3 projects?
  - **Current:** [Number of projects]
  - **Justification:** [If >3, explain why necessary]
- [ ] No future-proofing?
  - **Validation:** [Confirm building for today's requirements]
- [ ] No speculative features?
  - **Validation:** [All features trace to user stories]

**Anti-Abstraction Gate (Article VIII)**
- [ ] Using framework directly (no unnecessary wrappers)?
  - **Framework:** [Name of framework]
  - **Usage:** [Direct usage confirmed]
- [ ] Single model representation per entity?
  - **Validation:** [One truth per domain model]

**Integration-First Gate (Article IX)**
- [ ] Contracts defined?
  - **Location:** [Path to contract definitions]
- [ ] Contract tests written?
  - **Location:** [Path to contract test suite]
- [ ] Test database strategy defined?
  - **Approach:** [How test DB mirrors prod]

#### Technical Validation
- [ ] Architecture Decision Records (ADRs) created
- [ ] Tech stack approved by team
- [ ] Development environment setup guide complete
- [ ] CI/CD pipeline configured
- [ ] Monitoring and alerting planned

#### Deliverables
- [ ] Architecture diagram approved
- [ ] Technical specification reviewed by team
- [ ] Risk mitigation strategies documented
- [ ] All [NEEDS CLARIFICATION] markers resolved

---

### Phase 0: Foundation & Setup

**Duration:** [X days/weeks]  
**Goal:** Establish development infrastructure and baseline

#### Objectives
- Set up project scaffolding and tooling
- Configure CI/CD pipeline
- Establish testing framework
- Create base component library
- Set up monitoring and logging

#### Key Activities
| Activity | Owner | Est. Hours | Status |
|----------|-------|-----------|--------|
| Initialize Next.js project | [Name] | 4h | ⏳ Pending |
| Configure TypeScript & ESLint | [Name] | 4h | ⏳ Pending |
| Set up database schema | [Name] | 8h | ⏳ Pending |
| Configure test framework (Jest) | [Name] | 6h | ⏳ Pending |
| Set up CI/CD (GitHub Actions) | [Name] | 8h | ⏳ Pending |
| Create design system tokens | [Name] | 6h | ⏳ Pending |
| Configure error tracking (Sentry) | [Name] | 4h | ⏳ Pending |

#### Deliverables
- [ ] Project repository initialized with template
- [ ] `npm install` runs successfully
- [ ] `npm test` runs (even with 0 tests)
- [ ] `npm run dev` starts dev server
- [ ] First commit merged to main branch
- [ ] CI/CD pipeline green for baseline
- [ ] Team can clone and run locally

#### Phase 0 Gate
**Do not proceed to Phase 1 until:**
- [ ] All team members can run project locally
- [ ] First test passes in CI/CD
- [ ] Architecture approved by tech lead
- [ ] Constitution gates passed

---

### Phase 1: Core Implementation (MVP)

**Duration:** [X weeks - typically 2-4 sprints]  
**Goal:** Build minimum viable product with must-have features

---

#### Sprint 1: [Sprint Name/Theme]

**Dates:** YYYY-MM-DD to YYYY-MM-DD  
**Goal:** [Primary objective for this sprint]  
**Theme:** [Optional: what this sprint focuses on, e.g., "Authentication Foundation"]

##### User Stories (Prioritized)

###### Story 1.1: [Story Title] 🔴 HIGH
**Story:** As a [user], I want [capability] so that [benefit]

**Acceptance Criteria:**
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

**Technical Tasks:**
- [ ] **[Task ID]:** Write tests for [component/function] (4h) - [Owner]
- [ ] **[Task ID]:** Implement [component/function] (6h) - [Owner]
- [ ] **[Task ID]:** Integration testing (3h) - [Owner]

**Story Points:** 5  
**Assignee:** [Name]  
**Dependencies:** None  
**Status:** ⏳ To Do | 🟡 In Progress | 🔵 In Review | ✅ Done

---

###### Story 1.2: [Story Title] 🔴 HIGH
[Repeat structure]

---

###### Story 1.3: [Story Title] 🟠 MEDIUM
[Repeat structure]

---

##### Technical Debt & Improvements
- [ ] [Tech debt item or improvement]
- [ ] [Tech debt item or improvement]

##### Sprint Capacity
| Developer | Available Hours | Allocated Hours | Buffer |
|-----------|----------------|-----------------|--------|
| [Name] | 80h | 65h | 15h |
| [Name] | 80h | 70h | 10h |
| **Total** | **160h** | **135h** | **25h** |

##### Sprint Risk Assessment
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk] | Med | High | [Strategy] |

##### Sprint Dependencies
- **Depends on:** [External dependency or previous sprint item]
- **Blocks:** [What's waiting on this sprint]

##### Definition of Done (Sprint 1)
- [ ] All story acceptance criteria met
- [ ] Unit tests pass (≥80% coverage)
- [ ] Integration tests pass
- [ ] Code reviewed and approved
- [ ] Deployed to staging
- [ ] Product owner acceptance

---

#### Sprint 2: [Sprint Name/Theme]

**Dates:** YYYY-MM-DD to YYYY-MM-DD  
**Goal:** [Primary objective for this sprint]

[Repeat Sprint 1 structure]

---

#### Sprint 3: [Sprint Name/Theme]
[Continue for all Phase 1 sprints]

---

### Phase 2: Refinement & Polish

**Duration:** [X weeks - typically 1-2 sprints]  
**Goal:** Add lovable touches, ensure completeness, optimize performance

#### Objectives
- Implement delightful micro-interactions
- Optimize performance to meet targets
- Polish UX based on early feedback
- Complete accessibility audit and fixes
- Achieve 100% test coverage on critical paths

#### Focus Areas
| Area | Activities | Owner | Status |
|------|-----------|-------|--------|
| **Performance** | Optimize bundle size, lazy loading | [Name] | ⏳ Pending |
| **Accessibility** | WCAG 2.1 AA audit and fixes | [Name] | ⏳ Pending |
| **UX Polish** | Micro-interactions, animations | [Name] | ⏳ Pending |
| **Error Handling** | Comprehensive error states | [Name] | ⏳ Pending |
| **Documentation** | User guides, API docs | [Name] | ⏳ Pending |

#### Sprint 4: Polish & Optimization
[Use same sprint structure as Phase 1]

#### Sprint 5: Accessibility & Performance
[Use same sprint structure as Phase 1]

---

### Phase 3: Testing & Launch Preparation

**Duration:** [X weeks - typically 1-2 sprints]  
**Goal:** Comprehensive testing, staging validation, production readiness

#### Objectives
- Complete E2E test suite
- User acceptance testing (UAT)
- Load and performance testing
- Security penetration testing
- Launch preparation and documentation

#### Testing Matrix
| Test Type | Coverage Target | Status | Owner |
|-----------|----------------|--------|-------|
| Unit | 80% | [%] | [Name] |
| Integration | All critical paths | [X/Y] | [Name] |
| E2E | All user journeys | [X/Y] | [Name] |
| Performance | All benchmarks | [Pass/Fail] | [Name] |
| Security | OWASP Top 10 | [Pass/Fail] | [Name] |
| Accessibility | WCAG 2.1 AA | [Pass/Fail] | [Name] |

#### Sprint 6: Testing & QA
[Use same sprint structure]

#### Sprint 7: Launch Prep & Documentation
[Use same sprint structure]

---

### Phase 4: Launch & Stabilization

**Duration:** [X weeks]  
**Goal:** Production deployment and post-launch monitoring

#### Launch Checklist
- [ ] All tests passing (unit, integration, e2e)
- [ ] Performance benchmarks met
- [ ] Security scan passed (no critical/high vulnerabilities)
- [ ] Accessibility audit passed
- [ ] Documentation complete (user guides, API docs)
- [ ] Support team trained
- [ ] Monitoring and alerts configured
- [ ] Rollback plan tested
- [ ] Communication plan ready (users, stakeholders)
- [ ] Feature flags configured (if phased rollout)

#### Go-Live Plan
| Stage | Date | Activities | Success Criteria |
|-------|------|-----------|------------------|
| **Staging Deploy** | YYYY-MM-DD | Deploy to staging, smoke tests | All tests pass |
| **Beta Launch** | YYYY-MM-DD | Enable for 10% of users | No critical issues |
| **Gradual Rollout** | YYYY-MM-DD | Increase to 50% | Metrics stable |
| **Full Launch** | YYYY-MM-DD | Enable for 100% | Success metrics met |

#### Post-Launch Monitoring (First 2 Weeks)
- [ ] Error rate monitoring (<0.1% errors)
- [ ] Performance monitoring (meet SLA targets)
- [ ] User feedback collection
- [ ] Support ticket tracking
- [ ] Daily team check-ins

#### Post-Launch Success Criteria
- [ ] Error rate < 0.1%
- [ ] 95th percentile response time < [target]
- [ ] User satisfaction > [target]
- [ ] Key metrics trending positively

---

## 📈 Dependencies & Critical Path

### Dependency Graph
```
[Phase 0: Foundation]
    ↓
[Sprint 1: Core Feature A] ←─┐
    ↓                         │
[Sprint 2: Core Feature B] ──┤
    ↓                         │
[Sprint 3: Integration] ←─────┘
    ↓
[Sprint 4-5: Polish]
    ↓
[Sprint 6-7: Testing & Launch]
```

### External Dependencies
| Dependency | Required By | Status | Owner | Risk Level |
|------------|------------|--------|-------|-----------|
| [API/Service] | Sprint 2 | 🟢 Ready | [Team] | Low |
| [Design Assets] | Sprint 1 | 🟡 In Progress | [Designer] | Medium |
| [Third-Party Library] | Sprint 3 | 🔴 Blocked | [Vendor] | High |

### Blockers
| Blocker | Blocks | Impact | Mitigation | Owner |
|---------|--------|--------|------------|-------|
| [Issue] | Sprint 2 | High | [Strategy] | [Name] |

---

## 📊 Tracking & Metrics

### Velocity Tracking
| Sprint | Planned Points | Completed Points | Velocity | Trend |
|--------|---------------|------------------|----------|-------|
| Sprint 1 | 21 | - | - | - |
| Sprint 2 | 21 | - | - | - |
| Sprint 3 | 21 | - | - | - |
| Sprint 4 | 18 | - | - | - |
| Sprint 5 | 18 | - | - | - |
| **Avg** | **19.8** | - | - | - |

### Burndown Chart (Manual Update)
```
Story Points Remaining
40 |                    ●
35 |                 ●
30 |              ●
25 |           ●
20 |        ●
15 |     ●
10 |  ●
 5 |●
 0 |___________________
   S1 S2 S3 S4 S5 S6 S7
   
   ● Actual    --- Ideal
```

### Cumulative Flow
| Status | Sprint 1 | Sprint 2 | Sprint 3 | Sprint 4 | Sprint 5 |
|--------|----------|----------|----------|----------|----------|
| Done | 0 | 5 | 11 | 17 | 24 |
| In Review | 2 | 3 | 2 | 1 | 0 |
| In Progress | 5 | 4 | 3 | 2 | 0 |
| To Do | 20 | 15 | 11 | 7 | 3 |

---

## ⚠️ Risk Management

### Risk Register
| ID | Risk | Probability | Impact | Mitigation | Owner | Status |
|----|------|------------|--------|------------|-------|--------|
| R01 | [Risk description] | High | High | [Mitigation strategy] | [Name] | 🔴 Active |
| R02 | [Risk description] | Med | Med | [Mitigation strategy] | [Name] | 🟡 Monitoring |
| R03 | [Risk description] | Low | High | [Mitigation strategy] | [Name] | 🟢 Mitigated |

### Risk Response Strategies
- **R01:** [Detailed response plan]
- **R02:** [Detailed response plan]

---

## 🔄 Change Management

### Scope Change Process
1. Requestor submits change via [channel]
2. Product Owner evaluates impact
3. Tech Lead assesses technical feasibility
4. Team discusses in sprint planning
5. Adjust sprint plan or defer to backlog

### Approved Changes
| Date | Change | Requestor | Impact | Decision |
|------|--------|-----------|--------|----------|
| YYYY-MM-DD | [Description] | [Name] | [Impact] | [Approved/Deferred] |

---

## 🎯 Milestone Tracking

### Major Milestones
| Milestone | Target Date | Actual Date | Status | Notes |
|-----------|------------|-------------|--------|-------|
| Architecture Approved | YYYY-MM-DD | YYYY-MM-DD | ✅ Complete | |
| Phase 0 Complete | YYYY-MM-DD | - | ⏳ Pending | |
| MVP Complete | YYYY-MM-DD | - | ⏳ Pending | |
| Testing Complete | YYYY-MM-DD | - | ⏳ Pending | |
| Beta Launch | YYYY-MM-DD | - | ⏳ Pending | |
| GA Launch | YYYY-MM-DD | - | ⏳ Pending | |

---

## 🔁 Sprint Ceremonies

### Daily Standup
- **Time:** [Time] [Timezone]
- **Duration:** 15 minutes
- **Format:** Each person answers:
  1. What did I complete yesterday?
  2. What will I work on today?
  3. Are there any blockers?

### Sprint Planning
- **Frequency:** Start of each sprint
- **Duration:** 2-4 hours
- **Attendees:** Full team
- **Agenda:**
  1. Review sprint goal
  2. Present and clarify stories
  3. Estimate story points
  4. Commit to sprint scope
  5. Break down stories into tasks

### Sprint Review
- **Frequency:** End of each sprint
- **Duration:** 1-2 hours
- **Attendees:** Team + stakeholders
- **Agenda:**
  1. Demo completed stories
  2. Review sprint metrics
  3. Discuss what didn't get done
  4. Gather feedback

### Sprint Retrospective
- **Frequency:** End of each sprint (after review)
- **Duration:** 1 hour
- **Attendees:** Team only
- **Agenda:**
  1. What went well?
  2. What could be improved?
  3. Action items for next sprint

### Backlog Refinement
- **Frequency:** Mid-sprint
- **Duration:** 1 hour
- **Attendees:** Team + Product Owner
- **Agenda:**
  1. Review upcoming stories
  2. Clarify acceptance criteria
  3. Estimate story points
  4. Identify dependencies

---

## 📚 Retrospective Insights

### Sprint 1 Retrospective
**What Went Well:**
- [Positive outcome]
- [What the team did effectively]

**What to Improve:**
- [Challenge faced]
- [Area for improvement]

**Action Items:**
- [ ] [Specific action with owner and date]
- [ ] [Specific action with owner and date]

---

### Sprint 2 Retrospective
[Continue for each sprint]

---

## 📝 Notes & Decisions

### Key Decisions
| Date | Decision | Rationale | Impact | Decision Maker |
|------|----------|-----------|--------|---------------|
| YYYY-MM-DD | [Decision] | [Why] | [Impact] | [Name] |

### Parking Lot (Future Considerations)
- [Idea or topic to revisit later]
- [Feature to consider for next epic]

---

## ✅ Sprint Planning Checklist

Before considering sprint planning complete:

### Planning Readiness
- [ ] All user stories have acceptance criteria
- [ ] All user stories estimated (story points)
- [ ] Technical tasks identified for each story
- [ ] Dependencies mapped
- [ ] Risks identified and mitigation planned
- [ ] Team capacity calculated
- [ ] Sprint goals defined

### Constitution Compliance
- [ ] Simplicity gate passed (≤3 projects)
- [ ] Anti-abstraction principle applied
- [ ] Test-first approach planned for all stories
- [ ] Integration-first testing strategy defined
- [ ] CLI interfaces planned (where applicable)

### Communication
- [ ] Sprint plan reviewed with team
- [ ] Sprint plan reviewed with stakeholders
- [ ] Sprint goal communicated clearly
- [ ] Team has committed to sprint scope

---

**Document Owner:** [Name]  
**Last Updated:** YYYY-MM-DD  
**Next Review:** YYYY-MM-DD (or after each sprint)
