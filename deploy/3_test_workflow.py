#!/usr/bin/env python3
"""
MEARA Workflow Testing Script
Validates deployment and runs test analyses
"""

import os
import json
import time
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Test cases
TEST_CASES = [
    {
        "name": "Basic SaaS Company (No DRB)",
        "inputs": {
            "company_name": "Acme Analytics",
            "company_url": "https://acme-analytics.example.com",
            "deep_research_brief": None
        },
        "expected_outputs": [
            "deep_research_brief",
            "evidence_collection",
            "dimension_evaluations",
            "root_causes",
            "recommendations",
            "final_report"
        ]
    },
    {
        "name": "AI Company with DRB",
        "inputs": {
            "company_name": "NeuralFlow AI",
            "company_url": "https://neuralflow.example.com",
            "deep_research_brief": """
# NeuralFlow AI - Deep Research Brief

## I. The Unseen Competitive Landscape
- Competitor X is pivoting to enterprise (evidence)
- Emerging threat from open-source alternative

## II. True Voice of Customer
- Pain behind the pain: "Integration complexity" really means "lack of trust in data accuracy"
- Unarticulated need: Real-time collaboration features

## III. Hidden Gems
- 2022 whitepaper on ethical AI was highly cited but no longer promoted
- Founder's unique background in neuroscience underleveraged

## IV. Cross-Industry Inspiration
- Healthcare SaaS "trust badges" approach applicable

## V. AI Engine Perception
- Poorly represented in AI overviews for "ML operations tools"
- Missing schema markup on key pages

**BREAKTHROUGH SPARKS:**
1. Opportunity to create "Ethical ML Operations" category
2. Leverage neuroscience background for unique positioning
"""
        },
        "expected_outputs": [
            "evidence_collection",
            "dimension_evaluations",
            "strategic_verification",
            "root_causes",
            "recommendations",
            "final_report"
        ]
    },
    {
        "name": "Enterprise B2B (Complex Buying Committee)",
        "inputs": {
            "company_name": "CloudSecure Enterprise",
            "company_url": "https://cloudsecure.example.com",
            "deep_research_brief": None
        },
        "expected_outputs": [
            "deep_research_brief",
            "buying_committee_analysis",
            "final_report"
        ]
    }
]

def run_workflow(workflow_id, inputs):
    """Execute workflow with given inputs"""
    print(f"  Running workflow...")

    try:
        # Execute workflow
        run = client.beta.workflows.runs.create(
            workflow_id=workflow_id,
            inputs=inputs
        )

        print(f"  Run ID: {run.id}")

        # Poll for completion
        max_wait = 300  # 5 minutes
        start_time = time.time()

        while time.time() - start_time < max_wait:
            run_status = client.beta.workflows.runs.retrieve(
                workflow_id=workflow_id,
                run_id=run.id
            )

            if run_status.status == "completed":
                print(f"  ✓ Completed in {int(time.time() - start_time)}s")
                return run_status
            elif run_status.status == "failed":
                print(f"  ✗ Failed: {run_status.error}")
                return None

            time.sleep(5)

        print(f"  ✗ Timeout after {max_wait}s")
        return None

    except Exception as e:
        print(f"  ✗ Error: {e}")
        return None

def validate_outputs(run_result, expected_outputs):
    """Validate workflow produced expected outputs"""
    print(f"  Validating outputs...")

    if not run_result:
        return False

    missing = []
    for output_key in expected_outputs:
        if output_key not in run_result.outputs:
            missing.append(output_key)

    if missing:
        print(f"  ✗ Missing outputs: {', '.join(missing)}")
        return False

    print(f"  ✓ All expected outputs present")
    return True

def check_citations(report):
    """Verify all findings have proper citations"""
    print(f"  Checking citation format...")

    # Look for citation pattern: 'Quote' [Source: URL, accessed DATE]
    import re
    citation_pattern = r"'[^']+'\s*\[Source:\s*https?://[^\]]+\]"

    citations = re.findall(citation_pattern, report)

    if len(citations) < 10:
        print(f"  ⚠ Low citation count: {len(citations)} (expected 20+)")
        return False

    print(f"  ✓ Found {len(citations)} properly formatted citations")
    return True

def check_strategic_elements(run_result):
    """Verify strategic framework was applied"""
    print(f"  Checking strategic verification...")

    if "strategic_verification" not in run_result.outputs:
        print(f"  ⚠ No strategic verification output")
        return False

    verification = run_result.outputs["strategic_verification"]

    # Check all 8 elements were assessed
    expected_elements = 8
    if len(verification.get("strategic_verification_table", [])) < expected_elements:
        print(f"  ⚠ Missing strategic elements")
        return False

    print(f"  ✓ All {expected_elements} strategic elements assessed")
    return True

def save_test_results(test_name, run_result):
    """Save test outputs for review"""
    output_dir = "test_results"
    os.makedirs(output_dir, exist_ok=True)

    filename = f"{output_dir}/{test_name.replace(' ', '_').lower()}.json"

    with open(filename, "w") as f:
        json.dump({
            "test_name": test_name,
            "run_id": run_result.id if run_result else None,
            "status": run_result.status if run_result else "failed",
            "outputs": run_result.outputs if run_result else None
        }, f, indent=2)

    print(f"  ✓ Results saved to: {filename}")

def main():
    print("=" * 60)
    print("MEARA Workflow Testing")
    print("=" * 60)

    # Get workflow ID
    workflow_id = input("\nEnter your workflow ID: ").strip()

    if not workflow_id:
        print("Error: Workflow ID required")
        return

    print(f"\nRunning {len(TEST_CASES)} test cases...\n")

    results = []

    for i, test_case in enumerate(TEST_CASES, 1):
        print(f"Test {i}/{len(TEST_CASES)}: {test_case['name']}")
        print("-" * 60)

        # Run workflow
        run_result = run_workflow(workflow_id, test_case["inputs"])

        # Validate outputs
        outputs_valid = validate_outputs(run_result, test_case["expected_outputs"])

        # Additional checks
        if run_result and outputs_valid:
            citations_valid = check_citations(run_result.outputs.get("final_report", ""))
            strategic_valid = check_strategic_elements(run_result)

            # Save results
            save_test_results(test_case["name"], run_result)

            results.append({
                "test": test_case["name"],
                "passed": outputs_valid and citations_valid and strategic_valid
            })
        else:
            results.append({
                "test": test_case["name"],
                "passed": False
            })

        print()

    # Summary
    print("=" * 60)
    print("Test Summary")
    print("=" * 60)

    passed = sum(1 for r in results if r["passed"])
    total = len(results)

    for result in results:
        status = "✓ PASS" if result["passed"] else "✗ FAIL"
        print(f"{status}: {result['test']}")

    print(f"\n{passed}/{total} tests passed")

    if passed == total:
        print("\n🎉 All tests passed! Workflow is ready for production.")
    else:
        print(f"\n⚠ {total - passed} test(s) failed. Review test results for details.")

if __name__ == "__main__":
    main()
