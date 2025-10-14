/**
 * ContinueAnalysisButton Component
 * Sprint L.1 - Full Analysis Workflow
 *
 * Constitution Compliance:
 * - Article I (Library-First): Using React and Railway API client
 * - Article VII (Simplicity): Single button, clear purpose
 * - Article VIII (Anti-Abstraction): Direct API call, no layers
 *
 * Triggers full MEARA analysis (9 OpenAI Assistants, 10-12 minutes)
 */

'use client';

import { useState, useRef } from 'react';
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
  const [contextFiles, setContextFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);

    // Validate file size (max 10MB per file)
    const invalidFiles = newFiles.filter(file => file.size > 10 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      setError(`Files too large: ${invalidFiles.map(f => f.name).join(', ')}. Max 10MB per file.`);
      return;
    }

    // Validate total number of files (max 5)
    if (contextFiles.length + newFiles.length > 5) {
      setError('Maximum 5 context files allowed.');
      return;
    }

    setContextFiles(prev => [...prev, ...newFiles]);
    setError(null);

    // Reset input so same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setContextFiles(prev => prev.filter((_, i) => i !== index));
  };

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
        additional_context_files: contextFiles.length > 0 ? contextFiles : undefined,
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
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
      {/* Optional Context Files Section */}
      <div className="w-full p-6 bg-gray-50 border-2 border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">
          Optional: Add Context Documents
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload additional documents (investor memos, pitch decks, product specs, etc.)
          to enhance the analysis with extra company context.
        </p>

        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.md,.txt,.docx"
          multiple
          onChange={handleFileSelect}
          disabled={disabled || isLoading || contextFiles.length >= 5}
          className="hidden"
          id="context-file-input"
        />

        {/* File List or Upload Button */}
        {contextFiles.length === 0 ? (
          <label
            htmlFor="context-file-input"
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm
              transition-all cursor-pointer
              ${
                disabled || isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400'
              }
            `}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Choose Files...
          </label>
        ) : (
          <div className="space-y-2">
            {/* File List */}
            {contextFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-700 truncate">{file.name}</span>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveFile(index)}
                  disabled={isLoading}
                  className="ml-2 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            ))}

            {/* Add More Files Button */}
            {contextFiles.length < 5 && (
              <label
                htmlFor="context-file-input"
                className={`
                  inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm
                  transition-all cursor-pointer
                  ${
                    disabled || isLoading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400'
                  }
                `}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add More Files... ({contextFiles.length}/5)
              </label>
            )}
          </div>
        )}

        <p className="text-xs text-gray-500 mt-2">
          Accepted formats: PDF, MD, TXT, DOCX • Max 10MB per file • Max 5 files
        </p>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={`
          px-8 py-4 rounded-lg font-semibold text-white text-lg
          transition-all duration-200
          ${
            disabled || isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-lg hover:shadow-xl'
          }
          flex items-center gap-3
        `}
        aria-label="Continue to full analysis"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-6 w-6"
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
            {contextFiles.length > 0 && (
              <span className="text-sm opacity-90">
                (with {contextFiles.length} context {contextFiles.length === 1 ? 'document' : 'documents'})
              </span>
            )}
          </>
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div
          className="w-full px-4 py-3 bg-red-50 border-2 border-red-200 rounded-lg text-red-700 text-sm"
          role="alert"
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Info Text */}
      {!error && !isLoading && (
        <p className="text-sm text-gray-600 text-center max-w-lg">
          Full analysis will take approximately 10-12 minutes and generate a
          comprehensive report with all 9 dimensions for <strong>{companyName}</strong>.
        </p>
      )}
    </div>
  );
}
