'use client';

import { Recommendation } from '@/lib/types/dashboard';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Label } from 'recharts';

interface PriorityMatrixProps {
  recommendations: Recommendation[];
  onRecommendationClick?: (rec: Recommendation) => void;
}

// Map impact/effort to numerical values for chart
const impactValues = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
const effortValues = { HIGH: 3, MEDIUM: 2, LOW: 1 };

export function PriorityMatrix({ recommendations, onRecommendationClick }: PriorityMatrixProps) {
  // Transform recommendations into chart data
  const chartData = recommendations.map((rec) => ({
    x: effortValues[rec.effort],
    y: impactValues[rec.impact],
    z: rec.roi_score || 50, // Size of bubble
    name: rec.title,
    recommendation: rec,
    color: rec.quick_win ? '#10b981' : '#3b82f6' // Green for quick wins, blue for others
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-xs">
          <p className="font-semibold text-gray-900 mb-2">{data.name}</p>
          <div className="space-y-1 text-sm">
            <p className="text-gray-600">
              <span className="font-medium">Impact:</span> {data.recommendation.impact}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Effort:</span> {data.recommendation.effort}
            </p>
            {data.recommendation.roi_score && (
              <p className="text-gray-600">
                <span className="font-medium">ROI Score:</span> {data.recommendation.roi_score.toFixed(1)}/10
              </p>
            )}
          </div>
          {data.recommendation.quick_win && (
            <div className="mt-2 text-emerald-600 font-semibold text-xs">
              ⚡ Quick Win
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Priority Matrix</h3>
      <p className="text-gray-600 text-sm mb-6">
        Recommendations plotted by Impact (vertical) and Effort (horizontal).
        Green bubbles = Quick Wins (high impact, low effort).
      </p>

      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          <XAxis
            type="number"
            dataKey="x"
            name="Effort"
            domain={[0.5, 3.5]}
            ticks={[1, 2, 3]}
            tickFormatter={(value) => {
              const labels = { 1: 'LOW', 2: 'MEDIUM', 3: 'HIGH' };
              return labels[value as 1 | 2 | 3] || '';
            }}
          >
            <Label value="Effort Required" offset={-40} position="insideBottom" style={{ fill: '#6b7280', fontWeight: 600 }} />
          </XAxis>

          <YAxis
            type="number"
            dataKey="y"
            name="Impact"
            domain={[0.5, 4.5]}
            ticks={[1, 2, 3, 4]}
            tickFormatter={(value) => {
              const labels = { 1: 'LOW', 2: 'MEDIUM', 3: 'HIGH', 4: 'CRITICAL' };
              return labels[value as 1 | 2 | 3 | 4] || '';
            }}
          >
            <Label value="Business Impact" angle={-90} position="insideLeft" style={{ fill: '#6b7280', fontWeight: 600, textAnchor: 'middle' }} />
          </YAxis>

          <ZAxis type="number" dataKey="z" range={[400, 1000]} />

          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />

          <Scatter
            name="Recommendations"
            data={chartData}
            onClick={(data) => {
              if (onRecommendationClick && data.recommendation) {
                onRecommendationClick(data.recommendation);
              }
            }}
            style={{ cursor: onRecommendationClick ? 'pointer' : 'default' }}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
          <span className="text-gray-600">Quick Wins (High Impact, Low Effort)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          <span className="text-gray-600">Other Recommendations</span>
        </div>
      </div>

      {/* Quadrant Labels (overlay) */}
      <div className="text-xs text-gray-400 italic mt-4 text-center">
        <p>Upper Left = Quick Wins | Upper Right = Strategic Initiatives</p>
        <p>Lower Left = Minor Fixes | Lower Right = Deprioritize</p>
      </div>
    </div>
  );
}
