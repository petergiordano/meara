# EPIC-[number]: [Epic Name]

> **One-sentence value proposition:** [Concise description of what this epic delivers and why it matters]

**Status:** 🟡 Planning | 🟢 In Progress | 🔵 In Review | ✅ Complete  
**Priority:** 🔴 High | 🟠 Medium | 🟢 Low  
**Complexity:** 🔥🔥🔥 High | 🔥🔥 Medium | 🔥 Low

---

## 📋 Quick Navigation

| Document | Purpose | Status |
|----------|---------|--------|
| [Product Requirements (PRD)](./PRD_[epic_name].md) | What & why we're building | ⏳ Draft |
| [Design Specification](./DESIGN_SPEC_[epic_name].md) | UI/UX and visual design | ⏳ Draft |
| [Functional Specification](./FUNCTIONAL_SPEC_[epic_name].md) | Feature details and business logic | ⏳ Draft |
| [Technical Specification](./TECHNICAL_SPEC_[epic_name].md) | Architecture and implementation | ⏳ Draft |
| [Sprint Planning](./SPRINTS.md) | Timeline, phases, and tasks | ⏳ Draft |

---

## 🎯 Epic Overview

### Problem Statement
[2-3 sentences describing the user problem this epic solves. Be specific about the pain point.]

### Solution Summary
[2-3 sentences describing how this epic solves the problem. Focus on value delivered.]

### Success Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| [Primary KPI] | [Target value] | [How measured] |
| [Secondary KPI] | [Target value] | [How measured] |

---

## 👥 Key Stakeholders

| Role | Name | Responsibility |
|------|------|----------------|
| **Product Owner** | [Name] | Final approval on requirements and priorities |
| **Tech Lead** | [Name] | Architecture decisions and technical direction |
| **Designer** | [Name] | UI/UX design and user experience |
| **QA Lead** | [Name] | Test strategy and quality assurance |
| **PM** | [Name] | Project coordination and timeline management |

---

## 📅 Timeline

| Milestone | Target Date | Status | Notes |
|-----------|-------------|--------|-------|
| Specs Complete | YYYY-MM-DD | ⏳ Pending | All spec docs reviewed and approved |
| Development Start | YYYY-MM-DD | ⏳ Pending | Feature branch created, first commit |
| Alpha Release | YYYY-MM-DD | ⏳ Pending | Internal testing begins |
| Beta Release | YYYY-MM-DD | ⏳ Pending | Limited user testing |
| Production Launch | YYYY-MM-DD | ⏳ Pending | General availability |

---

## 🚀 Quick Start for Developers

### Prerequisites
- [ ] Read [Project Constitution](../../memory/constitution.md)
- [ ] Review [SLC Framework](../../docs/SLC-Framework.md)
- [ ] Understand [Spec-Driven Development](../../docs/spec-driven.md)

### Getting Started
1. **Read the specs in order:**
   - Start with [PRD](./PRD_[epic_name].md) to understand the "what" and "why"
   - Review [DESIGN_SPEC](./DESIGN_SPEC_[epic_name].md) for UI/UX requirements
   - Study [FUNCTIONAL_SPEC](./FUNCTIONAL_SPEC_[epic_name].md) for detailed features
   - Dive into [TECHNICAL_SPEC](./TECHNICAL_SPEC_[epic_name].md) for implementation details

2. **Set up your environment:**
   ```bash
   # Clone the repository
   git clone [repo-url]
   
   # Create feature branch
   git checkout -b feature/[epic-number]-[epic-name]
   
   # Install dependencies
   npm install
   
   # Run tests
   npm test
   ```

3. **Follow the TDD workflow:**
   - Write tests first (see TECHNICAL_SPEC for test strategy)
   - Implement minimum code to pass tests
   - Refactor while keeping tests green

---

## 📊 Epic Scope

### In Scope
- [Feature 1]: [Brief description]
- [Feature 2]: [Brief description]
- [Feature 3]: [Brief description]

### Out of Scope (Deferred to Future Epics)
- [Deferred feature 1]: [Why deferred]
- [Deferred feature 2]: [Why deferred]

### Dependencies
- **Depends on:** [Other epic/feature that must be complete first]
- **Blocks:** [Other epic/feature that depends on this]
- **External dependencies:** [Third-party services, APIs, or approvals needed]

---

## 🎨 SLC Framework Application

### Simple
**Core Value Proposition:** [One sentence describing the essential value]

**Ruthless Prioritization:**
- ✅ Must-have: [Critical features for MVP]
- ⏳ Nice-to-have: [Features for future iterations]
- ❌ Out of scope: [Features explicitly not included]

**Intuitive Experience:**
- [How we minimize friction]
- [What makes it easy to understand]
- [Primary user action is obvious]

### Lovable
**Delightful Touches:**
- [Micro-interaction 1]: [Description]
- [Micro-interaction 2]: [Description]
- [Personality element]: [Description]

**Pain Point Solution:**
- [Specific pain this solves uniquely]
- [How it feels novel or special]
- [Why users will enjoy using this]

**User Feedback Integration:**
- [Key insight from user research]
- [How we addressed user needs]

### Complete
**Promise Fulfillment:**
- [How this fully solves the stated problem]
- [What makes it production-ready]
- [Why it has standalone value]

**No Dead Ends:**
- [All user journeys have clear next steps]
- [Error states have recovery paths]
- [Edge cases are handled gracefully]

**Quality Standards:**
- [Performance targets met]
- [Accessibility standards achieved]
- [Security requirements satisfied]

---

## 🔄 Development Status

### Current Phase
**Phase:** [Planning | Development | Testing | Launch]  
**Sprint:** [Current sprint number]  
**Progress:** [X%] complete

### Recent Updates
| Date | Update | Author |
|------|--------|--------|
| YYYY-MM-DD | [Most recent change] | [Name] |
| YYYY-MM-DD | [Previous change] | [Name] |

### Blockers & Risks
| Status | Issue | Impact | Mitigation | Owner |
|--------|-------|--------|------------|-------|
| 🔴 Active | [Blocker description] | High | [Mitigation plan] | [Name] |
| 🟡 Monitoring | [Risk description] | Medium | [Mitigation plan] | [Name] |

---

## 📈 Progress Tracking

### Sprint Velocity
| Sprint | Planned Points | Completed Points | Velocity |
|--------|---------------|------------------|----------|
| Sprint 1 | 21 | - | - |
| Sprint 2 | 21 | - | - |
| Sprint 3 | 21 | - | - |

### Feature Completion
```
[=========================>                  ] 55% Complete

User Stories: 11/20 complete
Test Coverage: 78%
Documentation: 65%
```

---

## 🧪 Testing Status

### Test Coverage
- **Unit Tests:** [X]% coverage ([Y] tests)
- **Integration Tests:** [X] critical paths covered
- **E2E Tests:** [X] user journeys automated
- **Manual Tests:** [X] scenarios validated

### Quality Metrics
| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Code Coverage | 80% | [X]% | 🟢 On track |
| Bug Count | < 5 | [Y] | 🟡 Monitoring |
| Performance | < 2s load | [Z]s | 🟢 Meeting target |
| Accessibility | WCAG AA | [Score] | 🟢 Passing |

---

## 📚 Related Documentation

### Internal Resources
- [Project Constitution](../../memory/constitution.md)
- [SLC Framework](../../docs/SLC-Framework.md)
- [Spec-Driven Development Guide](../../docs/spec-driven.md)
- [Design System](../../docs/design-system.md)
- [API Style Guide](../../docs/api-style-guide.md)

### External References
- [Relevant framework documentation]
- [Third-party API docs]
- [Industry best practices]

### Architecture Decision Records (ADRs)
- [ADR-XXX]: [Decision title and link]
- [ADR-YYY]: [Decision title and link]

---

## 🤝 Contributing

### How to Contribute
1. Review the specs thoroughly
2. Follow the [Git Workflow](../../docs/git-workflow.md)
3. Write tests first (TDD)
4. Ensure constitution compliance
5. Submit PR with [PR template]

### Code Review Checklist
- [ ] Tests pass (unit, integration, e2e)
- [ ] Code coverage meets targets
- [ ] Constitution principles followed
- [ ] Documentation updated
- [ ] Accessibility verified
- [ ] Security considerations addressed

---

## 💬 Communication

### Slack Channels
- **#epic-[epic-name]** - Epic-specific discussions
- **#dev-team** - General development questions
- **#design-review** - Design feedback and reviews

### Meeting Schedule
- **Daily Standup:** [Time] in [location/link]
- **Sprint Planning:** [Day/time]
- **Sprint Review:** [Day/time]
- **Sprint Retrospective:** [Day/time]

### Questions?
- For technical questions: @[tech-lead] in Slack
- For product questions: @[product-owner] in Slack
- For design questions: @[designer] in Slack

---

## 📝 Change Log

### Version History
| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | YYYY-MM-DD | Initial epic specification | [Name] |
| 1.1 | YYYY-MM-DD | [Description of changes] | [Name] |

---

## ✅ Spec Review Checklist

Before considering this epic "spec complete":

### Completeness
- [ ] All spec documents created and populated
- [ ] All cross-references between docs are valid
- [ ] All [NEEDS CLARIFICATION] markers resolved
- [ ] All user stories have acceptance criteria
- [ ] All technical decisions have documented rationale

### SLC Framework
- [ ] **Simple:** Core value proposition is clear
- [ ] **Simple:** Only must-have features included
- [ ] **Lovable:** Delightful touches identified
- [ ] **Lovable:** Unique pain point solution articulated
- [ ] **Complete:** Fully solves stated problem
- [ ] **Complete:** No major gaps or dead ends

### Constitution Compliance
- [ ] Library-first principle applied (or exception justified)
- [ ] CLI interfaces specified where applicable
- [ ] TDD approach documented
- [ ] Simplicity gate passed (≤3 projects)
- [ ] Anti-abstraction principle followed
- [ ] Integration-first testing strategy defined

### Stakeholder Approval
- [ ] Product Owner reviewed and approved PRD
- [ ] Designer reviewed and approved DESIGN_SPEC
- [ ] Tech Lead reviewed and approved TECHNICAL_SPEC
- [ ] Team has reviewed SPRINTS and timeline
- [ ] Security review completed (if applicable)

---

## 🎓 Learning & Resources

### Onboarding for New Team Members
1. **Week 1:** Read all specs, understand the problem and solution
2. **Week 2:** Pair with experienced developer, implement small feature
3. **Week 3:** Take ownership of a user story
4. **Ongoing:** Participate in code reviews, share knowledge

### Key Learnings & Retrospectives
- [Learning 1]: [What we learned and how we applied it]
- [Learning 2]: [What we learned and how we applied it]

### Useful Commands
```bash
# Start development server
npm run dev

# Run tests in watch mode
npm run test:watch

# Run linter
npm run lint

# Check types
npm run type-check

# Build for production
npm run build

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:prod
```

---

**Last Updated:** YYYY-MM-DD  
**Document Owner:** [Name]  
**Next Review Date:** YYYY-MM-DD

---

## 🙏 Acknowledgements

[Thank team members, contributors, or others who have helped shape this epic]
