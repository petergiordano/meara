'use client';

import { Dimension, getRatingColor } from '@/lib/types/dashboard';
import { useState } from 'react';

interface DimensionScoreCardProps {
  dimensionKey: string;
  dimension: Dimension;
  onExpand?: () => void;
}

export function DimensionScoreCard({ dimensionKey, dimension, onExpand }: DimensionScoreCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const ratingColor = getRatingColor(dimension.rating);
  const scorePercentage = dimension.score;

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (onExpand) onExpand();
  };

  // Rating emoji mapping
  const ratingEmoji = {
    'EXCEPTIONAL': '🌟',
    'COMPETENT': '✅',
    'NEEDS_IMPROVEMENT': '⚠️',
    'CRITICAL_GAP': '🔴'
  };

  return (
    <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-all">
      {/* Header with Score */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {dimension.name}
          </h3>
        </div>
        <div className="text-right ml-4">
          <div className="text-3xl font-bold" style={{ color: ratingColor }}>
            {dimension.score}
          </div>
          <div className="text-xs text-gray-500">/ 100</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${scorePercentage}%`,
              backgroundColor: ratingColor
            }}
          />
        </div>
      </div>

      {/* Rating Badge */}
      <div className="mb-4">
        <span
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold"
          style={{
            backgroundColor: `${ratingColor}15`,
            color: ratingColor
          }}
        >
          <span>{ratingEmoji[dimension.rating]}</span>
          <span>{dimension.rating.replace(/_/g, ' ')}</span>
        </span>
      </div>

      {/* Summary (if available) */}
      {dimension.summary && !isExpanded && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {dimension.summary}
        </p>
      )}

      {/* Expand/Collapse Button */}
      <button
        onClick={handleToggle}
        className="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center justify-center gap-2"
      >
        {isExpanded ? '▲ Show Less' : '▼ View Details'}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-gray-200 space-y-6 animate-fadeIn">
          {/* Full Summary */}
          {dimension.summary && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">📋 Summary</h4>
              <p className="text-gray-700 text-sm leading-relaxed">{dimension.summary}</p>
            </div>
          )}

          {/* Strengths */}
          {dimension.strengths && dimension.strengths.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">💪 Strengths</h4>
              <ul className="space-y-2">
                {dimension.strengths.map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-0.5">+</span>
                    <span className="text-gray-700 text-sm">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Opportunities */}
          {dimension.opportunities && dimension.opportunities.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">🚀 Opportunities</h4>
              <ul className="space-y-2">
                {dimension.opportunities.map((opportunity, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">→</span>
                    <span className="text-gray-700 text-sm">{opportunity}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Evidence (if available) */}
          {dimension.evidence && dimension.evidence.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">📎 Supporting Evidence</h4>
              <div className="space-y-3">
                {dimension.evidence.slice(0, 3).map((ev, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-md">
                    <p className="text-gray-700 text-xs leading-relaxed">{ev.finding}</p>
                    {ev.source && (
                      <p className="text-gray-500 text-xs mt-1 italic">Source: {ev.source}</p>
                    )}
                  </div>
                ))}
                {dimension.evidence.length > 3 && (
                  <p className="text-gray-500 text-xs italic">
                    + {dimension.evidence.length - 3} more evidence items
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
