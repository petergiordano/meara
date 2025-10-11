#!/bin/bash

# Test script for Railway Backend API
# Tests all endpoints to verify the backend is working correctly

set -e

API_BASE="${API_BASE:-http://localhost:8000}"
COMPANY_NAME="GGWP"
COMPANY_URL="https://ggwp.com"

echo "🧪 Testing Railway Backend API at $API_BASE"
echo ""

# Test 1: Health check
echo "1️⃣  Testing root endpoint..."
curl -s "$API_BASE/" | jq '.'
echo "   ✅ Root endpoint responding"
echo ""

# Test 2: Detailed health
echo "2️⃣  Testing health endpoint..."
curl -s "$API_BASE/health" | jq '.'
echo "   ✅ Health endpoint responding"
echo ""

# Test 3: Start analysis
echo "3️⃣  Starting analysis for $COMPANY_NAME..."
RESPONSE=$(curl -s -X POST "$API_BASE/api/analyze" \
  -H "Content-Type: application/json" \
  -d "{
    \"company_name\": \"$COMPANY_NAME\",
    \"company_url\": \"$COMPANY_URL\"
  }")

echo "$RESPONSE" | jq '.'

JOB_ID=$(echo "$RESPONSE" | jq -r '.job_id')
echo "   ✅ Analysis started with job_id: $JOB_ID"
echo ""

# Test 4: Check status
echo "4️⃣  Checking job status..."
sleep 2  # Wait a moment
STATUS_RESPONSE=$(curl -s "$API_BASE/api/status/$JOB_ID")
echo "$STATUS_RESPONSE" | jq '.'

STATUS=$(echo "$STATUS_RESPONSE" | jq -r '.status')
PROGRESS=$(echo "$STATUS_RESPONSE" | jq -r '.progress')
echo "   ℹ️  Status: $STATUS, Progress: $PROGRESS%"
echo ""

# Test 5: Poll until complete (with timeout)
echo "5️⃣  Polling for completion (timeout: 5 minutes)..."
TIMEOUT=300  # 5 minutes
ELAPSED=0
POLL_INTERVAL=5

while [ $ELAPSED -lt $TIMEOUT ]; do
    STATUS_RESPONSE=$(curl -s "$API_BASE/api/status/$JOB_ID")
    STATUS=$(echo "$STATUS_RESPONSE" | jq -r '.status')
    PROGRESS=$(echo "$STATUS_RESPONSE" | jq -r '.progress')

    echo "   ⏳ Status: $STATUS, Progress: $PROGRESS%"

    if [ "$STATUS" = "completed" ]; then
        echo "   ✅ Analysis completed!"
        break
    elif [ "$STATUS" = "failed" ]; then
        echo "   ❌ Analysis failed:"
        echo "$STATUS_RESPONSE" | jq '.error'
        exit 1
    fi

    sleep $POLL_INTERVAL
    ELAPSED=$((ELAPSED + POLL_INTERVAL))
done

if [ $ELAPSED -ge $TIMEOUT ]; then
    echo "   ⚠️  Timeout reached after $TIMEOUT seconds"
    exit 1
fi

echo ""

# Test 6: Get results
echo "6️⃣  Fetching results..."
RESULTS=$(curl -s "$API_BASE/api/results/$JOB_ID")

# Save results to file
RESULTS_FILE="test_results_${JOB_ID}.json"
echo "$RESULTS" > "$RESULTS_FILE"
echo "   ✅ Results saved to $RESULTS_FILE"

# Show summary
echo ""
echo "📊 Results Summary:"
echo "$RESULTS" | jq '{
  job_id: .job_id,
  company_name: .company_name,
  company_url: .company_url,
  has_result: (.result != null),
  marketing_tech_detected: (.result.data.marketing_technology_data_foundation.detected_martech_providers | length),
  page_title: .result.url_analysis_results.page_title
}'

echo ""
echo "✅ All tests passed!"
echo ""
echo "📋 Next steps:"
echo "   - Review results in $RESULTS_FILE"
echo "   - Deploy to Railway: railway up"
echo "   - Get public URL: railway domain"
