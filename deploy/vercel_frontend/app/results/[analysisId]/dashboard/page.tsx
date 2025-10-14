'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardData } from '@/lib/types/dashboard';
import {
  RecommendationCard,
  DimensionScoreCard,
  PriorityMatrix,
  DimensionRadarChart
} from '@/components/dashboard';

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const analysisId = params.analysisId as string;

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_RAILWAY_API || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/analysis/dashboard/${analysisId}`, {
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    }

    if (analysisId) {
      fetchDashboardData();
    }
  }, [analysisId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Dashboard</h2>
          <p className="text-gray-600 mb-6">{error || 'Unknown error occurred'}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const { company_info, executive_summary, dimensions, root_causes, recommendations } = dashboardData;

  // Calculate overall health score (average of all dimensions)
  const dimensionScores = Object.values(dimensions).map(d => d.score);
  const overallScore = Math.round(dimensionScores.reduce((a, b) => a + b, 0) / dimensionScores.length);

  // Get health status color
  const getHealthColor = (score: number) => {
    if (score >= 86) return { color: '#0d71a9', label: 'Excellent', emoji: '🌟' };
    if (score >= 66) return { color: '#7da399', label: 'Good', emoji: '✅' };
    if (score >= 41) return { color: '#e5a819', label: 'Fair', emoji: '⚠️' };
    return { color: '#dc2626', label: 'Critical', emoji: '🔴' };
  };

  const healthStatus = getHealthColor(overallScore);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Company Info & View Toggle */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm animate-fadeIn">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{company_info.name}</h1>
              <p className="text-sm text-gray-600">Marketing Effectiveness Dashboard</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Overall Health Score */}
              <div className="text-center px-6 py-3 bg-gray-50 rounded-lg border border-gray-200 hover-lift">
                <div className="text-xs font-medium text-gray-600 mb-1">Overall Score</div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold animate-countUp" style={{ color: healthStatus.color }}>
                    {overallScore}
                  </span>
                  <span className="text-lg text-gray-400">/100</span>
                  <span className="text-2xl">{healthStatus.emoji}</span>
                </div>
                <div className="text-xs font-semibold mt-1" style={{ color: healthStatus.color }}>
                  {healthStatus.label}
                </div>
              </div>

              {/* View Toggle */}
              <button
                onClick={() => router.push(`/results/${analysisId}`)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-smooth flex items-center gap-2 hover-lift"
              >
                📄 View Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Executive Summary Section - 30 Second Scan */}
        <section className="mb-12 animate-fadeIn">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Executive Summary</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
              30-second scan
            </span>
          </div>

          {/* Overall Verdict */}
          {executive_summary.overall_verdict && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6 hover-lift transition-smooth">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">💡</span> Key Insight
              </h3>
              <p className="text-gray-800 leading-relaxed">{executive_summary.overall_verdict}</p>
            </div>
          )}

          {/* Critical Issues Alert Banner */}
          {executive_summary.critical_issues.length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-600 rounded-lg p-6 mb-8 animate-fadeIn">
              <div className="flex items-start gap-3">
                <div className="text-3xl">🚨</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-900 mb-3">
                    {executive_summary.critical_issues.length} Critical Issue{executive_summary.critical_issues.length > 1 ? 's' : ''} Require Immediate Attention
                  </h3>
                  <div className="space-y-3">
                    {executive_summary.critical_issues.map((issue, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-4 border border-red-200 hover-lift transition-smooth">
                        <div className="flex items-start gap-2">
                          <span className="text-red-600 font-bold">{idx + 1}.</span>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{issue.title}</h4>
                            <p className="text-sm text-gray-700">{issue.business_impact}</p>
                            {issue.affected_dimensions && issue.affected_dimensions.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {issue.affected_dimensions.map((dim, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs font-medium">
                                    {dim}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top 3-5 Recommendations */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-3xl">🎯</span> Top Recommendations
            </h3>
            <div className="grid gap-4">
              {executive_summary.top_recommendations.map((rec, idx) => (
                <RecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  rank={idx + 1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Visual Analytics Section */}
        <section className="mb-12 animate-fadeIn">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-3xl">📊</span> Visual Analytics
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Priority Matrix */}
            <PriorityMatrix recommendations={executive_summary.top_recommendations} />

            {/* Dimension Radar Chart */}
            <DimensionRadarChart dimensions={dimensions} />
          </div>
        </section>

        {/* 9 Dimensions Deep Dive */}
        <section className="mb-12 animate-fadeIn">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-3xl">🔍</span> 9-Dimension Analysis
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(dimensions).map(([key, dimension]) => (
              <DimensionScoreCard
                key={key}
                dimensionKey={key}
                dimension={dimension}
              />
            ))}
          </div>
        </section>

        {/* Root Causes Section */}
        {root_causes && root_causes.length > 0 && (
          <section className="mb-12 animate-fadeIn">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-3xl">🔬</span> Root Cause Analysis
            </h2>

            <div className="grid gap-4">
              {root_causes.map((cause, idx) => (
                <div key={cause.id} className="bg-white border border-gray-200 rounded-lg p-6 hover-lift transition-smooth">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{cause.title}</h3>
                      <p className="text-gray-700 text-sm mb-3">{cause.description}</p>

                      {cause.affected_dimensions && cause.affected_dimensions.length > 0 && (
                        <div className="mb-3">
                          <span className="text-xs font-semibold text-gray-600">Affects:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {cause.affected_dimensions.map((dim, i) => (
                              <span key={i} className="px-2 py-1 bg-orange-50 text-orange-800 rounded text-xs font-medium">
                                {dim}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {cause.business_implications && (
                        <div className="bg-gray-50 rounded-md p-3 mt-3">
                          <p className="text-xs font-semibold text-gray-600 mb-1">Business Impact:</p>
                          <p className="text-sm text-gray-700">{cause.business_implications}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Complete Recommendations by Priority */}
        {recommendations && (
          <section className="mb-12 animate-fadeIn">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-3xl">💡</span> All Recommendations by Priority
            </h2>

            {/* Quick Wins */}
            {recommendations.quick_wins && recommendations.quick_wins.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-emerald-900 mb-4 flex items-center gap-2">
                  <span>⚡</span> Quick Wins (High Impact, Low Effort)
                </h3>
                <div className="grid gap-4">
                  {recommendations.quick_wins.map((rec) => (
                    <RecommendationCard key={rec.id} recommendation={rec} />
                  ))}
                </div>
              </div>
            )}

            {/* Strategic Initiatives */}
            {recommendations.strategic_initiatives && recommendations.strategic_initiatives.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <span>🚀</span> Strategic Initiatives (High Impact, High Effort)
                </h3>
                <div className="grid gap-4">
                  {recommendations.strategic_initiatives.map((rec) => (
                    <RecommendationCard key={rec.id} recommendation={rec} />
                  ))}
                </div>
              </div>
            )}

            {/* Minor Fixes */}
            {recommendations.minor_fixes && recommendations.minor_fixes.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <span>🔧</span> Minor Fixes (Low Impact, Low Effort)
                </h3>
                <div className="grid gap-4">
                  {recommendations.minor_fixes.map((rec) => (
                    <RecommendationCard key={rec.id} recommendation={rec} />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-600 text-sm mb-4">
            Analysis powered by <span className="font-semibold">MEARA</span> (Marketing Effectiveness Analysis Reporting Agent)
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => router.push(`/results/${analysisId}`)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-smooth text-sm font-medium hover-lift"
            >
              📄 View Full Report
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-smooth text-sm font-medium hover-lift"
            >
              🖨️ Print Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
