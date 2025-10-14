'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface ArrCompositionSegment {
  type: string
  value: number
  color: string
  tooltip: string
  percentage?: number
}

interface ArrData {
  currentValue: number
  composition: ArrCompositionSegment[]
  compositionPercentages?: ArrCompositionSegment[]
  logos?: string[]
  growthPatternSummary: string
}

interface ArrStackedBarProps {
  arrData: ArrData
  onBarClick?: () => void
  className?: string
}

/**
 * ArrStackedBar Component
 *
 * Displays ARR composition as a horizontal stacked bar chart.
 *
 * Features:
 * - Horizontal stacked bar showing ARR breakdown by type
 * - Segment colors from data
 * - Hover tooltip with segment details and client logos
 * - Click to open modal with growth pattern summary
 * - Current ARR value prominently displayed
 *
 * Design: Clean horizontal bar with Scale VP colors
 * Article VIII Compliance: Uses Recharts directly, no abstractions
 */
export function ArrStackedBar({
  arrData,
  onBarClick,
  className = ''
}: ArrStackedBarProps) {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null)

  // Use percentage data if available (from transformer)
  const segments = arrData.compositionPercentages || arrData.composition

  // Transform data for stacked bar - single row with all segments
  const barData = [{
    name: 'ARR',
    ...segments.reduce((acc, segment) => ({
      ...acc,
      [segment.type]: segment.value
    }), {})
  }]

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || payload.length === 0) return null

    const segment = segments.find(s => s.type === payload[0].name)
    if (!segment) return null

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-xs">
        <div className="font-semibold text-gray-900 mb-2">{segment.type}</div>
        <div className="text-2xl font-bold font-mono mb-2" style={{ color: segment.color }}>
          ${segment.value.toFixed(1)}M
          {segment.percentage && (
            <span className="text-sm text-gray-500 ml-2">
              ({segment.percentage.toFixed(1)}%)
            </span>
          )}
        </div>
        <div className="text-sm text-gray-600 leading-relaxed">
          {segment.tooltip}
        </div>
        {arrData.logos && arrData.logos.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-2">Key Clients:</div>
            <div className="flex gap-2">
              {arrData.logos.slice(0, 3).map((logo, idx) => (
                <div key={idx} className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-400">Logo</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Header */}
      <div className="mb-4">
        <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">
          Annual Recurring Revenue
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <div className="text-4xl font-bold font-mono" style={{ color: '#0A2A4C' }}>
            ${arrData.currentValue.toFixed(1)}M
          </div>
          <div className="text-lg text-gray-500">
            Current ARR
          </div>
        </div>
      </div>

      {/* Stacked Bar Chart */}
      <div
        className="w-full h-24 cursor-pointer hover:opacity-90 transition-opacity"
        onClick={onBarClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onBarClick?.()
          }
        }}
        aria-label="ARR composition chart. Click for growth pattern details."
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={barData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
          >
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip content={<CustomTooltip />} />
            {segments.map((segment, index) => (
              <Bar
                key={index}
                dataKey={segment.type}
                stackId="arr"
                fill={segment.color}
                radius={index === 0 ? [8, 0, 0, 8] : index === segments.length - 1 ? [0, 8, 8, 0] : 0}
                onMouseEnter={() => setHoveredSegment(segment.type)}
                onMouseLeave={() => setHoveredSegment(null)}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4">
        {segments.map((segment, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 transition-opacity ${
              hoveredSegment && hoveredSegment !== segment.type ? 'opacity-40' : 'opacity-100'
            }`}
          >
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: segment.color }}
            />
            <div className="text-sm">
              <span className="font-medium text-gray-700">{segment.type}</span>
              <span className="text-gray-500 ml-1 font-mono">
                ${segment.value.toFixed(1)}M
              </span>
              {segment.percentage && (
                <span className="text-gray-400 ml-1">
                  ({segment.percentage.toFixed(0)}%)
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Growth Pattern Summary */}
      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-2">
          <svg
            className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div className="flex-1">
            <div className="text-sm font-semibold text-amber-900 mb-1">
              Growth Pattern Analysis
            </div>
            <div className="text-sm text-amber-800 leading-relaxed">
              {arrData.growthPatternSummary}
            </div>
          </div>
        </div>
      </div>

      {/* Click affordance */}
      {onBarClick && (
        <div className="mt-3 text-xs text-gray-400 hover:text-gray-600 transition-colors text-center cursor-pointer">
          Click chart for detailed growth history →
        </div>
      )}
    </div>
  )
}
