'use client';

import { Recommendation, getImpactColor } from '@/lib/types/dashboard';
import { useState } from 'react';

interface RecommendationCardProps {
  recommendation: Recommendation;
  rank?: number;
  onExpand?: () => void;
}

export function RecommendationCard({ recommendation, rank, onExpand }: RecommendationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const impactColor = getImpactColor(recommendation.impact);
  const effortColors = {
    HIGH: '#dc2626', // red
    MEDIUM: '#e5a819', // gold
    LOW: '#7da399' // sage green
  };
  const effortColor = effortColors[recommendation.effort];

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (onExpand) onExpand();
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {rank && (
            <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm font-semibold text-gray-700 mb-2">
              #{rank}
            </div>
          )}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {recommendation.title}
          </h3>
          {recommendation.summary && !isExpanded && (
            <p className="text-gray-600 text-sm">{recommendation.summary}</p>
          )}
        </div>

        {/* Quick Win Badge */}
        {recommendation.quick_win && (
          <div className="ml-4 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
            ⚡ Quick Win
          </div>
        )}
      </div>

      {/* Impact & Effort Metrics */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Impact:</span>
          <span
            className="px-3 py-1 rounded-full text-sm font-semibold"
            style={{
              backgroundColor: `${impactColor}15`,
              color: impactColor
            }}
          >
            {recommendation.impact}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Effort:</span>
          <span
            className="px-3 py-1 rounded-full text-sm font-semibold"
            style={{
              backgroundColor: `${effortColor}15`,
              color: effortColor
            }}
          >
            {recommendation.effort}
          </span>
        </div>

        {recommendation.roi_score !== undefined && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm font-medium text-gray-600">ROI Score:</span>
            <span className="text-lg font-bold" style={{ color: '#224f41' }}>
              {recommendation.roi_score.toFixed(1)}/10
            </span>
          </div>
        )}
      </div>

      {/* Category Tag */}
      <div className="mb-4">
        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
          {recommendation.category}
        </span>
      </div>

      {/* Expand/Collapse Button */}
      <button
        onClick={handleToggle}
        className="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center justify-center gap-2"
      >
        {isExpanded ? '▲ Show Less' : '▼ Show Details'}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-gray-200 space-y-6 animate-fadeIn">
          {/* Why */}
          {recommendation.why && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">📊 Why This Matters</h4>
              <p className="text-gray-700 text-sm leading-relaxed">{recommendation.why}</p>
            </div>
          )}

          {/* What */}
          {recommendation.what && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">🎯 What To Do</h4>
              <p className="text-gray-700 text-sm leading-relaxed">{recommendation.what}</p>
            </div>
          )}

          {/* How */}
          {recommendation.how && recommendation.how.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">✅ Implementation Steps</h4>
              <ol className="list-decimal list-inside space-y-2">
                {recommendation.how.map((step, idx) => (
                  <li key={idx} className="text-gray-700 text-sm leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Expected Outcome */}
          {recommendation.expected_outcome && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">🎉 Expected Outcome</h4>
              <p className="text-gray-700 text-sm leading-relaxed">{recommendation.expected_outcome}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
