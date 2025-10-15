'use client'

interface StrategicVerdictProps {
  maturityStage: 'AD-HOC' | 'REPEATABLE' | 'SCALABLE' | 'OPTIMIZED'
  maturityDescriptor: string
  coreNarrative: string[]
}

/**
 * StrategicVerdict Component for GTM Scalability Briefing
 *
 * Displays GTM Scalability Maturity Stage and Core Narrative.
 *
 * Features:
 * - 4-stage maturity model with active state
 * - Active stage has gold (#e5a819) background with glow effect
 * - Inactive stages are light gray borders
 * - Rounded edges on first/last stage
 * - Core narrative displayed as multiple paragraphs
 * - 2-column layout on desktop (maturity left, narrative right)
 *
 * Design: Scale VP brand - white background, gold accent for active stage
 * Article VIII Compliance: Direct Tailwind classes, no stage mapping abstractions
 */
export function StrategicVerdict({
  maturityStage,
  maturityDescriptor,
  coreNarrative
}: StrategicVerdictProps) {
  const stages: Array<'AD-HOC' | 'REPEATABLE' | 'SCALABLE' | 'OPTIMIZED'> = [
    'AD-HOC',
    'REPEATABLE',
    'SCALABLE',
    'OPTIMIZED'
  ]

  return (
    <section
      className="mb-12 p-6 md:p-8 rounded-xl border-2 transition-all duration-300"
      style={{
        backgroundColor: '#ffffff',
        borderColor: '#7da399'
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        {/* Left Column: Maturity Model */}
        <div className="lg:col-span-1">
          <h2
            className="text-sm font-semibold uppercase tracking-wider mb-4"
            style={{
              fontFamily: 'var(--font-work-sans)',
              color: '#528577'
            }}
          >
            Strategic Verdict
          </h2>
          <h3
            className="text-lg font-semibold mb-3"
            style={{
              fontFamily: 'var(--font-work-sans)',
              color: '#224f41'
            }}
          >
            GTM Scalability Maturity Stage
          </h3>
          <div className="flex flex-wrap gap-2 font-medium">
            {stages.map((stage, index) => {
              const isActive = stage === maturityStage
              const isFirst = index === 0
              const isLast = index === stages.length - 1

              return (
                <div
                  key={stage}
                  className={`
                    maturity-stage border px-4 py-2
                    ${isFirst ? 'rounded-l-full' : ''}
                    ${isLast ? 'rounded-r-full' : ''}
                  `}
                  style={
                    isActive
                      ? {
                          backgroundColor: '#e5a819',
                          color: '#ffffff',
                          borderColor: '#e5a819',
                          fontWeight: 600,
                          boxShadow: '0 0 15px rgba(229, 168, 25, 0.3)',
                          fontFamily: 'var(--font-outfit)'
                        }
                      : {
                          borderColor: '#7da399',
                          color: '#528577',
                          fontFamily: 'var(--font-outfit)'
                        }
                  }
                >
                  {stage}
                </div>
              )
            })}
          </div>
          <p
            className="text-sm mt-4"
            style={{
              fontFamily: 'var(--font-outfit)',
              color: '#528577'
            }}
          >
            <strong style={{ color: '#224f41' }}>Current Stage: {maturityStage}.</strong>{' '}
            {maturityDescriptor}
          </p>
        </div>

        {/* Right Column: Core Narrative */}
        <div
          className="lg:col-span-2 lg:border-l lg:pl-8"
          style={{ borderColor: '#7da399' }}
        >
          <h2
            className="text-sm font-semibold uppercase tracking-wider mb-4"
            style={{
              fontFamily: 'var(--font-work-sans)',
              color: '#528577'
            }}
          >
            Core Narrative
          </h2>
          <div className="space-y-4">
            {coreNarrative.map((paragraph, index) => (
              <p
                key={index}
                style={{
                  fontFamily: 'var(--font-outfit)',
                  color: '#060119',
                  lineHeight: '1.6'
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
