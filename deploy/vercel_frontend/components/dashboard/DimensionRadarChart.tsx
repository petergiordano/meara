'use client';

import { Dimension } from '@/lib/types/dashboard';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

interface DimensionRadarChartProps {
  dimensions: Record<string, Dimension>;
}

export function DimensionRadarChart({ dimensions }: DimensionRadarChartProps) {
  // Transform dimensions into chart data
  const chartData = Object.entries(dimensions).map(([key, dim]) => ({
    dimension: shortenName(dim.name),
    fullName: dim.name,
    score: dim.score,
    rating: dim.rating
  }));

  // Shorten dimension names for chart labels
  function shortenName(name: string): string {
    const abbreviations: Record<string, string> = {
      'Market Positioning & Messaging': 'Market Position',
      'Buyer Journey Orchestration': 'Buyer Journey',
      'Market Presence & Visibility': 'Market Presence',
      'Audience Clarity & Segmentation': 'Audience Clarity',
      'Digital Experience Effectiveness': 'Digital Experience',
      'Competitive Positioning & Defense': 'Competitive Position',
      'Brand & Message Consistency': 'Brand Consistency',
      'Analytics & Measurement Framework': 'Analytics',
      'AI-Specific Authenticity': 'AI Authenticity'
    };

    return abbreviations[name] || name;
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const getRatingColor = (rating: string) => {
        switch (rating) {
          case 'EXCEPTIONAL': return '#0d71a9';
          case 'COMPETENT': return '#7da399';
          case 'NEEDS_IMPROVEMENT': return '#e5a819';
          case 'CRITICAL_GAP': return '#dc2626';
          default: return '#gray';
        }
      };

      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 text-sm mb-1">{data.fullName}</p>
          <p className="text-gray-700 text-sm">
            <span className="font-medium">Score:</span> {data.score}/100
          </p>
          <p className="text-sm" style={{ color: getRatingColor(data.rating) }}>
            <span className="font-medium">Rating:</span> {data.rating.replace(/_/g, ' ')}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Dimension Overview</h3>
      <p className="text-gray-600 text-sm mb-6">
        9-dimension radar chart showing overall marketing effectiveness profile.
      </p>

      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#9ca3af', fontSize: 10 }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#224f41"
            fill="#224f41"
            fillOpacity={0.5}
            strokeWidth={2}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>

      {/* Score Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#dc2626' }}></div>
          <span className="text-gray-600">0-40: Critical Gap</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#e5a819' }}></div>
          <span className="text-gray-600">41-65: Needs Improvement</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#7da399' }}></div>
          <span className="text-gray-600">66-85: Competent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#0d71a9' }}></div>
          <span className="text-gray-600">86-100: Exceptional</span>
        </div>
      </div>
    </div>
  );
}
