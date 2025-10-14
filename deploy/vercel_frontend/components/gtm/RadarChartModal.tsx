'use client'

import { useEffect, useRef } from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts'

interface GtmBreakdownItem {
  pillar: string
  score: number
  benchmark: number
}

interface RadarChartModalProps {
  isOpen: boolean
  onClose: () => void
  gtmBreakdown: GtmBreakdownItem[]
  companyName?: string
}

/**
 * RadarChartModal Component
 *
 * Reusable modal displaying GTM breakdown as a radar chart.
 * Compares company scores against benchmarks for 5 pillars.
 *
 * Features:
 * - 5-pillar radar chart (Lead Gen, MarTech, Data/Analytics, Playbook, Team)
 * - Company score (semi-transparent red) overlaid on benchmark (green)
 * - Modal overlay with smooth transitions
 * - Keyboard accessible (ESC to close)
 *
 * Design: Clean white modal with Scale VP colors
 * Article VIII Compliance: Uses Recharts directly, no abstractions
 */
export function RadarChartModal({
  isOpen,
  onClose,
  gtmBreakdown,
  companyName = 'Company'
}: RadarChartModalProps) {
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

  // Transform data for Recharts radar
  const radarData = gtmBreakdown.map(item => ({
    pillar: item.pillar,
    'Company Score': item.score,
    'Benchmark': item.benchmark
  }))

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="radar-modal-title"
    >
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-2xl w-full max-w-3xl mx-4 animate-scale-in"
        style={{ maxHeight: '90vh', overflow: 'auto' }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg flex items-center justify-between z-10">
          <h2
            id="radar-modal-title"
            className="text-2xl font-bold"
            style={{ color: '#0A2A4C' }}
          >
            GTM Scalability Breakdown
          </h2>
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
          {/* Description */}
          <p className="text-gray-600 mb-6">
            This radar chart compares <span className="font-semibold">{companyName}</span>'s GTM capabilities
            against industry benchmarks across five key pillars. Larger coverage indicates stronger GTM maturity.
          </p>

          {/* Radar Chart */}
          <div className="w-full h-96 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis
                  dataKey="pillar"
                  tick={{ fill: '#6C757D', fontSize: 14, fontWeight: 500 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: '#6C757D', fontSize: 12 }}
                />
                <Radar
                  name="Benchmark"
                  dataKey="Benchmark"
                  stroke="#4CAF50"
                  fill="#4CAF50"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Company Score"
                  dataKey="Company Score"
                  stroke="#DC3545"
                  fill="#DC3545"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: '20px',
                    fontSize: '14px',
                    fontWeight: 500
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Breakdown Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Pillar</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-center">Company Score</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-center">Benchmark</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-center">Gap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {gtmBreakdown.map((item, index) => {
                  const gap = item.score - item.benchmark
                  const gapColor = gap >= 0 ? '#4CAF50' : '#DC3545'
                  const gapSign = gap >= 0 ? '+' : ''

                  return (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{item.pillar}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-mono text-sm" style={{ color: '#DC3545' }}>
                          {item.score}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-mono text-sm" style={{ color: '#4CAF50' }}>
                          {item.benchmark}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-mono text-sm font-semibold" style={{ color: gapColor }}>
                          {gapSign}{gap}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Evidence Note */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              Evidence & Methodology
            </h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              Scores are based on comprehensive analysis of the company's marketing and sales infrastructure,
              including tech stack maturity, process documentation, team capabilities, and historical performance data.
              Benchmarks represent median scores for Series A/B B2B SaaS companies in Scale VP's portfolio.
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
