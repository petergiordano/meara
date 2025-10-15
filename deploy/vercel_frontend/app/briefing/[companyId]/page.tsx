'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/briefing/Header'
import { StrategicVerdict } from '@/components/briefing/StrategicVerdict'
import { CoreAnalysis } from '@/components/briefing/CoreAnalysis'
import { NarrativePillars } from '@/components/briefing/NarrativePillars'
import { ExecutionRoadmap } from '@/components/briefing/ExecutionRoadmap'

interface GtmScalabilityBriefingData {
  companyName: string
  reportDate: string
  preparedBy: string
  strategicVerdict: {
    maturityStage: 'AD-HOC' | 'REPEATABLE' | 'SCALABLE' | 'OPTIMIZED'
    maturityDescriptor: string
    coreNarrative: string[]
  }
  coreAnalysis: {
    foundation: Array<{ title: string; description: string }>
    bottlenecks: Array<{ title: string; description: string }>
  }
  pillars: Array<{
    title: string
    points: string[]
  }>
  roadmap: Array<{
    phase: string
    color: 'blue' | 'indigo' | 'purple'
    tasks: Array<{
      icon: string
      title: string
      description: string
    }>
  }>
}

/**
 * GTM Scalability Briefing Page
 *
 * Data-driven narrative report view based on gtm_scalability_briefing_v2.html prototype.
 * Displays strategic GTM analysis with maturity assessment and execution roadmap.
 *
 * Features:
 * - Dark theme (gray-900 background, gray-800 cards)
 * - 5 component sections: Header, StrategicVerdict, CoreAnalysis, NarrativePillars, ExecutionRoadmap
 * - Expandable pillar cards with native <details> element
 * - Maturity stage visualization with amber accent
 * - Responsive layout (mobile stacking)
 *
 * Design: Replicates HTML prototype exactly
 * Article VIII Compliance: Uses components directly, no abstractions
 */
export default function GtmScalabilityBriefingPage() {
  const params = useParams()
  const companyId = params.companyId as string

  const [data, setData] = useState<GtmScalabilityBriefingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch briefing data from backend
  useEffect(() => {
    const fetchBriefingData = async () => {
      try {
        setLoading(true)
        setError(null)

        const apiUrl = process.env.NEXT_PUBLIC_RAILWAY_API || 'http://localhost:8000'
        const response = await fetch(`${apiUrl}/api/gtm/briefing/${companyId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch briefing data: ${response.statusText}`)
        }

        const briefingData = await response.json()
        setData(briefingData)
      } catch (err) {
        console.error('Error fetching briefing data:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (companyId) {
      fetchBriefingData()
    }
  }, [companyId])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-amber-500 mb-4"></div>
          <div className="text-lg text-gray-400">Loading GTM Scalability Briefing...</div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-lg border border-red-400">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5"
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
              <h3 className="text-lg font-semibold text-red-100 mb-2">
                Error Loading Briefing
              </h3>
              <p className="text-sm text-red-200">
                {error || 'Failed to load GTM scalability briefing. Please try again.'}
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
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <Header
          companyName={data.companyName}
          reportDate={data.reportDate}
          preparedBy={data.preparedBy}
        />

        {/* Strategic Verdict & Core Narrative */}
        <StrategicVerdict
          maturityStage={data.strategicVerdict.maturityStage}
          maturityDescriptor={data.strategicVerdict.maturityDescriptor}
          coreNarrative={data.strategicVerdict.coreNarrative}
        />

        {/* Core Analysis: Foundation vs Bottlenecks */}
        <CoreAnalysis
          foundation={data.coreAnalysis.foundation}
          bottlenecks={data.coreAnalysis.bottlenecks}
        />

        {/* Narrative Pillars */}
        <NarrativePillars pillars={data.pillars} />

        {/* Execution Roadmap */}
        <ExecutionRoadmap roadmap={data.roadmap} />
      </div>
    </div>
  )
}
