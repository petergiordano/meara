/**
 * ReportViewer Component
 * Sprint L.1 - Full Analysis Workflow
 *
 * Constitution Compliance:
 * - Article I (Library-First): Using react-markdown, remark-gfm, rehype-raw
 * - Article VII (Simplicity): Direct markdown rendering
 * - Article VIII (Anti-Abstraction): Direct library usage
 *
 * Fetches and displays MEARA analysis report in markdown format
 */

'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { getAnalysisReport } from '@/lib/railwayApi';

export interface ReportViewerProps {
  analysisJobId: string;
  companyName: string;
}

export default function ReportViewer({
  analysisJobId,
  companyName,
}: ReportViewerProps) {
  const [reportMarkdown, setReportMarkdown] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string>('');

  useEffect(() => {
    const fetchReport = async () => {
      if (!analysisJobId) {
        setError('No analysis job ID provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await getAnalysisReport(analysisJobId);

        setReportMarkdown(response.report_markdown);
        setGeneratedAt(response.generated_at);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load report';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [analysisJobId]);

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center justify-center py-12">
          <svg
            className="animate-spin h-12 w-12 text-blue-600 mb-4"
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
          <p className="text-lg text-gray-700 font-medium">Loading report...</p>
          <p className="text-sm text-gray-500 mt-2">
            Fetching your comprehensive MEARA analysis
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <div className="p-6 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center gap-3 mb-3">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-red-800">
              Error Loading Report
            </h3>
          </div>
          <p className="text-red-700">{error}</p>
          {error.toLowerCase().includes('not found') && (
            <p className="text-sm text-red-600 mt-2">
              The report may not be ready yet or the analysis job ID is invalid.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      {/* Report Header */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          MEARA Analysis Report
        </h2>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="font-medium">{companyName}</span>
          {generatedAt && (
            <>
              <span>•</span>
              <span>
                Generated: {new Date(generatedAt).toLocaleDateString()} at{' '}
                {new Date(generatedAt).toLocaleTimeString()}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Markdown Content */}
      <div className="prose prose-slate max-w-none overflow-y-auto max-h-[calc(100vh-300px)]">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            // Custom heading styles
            h1: ({ node, ...props }) => (
              <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-800" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800" {...props} />
            ),
            h4: ({ node, ...props }) => (
              <h4 className="text-lg font-semibold mt-3 mb-2 text-gray-700" {...props} />
            ),
            // Custom paragraph styles
            p: ({ node, ...props }) => (
              <p className="mb-4 text-gray-700 leading-relaxed" {...props} />
            ),
            // Custom list styles
            ul: ({ node, ...props }) => (
              <ul className="list-disc list-inside mb-4 space-y-2" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="text-gray-700" {...props} />
            ),
            // Custom blockquote styles
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="border-l-4 border-blue-500 pl-4 py-2 my-4 italic text-gray-700 bg-blue-50"
                {...props}
              />
            ),
            // Custom code styles
            code: ({ node, inline, ...props }: any) =>
              inline ? (
                <code
                  className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800"
                  {...props}
                />
              ) : (
                <code
                  className="block bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm font-mono my-4"
                  {...props}
                />
              ),
            // Custom link styles
            a: ({ node, ...props }) => (
              <a
                className="text-blue-600 hover:text-blue-800 underline"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              />
            ),
            // Custom table styles
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto my-4">
                <table
                  className="min-w-full divide-y divide-gray-200 border border-gray-300"
                  {...props}
                />
              </div>
            ),
            thead: ({ node, ...props }) => (
              <thead className="bg-gray-50" {...props} />
            ),
            th: ({ node, ...props }) => (
              <th
                className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b"
                {...props}
              />
            ),
            td: ({ node, ...props }) => (
              <td className="px-4 py-2 text-sm text-gray-700 border-b" {...props} />
            ),
          }}
        >
          {reportMarkdown}
        </ReactMarkdown>
      </div>

      {/* Footer */}
      {reportMarkdown && (
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            This report was generated by MEARA using 7 specialized AI assistants
          </p>
        </div>
      )}
    </div>
  );
}
