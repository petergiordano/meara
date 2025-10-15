# Vercel Deployment Guide

## Quick Deploy

### Step 1: Deploy Railway Backend

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Select your MEARA project
3. Railway should auto-deploy from the `master` branch
4. Wait for deployment to complete
5. Copy the Railway backend URL (e.g., `https://meara-backend.railway.app`)

**Required Environment Variables on Railway:**
- `OPENAI_API_KEY` - Your OpenAI API key
- `PORT` - Auto-set by Railway (usually 8000)

### Step 2: Deploy Vercel Frontend

#### Option A: Deploy via Vercel CLI
```bash
cd /Users/petergiordano/Documents/GitHub/meara/deploy/vercel_frontend
vercel --prod
```

#### Option B: Deploy via Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import from GitHub: `petergiordano/meara`
4. Set Root Directory: `deploy/vercel_frontend`
5. Framework Preset: Next.js
6. Click "Deploy"

### Step 3: Configure Environment Variables on Vercel

After deployment, add this environment variable:

**Variable Name**: `NEXT_PUBLIC_RAILWAY_API`
**Value**: Your Railway backend URL (e.g., `https://meara-backend.railway.app`)
**Environment**: Production

To add:
1. Go to Project Settings → Environment Variables
2. Add `NEXT_PUBLIC_RAILWAY_API`
3. Redeploy (or Vercel will auto-deploy)

### Step 4: Update CORS on Railway Backend

Edit `deploy/railway_backend/main.py` line 28 to include your Vercel URL:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-vercel-app.vercel.app",  # ← UPDATE THIS
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Commit and push to trigger Railway redeploy:
```bash
git add deploy/railway_backend/main.py
git commit -m "Update CORS for Vercel domain"
git push origin master
```

## Testing the Deployment

### Test Sprint S.1 Features

1. **Visit your Vercel app** (e.g., `https://meara.vercel.app`)
2. **Enter company details**:
   - Company Name: "Test Company"
   - Company URL: "https://example.com"
   - Upload a DRB file (optional): `.pdf`, `.txt`, `.md`, `.doc`, `.docx`
3. **Click "Analyze website"**
4. **Wait for DeepStack to complete** (~2-3 minutes)
5. **Verify results page shows**:
   - ✅ "Website analysis complete!" heading
   - ✅ "What we collected" preview section
   - ✅ Two action cards side-by-side
   - ✅ "Download results" button (downloads JSON)
   - ✅ "Continue to full analysis" button (shows placeholder alert)
   - ✅ Data preview (scrollable JSON)
   - ✅ "Analyze another website" button at bottom

### Test Backend Endpoints

```bash
# Replace with your Railway URL
BACKEND_URL="https://meara-backend.railway.app"

# 1. Health check
curl $BACKEND_URL/health

# 2. List jobs
curl $BACKEND_URL/api/jobs

# 3. Check specific job (replace JOB_ID)
curl $BACKEND_URL/api/status/JOB_ID
```

## Architecture Overview

```
User Browser
    ↓
Vercel Frontend (Next.js)
    ↓ HTTP requests
Railway Backend (FastAPI)
    ↓
DeepStack Collector (Playwright)
    ↓ (Future: Sprint L.1)
MEARA Orchestrator
    ↓
OpenAI Assistants API (7 agents)
```

## Current Features (Sprint S.1)

✅ **DeepStack Collector**: Analyze website, return JSON
✅ **File Upload**: Upload Deep Research Brief (.pdf, .txt, .md, .doc, .docx)
✅ **Results UI**: Beautiful two-column action layout
✅ **Continue Button**: Placeholder for Sprint L.1 (shows alert)

## Coming Next (Sprint L.1)

🚧 **Full Analysis**: "Continue to Full Analysis" button will:
- Call `/api/analyze/full` endpoint
- Show multi-stage progress (5 stages, 15 steps)
- Run 7 OpenAI Assistants
- Generate comprehensive markdown report
- Display report viewer with download options

## Troubleshooting

### CORS Errors
**Problem**: `Access to fetch at 'https://...' from origin 'https://...' has been blocked by CORS`
**Solution**: Update `allow_origins` in `main.py` to include your Vercel domain

### 404 Not Found
**Problem**: Frontend shows "Failed to start analysis"
**Solution**: Check `NEXT_PUBLIC_RAILWAY_API` environment variable is set correctly on Vercel

### OpenAI Errors (Sprint L.1)
**Problem**: "Analysis failed: OpenAI API key not found"
**Solution**: Add `OPENAI_API_KEY` environment variable on Railway

### File Upload Fails
**Problem**: "Analysis failed: multipart/form-data error"
**Solution**: Ensure `python-multipart==0.0.9` is in Railway `requirements.txt`

## Deployment Checklist

- [ ] Railway backend deployed with latest code
- [ ] `OPENAI_API_KEY` set on Railway
- [ ] Vercel frontend deployed from `deploy/vercel_frontend`
- [ ] `NEXT_PUBLIC_RAILWAY_API` set on Vercel (Railway URL)
- [ ] CORS updated with Vercel domain
- [ ] Test: Enter company + URL, analyze works
- [ ] Test: File upload works (optional)
- [ ] Test: Results page displays correctly
- [ ] Test: "Download JSON" button works
- [ ] Test: "Continue to Full Analysis" shows alert (Sprint L.1 coming)

## URLs to Update

**Replace these placeholder URLs:**

1. **Railway backend**: `main.py` line 28
   - Current: `"https://your-app.vercel.app"`
   - Replace with: Your actual Vercel URL

2. **Vercel environment variable**:
   - Variable: `NEXT_PUBLIC_RAILWAY_API`
   - Value: Your actual Railway URL

## Support

If you encounter issues:
1. Check Railway logs for backend errors
2. Check Vercel logs for frontend errors
3. Check browser console for CORS/network errors
4. Verify environment variables are set correctly
