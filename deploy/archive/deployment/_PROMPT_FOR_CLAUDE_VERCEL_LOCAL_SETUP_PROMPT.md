# Vercel Local Testing Environment Setup - Claude Code Prompt

**Context:** You are Claude Code AI helping set up a local Vercel test environment for the MEARA website analysis tool.

**Reference Documents:**
- Complete testing guide: `/Users/petergiordano/Documents/GitHub/meara/deploy/CLAUDE_CODE_TESTING_GUIDE.md`
- Quick start: `/Users/petergiordano/Documents/GitHub/meara/deploy/QUICK_START_TESTING.md`
- Architecture: `/Users/petergiordano/Documents/GitHub/meara/deploy/vercel_deployment_plan.md`
- Railway backend: `/Users/petergiordano/Documents/GitHub/meara/deploy/railway_backend/`

---

## 🎯 Your Mission

Set up a **local Vercel development environment** that allows testing the complete flow:
1. User submits company name + URL via web interface
2. Frontend calls Railway backend API (running locally)
3. Backend runs DeepStack Collector
4. Frontend displays results (DeepStack JSON)

**Why Local First?**
- Test the integration before deploying to cloud
- Verify CORS settings work
- Debug API calls
- Validate UI/UX flow

---

## 📋 Prerequisites to Verify

Before starting, check these are ready:

```bash
# 1. Railway backend is set up
cd /Users/petergiordano/Documents/GitHub/meara/deploy/railway_backend
ls -la
# Should see: main.py, requirements.txt, setup.sh, test_api.sh

# 2. Railway backend tested and working
# If not yet done, run:
./setup.sh
source venv/bin/activate
python3 main.py
# Should see: "Uvicorn running on http://0.0.0.0:8000"

# 3. Node.js installed
node --version
# Should be 18+ or 20+

# 4. npm or yarn available
npm --version
```

---

## 🏗️ Setup Tasks

### Task 1: Create Next.js Frontend

**Location:** `/Users/petergiordano/Documents/GitHub/meara/deploy/vercel_frontend`

**Steps:**

1. **Create Next.js app:**
```bash
cd /Users/petergiordano/Documents/GitHub/meara/deploy

# Create with TypeScript, App Router, Tailwind
npx create-next-app@latest vercel_frontend --typescript --tailwind --app --no-src-dir --import-alias "@/*"

cd vercel_frontend
```

2. **Install additional dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
# Create .env.local
cat > .env.local << 'EOF'
# Railway backend API (local)
NEXT_PUBLIC_RAILWAY_API=http://localhost:8000
EOF
```

---

### Task 2: Create Main Page Component

**File:** `vercel_frontend/app/page.tsx`

**Requirements:**
- Form with company name + URL inputs
- Submit button that calls Railway API
- Progress indicator showing job status
- Results display showing DeepStack JSON
- Download button for JSON
- Error handling

**Key Features:**
- Polling mechanism (checks status every 2 seconds)
- Clean UI with Tailwind CSS
- Responsive design
- Loading states

**Reference the TypeScript code from:**
`/Users/petergiordano/Documents/GitHub/meara/deploy/vercel_deployment_plan.md` (lines 236-366)

**Adapt it for Next.js App Router:**
- Use `'use client'` directive
- Modern fetch API
- TypeScript interfaces
- Tailwind styling

---

### Task 3: Add Styling

**File:** `vercel_frontend/app/globals.css`

**Requirements:**
- Clean, professional design
- Form styling (inputs, buttons)
- Progress indicator styling
- Results display (with JSON formatting)
- Responsive layout
- Loading animations

**Suggested Tailwind Classes:**
- Forms: `input`, `button`, `form` classes
- Layout: `container`, `mx-auto`, `p-6`
- Typography: `text-xl`, `font-bold`, `text-gray-600`
- Progress: `w-full`, `bg-blue-600`, `rounded-full`

---

### Task 4: Configure CORS for Local Testing

**File:** `/Users/petergiordano/Documents/GitHub/meara/deploy/railway_backend/main.py`

**Verify CORS allows localhost:3000:**

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev server
        "http://localhost:5173",  # Vite (if using)
        "https://your-app.vercel.app"  # Production (future)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**If needs update:**
1. Edit main.py
2. Restart the backend server

---

### Task 5: Test the Integration

**Start both services:**

**Terminal 1 - Railway Backend:**
```bash
cd /Users/petergiordano/Documents/GitHub/meara/deploy/railway_backend
source venv/bin/activate
python3 main.py

# Should show:
# INFO:     Uvicorn running on http://0.0.0.0:8000
# INFO:     Application startup complete
```

**Terminal 2 - Vercel Frontend:**
```bash
cd /Users/petergiordano/Documents/GitHub/meara/deploy/vercel_frontend
npm run dev

# Should show:
# ▲ Next.js 14.x
# - Local:        http://localhost:3000
```

**Test flow:**
1. Open browser: http://localhost:3000
2. Enter test data:
   - Company Name: GGWP
   - Company URL: https://ggwp.com
3. Click "Analyze Website"
4. Watch progress indicator (should poll status every 2 seconds)
5. Wait for completion (~2-3 minutes)
6. Verify results display
7. Test "Download JSON" button

---

## ✅ Verification Checklist

### Backend Health
- [ ] Railway backend running on port 8000
- [ ] Health check works: `curl http://localhost:8000/health`
- [ ] CORS headers include `localhost:3000`
- [ ] DeepStack files copied (deepstack.py, src/)

### Frontend Setup
- [ ] Next.js dev server running on port 3000
- [ ] Page loads without errors
- [ ] Form renders correctly
- [ ] Tailwind CSS styling applied
- [ ] Environment variable loaded (check console)

### Integration Working
- [ ] Form submission triggers API call
- [ ] Network tab shows POST to `http://localhost:8000/api/analyze`
- [ ] Receives job_id in response
- [ ] Status polling starts (check Network tab every 2 seconds)
- [ ] Progress updates (0% → 100%)
- [ ] Results display when complete
- [ ] Download button works
- [ ] No CORS errors in console

### Error Handling
- [ ] Invalid URL shows error
- [ ] Network failure shows error
- [ ] Timeout handled gracefully
- [ ] Failed analysis shows error message

---

## 🐛 Common Issues & Solutions

### Issue: CORS Error
**Symptom:** Console shows "CORS policy blocked"
**Solution:**
```bash
# Edit railway_backend/main.py
# Add localhost:3000 to allow_origins
# Restart backend server
```

### Issue: Connection Refused
**Symptom:** "Failed to fetch" error
**Solution:**
```bash
# Verify backend is running
ps aux | grep "python.*main.py"

# Check port 8000 is accessible
curl http://localhost:8000/health

# Restart backend if needed
```

### Issue: Job Never Completes
**Symptom:** Progress stuck at 0% or 10%
**Solution:**
```bash
# Check backend logs in Terminal 1
# Look for errors in DeepStack execution
# Verify Playwright installed:
playwright install chromium
```

### Issue: Results Don't Display
**Symptom:** Progress shows 100% but no results
**Check:**
```javascript
// In browser console:
fetch('http://localhost:8000/api/results/{job_id}')
  .then(r => r.json())
  .then(console.log)

// Verify result has data
```

### Issue: Port Already in Use
**Symptom:** "EADDRINUSE: port 3000 already in use"
**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

---

## 📊 Expected Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│  BROWSER (http://localhost:3000)                         │
│  - User enters: GGWP, https://ggwp.com                  │
│  - Clicks "Analyze Website"                             │
└─────────────────────────────────────────────────────────┘
                          ↓
          POST http://localhost:8000/api/analyze
          { company_name: "GGWP", company_url: "https://ggwp.com" }
                          ↓
┌─────────────────────────────────────────────────────────┐
│  RAILWAY BACKEND (http://localhost:8000)                 │
│  - Receives request                                      │
│  - Creates job_id                                        │
│  - Starts background task                                │
│  - Returns: { job_id: "uuid", status: "queued" }        │
└─────────────────────────────────────────────────────────┘
                          ↓
          Background: python3 deepstack.py -u https://ggwp.com
                          ↓
         Browser navigates, collects data (2-3 min)
                          ↓
         Saves: output/deepstack_output-ggwp.com.json
                          ↓
┌─────────────────────────────────────────────────────────┐
│  FRONTEND - Polling Loop (every 2 seconds)              │
│  GET http://localhost:8000/api/status/{job_id}          │
│                                                          │
│  1. { status: "queued", progress: 0 }                   │
│  2. { status: "running", progress: 10 }                 │
│  3. { status: "running", progress: 30 }                 │
│  ...                                                     │
│  15. { status: "completed", progress: 100 }             │
└─────────────────────────────────────────────────────────┘
                          ↓
          GET http://localhost:8000/api/results/{job_id}
                          ↓
┌─────────────────────────────────────────────────────────┐
│  BACKEND returns DeepStack JSON                          │
│  {                                                       │
│    collection_metadata: {...},                          │
│    url_analysis_results: {...},                         │
│    data: {                                              │
│      marketing_technology_data_foundation: {...},      │
│      organic_presence_content_signals: {...},          │
│      ...                                                │
│    }                                                    │
│  }                                                      │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  FRONTEND displays results                               │
│  - JSON pretty-printed                                   │
│  - "Download JSON" button available                     │
│  - User can start new analysis                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 UI/UX Guidelines

### Initial State
- Clean form with 2 inputs + submit button
- Clear instructions: "Enter company name and URL to analyze"
- Prominent submit button

### Loading State
- Form disabled
- Submit button shows "Analyzing..."
- Progress bar appears
- Status text updates: "Queued" → "Running" → "Completed"
- Percentage shown (0-100%)

### Results State
- Results section appears
- JSON formatted with syntax highlighting (or use `<pre>` tag)
- Download button prominent
- Option to "Analyze Another" (resets form)

### Error State
- Error message in red
- Retry button
- Form re-enabled
- Error details shown (if not sensitive)

---

## 📝 Suggested Component Structure

```typescript
// vercel_frontend/app/page.tsx structure

'use client';

import { useState } from 'react';

// Types
interface JobStatus {
  job_id: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
  error?: string;
}

interface DeepStackResult {
  collection_metadata: any;
  url_analysis_results: any;
  data: any;
}

export default function Home() {
  // State
  const [companyName, setCompanyName] = useState('');
  const [companyUrl, setCompanyUrl] = useState('');
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [result, setResult] = useState<DeepStackResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API calls
  const handleSubmit = async (e: React.FormEvent) => { /* ... */ };
  const pollStatus = (id: string) => { /* ... */ };
  const fetchResults = async (id: string) => { /* ... */ };
  const handleDownload = () => { /* ... */ };
  const handleReset = () => { /* ... */ };

  // Render
  return (
    <main className="container mx-auto p-6">
      <h1>Website Analysis Tool</h1>

      {/* Form Section */}
      {!result && <form>...</form>}

      {/* Progress Section */}
      {loading && <div>...</div>}

      {/* Error Section */}
      {error && <div>...</div>}

      {/* Results Section */}
      {result && <div>...</div>}
    </main>
  );
}
```

---

## 🚀 Next Steps After Local Testing

Once local testing works:

1. **Optimize Frontend:**
   - Add better JSON visualization (react-json-view)
   - Add pagination for large results
   - Add search/filter for JSON keys
   - Improve mobile responsiveness

2. **Deploy Railway Backend:**
   ```bash
   cd /Users/petergiordano/Documents/GitHub/meara/deploy/railway_backend
   railway login
   railway init
   railway up
   railway domain
   # Note the URL: https://your-app.railway.app
   ```

3. **Update Frontend Environment:**
   ```bash
   # In vercel_frontend/.env.local
   NEXT_PUBLIC_RAILWAY_API=https://your-app.railway.app
   ```

4. **Deploy to Vercel:**
   ```bash
   cd /Users/petergiordano/Documents/GitHub/meara/deploy/vercel_frontend
   vercel login
   vercel
   # Follow prompts
   ```

5. **Update Railway CORS:**
   ```python
   # In railway_backend/main.py, add Vercel URL:
   allow_origins=[
       "https://your-app.vercel.app",
       "http://localhost:3000"
   ]
   # Redeploy: railway up
   ```

---

## 📚 Reference Material

### Complete System Understanding
Read first:
- `/Users/petergiordano/Documents/GitHub/meara/deploy/CLAUDE_CODE_TESTING_GUIDE.md`
  - Section: "Complete Architecture" for full pipeline context
  - Section: "Railway Backend Integration" for backend details

### Quick Commands
For fast testing:
- `/Users/petergiordano/Documents/GitHub/meara/deploy/QUICK_START_TESTING.md`
  - Option 3: Test Railway Backend (page 1)

### Architecture Details
For deployment understanding:
- `/Users/petergiordano/Documents/GitHub/meara/deploy/vercel_deployment_plan.md`
  - Section: "Recommended Architecture: Vercel + Railway"
  - Section: "Implementation Plan"

### Backend Code
Reference implementation:
- `/Users/petergiordano/Documents/GitHub/meara/deploy/railway_backend/main.py`
  - API endpoints documentation
  - Request/response formats
  - Error handling patterns

---

## 🎯 Success Criteria

**Local Testing Successful When:**
- [ ] Frontend runs on localhost:3000 without errors
- [ ] Backend runs on localhost:8000 without errors
- [ ] User can submit company name + URL
- [ ] API call triggers analysis
- [ ] Progress updates every 2 seconds
- [ ] Results display after 2-3 minutes
- [ ] JSON is readable and complete
- [ ] Download button creates valid JSON file
- [ ] No CORS errors in console
- [ ] No TypeScript errors
- [ ] Mobile responsive (test at 375px width)

**Ready for Cloud Deployment When:**
- [ ] All local tests pass
- [ ] Error handling works for all failure modes
- [ ] UI is polished and professional
- [ ] Loading states are smooth
- [ ] Can test with multiple companies (GGWP, different URLs)

---

## 💡 Pro Tips

1. **Use React DevTools** to debug state changes
2. **Keep Network tab open** to see API calls in real-time
3. **Test with different URLs** to verify robustness
4. **Check backend Terminal** for any Python errors
5. **Use `console.log`** liberally while developing
6. **Test error cases** (invalid URL, timeout, network failure)
7. **Verify mobile layout** before deploying

---

**Your Task:** Set up the Vercel local testing environment following these instructions. Ask questions if any step is unclear. Reference the testing guide documents as needed for additional context.

**Priority:** Get the basic flow working first (submit → poll → display). Polish the UI/UX after functionality works.

**Timeline:** Should take 1-2 hours to set up and test locally.
