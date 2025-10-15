#!/usr/bin/env python3
"""
MEARA Analysis Runner
Simple interface to run marketing effectiveness analysis
"""

import argparse
import sys
from pathlib import Path

# Add current directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

# Import after path is set
import importlib.util
spec = importlib.util.spec_from_file_location("orchestrate_workflow", Path(__file__).parent / "3_orchestrate_workflow.py")
orchestrate_workflow = importlib.util.module_from_spec(spec)
spec.loader.exec_module(orchestrate_workflow)
run_meara_workflow = orchestrate_workflow.run_meara_workflow

def main():
    parser = argparse.ArgumentParser(
        description="Run MEARA Marketing Effectiveness Analysis",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Basic analysis (will create DRB automatically)
  python 4_run_analysis.py --company "Acme Corp" --url "https://acme.com"

  # Analysis with existing Deep Research Brief
  python 4_run_analysis.py --company "Acme Corp" --url "https://acme.com" --drb drb.txt

  # Or use short form
  python 4_run_analysis.py -c "Acme Corp" -u "https://acme.com"
        """
    )

    parser.add_argument(
        "-c", "--company",
        required=True,
        help="Company name (e.g., 'Acme Corp')"
    )

    parser.add_argument(
        "-u", "--url",
        required=True,
        help="Company URL (e.g., 'https://acme.com')"
    )

    parser.add_argument(
        "-d", "--drb",
        required=False,
        help="Path to Deep Research Brief file (optional)"
    )

    args = parser.parse_args()

    # Load DRB if provided
    drb_content = None
    if args.drb:
        drb_path = Path(args.drb)
        if not drb_path.exists():
            print(f"❌ Error: DRB file not found: {args.drb}")
            return 1

        drb_content = drb_path.read_text()
        print(f"✓ Loaded Deep Research Brief from: {args.drb}")

    # Run analysis
    try:
        state, report_file = run_meara_workflow(
            company_name=args.company,
            company_url=args.url,
            deep_research_brief=drb_content
        )

        print(f"\n{'=' * 60}")
        print("✅ SUCCESS!")
        print(f"{'=' * 60}")
        print(f"\nFinal report available at:")
        print(f"  {report_file}")
        print(f"\nYou can now:")
        print(f"  1. View the report: open {report_file}")
        print(f"  2. Share with stakeholders")
        print(f"  3. Use insights to improve marketing effectiveness")

        return 0

    except FileNotFoundError as e:
        print(f"\n❌ Error: {e}")
        print("\nMake sure you've run the deployment scripts first:")
        print("  1. python 1_setup_vector_store.py")
        print("  2. python 2b_deploy_assistants.py")
        return 1

    except Exception as e:
        print(f"\n❌ Error running analysis: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    exit(main())
