"""
Test Ground Truth Report Generation
Tests the new Ground Truth Analyst assistant with GGWP data
"""

import json
from pathlib import Path
from openai import OpenAI
import os
import time

# Initialize OpenAI client with v2 beta header
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    default_headers={"OpenAI-Beta": "assistants=v2"}
)

# Load assistant config
config_path = Path("assistant_config.json")
with open(config_path) as f:
    config = json.load(f)

# Get Ground Truth Analyst ID
ground_truth_assistant_id = None
for assistant in config["assistants"]:
    if assistant["key"] == "ground_truth_analyst":
        ground_truth_assistant_id = assistant["assistant_id"]
        break

if not ground_truth_assistant_id:
    print("❌ Ground Truth Analyst not found in config!")
    exit(1)

print(f"✓ Found Ground Truth Analyst: {ground_truth_assistant_id}")

# Load GGWP DeepStack JSON
deepstack_file = Path("railway_backend/output/deepstack_output-ggwp.com.json")
with open(deepstack_file) as f:
    deepstack_data = json.load(f)

print(f"✓ Loaded DeepStack data: {deepstack_file.name}")

# Create prompt
company_name = "GGWP"
company_url = "https://www.ggwp.com"

prompt = f"""Analyze the DeepStack Collector JSON output and generate a comprehensive Ground Truth Client-Side Digital Footprint Analysis (L3 Report).

Company Name: {company_name}
Company URL: {company_url}

DeepStack Collector JSON:
{json.dumps(deepstack_data, indent=2)}

Generate the complete L3 Ground Truth Report following the exact format specified in your instructions."""

print("\n" + "=" * 60)
print("Starting Ground Truth Report Generation")
print("=" * 60)

# Create thread
thread = client.beta.threads.create()
print(f"✓ Created thread: {thread.id}")

# Add message
message = client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content=prompt
)
print(f"✓ Added message to thread")

# Run assistant
run = client.beta.threads.runs.create(
    thread_id=thread.id,
    assistant_id=ground_truth_assistant_id
)
print(f"✓ Started run: {run.id}")

# Wait for completion
start_time = time.time()
while run.status in ["queued", "in_progress"]:
    time.sleep(2)
    run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)
    elapsed = time.time() - start_time
    print(f"  Status: {run.status} (elapsed: {elapsed:.1f}s)")

if run.status == "completed":
    # Get response
    messages = client.beta.threads.messages.list(thread_id=thread.id)
    response = messages.data[0].content[0].text.value

    print("\n" + "=" * 60)
    print("✓ Ground Truth Report Generated Successfully!")
    print("=" * 60)

    # Save to file
    output_dir = Path("railway_backend/analysis_results")
    output_dir.mkdir(exist_ok=True)

    output_file = output_dir / f"{company_name}_test_ground_truth.md"
    with open(output_file, "w") as f:
        f.write(response)

    print(f"\n📄 Report saved to: {output_file}")
    print(f"\n📊 Report length: {len(response)} characters")
    print(f"⏱️  Total time: {time.time() - start_time:.1f}s")

    # Show preview
    print("\n" + "=" * 60)
    print("Preview (first 500 characters):")
    print("=" * 60)
    print(response[:500] + "...")

else:
    print(f"\n❌ Run failed with status: {run.status}")
    if run.last_error:
        print(f"Error: {run.last_error}")
