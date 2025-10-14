'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { GtmScalabilityGauge } from '@/components/gtm/GtmScalabilityGauge'
import { RadarChartModal } from '@/components/gtm/RadarChartModal'
import { ArrStackedBar } from '@/components/gtm/ArrStackedBar'
import { StrategicOpportunityDonut } from '@/components/gtm/StrategicOpportunityDonut'
import { AcvWaterfallModal } from '@/components/gtm/AcvWaterfallModal'

interface GtmDashboardData {
  companyName: string
  gtmScore: {
    value: number
    maxValue: number
    label: string
    colorThresholds: Array<{ stop: number; color: string }>
    tooltip: string
    currentColor: string
  }
  gtmBreakdown: Array<{
    pillar: string
    score: number
    benchmark: number
  }>
  arrData: {
    currentValue: number
    composition: Array<{
      type: string
      value: number
      color: string
      tooltip: string
      percentage?: number
    }>
    compositionPercentages?: Array<{
      type: string
      value: number
      color: string
      tooltip: string
      percentage: number
    }>
    logos?: string[]
    growthPatternSummary: string
  }
  strategicOpportunity: {
    label: string
    summary: string
    acvExpansion: {
      baselineAcv: {
        value: number
        label: string
      }
      potentialAcv: {
        value: number
        label: string
      }
      steps: Array<{
        label: string
        value: number
        justification: string
        isDecrease?: boolean
      }>
      totalIncrease?: number
      totalDecrease?: number
    }
  }
}

/**
 * GTM Investment Dashboard - Executive Thesis Section
 *
 * Section 1 of 6: Pre-investment GTM scalability assessment
 *
 * Features:
 * - GTM Scalability Gauge with 5-pillar radar breakdown
 * - ARR Composition stacked bar with growth pattern analysis
 * - Strategic Opportunity donut with ACV expansion waterfall
 * - Two-column responsive layout
 * - Loading and error states
 * - Modal interactions for detailed views
 *
 * Design: Scale VP brand colors, clean desktop-optimized interface
 * Article VIII Compliance: Uses components directly, no abstractions
 */
export default function GtmDashboardPage() {
  const params = useParams()
  const companyId = params.companyId as string

  const [data, setData] = useState<GtmDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal state
  const [radarModalOpen, setRadarModalOpen] = useState(false)
  const [waterfallModalOpen, setWaterfallModalOpen] = useState(false)

  // Fetch GTM dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        const apiUrl = process.env.NEXT_PUBLIC_RAILWAY_API || 'http://localhost:8000'
        const response = await fetch(`${apiUrl}/api/gtm/dashboard/${companyId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch dashboard data: ${response.statusText}`)
        }

        const dashboardData = await response.json()
        setData(dashboardData)
      } catch (err) {
        console.error('Error fetching GTM dashboard data:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (companyId) {
      fetchDashboardData()
    }
  }, [companyId])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#0A2A4C] mb-4"></div>
          <div className="text-lg text-gray-600">Loading GTM Dashboard...</div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border border-red-200">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Error Loading Dashboard
              </h3>
              <p className="text-sm text-red-700">
                {error || 'Failed to load GTM dashboard data. Please try again.'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#0A2A4C' }}>
                GTM Investment Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {data.companyName} - Pre-Investment Scalability Assessment
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-xs text-gray-400">Logo</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: '#0A2A4C' }}
            >
              1
            </div>
            <h2 className="text-2xl font-bold" style={{ color: '#0A2A4C' }}>
              Executive Thesis
            </h2>
          </div>
          <p className="text-gray-600 ml-13">
            Pre-investment assessment of GTM scalability, revenue composition, and expansion potential.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* GTM Scalability Gauge */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <GtmScalabilityGauge
                gtmScore={data.gtmScore}
                onGaugeClick={() => setRadarModalOpen(true)}
                className="w-full"
              />
            </div>

            {/* ARR Composition */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <ArrStackedBar
                arrData={data.arrData}
                onBarClick={() => {
                  // Future: Open ARR growth history modal
                  console.log('ARR bar clicked - growth history modal not yet implemented')
                }}
                className="w-full"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Strategic Opportunity */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <StrategicOpportunityDonut
                strategicOpportunity={data.strategicOpportunity}
                onDonutClick={() => setWaterfallModalOpen(true)}
                className="w-full"
              />
            </div>

            {/* Placeholder for future sections */}
            <div className="bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
              <div className="text-gray-400 text-sm">
                Additional Executive Thesis components coming soon...
              </div>
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="mt-12 flex justify-between items-center pt-8 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Section 1 of 6
          </div>
          <button
            className="px-6 py-3 rounded-lg font-medium transition-colors"
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
            onClick={() => {
              // Future: Navigate to Section 2 (Core Tension)
              console.log('Navigate to Section 2 - Core Tension (not yet implemented)')
            }}
          >
            Next Section: Core Tension →
          </button>
        </div>
      </main>

      {/* Modals */}
      <RadarChartModal
        isOpen={radarModalOpen}
        onClose={() => setRadarModalOpen(false)}
        gtmBreakdown={data.gtmBreakdown}
        companyName={data.companyName}
      />
      <AcvWaterfallModal
        isOpen={waterfallModalOpen}
        onClose={() => setWaterfallModalOpen(false)}
        acvExpansion={data.strategicOpportunity.acvExpansion}
        companyName={data.companyName}
      />
    </div>
  )
}
