#!/usr/bin/env python3
"""
Attach uploaded files to existing vector store
"""

import os
from openai import OpenAI

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Vector store ID from the screenshot
VECTOR_STORE_ID = "vs_68efa40c37508191a9d78c326a2e1c3e"

# File IDs that were uploaded
FILE_IDS = [
    "file-VoFM7EVcmQH5kwua1hRJe3",  # GTM_Scalability_System_Instructions.md
    "file-JhEVh9Jo44JHYjxex7zsoY",  # Instruct_Executive_Summary.md
    "file-4M5U3L7yPJaJQxbcDMMysz",  # Instruct_Marketing_Analysis.md
    "file-1DSgsW3oW4sVaY98pV5XkQ",  # Marketing_Analysis_Methodology.md
    "file-PLRCLUWrpKspE6Zf9C2Tit",  # Marketing_Analysis_Rubrics.md
    "file-7MbAs9fa2K98qNVeGoEoSt",  # Strategic_Elements_Framework.md
    "file-2St6NFoHPTxkqRphPAbiRM",  # Prompt_for_DeepR_B2B_SaaS_Marketing_Insights.md
]

def main():
    print("=" * 80)
    print("Attaching files to MEARA Framework v6.0 Vector Store")
    print("=" * 80)
    print(f"\nVector Store ID: {VECTOR_STORE_ID}")
    print(f"Files to attach: {len(FILE_IDS)}")

    # Attach files one by one
    print(f"\n📎 Attaching files...")
    for file_id in FILE_IDS:
        try:
            # Attach file to vector store
            vector_store_file = client.beta.vector_stores.files.create(
                vector_store_id=VECTOR_STORE_ID,
                file_id=file_id
            )
            print(f"   ✅ Attached: {file_id}")
        except Exception as e:
            print(f"   ❌ Error attaching {file_id}: {e}")

    print(f"\n✅ Files attached to vector store!")
    print(f"\nNext step: Update assistant_config.json with vector store ID:")
    print(f"   {VECTOR_STORE_ID}")
    print("\n" + "=" * 80)

if __name__ == "__main__":
    main()
