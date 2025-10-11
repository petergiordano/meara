# MEARA Agent Builder Architecture Diagram

## High-Level Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INPUT                              │
│  • Company Name                                                 │
│  • Company URL                                                  │
│  • Deep Research Brief (optional)                               │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    START NODE                                   │
│  Captures inputs into state variables                           │
└────────────────────────────┬────────────────────────────────────┘
                             ↓
                    ┌────────────────┐
                    │  IF/ELSE NODE  │
                    │  DRB provided? │
                    └────────┬───────┘
                             │
              ┌──────────────┴──────────────┐
              │ NO                          │ YES
              ↓                             ↓
    ┌──────────────────┐           ┌──────────────────┐
    │ RESEARCH AGENT   │           │                  │
    │ Creates DRB      │           │  (Skip to        │
    │ • Web searches   │           │   Evidence       │
    │ • Framework ref  │           │   Collector)     │
    └────────┬─────────┘           │                  │
             │                      │                  │
             └──────────────────────┴──────────────────┘
                                    ↓
                         ┌──────────────────────┐
                         │ EVIDENCE COLLECTOR   │
                         │ • 9 web searches     │
                         │ • Current validation │
                         │ • Citation gathering │
                         └──────────┬───────────┘
                                    ↓
                         ┌──────────────────────┐
                         │ DIMENSION EVALUATOR  │
                         │ • Assess 9 dims      │
                         │ • Rate performance   │
                         │ • Identify gaps      │
                         └──────────┬───────────┘
                                    ↓
                         ┌──────────────────────┐
                         │ FILE SEARCH NODE     │
                         │ Load Strategic       │
                         │ Framework from       │
                         │ vector store         │
                         └──────────┬───────────┘
                                    ↓
                         ┌──────────────────────┐
                         │ STRATEGIC VERIFIER   │
                         │ • Check 8 elements   │
                         │ • Set priorities     │
                         │ • Flag breakthrough  │
                         └──────────┬───────────┘
                                    ↓
                         ┌──────────────────────┐
                         │ ROOT CAUSE ANALYST   │
                         │ • Identify 3-5 causes│
                         │ • Map cascades       │
                         │ • Document impacts   │
                         └──────────┬───────────┘
                                    ↓
                         ┌──────────────────────┐
                         │ RECOMMENDATION       │
                         │ BUILDER              │
                         │ • 5-7 recommendations│
                         │ • Priority matrix    │
                         │ • Implementation plan│
                         └──────────┬───────────┘
                                    ↓
                         ┌──────────────────────┐
                         │ REPORT ASSEMBLER     │
                         │ • Format markdown    │
                         │ • All sections       │
                         │ • Professional output│
                         └──────────┬───────────┘
                                    ↓
                         ┌──────────────────────┐
                         │ GUARDRAIL:           │
                         │ Citation Validator   │
                         └──────────┬───────────┘
                                    ↓
                         ┌──────────────────────┐
                         │ GUARDRAIL:           │
                         │ PII Protection       │
                         └──────────┬───────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────┐
│                          END NODE                               │
│          Complete Marketing Effectiveness Analysis              │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow & State Management

```
┌──────────────────────────────────────────────────────────────────┐
│                      INPUT COLLECTION                            │
│                                                                  │
│  state.company_name = "Acme Corp"                                │
│  state.company_url = "https://acme.com"                          │
│  state.deep_research_brief = "..." or null                       │
└──────────────────────────┬───────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│              RESEARCH AGENT (if no DRB)                          │
│                                                                  │
│  INPUT: company_name, company_url                                │
│  TOOLS: Web Search, File Search (vector store)                   │
│  OUTPUT:                                                         │
│    state.deep_research_brief = {                                 │
│      sections: [...],                                            │
│      breakthrough_sparks: [...],                                 │
│      strategic_imperatives: [...]                                │
│    }                                                             │
└──────────────────────────┬───────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│                   EVIDENCE COLLECTOR                             │
│                                                                  │
│  INPUT: company_name, company_url, deep_research_brief           │
│  TOOLS: Web Search, File Search                                  │
│  OUTPUT:                                                         │
│    state.evidence_collection = {                                 │
│      market_positioning: [{quote, source, type}],                │
│      buyer_journey: [...],                                       │
│      ...9 dimensions total                                       │
│    }                                                             │
└──────────────────────────┬───────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│                  DIMENSION EVALUATOR                             │
│                                                                  │
│  INPUT: evidence_collection, deep_research_brief                 │
│  TOOLS: File Search (rubrics)                                    │
│  OUTPUT:                                                         │
│    state.dimension_evaluations = {                               │
│      market_positioning: {rating, strengths, opps, evidence},    │
│      buyer_journey: {...},                                       │
│      ...9 dimensions total                                       │
│    }                                                             │
└──────────────────────────┬───────────────────────────────────────┘
                           ↓
                    ┌──────────────┐
                    │  FILE SEARCH │
                    │  Strategic   │
                    │  Framework   │
                    └──────┬───────┘
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│                  STRATEGIC VERIFIER                              │
│                                                                  │
│  INPUT: dimension_evaluations, deep_research_brief               │
│  TOOLS: File Search                                              │
│  OUTPUT:                                                         │
│    state.strategic_verification = {                              │
│      verification_table: [                                       │
│        {element, exists, evidence, priority},                    │
│        ...8 elements total                                       │
│      ],                                                          │
│      high_priority_count: 3,                                     │
│      strategic_imperatives: [...]                                │
│    }                                                             │
└──────────────────────────┬───────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│                  ROOT CAUSE ANALYST                              │
│                                                                  │
│  INPUT: dimension_evaluations, strategic_verification, drb       │
│  TOOLS: File Search                                              │
│  OUTPUT:                                                         │
│    state.root_causes = [                                         │
│      {                                                           │
│        title: "Generic Value Proposition",                       │
│        description: "...",                                       │
│        affected_dimensions: [{dim, impact}],                     │
│        evidence: [...],                                          │
│        business_implications: "..."                              │
│      },                                                          │
│      ...3-5 total                                                │
│    ]                                                             │
└──────────────────────────┬───────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│                 RECOMMENDATION BUILDER                           │
│                                                                  │
│  INPUT: root_causes, strategic_verification                      │
│  TOOLS: File Search                                              │
│  OUTPUT:                                                         │
│    state.recommendations = {                                     │
│      recommendations: [                                          │
│        {title, addresses, improves, rationale, steps, ...},      │
│        ...5-7 total                                              │
│      ],                                                          │
│      priority_matrix: {                                          │
│        quick_wins: [...],                                        │
│        strategic: [...],                                         │
│        consider: [...],                                          │
│        avoid: [...]                                              │
│      }                                                           │
│    }                                                             │
└──────────────────────────┬───────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│                    REPORT ASSEMBLER                              │
│                                                                  │
│  INPUT: ALL state variables                                      │
│  TOOLS: File Search (formatting guidance)                        │
│  OUTPUT:                                                         │
│    state.final_report = """                                      │
│    # [Company] - Marketing Effectiveness Analysis                │
│    ## Executive Summary                                          │
│    ## Critical Issues                                            │
│    ## Initial Findings                                           │
│    ## Root Cause Analysis                                        │
│    ## Strategic Recommendations                                  │
│    ## Implementation Priority Matrix                             │
│    ## Phased Implementation Plan                                 │
│    """                                                           │
└──────────────────────────┬───────────────────────────────────────┘
                           ↓
                    ┌──────────────┐
                    │  GUARDRAILS  │
                    │  Validate &  │
                    │  Protect     │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │     END      │
                    │  final_report│
                    └──────────────┘
```

## Vector Store Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   VECTOR STORE                                  │
│                "MEARA_Framework_Knowledge"                      │
│                                                                 │
│  Chunking Strategy:                                             │
│  • max_chunk_size: 800 tokens                                   │
│  • overlap: 400 tokens                                          │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 1. MEARA_System_Instructions.md                           │ │
│  │    → MEARA persona & core capabilities                    │ │
│  │    → Evidence standards & web search authorization        │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ 2. Instruct_Executive_Summary.md                          │ │
│  │    → Summary generation guidelines                        │ │
│  │    → Key findings extraction                              │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ 3. Instruct_Marketing_Analysis.md                         │ │
│  │    → Output structure & formatting                        │ │
│  │    → DRB integration instructions                         │ │
│  │    → Citation requirements                                │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ 4. Marketing_Analysis_Methodology.md                      │ │
│  │    → 9-step process                                       │ │
│  │    → Evidence collection protocol                         │ │
│  │    → Report assembly workflow                             │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ 5. Marketing_Analysis_Rubrics.md                          │ │
│  │    → 9 dimension criteria                                 │ │
│  │    → Rating scales (Exceptional → Critical Gap)           │ │
│  │    → Cross-dimensional analysis guidelines                │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ 6. Strategic_Elements_Framework.md                        │ │
│  │    → 8 strategic elements                                 │ │
│  │    → Assessment questions                                 │ │
│  │    → Priority criteria                                    │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ 7. Scale_Brand_Design_and_Color_Palette_Guidelines.md     │ │
│  │    → Brand guidelines                                     │ │
│  │    → Design standards                                     │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ 8. Prompt_for_DeepR_B2B_SaaS_Marketing_Insights.md        │ │
│  │    → Deep research protocol                               │ │
│  │    → Breakthrough spark identification                    │ │
│  │    → Strategic imperatives guidance                       │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  All files located in: meara_doc_modules/                      │
│                                                                 │
│  Accessed by:                                                   │
│  • File Search nodes (explicit queries)                         │
│  • Agent tools (semantic search)                                │
└─────────────────────────────────────────────────────────────────┘
```

## Agent Tool Configuration

```
┌──────────────────────────────────────────────────────────────────┐
│                        AGENT TOOLS                               │
└──────────────────────────────────────────────────────────────────┘

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐
│  RESEARCH       │  │  EVIDENCE       │  │  DIMENSION          │
│  AGENT          │  │  COLLECTOR      │  │  EVALUATOR          │
├─────────────────┤  ├─────────────────┤  ├─────────────────────┤
│ • Web Search    │  │ • Web Search    │  │ • File Search       │
│   (unlimited)   │  │   (unlimited)   │  │   (Rubrics focus)   │
│ • File Search   │  │ • File Search   │  │                     │
│   (Deep R       │  │   (Methodology) │  │ Model: gpt-4o       │
│    Protocol)    │  │                 │  │ Temp: 0.3           │
│                 │  │ Model: gpt-4o   │  │                     │
│ Model: gpt-4o   │  │ Temp: 0.2       │  │                     │
│ Temp: 0.3       │  │                 │  │                     │
└─────────────────┘  └─────────────────┘  └─────────────────────┘

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐
│  STRATEGIC      │  │  ROOT CAUSE     │  │  RECOMMENDATION     │
│  VERIFIER       │  │  ANALYST        │  │  BUILDER            │
├─────────────────┤  ├─────────────────┤  ├─────────────────────┤
│ • File Search   │  │ • File Search   │  │ • File Search       │
│   (Framework    │  │   (All docs)    │  │   (Implementation   │
│    focus)       │  │                 │  │    guidance)        │
│                 │  │ Model: gpt-4o   │  │                     │
│ Model: gpt-4o   │  │ Temp: 0.3       │  │ Model: gpt-4o       │
│ Temp: 0.2       │  │                 │  │ Temp: 0.4           │
└─────────────────┘  └─────────────────┘  └─────────────────────┘

┌─────────────────┐
│  REPORT         │
│  ASSEMBLER      │
├─────────────────┤
│ • File Search   │
│   (Format       │
│    guidance)    │
│                 │
│ Model: gpt-4o   │
│ Temp: 0.3       │
└─────────────────┘
```

## Logic Flow with CEL Expressions

```
┌─────────────────────────────────────────────────────────────────┐
│                     LOGIC NODE 1: DRB CHECK                     │
│                                                                 │
│  Condition (CEL):                                               │
│    input.deep_research_brief != null &&                         │
│    input.deep_research_brief.length() > 100                     │
│                                                                 │
│  ┌──────────────┐                       ┌──────────────────┐   │
│  │ TRUE         │                       │ FALSE            │   │
│  │ → Has DRB    │                       │ → No DRB         │   │
│  │ → Skip to    │                       │ → Run Research   │   │
│  │   Evidence   │                       │   Agent first    │   │
│  │   Collector  │                       │                  │   │
│  └──────────────┘                       └──────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              LOGIC NODE 2: STRATEGIC PRIORITY CHECK             │
│                                                                 │
│  Condition (CEL):                                               │
│    state.strategic_verification.high_priority_count > 0         │
│                                                                 │
│  ┌──────────────┐                       ┌──────────────────┐   │
│  │ TRUE         │                       │ FALSE            │   │
│  │ → Has high   │                       │ → No high        │   │
│  │   priority   │                       │   priority       │   │
│  │   strategic  │                       │   strategic      │   │
│  │   elements   │                       │   elements       │   │
│  │              │                       │                  │   │
│  │ (Both paths continue to Root Cause)  │                  │   │
│  └──────────────┘                       └──────────────────┘   │
│                                                                 │
│  Note: Both outcomes proceed, but the flag is used             │
│        by Root Cause Analyst to elevate strategic              │
│        elements to standalone root causes                      │
└─────────────────────────────────────────────────────────────────┘
```

## Guardrail Configuration

```
┌─────────────────────────────────────────────────────────────────┐
│                 GUARDRAIL 1: CITATION VALIDATOR                 │
│                                                                 │
│  Type: Hallucination Detection                                  │
│  Threshold: 0.8                                                 │
│                                                                 │
│  Checks:                                                        │
│  • All quotes <25 words                                         │
│  • Format: 'Quote' [Source: URL, accessed DATE]                 │
│  • Minimum 20 citations in report                               │
│  • URLs are valid and accessible                                │
│                                                                 │
│  Action: WARN (flag issues, don't block)                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  GUARDRAIL 2: PII PROTECTION                    │
│                                                                 │
│  Type: PII Detection                                            │
│  Action: REDACT                                                 │
│                                                                 │
│  Patterns detected:                                             │
│  • Email addresses                                              │
│  • Phone numbers                                                │
│  • SSN/Tax IDs                                                  │
│  • Credit card numbers                                          │
│  • Personal names (in certain contexts)                         │
│                                                                 │
│  Action: REDACT (automatically remove before output)            │
└─────────────────────────────────────────────────────────────────┘
```

## Cost Breakdown by Node

```
┌──────────────────────────────────────────────────────────────────┐
│                    COST ANALYSIS PER RUN                         │
└──────────────────────────────────────────────────────────────────┘

Node                    Tokens (avg)    Cost        % of Total
────────────────────────────────────────────────────────────────
Research Agent          ~100,000        $1.50       23%
Evidence Collector      ~80,000         $1.20       19%
Dimension Evaluator     ~60,000         $0.90       14%
Strategic Verifier      ~30,000         $0.45       7%
Root Cause Analyst      ~40,000         $0.60       9%
Recommendation Builder  ~50,000         $0.75       12%
Report Assembler        ~70,000         $1.05       16%
────────────────────────────────────────────────────────────────
TOTAL                   ~430,000        $6.45       100%

Vector Store Storage:   ~5MB            $0.015/mo
File Search Queries:    Included in agent costs
────────────────────────────────────────────────────────────────

Optimization Opportunities:
• Use gpt-4o-mini for Report Assembler → Save ~$0.70
• Cache vector search results → Save ~15% tokens
• Reduce web searches if DRB comprehensive → Save ~$0.50
────────────────────────────────────────────────────────────────
Optimized Total:        ~$4.50/analysis (30% savings)
```

## Execution Timeline

```
Time →  0min   2min   4min   6min   8min   10min  12min
        │      │      │      │      │      │      │
        ▼      ▼      ▼      ▼      ▼      ▼      ▼

┌────┐
│    │ START & Input Collection (5s)
└─┬──┘
  │
  ├──┐ DRB Check (1s)
  │  │
  │  ├──┐ Research Agent (if no DRB: 3-4 min)
  │  │  │ OR Skip to Evidence
  │  └──┘
  │
  ├──┐ Evidence Collector (2-3 min, 9 web searches)
  │  └──┘
  │
  ├──┐ Dimension Evaluator (1-2 min)
  │  └──┘
  │
  ├──┐ Strategic Framework Load (5s)
  │  │
  │  ├──┐ Strategic Verifier (1 min)
  │  └──┘
  │
  ├──┐ Root Cause Analyst (1-2 min)
  │  └──┘
  │
  ├──┐ Recommendation Builder (1-2 min)
  │  └──┘
  │
  ├──┐ Report Assembler (1 min)
  │  └──┘
  │
  ├──┐ Citation Validator (10s)
  │  │
  │  ├──┐ PII Protection (5s)
  │  └──┘
  │
  ▼
┌────┐
│ END│ Output Final Report
└────┘

Total Time:
• With DRB: 8-10 minutes
• Without DRB: 10-14 minutes
```

---

**Legend:**
- `┌─┐` = Node
- `│` = Connection
- `→` = Data flow
- `└─┘` = End of process
