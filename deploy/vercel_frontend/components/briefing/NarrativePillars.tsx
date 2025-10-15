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
 * - Summary text turns blue when open
 * - Content has left border accent
 * - White cards with green borders
 *
 * Design: Scale VP brand - white background with green accents
 * Article VIII Compliance: Uses native <details> element directly, no JS state
 */
export function NarrativePillars({ pillars }: NarrativePillarsProps) {
  return (
    <section className="mb-12">
      <h2
        className="text-2xl font-bold mb-6"
        style={{
          fontFamily: 'var(--font-work-sans)',
          color: '#224f41'
        }}
      >
        The Path to Scale: Strategic Pillars
      </h2>
      <div className="space-y-4">
        {pillars.map((pillar, index) => (
          <details
            key={index}
            className="p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 group"
            style={{
              backgroundColor: '#ffffff',
              borderColor: '#7da399'
            }}
          >
            <summary
              className="font-semibold text-lg flex justify-between items-center list-none"
              style={{
                fontFamily: 'var(--font-work-sans)',
                color: '#224f41'
              }}
            >
              <span>Pillar {index + 1}: {pillar.title}</span>
              <span
                className="arrow font-bold text-2xl transform transition-transform duration-200 group-open:rotate-90"
                style={{ color: '#0d71a9' }}
              >
                &gt;
              </span>
            </summary>
            <div
              className="mt-4 space-y-2 pl-2 border-l-2"
              style={{
                borderColor: '#7da399',
                fontFamily: 'var(--font-outfit)',
                color: '#060119'
              }}
            >
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
