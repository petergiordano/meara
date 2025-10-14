'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

interface AcvValue {
  value: number
  label: string
}

interface StrategicOpportunityData {
  label: string
  summary: string
  acvExpansion: {
    baselineAcv: AcvValue
    potentialAcv: AcvValue
    totalIncrease?: number
    totalDecrease?: number
  }
}

interface StrategicOpportunityDonutProps {
  strategicOpportunity: StrategicOpportunityData
  onDonutClick?: () => void
  className?: string
}

/**
 * StrategicOpportunityDonut Component
 *
 * Displays strategic opportunity as a donut chart with inner/outer rings.
 * Inner ring = baseline ACV, Outer ring = potential ACV (emphasized).
 *
 * Features:
 * - Donut chart with two concentric rings
 * - Baseline ACV (muted gray) in inner ring
 * - Potential ACV (Scale Green with glow) in outer ring
 * - Click to open AcvWaterfallModal with expansion details
 * - Opportunity label badge (High/Medium/Low)
 *
 * Design: Clean donut with Scale VP green emphasis
 * Article VIII Compliance: Uses Recharts directly, no abstractions
 */
export function StrategicOpportunityDonut({
  strategicOpportunity,
  onDonutClick,
  className = ''
}: StrategicOpportunityDonutProps) {
  const { acvExpansion } = strategicOpportunity

  // Calculate growth percentage
  const growthPercentage = (
    ((acvExpansion.potentialAcv.value - acvExpansion.baselineAcv.value) /
    acvExpansion.baselineAcv.value) * 100
  ).toFixed(0)

  // Data for inner ring (baseline)
  const innerData = [
    { name: 'Baseline', value: acvExpansion.baselineAcv.value }
  ]

  // Data for outer ring (potential)
  const outerData = [
    { name: 'Potential', value: acvExpansion.potentialAcv.value }
  ]

  // Color mapping for opportunity labels
  const opportunityColors: Record<string, string> = {
    'Low': '#6C757D',
    'Medium': '#FFC107',
    'High': '#4CAF50',
    'Transformative': '#0A2A4C'
  }

  const opportunityColor = opportunityColors[strategicOpportunity.label] || '#4CAF50'

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Header */}
      <div className="w-full mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">
            Strategic Opportunity
          </div>
          <div
            className="px-2 py-1 rounded text-xs font-semibold uppercase"
            style={{
              backgroundColor: `${opportunityColor}20`,
              color: opportunityColor,
              border: `1px solid ${opportunityColor}`
            }}
          >
            {strategicOpportunity.label}
          </div>
        </div>
        <div className="text-sm text-gray-700 leading-relaxed">
          {strategicOpportunity.summary}
        </div>
      </div>

      {/* Donut Chart */}
      <div
        className="relative cursor-pointer hover:scale-105 transition-transform duration-200"
        onClick={onDonutClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onDonutClick?.()
          }
        }}
        aria-label={`ACV expansion from $${acvExpansion.baselineAcv.value.toLocaleString()} to $${acvExpansion.potentialAcv.value.toLocaleString()}. Click for details.`}
      >
        <ResponsiveContainer width={280} height={280}>
          <PieChart>
            {/* Inner ring - Baseline ACV (muted) */}
            <Pie
              data={innerData}
              cx={140}
              cy={140}
              innerRadius={60}
              outerRadius={90}
              dataKey="value"
              startAngle={90}
              endAngle={450}
            >
              <Cell fill="#9CA3AF" opacity={0.5} />
            </Pie>

            {/* Outer ring - Potential ACV (emphasized) */}
            <Pie
              data={outerData}
              cx={140}
              cy={140}
              innerRadius={100}
              outerRadius={130}
              dataKey="value"
              startAngle={90}
              endAngle={450}
            >
              <Cell
                fill="#4CAF50"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(76, 175, 80, 0.4))'
                }}
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            ACV Expansion
          </div>
          <div className="text-3xl font-bold" style={{ color: '#4CAF50' }}>
            +{growthPercentage}%
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Growth Potential
          </div>
        </div>
      </div>

      {/* ACV Values */}
      <div className="w-full mt-6 space-y-3">
        {/* Baseline ACV */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gray-400" />
            <div>
              <div className="text-xs text-gray-500">Baseline ACV</div>
              <div className="text-sm text-gray-600">{acvExpansion.baselineAcv.label}</div>
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-gray-700">
            ${acvExpansion.baselineAcv.value.toLocaleString()}
          </div>
        </div>

        {/* Growth Arrow */}
        <div className="flex items-center justify-center">
          <svg
            className="w-6 h-6"
            style={{ color: '#4CAF50' }}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
          </svg>
          {acvExpansion.totalIncrease && (
            <span className="ml-2 text-sm font-semibold" style={{ color: '#4CAF50' }}>
              +${acvExpansion.totalIncrease.toLocaleString()} potential increase
            </span>
          )}
        </div>

        {/* Potential ACV */}
        <div className="flex items-center justify-between p-3 rounded-lg border-2"
          style={{
            backgroundColor: '#4CAF5010',
            borderColor: '#4CAF50'
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: '#4CAF50',
                boxShadow: '0 0 6px rgba(76, 175, 80, 0.6)'
              }}
            />
            <div>
              <div className="text-xs font-medium" style={{ color: '#4CAF50' }}>
                Potential ACV
              </div>
              <div className="text-sm font-medium" style={{ color: '#2E7D32' }}>
                {acvExpansion.potentialAcv.label}
              </div>
            </div>
          </div>
          <div className="text-2xl font-bold font-mono" style={{ color: '#4CAF50' }}>
            ${acvExpansion.potentialAcv.value.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Click affordance */}
      {onDonutClick && (
        <div className="mt-4 text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
          Click for ACV expansion waterfall →
        </div>
      )}
    </div>
  )
}
