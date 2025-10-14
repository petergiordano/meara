/**
 * Tests for ProgressTracker component
 * Sprint L.1 - Full Analysis Workflow
 *
 * Test Strategy (TDD):
 * 1. Test component rendering with polling hook
 * 2. Test progress bar updates
 * 3. Test stage transitions (1-5)
 * 4. Test completion callback
 * 5. Test error display
 * 6. Test estimated time display
 */

import { render, screen, waitFor } from '@testing-library/react';
import ProgressTracker from '@/components/ProgressTracker';
import * as useAnalysisPollingHook from '@/hooks/useAnalysisPolling';

// Mock the useAnalysisPolling hook
jest.mock('@/hooks/useAnalysisPolling');

describe('ProgressTracker', () => {
  const mockOnComplete = jest.fn();
  const mockAnalysisJobId = 'analysis-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with initial queued state', () => {
      (useAnalysisPollingHook.useAnalysisPolling as jest.Mock).mockReturnValue({
        status: 'queued',
        currentStep: 0,
        currentStage: 0,
        stageName: '',
        stageIcon: '',
        progress: 0,
        estimatedMinutes: 8,
        error: null,
        isPolling: true,
      });

      render(
        <ProgressTracker
          analysisJobId={mockAnalysisJobId}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText(/queued/i)).toBeInTheDocument();
    });

    it('should show progress bar', () => {
      (useAnalysisPollingHook.useAnalysisPolling as jest.Mock).mockReturnValue({
        status: 'running',
        currentStep: 5,
        currentStage: 2,
        stageName: 'Collecting evidence',
        stageIcon: '📊',
        progress: 33,
        estimatedMinutes: 6,
        error: null,
        isPolling: true,
      });

      const { container } = render(
        <ProgressTracker
          analysisJobId={mockAnalysisJobId}
          onComplete={mockOnComplete}
        />
      );

      // Should have progress bar element
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toBeInTheDocument();
    });

    it('should display current stage name and icon', () => {
      (useAnalysisPollingHook.useAnalysisPolling as jest.Mock).mockReturnValue({
        status: 'running',
        currentStep: 8,
        currentStage: 3,
        stageName: 'Evaluating dimensions',
        stageIcon: '📈',
        progress: 53,
        estimatedMinutes: 4,
        error: null,
        isPolling: true,
      });

      const { container } = render(
        <ProgressTracker
          analysisJobId={mockAnalysisJobId}
          onComplete={mockOnComplete}
        />
      );

      // Check that stage name appears (may be multiple times)
      expect(screen.getAllByText(/evaluating dimensions/i).length).toBeGreaterThan(0);
      expect(container.textContent).toContain('📈');
    });

    it('should show progress percentage', () => {
      (useAnalysisPollingHook.useAnalysisPolling as jest.Mock).mockReturnValue({
        status: 'running',
        currentStep: 11,
        currentStage: 4,
        stageName: 'Building recommendations',
        stageIcon: '💡',
        progress: 73,
        estimatedMinutes: 2,
        error: null,
        isPolling: true,
      });

      render(
        <ProgressTracker
          analysisJobId={mockAnalysisJobId}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText(/73%/)).toBeInTheDocument();
    });

    it('should display estimated time remaining', () => {
      (useAnalysisPollingHook.useAnalysisPolling as jest.Mock).mockReturnValue({
        status: 'running',
        currentStep: 7,
        currentStage: 3,
        stageName: 'Evaluating dimensions',
        stageIcon: '📈',
        progress: 46,
        estimatedMinutes: 5,
        error: null,
        isPolling: true,
      });

      render(
        <ProgressTracker
          analysisJobId={mockAnalysisJobId}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText(/5.*min/i)).toBeInTheDocument();
    });
  });

  describe('Progress updates', () => {
    it('should show all 5 stages', () => {
      const stages = [
        {
          status: 'running' as const,
          currentStage: 1,
          stageName: 'Preparing analysis',
          stageIcon: '🔬',
          progress: 6,
        },
        {
          status: 'running' as const,
          currentStage: 2,
          stageName: 'Collecting evidence',
          stageIcon: '📊',
          progress: 33,
        },
        {
          status: 'running' as const,
          currentStage: 3,
          stageName: 'Evaluating dimensions',
          stageIcon: '📈',
          progress: 53,
        },
        {
          status: 'running' as const,
          currentStage: 4,
          stageName: 'Building recommendations',
          stageIcon: '💡',
          progress: 73,
        },
        {
          status: 'completed' as const,
          currentStage: 5,
          stageName: 'Finalizing report',
          stageIcon: '📝',
          progress: 100,
        },
      ];

      stages.forEach((stage) => {
        (useAnalysisPollingHook.useAnalysisPolling as jest.Mock).mockReturnValue({
          ...stage,
          currentStep: 5,
          estimatedMinutes: 5,
          error: null,
          isPolling: stage.status !== 'completed',
        });

        const { unmount, container } = render(
          <ProgressTracker
            analysisJobId={mockAnalysisJobId}
            onComplete={mockOnComplete}
          />
        );

        // Stage name appears (may be multiple times in component)
        expect(screen.getAllByText(new RegExp(stage.stageName, 'i')).length).toBeGreaterThan(0);
        expect(container.textContent).toContain(stage.stageIcon);

        unmount();
      });
    });

    it('should update progress bar width based on progress', () => {
      const { container, rerender } = render(
        <ProgressTracker
          analysisJobId={mockAnalysisJobId}
          onComplete={mockOnComplete}
        />
      );

      // 33% progress
      (useAnalysisPollingHook.useAnalysisPolling as jest.Mock).mockReturnValue({
        status: 'running',
        currentStep: 5,
        currentStage: 2,
        stageName: 'Collecting evidence',
        stageIcon: '📊',
        progress: 33,
        estimatedMinutes: 6,
        error: null,
        isPolling: true,
      });

      rerender(
        <ProgressTracker
          analysisJobId={mockAnalysisJobId}
          onComplete={mockOnComplete}
        />
      );

      let progressBar = container.querySelector('[style*="width"]');
      expect(progressBar?.getAttribute('style')).toContain('33');

      // 73% progress
      (useAnalysisPollingHook.useAnalysisPolling as jest.Mock).mockReturnValue({
        status: 'running',
        currentStep: 11,
        currentStage: 4,
        stageName: 'Building recommendations',
        stageIcon: '💡',
        progress: 73,
        estimatedMinutes: 2,
        error: null,
        isPolling: true,
      });

      rerender(
        <ProgressTracker
          analysisJobId={mockAnalysisJobId}
          onComplete={mockOnComplete}
        />
      );

      progressBar = container.querySelector('[style*="width"]');
      expect(progressBar?.getAttribute('style')).toContain('73');
    });
  });

  describe('Completion', () => {
    it('should call onComplete when status is completed', async () => {
      (useAnalysisPollingHook.useAnalysisPolling as jest.Mock).mockReturnValue({
        status: 'completed',
        currentStep: 15,
        currentStage: 5,
        stageName: 'Finalizing report',
        stageIcon: '📝',
        progress: 100,
        estimatedMinutes: 0,
        error: null,
        isPolling: false,
      });

      render(
        <ProgressTracker
          analysisJobId={mockAnalysisJobId}
          onComplete={mockOnComplete}
        />
      );

      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledWith(true);
      });
    });

    it('should show completion message', () => {
      (useAnalysisPollingHook.useAnalysisPolling as jest.Mock).mockReturnValue({
        status: 'completed',
        currentStep: 15,
        currentStage: 5,
        stageName: 'Finalizing report',
        stageIcon: '📝',
        progress: 100,
        estimatedMinutes: 0,
        error: null,
        isPolling: false,
      });

      render(
        <ProgressTracker
          analysisJobId={mockAnalysisJobId}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText(/complete/i)).toBeInTheDocument();
    });

    it('should show 100% progress when completed', () => {
      (useAnalysisPollingHook.useAnalysisPolling as jest.Mock).mockReturnValue({
        status: 'completed',
        currentStep: 15,
        currentStage: 5,
        stageName: 'Finalizing report',
        stageIcon: '📝',
        progress: 100,
        estimatedMinutes: 0,
        error: null,
        isPolling: false,
      });

      render(
        <ProgressTracker
          analysisJobId={mockAnalysisJobId}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });

  describe('Error handling', () => {
    it('should display error message when status is failed', () => {
      (useAnalysisPollingHook.useAnalysisPolling as jest.Mock).mockReturnValue({
        status: 'failed',
        currentStep: 7,
        currentStage: 3,
        stageName: 'Evaluating dimensions',
        stageIcon: '📈',
        progress: 46,
        estimatedMinutes: 0,
        error: 'OpenAI API error: Rate limit exceeded',
        isPolling: false,
      });

      const { container } = render(
        <ProgressTracker
          analysisJobId={mockAnalysisJobId}
          onComplete={mockOnComplete}
        />
      );

      // Multiple elements may contain "error"
      expect(screen.getAllByText(/error/i).length).toBeGreaterThan(0);
      expect(container.textContent).toContain('Rate limit exceeded');
    });

    it('should call onComplete with false when failed', async () => {
      (useAnalysisPollingHook.useAnalysisPolling as jest.Mock).mockReturnValue({
        status: 'failed',
        currentStep: 7,
        currentStage: 3,
        stageName: 'Evaluating dimensions',
        stageIcon: '📈',
        progress: 46,
        estimatedMinutes: 0,
        error: 'Analysis failed',
        isPolling: false,
      });

      render(
        <ProgressTracker
          analysisJobId={mockAnalysisJobId}
          onComplete={mockOnComplete}
        />
      );

      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledWith(false);
      });
    });

    it('should show progress at time of failure', () => {
      (useAnalysisPollingHook.useAnalysisPolling as jest.Mock).mockReturnValue({
        status: 'failed',
        currentStep: 7,
        currentStage: 3,
        stageName: 'Evaluating dimensions',
        stageIcon: '📈',
        progress: 46,
        estimatedMinutes: 0,
        error: 'Analysis failed',
        isPolling: false,
      });

      render(
        <ProgressTracker
          analysisJobId={mockAnalysisJobId}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText(/46%/)).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should handle 0% progress', () => {
      (useAnalysisPollingHook.useAnalysisPolling as jest.Mock).mockReturnValue({
        status: 'queued',
        currentStep: 0,
        currentStage: 0,
        stageName: '',
        stageIcon: '',
        progress: 0,
        estimatedMinutes: 8,
        error: null,
        isPolling: true,
      });

      render(
        <ProgressTracker
          analysisJobId={mockAnalysisJobId}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('should handle missing stage information', () => {
      (useAnalysisPollingHook.useAnalysisPolling as jest.Mock).mockReturnValue({
        status: 'running',
        currentStep: 0,
        currentStage: 0,
        stageName: '',
        stageIcon: '',
        progress: 10,
        estimatedMinutes: 8,
        error: null,
        isPolling: true,
      });

      const { container } = render(
        <ProgressTracker
          analysisJobId={mockAnalysisJobId}
          onComplete={mockOnComplete}
        />
      );

      expect(container).toBeInTheDocument();
    });

    it('should only call onComplete once', async () => {
      (useAnalysisPollingHook.useAnalysisPolling as jest.Mock).mockReturnValue({
        status: 'completed',
        currentStep: 15,
        currentStage: 5,
        stageName: 'Finalizing report',
        stageIcon: '📝',
        progress: 100,
        estimatedMinutes: 0,
        error: null,
        isPolling: false,
      });

      const { rerender } = render(
        <ProgressTracker
          analysisJobId={mockAnalysisJobId}
          onComplete={mockOnComplete}
        />
      );

      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledTimes(1);
      });

      // Rerender with same completed state
      rerender(
        <ProgressTracker
          analysisJobId={mockAnalysisJobId}
          onComplete={mockOnComplete}
        />
      );

      // Should still only be called once
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });
  });
});
