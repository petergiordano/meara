#!/usr/bin/env python3
"""
Full MEARA Pipeline Automation
Orchestrates: DeepStack → Deep Research → MEARA Analysis

This script automates the complete analysis pipeline:
1. Run DeepStack Collector (website technical analysis)
2. Process DeepStack JSON → L3 Ground Truth Report (via Gemini)
3. Generate Deep Research Brief using L3 + DeepR prompt (via OpenAI)
4. Run MEARA analysis using DRB + context docs (via OpenAI Assistants)

Usage:
    python 5_full_pipeline.py --company "Acme Corp" --url "https://acme.com" [--context-docs "doc1.pdf,doc2.pdf"]
"""

import argparse
import os
import sys
import json
import subprocess
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv(Path(__file__).parent.parent / ".env")

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Paths
MEARA_ROOT = Path(__file__).parent.parent
DEEPSTACK_ROOT = MEARA_ROOT.parent / "deepstack"
DEEPSTACK_OUTPUT_DIR = DEEPSTACK_ROOT / "output"
DEEPR_PROMPT_PATH = MEARA_ROOT / "Prompt_for_DeepR_B2B_SaaS_Marketing_Insights.md"

class PipelineOrchestrator:
    def __init__(self, company_name, company_url, context_docs=None):
        self.company_name = company_name
        self.company_url = company_url
        self.context_docs = context_docs or []
        self.timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

        # Output tracking
        self.deepstack_json_path = None
        self.l3_report_path = None
        self.drb_path = None
        self.mea_report_path = None

    def step_1_run_deepstack(self):
        """Step 1: Run DeepStack Collector"""
        print("\n" + "="*60)
        print("STEP 1: Running DeepStack Collector")
        print("="*60)

        # Extract domain for output filename
        from urllib.parse import urlparse
        parsed = urlparse(self.company_url)
        domain = parsed.netloc.replace('www.', '').replace(':', '_')

        deepstack_script = DEEPSTACK_ROOT / "deepstack.py"

        print(f"\n🔬 Analyzing website: {self.company_url}")
        print(f"  Domain: {domain}")
        print(f"  DeepStack script: {deepstack_script}")

        # Run DeepStack collector
        result = subprocess.run(
            [sys.executable, str(deepstack_script), "-u", self.company_url],
            cwd=str(DEEPSTACK_ROOT),
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout
        )

        if result.returncode != 0:
            raise RuntimeError(f"DeepStack failed: {result.stderr}")

        # Find output file
        expected_json = DEEPSTACK_OUTPUT_DIR / f"deepstack_output-{domain}.json"
        if not expected_json.exists():
            raise FileNotFoundError(f"Expected DeepStack output not found: {expected_json}")

        self.deepstack_json_path = expected_json
        print(f"\n✓ DeepStack analysis complete")
        print(f"  Output: {self.deepstack_json_path}")

        return self.deepstack_json_path

    def step_2_generate_l3_report(self):
        """Step 2: Generate L3 Ground Truth Report using Gemini API"""
        print("\n" + "="*60)
        print("STEP 2: Generating L3 Ground Truth Report")
        print("="*60)

        # NOTE: This step requires Gemini API integration
        # For now, we'll create a placeholder that can be replaced with actual Gemini call

        print("\n⚠️  NOTE: This step requires Gemini API integration")
        print("   Current implementation: Manual step required")
        print(f"\n   ACTION REQUIRED:")
        print(f"   1. Upload {self.deepstack_json_path} to DeepStack Collector Gemini Gem")
        print(f"   2. Request 'L3 Ground Truth' report")
        print(f"   3. Save output to: {MEARA_ROOT / 'analysis_results' / f'{self.company_name}_{self.timestamp}_L3_GroundTruth.md'}")

        # For automation, we would call Gemini API here:
        # l3_report = self._call_gemini_for_l3(self.deepstack_json_path)

        # Placeholder for manual workflow
        l3_report_path = MEARA_ROOT / "analysis_results" / f"{self.company_name}_{self.timestamp}_L3_GroundTruth.md"
        self.l3_report_path = l3_report_path

        print(f"\n⏸️  Pipeline paused for manual L3 generation")
        print(f"   Resume with: python {Path(__file__).name} --resume --l3-report {l3_report_path}")

        return None  # Indicates manual step required

    def step_3_generate_deep_research_brief(self, l3_report_content):
        """Step 3: Generate Deep Research Brief using special Deep Research AI tool"""
        print("\n" + "="*60)
        print("STEP 3: Generating Deep Research Brief")
        print("="*60)

        # Load DeepR prompt
        deepr_prompt = DEEPR_PROMPT_PATH.read_text()

        # Prepare the research prompt with L3 context
        research_prompt_path = MEARA_ROOT / "analysis_results" / f"{self.company_name}_{self.timestamp}_DeepR_Prompt.md"

        full_prompt = f"""# Deep Research Task for {self.company_name}

## Company Information
- **Company**: {self.company_name}
- **URL**: {self.company_url}

## Technical Pre-Analysis Report
A DeepStack L3 Ground Truth report has been completed with detailed technical findings.

---

## Research Instructions

{deepr_prompt}

---

## L3 Ground Truth Report (Technical Foundation)

{l3_report_content}

---

## Output Required
Follow the Deep Research Brief deliverable structure exactly as specified in the Research Instructions above.
"""

        # Save the prompt for manual execution
        research_prompt_path.write_text(full_prompt)

        print(f"\n⚠️  MANUAL STEP REQUIRED: Deep Research Execution")
        print(f"\n   Deep Research requires a special AI tool (Gemini Deep Research, Perplexity, etc.)")
        print(f"\n   ACTION REQUIRED:")
        print(f"   1. Open your Deep Research AI tool (Gemini Deep Research recommended)")
        print(f"   2. Upload/paste the research prompt from:")
        print(f"      {research_prompt_path}")
        print(f"   3. Execute the deep research")
        print(f"   4. Save the output as:")
        print(f"      {MEARA_ROOT / 'analysis_results' / f'{self.company_name}_{self.timestamp}_DRB.md'}")
        print(f"\n   The prompt includes:")
        print(f"   - Company context ({self.company_name})")
        print(f"   - L3 technical findings for reference")
        print(f"   - Complete DeepR research methodology")
        print(f"   - Output structure requirements")

        drb_path = MEARA_ROOT / "analysis_results" / f"{self.company_name}_{self.timestamp}_DRB.md"
        self.drb_path = drb_path

        print(f"\n⏸️  Pipeline paused for manual Deep Research execution")
        print(f"\n   Resume with:")
        print(f"   python {Path(__file__).name} --company \"{self.company_name}\" --url \"{self.company_url}\" \\")
        print(f"     --drb \"{drb_path}\"")

        return None  # Indicates manual step required

    def step_4_run_meara_analysis(self, drb_content):
        """Step 4: Run MEARA Marketing Effectiveness Analysis"""
        print("\n" + "="*60)
        print("STEP 4: Running MEARA Analysis")
        print("="*60)

        # Import MEARA workflow
        sys.path.insert(0, str(Path(__file__).parent))
        from orchestrate_workflow import run_meara_workflow

        print(f"\n📊 Running MEARA analysis...")
        print(f"  Company: {self.company_name}")
        print(f"  DRB loaded: {len(drb_content)} characters")
        if self.context_docs:
            print(f"  Additional context docs: {len(self.context_docs)}")

        # Upload context docs if provided
        if self.context_docs:
            print(f"\n  Uploading {len(self.context_docs)} context documents...")
            # TODO: Implement context doc upload to vector store

        # Run MEARA workflow
        state, report_file = run_meara_workflow(
            company_name=self.company_name,
            company_url=self.company_url,
            deep_research_brief=drb_content
        )

        self.mea_report_path = report_file

        print(f"\n✓ MEARA analysis complete")
        print(f"  Report: {report_file}")

        return report_file

    def run_full_pipeline(self, resume_from=None):
        """Execute the complete pipeline"""
        print("\n" + "="*80)
        print("FULL MEARA PIPELINE AUTOMATION")
        print("="*80)
        print(f"\nCompany: {self.company_name}")
        print(f"URL: {self.company_url}")
        print(f"Timestamp: {self.timestamp}")

        try:
            if not resume_from or resume_from == "deepstack":
                # Step 1: DeepStack
                self.step_1_run_deepstack()

            if not resume_from or resume_from == "l3":
                # Step 2: L3 Report (manual Gemini Gem execution)
                l3_result = self.step_2_generate_l3_report()
                if l3_result is None:
                    print("\n⚠️  PIPELINE PAUSED: Manual L3 generation required")
                    return

            if not resume_from or resume_from == "drb":
                # Step 3: Deep Research Brief (manual Deep Research execution)
                if not self.l3_report_path or not self.l3_report_path.exists():
                    raise FileNotFoundError(f"L3 report not found: {self.l3_report_path}")

                l3_content = self.l3_report_path.read_text()
                drb_result = self.step_3_generate_deep_research_brief(l3_content)
                if drb_result is None:
                    print("\n⚠️  PIPELINE PAUSED: Manual Deep Research execution required")
                    return

            # Step 4: MEARA Analysis (fully automated)
            if not self.drb_path or not self.drb_path.exists():
                raise FileNotFoundError(f"DRB not found: {self.drb_path}")

            drb_content = self.drb_path.read_text()
            self.step_4_run_meara_analysis(drb_content)

            # Summary
            print("\n" + "="*80)
            print("✅ FULL PIPELINE COMPLETE!")
            print("="*80)
            self.print_summary()

        except Exception as e:
            print(f"\n❌ Pipeline failed: {e}")
            import traceback
            traceback.print_exc()
            sys.exit(1)

    def print_summary(self):
        """Print pipeline summary"""
        print(f"\n📁 Output Files:")
        print(f"  1. DeepStack JSON: {self.deepstack_json_path}")
        print(f"  2. L3 Ground Truth: {self.l3_report_path}")
        print(f"  3. Deep Research Brief: {self.drb_path}")
        print(f"  4. MEA Report: {self.mea_report_path}")
        print(f"\n🎯 Next Steps:")
        print(f"  1. Review final MEA report: {self.mea_report_path}")
        print(f"  2. Share with stakeholders")
        print(f"  3. Use insights for marketing strategy")

def main():
    parser = argparse.ArgumentParser(
        description="Run full MEARA pipeline: DeepStack → L3 → DRB → MEA",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Full pipeline (will pause for manual L3 and DRB steps)
  python 5_full_pipeline.py --company "Acme Corp" --url "https://acme.com"

  # Resume from L3 report (skip DeepStack, pause for DRB)
  python 5_full_pipeline.py -c "Acme Corp" -u "https://acme.com" --l3-report "path/to/l3.md"

  # Resume from DRB (skip DeepStack, L3, and Deep Research)
  python 5_full_pipeline.py -c "Acme Corp" -u "https://acme.com" --drb "path/to/drb.md"

  # With additional context documents
  python 5_full_pipeline.py -c "Acme Corp" -u "https://acme.com" --context-docs "pitch.pdf,memo.pdf"
        """
    )

    parser.add_argument(
        "-c", "--company",
        required=True,
        help="Company name"
    )

    parser.add_argument(
        "-u", "--url",
        required=True,
        help="Company URL"
    )

    parser.add_argument(
        "--context-docs",
        help="Comma-separated list of additional context document paths"
    )

    parser.add_argument(
        "--l3-report",
        help="Path to existing L3 Ground Truth report (skips DeepStack and L3 generation)"
    )

    parser.add_argument(
        "--drb",
        help="Path to existing Deep Research Brief (skips DeepStack, L3, and Deep Research)"
    )

    args = parser.parse_args()

    # Parse context docs
    context_docs = []
    if args.context_docs:
        context_docs = [doc.strip() for doc in args.context_docs.split(",")]

    # Create orchestrator
    orchestrator = PipelineOrchestrator(
        company_name=args.company,
        company_url=args.url,
        context_docs=context_docs
    )

    # Run pipeline based on resume point
    try:
        if args.drb:
            # Resume from DRB - run only MEARA analysis
            print(f"\n▶️  Resuming from Deep Research Brief: {args.drb}")
            orchestrator.drb_path = Path(args.drb)
            if not orchestrator.drb_path.exists():
                raise FileNotFoundError(f"DRB not found: {args.drb}")

            drb_content = orchestrator.drb_path.read_text()
            orchestrator.step_4_run_meara_analysis(drb_content)
            orchestrator.print_summary()

        elif args.l3_report:
            # Resume from L3 - run DRB and MEARA
            print(f"\n▶️  Resuming from L3 Ground Truth: {args.l3_report}")
            orchestrator.l3_report_path = Path(args.l3_report)
            if not orchestrator.l3_report_path.exists():
                raise FileNotFoundError(f"L3 report not found: {args.l3_report}")

            orchestrator.run_full_pipeline(resume_from="drb")

        else:
            # Full pipeline from start
            orchestrator.run_full_pipeline()

    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
