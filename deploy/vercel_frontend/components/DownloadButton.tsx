/**
 * DownloadButton Component
 * Sprint L.1 - Full Analysis Workflow
 *
 * Constitution Compliance:
 * - Article I (Library-First): Using file-saver, jspdf
 * - Article VII (Simplicity): Direct download triggers
 * - Article VIII (Anti-Abstraction): Direct library usage
 *
 * Downloads MEARA analysis reports in markdown or PDF format
 */

'use client';

import { useState } from 'react';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

export interface DownloadButtonProps {
  format: 'markdown' | 'pdf';
  reportMarkdown: string;
  companyName: string;
}

export default function DownloadButton({
  format,
  reportMarkdown,
  companyName,
}: DownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sanitize company name for filename
  const sanitizeFilename = (name: string): string => {
    if (!name || name.trim() === '') {
      return 'meara-report';
    }
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Generate timestamp for filename
  const getTimestamp = (): string => {
    const now = new Date();
    return now.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  // Generate filename
  const generateFilename = (extension: string): string => {
    const sanitized = sanitizeFilename(companyName);
    const timestamp = getTimestamp();
    return `${sanitized}-meara-${timestamp}.${extension}`;
  };

  // Handle markdown download
  const downloadMarkdown = () => {
    try {
      setError(null);
      const blob = new Blob([reportMarkdown], {
        type: 'text/markdown;charset=utf-8',
      });
      const filename = generateFilename('md');
      saveAs(blob, filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download markdown');
    }
  };

  // Handle PDF download
  const downloadPDF = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      // Allow loading state to render
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Create PDF instance
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.width;
      const pageHeight = pdf.internal.pageSize.height;
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      let yPosition = margin;

      // Split markdown into lines
      const lines = reportMarkdown.split('\n');

      for (const line of lines) {
        // Check if we need a new page
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }

        // Handle headings
        if (line.startsWith('# ')) {
          pdf.setFontSize(20);
          pdf.setFont('helvetica', 'bold');
          const text = line.substring(2);
          const splitText = pdf.splitTextToSize(text, maxWidth);
          pdf.text(splitText, margin, yPosition);
          yPosition += splitText.length * 10 + 5;
        } else if (line.startsWith('## ')) {
          pdf.setFontSize(16);
          pdf.setFont('helvetica', 'bold');
          const text = line.substring(3);
          const splitText = pdf.splitTextToSize(text, maxWidth);
          pdf.text(splitText, margin, yPosition);
          yPosition += splitText.length * 8 + 4;
        } else if (line.startsWith('### ')) {
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          const text = line.substring(4);
          const splitText = pdf.splitTextToSize(text, maxWidth);
          pdf.text(splitText, margin, yPosition);
          yPosition += splitText.length * 7 + 3;
        } else if (line.startsWith('#### ')) {
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          const text = line.substring(5);
          const splitText = pdf.splitTextToSize(text, maxWidth);
          pdf.text(splitText, margin, yPosition);
          yPosition += splitText.length * 6 + 3;
        } else if (line.trim() === '') {
          // Empty line - add spacing
          yPosition += 5;
        } else {
          // Regular text
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'normal');
          // Remove markdown formatting
          let text = line
            .replace(/\*\*(.+?)\*\*/g, '$1') // Bold
            .replace(/\*(.+?)\*/g, '$1') // Italic
            .replace(/`(.+?)`/g, '$1') // Inline code
            .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Links
            .replace(/^[-*+]\s+/, '  • ') // List items
            .replace(/^\d+\.\s+/, '  '); // Numbered lists

          const splitText = pdf.splitTextToSize(text, maxWidth);
          pdf.text(splitText, margin, yPosition);
          yPosition += splitText.length * 6 + 2;
        }
      }

      // Save PDF
      const filename = generateFilename('pdf');
      pdf.save(filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle button click
  const handleClick = () => {
    if (!reportMarkdown || isGenerating) {
      return;
    }

    if (format === 'markdown') {
      downloadMarkdown();
    } else {
      downloadPDF();
    }
  };

  // Determine button text
  const getButtonText = (): string => {
    if (isGenerating) {
      return 'Generating PDF...';
    }
    return format === 'markdown' ? 'Download Markdown' : 'Download PDF';
  };

  // Determine button color
  const getButtonColor = (): string => {
    if (format === 'markdown') {
      return 'bg-blue-600 hover:bg-blue-700';
    }
    return 'bg-green-600 hover:bg-green-700';
  };

  const isDisabled = !reportMarkdown || isGenerating;

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium transition-colors ${
          isDisabled
            ? 'bg-gray-400 cursor-not-allowed'
            : getButtonColor()
        }`}
      >
        {/* Download Icon */}
        {!isGenerating && (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        )}

        {/* Loading Spinner */}
        {isGenerating && (
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
        )}

        <span>{getButtonText()}</span>
      </button>

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-600 px-2">
          Error: {error}
        </div>
      )}
    </div>
  );
}
