/**
 * ContinueAnalysisButton Component
 * Sprint L.1 - Full Analysis Workflow
 *
 * Constitution Compliance:
 * - Article I (Library-First): Using React and Railway API client
 * - Article VII (Simplicity): Single button, clear purpose
 * - Article VIII (Anti-Abstraction): Direct API call, no layers
 *
 * Triggers full MEARA analysis (7 OpenAI Assistants, 8-10 minutes)
 */

'use client';

import { useState } from 'react';
import { startFullAnalysis } from '@/lib/railwayApi';

export interface ContinueAnalysisButtonProps {
  deepstackJobId: string;
  companyName: string;
  companyUrl: string;
  onAnalysisStarted: (analysisJobId: string) => void;
  disabled?: boolean;
}

export default function ContinueAnalysisButton({
  deepstackJobId,
  companyName,
  companyUrl,
  onAnalysisStarted,
  disabled = false,
}: ContinueAnalysisButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    // Don't proceed if disabled or already loading
    if (disabled || isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await startFullAnalysis({
        company_name: companyName,
        company_url: companyUrl,
        deepstack_job_id: deepstackJobId,
      });

      // Call callback with analysis job ID
      onAnalysisStarted(response.analysis_job_id);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to start analysis';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={`
          px-6 py-3 rounded-lg font-medium text-white
          transition-all duration-200
          ${
            disabled || isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
          }
          flex items-center gap-2
        `}
        aria-label="Continue to full analysis"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Starting analysis...</span>
          </>
        ) : (
          <>
            <span>Continue to Full Analysis</span>
            <span className="text-sm opacity-80">for {companyName}</span>
          </>
        )}
      </button>

      {error && (
        <div
          className="px-4 py-2 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm"
          role="alert"
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {!error && !isLoading && (
        <p className="text-sm text-gray-600 text-center max-w-md">
          Full analysis will take approximately 8-10 minutes and generate a
          comprehensive report with all 7 dimensions.
        </p>
      )}
    </div>
  );
}
