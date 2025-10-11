#!/usr/bin/env python3
"""
MEARA Vector Store Setup Script
Creates and populates vector store with MEARA framework documents
"""

import os
from openai import OpenAI
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(Path(__file__).parent.parent / ".env")

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# MEARA framework documents
MEARA_DOCS_DIR = Path(__file__).parent.parent / "meara_doc_modules"
FRAMEWORK_FILES = [
    "MEARA_System_Instructions.md",
    "Instruct_Executive_Summary.md",
    "Instruct_Marketing_Analysis.md",
    "Marketing_Analysis_Methodology.md",
    "Marketing_Analysis_Rubrics.md",
    "Strategic_Elements_Framework.md",
    "Scale_Brand_Design_and_Color_Palette_Guidelines.md",
    "Prompt_for_DeepR_B2B_SaaS_Marketing_Insights.md"
]

def create_vector_store():
    """Create vector store with optimal chunking strategy"""
    print("Creating MEARA vector store...")

    vector_store = client.vector_stores.create(
        name="MEARA_Framework_Knowledge",
        chunking_strategy={
            "type": "static",
            "static": {
                "max_chunk_size_tokens": 800,
                "chunk_overlap_tokens": 400
            }
        }
    )

    print(f"✓ Vector store created: {vector_store.id}")
    return vector_store.id

def upload_documents(vector_store_id):
    """Upload all MEARA framework documents to vector store"""
    print("\nUploading framework documents...")

    uploaded_files = []

    for filename in FRAMEWORK_FILES:
        file_path = MEARA_DOCS_DIR / filename

        if not file_path.exists():
            print(f"✗ File not found: {file_path}")
            continue

        print(f"  Uploading: {filename}...", end=" ")

        try:
            with open(file_path, "rb") as f:
                file_batch = client.vector_stores.files.upload_and_poll(
                    vector_store_id=vector_store_id,
                    file=f
                )

            uploaded_files.append({
                "filename": filename,
                "file_id": file_batch.id,
                "status": file_batch.status
            })
            print("✓")

        except Exception as e:
            print(f"✗ Error: {e}")

    return uploaded_files

def verify_vector_store(vector_store_id):
    """Verify vector store is ready for use"""
    print("\nVerifying vector store...")

    vector_store = client.vector_stores.retrieve(vector_store_id)

    print(f"  Name: {vector_store.name}")
    print(f"  Status: {vector_store.status}")
    print(f"  File counts: {vector_store.file_counts}")

    if vector_store.status == "completed":
        print("✓ Vector store is ready!")
        return True
    else:
        print("✗ Vector store not ready yet")
        return False

def save_config(vector_store_id, uploaded_files):
    """Save vector store configuration for deployment script"""
    config_path = Path(__file__).parent / "vector_store_config.txt"

    with open(config_path, "w") as f:
        f.write(f"VECTOR_STORE_ID={vector_store_id}\n")
        f.write("\n# Uploaded Files:\n")
        for file_info in uploaded_files:
            f.write(f"# {file_info['filename']}: {file_info['file_id']} ({file_info['status']})\n")

    print(f"\n✓ Configuration saved to: {config_path}")
    print(f"\nVector Store ID: {vector_store_id}")
    print("\nAdd this to your deployment script:")
    print(f"VECTOR_STORE_ID = '{vector_store_id}'")

def main():
    print("=" * 60)
    print("MEARA Framework - Vector Store Setup")
    print("=" * 60)

    # Step 1: Create vector store
    vector_store_id = create_vector_store()

    # Step 2: Upload documents
    uploaded_files = upload_documents(vector_store_id)

    # Step 3: Verify setup
    if verify_vector_store(vector_store_id):
        # Step 4: Save configuration
        save_config(vector_store_id, uploaded_files)

        print("\n" + "=" * 60)
        print("Setup complete! Next steps:")
        print("1. Copy the VECTOR_STORE_ID above")
        print("2. Run: python 2_deploy_workflow.py")
        print("=" * 60)
    else:
        print("\n⚠ Vector store not ready. Wait a few moments and check status.")

if __name__ == "__main__":
    main()
