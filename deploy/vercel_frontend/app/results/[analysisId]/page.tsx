'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface MEARAReport {
  analysis_job_id: string;
  company_name: string;
  company_url: string;
  report_markdown: string;
  report_file?: string;
}

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const analysisId = params.analysisId as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<MEARAReport | null>(null);
  const [exportingMarkdown, setExportingMarkdown] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [analysisId]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/analysis/report/${analysisId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch report');
      }

      const data = await response.json();
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const downloadMarkdown = () => {
    if (!report) return;

    setExportingMarkdown(true);

    try {
      // Create markdown file with proper formatting
      const markdown = report.report_markdown;
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);

      // Generate filename
      const date = new Date().toISOString().split('T')[0];
      const filename = `${report.company_name.replace(/\s+/g, '_')}_MEARA_Analysis_${date}.md`;

      // Trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download markdown file');
      console.error('Download error:', err);
    } finally {
      setExportingMarkdown(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            {/* Header with logo */}
            <div className="mb-8 text-center">
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
                Marketing Effectiveness Analysis Reporting Agent (MEARA)
              </h1>
            </div>

            {/* Loading state */}
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{
                  borderColor: '#0d71a9'
                }}></div>
                <p className="mt-4 text-lg" style={{
                  fontFamily: 'var(--font-outfit)',
                  color: '#528577'
                }}>
                  Loading analysis report...
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            {/* Header with logo */}
            <div className="mb-8 text-center">
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
                Marketing Effectiveness Analysis Reporting Agent (MEARA)
              </h1>
            </div>

            {/* Error state */}
            <div className="p-6 rounded-lg border-2" style={{
              borderColor: '#dc2626',
              backgroundColor: '#fee2e2'
            }}>
              <h3 className="text-xl font-bold mb-2" style={{
                fontFamily: 'var(--font-work-sans)',
                color: '#dc2626'
              }}>
                Error Loading Report
              </h3>
              <p className="mb-4" style={{
                fontFamily: 'var(--font-outfit)',
                color: '#991b1b'
              }}>
                {error}
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-5 py-2 rounded-lg font-medium text-sm transition-all hover:opacity-90"
                style={{
                  fontFamily: 'var(--font-outfit)',
                  backgroundColor: '#528577',
                  color: '#ffffff'
                }}
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!report) return null;

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header with logo */}
          <div className="mb-8 text-center">
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
              Marketing Effectiveness Analysis Reporting Agent (MEARA)
            </h1>
            <p className="text-lg" style={{
              fontFamily: 'var(--font-outfit)',
              color: '#528577'
            }}>
              {report.company_name} - Analysis Complete
            </p>
          </div>

          {/* Export Controls */}
          <div className="mb-8 p-6 rounded-lg border-2" style={{
            borderColor: '#0d71a9',
            backgroundColor: '#e2eef5'
          }}>
            <h3 className="text-xl font-bold mb-4" style={{
              fontFamily: 'var(--font-work-sans)',
              color: '#0d71a9'
            }}>
              Export Options
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Markdown Export */}
              <button
                onClick={downloadMarkdown}
                disabled={exportingMarkdown}
                className="p-4 rounded-lg border-2 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: '#7da399',
                  backgroundColor: '#ffffff'
                }}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">📄</div>
                  <div className="font-semibold mb-1" style={{
                    fontFamily: 'var(--font-work-sans)',
                    color: '#224f41'
                  }}>
                    {exportingMarkdown ? 'Downloading...' : 'Download Markdown'}
                  </div>
                  <div className="text-sm" style={{
                    fontFamily: 'var(--font-outfit)',
                    color: '#528577'
                  }}>
                    Plain text format
                  </div>
                </div>
              </button>

              {/* PDF Export - Coming Soon */}
              <button
                disabled
                className="p-4 rounded-lg border-2 opacity-50 cursor-not-allowed"
                style={{
                  borderColor: '#7da399',
                  backgroundColor: '#f6f6f6'
                }}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">📑</div>
                  <div className="font-semibold mb-1" style={{
                    fontFamily: 'var(--font-work-sans)',
                    color: '#224f41'
                  }}>
                    Download PDF
                  </div>
                  <div className="text-sm" style={{
                    fontFamily: 'var(--font-outfit)',
                    color: '#528577'
                  }}>
                    Coming soon
                  </div>
                </div>
              </button>

              {/* Google Docs - Coming Soon */}
              <button
                disabled
                className="p-4 rounded-lg border-2 opacity-50 cursor-not-allowed"
                style={{
                  borderColor: '#7da399',
                  backgroundColor: '#f6f6f6'
                }}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">📝</div>
                  <div className="font-semibold mb-1" style={{
                    fontFamily: 'var(--font-work-sans)',
                    color: '#224f41'
                  }}>
                    Create Google Doc
                  </div>
                  <div className="text-sm" style={{
                    fontFamily: 'var(--font-outfit)',
                    color: '#528577'
                  }}>
                    Coming soon
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Report Content */}
          <div className="prose prose-lg max-w-none">
            <div
              className="p-8 rounded-lg border-2"
              style={{
                borderColor: '#7da399',
                backgroundColor: '#ffffff'
              }}
              dangerouslySetInnerHTML={{ __html: renderMarkdownToHTML(report.report_markdown) }}
            />
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 rounded-lg font-medium text-base transition-all hover:opacity-90"
              style={{
                fontFamily: 'var(--font-outfit)',
                backgroundColor: '#528577',
                color: '#ffffff'
              }}
            >
              Start New Analysis
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

// Simple markdown to HTML converter
// Renders markdown report with proper styling
function renderMarkdownToHTML(markdown: string): string {
  if (!markdown) return '<p style="color: #528577;">Report content will appear here...</p>';

  // Escape HTML entities to prevent XSS
  let html = markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Process markdown syntax (order matters!)

  // Headers (must come before other formatting)
  html = html.replace(/^#### (.*?)$/gim, '<h4 style="font-family: var(--font-work-sans); color: #224f41; font-size: 1.1rem; font-weight: 600; margin-top: 1.25rem; margin-bottom: 0.5rem;">$1</h4>');
  html = html.replace(/^### (.*?)$/gim, '<h3 style="font-family: var(--font-work-sans); color: #224f41; font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem;">$1</h3>');
  html = html.replace(/^## (.*?)$/gim, '<h2 style="font-family: var(--font-work-sans); color: #0d71a9; font-size: 1.5rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; border-bottom: 2px solid #7da399; padding-bottom: 0.5rem;">$1</h2>');
  html = html.replace(/^# (.*?)$/gim, '<h1 style="font-family: var(--font-work-sans); color: #224f41; font-size: 2rem; font-weight: 800; margin-top: 0; margin-bottom: 1.5rem;">$1</h1>');

  // Bold (use escaped asterisks in HTML context)
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong style="color: #224f41; font-weight: 600;">$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/gim, '<em style="color: #528577;">$1</em>');

  // Inline code
  html = html.replace(/`(.*?)`/gim, '<code style="background-color: #f6f6f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-family: monospace; color: #0d71a9; font-size: 0.9em;">$1</code>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" style="color: #0d71a9; text-decoration: underline;" target="_blank" rel="noopener noreferrer">$1</a>');

  // Lists (bullet points)
  const lines = html.split('\n');
  let inList = false;
  let processedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for bullet list item
    if (line.match(/^[\*\-] /)) {
      if (!inList) {
        processedLines.push('<ul style="margin-left: 1.5rem; margin-bottom: 1rem; list-style-type: disc;">');
        inList = true;
      }
      const content = line.replace(/^[\*\-] /, '');
      processedLines.push(`<li style="font-family: var(--font-outfit); color: #060119; margin-bottom: 0.5rem;">${content}</li>`);
    } else {
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      processedLines.push(line);
    }
  }

  if (inList) {
    processedLines.push('</ul>');
  }

  html = processedLines.join('\n');

  // Paragraphs (double line breaks)
  html = html.split('\n\n').map(para => {
    // Skip if it's already a heading or list
    if (para.match(/^<[hul]/)) {
      return para;
    }
    return `<p style="font-family: var(--font-outfit); color: #060119; margin-bottom: 1rem; line-height: 1.6;">${para.replace(/\n/g, '<br />')}</p>`;
  }).join('\n');

  return html;
}
