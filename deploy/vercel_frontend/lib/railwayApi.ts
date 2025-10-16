/**
 * Railway API Client for MEARA Backend
 * Sprint L.1 - Full Analysis Workflow
 *
 * Constitution Compliance:
 * - Article I (Library-First): Using native fetch API
 * - Article VII (Simplicity): Direct API calls, no abstraction layers
 * - Article VIII (Anti-Abstraction): No unnecessary wrappers
 *
 * Base URL: https://meara-production.up.railway.app
 */

import {
  StartFullAnalysisRequest,
  StartFullAnalysisResponse,
  AnalysisStatusResponse,
  AnalysisReportResponse,
} from '@/types/analysis';

/**
 * Base URL for Railway backend
 * In production: https://meara-production.up.railway.app
 * In development: Can be overridden via NEXT_PUBLIC_API_URL
 */
const RAILWAY_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://meara-production.up.railway.app';

/**
 * API timeout in milliseconds
 * Status endpoint: 5 seconds (fast polling)
 * Report endpoint: 10 seconds (larger payload)
 * Start analysis: 10 seconds
 */
const API_TIMEOUT_MS = {
  status: 5000,
  report: 10000,
  startAnalysis: 10000,
};

/**
 * Custom error class for Railway API errors
 */
export class RailwayApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'RailwayApiError';
  }
}

/**
 * Helper function to create fetch with timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new RailwayApiError(
        `Request timeout after ${timeoutMs}ms`,
        408,
        url
      );
    }
    throw error;
  }
}

/**
 * Start full MEARA analysis
 * POST /api/analyze/full
 *
 * @param request - Analysis request with company info and Deepstack job ID
 * @returns Analysis job ID and estimated time
 * @throws RailwayApiError if request fails
 */
export async function startFullAnalysis(
  request: StartFullAnalysisRequest
): Promise<StartFullAnalysisResponse> {
  const url = `${RAILWAY_API_BASE_URL}/api/analyze/full`;

  // Create FormData for multipart/form-data request
  const formData = new FormData();
  formData.append('deepstack_job_id', request.deepstack_job_id);

  // Add optional Deep Research Brief file
  if (request.deep_research_brief_file) {
    formData.append('deep_research_brief_file', request.deep_research_brief_file);
  }

  // Add optional additional context files
  // FastAPI expects multiple files with the same field name
  if (request.additional_context_files) {
    request.additional_context_files.forEach((file) => {
      formData.append('additional_context_files', file);
    });
  }

  try {
    const response = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        body: formData,
      },
      API_TIMEOUT_MS.startAnalysis
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new RailwayApiError(
        `Failed to start analysis: ${errorText}`,
        response.status,
        url
      );
    }

    const data = await response.json();
    return data as StartFullAnalysisResponse;
  } catch (error) {
    if (error instanceof RailwayApiError) {
      throw error;
    }
    throw new RailwayApiError(
      `Network error starting analysis: ${error instanceof Error ? error.message : 'Unknown error'}`,
      undefined,
      url
    );
  }
}

/**
 * Poll analysis status
 * GET /api/analysis/status/{analysis_job_id}
 *
 * This endpoint is called every 2 seconds during analysis
 *
 * @param analysisJobId - Analysis job ID from startFullAnalysis
 * @returns Current status, progress, and stage info
 * @throws RailwayApiError if request fails
 */
export async function getAnalysisStatus(
  analysisJobId: string
): Promise<AnalysisStatusResponse> {
  const url = `${RAILWAY_API_BASE_URL}/api/analysis/status/${analysisJobId}`;

  try {
    const response = await fetchWithTimeout(
      url,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      API_TIMEOUT_MS.status
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new RailwayApiError(
        `Failed to get analysis status: ${errorText}`,
        response.status,
        url
      );
    }

    const data = await response.json();
    return data as AnalysisStatusResponse;
  } catch (error) {
    if (error instanceof RailwayApiError) {
      throw error;
    }
    throw new RailwayApiError(
      `Network error fetching status: ${error instanceof Error ? error.message : 'Unknown error'}`,
      undefined,
      url
    );
  }
}

/**
 * Fetch analysis report (when status = 'completed')
 * GET /api/analysis/report/{analysis_job_id}
 *
 * @param analysisJobId - Analysis job ID
 * @returns Full report with markdown content
 * @throws RailwayApiError if request fails or report not ready
 */
export async function getAnalysisReport(
  analysisJobId: string
): Promise<AnalysisReportResponse> {
  const url = `${RAILWAY_API_BASE_URL}/api/analysis/report/${analysisJobId}`;

  try {
    const response = await fetchWithTimeout(
      url,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      API_TIMEOUT_MS.report
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new RailwayApiError(
        `Failed to get analysis report: ${errorText}`,
        response.status,
        url
      );
    }

    const data = await response.json();
    return data as AnalysisReportResponse;
  } catch (error) {
    if (error instanceof RailwayApiError) {
      throw error;
    }
    throw new RailwayApiError(
      `Network error fetching report: ${error instanceof Error ? error.message : 'Unknown error'}`,
      undefined,
      url
    );
  }
}

/**
 * Health check for Railway backend
 * GET /health
 *
 * @returns true if backend is healthy
 */
export async function checkBackendHealth(): Promise<boolean> {
  const url = `${RAILWAY_API_BASE_URL}/health`;

  try {
    const response = await fetchWithTimeout(
      url,
      {
        method: 'GET',
      },
      3000
    );

    return response.ok;
  } catch {
    return false;
  }
}
