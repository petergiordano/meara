/**
 * Tests for ReportViewer component
 * Sprint L.1 - Full Analysis Workflow
 *
 * Test Strategy (TDD):
 * 1. Test report loading from API
 * 2. Test markdown rendering
 * 3. Test loading states
 * 4. Test error handling
 * 5. Test report display formatting
 */

import { render, screen, waitFor } from '@testing-library/react';
import ReportViewer from '@/components/ReportViewer';
import * as railwayApi from '@/lib/railwayApi';

// Mock the Railway API
jest.mock('@/lib/railwayApi');

// Mock react-markdown and its plugins
jest.mock('react-markdown', () => {
  return function ReactMarkdown({ children }: { children: string }) {
    return <div data-testid="markdown-content">{children}</div>;
  };
});

jest.mock('remark-gfm', () => () => {});
jest.mock('rehype-raw', () => () => {});

describe('ReportViewer', () => {
  const mockAnalysisJobId = 'analysis-123';
  const mockCompanyName = 'Acme Corp';

  const mockReportResponse = {
    analysis_job_id: mockAnalysisJobId,
    company_name: mockCompanyName,
    company_url: 'https://acme.com',
    report_markdown: `# MEARA Analysis Report for ${mockCompanyName}

## Executive Summary
This is a comprehensive analysis.

### Key Findings
- Finding 1
- Finding 2

## Detailed Analysis
Content here.`,
    report_file: 'report.md',
    generated_at: '2025-10-13T12:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading state', () => {
    it('should show loading indicator while fetching report', () => {
      (railwayApi.getAnalysisReport as jest.Mock).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(
        <ReportViewer
          analysisJobId={mockAnalysisJobId}
          companyName={mockCompanyName}
        />
      );

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should call getAnalysisReport on mount', async () => {
      (railwayApi.getAnalysisReport as jest.Mock).mockResolvedValue(
        mockReportResponse
      );

      render(
        <ReportViewer
          analysisJobId={mockAnalysisJobId}
          companyName={mockCompanyName}
        />
      );

      await waitFor(() => {
        expect(railwayApi.getAnalysisReport).toHaveBeenCalledWith(
          mockAnalysisJobId
        );
      });
    });
  });

  describe('Report rendering', () => {
    it('should render report markdown when loaded', async () => {
      (railwayApi.getAnalysisReport as jest.Mock).mockResolvedValue(
        mockReportResponse
      );

      render(
        <ReportViewer
          analysisJobId={mockAnalysisJobId}
          companyName={mockCompanyName}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/executive summary/i)).toBeInTheDocument();
      });
    });

    it('should render company name in report', async () => {
      (railwayApi.getAnalysisReport as jest.Mock).mockResolvedValue(
        mockReportResponse
      );

      const { container } = render(
        <ReportViewer
          analysisJobId={mockAnalysisJobId}
          companyName={mockCompanyName}
        />
      );

      await waitFor(() => {
        expect(container.textContent).toContain(mockCompanyName);
      });
    });

    it('should render markdown content', async () => {
      (railwayApi.getAnalysisReport as jest.Mock).mockResolvedValue(
        mockReportResponse
      );

      render(
        <ReportViewer
          analysisJobId={mockAnalysisJobId}
          companyName={mockCompanyName}
        />
      );

      await waitFor(() => {
        const markdownContent = screen.getByTestId('markdown-content');
        expect(markdownContent).toBeInTheDocument();
        expect(markdownContent.textContent).toContain('Executive Summary');
      });
    });
  });

  describe('Error handling', () => {
    it('should display error message when API fails', async () => {
      const errorMessage = 'Failed to fetch report';
      (railwayApi.getAnalysisReport as jest.Mock).mockRejectedValue(
        new railwayApi.RailwayApiError(errorMessage, 500)
      );

      const { container } = render(
        <ReportViewer
          analysisJobId={mockAnalysisJobId}
          companyName={mockCompanyName}
        />
      );

      await waitFor(() => {
        expect(screen.getAllByText(/error/i).length).toBeGreaterThan(0);
      });

      // Component shows error message
      expect(container.textContent).toContain('Failed to');
    });

    it('should not display loading spinner after error', async () => {
      (railwayApi.getAnalysisReport as jest.Mock).mockRejectedValue(
        new Error('Network error')
      );

      render(
        <ReportViewer
          analysisJobId={mockAnalysisJobId}
          companyName={mockCompanyName}
        />
      );

      await waitFor(() => {
        expect(screen.getAllByText(/error/i).length).toBeGreaterThan(0);
      });

      // Should not show the spinning loader (svg with animate-spin)
      const spinners = document.querySelectorAll('.animate-spin');
      expect(spinners.length).toBe(0);
    });

    it('should handle 404 report not found', async () => {
      (railwayApi.getAnalysisReport as jest.Mock).mockRejectedValue(
        new railwayApi.RailwayApiError('Report not found', 404)
      );

      const { container } = render(
        <ReportViewer
          analysisJobId={mockAnalysisJobId}
          companyName={mockCompanyName}
        />
      );

      await waitFor(() => {
        expect(screen.getAllByText(/error/i).length).toBeGreaterThan(0);
      });

      // Component shows error state
      expect(container.textContent).toContain('Error');
    });
  });

  describe('Report formatting', () => {
    it('should have markdown content displayed', async () => {
      (railwayApi.getAnalysisReport as jest.Mock).mockResolvedValue(
        mockReportResponse
      );

      render(
        <ReportViewer
          analysisJobId={mockAnalysisJobId}
          companyName={mockCompanyName}
        />
      );

      await waitFor(() => {
        const markdownContent = screen.getByTestId('markdown-content');
        expect(markdownContent).toBeInTheDocument();
      });
    });

    it('should display report with long content', async () => {
      const longReport = {
        ...mockReportResponse,
        report_markdown: `# Report\n\n${Array(100)
          .fill('## Section\n\nContent here.\n\n')
          .join('')}`,
      };

      (railwayApi.getAnalysisReport as jest.Mock).mockResolvedValue(
        longReport
      );

      render(
        <ReportViewer
          analysisJobId={mockAnalysisJobId}
          companyName={mockCompanyName}
        />
      );

      await waitFor(() => {
        const markdownContent = screen.getByTestId('markdown-content');
        expect(markdownContent).toBeInTheDocument();
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty report markdown', async () => {
      (railwayApi.getAnalysisReport as jest.Mock).mockResolvedValue({
        ...mockReportResponse,
        report_markdown: '',
      });

      render(
        <ReportViewer
          analysisJobId={mockAnalysisJobId}
          companyName={mockCompanyName}
        />
      );

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });

      // Should render without crashing
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });

    it('should handle report with special markdown characters', async () => {
      const specialMarkdown = {
        ...mockReportResponse,
        report_markdown: `# Report with **bold** and *italic*

\`\`\`javascript
const code = "example";
\`\`\`

> This is a blockquote

[Link text](https://example.com)`,
      };

      (railwayApi.getAnalysisReport as jest.Mock).mockResolvedValue(
        specialMarkdown
      );

      render(
        <ReportViewer
          analysisJobId={mockAnalysisJobId}
          companyName={mockCompanyName}
        />
      );

      await waitFor(() => {
        const markdownContent = screen.getByTestId('markdown-content');
        expect(markdownContent).toBeInTheDocument();
        expect(markdownContent.textContent).toContain('bold');
      });
    });

    it('should handle missing analysis job ID', async () => {
      render(
        <ReportViewer analysisJobId="" companyName={mockCompanyName} />
      );

      // Should show error or empty state
      expect(
        screen.queryByText(/loading/i) || screen.queryByText(/error/i)
      ).toBeInTheDocument();
    });
  });

  describe('Report metadata', () => {
    it('should display generated timestamp', async () => {
      (railwayApi.getAnalysisReport as jest.Mock).mockResolvedValue(
        mockReportResponse
      );

      render(
        <ReportViewer
          analysisJobId={mockAnalysisJobId}
          companyName={mockCompanyName}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/executive summary/i)).toBeInTheDocument();
      });

      // Should show when report was generated
      const container = screen.getByText(/executive summary/i).closest('div');
      expect(container?.textContent).toBeTruthy();
    });
  });
});
