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
 * - Foundation items with dark green (#224f41) emphasis
 * - Bottleneck items with blue (#0d71a9) emphasis
 * - Card with light green border (#7da399)
 *
 * Design: Scale VP brand - white background, green accents
 * Article VIII Compliance: Direct Tailwind classes, no abstractions
 */
export function CoreAnalysis({ foundation, bottlenecks }: CoreAnalysisProps) {
  return (
    <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Foundation for Scale */}
      <div
        className="p-6 rounded-xl border-2 transition-all duration-300"
        style={{
          backgroundColor: '#ffffff',
          borderColor: '#7da399'
        }}
      >
        <h2
          className="text-xl font-semibold mb-4 flex items-center"
          style={{
            fontFamily: 'var(--font-work-sans)',
            color: '#224f41'
          }}
        >
          <span className="text-2xl mr-3">✅</span> Foundation for Scale
        </h2>
        <ul className="space-y-3" style={{ fontFamily: 'var(--font-outfit)', color: '#060119' }}>
          {foundation.map((item, index) => (
            <li key={index}>
              <strong style={{ color: '#224f41' }}>{item.title}:</strong> {item.description}
            </li>
          ))}
        </ul>
      </div>

      {/* Primary Growth Bottlenecks */}
      <div
        className="p-6 rounded-xl border-2 transition-all duration-300"
        style={{
          backgroundColor: '#ffffff',
          borderColor: '#7da399'
        }}
      >
        <h2
          className="text-xl font-semibold mb-4 flex items-center"
          style={{
            fontFamily: 'var(--font-work-sans)',
            color: '#224f41'
          }}
        >
          <span className="text-2xl mr-3">⚠️</span> Primary Growth Bottlenecks
        </h2>
        <ul className="space-y-3" style={{ fontFamily: 'var(--font-outfit)', color: '#060119' }}>
          {bottlenecks.map((item, index) => (
            <li key={index}>
              <strong style={{ color: '#0d71a9' }}>{item.title}:</strong> {item.description}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
