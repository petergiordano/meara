#!/usr/bin/env python3
"""
MEARA Workflow Orchestration Script
Executes the complete 15-node MEARA workflow using Assistants API
"""

import os
import json
import time
import re
from datetime import datetime
from openai import OpenAI
from pathlib import Path
from dotenv import load_dotenv

# Document processing imports (lazy loading)
def lazy_import_docx():
    try:
        import docx
        return docx
    except ImportError:
        print("⚠️  Warning: python-docx not installed. Install with: pip install python-docx")
        return None

def lazy_import_pypdf():
    try:
        import pypdf
        return pypdf
    except ImportError:
        print("⚠️  Warning: pypdf not installed. Install with: pip install pypdf")
        return None

# Load environment variables
load_dotenv(Path(__file__).parent.parent / ".env")

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Document processing functions
def read_pdf(file_path):
    """Extract text from PDF file"""
    pypdf = lazy_import_pypdf()
    if pypdf is None:
        return f"[Error: Cannot read PDF - pypdf not installed. File: {file_path.name}]"

    try:
        reader = pypdf.PdfReader(str(file_path))
        text_parts = []
        for page_num, page in enumerate(reader.pages, 1):
            text = page.extract_text()
            if text.strip():
                text_parts.append(f"[Page {page_num}]\n{text}")
        return "\n\n".join(text_parts)
    except Exception as e:
        return f"[Error reading PDF {file_path.name}: {str(e)}]"

def read_docx(file_path):
    """Extract text from DOCX file"""
    docx = lazy_import_docx()
    if docx is None:
        return f"[Error: Cannot read DOCX - python-docx not installed. File: {file_path.name}]"

    try:
        doc = docx.Document(str(file_path))
        paragraphs = [para.text for para in doc.paragraphs if para.text.strip()]
        return "\n\n".join(paragraphs)
    except Exception as e:
        return f"[Error reading DOCX {file_path.name}: {str(e)}]"

def read_text_file(file_path):
    """Read plain text file"""
    try:
        return file_path.read_text(encoding='utf-8')
    except UnicodeDecodeError:
        # Try with different encoding
        try:
            return file_path.read_text(encoding='latin-1')
        except Exception as e:
            return f"[Error reading text file {file_path.name}: {str(e)}]"

def read_document(file_path):
    """Read document based on file extension"""
    suffix = file_path.suffix.lower()

    if suffix == '.pdf':
        return read_pdf(file_path)
    elif suffix in ['.docx', '.doc']:
        return read_docx(file_path)
    elif suffix in ['.txt', '.md', '.markdown']:
        return read_text_file(file_path)
    else:
        return f"[Unsupported file type: {suffix}. File: {file_path.name}]"

# Load assistant configuration
def load_assistant_config():
    """Load assistant IDs from configuration file"""
    config_path = Path(__file__).parent / "assistant_config.json"

    if not config_path.exists():
        raise FileNotFoundError(
            "Assistant configuration not found. "
            "Run 'python 2b_deploy_assistants.py' first."
        )

    with open(config_path, "r") as f:
        return json.load(f)

# Load config
CONFIG = load_assistant_config()
ASSISTANTS = {a["key"]: a["assistant_id"] for a in CONFIG["assistants"]}

class WorkflowState:
    """Manages state between workflow steps"""

    def __init__(self, company_name, company_url, deep_research_brief=None):
        self.company_name = company_name
        self.company_url = company_url
        self.deep_research_brief = deep_research_brief
        self.evidence_collection = None
        self.dimension_evaluations = None
        self.strategic_verification = None
        self.root_causes = None
        self.recommendations = None
        self.final_report = None

        # Metadata
        self.start_time = datetime.now()
        self.step_timings = {}

    def to_dict(self):
        """Convert state to dictionary"""
        return {
            "company_name": self.company_name,
            "company_url": self.company_url,
            "deep_research_brief": self.deep_research_brief,
            "evidence_collection": self.evidence_collection,
            "dimension_evaluations": self.dimension_evaluations,
            "strategic_verification": self.strategic_verification,
            "root_causes": self.root_causes,
            "recommendations": self.recommendations,
            "final_report": self.final_report
        }

def call_assistant(assistant_id, message_content, thread_id=None):
    """Call an assistant and wait for response with progress indicator"""

    # Create or use existing thread
    if thread_id is None:
        thread = client.beta.threads.create()
        thread_id = thread.id

    # Add message to thread
    client.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content=message_content
    )

    # Run assistant
    print("  🤖 Assistant working", end="", flush=True)
    run = client.beta.threads.runs.create(
        thread_id=thread_id,
        assistant_id=assistant_id
    )

    # Wait for completion with progress dots
    elapsed = 0
    while run.status in ["queued", "in_progress", "cancelling"]:
        time.sleep(1)
        elapsed += 1

        # Print progress dot every second
        if elapsed % 3 == 0:
            print(".", end="", flush=True)

        run = client.beta.threads.runs.retrieve(
            thread_id=thread_id,
            run_id=run.id
        )

    print()  # New line after progress dots

    if run.status == "completed":
        # Get messages
        messages = client.beta.threads.messages.list(
            thread_id=thread_id,
            order="desc",
            limit=1
        )

        # Extract response
        message = messages.data[0]
        response = message.content[0].text.value

        return response, thread_id

    else:
        raise Exception(f"Assistant run failed with status: {run.status}")

def parse_json_response(response):
    """Parse JSON from assistant response"""
    try:
        # Try direct JSON parse
        return json.loads(response)
    except json.JSONDecodeError:
        # Try to extract JSON from markdown code blocks
        json_match = re.search(r'```json\s*(.*?)\s*```', response, re.DOTALL)
        if json_match:
            return json.loads(json_match.group(1))

        # Try to extract any JSON object
        json_match = re.search(r'\{.*\}', response, re.DOTALL)
        if json_match:
            return json.loads(json_match.group(0))

        raise ValueError("Could not parse JSON from response")

def step_01_input_collection(state):
    """Node 1: START - Input Collection"""
    print("\n[1/15] Input Collection")
    print(f"  Company: {state.company_name}")
    print(f"  URL: {state.company_url}")
    print(f"  DRB Provided: {'Yes' if state.deep_research_brief else 'No'}")

def step_02_drb_check(state):
    """Node 2: LOGIC - DRB Check"""
    print("\n[2/15] DRB Check")

    has_drb = (
        state.deep_research_brief is not None and
        len(state.deep_research_brief) > 100
    )

    print(f"  Has DRB: {has_drb}")
    return has_drb

def step_03_research_agent(state):
    """Node 3: AGENT - Research Agent (if no DRB)"""
    print("\n[3/15] 🔬 Research Agent - Creating Deep Research Brief")
    print(f"  Agent: MEARA Research Agent ({ASSISTANTS['research_agent']})")

    start = time.time()

    prompt = f"""Create a Deep Research Brief for the following B2B SaaS company:

Company Name: {state.company_name}
Company URL: {state.company_url}

Execute the Deep Research Protocol to analyze:
1. Unseen Competitive Landscape & Market Dynamics
2. True Voice of the Customer & Unarticulated Needs
3. Latent "Hidden Gems" & Underleveraged Assets
4. Peripheral Vision & Cross-Industry Inspiration
5. AI Engine Perception & "Digital Body Language"

Return results as JSON with keys: deep_research_brief, breakthrough_sparks, strategic_imperatives"""

    response, _ = call_assistant(ASSISTANTS["research_agent"], prompt)
    result = parse_json_response(response)

    state.deep_research_brief = result.get("deep_research_brief", result)
    state.step_timings["research_agent"] = time.time() - start

    print(f"  ✓ Completed in {state.step_timings['research_agent']:.1f}s")

def step_04_evidence_collector(state):
    """Node 4: AGENT - Evidence Collector"""
    print("\n[4/15] 📊 Evidence Collector - Gathering evidence across 9 dimensions")
    print(f"  Agent: MEARA Evidence Collector ({ASSISTANTS['evidence_collector']})")

    start = time.time()

    prompt = f"""Collect evidence for marketing analysis:

Company Name: {state.company_name}
Company URL: {state.company_url}

Deep Research Brief:
{json.dumps(state.deep_research_brief, indent=2) if isinstance(state.deep_research_brief, dict) else state.deep_research_brief}

Conduct web research to gather evidence for all 9 marketing dimensions.
Return as JSON with evidence organized by dimension."""

    response, _ = call_assistant(ASSISTANTS["evidence_collector"], prompt)
    state.evidence_collection = parse_json_response(response)

    state.step_timings["evidence_collector"] = time.time() - start
    print(f"  ✓ Completed in {state.step_timings['evidence_collector']:.1f}s")

def step_05_dimension_evaluator(state):
    """Node 5: AGENT - Dimension Evaluator"""
    print("\n[5/15] 📈 Dimension Evaluator - Evaluating 9 dimensions")
    print(f"  Agent: MEARA Dimension Evaluator ({ASSISTANTS['dimension_evaluator']})")

    start = time.time()

    prompt = f"""Evaluate marketing effectiveness across 9 dimensions:

Company: {state.company_name}

Evidence Collection:
{json.dumps(state.evidence_collection, indent=2)}

Deep Research Brief:
{json.dumps(state.deep_research_brief, indent=2) if isinstance(state.deep_research_brief, dict) else state.deep_research_brief}

Evaluate each dimension and return ratings, strengths, and opportunities as JSON."""

    response, _ = call_assistant(ASSISTANTS["dimension_evaluator"], prompt)
    state.dimension_evaluations = parse_json_response(response)

    state.step_timings["dimension_evaluator"] = time.time() - start
    print(f"  ✓ Completed in {state.step_timings['dimension_evaluator']:.1f}s")

def step_06_strategic_framework_search(state):
    """Node 6: FILE SEARCH - Strategic Framework"""
    print("\n[6/15] Strategic Framework Search")
    print("  ✓ Framework loaded from vector store")

def step_07_strategic_verifier(state):
    """Node 7: AGENT - Strategic Verifier"""
    print("\n[7/15] 🎯 Strategic Verifier - Checking 8 strategic elements")
    print(f"  Agent: MEARA Strategic Verifier ({ASSISTANTS['strategic_verifier']})")

    start = time.time()

    prompt = f"""Verify strategic elements using the Strategic Elements Framework:

Dimension Evaluations:
{json.dumps(state.dimension_evaluations, indent=2)}

Deep Research Brief:
{json.dumps(state.deep_research_brief, indent=2) if isinstance(state.deep_research_brief, dict) else state.deep_research_brief}

Assess all 8 strategic elements and return verification table with priorities as JSON."""

    response, _ = call_assistant(ASSISTANTS["strategic_verifier"], prompt)
    state.strategic_verification = parse_json_response(response)

    state.step_timings["strategic_verifier"] = time.time() - start
    print(f"  ✓ Completed in {state.step_timings['strategic_verifier']:.1f}s")

def step_08_strategic_priority_check(state):
    """Node 8: LOGIC - Strategic Priority Check"""
    print("\n[8/15] Strategic Priority Check")

    high_priority_count = state.strategic_verification.get("high_priority_count", 0)
    has_high_priority = high_priority_count > 0

    print(f"  High Priority Elements: {high_priority_count}")
    print(f"  Flag: {has_high_priority}")

    return has_high_priority

def step_09_rootcause_analyst(state, high_priority_flag):
    """Node 9: AGENT - Root Cause Analyst"""
    print("\n[9/15] 🔍 Root Cause Analyst - Identifying 3-5 root causes")
    print(f"  Agent: MEARA Root Cause Analyst ({ASSISTANTS['rootcause_analyst']})")

    start = time.time()

    prompt = f"""Identify root causes of marketing effectiveness issues:

Company: {state.company_name}

Dimension Evaluations:
{json.dumps(state.dimension_evaluations, indent=2)}

Strategic Verification:
{json.dumps(state.strategic_verification, indent=2)}

Deep Research Brief:
{json.dumps(state.deep_research_brief, indent=2) if isinstance(state.deep_research_brief, dict) else state.deep_research_brief}

High Priority Strategic Elements Flag: {high_priority_flag}

Identify 3-5 fundamental root causes and return as JSON."""

    response, _ = call_assistant(ASSISTANTS["rootcause_analyst"], prompt)
    state.root_causes = parse_json_response(response)

    state.step_timings["rootcause_analyst"] = time.time() - start
    print(f"  ✓ Completed in {state.step_timings['rootcause_analyst']:.1f}s")

def step_10_recommendation_builder(state):
    """Node 10: AGENT - Recommendation Builder"""
    print("\n[10/15] 💡 Recommendation Builder - Developing 5-7 recommendations")
    print(f"  Agent: MEARA Recommendation Builder ({ASSISTANTS['recommendation_builder']})")

    start = time.time()

    prompt = f"""Develop strategic recommendations:

Company: {state.company_name}

Root Causes:
{json.dumps(state.root_causes, indent=2)}

Strategic Verification:
{json.dumps(state.strategic_verification, indent=2)}

Create 5-7 strategic recommendations with priority matrix. Return as JSON."""

    response, _ = call_assistant(ASSISTANTS["recommendation_builder"], prompt)
    state.recommendations = parse_json_response(response)

    state.step_timings["recommendation_builder"] = time.time() - start
    print(f"  ✓ Completed in {state.step_timings['recommendation_builder']:.1f}s")

def step_11_report_assembler(state):
    """Node 11: AGENT - Report Assembler"""
    print("\n[11/15] 📝 Report Assembler - Assembling main report")
    print(f"  Agent: MEARA Report Assembler ({ASSISTANTS['report_assembler']})")

    start = time.time()

    prompt = f"""Assemble the complete Marketing Effectiveness Analysis report:

Company: {state.company_name}
URL: {state.company_url}
Analysis Date: {datetime.now().strftime('%Y-%m-%d')}

Evidence Collection:
{json.dumps(state.evidence_collection, indent=2)}

Dimension Evaluations:
{json.dumps(state.dimension_evaluations, indent=2)}

Strategic Verification:
{json.dumps(state.strategic_verification, indent=2)}

Root Causes:
{json.dumps(state.root_causes, indent=2)}

Recommendations:
{json.dumps(state.recommendations, indent=2)}

Create the complete markdown report following the MEARA report structure."""

    response, _ = call_assistant(ASSISTANTS["report_assembler"], prompt)
    state.final_report = response

    state.step_timings["report_assembler"] = time.time() - start
    print(f"  ✓ Completed in {state.step_timings['report_assembler']:.1f}s")

def step_12_table_generator(state):
    """Node 12: AGENT - Table Generator"""
    print("\n[12/15] 📊 Table Generator - Creating 9 detailed dimension tables")
    print(f"  Agent: MEARA Table Generator ({ASSISTANTS['table_generator']})")

    start = time.time()

    prompt = f"""Generate the 9 detailed dimension analysis tables as an appendix:

Company: {state.company_name}

Dimension Evaluations:
{json.dumps(state.dimension_evaluations, indent=2)}

Evidence Collection:
{json.dumps(state.evidence_collection, indent=2)}

Create comprehensive tables for ALL 9 dimensions with sub-element ratings, qualitative assessments, and evidence citations."""

    response, _ = call_assistant(ASSISTANTS["table_generator"], prompt)

    # Append tables to final report
    state.final_report = state.final_report + "\n\n" + response

    state.step_timings["table_generator"] = time.time() - start
    print(f"  ✓ Completed in {state.step_timings['table_generator']:.1f}s")

def step_13_citation_validator(state):
    """Node 13: GUARDRAIL - Citation Validator"""
    print("\n[13/15] Citation Validator")

    # Count citations
    citation_pattern = r'\[Source:.*?\]'
    citations = re.findall(citation_pattern, state.final_report)
    citation_count = len(citations)

    print(f"  Citations found: {citation_count}")

    if citation_count < 20:
        print(f"  ⚠ Warning: Low citation count (expected 20+)")
    else:
        print(f"  ✓ Citation count acceptable")

def step_14_pii_protection(state):
    """Node 14: GUARDRAIL - PII Protection"""
    print("\n[14/15] PII Protection")

    # Simple PII redaction (email addresses)
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    redacted_report = re.sub(email_pattern, '[EMAIL REDACTED]', state.final_report)

    if redacted_report != state.final_report:
        print("  ⚠ PII detected and redacted")
        state.final_report = redacted_report
    else:
        print("  ✓ No PII detected")

def step_15_end(state):
    """Node 15: END - Analysis Complete"""
    print("\n[15/15] Analysis Complete")

    total_time = (datetime.now() - state.start_time).total_seconds()

    print(f"\n{'=' * 60}")
    print("MEARA Analysis Complete!")
    print(f"{'=' * 60}")
    print(f"Total Time: {total_time:.1f}s ({total_time/60:.1f} minutes)")
    print(f"\nStep Timings:")
    for step, duration in state.step_timings.items():
        print(f"  {step}: {duration:.1f}s")

def save_results(state, output_dir=None):
    """Save analysis results to files"""
    # Default to parent directory (meara root) if not specified
    if output_dir is None:
        output_dir = Path(__file__).parent.parent / "analysis_results"
    else:
        output_dir = Path(output_dir)

    output_dir.mkdir(exist_ok=True)

    # Sanitize company name for filename
    safe_name = re.sub(r'[^a-zA-Z0-9_-]', '_', state.company_name)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')

    # Save final report
    report_file = output_dir / f"{safe_name}_{timestamp}_report.md"
    with open(report_file, "w") as f:
        f.write(state.final_report)

    # Save full state as JSON
    state_file = output_dir / f"{safe_name}_{timestamp}_state.json"
    with open(state_file, "w") as f:
        json.dump(state.to_dict(), f, indent=2)

    print(f"\n📁 Results saved:")
    print(f"  Report: {report_file}")
    print(f"  State: {state_file}")

    return report_file

def run_meara_workflow(company_name, company_url, deep_research_brief=None):
    """Execute the complete MEARA workflow"""

    print("=" * 60)
    print("MEARA Marketing Effectiveness Analysis")
    print("=" * 60)

    # Initialize state
    state = WorkflowState(company_name, company_url, deep_research_brief)

    # Execute workflow nodes
    step_01_input_collection(state)

    has_drb = step_02_drb_check(state)

    if not has_drb:
        step_03_research_agent(state)

    step_04_evidence_collector(state)
    step_05_dimension_evaluator(state)
    step_06_strategic_framework_search(state)
    step_07_strategic_verifier(state)

    high_priority = step_08_strategic_priority_check(state)

    step_09_rootcause_analyst(state, high_priority)
    step_10_recommendation_builder(state)
    step_11_report_assembler(state)
    step_12_table_generator(state)
    step_13_citation_validator(state)
    step_14_pii_protection(state)
    step_15_end(state)

    # Save results
    report_file = save_results(state)

    return state, report_file

if __name__ == "__main__":
    # Example usage
    import sys
    import argparse

    parser = argparse.ArgumentParser(
        description="Run MEARA Marketing Effectiveness Analysis",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Run with company info only (Research Agent will create DRB)
  python 3_orchestrate_workflow.py --company "Acme Corp" --url "https://acme.com"

  # Run with single DRB file (supports .txt, .md, .pdf, .docx)
  python 3_orchestrate_workflow.py --company "Acme Corp" --url "https://acme.com" --drb drb.pdf

  # Run with directory of context docs (supports .txt, .md, .pdf, .docx, .doc)
  python 3_orchestrate_workflow.py --company "Acme Corp" --url "https://acme.com" --context-dir ./docs/

Supported Document Formats:
  - Text: .txt, .md, .markdown
  - PDF: .pdf (requires: pip install pypdf)
  - Word: .docx, .doc (requires: pip install python-docx)
        """
    )

    parser.add_argument("-c", "--company", required=True, help="Company name")
    parser.add_argument("-u", "--url", required=True, help="Company URL")
    parser.add_argument("-d", "--drb", help="Path to Deep Research Brief file")
    parser.add_argument(
        "--context-dir",
        help="Directory containing DRB and other context documents (.txt, .md files)"
    )

    args = parser.parse_args()

    drb = None

    # Load DRB from directory or single file
    if args.context_dir:
        context_path = Path(args.context_dir)
        if not context_path.exists():
            print(f"❌ Error: Context directory does not exist: {context_path}")
            sys.exit(1)

        if not context_path.is_dir():
            print(f"❌ Error: Path is not a directory: {context_path}")
            sys.exit(1)

        # Load all supported document files
        supported_extensions = ['*.txt', '*.md', '*.markdown', '*.pdf', '*.docx', '*.doc']
        context_files = []
        for ext in supported_extensions:
            context_files.extend(context_path.glob(ext))

        if not context_files:
            print(f"❌ Error: No supported document files found in: {context_path}")
            print(f"   Supported formats: .txt, .md, .pdf, .docx, .doc")
            sys.exit(1)

        print(f"\n📂 Loading context from {len(context_files)} file(s):")
        for f in context_files:
            print(f"  - {f.name} ({f.suffix})")

        # Combine all context files with separators
        drb_parts = []
        for context_file in sorted(context_files):
            content = read_document(context_file)
            drb_parts.append(f"=== {context_file.name} ===\n\n{content}")

        drb = "\n\n".join(drb_parts)
        print(f"\n✓ Loaded {len(drb):,} characters of context\n")

    elif args.drb:
        drb_file = Path(args.drb)
        if not drb_file.exists():
            print(f"❌ Error: DRB file does not exist: {drb_file}")
            sys.exit(1)

        drb = read_document(drb_file)
        print(f"\n✓ Loaded DRB from {drb_file.name} ({drb_file.suffix})\n")
        print(f"  {len(drb):,} characters\n")

    state, report_file = run_meara_workflow(args.company, args.url, drb)

    print(f"\n✅ Analysis complete! View report at: {report_file}")
