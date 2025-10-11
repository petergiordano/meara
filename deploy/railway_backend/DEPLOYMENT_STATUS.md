# Railway Backend Deployment Status

## ✅ Files Created (Ready for Deployment)

| File | Purpose | Status |
|------|---------|--------|
| `main.py` | FastAPI backend with DeepStack integration | ✅ Ready |
| `requirements.txt` | Python dependencies | ✅ Ready |
| `Procfile` | Railway deployment configuration | ✅ Ready |
| `railway.json` | Railway build/deploy settings | ✅ Ready |
| `.env.example` | Environment variable template | ✅ Ready |
| `.gitignore` | Git ignore patterns | ✅ Ready |
| `setup.sh` | Local setup automation script | ✅ Ready |
| `test_api.sh` | API testing script | ✅ Ready |
| `README.md` | Complete documentation | ✅ Ready |

## 🎯 What This Solves

**The Lynchpin Problem:** DeepStack Collector needs to run in the cloud with browser automation (Playwright), which cannot work in Vercel's serverless environment.

**Solution:** Railway provides a persistent backend service where:
- ✅ Playwright can run with full browser
- ✅ Long-running processes (5+ minutes) are supported
- ✅ Background tasks work reliably
- ✅ No cold start issues
- ✅ Proper handling of web scraping from cloud IPs

## 🚀 Quick Start

### Local Testing (Recommended First)

```bash
# 1. Navigate to directory
cd /Users/petergiordano/Documents/GitHub/meara/deploy/railway_backend

# 2. Run setup script
./setup.sh

# 3. Activate virtual environment
source venv/bin/activate

# 4. Start server
python3 main.py

# 5. Test API (in another terminal)
./test_api.sh
```

### Deploy to Railway

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
railway init

# 4. Deploy
railway up

# 5. Get public URL
railway domain
```

Your API will be live at: `https://[your-project].railway.app`

## 📡 API Endpoints

### Core Endpoints

1. **POST /api/analyze** - Start analysis
   - Returns `job_id` immediately
   - Analysis runs in background

2. **GET /api/status/{job_id}** - Check progress
   - Poll this endpoint every 2-5 seconds
   - Returns status: `queued`, `running`, `completed`, `failed`

3. **GET /api/results/{job_id}** - Get results
   - Returns complete DeepStack JSON
   - Only available when status = `completed`

### Health Endpoints

4. **GET /** - Simple health check
5. **GET /health** - Detailed status
6. **GET /api/jobs** - List all jobs (debugging)

## 🔗 Integration with Vercel Frontend

Once Railway backend is deployed, create Vercel frontend that:

```javascript
// Example frontend integration
const RAILWAY_API = 'https://your-app.railway.app'

// 1. Start analysis
const response = await fetch(`${RAILWAY_API}/api/analyze`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    company_name: 'Acme Corp',
    company_url: 'https://acme.com'
  })
})

const { job_id } = await response.json()

// 2. Poll for status
const interval = setInterval(async () => {
  const statusRes = await fetch(`${RAILWAY_API}/api/status/${job_id}`)
  const { status, progress } = await statusRes.json()

  if (status === 'completed') {
    clearInterval(interval)
    fetchResults(job_id)
  }
}, 2000)

// 3. Get results
const fetchResults = async (job_id) => {
  const resultsRes = await fetch(`${RAILWAY_API}/api/results/${job_id}`)
  const data = await resultsRes.json()
  displayResults(data.result)
}
```

## 💰 Cost Estimate

### Railway Pricing
- **Starter Plan:** $5/month
  - 512 MB RAM, 1 vCPU
  - 5 GB storage
  - Suitable for testing and low volume

- **Pro Plan:** $20/month
  - 8 GB RAM, 4 vCPU
  - 100 GB storage
  - Needed for higher volume (40+ analyses/month)

### Resource Usage Per Analysis
- **CPU:** ~30-60 seconds active processing
- **Memory:** ~200-400 MB peak
- **Storage:** ~500 KB per result JSON
- **Network:** ~5-10 MB per analysis

**Estimated Capacity:**
- Starter: 20-30 analyses/month
- Pro: 100+ analyses/month

## ⚠️ Important Configuration

### CORS Origins

Before deploying, update `main.py` line 23 with your Vercel URL:

```python
allow_origins=[
    "https://your-actual-app.vercel.app",  # ← Update this!
    "http://localhost:3000",
],
```

### DeepStack Code

The backend expects DeepStack Collector code to be present:
- `deepstack.py` in root directory
- `src/` directory with DeepStack modules

**Setup automatically copies these** if DeepStack is at:
`/Users/petergiordano/Documents/GitHub/deepstack`

## 🐛 Troubleshooting

### Local Testing Issues

**Issue:** `ModuleNotFoundError: No module named 'fastapi'`
- **Fix:** Run `./setup.sh` to install dependencies

**Issue:** `deepstack.py not found`
- **Fix:** Copy DeepStack code: `cp ../../deepstack/deepstack.py .`

**Issue:** Playwright browser not found
- **Fix:** Run `playwright install chromium`

### Railway Deployment Issues

**Issue:** Build fails with "Playwright install failed"
- **Fix:** Check `railway.json` includes Playwright installation

**Issue:** API returns 500 errors
- **Fix:** Check Railway logs: `railway logs`

**Issue:** CORS errors from Vercel frontend
- **Fix:** Update `allow_origins` in `main.py` with Vercel URL

## 📊 Testing Results

Run `./test_api.sh` to verify the API is working correctly.

**Expected output:**
```
✅ Root endpoint responding
✅ Health endpoint responding
✅ Analysis started with job_id: [uuid]
✅ Analysis completed!
✅ Results saved to test_results_[uuid].json
✅ All tests passed!
```

## 🎯 Next Steps

1. ✅ **Test locally** - Run `./setup.sh` and `python3 main.py`
2. ✅ **Verify API works** - Run `./test_api.sh`
3. ⏭️ **Deploy to Railway** - Run `railway up`
4. ⏭️ **Get public URL** - Run `railway domain`
5. ⏭️ **Create Vercel frontend** - See `vercel_deployment_plan.md`
6. ⏭️ **Connect frontend to backend** - Update CORS and API URL
7. ⏭️ **Test end-to-end** - Submit analysis from Vercel UI

## 🔗 Related Documentation

- [Railway Documentation](https://docs.railway.app)
- [Vercel Deployment Plan](../vercel_deployment_plan.md)
- [DeepStack Workflow](../../deepstack-workflow/README.md)
- [API Implementation Plan](../../deepstack-workflow/API_IMPLEMENTATION_PLAN.md)

---

**Status:** ✅ Backend ready for local testing and Railway deployment
**Purpose:** Solves the cloud website scraping challenge (lynchpin piece)
**Next:** Deploy to Railway and create Vercel frontend
