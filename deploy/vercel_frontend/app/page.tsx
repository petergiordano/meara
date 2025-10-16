'use client';

import { useState } from 'react';
import ContinueAnalysisButton from '@/components/ContinueAnalysisButton';
import ProgressTracker from '@/components/ProgressTracker';
import ReportViewer from '@/components/ReportViewer';
import DownloadButton from '@/components/DownloadButton';

// Types
interface JobStatus {
  job_id: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  company_name: string;
  company_url: string;
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

  // Sprint L.1: Full Analysis State
  const [fullAnalysisJobId, setFullAnalysisJobId] = useState<string | null>(null);
  const [showProgressTracker, setShowProgressTracker] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportMarkdown, setReportMarkdown] = useState('');

  const RAILWAY_API = process.env.NEXT_PUBLIC_RAILWAY_API || 'http://localhost:8000';

  // API calls
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create FormData for API request
      const formData = new FormData();
      formData.append('company_name', companyName);
      formData.append('company_url', companyUrl);

      // Start analysis
      const response = await fetch(`${RAILWAY_API}/api/analyze`, {
        method: 'POST',
        body: formData  // Don't set Content-Type - browser sets it with boundary
      });

      if (!response.ok) {
        throw new Error(`Failed to start analysis: ${response.statusText}`);
      }

      const data = await response.json();
      setJobId(data.job_id);

      // Poll for status
      pollStatus(data.job_id);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error starting analysis: ${errorMessage}`);
      setLoading(false);
    }
  };

  const pollStatus = (id: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${RAILWAY_API}/api/status/${id}`);
        const data: JobStatus = await response.json();

        setStatus(data);

        if (data.status === 'completed') {
          clearInterval(interval);
          fetchResults(id);
        } else if (data.status === 'failed') {
          clearInterval(interval);
          setLoading(false);
          setError(`Analysis failed: ${data.error || 'Unknown error'}`);
        }
      } catch (err) {
        console.error('Status check failed:', err);
      }
    }, 2000); // Poll every 2 seconds
  };

  const fetchResults = async (id: string) => {
    try {
      const response = await fetch(`${RAILWAY_API}/api/results/${id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch results: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data.result);
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error fetching results: ${errorMessage}`);
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;

    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${companyName.replace(/\s+/g, '_')}_deepstack.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setCompanyName('');
    setCompanyUrl('');
    setJobId(null);
    setStatus(null);
    setResult(null);
    setLoading(false);
    setError(null);
  };

  // Sprint L.1: Full Analysis Handlers
  const handleFullAnalysisStart = (analysisJobId: string) => {
    setFullAnalysisJobId(analysisJobId);
    setShowProgressTracker(true);
    setShowReport(false);
  };

  const handleProgressComplete = (reportReady: boolean) => {
    if (reportReady) {
      setShowProgressTracker(false);
      setShowReport(true);
    } else {
      // Analysis failed
      setError('Full analysis failed. Please try again.');
      setShowProgressTracker(false);
    }
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          {/* Scale VP Logo */}
          <div className="mb-6 flex justify-center">
            <img
              src="/scale_vp_logo.jpg"
              alt="Scale Venture Partners"
              className="h-16 w-auto"
              style={{ objectFit: 'contain' }}
            />
          </div>

          <h1 className="text-3xl font-semibold mb-3" style={{
            fontFamily: 'var(--font-work-sans)',
            color: '#224f41'
          }}>
            GTM Scalability Analysis
          </h1>
          <p className="text-lg" style={{
            fontFamily: 'var(--font-outfit)',
            color: '#528577'
          }}>
            Provided by the Scale VP GTM Platform Team
          </p>
        </div>

        {/* Form Section */}
        {!result && (
          <div className="rounded-lg shadow-lg p-8 mb-6" style={{ backgroundColor: '#ffffff' }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium mb-2"
                  style={{
                    fontFamily: 'var(--font-outfit)',
                    color: '#060119'
                  }}
                >
                  Company name
                </label>
                <input
                  id="companyName"
                  type="text"
                  placeholder="AcmeCorp.com"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: 'var(--font-outfit)',
                    borderColor: '#7da399',
                    color: '#060119',
                    backgroundColor: loading ? '#f6f6f6' : '#ffffff'
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="companyUrl"
                  className="block text-sm font-medium mb-2"
                  style={{
                    fontFamily: 'var(--font-outfit)',
                    color: '#060119'
                  }}
                >
                  Company URL
                </label>
                <input
                  id="companyUrl"
                  type="url"
                  placeholder="https://www.AcmeCorp.com"
                  value={companyUrl}
                  onChange={(e) => setCompanyUrl(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: 'var(--font-outfit)',
                    borderColor: '#7da399',
                    color: '#060119',
                    backgroundColor: loading ? '#f6f6f6' : '#ffffff'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                style={{
                  fontFamily: 'var(--font-outfit)',
                  backgroundColor: '#0d71a9',
                  color: '#ffffff'
                }}
              >
                {loading ? 'Analyzing...' : 'Analyze website'}
              </button>
            </form>
          </div>
        )}

        {/* Progress Section */}
        {status && loading && (
          <div className="rounded-lg shadow-lg p-8 mb-6" style={{ backgroundColor: '#ffffff' }}>
            <h2 className="text-2xl font-bold mb-6" style={{
              fontFamily: 'var(--font-work-sans)',
              color: '#224f41'
            }}>
              Analysis in progress
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between text-sm" style={{
                fontFamily: 'var(--font-outfit)',
                color: '#528577'
              }}>
                <span>Status: <span className="font-medium capitalize" style={{ color: '#060119' }}>{status.status}</span></span>
                <span className="font-bold" style={{ color: '#e5a819' }}>{status.progress}%</span>
              </div>

              <div className="w-full rounded-full h-4 overflow-hidden" style={{ backgroundColor: '#e5ecea' }}>
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${status.progress}%`,
                    backgroundColor: '#e5a819'
                  }}
                />
              </div>

              <p className="text-sm" style={{
                fontFamily: 'var(--font-outfit)',
                color: '#528577'
              }}>
                Analyzing {status.company_name} ({status.company_url})...
              </p>
            </div>
          </div>
        )}

        {/* Error Section */}
        {error && (
          <div className="rounded-lg p-6 mb-6 border-2" style={{
            backgroundColor: '#faeed1',
            borderColor: '#e5a819'
          }}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6" viewBox="0 0 20 20" fill="#e5a819">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-base font-semibold" style={{
                  fontFamily: 'var(--font-work-sans)',
                  color: '#060119'
                }}>
                  Error
                </h3>
                <p className="mt-1 text-sm" style={{
                  fontFamily: 'var(--font-outfit)',
                  color: '#060119'
                }}>
                  {error}
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="mt-4 px-6 py-2 rounded-lg font-medium text-sm transition-colors"
              style={{
                fontFamily: 'var(--font-outfit)',
                backgroundColor: '#e5a819',
                color: '#ffffff'
              }}
            >
              Try again
            </button>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="rounded-lg shadow-lg p-8" style={{ backgroundColor: '#ffffff' }}>
            <h2 className="text-3xl font-bold mb-6" style={{
              fontFamily: 'var(--font-work-sans)',
              color: '#224f41'
            }}>
              Website analysis complete!
            </h2>

            {/* Preview Section */}
            <div className="mb-6 p-6 rounded-lg" style={{ backgroundColor: '#e5ecea' }}>
              <h3 className="text-lg font-semibold mb-3" style={{
                fontFamily: 'var(--font-work-sans)',
                color: '#224f41'
              }}>
                What we collected
              </h3>
              <ul className="text-sm space-y-2 list-disc list-inside" style={{
                fontFamily: 'var(--font-outfit)',
                color: '#060119'
              }}>
                <li>Website structure and navigation</li>
                <li>Marketing technology stack</li>
                <li>Content and messaging analysis</li>
                <li>Technical metadata and SEO data</li>
              </ul>
            </div>

            {/* Download DeepStack Results - Thin Bar */}
            <div className="flex items-center justify-between p-4 rounded-lg mb-4" style={{
              backgroundColor: '#f6f6f6',
              borderLeft: '4px solid #7da399'
            }}>
              <div>
                <h4 className="text-sm font-semibold" style={{
                  fontFamily: 'var(--font-work-sans)',
                  color: '#224f41'
                }}>
                  Download DeepStack Results
                </h4>
                <p className="text-xs" style={{
                  fontFamily: 'var(--font-outfit)',
                  color: '#528577'
                }}>
                  Raw JSON data from website analysis
                </p>
              </div>
              <button
                onClick={handleDownload}
                className="px-5 py-2 rounded-lg font-medium text-sm transition-all hover:opacity-90"
                style={{
                  fontFamily: 'var(--font-outfit)',
                  backgroundColor: '#528577',
                  color: '#ffffff'
                }}
              >
                Download JSON
              </button>
            </div>

            {/* Continue to Full MEARA Analysis - Full Width Card */}
            <div className="p-6 rounded-lg border-2 mb-6" style={{
              borderColor: '#0d71a9',
              backgroundColor: '#e2eef5'
            }}>
              <h3 className="text-xl font-bold mb-4" style={{
                fontFamily: 'var(--font-work-sans)',
                color: '#0d71a9'
              }}>
                Generate Full MEARA Analysis
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Button Section */}
                <div className="flex flex-col justify-center items-center p-4">
                  <ContinueAnalysisButton
                    deepstackJobId={jobId || ''}
                    companyName={companyName}
                    companyUrl={companyUrl}
                    onAnalysisStarted={handleFullAnalysisStart}
                  />
                  <div className="mt-4 text-center">
                    <p className="text-sm font-medium" style={{
                      fontFamily: 'var(--font-outfit)',
                      color: '#060119'
                    }}>
                      Cost: $6.45
                    </p>
                    <p className="text-sm font-medium" style={{
                      fontFamily: 'var(--font-outfit)',
                      color: '#060119'
                    }}>
                      Time: ~10 minutes
                    </p>
                  </div>
                </div>

                {/* Right: Explanation Section */}
                <div className="space-y-4">
                  {/* What You'll Get */}
                  <div>
                    <h4 className="text-sm font-bold mb-2 flex items-center" style={{
                      fontFamily: 'var(--font-work-sans)',
                      color: '#0d71a9'
                    }}>
                      📊 What You'll Get:
                    </h4>
                    <div className="text-sm pl-5" style={{
                      fontFamily: 'var(--font-outfit)',
                      color: '#060119'
                    }}>
                      <p className="font-semibold mb-1">Complete MEARA Analysis</p>
                      <ul className="text-xs space-y-1 list-disc list-inside">
                        <li>9 strategic dimensions evaluated</li>
                        <li>GTM scalability insights</li>
                        <li>Competitive positioning analysis</li>
                        <li>Strategic growth levers</li>
                      </ul>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t" style={{ borderColor: '#7da399', opacity: 0.3 }} />

                  {/* Behind the Scenes */}
                  <div>
                    <h4 className="text-sm font-bold mb-2 flex items-center" style={{
                      fontFamily: 'var(--font-work-sans)',
                      color: '#0d71a9'
                    }}>
                      ⚙️ Behind the Scenes:
                    </h4>
                    <div className="text-xs pl-5 space-y-1" style={{
                      fontFamily: 'var(--font-outfit)',
                      color: '#060119'
                    }}>
                      <p className="mb-2">We'll automatically:</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Extract ground truth from website data</li>
                        <li>Generate strategic research brief (or use yours if provided)</li>
                        <li>Produce comprehensive MEARA analysis</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Preview */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3" style={{
                fontFamily: 'var(--font-work-sans)',
                color: '#224f41'
              }}>
                Data preview
              </h3>
              <div className="rounded-lg p-6 max-h-[400px] overflow-auto" style={{ backgroundColor: '#f6f6f6' }}>
                <pre className="text-xs font-mono whitespace-pre-wrap break-words" style={{ color: '#060119' }}>
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>

            {/* Start Another Analysis */}
            <div className="text-center">
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                style={{
                  fontFamily: 'var(--font-outfit)',
                  backgroundColor: '#7da399',
                  color: '#ffffff'
                }}
              >
                Analyze another website
              </button>
            </div>
          </div>
        )}

        {/* Sprint L.1: Progress Tracker Section */}
        {showProgressTracker && fullAnalysisJobId && (
          <div className="mb-6">
            <ProgressTracker
              analysisJobId={fullAnalysisJobId}
              onComplete={handleProgressComplete}
            />
          </div>
        )}

        {/* Sprint L.1: Report Viewer Section */}
        {showReport && fullAnalysisJobId && (
          <div className="space-y-6">
            <div className="rounded-lg shadow-lg p-8" style={{ backgroundColor: '#ffffff' }}>
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-4" style={{
                  fontFamily: 'var(--font-work-sans)',
                  color: '#224f41'
                }}>
                  Full analysis complete!
                </h2>
                <p className="text-base mb-6" style={{
                  fontFamily: 'var(--font-outfit)',
                  color: '#528577'
                }}>
                  Your comprehensive MEARA GTM Scalability Analysis report is ready. Download it in your preferred format below.
                </p>

                {/* Download Buttons */}
                <div className="flex gap-4 mb-6">
                  <DownloadButton
                    format="markdown"
                    reportMarkdown={reportMarkdown}
                    companyName={companyName}
                  />
                  <DownloadButton
                    format="pdf"
                    reportMarkdown={reportMarkdown}
                    companyName={companyName}
                  />
                </div>
              </div>

              {/* Report Display */}
              <ReportViewer
                analysisJobId={fullAnalysisJobId}
                companyName={companyName}
              />

              {/* Start Another Analysis */}
              <div className="mt-6 text-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                  style={{
                    fontFamily: 'var(--font-outfit)',
                    backgroundColor: '#7da399',
                    color: '#ffffff'
                  }}
                >
                  Analyze another website
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        {!loading && !result && !error && !showProgressTracker && !showReport && (
          <div className="rounded-lg p-6" style={{ backgroundColor: '#e2eef5' }}>
            <h3 className="text-base font-semibold mb-3" style={{
              fontFamily: 'var(--font-work-sans)',
              color: '#0d71a9'
            }}>
              How it works
            </h3>
            <ul className="text-sm space-y-2 list-disc list-inside" style={{
              fontFamily: 'var(--font-outfit)',
              color: '#060119'
            }}>
              <li>Enter a company name and website URL</li>
              <li>Our system will analyze the website using DeepStack Collector</li>
              <li>Analysis typically takes 2-3 minutes</li>
              <li>You'll receive comprehensive data about marketing technology, content, and more</li>
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
