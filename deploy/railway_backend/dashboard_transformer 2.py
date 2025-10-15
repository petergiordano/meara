"""
Dashboard Data Transformer Library
Converts MEARA orchestrator workflow state into dashboard-compatible JSON

Per Constitution Article I: Library-First Principle
This is a standalone library that transforms data structures
"""

import json
import re
from typing import Dict, List, Any, Optional
from datetime import datetime


def calculate_roi_score(impact: str, effort: str) -> float:
    """
    Calculate ROI score based on impact and effort
    Formula: (Impact weight - Effort cost) normalized to 0-10 scale
    """
    impact_weights = {
        "CRITICAL": 10,
        "HIGH": 7,
        "MEDIUM": 4,
        "LOW": 2,
    }

    effort_costs = {
        "HIGH": 8,
        "MEDIUM": 4,
        "LOW": 1,
    }

    raw = impact_weights.get(impact, 4) - effort_costs.get(effort, 4)
    # Normalize to 0-10 scale
    return max(0.0, min(10.0, (raw + 8) / 2))


def is_quick_win(impact: str, effort: str) -> bool:
    """Determine if a recommendation is a quick win (HIGH/CRITICAL impact + LOW effort)"""
    return impact in ["CRITICAL", "HIGH"] and effort == "LOW"


def extract_recommendations_from_json(recommendations_data: Dict) -> List[Dict]:
    """
    Extract recommendations from orchestrator JSON structure

    Input format (from orchestrator):
    {
        "recommendations": [
            {
                "title": "...",
                "rationale": "...",
                "implementation_steps": [...],
                ...
            }
        ]
    }

    Output format (for dashboard):
    [
        {
            "id": "rec-1",
            "title": "...",
            "impact": "HIGH",
            "effort": "LOW",
            "quick_win": true,
            ...
        }
    ]
    """
    recommendations = []

    if isinstance(recommendations_data, dict):
        recs_list = recommendations_data.get("recommendations", [])
    elif isinstance(recommendations_data, list):
        recs_list = recommendations_data
    else:
        return []

    for idx, rec in enumerate(recs_list, 1):
        # Infer impact/effort from rec data (or use defaults)
        # In a real scenario, the orchestrator should provide these
        impact = rec.get("impact", "MEDIUM")
        effort = rec.get("effort", "MEDIUM")

        recommendation = {
            "id": f"rec-{idx}",
            "title": rec.get("title", f"Recommendation {idx}"),
            "summary": rec.get("summary", rec.get("rationale", "")[:200]),
            "impact": impact,
            "effort": effort,
            "roi_score": calculate_roi_score(impact, effort),
            "quick_win": is_quick_win(impact, effort),
            "category": rec.get("category", rec.get("dimension", "General")),
            "why": rec.get("rationale", rec.get("why", "")),
            "what": rec.get("what", rec.get("action", "")),
            "how": rec.get("implementation_steps", rec.get("how", [])),
            "expected_outcome": rec.get("expected_outcome", ""),
            "supporting_evidence_ids": rec.get("evidence_ids", [])
        }

        recommendations.append(recommendation)

    return recommendations


def extract_dimensions_from_json(dimensions_data: Dict) -> Dict[str, Dict]:
    """
    Extract dimension analysis from orchestrator JSON

    Input format:
    {
        "dimensions": {
            "market_positioning": {
                "score": 65,
                "rating": "NEEDS_IMPROVEMENT",
                "strengths": [...],
                "opportunities": [...]
            }
        }
    }

    Output format: (same structure, enhanced with names)
    """
    dimensions = {}

    dimension_names = {
        "market_positioning": "Market Positioning & Messaging",
        "buyer_journey": "Buyer Journey Orchestration",
        "market_presence": "Market Presence & Visibility",
        "audience_clarity": "Audience Clarity & Segmentation",
        "digital_experience": "Digital Experience Effectiveness",
        "competitive_positioning": "Competitive Positioning & Defense",
        "brand_consistency": "Brand & Message Consistency",
        "analytics_measurement": "Analytics & Measurement Framework",
        "ai_authenticity": "AI-Specific Authenticity"
    }

    if isinstance(dimensions_data, dict):
        dims = dimensions_data.get("dimensions", dimensions_data)
    else:
        return {}

    for key, dim_data in dims.items():
        if not isinstance(dim_data, dict):
            continue

        dimensions[key] = {
            "name": dimension_names.get(key, key.replace("_", " ").title()),
            "score": dim_data.get("score", 50),
            "rating": dim_data.get("rating", "NEEDS_IMPROVEMENT"),
            "summary": dim_data.get("summary", ""),
            "strengths": dim_data.get("strengths", []),
            "opportunities": dim_data.get("opportunities", []),
            "evidence": dim_data.get("evidence", []),
            "sub_elements": dim_data.get("sub_elements", {})
        }

    return dimensions


def extract_root_causes_from_json(root_causes_data: Any) -> List[Dict]:
    """Extract root causes from orchestrator JSON"""
    root_causes = []

    if isinstance(root_causes_data, dict):
        causes_list = root_causes_data.get("root_causes", [])
    elif isinstance(root_causes_data, list):
        causes_list = root_causes_data
    else:
        return []

    for idx, cause in enumerate(causes_list, 1):
        root_cause = {
            "id": f"rc-{idx}",
            "title": cause.get("title", f"Root Cause {idx}"),
            "description": cause.get("description", ""),
            "affected_dimensions": cause.get("affected_dimensions", []),
            "supporting_evidence": cause.get("supporting_evidence", []),
            "business_implications": cause.get("business_implications", "")
        }
        root_causes.append(root_cause)

    return root_causes


def extract_critical_issues(recommendations: List[Dict], root_causes: List[Dict]) -> List[Dict]:
    """
    Extract critical issues from recommendations and root causes
    Critical issues are HIGH/CRITICAL impact items that need immediate attention
    """
    critical_issues = []

    # From recommendations: HIGH/CRITICAL impact
    for rec in recommendations:
        if rec["impact"] in ["CRITICAL", "HIGH"]:
            critical_issues.append({
                "title": rec["title"],
                "severity": rec["impact"],
                "business_impact": rec.get("why", ""),
                "affected_dimensions": [rec["category"]] if rec["category"] != "General" else []
            })

    # Limit to top 3-5 most critical
    return critical_issues[:5]


def organize_recommendations_by_priority(recommendations: List[Dict]) -> Dict[str, List[Dict]]:
    """
    Organize recommendations into priority matrix quadrants:
    - quick_wins: HIGH/CRITICAL impact + LOW effort
    - strategic_initiatives: HIGH/CRITICAL impact + MEDIUM/HIGH effort
    - minor_fixes: LOW/MEDIUM impact + LOW effort
    - deprioritized: LOW impact + HIGH effort
    """
    result = {
        "quick_wins": [],
        "strategic_initiatives": [],
        "minor_fixes": [],
        "deprioritized": []
    }

    for rec in recommendations:
        impact = rec["impact"]
        effort = rec["effort"]

        if impact in ["CRITICAL", "HIGH"] and effort == "LOW":
            result["quick_wins"].append(rec)
        elif impact in ["CRITICAL", "HIGH"]:
            result["strategic_initiatives"].append(rec)
        elif effort == "LOW":
            result["minor_fixes"].append(rec)
        else:
            result["deprioritized"].append(rec)

    return result


def transform_workflow_state_to_dashboard(
    company_name: str,
    company_url: str,
    analysis_date: str,
    analysis_job_id: str,
    workflow_state_dict: Dict
) -> Dict:
    """
    Main transformation function: converts orchestrator workflow state to dashboard JSON

    Args:
        company_name: Company name
        company_url: Company URL
        analysis_date: ISO date string
        analysis_job_id: Analysis job ID
        workflow_state_dict: Dict representation of WorkflowState from orchestrator

    Returns:
        Dashboard-compatible JSON matching dashboard_schema.json
    """

    # Extract data from workflow state
    recommendations = extract_recommendations_from_json(
        workflow_state_dict.get("recommendations", {})
    )

    dimensions = extract_dimensions_from_json(
        workflow_state_dict.get("dimension_evaluations", {})
    )

    root_causes = extract_root_causes_from_json(
        workflow_state_dict.get("root_causes", {})
    )

    # Get top 3-5 recommendations
    top_recommendations = sorted(
        recommendations,
        key=lambda r: r["roi_score"],
        reverse=True
    )[:5]

    # Extract critical issues
    critical_issues = extract_critical_issues(recommendations, root_causes)

    # Organize all recommendations by priority
    recommendations_by_priority = organize_recommendations_by_priority(recommendations)

    # Build dashboard data structure
    dashboard_data = {
        "company_info": {
            "name": company_name,
            "url": company_url
        },
        "analysis_metadata": {
            "analysis_date": analysis_date,
            "analysis_job_id": analysis_job_id
        },
        "executive_summary": {
            "top_recommendations": top_recommendations,
            "critical_issues": critical_issues,
            "overall_verdict": extract_overall_verdict(workflow_state_dict)
        },
        "dimensions": dimensions,
        "root_causes": root_causes,
        "recommendations": recommendations_by_priority
    }

    return dashboard_data


def extract_overall_verdict(workflow_state_dict: Dict) -> str:
    """
    Extract or synthesize an overall verdict from the workflow state
    This would typically be at the top of the final report
    """
    final_report = workflow_state_dict.get("final_report", "")

    # Try to extract executive summary section
    if "Executive Summary" in final_report:
        # Extract first paragraph after "Executive Summary"
        match = re.search(
            r'Executive Summary.*?\n\n(.*?)(?:\n\n|\Z)',
            final_report,
            re.DOTALL
        )
        if match:
            return match.group(1).strip()[:500]  # First 500 chars

    return "Analysis complete. See detailed findings in dimensions and recommendations."


def validate_dashboard_data(dashboard_data: Dict) -> bool:
    """
    Validate that dashboard data has all required fields
    Returns True if valid, raises ValueError if not
    """
    required_fields = [
        "company_info",
        "analysis_metadata",
        "executive_summary",
        "dimensions",
        "root_causes",
        "recommendations"
    ]

    for field in required_fields:
        if field not in dashboard_data:
            raise ValueError(f"Missing required field: {field}")

    # Validate company_info
    if "name" not in dashboard_data["company_info"]:
        raise ValueError("Missing company_info.name")
    if "url" not in dashboard_data["company_info"]:
        raise ValueError("Missing company_info.url")

    # Validate executive_summary
    if "top_recommendations" not in dashboard_data["executive_summary"]:
        raise ValueError("Missing executive_summary.top_recommendations")
    if "critical_issues" not in dashboard_data["executive_summary"]:
        raise ValueError("Missing executive_summary.critical_issues")

    return True


# CLI interface (Per Constitution Article II: CLI Interface Mandate)
if __name__ == "__main__":
    import sys
    import argparse

    parser = argparse.ArgumentParser(
        description="Transform MEARA workflow state to dashboard JSON"
    )
    parser.add_argument(
        "state_file",
        help="Path to workflow state JSON file"
    )
    parser.add_argument(
        "--output",
        "-o",
        help="Output file path (default: stdout)",
        default=None
    )
    parser.add_argument(
        "--validate",
        action="store_true",
        help="Validate output against schema"
    )

    args = parser.parse_args()

    # Load workflow state
    with open(args.state_file) as f:
        state_data = json.load(f)

    # Transform
    dashboard_data = transform_workflow_state_to_dashboard(
        company_name=state_data.get("company_name", "Unknown"),
        company_url=state_data.get("company_url", ""),
        analysis_date=datetime.now().isoformat()[:10],
        analysis_job_id=state_data.get("analysis_job_id", "unknown"),
        workflow_state_dict=state_data
    )

    # Validate if requested
    if args.validate:
        try:
            validate_dashboard_data(dashboard_data)
            print("✓ Validation passed", file=sys.stderr)
        except ValueError as e:
            print(f"✗ Validation failed: {e}", file=sys.stderr)
            sys.exit(1)

    # Output
    output_json = json.dumps(dashboard_data, indent=2)

    if args.output:
        with open(args.output, "w") as f:
            f.write(output_json)
        print(f"✓ Dashboard data written to {args.output}", file=sys.stderr)
    else:
        print(output_json)
