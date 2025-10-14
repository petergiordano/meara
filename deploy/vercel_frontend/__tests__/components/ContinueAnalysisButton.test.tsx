/**
 * Tests for ContinueAnalysisButton component
 * Sprint L.1 - Full Analysis Workflow
 *
 * Test Strategy (TDD):
 * 1. Test button rendering and initial state
 * 2. Test click handler and analysis start
 * 3. Test loading state during API call
 * 4. Test error handling
 * 5. Test disabled state
 * 6. Test callback on success
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContinueAnalysisButton from '@/components/ContinueAnalysisButton';
import * as railwayApi from '@/lib/railwayApi';

// Mock the Railway API
jest.mock('@/lib/railwayApi');

describe('ContinueAnalysisButton', () => {
  const mockOnAnalysisStarted = jest.fn();
  const mockDeepstackJobId = 'ds-job-123';
  const mockCompanyName = 'Acme Corp';
  const mockCompanyUrl = 'https://acme.com';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the button with correct text', () => {
      render(
        <ContinueAnalysisButton
          deepstackJobId={mockDeepstackJobId}
          companyName={mockCompanyName}
          companyUrl={mockCompanyUrl}
          onAnalysisStarted={mockOnAnalysisStarted}
        />
      );

      expect(
        screen.getByRole('button', { name: /continue to full analysis/i })
      ).toBeInTheDocument();
    });

    it('should show company name in button or tooltip', () => {
      const { container } = render(
        <ContinueAnalysisButton
          deepstackJobId={mockDeepstackJobId}
          companyName={mockCompanyName}
          companyUrl={mockCompanyUrl}
          onAnalysisStarted={mockOnAnalysisStarted}
        />
      );

      // Company name should be visible somewhere (button text or tooltip)
      expect(
        container.textContent?.includes(mockCompanyName) ||
          screen.queryByText(mockCompanyName)
      ).toBeTruthy();
    });

    it('should be disabled when disabled prop is true', () => {
      render(
        <ContinueAnalysisButton
          deepstackJobId={mockDeepstackJobId}
          companyName={mockCompanyName}
          companyUrl={mockCompanyUrl}
          onAnalysisStarted={mockOnAnalysisStarted}
          disabled={true}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should be enabled by default', () => {
      render(
        <ContinueAnalysisButton
          deepstackJobId={mockDeepstackJobId}
          companyName={mockCompanyName}
          companyUrl={mockCompanyUrl}
          onAnalysisStarted={mockOnAnalysisStarted}
        />
      );

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });
  });

  describe('Click handling', () => {
    it('should call startFullAnalysis API when clicked', async () => {
      const mockResponse = {
        analysis_job_id: 'analysis-456',
        status: 'queued' as const,
        estimated_time_minutes: 8,
        deepstack_job_id: mockDeepstackJobId,
      };

      (railwayApi.startFullAnalysis as jest.Mock).mockResolvedValue(
        mockResponse
      );

      render(
        <ContinueAnalysisButton
          deepstackJobId={mockDeepstackJobId}
          companyName={mockCompanyName}
          companyUrl={mockCompanyUrl}
          onAnalysisStarted={mockOnAnalysisStarted}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(railwayApi.startFullAnalysis).toHaveBeenCalledWith({
          company_name: mockCompanyName,
          company_url: mockCompanyUrl,
          deepstack_job_id: mockDeepstackJobId,
        });
      });
    });

    it('should call onAnalysisStarted callback with job ID on success', async () => {
      const mockResponse = {
        analysis_job_id: 'analysis-456',
        status: 'queued' as const,
        estimated_time_minutes: 8,
        deepstack_job_id: mockDeepstackJobId,
      };

      (railwayApi.startFullAnalysis as jest.Mock).mockResolvedValue(
        mockResponse
      );

      render(
        <ContinueAnalysisButton
          deepstackJobId={mockDeepstackJobId}
          companyName={mockCompanyName}
          companyUrl={mockCompanyUrl}
          onAnalysisStarted={mockOnAnalysisStarted}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockOnAnalysisStarted).toHaveBeenCalledWith('analysis-456');
      });
    });

    it('should not call API when button is disabled', () => {
      render(
        <ContinueAnalysisButton
          deepstackJobId={mockDeepstackJobId}
          companyName={mockCompanyName}
          companyUrl={mockCompanyUrl}
          onAnalysisStarted={mockOnAnalysisStarted}
          disabled={true}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(railwayApi.startFullAnalysis).not.toHaveBeenCalled();
    });
  });

  describe('Loading state', () => {
    it('should show loading state during API call', async () => {
      (railwayApi.startFullAnalysis as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  analysis_job_id: 'analysis-456',
                  status: 'queued',
                  estimated_time_minutes: 8,
                  deepstack_job_id: mockDeepstackJobId,
                }),
              100
            )
          )
      );

      render(
        <ContinueAnalysisButton
          deepstackJobId={mockDeepstackJobId}
          companyName={mockCompanyName}
          companyUrl={mockCompanyUrl}
          onAnalysisStarted={mockOnAnalysisStarted}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      // Should show loading indicator
      await waitFor(() => {
        expect(button).toBeDisabled();
      });

      // Should show loading text or spinner
      expect(
        button.textContent?.toLowerCase().includes('starting') ||
          button.textContent?.toLowerCase().includes('loading')
      ).toBeTruthy();
    });

    it('should disable button during API call', async () => {
      (railwayApi.startFullAnalysis as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(
        <ContinueAnalysisButton
          deepstackJobId={mockDeepstackJobId}
          companyName={mockCompanyName}
          companyUrl={mockCompanyUrl}
          onAnalysisStarted={mockOnAnalysisStarted}
        />
      );

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();

      fireEvent.click(button);

      await waitFor(() => {
        expect(button).toBeDisabled();
      });
    });

    it('should re-enable button after successful API call', async () => {
      const mockResponse = {
        analysis_job_id: 'analysis-456',
        status: 'queued' as const,
        estimated_time_minutes: 8,
        deepstack_job_id: mockDeepstackJobId,
      };

      (railwayApi.startFullAnalysis as jest.Mock).mockResolvedValue(
        mockResponse
      );

      render(
        <ContinueAnalysisButton
          deepstackJobId={mockDeepstackJobId}
          companyName={mockCompanyName}
          companyUrl={mockCompanyUrl}
          onAnalysisStarted={mockOnAnalysisStarted}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockOnAnalysisStarted).toHaveBeenCalled();
      });

      // Button should return to normal after success
      await waitFor(() => {
        expect(button).not.toBeDisabled();
      });
    });
  });

  describe('Error handling', () => {
    it('should display error message on API failure', async () => {
      const errorMessage = 'Failed to start analysis: Server error';
      (railwayApi.startFullAnalysis as jest.Mock).mockRejectedValue(
        new railwayApi.RailwayApiError(errorMessage, 500)
      );

      render(
        <ContinueAnalysisButton
          deepstackJobId={mockDeepstackJobId}
          companyName={mockCompanyName}
          companyUrl={mockCompanyUrl}
          onAnalysisStarted={mockOnAnalysisStarted}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });

    it('should not call onAnalysisStarted on error', async () => {
      (railwayApi.startFullAnalysis as jest.Mock).mockRejectedValue(
        new railwayApi.RailwayApiError('Server error', 500)
      );

      render(
        <ContinueAnalysisButton
          deepstackJobId={mockDeepstackJobId}
          companyName={mockCompanyName}
          companyUrl={mockCompanyUrl}
          onAnalysisStarted={mockOnAnalysisStarted}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });

      expect(mockOnAnalysisStarted).not.toHaveBeenCalled();
    });

    it('should allow retry after error', async () => {
      let callCount = 0;
      (railwayApi.startFullAnalysis as jest.Mock).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.reject(
            new railwayApi.RailwayApiError('Server error', 500)
          );
        }
        return Promise.resolve({
          analysis_job_id: 'analysis-456',
          status: 'queued' as const,
          estimated_time_minutes: 8,
          deepstack_job_id: mockDeepstackJobId,
        });
      });

      render(
        <ContinueAnalysisButton
          deepstackJobId={mockDeepstackJobId}
          companyName={mockCompanyName}
          companyUrl={mockCompanyUrl}
          onAnalysisStarted={mockOnAnalysisStarted}
        />
      );

      const button = screen.getByRole('button');

      // First attempt - should fail
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });

      // Second attempt - should succeed
      fireEvent.click(button);
      await waitFor(() => {
        expect(mockOnAnalysisStarted).toHaveBeenCalledWith('analysis-456');
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle missing props gracefully', () => {
      render(
        <ContinueAnalysisButton
          deepstackJobId=""
          companyName=""
          companyUrl=""
          onAnalysisStarted={mockOnAnalysisStarted}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should prevent double-clicking', async () => {
      const mockResponse = {
        analysis_job_id: 'analysis-456',
        status: 'queued' as const,
        estimated_time_minutes: 8,
        deepstack_job_id: mockDeepstackJobId,
      };

      (railwayApi.startFullAnalysis as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockResponse), 100))
      );

      render(
        <ContinueAnalysisButton
          deepstackJobId={mockDeepstackJobId}
          companyName={mockCompanyName}
          companyUrl={mockCompanyUrl}
          onAnalysisStarted={mockOnAnalysisStarted}
        />
      );

      const button = screen.getByRole('button');

      // Click twice rapidly (before first request completes)
      fireEvent.click(button);
      fireEvent.click(button);

      // Wait for requests to complete
      await waitFor(() => {
        expect(railwayApi.startFullAnalysis).toHaveBeenCalled();
      }, { timeout: 200 });

      // API should only be called once (second click ignored because button disabled)
      expect(railwayApi.startFullAnalysis).toHaveBeenCalledTimes(1);
    });
  });
});
