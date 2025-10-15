#!/usr/bin/env python3
"""
MEARA Agent Builder Workflow Deployment Script
Automatically creates the complete 14-node MEARA workflow
"""

import os
import json
from openai import OpenAI
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(Path(__file__).parent.parent / ".env")

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Vector Store ID from step 1
VECTOR_STORE_ID = "vs_68e95e3ceca08191a9bd1c3f4ba72977"

# Agent Instructions Templates
AGENT_INSTRUCTIONS = {
    "research_agent": """You are the Research Agent executing the Deep Research Protocol for MEARA.

**INPUTS:**
- Company: ${state.company_name}
- URL: ${state.company_url}

**YOUR TASK:**
Execute the "Prompt for DeepR B2B SaaS Marketing Insights" methodology to create a comprehensive Deep Research Brief.

**REQUIRED OUTPUT:**
A structured Deep Research Brief containing:
1. The Unseen Competitive Landscape & Market Dynamics
2. The True Voice of the Customer & Unarticulated Needs
3. Uncovering Latent "Hidden Gems" & Underleveraged Assets
4. Peripheral Vision & Cross-Industry Inspiration
5. AI Engine Perception & "Digital Body Language"

For each section, provide:
- Key Insight/Observation
- Supporting Evidence & Sources (with URLs and dates)
- "So What?" Implication for marketing strategy
- Breakthrough Sparks (if applicable)
- Relevant Strategic Elements

**OUTPUT FORMAT:**
Return as JSON:
{
  "deep_research_brief": "Full formatted markdown brief",
  "breakthrough_sparks": ["list of key breakthrough opportunities"],
  "strategic_imperatives": ["list of top strategic priorities"]
}

Use web search extensively. All evidence must include source URLs and access dates.""",

    "evidence_collector": """You are the Evidence Collector executing Step 2 of the Marketing Analysis Methodology.

**INPUTS:**
- Company: ${state.company_name}
- URL: ${state.company_url}
- Deep Research Brief: ${state.deep_research_brief}

**YOUR TASK:**
Conduct current, independent web research to gather specific evidence for all 9 marketing dimensions.

**REQUIRED WEB SEARCHES (minimum 9):**
1. "${state.company_name} marketing messaging"
2. "${state.company_name} competitive positioning 2025"
3. "${state.company_name} customer reviews"
4. "${state.company_name} G2 profile"
5. "${state.company_name} vs [top competitor]"
6. "${state.company_name} target audience"
7. "${state.company_name} buyer journey content"
8. "[Industry] marketing benchmarks 2025"
9. "AI Overviews for [Product Category]"

**EVIDENCE STANDARDS:**
- All quotes <25 words
- Format: 'Quote' [Source: URL, accessed YYYY-MM-DD]
- Tag source: DRB | Current_Web_Research | Company_Website
- Gather 3-5 evidence points per dimension

**OUTPUT FORMAT:**
Return as JSON organized by dimension:
{
  "market_positioning": [{"quote": "...", "source": "...", "source_type": "..."}],
  "buyer_journey": [...],
  "market_presence": [...],
  "audience_clarity": [...],
  "digital_experience": [...],
  "competitive_positioning": [...],
  "brand_consistency": [...],
  "analytics_framework": [...],
  "ai_authenticity": [...]
}""",

    "dimension_evaluator": """You are the Dimension Evaluator executing Step 3 of the Marketing Analysis Methodology.

**INPUTS:**
- Company: ${state.company_name}
- Evidence Collection: ${state.evidence_collection}
- Deep Research Brief: ${state.deep_research_brief}

**YOUR TASK:**
Evaluate the company across all 9 dimensions using the Marketing Analysis Rubrics.

**EVALUATION CRITERIA:**
For each dimension, assess:
1. Rating: Exceptional | Competent | Needs Improvement | Critical Gap
2. Strengths (with evidence)
3. Opportunities (with evidence)
4. Examples (cited with sources)

**9 DIMENSIONS:**
1. Market Positioning & Messaging
2. Buyer Journey Orchestration
3. Market Presence & Visibility
4. Audience Clarity & Segmentation
5. Digital Experience Effectiveness
6. Competitive Positioning & Defense
7. Brand & Message Consistency
8. Analytics & Measurement Framework
9. Evaluation of AI-Specific Authenticity

**LEVERAGE DRB:**
- Use DRB insights to inform ratings
- Flag connections to "Breakthrough Sparks"
- Note strategic implications

**OUTPUT FORMAT:**
Return as JSON:
{
  "dimension_evaluations": {
    "market_positioning": {
      "rating": "...",
      "strengths": ["..."],
      "opportunities": ["..."],
      "evidence": [...]
    },
    ...
  },
  "initial_findings_summary": "Brief summary of key findings",
  "drb_breakthrough_connections": ["List any DRB breakthrough sparks that align with findings"]
}""",

    "strategic_verifier": """You are the Strategic Verifier applying the Strategic_Elements_Framework.

**INPUTS:**
- Dimension Evaluations: ${state.dimension_evaluations}
- Deep Research Brief: ${state.deep_research_brief}

**YOUR TASK:**
Verify that critical strategic elements are identified and prioritized.

**8 STRATEGIC ELEMENTS TO VERIFY:**
1. Category Definition & Leadership Opportunity
2. Competitive Positioning & Defense Strategy
3. Underleveraged Past Successes
4. Urgency Creation & "Why Now" Messaging
5. Buying Committee Dynamics
6. Technology Positioning Authenticity
7. AI Engine Optimization & Recommendation Readiness
8. Website Tactical Excellence & UX for Discovery

**FOR EACH ELEMENT:**
- Opportunity Exists? (Yes/No)
- Supporting Evidence (cite DRB sections)
- Related Root Cause (if applicable)
- Priority Level (High/Medium/Low)

**PRIORITIZATION:**
- HIGH: Breakthrough potential, significant transformative impact
- MEDIUM: Clear opportunity, moderate impact
- LOW: Minor opportunity, limited impact

**OUTPUT FORMAT:**
Return as JSON:
{
  "strategic_verification_table": [
    {
      "element": "Category Definition & Leadership",
      "opportunity_exists": true,
      "evidence": "...",
      "drb_section": "...",
      "priority": "High"
    },
    ...
  ],
  "high_priority_count": 3,
  "strategic_imperatives": ["List top 3 strategic priorities"]
}""",

    "rootcause_analyst": """You are the Root Cause Analyst executing Step 4 of the Marketing Analysis Methodology.

**INPUTS:**
- Dimension Evaluations: ${state.dimension_evaluations}
- Strategic Verification: ${state.strategic_verification}
- Deep Research Brief: ${state.deep_research_brief}

**YOUR TASK:**
Identify 3-5 fundamental root causes that explain marketing effectiveness issues.

**FOR EACH ROOT CAUSE:**
1. Clear title
2. Concise description
3. List ALL affected dimensions with impact statements
4. 3-4 pieces of supporting evidence (with citations)
5. Business implications if unaddressed

**INTEGRATION:**
- Map strategic opportunities to root causes
- Elevate HIGH priority strategic elements to standalone root causes if needed
- Show cascading effects across dimensions

**OUTPUT FORMAT:**
Return as JSON:
{
  "root_causes": [
    {
      "title": "Generic Value Proposition",
      "description": "...",
      "affected_dimensions": [
        {"dimension": "Market Positioning", "impact": "CRITICAL - ..."},
        {"dimension": "Competitive Positioning", "impact": "HIGH - ..."}
      ],
      "evidence": [
        {"quote": "...", "source": "...", "source_type": "..."}
      ],
      "business_implications": "..."
    },
    ...
  ],
  "findings_relationship_map": "Description of how root causes interconnect"
}""",

    "recommendation_builder": """You are the Recommendation Builder executing Step 5 of the Marketing Analysis Methodology.

**INPUTS:**
- Root Causes: ${state.root_causes}
- Strategic Verification: ${state.strategic_verification}
- Company: ${state.company_name}

**YOUR TASK:**
Develop 5-7 strategic recommendations addressing root causes and high-priority strategic elements.

**FOR EACH RECOMMENDATION:**
1. Title (clear action statement)
2. Addresses Root Cause(s): [list]
3. Improves Dimensions: [list]
4. Rationale (business impact)
5. Implementation Steps (Team, Timeline)
6. Supporting Evidence (citations)
7. Expected Business Impact
8. Success Metrics

**PRIORITY MATRIX:**
Categorize each recommendation:
- High Impact, Low Effort (Quick Wins)
- High Impact, High Effort (Strategic)
- Low Impact, Low Effort (Consider)
- Low Impact, High Effort (Avoid)

**ENSURE COVERAGE:**
- All HIGH priority strategic elements addressed
- DRB "Breakthrough Sparks" incorporated
- Both 30-60 day quick wins AND 60-90+ day strategic initiatives

**OUTPUT FORMAT:**
Return as JSON:
{
  "recommendations": [
    {
      "title": "...",
      "addresses_root_causes": ["..."],
      "improves_dimensions": ["..."],
      "rationale": "...",
      "implementation_steps": [...],
      "evidence": [...],
      "quadrant": "High Impact, Low Effort"
    },
    ...
  ],
  "priority_matrix": {
    "quick_wins": [...],
    "strategic": [...],
    "consider": [...],
    "avoid": [...]
  }
}""",

    "report_assembler": """You are the Report Assembler executing Steps 7-8 of the Marketing Analysis Methodology.

**INPUTS:**
- Company: ${state.company_name}
- All prior analysis outputs: ${state}

**YOUR TASK:**
Assemble the complete Marketing Effectiveness Analysis report.

**REPORT STRUCTURE:**

# [Company Name] - Marketing Effectiveness Analysis for GTM Scalability

**Analysis Date:** [Current Date]
**Prepared By:** MEARA - Marketing Effectiveness Analysis Reporting Agent
**URLs Reviewed:** [List]

## Executive Summary
[3-5 critical findings with business impact, evidence, and quick wins]

## Critical Issues Summary
[Top 3 most urgent issues with impact, root cause, solutions]

## Findings Relationship Map
[Visual/textual map of root causes and manifestations]

## Initial Findings
[Brief summary across all 9 dimensions with evidence]

## Root Cause Analysis
[3-5 root causes with full details]

## Strategic Recommendations
[5-7 recommendations with implementation details]

## Implementation Priority Matrix
[2x2 matrix with categorized recommendations]

## Phased Implementation Plan
- Phase 1: Signal Collection & Scoring (Weeks 1-2)
- Phase 2: Positioning, ICP & CTA Optimization (Weeks 3-6)
- Phase 3: Buyer Journey Enhancement (Weeks 7-12)
- Phase 4: Visibility & Thought Leadership (Months 3-6)

**FORMATTING:**
- Use markdown with headers, bullets, tables
- All evidence properly cited
- Professional, strategic tone
- Actionable, specific recommendations

**OUTPUT:**
Return complete markdown report as single string."""
}

# CEL Expressions for Logic Nodes
CEL_EXPRESSIONS = {
    "drb_check": 'input.deep_research_brief != null && input.deep_research_brief.length() > 100',
    "strategic_priority_check": 'state.strategic_verification.high_priority_count > 0'
}

def create_workflow():
    """Create the complete MEARA workflow"""
    print("Creating MEARA Agent Builder Workflow...")
    print("=" * 60)

    if VECTOR_STORE_ID == "PASTE_YOUR_VECTOR_STORE_ID_HERE":
        print("ERROR: Please set VECTOR_STORE_ID in the script")
        print("Run step 1 first: python 1_setup_vector_store.py")
        return

    workflow = {
        "name": "MEARA_Marketing_Analysis",
        "description": "B2B SaaS Marketing Effectiveness Analysis with Deep Research",
        "nodes": []
    }

    # Node 1: START
    workflow["nodes"].append({
        "id": "start",
        "type": "start",
        "name": "Input Collection",
        "config": {
            "inputs": [
                {"name": "company_name", "type": "string", "required": True},
                {"name": "company_url", "type": "string", "required": True},
                {"name": "deep_research_brief", "type": "string", "required": False}
            ]
        }
    })

    # Node 2: Logic - DRB Check
    workflow["nodes"].append({
        "id": "drb_check",
        "type": "if_else",
        "name": "Deep Research Brief Check",
        "config": {
            "condition": CEL_EXPRESSIONS["drb_check"],
            "true_branch": "evidence_collector",
            "false_branch": "research_agent"
        }
    })

    # Node 3: Agent - Research Agent
    workflow["nodes"].append({
        "id": "research_agent",
        "type": "agent",
        "name": "Deep Research Agent",
        "config": {
            "instructions": AGENT_INSTRUCTIONS["research_agent"],
            "model": "gpt-4o",
            "temperature": 0.3,
            "tools": [
                {"type": "web_search"},
                {"type": "file_search", "vector_store_id": VECTOR_STORE_ID}
            ],
            "output_schema": {
                "type": "object",
                "properties": {
                    "deep_research_brief": {"type": "string"},
                    "breakthrough_sparks": {"type": "array", "items": {"type": "string"}},
                    "strategic_imperatives": {"type": "array", "items": {"type": "string"}}
                }
            }
        }
    })

    # Node 4: Agent - Evidence Collector
    workflow["nodes"].append({
        "id": "evidence_collector",
        "type": "agent",
        "name": "Evidence Collection Agent",
        "config": {
            "instructions": AGENT_INSTRUCTIONS["evidence_collector"],
            "model": "gpt-4o",
            "temperature": 0.2,
            "tools": [
                {"type": "web_search"},
                {"type": "file_search", "vector_store_id": VECTOR_STORE_ID}
            ]
        }
    })

    # Node 5: Agent - Dimension Evaluator
    workflow["nodes"].append({
        "id": "dimension_evaluator",
        "type": "agent",
        "name": "Dimension Evaluation Agent",
        "config": {
            "instructions": AGENT_INSTRUCTIONS["dimension_evaluator"],
            "model": "gpt-4o",
            "temperature": 0.3,
            "tools": [
                {"type": "file_search", "vector_store_id": VECTOR_STORE_ID}
            ]
        }
    })

    # Node 6: File Search - Strategic Framework
    workflow["nodes"].append({
        "id": "strategic_framework_search",
        "type": "file_search",
        "name": "Load Strategic Framework",
        "config": {
            "vector_store_id": VECTOR_STORE_ID,
            "query": "Strategic Elements Framework assessment criteria",
            "max_results": 20
        }
    })

    # Node 7: Agent - Strategic Verifier
    workflow["nodes"].append({
        "id": "strategic_verifier",
        "type": "agent",
        "name": "Strategic Elements Verifier",
        "config": {
            "instructions": AGENT_INSTRUCTIONS["strategic_verifier"],
            "model": "gpt-4o",
            "temperature": 0.2,
            "tools": [
                {"type": "file_search", "vector_store_id": VECTOR_STORE_ID}
            ]
        }
    })

    # Node 8: Logic - Strategic Priority Check
    workflow["nodes"].append({
        "id": "strategic_priority_check",
        "type": "if_else",
        "name": "High Priority Strategic Elements?",
        "config": {
            "condition": CEL_EXPRESSIONS["strategic_priority_check"],
            "true_branch": "rootcause_analyst",
            "false_branch": "rootcause_analyst"  # Always proceed
        }
    })

    # Node 9: Agent - Root Cause Analyst
    workflow["nodes"].append({
        "id": "rootcause_analyst",
        "type": "agent",
        "name": "Root Cause Analysis Agent",
        "config": {
            "instructions": AGENT_INSTRUCTIONS["rootcause_analyst"],
            "model": "gpt-4o",
            "temperature": 0.3,
            "tools": [
                {"type": "file_search", "vector_store_id": VECTOR_STORE_ID}
            ]
        }
    })

    # Node 10: Agent - Recommendation Builder
    workflow["nodes"].append({
        "id": "recommendation_builder",
        "type": "agent",
        "name": "Recommendations Agent",
        "config": {
            "instructions": AGENT_INSTRUCTIONS["recommendation_builder"],
            "model": "gpt-4o",
            "temperature": 0.4,
            "tools": [
                {"type": "file_search", "vector_store_id": VECTOR_STORE_ID}
            ]
        }
    })

    # Node 11: Agent - Report Assembler
    workflow["nodes"].append({
        "id": "report_assembler",
        "type": "agent",
        "name": "Report Assembly Agent",
        "config": {
            "instructions": AGENT_INSTRUCTIONS["report_assembler"],
            "model": "gpt-4o",
            "temperature": 0.3,
            "tools": [
                {"type": "file_search", "vector_store_id": VECTOR_STORE_ID}
            ]
        }
    })

    # Node 12: Guardrail - Citation Validator
    workflow["nodes"].append({
        "id": "citation_validator",
        "type": "guardrail",
        "name": "Citation Format Validator",
        "config": {
            "type": "hallucination_detection",
            "threshold": 0.8
        }
    })

    # Node 13: Guardrail - PII Protection
    workflow["nodes"].append({
        "id": "pii_protection",
        "type": "guardrail",
        "name": "PII Scrubber",
        "config": {
            "type": "pii_detection",
            "action": "redact"
        }
    })

    # Node 14: END
    workflow["nodes"].append({
        "id": "end",
        "type": "end",
        "name": "Analysis Complete",
        "config": {
            "output": "${state.final_report}"
        }
    })

    # Node Connections
    workflow["edges"] = [
        {"from": "start", "to": "drb_check"},
        {"from": "drb_check", "to": "research_agent", "condition": "false"},
        {"from": "drb_check", "to": "evidence_collector", "condition": "true"},
        {"from": "research_agent", "to": "evidence_collector"},
        {"from": "evidence_collector", "to": "dimension_evaluator"},
        {"from": "dimension_evaluator", "to": "strategic_framework_search"},
        {"from": "strategic_framework_search", "to": "strategic_verifier"},
        {"from": "strategic_verifier", "to": "strategic_priority_check"},
        {"from": "strategic_priority_check", "to": "rootcause_analyst"},
        {"from": "rootcause_analyst", "to": "recommendation_builder"},
        {"from": "recommendation_builder", "to": "report_assembler"},
        {"from": "report_assembler", "to": "citation_validator"},
        {"from": "citation_validator", "to": "pii_protection"},
        {"from": "pii_protection", "to": "end"}
    ]

    return workflow

def deploy_workflow(workflow):
    """Deploy workflow to OpenAI Agent Builder"""
    print("\nDeploying workflow to Agent Builder...")

    try:
        # Note: This is pseudocode - actual Agent Builder API may differ
        # Check OpenAI docs for exact endpoint
        response = client.beta.workflows.create(
            name=workflow["name"],
            description=workflow["description"],
            nodes=workflow["nodes"],
            edges=workflow["edges"]
        )

        print(f"✓ Workflow deployed successfully!")
        print(f"  Workflow ID: {response.id}")
        print(f"  Name: {response.name}")
        print(f"  Nodes: {len(workflow['nodes'])}")
        print(f"  Edges: {len(workflow['edges'])}")

        return response

    except Exception as e:
        print(f"✗ Deployment error: {e}")
        print("\nSaving workflow configuration to file for manual upload...")

        config_file = "meara_workflow_config.json"
        with open(config_file, "w") as f:
            json.dump(workflow, f, indent=2)

        print(f"✓ Configuration saved to: {config_file}")
        print("\nYou can manually import this configuration in Agent Builder UI")

        return None

def main():
    print("=" * 60)
    print("MEARA Agent Builder Deployment")
    print("=" * 60)

    # Create workflow configuration
    workflow = create_workflow()

    if workflow:
        print(f"\n✓ Workflow configuration created")
        print(f"  Total nodes: {len(workflow['nodes'])}")
        print(f"  Total connections: {len(workflow['edges'])}")

        # Deploy to Agent Builder
        result = deploy_workflow(workflow)

        if result:
            print("\n" + "=" * 60)
            print("Deployment Complete!")
            print(f"Open Agent Builder to view workflow: {result.id}")
            print("=" * 60)
        else:
            print("\n" + "=" * 60)
            print("Manual import required - see meara_workflow_config.json")
            print("=" * 60)

if __name__ == "__main__":
    main()
