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
 * - Active stage has amber-500 background with glow effect
 * - Inactive stages are muted gray
 * - Rounded edges on first/last stage
 * - Core narrative displayed as multiple paragraphs
 * - 2-column layout on desktop (maturity left, narrative right)
 *
 * Design: Dark theme with amber accent for active stage
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
    <section className="mb-12 p-6 md:p-8 card bg-gray-800 border border-gray-700 rounded-xl transition-all duration-300 hover:border-[#4f5b70]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        {/* Left Column: Maturity Model */}
        <div className="lg:col-span-1">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
            Strategic Verdict
          </h2>
          <h3 className="text-lg font-semibold text-white mb-3">
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
                    ${
                      isActive
                        ? 'bg-amber-500 text-gray-900 border-amber-500 font-semibold'
                        : 'border-gray-600 text-gray-400'
                    }
                  `}
                  style={
                    isActive
                      ? { boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)' }
                      : undefined
                  }
                >
                  {stage}
                </div>
              )
            })}
          </div>
          <p className="text-sm text-gray-400 mt-4">
            <strong>Current Stage: {maturityStage}.</strong> {maturityDescriptor}
          </p>
        </div>

        {/* Right Column: Core Narrative */}
        <div className="lg:col-span-2 lg:border-l lg:border-gray-700 lg:pl-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
            Core Narrative
          </h2>
          <div className="space-y-4">
            {coreNarrative.map((paragraph, index) => (
              <p key={index} className="text-gray-300">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
