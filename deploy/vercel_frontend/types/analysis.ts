/**
 * TypeScript type definitions for MEARA Full Analysis
 * Sprint L.1 - Full Analysis Workflow
 *
 * Constitution Compliance:
 * - Article VII (Simplicity): Direct types matching API contracts
 * - Article VIII (Anti-Abstraction): No unnecessary type wrappers
 */

/**
 * Analysis job status enum
 */
export type AnalysisStatus = 'queued' | 'running' | 'completed' | 'failed';

/**
 * Core analysis job model matching Railway backend response
 */
export interface AnalysisJob {
  analysis_job_id: string;
  status: AnalysisStatus;
  company_name: string;
  company_url: string;
  current_step: number;        // 1-15 (internal workflow steps)
  current_stage: number;       // 1-5 (user-facing stages)
  stage_name: string;          // e.g., "Preparing analysis"
  stage_icon: string;          // e.g., "🔬"
  progress: number;            // 0-100
  error: string | null;
  deepstack_job_id: string;
}

/**
 * Analysis report model matching Railway backend response
 */
export interface AnalysisReport {
  analysis_job_id: string;
  company_name: string;
  company_url: string;
  report_markdown: string;
  report_file: string;
}

/**
 * Progress stage metadata for UI display
 * Maps to STAGE_MAPPING in Railway backend
 */
export interface ProgressStage {
  stage: number;               // 1-5
  name: string;                // Display name
  icon: string;                // Emoji icon
  steps: number[];             // Which internal steps (1-15) belong to this stage
}

/**
 * Complete frontend state for full analysis workflow
 * Used by components and hooks
 */
export interface FullAnalysisState {
  // Job tracking
  analysisJobId: string | null;
  status: AnalysisStatus;
  error: string | null;

  // Progress tracking
  currentStep: number;
  currentStage: number;
  stageName: string;
  stageIcon: string;
  progress: number;
  estimatedMinutesRemaining: number;

  // Report data
  reportMarkdown: string | null;
  reportLoaded: boolean;

  // UI state
  isPolling: boolean;
  pollErrorCount: number;
  showReport: boolean;
  downloadingMD: boolean;
  downloadingPDF: boolean;

  // Metadata
  companyName: string;
  companyUrl: string;
  deepstackJobId: string;
}

/**
 * API request/response types for Railway backend
 */

export interface StartFullAnalysisRequest {
  company_name: string;
  company_url: string;
  deepstack_job_id: string;
  deep_research_brief_file?: File;
  additional_context_files?: File[];
}

export interface StartFullAnalysisResponse {
  analysis_job_id: string;
  status: 'queued';
  estimated_time_minutes: number;
  deepstack_job_id: string;
}

export interface AnalysisStatusResponse {
  analysis_job_id: string;
  status: AnalysisStatus;
  current_step: number;
  current_stage: number;
  stage_name: string;
  stage_icon: string;
  progress: number;
  estimated_minutes_remaining: number;
  error: string | null;
}

export interface AnalysisReportResponse {
  analysis_job_id: string;
  company_name: string;
  company_url: string;
  report_markdown: string;
  report_file: string;
  generated_at: string;
}

/**
 * Stage mapping constant - matches backend STAGE_MAPPING
 */
export const PROGRESS_STAGES: ProgressStage[] = [
  {
    stage: 1,
    name: "Preparing analysis",
    icon: "🔬",
    steps: [1, 2, 3]
  },
  {
    stage: 2,
    name: "Collecting evidence",
    icon: "📊",
    steps: [4, 5, 6]
  },
  {
    stage: 3,
    name: "Evaluating dimensions",
    icon: "📈",
    steps: [7, 8, 9, 10]
  },
  {
    stage: 4,
    name: "Building recommendations",
    icon: "💡",
    steps: [11, 12]
  },
  {
    stage: 5,
    name: "Finalizing report",
    icon: "📝",
    steps: [13, 14, 15]
  }
];

/**
 * Helper function to get stage info from step number
 */
export function getStageFromStep(step: number): ProgressStage | null {
  return PROGRESS_STAGES.find(stage => stage.steps.includes(step)) || null;
}
