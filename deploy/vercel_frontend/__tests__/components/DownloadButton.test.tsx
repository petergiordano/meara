/**
 * Tests for DownloadButton component
 * Sprint L.1 - Full Analysis Workflow
 *
 * Test Strategy (TDD):
 * 1. Test markdown download functionality
 * 2. Test PDF download functionality
 * 3. Test loading states during PDF generation
 * 4. Test error handling
 * 5. Test button rendering with different formats
 * 6. Test filename generation
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DownloadButton from '@/components/DownloadButton';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

// Mock file-saver
jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

// Mock jsPDF
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    text: jest.fn(),
    setFontSize: jest.fn(),
    setFont: jest.fn(),
    splitTextToSize: jest.fn((text) => [text]),
    internal: {
      pageSize: {
        width: 210,
        height: 297,
      },
    },
    save: jest.fn(),
  }));
});

describe('DownloadButton', () => {
  const mockCompanyName = 'Acme Corp';
  const mockReportMarkdown = `# MEARA Analysis Report for ${mockCompanyName}

## Executive Summary
This is a comprehensive analysis.

### Key Findings
- Finding 1
- Finding 2

## Detailed Analysis
Content here.`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render markdown download button', () => {
      render(
        <DownloadButton
          format="markdown"
          reportMarkdown={mockReportMarkdown}
          companyName={mockCompanyName}
        />
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText(/markdown/i)).toBeInTheDocument();
    });

    it('should render PDF download button', () => {
      render(
        <DownloadButton
          format="pdf"
          reportMarkdown={mockReportMarkdown}
          companyName={mockCompanyName}
        />
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText(/pdf/i)).toBeInTheDocument();
    });

    it('should display download icon', () => {
      const { container } = render(
        <DownloadButton
          format="markdown"
          reportMarkdown={mockReportMarkdown}
          companyName={mockCompanyName}
        />
      );

      // Should have an SVG icon
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should be enabled when report markdown is provided', () => {
      render(
        <DownloadButton
          format="markdown"
          reportMarkdown={mockReportMarkdown}
          companyName={mockCompanyName}
        />
      );

      expect(screen.getByRole('button')).not.toBeDisabled();
    });

    it('should be disabled when report markdown is empty', () => {
      render(
        <DownloadButton
          format="markdown"
          reportMarkdown=""
          companyName={mockCompanyName}
        />
      );

      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('Markdown download', () => {
    it('should download markdown file when clicked', async () => {
      render(
        <DownloadButton
          format="markdown"
          reportMarkdown={mockReportMarkdown}
          companyName={mockCompanyName}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(saveAs).toHaveBeenCalledTimes(1);
      });

      // Check that saveAs was called with a Blob and filename
      const saveAsCall = (saveAs as jest.Mock).mock.calls[0];
      expect(saveAsCall[0]).toBeInstanceOf(Blob);
      expect(saveAsCall[1]).toMatch(/acme-corp.*\.md$/i);
    });

    it('should create blob with correct markdown content', async () => {
      render(
        <DownloadButton
          format="markdown"
          reportMarkdown={mockReportMarkdown}
          companyName={mockCompanyName}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(saveAs).toHaveBeenCalledTimes(1);
      });

      const blob = (saveAs as jest.Mock).mock.calls[0][0] as Blob;
      expect(blob.type).toBe('text/markdown;charset=utf-8');

      // Check blob size matches content
      expect(blob.size).toBe(mockReportMarkdown.length);
    });

    it('should generate filename with sanitized company name', async () => {
      const companyWithSpaces = 'Acme Corp & Associates';

      render(
        <DownloadButton
          format="markdown"
          reportMarkdown={mockReportMarkdown}
          companyName={companyWithSpaces}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(saveAs).toHaveBeenCalledTimes(1);
      });

      const filename = (saveAs as jest.Mock).mock.calls[0][1];
      // Should replace spaces and special chars with hyphens
      expect(filename).toMatch(/acme-corp.*\.md$/i);
      expect(filename).not.toContain(' ');
      expect(filename).not.toContain('&');
    });

    it('should include timestamp in filename', async () => {
      render(
        <DownloadButton
          format="markdown"
          reportMarkdown={mockReportMarkdown}
          companyName={mockCompanyName}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(saveAs).toHaveBeenCalledTimes(1);
      });

      const filename = (saveAs as jest.Mock).mock.calls[0][1];
      // Should contain date/time
      expect(filename).toMatch(/\d{4}-\d{2}-\d{2}/);
    });
  });

  describe('PDF download', () => {
    it('should show loading state during PDF generation', async () => {
      render(
        <DownloadButton
          format="pdf"
          reportMarkdown={mockReportMarkdown}
          companyName={mockCompanyName}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      // Should show loading state
      expect(screen.getByText(/generating/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText(/generating/i)).not.toBeInTheDocument();
      });
    });

    it('should disable button during PDF generation', async () => {
      render(
        <DownloadButton
          format="pdf"
          reportMarkdown={mockReportMarkdown}
          companyName={mockCompanyName}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      // Button should be disabled during generation
      expect(button).toBeDisabled();

      await waitFor(() => {
        expect(button).not.toBeDisabled();
      });
    });

    it('should create jsPDF instance when clicked', async () => {
      render(
        <DownloadButton
          format="pdf"
          reportMarkdown={mockReportMarkdown}
          companyName={mockCompanyName}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(jsPDF).toHaveBeenCalledTimes(1);
      });
    });

    it('should call PDF save method with correct filename', async () => {
      const mockPdfInstance = {
        text: jest.fn(),
        setFontSize: jest.fn(),
        setFont: jest.fn(),
        splitTextToSize: jest.fn((text) => [text]),
        internal: {
          pageSize: {
            width: 210,
            height: 297,
          },
        },
        save: jest.fn(),
      };

      (jsPDF as jest.Mock).mockImplementation(() => mockPdfInstance);

      render(
        <DownloadButton
          format="pdf"
          reportMarkdown={mockReportMarkdown}
          companyName={mockCompanyName}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockPdfInstance.save).toHaveBeenCalledTimes(1);
      });

      const filename = mockPdfInstance.save.mock.calls[0][0];
      expect(filename).toMatch(/acme-corp.*\.pdf$/i);
    });

    it('should handle PDF generation errors gracefully', async () => {
      const mockPdfInstance = {
        text: jest.fn(),
        setFontSize: jest.fn(),
        setFont: jest.fn(),
        splitTextToSize: jest.fn(() => {
          throw new Error('PDF generation failed');
        }),
        internal: {
          pageSize: {
            width: 210,
            height: 297,
          },
        },
        save: jest.fn(),
      };

      (jsPDF as jest.Mock).mockImplementation(() => mockPdfInstance);

      render(
        <DownloadButton
          format="pdf"
          reportMarkdown={mockReportMarkdown}
          companyName={mockCompanyName}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });

      // Button should be enabled again
      expect(button).not.toBeDisabled();
    });

    it('should convert markdown content for PDF', async () => {
      const mockPdfInstance = {
        text: jest.fn(),
        setFontSize: jest.fn(),
        setFont: jest.fn(),
        splitTextToSize: jest.fn((text) => [text]),
        internal: {
          pageSize: {
            width: 210,
            height: 297,
          },
        },
        save: jest.fn(),
      };

      (jsPDF as jest.Mock).mockImplementation(() => mockPdfInstance);

      render(
        <DownloadButton
          format="pdf"
          reportMarkdown={mockReportMarkdown}
          companyName={mockCompanyName}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockPdfInstance.text).toHaveBeenCalled();
      });

      // Should have set font sizes for headers
      expect(mockPdfInstance.setFontSize).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty company name', async () => {
      render(
        <DownloadButton
          format="markdown"
          reportMarkdown={mockReportMarkdown}
          companyName=""
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(saveAs).toHaveBeenCalledTimes(1);
      });

      const filename = (saveAs as jest.Mock).mock.calls[0][1];
      // Should still generate a valid filename
      expect(filename).toMatch(/meara-report.*\.md$/i);
    });

    it('should handle very long markdown content', async () => {
      const longMarkdown = Array(1000)
        .fill('## Section\n\nContent here.\n\n')
        .join('');

      render(
        <DownloadButton
          format="markdown"
          reportMarkdown={longMarkdown}
          companyName={mockCompanyName}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(saveAs).toHaveBeenCalledTimes(1);
      });

      const blob = (saveAs as jest.Mock).mock.calls[0][0] as Blob;
      expect(blob.size).toBe(longMarkdown.length);
    });

    it('should handle special characters in company name', async () => {
      const specialName = 'Acme<Corp>/[Test]\\Company';

      render(
        <DownloadButton
          format="markdown"
          reportMarkdown={mockReportMarkdown}
          companyName={specialName}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(saveAs).toHaveBeenCalledTimes(1);
      });

      const filename = (saveAs as jest.Mock).mock.calls[0][1];
      // Should sanitize special characters
      expect(filename).not.toContain('<');
      expect(filename).not.toContain('>');
      expect(filename).not.toContain('/');
      expect(filename).not.toContain('\\');
      expect(filename).not.toContain('[');
      expect(filename).not.toContain(']');
    });

    it('should not trigger download when disabled', () => {
      render(
        <DownloadButton
          format="markdown"
          reportMarkdown=""
          companyName={mockCompanyName}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(saveAs).not.toHaveBeenCalled();
    });

    it('should handle multiple rapid clicks gracefully', async () => {
      render(
        <DownloadButton
          format="markdown"
          reportMarkdown={mockReportMarkdown}
          companyName={mockCompanyName}
        />
      );

      const button = screen.getByRole('button');

      // Click multiple times rapidly
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      await waitFor(() => {
        // Should only trigger once or protect against duplicate downloads
        expect(saveAs).toHaveBeenCalled();
      });
    });
  });

  describe('Button styling', () => {
    it('should have different styling for markdown vs PDF', () => {
      const { container: mdContainer } = render(
        <DownloadButton
          format="markdown"
          reportMarkdown={mockReportMarkdown}
          companyName={mockCompanyName}
        />
      );

      const { container: pdfContainer } = render(
        <DownloadButton
          format="pdf"
          reportMarkdown={mockReportMarkdown}
          companyName={mockCompanyName}
        />
      );

      const mdButton = mdContainer.querySelector('button');
      const pdfButton = pdfContainer.querySelector('button');

      // Buttons should exist and have class attributes
      expect(mdButton?.className).toBeTruthy();
      expect(pdfButton?.className).toBeTruthy();
    });

    it('should show disabled styling when disabled', () => {
      const { container } = render(
        <DownloadButton
          format="markdown"
          reportMarkdown=""
          companyName={mockCompanyName}
        />
      );

      const button = container.querySelector('button');
      expect(button).toHaveAttribute('disabled');
    });
  });
});
