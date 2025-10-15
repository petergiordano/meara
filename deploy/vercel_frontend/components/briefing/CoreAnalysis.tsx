'use client'

interface AnalysisItem {
  title: string
  description: string
}

interface CoreAnalysisProps {
  foundation: AnalysisItem[]
  bottlenecks: AnalysisItem[]
}

/**
 * CoreAnalysis Component for GTM Scalability Briefing
 *
 * Displays Foundation for Scale vs Primary Growth Bottlenecks in a 2-column grid.
 *
 * Features:
 * - Two cards side-by-side (responsive stacking on mobile)
 * - Foundation items with green-400 emphasis
 * - Bottleneck items with red-400 emphasis
 * - Card hover effect (border brightening)
 *
 * Design: Dark theme with gray-800 cards on gray-900 background
 * Article VIII Compliance: Direct Tailwind classes, no abstractions
 */
export function CoreAnalysis({ foundation, bottlenecks }: CoreAnalysisProps) {
  return (
    <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Foundation for Scale */}
      <div className="card p-6 bg-gray-800 border border-gray-700 rounded-xl transition-all duration-300 hover:border-[#4f5b70]">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <span className="text-2xl mr-3">✅</span> Foundation for Scale
        </h2>
        <ul className="space-y-3 text-gray-300">
          {foundation.map((item, index) => (
            <li key={index}>
              <strong className="text-green-400">{item.title}:</strong> {item.description}
            </li>
          ))}
        </ul>
      </div>

      {/* Primary Growth Bottlenecks */}
      <div className="card p-6 bg-gray-800 border border-gray-700 rounded-xl transition-all duration-300 hover:border-[#4f5b70]">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <span className="text-2xl mr-3">⚠️</span> Primary Growth Bottlenecks
        </h2>
        <ul className="space-y-3 text-gray-300">
          {bottlenecks.map((item, index) => (
            <li key={index}>
              <strong className="text-red-400">{item.title}:</strong> {item.description}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
