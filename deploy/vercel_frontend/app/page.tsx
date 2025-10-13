'use client';

import { useState, useEffect } from 'react';

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

  const RAILWAY_API = process.env.NEXT_PUBLIC_RAILWAY_API || 'http://localhost:8000';

  // API calls
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Start analysis
      const response = await fetch(`${RAILWAY_API}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: companyName,
          company_url: companyUrl
        })
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

  return (
    <main className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Website Analysis Tool
        </h1>
        <p className="text-gray-600">
          Analyze websites with DeepStack Collector to gather comprehensive marketing and technical data
        </p>
      </div>

      {/* Form Section */}
      {!result && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                id="companyName"
                type="text"
                placeholder="e.g., GGWP"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="companyUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Company URL
              </label>
              <input
                id="companyUrl"
                type="url"
                placeholder="https://company.com"
                value={companyUrl}
                onChange={(e) => setCompanyUrl(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {loading ? 'Analyzing...' : 'Analyze Website'}
            </button>
          </form>
        </div>
      )}

      {/* Progress Section */}
      {status && loading && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis in Progress</h2>

          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Status: <span className="font-medium capitalize">{status.status}</span></span>
              <span>{status.progress}%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${status.progress}%` }}
              />
            </div>

            <p className="text-sm text-gray-500">
              Analyzing {status.company_name} ({status.company_url})...
            </p>
          </div>
        </div>
      )}

      {/* Error Section */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="mt-4 bg-red-100 text-red-800 px-4 py-2 rounded-md hover:bg-red-200 font-medium text-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Analysis Complete!</h2>
            <div className="space-x-2">
              <button
                onClick={handleDownload}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 font-medium transition-colors"
              >
                Download JSON
              </button>
              <button
                onClick={handleReset}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 font-medium transition-colors"
              >
                Analyze Another
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 max-h-[600px] overflow-auto">
            <pre className="text-xs text-gray-800 font-mono whitespace-pre-wrap break-words">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Info Section */}
      {!loading && !result && !error && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">How it works</h3>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>Enter a company name and website URL</li>
            <li>Our system will analyze the website using DeepStack Collector</li>
            <li>Analysis typically takes 2-3 minutes</li>
            <li>You'll receive comprehensive data about marketing technology, content, and more</li>
          </ul>
        </div>
      )}
    </main>
  );
}
