#!/usr/bin/env python3
"""
gtm_dashboard_transformer.py

Library-first transformer for GTM Investment Dashboard data.
Converts MEA_CONFIG.json into frontend-optimized format.

Article I Compliance: Standalone library with CLI interface.
Article VIII Compliance: No abstractions, direct data transformation.

Usage:
    # As library
    from gtm_dashboard_transformer import transform_mea_config
    transformed = transform_mea_config(mea_config_dict)

    # As CLI
    python3 gtm_dashboard_transformer.py --input mea_config.json --output transformed.json
"""

import json
import argparse
from typing import Dict, Any, List
from pathlib import Path


def transform_executive_thesis(executive_thesis: Dict[str, Any]) -> Dict[str, Any]:
    """
    Transform Executive Thesis section for frontend rendering.

    Args:
        executive_thesis: Raw Executive Thesis data from MEA_CONFIG

    Returns:
        Transformed data optimized for GtmScalabilityGauge, RadarChartModal,
        ArrStackedBar, StrategicOpportunityDonut, AcvWaterfallModal components
    """
    return {
        "gtmScore": {
            **executive_thesis["gtmScore"],
            # Add computed color based on value
            "currentColor": _get_threshold_color(
                executive_thesis["gtmScore"]["value"],
                executive_thesis["gtmScore"]["colorThresholds"]
            )
        },
        "gtmBreakdown": executive_thesis["gtmBreakdown"],
        "arrData": {
            **executive_thesis["arrData"],
            # Calculate composition percentages
            "compositionPercentages": [
                {
                    **segment,
                    "percentage": round(
                        (segment["value"] / executive_thesis["arrData"]["currentValue"]) * 100, 1
                    )
                }
                for segment in executive_thesis["arrData"]["composition"]
            ]
        },
        "strategicOpportunity": {
            **executive_thesis["strategicOpportunity"],
            "acvExpansion": {
                **executive_thesis["strategicOpportunity"]["acvExpansion"],
                # Calculate total increase for waterfall
                "totalIncrease": sum(
                    step["value"]
                    for step in executive_thesis["strategicOpportunity"]["acvExpansion"]["steps"]
                    if step["type"] == "increase"
                ),
                "totalDecrease": sum(
                    step["value"]
                    for step in executive_thesis["strategicOpportunity"]["acvExpansion"]["steps"]
                    if step["type"] == "decrease"
                )
            }
        }
    }


def transform_core_tension(core_tension: Dict[str, Any]) -> Dict[str, Any]:
    """
    Transform Core Tension section for frontend rendering.

    Args:
        core_tension: Raw Core Tension data from MEA_CONFIG

    Returns:
        Transformed data optimized for LeakyFunnel and InfluenceMap components
    """
    return {
        "asset": core_tension["asset"],
        "liability": {
            **core_tension["liability"],
            # Count missing tools for display
            "missingToolCount": len(core_tension["liability"]["missingTechStack"])
        },
        "influenceMap": {
            **core_tension["influenceMap"],
            # Calculate connection count for visualization
            "connectionCount": len(core_tension["influenceMap"]["connections"])
        }
    }


def transform_strategic_pivot(strategic_pivot: Dict[str, Any]) -> Dict[str, Any]:
    """
    Transform Strategic Pivot section for frontend rendering.

    Args:
        strategic_pivot: Raw Strategic Pivot data from MEA_CONFIG

    Returns:
        Transformed data optimized for CompetitiveMoatMatrix component
    """
    # Find the company's position (isSelf: true)
    company_competitor = next(
        (c for c in strategic_pivot["competitors"] if c.get("isSelf", False)),
        None
    )

    return {
        **strategic_pivot,
        "companyPosition": company_competitor,
        "competitorCount": len(strategic_pivot["competitors"]) - 1  # Exclude self
    }


def transform_gtm_evolution(gtm_evolution: Dict[str, Any]) -> Dict[str, Any]:
    """
    Transform GTM Evolution Roadmap section for frontend rendering.

    Args:
        gtm_evolution: Raw GTM Evolution data from MEA_CONFIG

    Returns:
        Transformed data optimized for GtmEvolutionRoadmap component
    """
    return {
        **gtm_evolution,
        "phaseCount": len(gtm_evolution["phases"]),
        # Calculate max elements for grid layout
        "maxElementsPerPhase": max(
            len(phase["elements"]) for phase in gtm_evolution["phases"]
        )
    }


def transform_action_plan(action_plan: Dict[str, Any]) -> Dict[str, Any]:
    """
    Transform Action Plan section for frontend rendering.

    Args:
        action_plan: Raw Action Plan data from MEA_CONFIG

    Returns:
        Transformed data optimized for GanttChart component
    """
    # Calculate total timeline span
    min_month = min(phase["startMonth"] for phase in action_plan["phases"])
    max_month = max(phase["endMonth"] for phase in action_plan["phases"])

    return {
        **action_plan,
        "timelineSpan": {
            "startMonth": min_month,
            "endMonth": max_month,
            "totalMonths": max_month - min_month + 1
        },
        # Flatten all milestones for easier rendering
        "allMilestones": [
            {
                **milestone,
                "phaseName": phase["name"],
                "phaseIndex": idx
            }
            for idx, phase in enumerate(action_plan["phases"])
            for milestone in phase["milestones"]
        ]
    }


def transform_risk_matrix(risk_matrix: Dict[str, Any]) -> Dict[str, Any]:
    """
    Transform Risk Matrix section for frontend rendering.

    Args:
        risk_matrix: Raw Risk Matrix data from MEA_CONFIG

    Returns:
        Transformed data optimized for RiskHeatmap component
    """
    # Categorize risks by severity (impact * likelihood)
    risks_with_severity = []
    for risk in risk_matrix["risks"]:
        severity = risk["impact"] * risk["likelihood"]
        category = "high" if severity >= 6 else "medium" if severity >= 4 else "low"
        risks_with_severity.append({
            **risk,
            "severity": severity,
            "severityCategory": category
        })

    return {
        **risk_matrix,
        "risks": risks_with_severity,
        "highRiskCount": sum(1 for r in risks_with_severity if r["severityCategory"] == "high"),
        "mediumRiskCount": sum(1 for r in risks_with_severity if r["severityCategory"] == "medium"),
        "lowRiskCount": sum(1 for r in risks_with_severity if r["severityCategory"] == "low")
    }


def transform_mea_config(mea_config: Dict[str, Any]) -> Dict[str, Any]:
    """
    Transform complete MEA_CONFIG for GTM Investment Dashboard.

    This is the main library entry point.

    Args:
        mea_config: Raw MEA_CONFIG dictionary from JSON

    Returns:
        Transformed data structure optimized for frontend components

    Example:
        >>> from gtm_dashboard_transformer import transform_mea_config
        >>> with open('mea_config.json') as f:
        ...     mea_config = json.load(f)
        >>> transformed = transform_mea_config(mea_config)
    """
    return {
        # Preserve metadata
        "companyId": mea_config["companyId"],
        "companyName": mea_config["companyName"],
        "analysisDate": mea_config["analysisDate"],
        "scaleVPBrand": mea_config["scaleVPBrand"],

        # Transform each section
        "executiveThesis": transform_executive_thesis(mea_config["executiveThesis"]),
        "coreTension": transform_core_tension(mea_config["coreTension"]),
        "strategicPivot": transform_strategic_pivot(mea_config["strategicPivot"]),
        "gtmEvolutionRoadmap": transform_gtm_evolution(mea_config["gtmEvolutionRoadmap"]),
        "actionPlan": transform_action_plan(mea_config["actionPlan"]),
        "riskMatrix": transform_risk_matrix(mea_config["riskMatrix"])
    }


def _get_threshold_color(value: float, thresholds: List[Dict[str, Any]]) -> str:
    """
    Helper: Get color for a value based on threshold stops.

    Args:
        value: Numeric value (e.g., GTM score)
        thresholds: List of {stop, color} dicts sorted by stop

    Returns:
        Hex color string
    """
    for threshold in sorted(thresholds, key=lambda t: t["stop"]):
        if value <= threshold["stop"]:
            return threshold["color"]
    # If value exceeds all thresholds, return last color
    return thresholds[-1]["color"]


# ============================================================================
# CLI Interface (Article I Compliance)
# ============================================================================

def main():
    """CLI entry point for standalone usage"""
    parser = argparse.ArgumentParser(
        description="Transform MEA_CONFIG.json for GTM Investment Dashboard"
    )
    parser.add_argument(
        "--input",
        "-i",
        required=True,
        type=Path,
        help="Path to input MEA_CONFIG.json file"
    )
    parser.add_argument(
        "--output",
        "-o",
        type=Path,
        help="Path to output transformed JSON file (default: stdout)"
    )
    parser.add_argument(
        "--pretty",
        action="store_true",
        help="Pretty-print JSON output with indentation"
    )

    args = parser.parse_args()

    # Load input
    try:
        with open(args.input) as f:
            mea_config = json.load(f)
    except FileNotFoundError:
        print(f"Error: Input file not found: {args.input}")
        return 1
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in input file: {e}")
        return 1

    # Transform
    try:
        transformed = transform_mea_config(mea_config)
    except Exception as e:
        print(f"Error during transformation: {e}")
        return 1

    # Output
    indent = 2 if args.pretty else None
    output_json = json.dumps(transformed, indent=indent)

    if args.output:
        with open(args.output, 'w') as f:
            f.write(output_json)
        print(f"Transformed data written to {args.output}")
    else:
        print(output_json)

    return 0


if __name__ == "__main__":
    exit(main())
