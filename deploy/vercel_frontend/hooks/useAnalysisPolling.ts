/**
 * Custom hook for polling MEARA full analysis status
 * Sprint L.1 - Full Analysis Workflow
 *
 * Constitution Compliance:
 * - Article I (Library-First): Using React hooks
 * - Article VII (Simplicity): Direct polling, no complex state machines
 * - Article VIII (Anti-Abstraction): No unnecessary abstractions
 *
 * Polling Strategy:
 * - Poll every 2 seconds while status is 'queued' or 'running'
 * - Stop polling when status is 'completed' or 'failed'
 * - Retry up to 3 times on network errors
 * - Cleanup interval on unmount
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { getAnalysisStatus } from '@/lib/railwayApi';
import { AnalysisStatus } from '@/types/analysis';

export interface UseAnalysisPollingResult {
  // Status
  status: AnalysisStatus;
  error: string | null;

  // Progress
  currentStep: number;
  currentStage: number;
  stageName: string;
  stageIcon: string;
  progress: number;
  estimatedMinutes: number;

  // Polling state
  isPolling: boolean;
}

const POLL_INTERVAL_MS = 2000; // 2 seconds
const MAX_ERROR_COUNT = 3;

/**
 * Hook for polling analysis status
 *
 * @param analysisJobId - Analysis job ID from startFullAnalysis
 * @returns Current analysis status and progress
 */
export function useAnalysisPolling(
  analysisJobId: string
): UseAnalysisPollingResult {
  // State
  const [status, setStatus] = useState<AnalysisStatus>('queued');
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [stageName, setStageName] = useState('');
  const [stageIcon, setStageIcon] = useState('');
  const [progress, setProgress] = useState(0);
  const [estimatedMinutes, setEstimatedMinutes] = useState(0);
  const [isPolling, setIsPolling] = useState(false);

  // Refs for cleanup and error tracking
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const errorCountRef = useRef(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    // Don't poll if no job ID
    if (!analysisJobId) {
      return;
    }

    // Mark as mounted
    isMountedRef.current = true;
    setIsPolling(true);

    /**
     * Poll the analysis status endpoint
     */
    const pollStatus = async () => {
      try {
        const statusResponse = await getAnalysisStatus(analysisJobId);

        // Only update state if component is still mounted
        if (!isMountedRef.current) {
          return;
        }

        // Reset error count on successful poll
        errorCountRef.current = 0;

        // Update state from response
        setStatus(statusResponse.status);
        setCurrentStep(statusResponse.current_step || 0);
        setCurrentStage(statusResponse.current_stage || 0);
        setStageName(statusResponse.stage_name || '');
        setStageIcon(statusResponse.stage_icon || '');
        setProgress(statusResponse.progress || 0);
        setEstimatedMinutes(statusResponse.estimated_minutes_remaining || 0);

        // Set error if present in response
        if (statusResponse.error) {
          setError(statusResponse.error);
        }

        // Stop polling if analysis is complete or failed
        if (
          statusResponse.status === 'completed' ||
          statusResponse.status === 'failed'
        ) {
          setIsPolling(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      } catch (err) {
        // Increment error count
        errorCountRef.current += 1;

        // Only update state if component is still mounted
        if (!isMountedRef.current) {
          return;
        }

        // Stop polling after max errors
        if (errorCountRef.current >= MAX_ERROR_COUNT) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to fetch analysis status after multiple retries'
          );
          setIsPolling(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
        // Otherwise, continue polling (will retry on next interval)
      }
    };

    // Start polling immediately
    pollStatus();

    // Set up interval for subsequent polls
    intervalRef.current = setInterval(pollStatus, POLL_INTERVAL_MS);

    // Cleanup on unmount
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [analysisJobId]);

  return {
    status,
    error,
    currentStep,
    currentStage,
    stageName,
    stageIcon,
    progress,
    estimatedMinutes,
    isPolling,
  };
}
