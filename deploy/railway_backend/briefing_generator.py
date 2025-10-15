"""
GTM Scalability Briefing Generator

Extracts structured briefing data from MEARA markdown reports using OpenAI.
Generates data compatible with the briefing dashboard components.
"""

import json
import os
from openai import OpenAI
from typing import Dict, Any
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

BRIEFING_EXTRACTION_PROMPT = """
You are a marketing analysis expert. Analyze this MEARA marketing effectiveness report and extract a GTM Scalability Briefing in the following JSON format:

{
  "companyName": "Company name from the report",
  "reportDate": "Report date in format 'Month Day, Year'",
  "preparedBy": "Scale VP GTM Platform Team",
  "strategicVerdict": {
    "maturityStage": "One of: AD-HOC, REPEATABLE, SCALABLE, OPTIMIZED",
    "maturityDescriptor": "Brief description of why they are at this stage",
    "coreNarrative": [
      "2-3 paragraphs from the Executive Summary or Consolidated Diligence Finding",
      "Each paragraph should be 2-4 sentences summarizing key findings"
    ]
  },
  "coreAnalysis": {
    "foundation": [
      {"title": "Strength 1", "description": "Brief description"},
      {"title": "Strength 2", "description": "Brief description"},
      {"title": "Strength 3", "description": "Brief description"}
    ],
    "bottlenecks": [
      {"title": "Critical Issue 1", "description": "Brief description"},
      {"title": "Critical Issue 2", "description": "Brief description"},
      {"title": "Critical Issue 3", "description": "Brief description"}
    ]
  },
  "pillars": [
    {
      "title": "Pillar Name (e.g., Analytics Framework)",
      "points": [
        "Key point 1",
        "Key point 2",
        "Key point 3"
      ]
    }
  ],
  "roadmap": [
    {
      "phase": "Phase 1: Foundation (Weeks 1-6)",
      "color": "blue",
      "tasks": [
        {
          "icon": "🎯",
          "title": "Task Name",
          "description": "Task description"
        }
      ]
    },
    {
      "phase": "Phase 2: Growth (Weeks 7-12)",
      "color": "indigo",
      "tasks": [
        {
          "icon": "📊",
          "title": "Task Name",
          "description": "Task description"
        }
      ]
    },
    {
      "phase": "Phase 3: Scale (Months 4-6)",
      "color": "purple",
      "tasks": [
        {
          "icon": "🚀",
          "title": "Task Name",
          "description": "Task description"
        }
      ]
    }
  ]
}

INSTRUCTIONS:
1. Extract the company name from the report title or Analysis Date section
2. Determine GTM maturity stage based on the critical issues and overall assessment:
   - AD-HOC: Multiple critical gaps, no systematic processes
   - REPEATABLE: Some processes in place, inconsistent execution
   - SCALABLE: Strong foundation, ready to grow with minor improvements
   - OPTIMIZED: Best-in-class across dimensions, data-driven optimization

3. For coreNarrative: Use the Executive Summary and Consolidated Diligence Finding sections
4. For foundation: Extract strengths from the dimensional analysis (look for "Exceptional" or "Competent" ratings)
5. For bottlenecks: Extract from Critical Issues Summary or Root Cause Analysis
6. For pillars: Use the "Pillar 1", "Pillar 2", etc. sections from the executive summary, or the main strategic recommendations
7. For roadmap: Extract from the Phased Implementation Plan section - convert the phases into the 3-phase structure

IMPORTANT: Return ONLY valid JSON, no additional text or explanation.
"""

def generate_briefing(report_markdown: str, company_name: str = None) -> Dict[str, Any]:
    """
    Generate GTM Scalability Briefing from MEARA report markdown.

    Args:
        report_markdown: The full MEARA report in markdown format
        company_name: Optional company name override

    Returns:
        Dictionary containing briefing data matching the expected schema
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": BRIEFING_EXTRACTION_PROMPT},
                {"role": "user", "content": f"Here is the MEARA report to analyze:\n\n{report_markdown}"}
            ],
            response_format={"type": "json_object"},
            temperature=0.3
        )

        briefing_data = json.loads(response.choices[0].message.content)

        # Override company name if provided
        if company_name:
            briefing_data["companyName"] = company_name

        return briefing_data

    except Exception as e:
        print(f"Error generating briefing: {str(e)}")
        raise


def save_briefing(briefing_data: Dict[str, Any], analysis_job_id: str) -> str:
    """
    Save briefing data to a JSON file.

    Args:
        briefing_data: The briefing data dictionary
        analysis_job_id: The MEARA analysis job ID

    Returns:
        Path to the saved briefing file
    """
    os.makedirs("briefings", exist_ok=True)
    briefing_path = f"briefings/briefing_{analysis_job_id}.json"

    with open(briefing_path, 'w') as f:
        json.dump(briefing_data, f, indent=2)

    return briefing_path


def load_briefing(analysis_job_id: str) -> Dict[str, Any]:
    """
    Load briefing data from a JSON file.

    Args:
        analysis_job_id: The MEARA analysis job ID

    Returns:
        Briefing data dictionary

    Raises:
        FileNotFoundError: If briefing file doesn't exist
    """
    briefing_path = f"briefings/briefing_{analysis_job_id}.json"

    with open(briefing_path, 'r') as f:
        return json.load(f)


if __name__ == "__main__":
    # Test with GGWP report
    test_report_path = "../../analysis_results/GGWP_20251012_194536_report.md"

    if os.path.exists(test_report_path):
        with open(test_report_path, 'r') as f:
            report_content = f.read()

        print("Generating briefing from GGWP report...")
        briefing = generate_briefing(report_content, company_name="GGWP")

        # Save briefing
        saved_path = save_briefing(briefing, "test-ggwp")
        print(f"\nBriefing saved to: {saved_path}")
        print(f"\nGenerated briefing preview:")
        print(json.dumps(briefing, indent=2)[:500] + "...")
    else:
        print(f"Test report not found at: {test_report_path}")
