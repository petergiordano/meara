# Product Requirements Document: Fast-Track MEARA

**Product**: MEARA Fast-Track Mode
**Version**: 1.0
**Created**: 2025-10-13
**Owner**: Scale Venture Partners
**Status**: Draft for Review

---

## Executive Summary

Fast-Track MEARA is a streamlined version of the Marketing Effectiveness Analysis that delivers a lightweight report in 2-3 minutes instead of 10-12 minutes, at 1/3 the cost, without requiring DeepStack analysis or Deep Research Brief generation. This mode is ideal for quick assessments, pre-screening, or situations where speed and cost matter more than depth.

### At a Glance

| Feature | Standard MEARA | Fast-Track MEARA |
|---------|---------------|------------------|
| **Time** | 10-12 minutes | 2-3 minutes |
| **Cost** | ~$6.45 | ~$2.00 |
| **Input Required** | Company URL + optional DRB | Company URL only |
| **Analysis Depth** | 9 dimensions, deep evidence, strategic insights | 6 core dimensions, surface-level insights |
| **DeepStack Analysis** | ✅ Required (2-3 min) | ❌ Skipped |
| **Deep Research Brief** | ✅ Auto-generated or uploaded | ❌ Skipped |
| **Ground Truth Report** | ✅ Generated | ❌ Skipped |
| **Evidence Depth** | Web research + DRB insights | Public website only |
| **Use Cases** | Due diligence, strategic planning, portfolio reviews | Quick screening, initial assessment, budget-constrained |

---

## Problem Statement

### Current Pain Points

**Scenario 1: Quick Screening**
> "I want to quickly assess 10 companies in a new sector to identify which 2-3 deserve deep analysis. Spending $65 and 2 hours for all 10 is too much."

**Scenario 2: Budget Constraints**
> "Our team wants to analyze all 30 portfolio companies quarterly, but $200+ in API costs per quarter per company is prohibitive."

**Scenario 3: Pre-Due Diligence**
> "Before spending 10+ minutes on a full MEARA, I want a 2-minute sanity check: Is this company's marketing even worth analyzing deeply?"

### User Needs

1. **Speed**: Get insights in < 3 minutes for rapid assessment
2. **Cost**: Lower cost per analysis (< $2.50) for volume use cases
3. **Simplicity**: No need to upload documents or wait for pre-processing
4. **Actionability**: Still get clear recommendations, just less evidence backing them

---

## Solution: Fast-Track MEARA

### Core Concept

Fast-Track MEARA analyzes a company's public website and generates a concise marketing effectiveness report **WITHOUT**:
- Running DeepStack Collector (saves 2-3 minutes, $0.50)
- Generating Deep Research Brief (saves 4-5 minutes, $3.00)
- Generating Ground Truth Report (saves 1-2 minutes, $0.50)

**What it DOES**:
- Fetches company website directly
- Performs lightweight scraping (meta tags, visible content, key pages)
- Runs 6 core marketing dimension analysis (vs. 9 full dimensions)
- Generates actionable recommendations with surface-level evidence
- Produces 5-8 page report (vs. 15-30 pages)

---

## Use Cases

### 1. Portfolio Quarterly Health Check
**Scenario**: Scale partner wants to check marketing health of all 25 portfolio companies

**Standard MEARA**:
- Time: 25 × 10 min = 4 hours
- Cost: 25 × $6.45 = $161.25

**Fast-Track MEARA**:
- Time: 25 × 2 min = 50 minutes
- Cost: 25 × $2.00 = $50.00
- **Savings**: 3+ hours, $111

### 2. New Sector Exploration
**Scenario**: Analyst evaluating 15 companies in healthcare tech to identify top 3 for deep dive

**Workflow**:
1. Run Fast-Track MEARA on all 15 ($30, 30 minutes)
2. Identify top 3 based on scores
3. Run Standard MEARA on top 3 only ($19, 30 minutes)
4. **Total**: $49 and 1 hour vs. $97 and 2.5 hours for all 15 standard

### 3. Pre-Investment Quick Screen
**Scenario**: Evaluating whether a company's marketing is mature enough to warrant further due diligence

**Workflow**:
1. Run Fast-Track MEARA (2 minutes, $2)
2. If score > 60 → proceed with full due diligence
3. If score < 60 → pass or revisit later
4. **Value**: Avoid wasting time on companies with immature GTM

### 4. Competitive Landscape Mapping
**Scenario**: Understand marketing maturity across 20 competitors in a space

**Fast-Track Advantage**:
- Quick comparison of 20 companies
- Identify best practices vs. common weaknesses
- Map competitive positioning landscape
- Cost: $40 (vs. $129 for standard)

---

## Functional Requirements

### FR-1: User Interface

#### New Option on Home Page
```
┌───────────────────────────────────────────┐
│  Choose Analysis Type:                    │
│  ○ Standard MEARA (Recommended)           │
│    • Comprehensive 9-dimension analysis   │
│    • Deep research + evidence             │
│    • Time: ~10 minutes | Cost: ~$6.45     │
│                                            │
│  ○ Fast-Track MEARA                       │
│    • Quick 6-dimension assessment         │
│    • Surface-level insights               │
│    • Time: ~2 minutes | Cost: ~$2.00      │
│                                            │
│  [Continue]                                │
└───────────────────────────────────────────┘
```

#### Fields Required (Fast-Track Mode)
- Company Name (text input)
- Company URL (URL input)
- [Optional] Company Sector (dropdown)
- **No file uploads needed**

### FR-2: Backend Workflow

#### Fast-Track Analysis Pipeline
```
User submits URL
    ↓
1. Lightweight Website Fetch (30s)
   - Fetch homepage HTML
   - Extract: title, meta description, H1/H2
   - Fetch /about, /product, /pricing pages (if exist)
   - Extract visible text content
    ↓
2. Quick Marketing Assessment (60s)
   - Analyze 6 core dimensions:
     1. Message Clarity
     2. Value Proposition
     3. Call-to-Action Effectiveness
     4. Social Proof & Trust Signals
     5. Website UX Fundamentals
     6. Content Quality
   - Use GPT-4o-mini (faster, cheaper than GPT-4o)
    ↓
3. Generate Concise Report (30s)
   - Executive summary (1 paragraph)
   - Top 3 recommendations
   - 6 dimension scores + brief commentary
   - 2-3 quick wins
   - Format: 5-8 page markdown
    ↓
Return report to user
```

### FR-3: Report Structure (Fast-Track)

#### Fast-Track Report Sections
1. **Executive Summary** (1 paragraph)
   - Overall assessment
   - Top priority issue
   - Recommended first action

2. **Quick Stats**
   - Overall Score: X/100
   - Strengths: (2-3 bullet points)
   - Opportunities: (2-3 bullet points)

3. **Top 3 Recommendations**
   - What to do
   - Why it matters
   - Quick implementation tip

4. **6 Core Dimensions** (vs. 9 in Standard)
   - Message Clarity (Score + 2-3 sentences)
   - Value Proposition (Score + 2-3 sentences)
   - Call-to-Action Effectiveness (Score + 2-3 sentences)
   - Social Proof & Trust Signals (Score + 2-3 sentences)
   - Website UX Fundamentals (Score + 2-3 sentences)
   - Content Quality (Score + 2-3 sentences)

5. **Next Steps**
   - Upgrade to Standard MEARA for deep insights? (CTA)

#### What's EXCLUDED from Fast-Track
- ❌ Root cause analysis
- ❌ Strategic framework verification
- ❌ Detailed evidence with citations
- ❌ Competitive positioning deep-dive
- ❌ Buyer journey orchestration analysis
- ❌ Analytics & measurement framework review
- ❌ AI authenticity evaluation

### FR-4: Cost & Performance Targets

| Metric | Target |
|--------|--------|
| Total time | < 3 minutes (90th percentile) |
| API cost | < $2.50 per analysis |
| Success rate | > 95% |
| Report length | 5-8 pages |
| User satisfaction | > 70% would use again |

---

## Non-Functional Requirements

### NFR-1: Accuracy Trade-offs
- **Acceptable**: 80-85% accuracy vs. Standard MEARA
- **Reasoning**: Faster insights with some precision loss is acceptable for screening use cases

### NFR-2: Failure Handling
- If website fetch fails → Show clear error with suggestion to try Standard MEARA
- If GPT API fails → Retry once, then fail gracefully
- Timeout: 5 minutes max (vs. 15 minutes for Standard)

### NFR-3: Quality Indicators
Display notice to user:
> "Fast-Track Analysis provides surface-level insights based on your website. For comprehensive strategic recommendations with deep research, upgrade to Standard MEARA."

---

## Technical Implementation

### Backend API Endpoint

```http
POST /api/analyze/fast-track
Content-Type: application/json

{
  "company_name": "GGWP",
  "company_url": "https://www.ggwp.com",
  "company_sector": "Gaming Tech"  // optional
}

Response 200:
{
  "analysis_job_id": "uuid",
  "mode": "fast-track",
  "status": "queued",
  "estimated_time_minutes": 2,
  "estimated_cost": 2.00
}
```

### Fast-Track Workflow (Python)

```python
async def run_fast_track_meara(company_name: str, company_url: str):
    """
    Fast-Track MEARA: 2-3 minute lightweight analysis
    """
    # Step 1: Lightweight website fetch (30s)
    website_data = await fetch_website_lightweight(company_url)
    # Fetches: homepage, /about, /product, /pricing
    # Extracts: meta tags, H1/H2, visible text, CTAs

    # Step 2: Quick dimension analysis (60s)
    analysis = await analyze_six_dimensions_fast(
        company_name=company_name,
        website_data=website_data,
        model="gpt-4o-mini"  # Faster & cheaper
    )

    # Step 3: Generate concise report (30s)
    report = await generate_fast_track_report(
        company_name=company_name,
        analysis=analysis,
        model="gpt-4o-mini"
    )

    return report
```

### Cost Breakdown

| Component | Standard MEARA | Fast-Track MEARA |
|-----------|---------------|------------------|
| DeepStack | $0.50 | $0 (skipped) |
| Website Fetch | Included in DeepStack | $0.10 (lightweight) |
| GPT-4o (DRB) | $2.50 | $0 (skipped) |
| GPT-4o (Ground Truth) | $1.00 | $0 (skipped) |
| GPT-4o (9 dimensions) | $2.00 | $0 (skipped) |
| GPT-4o-mini (6 dimensions) | - | $1.20 |
| GPT-4o-mini (Report) | - | $0.50 |
| **Total** | **~$6.45** | **~$1.80** |

---

## User Experience

### Workflow: Fast-Track Mode

1. **User lands on home page**
   - Sees two options: Standard vs. Fast-Track
   - Tooltip explains difference
   - User selects "Fast-Track MEARA"

2. **User enters company info**
   - Company name: "GGWP"
   - Company URL: "https://www.ggwp.com"
   - [Optional] Sector: "Gaming Tech"
   - Clicks "Analyze"

3. **Progress tracker** (2-3 minutes)
   - Stage 1: Fetching website (30s)
   - Stage 2: Analyzing dimensions (60s)
   - Stage 3: Generating report (30s)

4. **Results page**
   - Display Fast-Track report
   - Show badge: "Fast-Track Analysis"
   - Export options: Markdown, PDF
   - **CTA**: "Want deeper insights? Upgrade to Standard MEARA"

5. **Upgrade option**
   - If user clicks "Upgrade"
   - Pre-fill company name/URL
   - Run Standard MEARA (incremental $4.65)
   - Merge insights from both reports

---

## Success Metrics

### Adoption Metrics
- % of analyses that choose Fast-Track vs. Standard
- Target: 30-40% of analyses use Fast-Track within 3 months

### Performance Metrics
- Average completion time
- Target: < 2.5 minutes (p90)
- API cost per analysis
- Target: < $2.00 average

### Quality Metrics
- User satisfaction score
- Target: > 3.5/5
- % of Fast-Track users who upgrade to Standard
- Target: 15-20%

### Business Impact
- Total analyses per month (should increase with lower barrier)
- Cost savings for volume use cases
- Time saved for screening workflows

---

## Comparison: Standard vs. Fast-Track

### When to Use Standard MEARA
- ✅ Due diligence for investment decision
- ✅ Strategic planning for portfolio company
- ✅ Board presentation prep
- ✅ Comprehensive GTM assessment
- ✅ Unlimited budget & time

### When to Use Fast-Track MEARA
- ✅ Screening 10+ companies in a sector
- ✅ Quarterly health checks across portfolio
- ✅ Pre-due diligence sanity check
- ✅ Competitive landscape mapping
- ✅ Budget or time constrained
- ✅ "Good enough" insights acceptable

---

## Risks & Mitigations

### Risk 1: Lower Quality Perception
**Risk**: Users perceive Fast-Track as "cheap" or "unreliable"
**Mitigation**:
- Clearly set expectations ("surface-level insights")
- Show comparison chart (Standard vs. Fast-Track)
- Provide upgrade path if user wants more depth

### Risk 2: Cannibalization of Standard MEARA
**Risk**: Users default to Fast-Track even when Standard is more appropriate
**Mitigation**:
- Make Standard the default/recommended option
- Show use case examples for each mode
- Price Fast-Track to encourage volume (not replace Standard)

### Risk 3: Website Fetch Failures
**Risk**: Some websites block scraping or have complex JavaScript
**Mitigation**:
- Use headless browser (Playwright) for JavaScript-heavy sites
- Graceful fallback to Standard MEARA if fetch fails
- Clear error messages guiding user

---

## Implementation Phases

### Phase 1: MVP (1 week)
- Add "Fast-Track" mode toggle to UI
- Implement lightweight website fetch
- Build 6-dimension analysis with GPT-4o-mini
- Generate basic text report
- Test with 5 example companies

### Phase 2: Polish (3 days)
- Improve report formatting
- Add progress tracker
- Implement markdown/PDF export
- Add upgrade CTA to Standard

### Phase 3: Optimization (1 week)
- Optimize API costs
- Reduce latency
- Add caching for common domains
- A/B test messaging

---

## Open Questions

1. **Pricing**: Should Fast-Track be $1.80 (cost) or $2.50 (slight margin)?
2. **Upgrade Flow**: Allow upgrade mid-analysis or only after Fast-Track completes?
3. **Library Storage**: Save Fast-Track analyses to library? (May clutter with lower-quality data)
4. **Dimension Selection**: 6 dimensions correct, or should it be 7-8?
5. **Model Choice**: GPT-4o-mini sufficient or need GPT-4o for accuracy?

---

## Appendix: Proposed 6 Core Dimensions

### Dimensions INCLUDED in Fast-Track:
1. **Message Clarity** (Was: Market Positioning & Messaging)
   - Is it clear what the company does?
   - Is the value proposition understandable?

2. **Value Proposition** (Extracted from Market Positioning)
   - What makes this company different?
   - Why should a customer care?

3. **Call-to-Action Effectiveness** (Extracted from Buyer Journey)
   - Are CTAs clear and compelling?
   - Is the next step obvious?

4. **Social Proof & Trust Signals** (Was: Brand Consistency)
   - Customer logos, testimonials, reviews
   - Trust badges, security, credibility

5. **Website UX Fundamentals** (Was: Digital Experience)
   - Is the website easy to navigate?
   - Does it work on mobile?

6. **Content Quality** (New, simplified dimension)
   - Is content clear, engaging, professional?
   - Are key pages (About, Product, Pricing) present?

### Dimensions EXCLUDED from Fast-Track:
7. ~~Market Presence & Visibility~~ (Requires SEO research)
8. ~~Audience Clarity & Segmentation~~ (Requires deep ICP analysis)
9. ~~Analytics & Measurement Framework~~ (Requires technical audit)

These excluded dimensions require data sources (SEO tools, competitive intel, technical analysis) that Fast-Track does not collect to maintain speed and cost targets.

---

## Next Steps

1. **Review & Approve**: Get your feedback on this PRD
2. **Prioritize**: Decide when to build (after PDF export? After library?)
3. **Prototype**: Build MVP with 2-3 test companies
4. **Validate**: Test with Scale team members
5. **Launch**: Roll out Fast-Track mode as beta feature

---

**Document Status**: DRAFT - Awaiting Review
**Next Review Date**: TBD
**Approver**: Peter Giordano (Scale VP)
