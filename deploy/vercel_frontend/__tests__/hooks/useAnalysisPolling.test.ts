/**
 * Tests for useAnalysisPolling hook
 * Sprint L.1 - Full Analysis Workflow
 *
 * Test Strategy (TDD):
 * 1. Test polling lifecycle (start, poll, complete, stop)
 * 2. Test status transitions (queued → running → completed)
 * 3. Test error handling (network errors, failed status)
 * 4. Test polling interval (2 seconds)
 * 5. Test cleanup on unmount
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useAnalysisPolling } from '@/hooks/useAnalysisPolling';
import * as railwayApi from '@/lib/railwayApi';
import { AnalysisStatusResponse } from '@/types/analysis';

// Mock the Railway API
jest.mock('@/lib/railwayApi');

describe('useAnalysisPolling', () => {
  const mockAnalysisJobId = 'test-analysis-123';

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Initial state', () => {
    it('should start with initial polling state', () => {
      const mockStatusResponse: AnalysisStatusResponse = {
        analysis_job_id: mockAnalysisJobId,
        status: 'queued',
        current_step: 1,
        current_stage: 1,
        stage_name: 'Preparing analysis',
        stage_icon: '🔬',
        progress: 0,
        estimated_minutes_remaining: 8,
        error: null,
      };

      (railwayApi.getAnalysisStatus as jest.Mock).mockResolvedValue(
        mockStatusResponse
      );

      const { result } = renderHook(() =>
        useAnalysisPolling(mockAnalysisJobId)
      );

      expect(result.current.status).toBe('queued');
      expect(result.current.isPolling).toBe(true);
      expect(result.current.currentStep).toBe(0);
      expect(result.current.progress).toBe(0);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Polling lifecycle', () => {
    it('should start polling immediately on mount', async () => {
      const mockStatusResponse: AnalysisStatusResponse = {
        analysis_job_id: mockAnalysisJobId,
        status: 'running',
        current_step: 1,
        current_stage: 1,
        stage_name: 'Preparing analysis',
        stage_icon: '🔬',
        progress: 6,
        estimated_minutes_remaining: 8,
        error: null,
      };

      (railwayApi.getAnalysisStatus as jest.Mock).mockResolvedValue(
        mockStatusResponse
      );

      renderHook(() => useAnalysisPolling(mockAnalysisJobId));

      await waitFor(() => {
        expect(railwayApi.getAnalysisStatus).toHaveBeenCalledWith(
          mockAnalysisJobId
        );
      });
    });

    it('should poll every 2 seconds while status is queued or running', async () => {
      const mockStatusResponse: AnalysisStatusResponse = {
        analysis_job_id: mockAnalysisJobId,
        status: 'running',
        current_step: 5,
        current_stage: 2,
        stage_name: 'Collecting evidence',
        stage_icon: '📊',
        progress: 33,
        estimated_minutes_remaining: 6,
        error: null,
      };

      (railwayApi.getAnalysisStatus as jest.Mock).mockResolvedValue(
        mockStatusResponse
      );

      renderHook(() => useAnalysisPolling(mockAnalysisJobId));

      // Initial call
      await waitFor(() => {
        expect(railwayApi.getAnalysisStatus).toHaveBeenCalledTimes(1);
      });

      // Advance 2 seconds
      jest.advanceTimersByTime(2000);

      await waitFor(() => {
        expect(railwayApi.getAnalysisStatus).toHaveBeenCalledTimes(2);
      });

      // Advance another 2 seconds
      jest.advanceTimersByTime(2000);

      await waitFor(() => {
        expect(railwayApi.getAnalysisStatus).toHaveBeenCalledTimes(3);
      });
    });

    it('should stop polling when status is completed', async () => {
      let callCount = 0;
      (railwayApi.getAnalysisStatus as jest.Mock).mockImplementation(() => {
        callCount++;
        if (callCount <= 2) {
          return Promise.resolve({
            analysis_job_id: mockAnalysisJobId,
            status: 'running',
            current_step: 10,
            current_stage: 3,
            stage_name: 'Evaluating dimensions',
            stage_icon: '📈',
            progress: 66,
            estimated_minutes_remaining: 3,
            error: null,
          });
        }
        return Promise.resolve({
          analysis_job_id: mockAnalysisJobId,
          status: 'completed',
          current_step: 15,
          current_stage: 5,
          stage_name: 'Finalizing report',
          stage_icon: '📝',
          progress: 100,
          estimated_minutes_remaining: 0,
          error: null,
        });
      });

      const { result } = renderHook(() =>
        useAnalysisPolling(mockAnalysisJobId)
      );

      // Wait for initial poll
      await waitFor(() => {
        expect(result.current.status).toBe('running');
      });

      // Advance time for second poll
      jest.advanceTimersByTime(2000);

      await waitFor(() => {
        expect(railwayApi.getAnalysisStatus).toHaveBeenCalledTimes(2);
      });

      // Advance time for third poll (should return completed)
      jest.advanceTimersByTime(2000);

      await waitFor(() => {
        expect(result.current.status).toBe('completed');
        expect(result.current.isPolling).toBe(false);
        expect(result.current.progress).toBe(100);
      });

      // Advance time further - should NOT poll again
      jest.advanceTimersByTime(2000);

      await waitFor(() => {
        expect(railwayApi.getAnalysisStatus).toHaveBeenCalledTimes(3);
      });
    });

    it('should stop polling when status is failed', async () => {
      const mockFailedResponse: AnalysisStatusResponse = {
        analysis_job_id: mockAnalysisJobId,
        status: 'failed',
        current_step: 7,
        current_stage: 3,
        stage_name: 'Evaluating dimensions',
        stage_icon: '📈',
        progress: 46,
        estimated_minutes_remaining: 0,
        error: 'OpenAI API error: Rate limit exceeded',
      };

      (railwayApi.getAnalysisStatus as jest.Mock).mockResolvedValue(
        mockFailedResponse
      );

      const { result } = renderHook(() =>
        useAnalysisPolling(mockAnalysisJobId)
      );

      await waitFor(() => {
        expect(result.current.status).toBe('failed');
        expect(result.current.isPolling).toBe(false);
        expect(result.current.error).toBe(
          'OpenAI API error: Rate limit exceeded'
        );
      });
    });
  });

  describe('Status updates', () => {
    it('should update progress through all stages', async () => {
      const stages = [
        {
          status: 'running' as const,
          current_step: 1,
          current_stage: 1,
          stage_name: 'Preparing analysis',
          stage_icon: '🔬',
          progress: 6,
        },
        {
          status: 'running' as const,
          current_step: 4,
          current_stage: 2,
          stage_name: 'Collecting evidence',
          stage_icon: '📊',
          progress: 26,
        },
        {
          status: 'running' as const,
          current_step: 8,
          current_stage: 3,
          stage_name: 'Evaluating dimensions',
          stage_icon: '📈',
          progress: 53,
        },
        {
          status: 'running' as const,
          current_step: 11,
          current_stage: 4,
          stage_name: 'Building recommendations',
          stage_icon: '💡',
          progress: 73,
        },
        {
          status: 'completed' as const,
          current_step: 15,
          current_stage: 5,
          stage_name: 'Finalizing report',
          stage_icon: '📝',
          progress: 100,
        },
      ];

      let stageIndex = 0;
      (railwayApi.getAnalysisStatus as jest.Mock).mockImplementation(() => {
        const stage = stages[Math.min(stageIndex, stages.length - 1)];
        stageIndex++;
        return Promise.resolve({
          analysis_job_id: mockAnalysisJobId,
          ...stage,
          estimated_minutes_remaining: 8 - stageIndex * 2,
          error: null,
        });
      });

      const { result } = renderHook(() =>
        useAnalysisPolling(mockAnalysisJobId)
      );

      // Stage 1
      await waitFor(() => {
        expect(result.current.currentStage).toBe(1);
        expect(result.current.stageName).toBe('Preparing analysis');
        expect(result.current.stageIcon).toBe('🔬');
      });

      // Stage 2
      jest.advanceTimersByTime(2000);
      await waitFor(() => {
        expect(result.current.currentStage).toBe(2);
        expect(result.current.stageName).toBe('Collecting evidence');
      });

      // Stage 3
      jest.advanceTimersByTime(2000);
      await waitFor(() => {
        expect(result.current.currentStage).toBe(3);
        expect(result.current.stageName).toBe('Evaluating dimensions');
      });

      // Stage 4
      jest.advanceTimersByTime(2000);
      await waitFor(() => {
        expect(result.current.currentStage).toBe(4);
        expect(result.current.stageName).toBe('Building recommendations');
      });

      // Stage 5 - Completed
      jest.advanceTimersByTime(2000);
      await waitFor(() => {
        expect(result.current.status).toBe('completed');
        expect(result.current.currentStage).toBe(5);
        expect(result.current.progress).toBe(100);
        expect(result.current.isPolling).toBe(false);
      });
    });
  });

  describe('Error handling', () => {
    it('should handle network errors and retry', async () => {
      let callCount = 0;
      (railwayApi.getAnalysisStatus as jest.Mock).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.reject(
            new railwayApi.RailwayApiError('Network error', 500)
          );
        }
        return Promise.resolve({
          analysis_job_id: mockAnalysisJobId,
          status: 'running',
          current_step: 5,
          current_stage: 2,
          stage_name: 'Collecting evidence',
          stage_icon: '📊',
          progress: 33,
          estimated_minutes_remaining: 6,
          error: null,
        });
      });

      const { result } = renderHook(() =>
        useAnalysisPolling(mockAnalysisJobId)
      );

      // Wait for first failed attempt
      await waitFor(() => {
        expect(railwayApi.getAnalysisStatus).toHaveBeenCalledTimes(1);
      });

      // Advance time to trigger retry
      jest.advanceTimersByTime(2000);

      // Should retry and succeed after network error
      await waitFor(() => {
        expect(result.current.status).toBe('running');
        expect(railwayApi.getAnalysisStatus).toHaveBeenCalledTimes(2);
      });
    });

    it('should stop polling after 3 consecutive errors', async () => {
      (railwayApi.getAnalysisStatus as jest.Mock).mockRejectedValue(
        new railwayApi.RailwayApiError('Network error', 500)
      );

      const { result } = renderHook(() =>
        useAnalysisPolling(mockAnalysisJobId)
      );

      // Wait for initial poll
      await waitFor(() => {
        expect(railwayApi.getAnalysisStatus).toHaveBeenCalledTimes(1);
      });

      // Advance for second attempt
      jest.advanceTimersByTime(2000);
      await waitFor(() => {
        expect(railwayApi.getAnalysisStatus).toHaveBeenCalledTimes(2);
      });

      // Advance for third attempt
      jest.advanceTimersByTime(2000);
      await waitFor(() => {
        expect(railwayApi.getAnalysisStatus).toHaveBeenCalledTimes(3);
      });

      // Should stop polling after 3 errors
      await waitFor(() => {
        expect(result.current.isPolling).toBe(false);
        expect(result.current.error).toBeTruthy();
      });

      // Should NOT poll again
      jest.advanceTimersByTime(2000);
      expect(railwayApi.getAnalysisStatus).toHaveBeenCalledTimes(3);
    });
  });

  describe('Cleanup', () => {
    it('should stop polling on unmount', async () => {
      (railwayApi.getAnalysisStatus as jest.Mock).mockResolvedValue({
        analysis_job_id: mockAnalysisJobId,
        status: 'running',
        current_step: 5,
        current_stage: 2,
        stage_name: 'Collecting evidence',
        stage_icon: '📊',
        progress: 33,
        estimated_minutes_remaining: 6,
        error: null,
      });

      const { unmount } = renderHook(() =>
        useAnalysisPolling(mockAnalysisJobId)
      );

      await waitFor(() => {
        expect(railwayApi.getAnalysisStatus).toHaveBeenCalledTimes(1);
      });

      // Unmount the hook
      unmount();

      // Advance time - should NOT poll again
      jest.advanceTimersByTime(2000);
      expect(railwayApi.getAnalysisStatus).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge cases', () => {
    it('should handle missing analysis job ID', () => {
      const { result } = renderHook(() => useAnalysisPolling(''));

      expect(result.current.isPolling).toBe(false);
      expect(railwayApi.getAnalysisStatus).not.toHaveBeenCalled();
    });

    it('should handle malformed status response gracefully', async () => {
      (railwayApi.getAnalysisStatus as jest.Mock).mockResolvedValue({
        analysis_job_id: mockAnalysisJobId,
        status: 'running',
        // Missing required fields
      });

      const { result } = renderHook(() =>
        useAnalysisPolling(mockAnalysisJobId)
      );

      await waitFor(() => {
        expect(result.current.status).toBe('running');
        // Should have default values for missing fields
        expect(result.current.currentStep).toBeDefined();
        expect(result.current.progress).toBeDefined();
      });
    });
  });
});
