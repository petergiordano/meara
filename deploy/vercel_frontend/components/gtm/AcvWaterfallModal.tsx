'use client'

import { useEffect, useRef } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts'

interface AcvExpansionStep {
  label: string
  value: number
  justification: string
  isDecrease?: boolean
}

interface AcvExpansionData {
  baselineAcv: {
    value: number
    label: string
  }
  potentialAcv: {
    value: number
    label: string
  }
  steps: AcvExpansionStep[]
  totalIncrease?: number
  totalDecrease?: number
}

interface AcvWaterfallModalProps {
  isOpen: boolean
  onClose: () => void
  acvExpansion: AcvExpansionData
  companyName?: string
}

/**
 * AcvWaterfallModal Component
 *
 * Reusable modal displaying ACV expansion as a waterfall chart.
 * Shows baseline → incremental steps → potential ACV.
 *
 * Features:
 * - Waterfall chart with baseline, steps, and potential ACV
 * - Green bars for increases, red bars for decreases
 * - Hover tooltip with step justification
 * - Currency formatting with commas
 * - Modal overlay with smooth transitions
 * - Keyboard accessible (ESC to close)
 *
 * Design: Clean white modal with Scale VP green emphasis
 * Article VIII Compliance: Uses Recharts directly, no abstractions
 */
export function AcvWaterfallModal({
  isOpen,
  onClose,
  acvExpansion,
  companyName = 'Company'
}: AcvWaterfallModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Handle click outside modal to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  // Build waterfall data
  // Waterfall: baseline (full height) → steps (incremental) → potential (full height)
  let cumulativeValue = acvExpansion.baselineAcv.value

  const waterfallData = [
    {
      name: acvExpansion.baselineAcv.label,
      value: acvExpansion.baselineAcv.value,
      displayValue: acvExpansion.baselineAcv.value,
      start: 0,
      color: '#6C757D',
      type: 'baseline',
      justification: 'Current baseline annual contract value'
    },
    ...acvExpansion.steps.map((step) => {
      const start = cumulativeValue
      cumulativeValue += step.value
      return {
        name: step.label,
        value: Math.abs(step.value),
        displayValue: step.value,
        start: step.isDecrease ? cumulativeValue : start,
        color: step.isDecrease ? '#DC3545' : '#4CAF50',
        type: 'step',
        justification: step.justification,
        isDecrease: step.isDecrease
      }
    }),
    {
      name: acvExpansion.potentialAcv.label,
      value: acvExpansion.potentialAcv.value,
      displayValue: acvExpansion.potentialAcv.value,
      start: 0,
      color: '#4CAF50',
      type: 'potential',
      justification: 'Projected annual contract value with all improvements'
    }
  ]

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || payload.length === 0) return null

    const data = payload[0].payload

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-sm">
        <div className="font-semibold text-gray-900 mb-2">{data.name}</div>
        <div className="text-2xl font-bold font-mono mb-2" style={{ color: data.color }}>
          {data.isDecrease ? '-' : ''}${Math.abs(data.displayValue).toLocaleString()}
        </div>
        <div className="text-sm text-gray-600 leading-relaxed">
          {data.justification}
        </div>
        {data.type === 'step' && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Running Total: <span className="font-mono font-semibold text-gray-700">
                ${(data.start + data.displayValue).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Calculate total expansion
  const totalExpansion = acvExpansion.potentialAcv.value - acvExpansion.baselineAcv.value
  const totalExpansionPercentage = ((totalExpansion / acvExpansion.baselineAcv.value) * 100).toFixed(0)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="waterfall-modal-title"
    >
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-2xl w-full max-w-5xl mx-4 animate-scale-in"
        style={{ maxHeight: '90vh', overflow: 'auto' }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg flex items-center justify-between z-10">
          <div>
            <h2
              id="waterfall-modal-title"
              className="text-2xl font-bold"
              style={{ color: '#0A2A4C' }}
            >
              ACV Expansion Waterfall
            </h2>
            <div className="text-sm text-gray-600 mt-1">
              {companyName} - Baseline to Potential ACV
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Baseline ACV */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Baseline ACV
              </div>
              <div className="text-2xl font-bold font-mono text-gray-700">
                ${acvExpansion.baselineAcv.value.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {acvExpansion.baselineAcv.label}
              </div>
            </div>

            {/* Total Expansion */}
            <div className="p-4 border-2 rounded-lg" style={{
              backgroundColor: '#4CAF5010',
              borderColor: '#4CAF50'
            }}>
              <div className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: '#4CAF50' }}>
                Total Expansion
              </div>
              <div className="text-2xl font-bold font-mono" style={{ color: '#4CAF50' }}>
                +${totalExpansion.toLocaleString()}
              </div>
              <div className="text-xs font-medium mt-1" style={{ color: '#2E7D32' }}>
                +{totalExpansionPercentage}% Growth
              </div>
            </div>

            {/* Potential ACV */}
            <div className="p-4 border-2 rounded-lg" style={{
              backgroundColor: '#4CAF5010',
              borderColor: '#4CAF50'
            }}>
              <div className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: '#4CAF50' }}>
                Potential ACV
              </div>
              <div className="text-2xl font-bold font-mono" style={{ color: '#4CAF50' }}>
                ${acvExpansion.potentialAcv.value.toLocaleString()}
              </div>
              <div className="text-xs font-medium mt-1" style={{ color: '#2E7D32' }}>
                {acvExpansion.potentialAcv.label}
              </div>
            </div>
          </div>

          {/* Waterfall Chart */}
          <div className="w-full h-96 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={waterfallData}
                margin={{ top: 20, right: 30, left: 60, bottom: 80 }}
              >
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fill: '#6C757D', fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: '#6C757D', fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {waterfallData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList
                    dataKey="displayValue"
                    position="top"
                    formatter={(value: number) => `$${Math.abs(value).toLocaleString()}`}
                    style={{ fill: '#343A40', fontSize: 12, fontWeight: 600 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Steps Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Step</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-center">Impact</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Justification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Baseline Row */}
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {acvExpansion.baselineAcv.label}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-mono text-sm text-gray-700">
                      ${acvExpansion.baselineAcv.value.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    Current baseline annual contract value
                  </td>
                </tr>

                {/* Step Rows */}
                {acvExpansion.steps.map((step, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {step.label}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className="font-mono text-sm font-semibold"
                        style={{ color: step.isDecrease ? '#DC3545' : '#4CAF50' }}
                      >
                        {step.isDecrease ? '-' : '+'}${Math.abs(step.value).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 leading-relaxed">
                      {step.justification}
                    </td>
                  </tr>
                ))}

                {/* Potential Row */}
                <tr className="bg-green-50 border-t-2" style={{ borderTopColor: '#4CAF50' }}>
                  <td className="px-4 py-3 font-bold" style={{ color: '#2E7D32' }}>
                    {acvExpansion.potentialAcv.label}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-mono text-sm font-bold" style={{ color: '#4CAF50' }}>
                      ${acvExpansion.potentialAcv.value.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: '#2E7D32' }}>
                    Projected annual contract value with all improvements
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Evidence Note */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              Expansion Methodology
            </h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              ACV expansion projections are based on analysis of pricing architecture, feature gaps, customer segments,
              and competitive positioning. Each step represents a specific, actionable opportunity with supporting evidence
              from the company's current GTM infrastructure and market positioning.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-lg flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: '#0A2A4C',
              color: '#FFFFFF'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0d3354'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#0A2A4C'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
