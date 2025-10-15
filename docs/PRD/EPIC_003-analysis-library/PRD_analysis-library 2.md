# MEARA Analysis Library & Sharing System

**Created**: 2025-10-13
**Owner**: Scale Venture Partners
**Status**: Planning
**Priority**: HIGH (enables team collaboration)

---

## Executive Summary

Design and implement a centralized library system for storing, browsing, and sharing MEARA analyses across the Scale Venture Partners team. This system will enable colleagues to easily discover and learn from past analyses, compare companies, and build institutional knowledge.

### Core Value Propositions
1. **Discovery**: "What analyses have we done on companies like X?"
2. **Comparison**: "How does this company compare to our top performers?"
3. **Learning**: "What recommendations worked for similar companies?"
4. **Collaboration**: "Share this analysis with the investment committee"

---

## Problem Statement

### Current State (After Phase 1)
- ✅ Users can generate and download MEARA analyses
- ❌ Analyses are downloaded as files (markdown/PDF)
- ❌ No central repository of past analyses
- ❌ No way to search or filter analyses
- ❌ No way to share analyses with team members
- ❌ No comparison or benchmarking capabilities

### User Stories

**As a Scale Partner**, I want to:
- Browse all analyses for my portfolio companies
- Compare a prospect's MEARA to successful portfolio companies
- Share an analysis with the investment committee before a board meeting
- See trends across multiple companies in a sector

**As a Portfolio Support Team Member**, I want to:
- Search for analyses by company name, sector, or issue type
- Reference past recommendations when advising new companies
- Track which companies have been analyzed recently
- See which recommendations are most common across the portfolio

**As an Investment Analyst**, I want to:
- View all analyses for companies in my coverage area
- Filter analyses by date, sector, stage, or score
- Download or share specific analyses for due diligence

---

## System Architecture

### High-Level Components

```
┌─────────────────────────────────────────────────┐
│            MEARA Frontend (Next.js)             │
│ ┌──────────────┐  ┌──────────────┐             │
│ │  Analysis    │  │  Analysis    │             │
│ │  Generator   │  │  Library     │             │
│ └──────────────┘  └──────────────┘             │
│         │                 │                      │
└─────────┼─────────────────┼──────────────────────┘
          │                 │
          ▼                 ▼
┌─────────────────────────────────────────────────┐
│         Railway Backend (FastAPI)                │
│ ┌──────────────────────────────────────────┐   │
│ │  Analysis Storage & Retrieval API        │   │
│ │  - POST /api/library/store               │   │
│ │  - GET /api/library/list                 │   │
│ │  - GET /api/library/{id}                 │   │
│ │  - GET /api/library/search               │   │
│ │  - GET /api/library/compare              │   │
│ └──────────────────────────────────────────┘   │
│         │                                        │
└─────────┼────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────┐
│      Database (PostgreSQL or SQLite)            │
│                                                  │
│  Tables:                                        │
│  - analyses (metadata + full report)            │
│  - companies (company info)                     │
│  - tags (sector, stage, issues)                 │
│  - shares (access control)                      │
└─────────────────────────────────────────────────┘
```

---

## Database Schema

### Table: `analyses`
```sql
CREATE TABLE analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    company_url VARCHAR(500),
    company_sector VARCHAR(100),
    company_stage VARCHAR(50), -- seed, series-a, series-b, etc.

    -- Analysis metadata
    analysis_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    analyst_email VARCHAR(255), -- Scale employee who ran analysis
    deepstack_job_id VARCHAR(100),
    analysis_job_id VARCHAR(100) UNIQUE NOT NULL,

    -- Analysis outputs
    report_markdown TEXT NOT NULL,
    report_json JSONB, -- Structured data for dashboard

    -- Scores & metrics
    overall_score INTEGER, -- 0-100
    dimension_scores JSONB, -- {market_positioning: 45, buyer_journey: 60, ...}
    top_recommendations JSONB, -- Array of top 3 recs
    critical_issues JSONB, -- Array of critical issues

    -- File references
    pdf_file_path VARCHAR(500),
    deepstack_json_path VARCHAR(500),
    drb_file_path VARCHAR(500),

    -- Access control
    is_public BOOLEAN DEFAULT FALSE, -- visible to all Scale employees
    created_by VARCHAR(255),

    -- Soft delete
    deleted_at TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_analyses_company_name ON analyses(company_name);
CREATE INDEX idx_analyses_sector ON analyses(company_sector);
CREATE INDEX idx_analyses_date ON analyses(analysis_date DESC);
CREATE INDEX idx_analyses_analyst ON analyses(analyst_email);
CREATE INDEX idx_analyses_deleted ON analyses(deleted_at) WHERE deleted_at IS NULL;
```

### Table: `tags`
```sql
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
    tag_category VARCHAR(50), -- sector, stage, issue, recommendation_type
    tag_value VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(analysis_id, tag_category, tag_value)
);

CREATE INDEX idx_tags_category_value ON tags(tag_category, tag_value);
```

### Table: `shares`
```sql
CREATE TABLE shares (
    id SERIAL PRIMARY KEY,
    analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
    shared_with_email VARCHAR(255), -- NULL = shared with all Scale
    shared_by_email VARCHAR(255),
    access_level VARCHAR(20) DEFAULT 'view', -- view, comment, edit
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_shares_analysis ON shares(analysis_id);
CREATE INDEX idx_shares_recipient ON shares(shared_with_email);
```

---

## API Endpoints

### 1. Store Analysis
```http
POST /api/library/store
Content-Type: application/json

{
  "analysis_job_id": "uuid",
  "company_name": "GGWP",
  "company_url": "https://www.ggwp.com",
  "company_sector": "Gaming Tech",
  "company_stage": "Series A",
  "analyst_email": "peter@scalevp.com",
  "report_markdown": "# GGWP Analysis...",
  "report_json": {...},
  "overall_score": 65,
  "dimension_scores": {...},
  "top_recommendations": [...],
  "tags": ["gaming", "b2b-saas", "early-stage"]
}

Response 200:
{
  "id": "uuid",
  "message": "Analysis stored successfully",
  "library_url": "/library/uuid"
}
```

### 2. List Analyses
```http
GET /api/library/list?
  sector=gaming&
  stage=series-a&
  analyst=peter@scalevp.com&
  date_from=2025-01-01&
  date_to=2025-12-31&
  sort=date&
  order=desc&
  limit=20&
  offset=0

Response 200:
{
  "total": 45,
  "analyses": [
    {
      "id": "uuid",
      "company_name": "GGWP",
      "company_sector": "Gaming Tech",
      "analysis_date": "2025-10-10",
      "overall_score": 65,
      "top_recommendation": "Clarify ICP definition",
      "analyst_email": "peter@scalevp.com",
      "tags": ["gaming", "b2b-saas"]
    },
    ...
  ]
}
```

### 3. Get Single Analysis
```http
GET /api/library/{analysis_id}

Response 200:
{
  "id": "uuid",
  "company_name": "GGWP",
  "company_url": "https://www.ggwp.com",
  "company_sector": "Gaming Tech",
  "analysis_date": "2025-10-10",
  "analyst_email": "peter@scalevp.com",
  "report_markdown": "# Full report...",
  "report_json": {...},
  "overall_score": 65,
  "dimension_scores": {...},
  "top_recommendations": [...],
  "critical_issues": [...],
  "tags": [...],
  "files": {
    "pdf": "/downloads/ggwp-analysis.pdf",
    "markdown": "/downloads/ggwp-analysis.md"
  }
}
```

### 4. Search Analyses
```http
GET /api/library/search?q=buyer+journey&filters={"sector":"gaming"}

Response 200:
{
  "total": 12,
  "results": [
    {
      "id": "uuid",
      "company_name": "GGWP",
      "relevance_score": 0.95,
      "matched_in": ["recommendations", "critical_issues"],
      "excerpt": "...buyer journey lacks clear path..."
    },
    ...
  ]
}
```

### 5. Compare Analyses
```http
GET /api/library/compare?ids=uuid1,uuid2,uuid3

Response 200:
{
  "comparison": {
    "companies": ["GGWP", "CompanyB", "CompanyC"],
    "dimension_scores": {
      "market_positioning": [45, 78, 62],
      "buyer_journey": [60, 85, 55],
      ...
    },
    "common_issues": ["Generic positioning", "Weak CTA"],
    "unique_strengths": {
      "GGWP": ["Strong accessibility"],
      "CompanyB": ["Clear ICP"],
      ...
    }
  }
}
```

---

## Frontend: Analysis Library Page

### Page: `/library`

#### Layout
```
┌─────────────────────────────────────────────────────┐
│  Scale VP Logo  |  MEARA Library  |  [+ New Analysis]│
├─────────────────────────────────────────────────────┤
│                                                      │
│  Search: [_____________________] 🔍                  │
│                                                      │
│  Filters:  [All Sectors ▼] [All Stages ▼] [2025 ▼] │
│                                                      │
├─────────────────────────────────────────────────────┤
│  45 Analyses                   Sort: [Date ▼]       │
├─────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────┐ │
│  │ GGWP                          Score: 65/100   │ │
│  │ Gaming Tech • Series A • Oct 10, 2025         │ │
│  │                                                │ │
│  │ 🔴 Critical Issue: Generic value prop         │ │
│  │ 🎯 Top Rec: Clarify ICP definition            │ │
│  │                                                │ │
│  │ [View] [Download] [Share] [Compare]           │ │
│  └───────────────────────────────────────────────┘ │
│                                                      │
│  ┌───────────────────────────────────────────────┐ │
│  │ CompanyB                      Score: 82/100   │ │
│  │ FinTech • Series B • Oct 8, 2025              │ │
│  │ ...                                            │ │
│  └───────────────────────────────────────────────┘ │
│                                                      │
│  [Load More]                                         │
└─────────────────────────────────────────────────────┘
```

### Page: `/library/{analysisId}`

Same as the results page we built in Phase 1, but with:
- Additional header showing: "From Library • Analyzed on Oct 10, 2025 by peter@scalevp.com"
- "Back to Library" button
- "Compare with..." dropdown to select other analyses

---

## Key Features

### 1. Auto-Save on Analysis Complete
When a MEARA analysis finishes:
1. Automatically save to library database
2. Extract metadata (scores, recommendations, issues)
3. Tag with sector/stage (manual or inferred)
4. Make visible to all Scale employees by default

### 2. Smart Search
- Full-text search across:
  - Company name
  - Recommendations
  - Critical issues
  - Evidence text
- Filter by:
  - Sector (gaming, fintech, healthcare, etc.)
  - Stage (seed, series-a, series-b, growth)
  - Date range
  - Analyst
  - Score range
  - Tags

### 3. Comparison View
- Select 2-5 analyses to compare side-by-side
- Show dimension scores as radar chart
- Highlight common issues vs. unique issues
- Compare recommendations
- Identify patterns across similar companies

### 4. Access Control (Simple)
- **Default**: All Scale employees can view all analyses
- **Private**: Analyst can mark analysis as private (only they can see)
- **Shared Link**: Generate shareable link with expiration (for external sharing)

### 5. Download Options
- From library, download any analysis as:
  - Markdown
  - PDF
  - JSON (raw data)

---

## Implementation Phases

### Phase 1: Basic Storage (1 week)
- Create database schema
- Implement `POST /api/library/store` endpoint
- Auto-save on analysis complete
- Simple list view showing company name + date

### Phase 2: Browse & Search (1 week)
- Implement `GET /api/library/list` with filters
- Build Library page UI with cards
- Add search functionality
- Add filtering by sector/stage/date

### Phase 3: View & Download (3 days)
- Link library cards to existing results page
- Add "From Library" context header
- Enable downloads from library

### Phase 4: Comparison (1 week)
- Implement `GET /api/library/compare`
- Build comparison UI
- Add radar charts for dimension scores
- Highlight common patterns

### Phase 5: Advanced Features (2 weeks)
- Tagging system
- Access control & sharing
- Comments on analyses
- Export to Google Slides for presentations

---

## Technical Considerations

### Database Choice
**Recommended**: PostgreSQL
- ✅ Supports JSONB for flexible schema
- ✅ Full-text search built-in
- ✅ Railway supports PostgreSQL easily
- ✅ Scalable for hundreds of analyses

**Alternative**: SQLite (for MVP)
- ✅ Simpler setup (file-based)
- ✅ Good for < 100 analyses
- ❌ Limited concurrency
- ❌ No full-text search

### Storage Strategy
- **Database**: Store metadata + markdown text
- **File system**: Store PDF/JSON files
- **Reference**: Database stores file paths

### Migration Path
**From current state (no database) to library:**
1. Keep existing file-based system working
2. Add database layer
3. Auto-save new analyses to both files + database
4. Gradually backfill old analyses (if needed)

---

## User Experience Flow

### Scenario: Partner browsing for similar analyses

1. **Navigate to Library** (`/library`)
   - See list of all analyses, sorted by date
   - Notice GGWP analysis from last week

2. **Filter by sector**
   - Select "Gaming Tech" sector
   - List narrows to 8 gaming companies

3. **Click on GGWP analysis**
   - Opens familiar results page
   - See full analysis with export options

4. **Click "Compare with..."**
   - Select CompanyB and CompanyC
   - View side-by-side comparison:
     - Dimension scores (radar chart)
     - Common issues: "All 3 have weak CTAs"
     - GGWP's unique strength: "Best accessibility"

5. **Share with investment committee**
   - Click "Share" button
   - Enter email addresses or generate link
   - Send link in email

---

## Success Metrics

### Adoption Metrics
- % of analyses saved to library (should be 100% auto-saved)
- Number of library views per week
- Number of comparisons performed per month

### Engagement Metrics
- Average time spent in library
- Number of searches performed
- % of analyses accessed more than once

### Business Impact
- Time saved finding past analyses
- Number of insights reused across companies
- Improved due diligence speed

---

## Security & Privacy

### Authentication
- Require Scale VP email authentication
- Use existing Scale Google Workspace for SSO

### Authorization
- Default: All Scale employees can view all analyses
- Private analyses: Only creator can view
- Shared links: Temporary access with expiration

### Data Protection
- Analyses contain sensitive company information
- Ensure Railway backend is secured
- Use HTTPS for all API calls
- Consider data retention policy (delete after X years?)

---

## Next Steps

1. **Decision**: Choose database (PostgreSQL recommended)
2. **Set up**: Add PostgreSQL to Railway
3. **Backend**: Implement storage API endpoints
4. **Frontend**: Build library UI
5. **Integration**: Auto-save on analysis complete
6. **Testing**: Backfill 3-5 example analyses
7. **Launch**: Roll out to Scale team

---

## Questions for Decision Maker (You)

1. **Priority**: Should we build this before or after the interactive dashboard?
2. **Access**: Default public (all Scale employees) or default private (opt-in sharing)?
3. **Database**: Approve PostgreSQL? (recommended)
4. **Backfill**: Should we manually add past analyses to library?
5. **External sharing**: Allow sharing analyses outside Scale (e.g., with portfolio CEOs)?
