/**
 * ProgressTracker Component
 * Sprint L.1 - Full Analysis Workflow
 *
 * Constitution Compliance:
 * - Article I (Library-First): Using useAnalysisPolling hook, React
 * - Article VII (Simplicity): Direct progress display, no complex animations
 * - Article VIII (Anti-Abstraction): Direct hook usage
 *
 * Shows real-time progress through 5 stages of full MEARA analysis
 */

'use client';

import { useEffect, useRef } from 'react';
import { useAnalysisPolling } from '@/hooks/useAnalysisPolling';

export interface ProgressTrackerProps {
  analysisJobId: string;
  onComplete: (reportReady: boolean) => void;
}

export default function ProgressTracker({
  analysisJobId,
  onComplete,
}: ProgressTrackerProps) {
  const {
    status,
    error,
    currentStep,
    currentStage,
    stageName,
    stageIcon,
    progress,
    estimatedMinutes,
    isPolling,
  } = useAnalysisPolling(analysisJobId);

  // Track if onComplete has been called
  const onCompleteCalledRef = useRef(false);

  // Call onComplete when status changes to completed or failed
  useEffect(() => {
    if (onCompleteCalledRef.current) {
      return;
    }

    if (status === 'completed') {
      onCompleteCalledRef.current = true;
      onComplete(true);
    } else if (status === 'failed') {
      onCompleteCalledRef.current = true;
      onComplete(false);
    }
  }, [status, onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Analysis in Progress
        </h2>
        {status === 'queued' && (
          <p className="text-gray-600">Queued - Starting soon...</p>
        )}
        {status === 'completed' && (
          <p className="text-green-600 font-medium">Analysis Complete! ✅</p>
        )}
        {status === 'failed' && (
          <p className="text-red-600 font-medium">Analysis Failed ❌</p>
        )}
      </div>

      {/* Current Stage */}
      {status === 'running' && stageName && (
        <div className="mb-4 flex items-center gap-3">
          <span className="text-4xl">{stageIcon}</span>
          <div>
            <p className="text-lg font-medium text-gray-800">{stageName}</p>
            <p className="text-sm text-gray-600">
              Stage {currentStage} of 5 • Step {currentStep} of 15
            </p>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-blue-600">{progress}%</span>
        </div>
        <div
          className="w-full bg-gray-200 rounded-full h-3 overflow-hidden"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Estimated Time */}
      {status === 'running' && estimatedMinutes > 0 && (
        <div className="mb-4 text-sm text-gray-600">
          <span>⏱️ Estimated time remaining: </span>
          <span className="font-medium">
            {estimatedMinutes} {estimatedMinutes === 1 ? 'minute' : 'minutes'}
          </span>
        </div>
      )}

      {/* Stage List */}
      <div className="space-y-2 mb-4">
        {[
          { num: 1, name: 'Preparing analysis', icon: '🔬' },
          { num: 2, name: 'Collecting evidence', icon: '📊' },
          { num: 3, name: 'Evaluating dimensions', icon: '📈' },
          { num: 4, name: 'Building recommendations', icon: '💡' },
          { num: 5, name: 'Finalizing report', icon: '📝' },
        ].map((stage) => (
          <div
            key={stage.num}
            className={`flex items-center gap-2 p-2 rounded ${
              currentStage === stage.num
                ? 'bg-blue-50 border border-blue-200'
                : currentStage > stage.num || status === 'completed'
                ? 'bg-green-50'
                : 'bg-gray-50'
            }`}
          >
            <span className="text-xl">{stage.icon}</span>
            <span
              className={`text-sm ${
                currentStage === stage.num
                  ? 'font-medium text-blue-700'
                  : currentStage > stage.num || status === 'completed'
                  ? 'text-green-700'
                  : 'text-gray-600'
              }`}
            >
              {stage.name}
            </span>
            {currentStage > stage.num || status === 'completed' ? (
              <span className="ml-auto text-green-600">✓</span>
            ) : currentStage === stage.num ? (
              <div className="ml-auto flex gap-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-75" />
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-150" />
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {/* Error Display */}
      {status === 'failed' && error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 font-medium mb-1">Error Details:</p>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Completion Message */}
      {status === 'completed' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 font-medium">
            🎉 Your comprehensive MEARA report is ready!
          </p>
        </div>
      )}

      {/* Polling Indicator */}
      {isPolling && (
        <div className="mt-4 text-xs text-gray-500 text-center">
          Live updates every 2 seconds
        </div>
      )}
    </div>
  );
}
