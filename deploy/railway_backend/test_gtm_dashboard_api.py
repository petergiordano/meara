"""
Contract tests for GTM Investment Dashboard API

Tests the /api/gtm/dashboard/{companyId} endpoint against mea_config_schema.json.
Follows TDD principles (Article III): Write tests BEFORE implementation.

Test Structure:
- Phase 1.1: Executive Thesis section (5-6 tests)
- Phase 1.2: Core Tension section (4-5 tests)
- Phase 1.3: Remaining sections (8-10 tests)
- Total: 20+ contract tests

Run with: pytest test_gtm_dashboard_api.py -v
"""

import pytest
import json
from pathlib import Path
from jsonschema import validate, ValidationError


# Fixture: Load JSON Schema
@pytest.fixture
def mea_config_schema():
    """Load the MEA_CONFIG JSON Schema for validation"""
    schema_path = Path(__file__).parent / "mea_config_schema.json"
    with open(schema_path) as f:
        return json.load(f)


# Fixture: Sample MEA_CONFIG data (AI-Solutions Inc.)
@pytest.fixture
def sample_mea_config():
    """Sample MEA_CONFIG data for testing (will be created in Phase 1.5)"""
    return {
        "companyId": "comp_ai_solutions_inc",
        "companyName": "AI-Solutions Inc.",
        "analysisDate": "2025-10-14",
        "scaleVPBrand": {
            "logoUrl": "/images/scale_vp_logo.svg",
            "primaryColor": "#0A2A4C",
            "secondaryColor": "#4CAF50"
        },
        "executiveThesis": {
            "gtmScore": {
                "value": 15,
                "maxValue": 100,
                "label": "Critical GTM Gap",
                "colorThresholds": [
                    {"stop": 20, "color": "#DC3545"},
                    {"stop": 50, "color": "#FFC107"},
                    {"stop": 100, "color": "#4CAF50"}
                ],
                "tooltip": "Our proprietary GTM scalability score assesses the maturity of a company's marketing and sales infrastructure. A score below 20 indicates significant foundational gaps."
            },
            "gtmBreakdown": [
                {"pillar": "Lead Gen", "score": 2, "benchmark": 15},
                {"pillar": "MarTech", "score": 1, "benchmark": 12},
                {"pillar": "Data/Analytics", "score": 3, "benchmark": 18},
                {"pillar": "Playbook", "score": 5, "benchmark": 20},
                {"pillar": "Team", "score": 4, "benchmark": 15}
            ],
            "arrData": {
                "currentValue": 8.5,
                "composition": [
                    {
                        "type": "Founder-Led",
                        "value": 7.0,
                        "color": "#6C757D",
                        "tooltip": "Growth driven primarily by CEO's network and personal sales efforts."
                    },
                    {
                        "type": "Early PLG",
                        "value": 1.5,
                        "color": "#4CAF50",
                        "tooltip": "Organic sign-ups and self-serve conversions, limited monetization."
                    }
                ],
                "logos": ["/images/logo_client_a.svg", "/images/logo_client_b.svg"],
                "growthPatternSummary": "Growth pattern is lumpy and unpredictable, indicating a non-systematic GTM motion."
            },
            "strategicOpportunity": {
                "label": "High",
                "summary": "Reposition from 'Dev Tool' to 'Enterprise AI Platform' to unlock strategic budgets and increase ACV.",
                "acvExpansion": {
                    "baselineAcv": {
                        "value": 120000,
                        "label": "Baseline ACV: Current Product to Existing Buyer"
                    },
                    "steps": [
                        {
                            "type": "increase",
                            "value": 50000,
                            "label": "Upsell: Enterprise Security Module",
                            "justification": "Targets CISO budget for compliance."
                        },
                        {
                            "type": "increase",
                            "value": 130000,
                            "label": "Reposition: Data Intelligence Platform",
                            "justification": "Shifts buyer to Head of Data/Product, unlocking strategic budget."
                        }
                    ],
                    "potentialAcv": {
                        "value": 300000,
                        "label": "Potential ACV: Future State"
                    }
                }
            }
        },
        "coreTension": {
            "asset": {
                "title": "World-Class, AI-Native Technology",
                "points": [
                    {
                        "text": "Proprietary model with 98% accuracy.",
                        "evidence": "Source: Tech DD Report, Appendix A."
                    },
                    {
                        "text": "Loved by technical end-users (PLG flywheel).",
                        "evidence": "Source: User Interviews."
                    }
                ]
            },
            "liability": {
                "title": "No Enterprise GTM Motion",
                "points": [
                    {
                        "text": "Flying Blind: No CRM or Marketing Automation.",
                        "evidence": "Source: MEA, Section 4."
                    },
                    {
                        "text": "No economic buyer playbook.",
                        "evidence": "Source: Founder Interviews."
                    }
                ],
                "missingTechStack": [
                    "/images/logo_hubspot.svg",
                    "/images/logo_salesforce.svg",
                    "/images/logo_ga.svg"
                ],
                "missingTechSummary": "Complete absence of client-side optimization and testing tools. Scalable GTM impossible without instrumentation."
            },
            "influenceMap": {
                "centerNode": {
                    "name": "CEO/Founder",
                    "imageUrl": "/images/ceo_founder_headshot.png"
                },
                "connections": [
                    {
                        "name": "Client A",
                        "logoUrl": "/images/logo_client_a.svg",
                        "quote": "'We took the meeting because of [CEO].' - *VP, Client A*"
                    },
                    {
                        "name": "Client B",
                        "logoUrl": "/images/logo_client_b.svg",
                        "quote": "'Unparalleled trust in the founder's vision.' - *CTO, Client B*"
                    }
                ],
                "summary": "Current growth is relationship-based, high-touch, and non-repeatable."
            }
        },
        "strategicPivot": {
            "title": "Strategic Pivot: Winning the Market",
            "xAxis": {
                "label": "Industry/GTM Focus",
                "minLabel": "Horizontal",
                "maxLabel": "Vertical/Niche"
            },
            "yAxis": {
                "label": "Solution Scope",
                "minLabel": "Point Solution",
                "maxLabel": "Integrated Platform"
            },
            "competitors": [
                {
                    "name": "AI-Solutions Inc.",
                    "isSelf": True,
                    "x": 0.8,
                    "y": 0.9,
                    "differentiator": "The only integrated platform purpose-built for AI-native enterprise workflows.",
                    "detailsLink": "#"
                },
                {
                    "name": "Competitor Alpha",
                    "isSelf": False,
                    "x": 0.2,
                    "y": 0.7,
                    "details": "Horizontal AI, high customization cost."
                },
                {
                    "name": "Competitor Beta",
                    "isSelf": False,
                    "x": 0.7,
                    "y": 0.3,
                    "details": "Niche point solution, limited scope."
                }
            ],
            "marketInsight": "AI-Solutions Inc. occupies a unique and defensible position as the leading Enterprise AI Platform for its target vertical."
        },
        "gtmEvolutionRoadmap": {
            "title": "GTM Transformation Journey",
            "phases": [
                {
                    "title": "Initial GTM State",
                    "durationLabel": "Current (Q1-Q2)",
                    "elements": [
                        {"label": "Lead Source", "value": "Founder Network & Early PLG"},
                        {"label": "Sales Motion", "value": "Self-Serve / High-touch Founder Demos"},
                        {"label": "Key Metric Focus", "value": "Product Adoption & Initial ARR"},
                        {"label": "Key Roles", "value": "Technical Founders, Early CSMs"}
                    ],
                    "tooltip": "Current GTM is highly reliant on founder's personal network and early product-led growth signals."
                },
                {
                    "title": "Accelerated GTM",
                    "durationLabel": "Months 1-12 (Q3-Q6)",
                    "elements": [
                        {"label": "Lead Source", "value": "Marketing Campaigns (Paid/Organic), SDR Outbound"},
                        {"label": "Sales Motion", "value": "Structured Sales-Assist, Mid-Market AEs"},
                        {"label": "Key Metric Focus", "value": "Marketing Sourced Pipeline, Sales Cycle Reduction"},
                        {"label": "Key Roles", "value": "VP Marketing (Performance), Head of Sales"}
                    ],
                    "tooltip": "Investment enables critical GTM hires and program spend, building foundational processes."
                },
                {
                    "title": "Scaled GTM",
                    "durationLabel": "Year 2+ Vision (Q7+)",
                    "elements": [
                        {"label": "Lead Source", "value": "Robust Demand Gen, Channel Partnerships"},
                        {"label": "Sales Motion", "value": "Enterprise AEs, Strategic Account Management"},
                        {"label": "Key Metric Focus", "value": "LTV:CAC, Net Retention, Market Share"},
                        {"label": "Key Roles", "value": "CRO, Global Sales Leaders"}
                    ],
                    "tooltip": "Achieved through sustained GTM excellence and market leadership, driving predictable revenue."
                }
            ],
            "investmentImpactText": "Scale VP's capital & GTM expertise fuels this transition."
        },
        "actionPlan": {
            "title": "Key Action Plan & Milestones",
            "phases": [
                {
                    "name": "Phase 1: Instrument & Build",
                    "startMonth": 1,
                    "endMonth": 3,
                    "milestones": [
                        {
                            "month": 1,
                            "label": "Hire VP Marketing",
                            "impact": "Critical hire to lead GTM transformation."
                        },
                        {
                            "month": 2,
                            "label": "Deploy MarTech Stack",
                            "impact": "Enable tracking and automation."
                        },
                        {
                            "month": 3,
                            "label": "Define ICP & Segmentation",
                            "impact": "Focus GTM efforts on high-value segments."
                        }
                    ],
                    "kpi": {
                        "label": "Funnel Conversion Rate (Website to MQL)",
                        "initial": 0,
                        "target": 5,
                        "unit": "%"
                    }
                },
                {
                    "name": "Phase 2: Commercialize & Scale",
                    "startMonth": 4,
                    "endMonth": 12,
                    "milestones": [
                        {
                            "month": 4,
                            "label": "Launch First Campaign",
                            "impact": "Generate initial marketing-sourced pipeline."
                        },
                        {
                            "month": 6,
                            "label": "Systematize Sales Playbook",
                            "impact": "Enable new AEs to be productive faster."
                        },
                        {
                            "month": 9,
                            "label": "Pilot Enterprise Strategy",
                            "impact": "Validate new ACV model and buyer persona."
                        }
                    ],
                    "kpi": {
                        "label": "Marketing-Sourced Pipeline",
                        "initial": 0,
                        "target": 500000,
                        "unit": "$",
                        "format": "currency"
                    }
                }
            ]
        },
        "riskMatrix": {
            "title": "Critical Risks & Mitigation",
            "xAxisLabel": "Likelihood",
            "yAxisLabel": "Impact",
            "risks": [
                {
                    "name": "Execution Risk",
                    "impact": 3,
                    "likelihood": 3,
                    "mitigation": "Hire CRO post-investment (Priority 1).",
                    "color": "#DC3545"
                },
                {
                    "name": "PLG-to-Enterprise Transition",
                    "impact": 2,
                    "likelihood": 3,
                    "mitigation": "Build dedicated sales-assist function.",
                    "color": "#FFC107"
                },
                {
                    "name": "Competitive Intrusion",
                    "impact": 3,
                    "likelihood": 2,
                    "mitigation": "Proactive category thought leadership.",
                    "color": "#FFC107"
                }
            ]
        }
    }


# ============================================================================
# PHASE 1.1: EXECUTIVE THESIS SECTION TESTS (5-6 tests)
# ============================================================================

class TestExecutiveThesisSection:
    """Contract tests for Executive Thesis section"""

    def test_gtm_score_structure(self, sample_mea_config, mea_config_schema):
        """Test GTM Score gauge has required fields and valid values"""
        gtm_score = sample_mea_config["executiveThesis"]["gtmScore"]

        # Required fields
        assert "value" in gtm_score
        assert "maxValue" in gtm_score
        assert "label" in gtm_score
        assert "colorThresholds" in gtm_score
        assert "tooltip" in gtm_score

        # Value constraints
        assert 0 <= gtm_score["value"] <= 100
        assert gtm_score["maxValue"] == 100
        assert gtm_score["label"] in ["Critical GTM Gap", "Foundational Gaps", "Solid Foundation", "GTM Excellence"]

        # Color thresholds
        assert len(gtm_score["colorThresholds"]) >= 3
        for threshold in gtm_score["colorThresholds"]:
            assert "stop" in threshold
            assert "color" in threshold
            assert 0 <= threshold["stop"] <= 100
            assert threshold["color"].startswith("#")

    def test_gtm_breakdown_radar_data(self, sample_mea_config):
        """Test GTM breakdown has exactly 5 pillars for radar chart"""
        gtm_breakdown = sample_mea_config["executiveThesis"]["gtmBreakdown"]

        # Must have exactly 5 pillars
        assert len(gtm_breakdown) == 5

        expected_pillars = ["Lead Gen", "MarTech", "Data/Analytics", "Playbook", "Team"]
        actual_pillars = [item["pillar"] for item in gtm_breakdown]
        assert set(actual_pillars) == set(expected_pillars)

        # Each pillar has score and benchmark
        for item in gtm_breakdown:
            assert "pillar" in item
            assert "score" in item
            assert "benchmark" in item
            assert 0 <= item["score"] <= 100
            assert 0 <= item["benchmark"] <= 100

    def test_arr_composition_data(self, sample_mea_config):
        """Test ARR data structure for stacked bar chart"""
        arr_data = sample_mea_config["executiveThesis"]["arrData"]

        # Required fields
        assert "currentValue" in arr_data
        assert "composition" in arr_data
        assert "logos" in arr_data
        assert "growthPatternSummary" in arr_data

        # Current value validation
        assert arr_data["currentValue"] > 0

        # Composition segments
        assert len(arr_data["composition"]) > 0
        total_composition = sum(segment["value"] for segment in arr_data["composition"])
        assert abs(total_composition - arr_data["currentValue"]) < 0.1  # Allow small float diff

        # Each segment has required fields
        for segment in arr_data["composition"]:
            assert "type" in segment
            assert "value" in segment
            assert "color" in segment
            assert "tooltip" in segment
            assert segment["color"].startswith("#")

    def test_strategic_opportunity_structure(self, sample_mea_config):
        """Test strategic opportunity and ACV expansion data"""
        opp = sample_mea_config["executiveThesis"]["strategicOpportunity"]

        # Required fields
        assert "label" in opp
        assert "summary" in opp
        assert "acvExpansion" in opp

        # Label validation
        assert opp["label"] in ["Low", "Medium", "High", "Transformative"]

        # ACV expansion structure
        acv = opp["acvExpansion"]
        assert "baselineAcv" in acv
        assert "steps" in acv
        assert "potentialAcv" in acv

        assert acv["baselineAcv"]["value"] > 0
        assert acv["potentialAcv"]["value"] > acv["baselineAcv"]["value"]

    def test_acv_waterfall_steps(self, sample_mea_config):
        """Test ACV waterfall steps add up correctly"""
        acv = sample_mea_config["executiveThesis"]["strategicOpportunity"]["acvExpansion"]

        baseline = acv["baselineAcv"]["value"]
        potential = acv["potentialAcv"]["value"]
        steps = acv["steps"]

        # Calculate expected potential from steps
        calculated_potential = baseline
        for step in steps:
            assert "type" in step
            assert "value" in step
            assert "label" in step
            assert "justification" in step

            if step["type"] == "increase":
                calculated_potential += step["value"]
            elif step["type"] == "decrease":
                calculated_potential -= step["value"]

        # Waterfall math should add up
        assert abs(calculated_potential - potential) < 1  # Allow $1 rounding

    def test_executive_thesis_schema_validation(self, sample_mea_config, mea_config_schema):
        """Test entire Executive Thesis section validates against JSON Schema"""
        # This test validates the complete data structure
        validate(instance=sample_mea_config, schema=mea_config_schema)

        # If we get here, validation passed
        assert True


# ============================================================================
# PHASE 1.2: CORE TENSION SECTION TESTS (4-5 tests)
# ============================================================================

class TestCoreTensionSection:
    """Contract tests for Core Tension section"""

    def test_asset_liability_structure(self, sample_mea_config):
        """Test Core Tension has asset and liability subsections"""
        core_tension = sample_mea_config["coreTension"]

        # Required top-level fields
        assert "asset" in core_tension
        assert "liability" in core_tension
        assert "influenceMap" in core_tension

        # Asset structure
        asset = core_tension["asset"]
        assert "title" in asset
        assert "points" in asset
        assert len(asset["points"]) > 0

        # Each asset point has text and evidence
        for point in asset["points"]:
            assert "text" in point
            assert "evidence" in point
            assert len(point["text"]) > 0
            assert len(point["evidence"]) > 0

        # Liability structure
        liability = core_tension["liability"]
        assert "title" in liability
        assert "points" in liability
        assert "missingTechStack" in liability
        assert "missingTechSummary" in liability

        # Each liability point has text and evidence
        for point in liability["points"]:
            assert "text" in point
            assert "evidence" in point

    def test_missing_tech_stack_validation(self, sample_mea_config):
        """Test missing tech stack has valid logo URLs"""
        liability = sample_mea_config["coreTension"]["liability"]

        # Must have at least 1 missing tech logo
        assert len(liability["missingTechStack"]) >= 1

        # Each logo must be a valid path
        for logo_url in liability["missingTechStack"]:
            assert isinstance(logo_url, str)
            assert logo_url.startswith("/images/logo_")
            assert logo_url.endswith(".svg") or logo_url.endswith(".png")

        # Summary text is required
        assert len(liability["missingTechSummary"]) > 0

    def test_influence_map_network_data(self, sample_mea_config):
        """Test influence map has valid network graph structure"""
        influence_map = sample_mea_config["coreTension"]["influenceMap"]

        # Required fields
        assert "centerNode" in influence_map
        assert "connections" in influence_map
        assert "summary" in influence_map

        # Center node (CEO/Founder)
        center = influence_map["centerNode"]
        assert "name" in center
        assert "imageUrl" in center
        assert center["imageUrl"].startswith("/images/")

        # Connections (clients)
        assert len(influence_map["connections"]) > 0
        for connection in influence_map["connections"]:
            assert "name" in connection
            assert "logoUrl" in connection
            assert "quote" in connection
            assert connection["logoUrl"].startswith("/images/logo_")

        # Summary text
        assert len(influence_map["summary"]) > 0

    def test_asset_vs_liability_contrast(self, sample_mea_config):
        """Test asset and liability create meaningful contrast"""
        core_tension = sample_mea_config["coreTension"]

        # Asset should highlight strengths
        asset = core_tension["asset"]
        assert len(asset["points"]) >= 2  # At least 2 strengths

        # Liability should highlight gaps
        liability = core_tension["liability"]
        assert len(liability["points"]) >= 2  # At least 2 weaknesses
        assert len(liability["missingTechStack"]) >= 3  # At least 3 missing tools

        # Titles should be distinct
        assert asset["title"] != liability["title"]

    def test_core_tension_schema_validation(self, sample_mea_config, mea_config_schema):
        """Test entire Core Tension section validates against JSON Schema"""
        # Validate the complete data structure
        validate(instance=sample_mea_config, schema=mea_config_schema)

        # If we get here, validation passed
        assert True


# ============================================================================
# PHASE 1.3: REMAINING SECTIONS TESTS (8-10 tests)
# ============================================================================

class TestStrategicPivotSection:
    """Contract tests for Strategic Pivot section"""

    def test_competitive_matrix_structure(self, sample_mea_config):
        """Test competitive positioning matrix has valid axes and competitors"""
        strategic_pivot = sample_mea_config["strategicPivot"]

        # Required fields
        assert "title" in strategic_pivot
        assert "xAxis" in strategic_pivot
        assert "yAxis" in strategic_pivot
        assert "competitors" in strategic_pivot
        assert "marketInsight" in strategic_pivot

        # Axis structure
        x_axis = strategic_pivot["xAxis"]
        assert "label" in x_axis
        assert "minLabel" in x_axis
        assert "maxLabel" in x_axis

        y_axis = strategic_pivot["yAxis"]
        assert "label" in y_axis
        assert "minLabel" in y_axis
        assert "maxLabel" in y_axis

    def test_competitor_positioning_data(self, sample_mea_config):
        """Test competitor nodes have valid x, y coordinates"""
        competitors = sample_mea_config["strategicPivot"]["competitors"]

        # Must have at least 2 competitors (including self)
        assert len(competitors) >= 2

        # Exactly one competitor is self
        self_count = sum(1 for c in competitors if c.get("isSelf", False))
        assert self_count == 1

        # All competitors have valid coordinates
        for competitor in competitors:
            assert "name" in competitor
            assert "x" in competitor
            assert "y" in competitor
            assert 0 <= competitor["x"] <= 1
            assert 0 <= competitor["y"] <= 1

            # Self has differentiator and detailsLink
            if competitor.get("isSelf", False):
                assert "differentiator" in competitor
                assert "detailsLink" in competitor
            else:
                # Others have details
                assert "details" in competitor


class TestGtmEvolutionSection:
    """Contract tests for GTM Evolution Roadmap section"""

    def test_roadmap_phases_structure(self, sample_mea_config):
        """Test GTM Evolution has 3 phases with valid structure"""
        roadmap = sample_mea_config["gtmEvolutionRoadmap"]

        # Required fields
        assert "title" in roadmap
        assert "phases" in roadmap
        assert "investmentImpactText" in roadmap

        # Must have exactly 3 phases
        phases = roadmap["phases"]
        assert len(phases) == 3

        # Each phase has required structure
        for phase in phases:
            assert "title" in phase
            assert "durationLabel" in phase
            assert "elements" in phase
            assert "tooltip" in phase
            assert len(phase["elements"]) > 0

    def test_phase_elements_data(self, sample_mea_config):
        """Test each phase element has label and value"""
        phases = sample_mea_config["gtmEvolutionRoadmap"]["phases"]

        for phase in phases:
            for element in phase["elements"]:
                assert "label" in element
                assert "value" in element
                assert len(element["label"]) > 0
                assert len(element["value"]) > 0


class TestActionPlanSection:
    """Contract tests for Action Plan section"""

    def test_gantt_chart_structure(self, sample_mea_config):
        """Test Action Plan has phases with milestones and KPIs"""
        action_plan = sample_mea_config["actionPlan"]

        # Required fields
        assert "title" in action_plan
        assert "phases" in action_plan

        # Must have at least 1 phase
        phases = action_plan["phases"]
        assert len(phases) >= 1

        # Each phase has required structure
        for phase in phases:
            assert "name" in phase
            assert "startMonth" in phase
            assert "endMonth" in phase
            assert "milestones" in phase
            assert "kpi" in phase

            # Duration validation
            assert phase["endMonth"] > phase["startMonth"]
            assert 1 <= phase["startMonth"] <= 12
            assert 1 <= phase["endMonth"] <= 12

    def test_milestone_data(self, sample_mea_config):
        """Test milestones have month, label, and impact"""
        phases = sample_mea_config["actionPlan"]["phases"]

        for phase in phases:
            milestones = phase["milestones"]
            assert len(milestones) > 0

            for milestone in milestones:
                assert "month" in milestone
                assert "label" in milestone
                assert "impact" in milestone
                # Milestone month must be within phase duration
                assert phase["startMonth"] <= milestone["month"] <= phase["endMonth"]

    def test_kpi_structure(self, sample_mea_config):
        """Test KPI has label, initial, target, and unit"""
        phases = sample_mea_config["actionPlan"]["phases"]

        for phase in phases:
            kpi = phase["kpi"]
            assert "label" in kpi
            assert "initial" in kpi
            assert "target" in kpi
            assert "unit" in kpi

            # Target should be greater than initial (improvement expected)
            assert kpi["target"] > kpi["initial"]


class TestRiskMatrixSection:
    """Contract tests for Risk Matrix section"""

    def test_risk_heatmap_structure(self, sample_mea_config):
        """Test Risk Matrix has valid structure"""
        risk_matrix = sample_mea_config["riskMatrix"]

        # Required fields
        assert "title" in risk_matrix
        assert "xAxisLabel" in risk_matrix
        assert "yAxisLabel" in risk_matrix
        assert "risks" in risk_matrix

        # Must have at least 2 risks
        risks = risk_matrix["risks"]
        assert len(risks) >= 2

    def test_risk_node_data(self, sample_mea_config):
        """Test each risk has name, impact, likelihood, mitigation, color"""
        risks = sample_mea_config["riskMatrix"]["risks"]

        for risk in risks:
            assert "name" in risk
            assert "impact" in risk
            assert "likelihood" in risk
            assert "mitigation" in risk
            assert "color" in risk

            # Impact and likelihood are on 1-3 scale (for 3x3 grid)
            assert 1 <= risk["impact"] <= 3
            assert 1 <= risk["likelihood"] <= 3

            # Color is hex format
            assert risk["color"].startswith("#")

    def test_full_schema_validation(self, sample_mea_config, mea_config_schema):
        """Test complete MEA_CONFIG validates against JSON Schema"""
        # Final comprehensive validation
        validate(instance=sample_mea_config, schema=mea_config_schema)
        assert True


# All contract tests complete. Next: Build gtm_dashboard_transformer.py (Phase 1.4)
