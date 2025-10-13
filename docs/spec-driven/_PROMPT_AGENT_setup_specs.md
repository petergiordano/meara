# Claude Code Prompt: Epic Specification Scaffolding

## 🎯 Your Mission

You are an expert specification architect working with a developer who follows **SLC (Simple, Lovable, Complete)** principles and **Spec-Driven Development (SDD)** methodology. Your task is to scaffold a comprehensive, production-ready specification suite for a new epic.

## 📋 Context & Environment

- **Development Environment:** VS Code with Claude Code integration
- **Deployment Target:** Vercel
- **Primary Stack:** React/Next.js, TypeScript, Tailwind CSS
- **Methodology:** SLC + Spec-Driven Development (Intent → Spec → Plan → Tasks → Implementation)
- **Architecture Philosophy:** Component-based, library-first, test-driven

## 🏗️ Task Overview

When the user provides an epic description, you will:

1. **Analyze** the epic to understand core value proposition
2. **Determine** epic naming (kebab-case) and numbering (e.g., 001, 002, 003)
3. **Create** the directory structure: `docs/PRD/EPIC_[number]-[name]/`
4. **Generate** all required specification files with rich, detailed content
5. **Ensure** internal consistency across all documents
6. **Mark** any ambiguities with `[NEEDS CLARIFICATION]` markers

## 📂 Required File Structure

Create these files in `docs/PRD/EPIC_[number]-[epic_name]/`:

```
docs/PRD/EPIC_[number]-[epic_name]/
├── README.md                          # Epic overview and navigation hub
├── PRD_[epic_name].md                 # Product Requirements Document
├── SPRINTS.md                         # Sprint planning and phases
├── DESIGN_SPEC_[epic_name].md         # UI/UX specifications
├── FUNCTIONAL_SPEC_[epic_name].md     # Feature-level requirements
└── TECHNICAL_SPEC_[epic_name].md      # Technical architecture
```

## 📖 File-by-File Requirements

### 1. README.md
**Purpose:** Epic navigation hub and status dashboard

**Must Include:**
- Epic title and one-sentence summary
- Current status badge (Planning/In Progress/Review/Complete)
- Quick links to all spec documents
- Key stakeholders and reviewers
- Last updated timestamp
- Quick start guide for developers joining mid-epic

**Template Structure:**
```markdown
# EPIC-[number]: [Epic Name]

> One-sentence value proposition

**Status:** 🟡 Planning | 🟢 In Progress | 🔵 In Review | ✅ Complete

## Quick Navigation
- [Product Requirements (PRD)](./PRD_[epic_name].md)
- [Design Specification](./DESIGN_SPEC_[epic_name].md)
- [Functional Specification](./FUNCTIONAL_SPEC_[epic_name].md)
- [Technical Specification](./TECHNICAL_SPEC_[epic_name].md)
- [Sprint Planning](./SPRINTS.md)

## Overview
[2-3 paragraph epic overview]

## Key Stakeholders
- **Product Owner:** [Name]
- **Tech Lead:** [Name]
- **Designer:** [Name]

## Timeline
- **Started:** YYYY-MM-DD
- **Target Completion:** YYYY-MM-DD
- **Last Updated:** YYYY-MM-DD
```

---

### 2. PRD_[epic_name].md
**Purpose:** Product Requirements Document - the "what" and "why"

**Must Include:**
- Problem statement and user pain points
- Success metrics (KPIs)
- User stories with acceptance criteria
- User personas affected
- Non-functional requirements
- Out of scope (what we're NOT building)
- Risk assessment and mitigation strategies

**Key Principles:**
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- Use `[NEEDS CLARIFICATION]` for ambiguities
- Every user story must have testable acceptance criteria

**Template Structure:**
```markdown
# Product Requirements Document: [Epic Name]

## Problem Statement
[Describe the user pain point this epic solves]

## Success Metrics
| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| [KPI 1] | [Target] | [How measured] |

## User Stories

### Story 1: [Title]
**As a** [user type]
**I want** [capability]
**So that** [benefit]

**Acceptance Criteria:**
- [ ] Given [context], when [action], then [outcome]
- [ ] Given [context], when [action], then [outcome]

**Priority:** High | Medium | Low
**Story Points:** [estimate]

## SLC Framework Application

### Simple
- [Core value proposition in one sentence]
- [Must-have features only]
- [What makes it intuitive?]

### Lovable
- [Delightful touches that make users smile]
- [Specific pain point this solves uniquely]
- [Personality elements]

### Complete
- [How does this fully solve the problem?]
- [What makes it production-ready?]
- [Standalone value proposition]

## Non-Functional Requirements
- Performance: [specific targets]
- Security: [requirements]
- Accessibility: WCAG 2.1 AA minimum
- Browser Support: [list]

## Out of Scope
- [Explicitly list what we're NOT building]

## Risk Assessment
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|

## Review & Acceptance Checklist
- [ ] No [NEEDS CLARIFICATION] markers remain
- [ ] All user stories have testable acceptance criteria
- [ ] Success metrics are measurable
- [ ] SLC principles applied (Simple, Lovable, Complete)
- [ ] Risks identified and mitigated
- [ ] Stakeholders have reviewed and approved
```

---

### 3. SPRINTS.md
**Purpose:** Sprint planning, phases, and timeline management

**Must Include:**
- Phase breakdown with clear gates
- Sprint-by-sprint feature mapping
- Dependencies between sprints
- Resource allocation
- Milestone definitions
- Risk mitigation per phase

**Template Structure:**
```markdown
# Sprint Planning: [Epic Name]

## Overview
- **Total Duration:** [X weeks]
- **Number of Sprints:** [Y]
- **Sprint Length:** 2 weeks
- **Team Size:** [Z developers]

## Phase Breakdown

### Phase 0: Foundation & Planning
**Duration:** [dates]
**Goal:** Establish architecture and validate approach

**Deliverables:**
- [ ] Technical architecture approved
- [ ] Design system components identified
- [ ] Development environment configured
- [ ] Initial test framework setup

**Phase Gate:**
- [ ] Constitution compliance verified
- [ ] Simplicity gate passed (≤3 projects)
- [ ] Anti-abstraction gate passed

---

### Phase 1: Core Implementation
**Duration:** [dates]
**Goal:** Build MVP with core user stories

#### Sprint 1: [Name]
**Dates:** [start] to [end]
**Focus:** [primary objective]

**User Stories:**
- [ ] Story #1: [Title] (Priority: High, Points: 5)
- [ ] Story #2: [Title] (Priority: High, Points: 3)

**Technical Tasks:**
- [ ] Task 1: [Description]
- [ ] Task 2: [Description]

**Dependencies:**
- Depends on: [None / Other sprint]
- Blocks: [Sprint X]

**Risks:**
- [Risk 1]: [Mitigation strategy]

---

#### Sprint 2: [Name]
[Repeat structure]

---

### Phase 2: Refinement & Polish
**Duration:** [dates]
**Goal:** Add lovable touches and ensure completeness

**Deliverables:**
- [ ] All acceptance criteria met
- [ ] Performance benchmarks achieved
- [ ] Accessibility audit passed
- [ ] Security review completed

---

### Phase 3: Testing & Launch
**Duration:** [dates]
**Goal:** Validation and production deployment

**Deliverables:**
- [ ] E2E test suite complete
- [ ] User acceptance testing
- [ ] Documentation complete
- [ ] Deployment automation verified

## Resource Allocation

| Sprint | Frontend | Backend | Design | QA |
|--------|----------|---------|--------|-----|
| Sprint 1 | 2 devs | 1 dev | 0.5 | 0.5 |

## Dependencies & Blockers

### External Dependencies
- [ ] [Dependency 1]: [Status]
- [ ] [Dependency 2]: [Status]

### Internal Dependencies
- [ ] [Team/Epic dependency]

## Milestone Tracking

| Milestone | Target Date | Status | Notes |
|-----------|-------------|--------|-------|
| Architecture Approved | YYYY-MM-DD | ⏳ Pending | |
| MVP Complete | YYYY-MM-DD | ⏳ Pending | |
| Beta Launch | YYYY-MM-DD | ⏳ Pending | |
| GA Launch | YYYY-MM-DD | ⏳ Pending | |

## Velocity Tracking

| Sprint | Planned Points | Completed Points | Velocity |
|--------|---------------|------------------|----------|
| Sprint 1 | 21 | - | - |
| Sprint 2 | 21 | - | - |

## Retrospective Notes

### Sprint 1 Retro
- **What went well:**
- **What to improve:**
- **Action items:**
```

---

### 4. DESIGN_SPEC_[epic_name].md
**Purpose:** UI/UX specifications and design system integration

**Must Include:**
- Component architecture and hierarchy
- Design system integration (colors, typography, spacing)
- Responsive design breakpoints
- Accessibility requirements (WCAG 2.1 AA)
- User flows and interaction patterns
- Micro-interactions and delightful touches
- Error states and edge case UI

**Template Structure:**
```markdown
# Design Specification: [Epic Name]

## Design Principles

### Simple
- [How will the UI be intuitive and uncluttered?]
- [What is the primary user action?]
- [How do we minimize cognitive load?]

### Lovable
- [What delightful micro-interactions will we include?]
- [How does the design evoke positive emotion?]
- [What's the personality of this feature?]

### Complete
- [How do we ensure no dead ends in the UI?]
- [What makes this feel finished and polished?]

## Design System Integration

### Colors
```css
/* Primary palette */
--primary: #[hex];
--secondary: #[hex];
--accent: #[hex];

/* Semantic colors */
--success: #[hex];
--warning: #[hex];
--error: #[hex];
--info: #[hex];
```

### Typography
- **Headings:** [Font family, weights]
- **Body:** [Font family, weights]
- **Code:** [Monospace font]

**Scale:**
- H1: [size/line-height]
- H2: [size/line-height]
- Body: [size/line-height]

### Spacing System
- **Base unit:** 4px or 8px
- **Scale:** 1x, 2x, 3x, 4x, 6x, 8x, 12x, 16x

## Component Architecture

### Component Hierarchy
```
[Epic Feature Component]
├── [Sub-component 1]
│   ├── [Child component]
│   └── [Child component]
├── [Sub-component 2]
└── [Sub-component 3]
```

### Key Components

#### Component 1: [Name]
**Purpose:** [What does this component do?]

**Props:**
```typescript
interface [Component]Props {
  prop1: string;
  prop2?: number;
  onAction: () => void;
}
```

**States:**
- Default
- Hover
- Active
- Disabled
- Error
- Loading

**Responsive Behavior:**
- Mobile (<640px): [behavior]
- Tablet (640-1024px): [behavior]
- Desktop (>1024px): [behavior]

**Accessibility:**
- ARIA labels: [specific requirements]
- Keyboard navigation: [tab order, shortcuts]
- Screen reader: [announcements]

---

## User Flows

### Flow 1: [Primary User Journey]
```
1. User lands on [screen]
   ↓
2. User sees [element]
   ↓
3. User clicks [CTA]
   ↓
4. System responds with [feedback]
   ↓
5. User reaches [goal state]
```

**Happy Path:**
- [Step-by-step successful completion]

**Error Paths:**
- [What happens when X fails?]
- [How do we guide user back to happy path?]

---

## Responsive Design

### Breakpoints
```css
/* Mobile First */
--mobile: 0px;      /* 0-639px */
--tablet: 640px;    /* 640-1023px */
--desktop: 1024px;  /* 1024-1439px */
--wide: 1440px;     /* 1440px+ */
```

### Layout Behavior
| Breakpoint | Layout | Navigation | Sidebar |
|------------|--------|------------|---------|
| Mobile | Stack | Hamburger | Hidden |
| Tablet | 2-col | Tabs | Collapsible |
| Desktop | 3-col | Full | Always visible |

---

## Interaction Patterns

### Micro-interactions
1. **Button Click:**
   - Visual: Scale down 0.98, brief shadow change
   - Duration: 150ms ease-out
   - Haptic: Light tap (mobile)

2. **Form Validation:**
   - Success: Green checkmark fade-in (300ms)
   - Error: Red shake animation (400ms) + error message
   - Real-time: Validate on blur, not on every keystroke

3. **Loading States:**
   - < 300ms: No indicator
   - 300ms - 3s: Spinner
   - > 3s: Progress bar with estimated time

### Animations
| Element | Trigger | Animation | Duration |
|---------|---------|-----------|----------|
| Modal | Open | Fade + scale | 200ms |
| Dropdown | Toggle | Slide down | 150ms |
| Toast | Appear | Slide up | 300ms |

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance
- [ ] Color contrast ratio ≥ 4.5:1 for normal text
- [ ] Color contrast ratio ≥ 3:1 for large text
- [ ] Focus indicators visible on all interactive elements
- [ ] No information conveyed by color alone
- [ ] All images have alt text
- [ ] Form inputs have associated labels

### Keyboard Navigation
- [ ] Tab order is logical
- [ ] All interactive elements reachable via keyboard
- [ ] Keyboard shortcuts documented
- [ ] Escape key closes modals/dropdowns

### Screen Reader Support
- [ ] Semantic HTML used throughout
- [ ] ARIA labels for icon-only buttons
- [ ] Live regions for dynamic content
- [ ] Skip links for main content

---

## Error States & Edge Cases

### Error State Matrix
| Scenario | Visual Treatment | User Message | Recovery Action |
|----------|-----------------|--------------|-----------------|
| Network timeout | Retry button | "Connection lost" | Auto-retry 3x |
| Validation error | Inline red message | [Specific error] | Clear guidance |
| Permission denied | Disabled state | "You don't have access" | Request access link |
| Empty state | Illustration + CTA | "Nothing here yet!" | Primary action |

### Edge Cases
1. **No data / Empty state:**
   - [Design treatment]
   - [User guidance]

2. **Extremely long content:**
   - [Truncation strategy]
   - [Expand/collapse behavior]

3. **Slow network:**
   - [Progressive loading]
   - [Skeleton screens]

---

## Design Deliverables Checklist
- [ ] All user flows documented
- [ ] Component library updated
- [ ] Responsive behavior specified for all breakpoints
- [ ] Accessibility audit completed
- [ ] Error states designed for all scenarios
- [ ] Micro-interactions defined
- [ ] Design tokens documented
- [ ] Figma files linked or embedded
```

---

### 5. FUNCTIONAL_SPEC_[epic_name].md
**Purpose:** Feature-level functional requirements and business logic

**Must Include:**
- Detailed feature descriptions
- Business rules and validation logic
- Data flow diagrams
- Integration points with other systems
- Edge cases and error handling scenarios
- State management requirements

**Template Structure:**
```markdown
# Functional Specification: [Epic Name]

## Feature Overview
[High-level description of what this epic enables users to do]

## Core Features

### Feature 1: [Feature Name]
**Description:** [Detailed explanation of what this feature does]

**User Capability:** Users can [action] by [method] to achieve [outcome]

**Business Rules:**
1. [Rule 1]: [Description and rationale]
2. [Rule 2]: [Description and rationale]
3. [Rule 3]: [Description and rationale]

**Validation Logic:**
- **Input validation:**
  - Field 1: [constraints, format, required/optional]
  - Field 2: [constraints, format, required/optional]
  
- **Business validation:**
  - [Condition 1]: [What happens if violated]
  - [Condition 2]: [What happens if violated]

**Success Criteria:**
- [ ] User can successfully [action]
- [ ] System validates [constraint]
- [ ] Error messages are clear and actionable
- [ ] Edge cases handled gracefully

---

### Feature 2: [Feature Name]
[Repeat structure for each feature]

---

## Data Flow

### Flow 1: [Process Name]
```
User Action → Frontend Validation → API Call → Backend Processing → Database Update → Response → UI Update
```

**Detailed Steps:**
1. **User Action:** [What the user does]
   - Input: [data provided]
   - Validation: [client-side checks]

2. **API Call:** [Endpoint details]
   - Method: POST/GET/PUT/DELETE
   - Endpoint: `/api/[path]`
   - Payload: [structure]

3. **Backend Processing:**
   - [Business logic applied]
   - [Transformations]
   - [External API calls if any]

4. **Database Update:**
   - Tables affected: [list]
   - Operations: [insert/update/delete]
   - Constraints: [validations]

5. **Response:**
   - Success: [data returned]
   - Error: [error codes and messages]

6. **UI Update:**
   - [How UI reflects the change]
   - [Loading states]
   - [Success/error feedback]

---

## Integration Points

### Internal Integrations
| System/Module | Integration Type | Data Exchanged | Dependency |
|---------------|------------------|----------------|------------|
| [Module A] | REST API | [Data type] | Required |
| [Module B] | Event bus | [Event type] | Optional |

### External Integrations
| Service | Purpose | API Version | Auth Method |
|---------|---------|-------------|-------------|
| [Service 1] | [Purpose] | v2 | OAuth 2.0 |
| [Service 2] | [Purpose] | v1 | API Key |

---

## State Management

### Application State
```typescript
interface [Feature]State {
  // Core data
  items: [Type][];
  selectedItem: [Type] | null;
  
  // UI state
  isLoading: boolean;
  error: Error | null;
  
  // User preferences
  viewMode: 'grid' | 'list';
  filters: FilterState;
}
```

### State Transitions
```
[Initial State]
  ↓ [Action: Load]
[Loading State]
  ↓ [Success]
[Loaded State] ←→ [Editing State]
  ↓ [Error]
[Error State] → [Retry] → [Loading State]
```

---

## Edge Cases & Error Handling

### Edge Case Matrix
| Scenario | System Behavior | User Experience | Technical Handling |
|----------|----------------|-----------------|-------------------|
| No internet connection | Queue actions locally | "Working offline" banner | Local storage + sync |
| Concurrent edits | Last-write-wins | Conflict notification | Timestamp validation |
| Expired session | Prompt re-auth | "Session expired" modal | Token refresh flow |
| Invalid input | Reject gracefully | Inline error message | Client validation |
| Server error (5xx) | Retry with backoff | "Please try again" toast | Exponential backoff |
| Rate limit hit | Queue requests | "Slow down" message | Request throttling |

### Error Categories

#### 1. Validation Errors (4xx)
**User-caused errors that can be corrected**

| Error Code | Scenario | User Message | Recovery |
|------------|----------|--------------|----------|
| 400 | Invalid input format | "[Field] must be [format]" | Show format example |
| 401 | Unauthorized | "Please log in to continue" | Redirect to login |
| 403 | Permission denied | "You don't have access to this" | Show upgrade prompt |
| 404 | Resource not found | "[Item] not found" | Offer search/browse |

#### 2. System Errors (5xx)
**System issues requiring technical intervention**

| Error Code | Scenario | User Message | Technical Action |
|------------|----------|--------------|-----------------|
| 500 | Server error | "Something went wrong. We're on it!" | Log + alert on-call |
| 503 | Service unavailable | "We're updating. Back soon!" | Show maintenance page |

#### 3. Business Logic Errors
**Custom application errors**

| Code | Scenario | User Message | Resolution |
|------|----------|--------------|------------|
| BL001 | Duplicate entry | "[Item] already exists" | Show existing item |
| BL002 | Quota exceeded | "You've reached your limit" | Upgrade prompt |
| BL003 | Dependency missing | "[Required item] must exist first" | Link to create |

---

## Security Considerations

### Authentication & Authorization
- **Authentication:** [Method - JWT, OAuth, etc.]
- **Authorization:** [Role-based, permission-based]
- **Session Management:** [Timeout, refresh strategy]

### Data Protection
- [ ] Sensitive data encrypted at rest
- [ ] HTTPS enforced for all communication
- [ ] Input sanitization on all user inputs
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (output encoding)
- [ ] CSRF protection (tokens)

### Privacy
- [ ] PII handling complies with GDPR/CCPA
- [ ] User consent for data collection
- [ ] Data retention policies defined
- [ ] Right to deletion implemented

---

## Performance Requirements

### Response Time Targets
| Action | Target | Maximum Acceptable |
|--------|--------|-------------------|
| Page load | < 1s | 3s |
| API response | < 200ms | 1s |
| Search results | < 300ms | 2s |
| File upload | Depends on size | Show progress |

### Scalability
- **Concurrent users:** [target number]
- **Data volume:** [records/GB]
- **Request rate:** [requests/second]

### Optimization Strategies
- [ ] Database indexing on [fields]
- [ ] Caching strategy: [approach]
- [ ] CDN for static assets
- [ ] Code splitting / lazy loading
- [ ] Image optimization (WebP, lazy load)

---

## Testing Requirements

### Test Coverage Targets
- Unit tests: 80% code coverage
- Integration tests: All critical paths
- E2E tests: All user stories

### Test Scenarios

#### Happy Path Tests
1. [Scenario 1]: [Steps to verify]
2. [Scenario 2]: [Steps to verify]

#### Edge Case Tests
1. [Edge case 1]: [Expected behavior]
2. [Edge case 2]: [Expected behavior]

#### Error Handling Tests
1. [Error scenario 1]: [Expected user experience]
2. [Error scenario 2]: [Expected user experience]

---

## Acceptance Checklist
- [ ] All features implemented per specification
- [ ] All business rules enforced
- [ ] All edge cases handled
- [ ] Error messages are clear and actionable
- [ ] Data validation works correctly
- [ ] Integration points tested
- [ ] Performance requirements met
- [ ] Security requirements satisfied
- [ ] Test coverage meets targets
```

---

### 6. TECHNICAL_SPEC_[epic_name].md
**Purpose:** Technical architecture, implementation details, and development guide

**Must Include:**
- Technology stack decisions with rationale
- Architecture diagrams
- API contracts (REST/GraphQL endpoints)
- Database schema and migrations
- Security implementation
- Testing strategy (unit, integration, e2e)
- DevOps and deployment configuration
- Performance optimization approach

**Template Structure:**
```markdown
# Technical Specification: [Epic Name]

## Technology Stack

### Frontend
| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| React | 18.x | UI framework | [Why chosen] |
| Next.js | 14.x | Framework | [Why chosen] |
| TypeScript | 5.x | Type safety | [Why chosen] |
| Tailwind CSS | 3.x | Styling | [Why chosen] |
| [Library] | [Ver] | [Purpose] | [Why chosen] |

### Backend
| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| Node.js | 20.x | Runtime | [Why chosen] |
| [Framework] | [Ver] | API framework | [Why chosen] |
| [ORM] | [Ver] | Database access | [Why chosen] |

### Database
| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| PostgreSQL | 15.x | Primary DB | [Why chosen] |
| Redis | 7.x | Caching | [Why chosen] |

### DevOps & Infrastructure
| Technology | Purpose | Rationale |
|------------|---------|-----------|
| Vercel | Hosting | [Why chosen] |
| GitHub Actions | CI/CD | [Why chosen] |
| [Monitoring tool] | Observability | [Why chosen] |

---

## Architecture Overview

### High-Level Architecture
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│   Next.js   │────▶│  API Routes │
│   (Client)  │◀────│   (SSR)     │◀────│  (Backend)  │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                                │
                                                ▼
                    ┌─────────────┐     ┌─────────────┐
                    │    Redis    │     │  PostgreSQL │
                    │   (Cache)   │     │  (Primary)  │
                    └─────────────┘     └─────────────┘
```

### Component Architecture
```
src/
├── app/                    # Next.js 14 App Router
│   ├── (routes)/          # Route groups
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── features/         # Feature-specific components
│   └── layouts/          # Layout components
├── lib/                  # Utility libraries
│   ├── api/             # API client
│   ├── db/              # Database utilities
│   └── utils/           # Helper functions
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
└── styles/              # Global styles
```

---

## Constitution Compliance

### Article I: Library-First Principle
**Status:** ✅ Compliant / ⚠️ Exception Required

[If exception: Explain why this feature cannot be a standalone library]

### Article II: CLI Interface Mandate
**CLI Commands:**
```bash
# Development
npm run dev              # Start dev server
npm run build           # Production build
npm run test            # Run tests

# Feature-specific
npm run [feature]:start
npm run [feature]:test
```

### Article III: Test-First Imperative
**Approach:** TDD with the following sequence:
1. Write failing tests (Red)
2. User validates test scenarios
3. Implement minimum code to pass (Green)
4. Refactor (Refactor)

### Article VII: Simplicity Gate
- [ ] Using ≤3 projects? **[Yes/No]**
- [ ] No future-proofing? **[Yes/No]**
- [ ] Avoiding speculative features? **[Yes/No]**

### Article VIII: Anti-Abstraction Gate
- [ ] Using framework directly (no unnecessary wrappers)? **[Yes/No]**
- [ ] Single model representation per entity? **[Yes/No]**

### Article IX: Integration-First Testing
- [ ] Contract tests defined before implementation? **[Yes/No]**
- [ ] Using real databases in tests (not mocks)? **[Yes/No]**

---

## API Contracts

### REST Endpoints

#### POST /api/[resource]
**Purpose:** [What this endpoint does]

**Request:**
```typescript
interface [Resource]CreateRequest {
  field1: string;
  field2: number;
  field3?: boolean;
}
```

**Response:**
```typescript
interface [Resource]Response {
  id: string;
  field1: string;
  field2: number;
  createdAt: string;
}
```

**Status Codes:**
- 201: Created successfully
- 400: Validation error
- 401: Unauthorized
- 500: Server error

**Example:**
```bash
curl -X POST https://api.example.com/api/[resource] \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [token]" \
  -d '{
    "field1": "value",
    "field2": 42
  }'
```

---

#### GET /api/[resource]
[Similar structure for each endpoint]

---

### GraphQL Schema (if applicable)
```graphql
type [Resource] {
  id: ID!
  field1: String!
  field2: Int!
  createdAt: DateTime!
}

type Query {
  [resource](id: ID!): [Resource]
  [resources](
    limit: Int = 20
    offset: Int = 0
  ): [[Resource]!]!
}

type Mutation {
  create[Resource](input: [Resource]Input!): [Resource]!
  update[Resource](id: ID!, input: [Resource]Input!): [Resource]!
  delete[Resource](id: ID!): Boolean!
}
```

---

## Data Models

### Entity Relationship Diagram
```
[Entity1]
├── id: UUID (PK)
├── field1: string
├── field2: number
└── [entity2_id]: UUID (FK) → [Entity2]

[Entity2]
├── id: UUID (PK)
├── field1: string
└── [entity1s]: [Entity1][] (1:many)
```

### Database Schema

#### Table: [table_name]
```sql
CREATE TABLE [table_name] (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  field1 VARCHAR(255) NOT NULL,
  field2 INTEGER NOT NULL CHECK (field2 >= 0),
  field3 JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  
  -- Indexes
  INDEX idx_[table]_field1 (field1),
  INDEX idx_[table]_created_at (created_at)
);

-- Trigger for updated_at
CREATE TRIGGER update_[table]_updated_at
  BEFORE UPDATE ON [table_name]
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### TypeScript Types
```typescript
// Database types (from Prisma/Drizzle)
export interface [Entity] {
  id: string;
  field1: string;
  field2: number;
  field3: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

// API types (what goes over the wire)
export interface [Entity]DTO {
  id: string;
  field1: string;
  field2: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Form types (what the UI works with)
export interface [Entity]FormData {
  field1: string;
  field2: number;
}
```

### Migrations Strategy
```bash
# Create migration
npm run db:migration:create add_[table]_table

# Run migrations
npm run db:migration:run

# Rollback migration
npm run db:migration:rollback
```

---

## Security Implementation

### Authentication
**Method:** JWT (JSON Web Tokens)

**Flow:**
1. User submits credentials
2. Server validates and generates JWT
3. Client stores JWT (httpOnly cookie or memory)
4. Client sends JWT in Authorization header
5. Server validates JWT on each request

**Token Structure:**
```typescript
interface JWTPayload {
  userId: string;
  email: string;
  role: 'admin' | 'user';
  iat: number; // issued at
  exp: number; // expiration (15 minutes)
}
```

**Refresh Token Strategy:**
- Access token: 15 minutes
- Refresh token: 7 days
- Rotation on refresh

### Authorization
**Role-Based Access Control (RBAC)**

| Role | Permissions |
|------|------------|
| Admin | All operations |
| User | Read, Update own resources |
| Guest | Read public resources only |

**Middleware:**
```typescript
export function requireAuth(roles?: Role[]) {
  return async (req, res, next) => {
    // 1. Extract JWT from header
    // 2. Verify JWT signature
    // 3. Check expiration
    // 4. Verify role if specified
    // 5. Attach user to req.user
    // 6. Call next() or return 401/403
  };
}
```

### Input Validation
**Library:** Zod for runtime type validation

```typescript
import { z } from 'zod';

const [Resource]Schema = z.object({
  field1: z.string().min(1).max(255),
  field2: z.number().int().positive(),
  field3: z.string().email().optional(),
});

// In API route
export async function POST(req: Request) {
  const body = await req.json();
  const validated = [Resource]Schema.parse(body); // Throws if invalid
  // ... proceed with validated data
}
```

### Rate Limiting
**Strategy:** Token bucket algorithm

```typescript
// Per user: 100 requests per 15 minutes
// Per IP: 1000 requests per hour

import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each user to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
```

### Data Encryption
- **At Rest:** Database-level encryption (PostgreSQL)
- **In Transit:** TLS 1.3 minimum
- **Sensitive Fields:** Application-level encryption for PII

```typescript
import { encrypt, decrypt } from '@/lib/crypto';

// Before saving to DB
const encryptedSSN = encrypt(user.ssn);

// When retrieving
const decryptedSSN = decrypt(dbUser.ssn_encrypted);
```

---

## Testing Strategy

### Testing Pyramid
```
        ╱╲
       ╱E2E╲     ← Few (5-10 critical user flows)
      ╱────╲
     ╱ Intg ╲    ← Some (20-30 integration tests)
    ╱────────╲
   ╱   Unit   ╲  ← Many (100+ unit tests)
  ╱────────────╲
```

### Unit Tests
**Framework:** Jest + React Testing Library

**Coverage Target:** 80% overall, 100% for critical business logic

**Example:**
```typescript
// src/lib/utils/[function].test.ts
import { [functionName] } from './[function]';

describe('[functionName]', () => {
  it('should [expected behavior]', () => {
    const input = [test data];
    const result = [functionName](input);
    expect(result).toBe([expected output]);
  });

  it('should handle edge case: [scenario]', () => {
    // Test edge case
  });

  it('should throw error when [invalid condition]', () => {
    expect(() => [functionName]([bad input])).toThrow();
  });
});
```

### Integration Tests
**Framework:** Jest + Supertest (for API routes)

**Approach:** Test API endpoints with real database (test DB)

**Example:**
```typescript
// src/app/api/[resource]/route.test.ts
import { POST } from './route';
import { testDb } from '@/lib/test-utils';

beforeEach(async () => {
  await testDb.reset(); // Clean slate
});

describe('POST /api/[resource]', () => {
  it('should create a new resource', async () => {
    const response = await POST({
      json: async () => ({ field1: 'test', field2: 42 })
    });
    
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.id).toBeDefined();
    
    // Verify in database
    const saved = await testDb.[resource].findUnique({ 
      where: { id: body.id } 
    });
    expect(saved).toBeDefined();
  });
});
```

### E2E Tests
**Framework:** Playwright

**Scope:** Critical user journeys only

**Example:**
```typescript
// e2e/[feature].spec.ts
import { test, expect } from '@playwright/test';

test('User can [complete critical flow]', async ({ page }) => {
  // 1. Navigate to page
  await page.goto('/[route]');
  
  // 2. Perform action
  await page.fill('[data-testid="field1"]', 'test value');
  await page.click('[data-testid="submit-button"]');
  
  // 3. Verify outcome
  await expect(page.locator('[data-testid="success-message"]'))
    .toBeVisible();
});
```

### Test Data Management
**Strategy:** Factories + fixtures

```typescript
// src/lib/test-utils/factories.ts
export function create[Entity](overrides?: Partial<[Entity]>) {
  return {
    id: uuid(),
    field1: 'default value',
    field2: 42,
    createdAt: new Date(),
    ...overrides,
  };
}
```

---

## Performance Optimization

### Frontend Optimization
1. **Code Splitting:**
   ```typescript
   // Use dynamic imports for heavy components
   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     loading: () => <Spinner />,
     ssr: false, // Client-only if not needed for SEO
   });
   ```

2. **Image Optimization:**
   ```tsx
   import Image from 'next/image';
   
   <Image
     src="/image.jpg"
     alt="Description"
     width={800}
     height={600}
     loading="lazy"
     placeholder="blur"
   />
   ```

3. **Caching Strategy:**
   - Static assets: 1 year cache
   - API responses: Per-endpoint strategy
   - Client-side: React Query with stale-while-revalidate

### Backend Optimization
1. **Database Indexing:**
   ```sql
   -- Index frequently queried fields
   CREATE INDEX idx_[table]_[field] ON [table]([field]);
   
   -- Composite index for common query patterns
   CREATE INDEX idx_[table]_[field1]_[field2] 
     ON [table]([field1], [field2]);
   ```

2. **Query Optimization:**
   - Use `SELECT` with specific fields (no `SELECT *`)
   - Implement pagination for large datasets
   - Use database-level aggregations

3. **Caching with Redis:**
   ```typescript
   import Redis from 'ioredis';
   const redis = new Redis(process.env.REDIS_URL);
   
   export async function getCached[Data](key: string) {
     const cached = await redis.get(key);
     if (cached) return JSON.parse(cached);
     
     const fresh = await fetchFrom[Source]();
     await redis.setex(key, 3600, JSON.stringify(fresh)); // 1 hour
     return fresh;
   }
   ```

### Performance Monitoring
**Tools:** Vercel Analytics + Custom metrics

**Key Metrics:**
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- First Input Delay (FID): < 100ms
- Cumulative Layout Shift (CLS): < 0.1

---

## DevOps & Deployment

### CI/CD Pipeline (GitHub Actions)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:ci
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Environment Variables
```bash
# .env.example
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db"
REDIS_URL="redis://host:6379"

# Authentication
JWT_SECRET="your-secret-key-here"
JWT_EXPIRATION="15m"
REFRESH_TOKEN_EXPIRATION="7d"

# External APIs
[SERVICE]_API_KEY="your-api-key"

# Feature Flags
FEATURE_[NAME]_ENABLED="true"

# Monitoring
SENTRY_DSN="your-sentry-dsn"
```

### Database Migrations
**On Deploy:**
```bash
# Vercel build command
npm run build && npm run db:migrate:deploy
```

**Rollback Strategy:**
1. Keep previous deployment alive
2. Test new deployment on preview URL
3. If issues, rollback via Vercel dashboard
4. Run migration rollback if needed

### Monitoring & Observability
**Tools:**
- Error tracking: Sentry
- Performance: Vercel Analytics
- Logs: Vercel Logs + CloudWatch
- Uptime: UptimeRobot

**Alerts:**
- Error rate > 1%
- Response time > 3s
- Deployment failures
- Database connection issues

---

## Development Workflow

### Branch Strategy
```
main (production)
  └── develop (staging)
       └── feature/[epic-number]-[feature-name]
```

### Commit Convention
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** feat, fix, docs, style, refactor, test, chore

**Example:**
```
feat(auth): implement JWT refresh token rotation

- Add refresh token to user session
- Implement rotation on token refresh
- Update middleware to handle expired tokens

Closes #123
```

### Code Review Checklist
- [ ] Tests pass locally and in CI
- [ ] Code follows project style guide
- [ ] No unnecessary abstraction (Article VIII)
- [ ] Security considerations addressed
- [ ] Performance impact considered
- [ ] Documentation updated
- [ ] Accessibility verified

---

## Implementation Phases

### Phase -1: Pre-Implementation Gates
#### Simplicity Gate (Article VII)
- [ ] Using ≤3 projects?
- [ ] No future-proofing?

#### Anti-Abstraction Gate (Article VIII)
- [ ] Using framework directly?
- [ ] Single model representation?

#### Integration-First Gate (Article IX)
- [ ] Contracts defined?
- [ ] Contract tests written?

### Phase 0: Foundation
**Duration:** [X days]
**Goal:** Set up development environment and architecture

**Tasks:**
- [ ] Initialize Next.js project
- [ ] Configure TypeScript
- [ ] Set up database schema
- [ ] Configure testing framework
- [ ] Set up CI/CD pipeline
- [ ] Create component library structure

**Deliverables:**
- [ ] Project scaffolding complete
- [ ] Development environment documented
- [ ] First test passing

### Phase 1: Core Implementation
[See SPRINTS.md for detailed breakdown]

### Phase 2: Testing & Refinement
**Focus:** Ensure completeness and quality

**Tasks:**
- [ ] Integration test suite complete
- [ ] E2E tests for critical paths
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Security review

### Phase 3: Documentation & Deployment
**Tasks:**
- [ ] API documentation complete
- [ ] User guide written
- [ ] Deployment runbook created
- [ ] Production deployment
- [ ] Post-launch monitoring

---

## Technical Risks & Mitigation

| Risk | Probability | Impact | Mitigation Strategy |
|------|------------|--------|-------------------|
| Database performance at scale | Medium | High | Implement caching, optimize queries, monitor closely |
| Third-party API downtime | Low | Medium | Implement circuit breaker, fallback strategy |
| Security vulnerability | Low | High | Regular security audits, automated scanning |
| Browser compatibility issues | Medium | Low | Polyfills, feature detection, progressive enhancement |

---

## Acceptance Criteria

### Technical Acceptance
- [ ] All tests pass (unit, integration, e2e)
- [ ] Code coverage meets targets (80%+)
- [ ] Performance benchmarks met
- [ ] Security scan passes (no critical/high issues)
- [ ] Accessibility audit passes (WCAG 2.1 AA)
- [ ] Code review approved
- [ ] Documentation complete

### Deployment Acceptance
- [ ] Deployed to staging without errors
- [ ] Smoke tests pass on staging
- [ ] Database migrations successful
- [ ] Environment variables configured
- [ ] Monitoring and alerts active
- [ ] Rollback plan tested

### SLC Acceptance
- [ ] **Simple:** Core value delivered without unnecessary complexity
- [ ] **Lovable:** Delightful user experience with thoughtful details
- [ ] **Complete:** Fully solves the problem, production-ready

---

## References & Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vercel Docs](https://vercel.com/docs)

### Internal Resources
- [Project Constitution](../../memory/constitution.md)
- [Design System](../../docs/design-system.md)
- [API Style Guide](../../docs/api-style-guide.md)

### External APIs
- [[Service] API Documentation](https://example.com/docs)
```

---

## 🎨 Prompting Claude Code

Once you have these templates, use this workflow:

### Step 1: Provide Context
```
Claude, I need to scaffold a new epic. Before we begin, please review:
1. /docs/constitution.md - Our development principles
2. /docs/SLC-Framework.md - Our product methodology
3. /docs/spec-driven.md - Our specification process

I'll describe the epic, and you'll generate all specification files.
```

### Step 2: Describe the Epic
```
Epic Description:
[Provide detailed description of what you want to build, focusing on the problem, users, and desired outcomes. Be specific about the "what" and "why", but avoid prescribing the "how".]

Example:
"Build a real-time collaborative markdown editor that allows multiple users to edit documents simultaneously. Users need Google Docs-like collaboration for technical documentation. The editor should support syntax highlighting, live preview, and presence indicators showing who's currently editing."
```

### Step 3: Let Claude Scaffold
Claude will:
1. Create the epic directory structure
2. Generate all specification files
3. Apply SLC principles throughout
4. Mark ambiguities for clarification
5. Ensure constitution compliance

### Step 4: Iterate & Clarify
```
Review the generated specs and:
1. Address any [NEEDS CLARIFICATION] markers
2. Refine user stories and acceptance criteria
3. Validate technical approach
4. Approve or request revisions
```

---

## 💡 Tips for Success

1. **Be Specific:** The more detail in your epic description, the better the specs
2. **Iterate:** Don't expect perfection on first generation - refine through dialogue
3. **Reference Examples:** Point to similar features or past epics as examples
4. **Validate Early:** Review the PRD and functional spec before technical spec
5. **Use Checklists:** Each spec has a checklist - use it to validate completeness

---

## 📊 Quality Gates

Before considering specs "done":

### Completeness Gate
- [ ] All [NEEDS CLARIFICATION] markers resolved
- [ ] All cross-references between docs are valid
- [ ] All user stories have acceptance criteria
- [ ] All technical decisions have rationale

### SLC Gate
- [ ] Simple: Core value proposition clear, no unnecessary features
- [ ] Lovable: Delightful touches identified
- [ ] Complete: Fully solves the problem, no major gaps

### Constitution Gate
- [ ] Library-first principle applied (or exception justified)
- [ ] CLI interfaces specified
- [ ] TDD approach documented
- [ ] Simplicity gate passed (≤3 projects)
- [ ] Anti-abstraction verified

### Technical Gate
- [ ] Tech stack decisions documented with rationale
- [ ] API contracts defined
- [ ] Database schema specified
- [ ] Testing strategy comprehensive
- [ ] Security considerations addressed
- [ ] Performance requirements defined

---

## 🚀 Next Steps After Scaffolding

Once specs are complete:

1. **Create Feature Branch:**
   ```bash
   git checkout -b feature/[epic-number]-[epic-name]
   ```

2. **Use /plan Command:**
   ```
   /plan [technical approach based on TECHNICAL_SPEC]
   ```

3. **Generate Tasks:**
   ```
   /tasks
   ```

4. **Begin Implementation:**
   ```
   /implement
   ```

---

## 📚 Example Invocation

```markdown
Claude, I need to scaffold EPIC-005: User Authentication System.

**Context:** Review our constitution.md, SLC-Framework.md, and spec-driven.md first.

**Epic Description:**
Build a secure authentication system that allows users to sign up, log in, and manage their accounts. Users need a reliable way to protect their data and access our platform. The system should support:
- Email/password registration and login
- OAuth integration (Google, GitHub)
- Password reset via email
- Two-factor authentication (optional for users)
- Session management with JWT tokens
- Account settings page for profile updates

This is the foundation for all user-specific features, so it must be rock-solid, secure, and easy to use. Users should feel confident their data is protected, and the signup/login flow should be delightfully simple (no 20-field registration forms!).

**SLC Application:**
- Simple: Focus on core auth flows first, defer advanced features
- Lovable: Smooth onboarding, clear security messaging, optional social login
- Complete: Fully handles authentication, secure session management, no security gaps

Please scaffold all specification files for this epic.
```

---

This prompt structure ensures Claude Code generates comprehensive, consistent, and high-quality specifications that align with your SLC principles and spec-driven development methodology.