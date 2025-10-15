'use client'

interface Pillar {
  title: string
  points: string[]
}

interface NarrativePillarsProps {
  pillars: Pillar[]
}

/**
 * NarrativePillars Component for GTM Scalability Briefing
 *
 * Displays expandable narrative pillars using native HTML <details> element.
 *
 * Features:
 * - Expandable cards using <details> and <summary>
 * - Arrow icon that rotates 90deg when expanded
 * - Summary text turns blue-400 when open
 * - Content has left border accent
 * - Card hover effect
 *
 * Design: Dark theme with interactive expand/collapse
 * Article VIII Compliance: Uses native <details> element directly, no JS state
 */
export function NarrativePillars({ pillars }: NarrativePillarsProps) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-6">The Path to Scale: Strategic Pillars</h2>
      <div className="space-y-4">
        {pillars.map((pillar, index) => (
          <details
            key={index}
            className="card p-6 bg-gray-800 border border-gray-700 rounded-xl cursor-pointer transition-all duration-300 hover:border-[#4f5b70] group"
          >
            <summary className="font-semibold text-lg flex justify-between items-center text-white list-none group-open:text-blue-400">
              <span>Pillar {index + 1}: {pillar.title}</span>
              <span className="arrow text-blue-400 font-bold text-2xl transform transition-transform duration-200 group-open:rotate-90">
                &gt;
              </span>
            </summary>
            <div className="mt-4 text-gray-400 space-y-2 pl-2 border-l-2 border-gray-600">
              {pillar.points.map((point, pointIndex) => (
                <p key={pointIndex}>{point}</p>
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
