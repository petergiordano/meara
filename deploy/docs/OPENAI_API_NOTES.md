# OpenAI Python SDK Version Notes

## Vector Stores API Change

### Issue
The OpenAI Python SDK version 2.x removed the `client.beta.vector_stores` API that was available in 1.x versions. This causes `AttributeError: 'Beta' object has no attribute 'vector_stores'` when trying to use the Python SDK to manage vector stores.

### Root Cause
OpenAI deprecated the standalone vector stores API in favor of integrating file search directly into the Assistants API. The Python SDK 2.x reflects this architectural change.

### Solution
Use the OpenAI REST API directly via curl for vector store operations:

```bash
# Create vector store
curl https://api.openai.com/v1/vector_stores \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{"name": "Vector Store Name"}'

# Attach file to vector store
curl https://api.openai.com/v1/vector_stores/{vector_store_id}/files \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{"file_id": "file-xxx"}'
```

### Current Environment
- **Global Python:** openai==2.3.0
- **Backend venv:** openai==2.3.0 (upgraded Oct 15, 2025)
- **Vector Store Operations:** Use REST API via curl

### Impact on MEARA
- ✅ File uploads work fine with Python SDK
- ✅ Assistant creation/updates work fine with Python SDK
- ⚠️ Vector store creation/file attachment requires REST API
- ✅ All assistants can still use vector stores for file search

### Scripts Updated
- `update_vector_store_v6.py` - Falls back to manual instructions if Python API unavailable
- `attach_files_to_vector_store.py` - Uses REST API via curl

### Recommendation
For future vector store operations in this project, continue using the REST API via curl until OpenAI provides a new Python SDK interface for vector stores, or use the manual OpenAI dashboard approach.

## References
- OpenAI API Documentation: https://platform.openai.com/docs/api-reference/vector-stores
- Python SDK Migration Guide: https://github.com/openai/openai-python/blob/main/MIGRATION.md
