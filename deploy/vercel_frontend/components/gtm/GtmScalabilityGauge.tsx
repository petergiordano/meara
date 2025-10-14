'use client'

import { useState } from 'react'
import { PieChart, Pie, Cell } from 'recharts'

interface ColorThreshold {
  stop: number
  color: string
}

interface GtmScoreData {
  value: number
  maxValue: number
  label: string
  colorThresholds: ColorThreshold[]
  tooltip: string
  currentColor?: string
}

interface GtmScalabilityGaugeProps {
  gtmScore: GtmScoreData
  onGaugeClick?: () => void
  className?: string
}

/**
 * GtmScalabilityGauge Component
 *
 * Displays GTM scalability score as a half-circle gauge with animated needle.
 *
 * Features:
 * - Color zones based on thresholds (Red <20, Amber 20-50, Green >50)
 * - Animated needle on load
 * - Hover to display tooltip
 * - Click to open RadarChartModal
 *
 * Design: Half-circle gauge optimized for desktop display
 * Article VIII Compliance: Uses Recharts directly, no abstractions
 */
export function GtmScalabilityGauge({
  gtmScore,
  onGaugeClick,
  className = ''
}: GtmScalabilityGaugeProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  // Create gauge data from color thresholds
  // Recharts PieChart with startAngle=180 and endAngle=0 creates half-circle
  const gaugeData = gtmScore.colorThresholds.map((threshold, index) => {
    const previousStop = index > 0 ? gtmScore.colorThresholds[index - 1].stop : 0
    return {
      name: `zone-${index}`,
      value: threshold.stop - previousStop,
      color: threshold.color
    }
  })

  // Calculate needle angle (180 degrees = 0 score, 0 degrees = 100 score)
  const needleAngle = 180 - (gtmScore.value / gtmScore.maxValue) * 180

  // Determine score category for styling
  const scoreCategory =
    gtmScore.value < 20 ? 'critical' :
    gtmScore.value < 50 ? 'warning' :
    'good'

  const scoreCategoryColors = {
    critical: '#DC3545',
    warning: '#FFC107',
    good: '#4CAF50'
  }

  return (
    <div
      className={`relative flex flex-col items-center ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={onGaugeClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onGaugeClick?.()
        }
      }}
      aria-label={`GTM Scalability Score: ${gtmScore.value} out of ${gtmScore.maxValue}. ${gtmScore.label}. Click for details.`}
    >
      {/* Gauge Chart */}
      <div className="relative">
        <PieChart width={300} height={180}>
          <Pie
            data={gaugeData}
            cx={150}
            cy={150}
            startAngle={180}
            endAngle={0}
            innerRadius={90}
            outerRadius={140}
            paddingAngle={0}
            dataKey="value"
          >
            {gaugeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>

        {/* Animated Needle */}
        <div
          className="absolute bottom-0 left-1/2 origin-bottom transition-transform duration-1000 ease-out"
          style={{
            transform: `translateX(-50%) rotate(${needleAngle}deg)`,
            width: '4px',
            height: '120px',
            backgroundColor: '#343A40',
            borderRadius: '2px 2px 0 0'
          }}
        >
          {/* Needle tip (circle) */}
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
            style={{ backgroundColor: scoreCategoryColors[scoreCategory] }}
          />
        </div>

        {/* Center pivot point */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#343A40]"
          style={{ bottom: '-8px' }}
        />
      </div>

      {/* Score Display */}
      <div className="mt-4 text-center">
        <div className="text-5xl font-bold font-mono" style={{ color: scoreCategoryColors[scoreCategory] }}>
          {gtmScore.value}
          <span className="text-2xl text-gray-500 ml-1">/{gtmScore.maxValue}</span>
        </div>
        <div className="mt-2 text-lg font-semibold uppercase tracking-wide" style={{ color: '#0A2A4C' }}>
          {gtmScore.label}
        </div>
        <div className="mt-1 text-sm text-gray-500">
          GTM Scalability Score
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="absolute top-full mt-4 w-80 p-4 bg-white rounded-lg shadow-lg border border-gray-200 z-10 animate-fade-in"
          style={{
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          <div className="text-sm text-gray-700 leading-relaxed">
            {gtmScore.tooltip}
          </div>
          <div className="mt-2 text-xs text-gray-500 italic">
            Click gauge for detailed breakdown →
          </div>
        </div>
      )}

      {/* Click affordance */}
      {onGaugeClick && (
        <div className="mt-4 text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
          Click for detailed breakdown
        </div>
      )}
    </div>
  )
}
