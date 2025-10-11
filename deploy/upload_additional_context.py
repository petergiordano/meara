#!/usr/bin/env python3
"""
Upload Additional Context Documents to MEARA Vector Store
"""

import os
from openai import OpenAI
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv(Path(__file__).parent.parent / ".env")

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Vector Store ID
VECTOR_STORE_ID = "vs_68e95e3ceca08191a9bd1c3f4ba72977"

# Additional context files
CONTEXT_DIR = Path(__file__).parent.parent / "additional_context"
CONTEXT_FILES = [
    "GGWP Community Copilot.pdf",
    "ggwp_Investment memo_gdoc.pdf",
    "GGWP-Deep-Research-Brief-for-GTM-Scalability.pdf"
]

def upload_context_documents():
    """Upload additional context documents to vector store"""
    print("=" * 60)
    print("Uploading Additional Context to MEARA Vector Store")
    print("=" * 60)
    print(f"\nVector Store: {VECTOR_STORE_ID}\n")

    uploaded_files = []

    for filename in CONTEXT_FILES:
        file_path = CONTEXT_DIR / filename

        if not file_path.exists():
            print(f"✗ File not found: {filename}")
            continue

        print(f"  Uploading: {filename}...", end=" ")

        try:
            with open(file_path, "rb") as f:
                file_batch = client.vector_stores.files.upload_and_poll(
                    vector_store_id=VECTOR_STORE_ID,
                    file=f
                )

            uploaded_files.append({
                "filename": filename,
                "file_id": file_batch.id,
                "status": file_batch.status
            })
            print(f"✓ {file_batch.id}")

        except Exception as e:
            print(f"✗ Error: {e}")

    print(f"\n{'=' * 60}")
    print(f"✓ Uploaded {len(uploaded_files)}/{len(CONTEXT_FILES)} files")
    print(f"{'=' * 60}\n")

    # Verify vector store
    vector_store = client.vector_stores.retrieve(VECTOR_STORE_ID)
    print(f"Vector Store Status:")
    print(f"  Total files: {vector_store.file_counts.total}")
    print(f"  Completed: {vector_store.file_counts.completed}")
    print(f"  In progress: {vector_store.file_counts.in_progress}")
    print(f"  Failed: {vector_store.file_counts.failed}")

    print("\n" + "=" * 60)
    print("✅ Additional context uploaded!")
    print("All assistants can now access these documents.")
    print("=" * 60)

if __name__ == "__main__":
    upload_context_documents()
