#!/usr/bin/env python3
"""
Update Vector Store with v6.0 Framework Documents (Corrected Terminology)
- Corrects "Assessment" → "Analysis" throughout framework
"""

import os
from pathlib import Path
from openai import OpenAI

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# MEARA framework documents (v6.0 - corrected)
MEARA_DOCS_DIR = Path(__file__).parent.parent / "meara_doc_modules_v6"
FRAMEWORK_FILES = [
    "GTM_Scalability_System_Instructions.md",
    "Instruct_Executive_Summary.md",
    "Instruct_Marketing_Analysis.md",
    "Marketing_Analysis_Methodology.md",
    "Marketing_Analysis_Rubrics.md",
    "Strategic_Elements_Framework.md",
    "Prompt_for_DeepR_B2B_SaaS_Marketing_Insights.md"
]

def main():
    print("=" * 80)
    print("MEARA v6.0 Vector Store Update (Corrected: Assessment → Analysis)")
    print("=" * 80)

    # Upload files
    file_ids = []
    print(f"\n📁 Uploading {len(FRAMEWORK_FILES)} framework documents...")

    for filename in FRAMEWORK_FILES:
        filepath = MEARA_DOCS_DIR / filename
        if not filepath.exists():
            print(f"❌ ERROR: Missing file: {filepath}")
            return

        print(f"   Uploading: {filename}...", end=" ")
        with open(filepath, "rb") as f:
            file_obj = client.files.create(file=f, purpose="assistants")
            file_ids.append(file_obj.id)
            print(f"✅ {file_obj.id}")

    # Create vector store (using older API)
    print(f"\n🔧 Creating vector store...")
    try:
        # Try newer API first
        vector_store = client.beta.vector_stores.create(
            name="MEARA Framework v6.0 (Corrected Terminology)",
            file_ids=file_ids
        )
        print(f"✅ Vector store created: {vector_store.id}")
    except AttributeError:
        # Fall back to manual approach - files are uploaded, user needs to create vector store in UI
        print(f"⚠️  OpenAI library version doesn't support vector_stores.create()")
        print(f"✅ Files uploaded successfully. Create vector store manually in OpenAI dashboard.")
        print(f"\nUploaded file IDs:")
        for filename, file_id in zip(FRAMEWORK_FILES, file_ids):
            print(f"   - {file_id} ({filename})")

        # Save just the file IDs for manual vector store creation
        config_path = Path(__file__).parent / "vector_store_config.txt"
        with open(config_path, "w") as f:
            f.write("# MANUAL VECTOR STORE CREATION NEEDED\n")
            f.write("# Go to OpenAI dashboard and create vector store with these files:\n\n")
            for filename, file_id in zip(FRAMEWORK_FILES, file_ids):
                f.write(f"# {filename}: {file_id}\n")

        print(f"\n📝 File IDs saved to: {config_path}")
        print("\nNext steps:")
        print("1. Go to https://platform.openai.com/storage/vector_stores")
        print("2. Create new vector store with name: 'MEARA Framework v6.0 (Corrected Terminology)'")
        print("3. Add the uploaded files (IDs listed above)")
        print("4. Update assistant_config.json with new vector store ID")
        return

    # Save config
    config_path = Path(__file__).parent / "vector_store_config.txt"
    with open(config_path, "w") as f:
        f.write(f"VECTOR_STORE_ID={vector_store.id}\n\n")
        f.write("# Uploaded Files:\n")
        for filename, file_id in zip(FRAMEWORK_FILES, file_ids):
            f.write(f"# {filename}: {file_id} (completed)\n")

    print(f"\n📝 Configuration saved to: {config_path}")
    print(f"\n✅ Next step: Update assistant_config.json with new vector store ID")
    print(f"   Vector Store ID: {vector_store.id}")
    print("\n" + "=" * 80)

if __name__ == "__main__":
    main()
