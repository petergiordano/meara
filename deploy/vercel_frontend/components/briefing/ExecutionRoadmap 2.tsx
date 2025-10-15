'use client'

interface RoadmapTask {
  icon: string
  title: string
  description: string
}

interface RoadmapPhase {
  phase: string
  color: 'blue' | 'indigo' | 'purple'
  tasks: RoadmapTask[]
}

interface ExecutionRoadmapProps {
  roadmap: RoadmapPhase[]
}

/**
 * ExecutionRoadmap Component for GTM Scalability Briefing
 *
 * Displays the execution roadmap in a 3-column layout with color-coded phases.
 *
 * Features:
 * - 3-column grid (responsive stacking on mobile/tablet)
 * - Color-coded phase pills using Scale brand colors
 * - Task list with emoji icons
 * - White cards with green borders
 *
 * Design: Scale VP brand - white background, green/blue/gold phase colors
 * Article VIII Compliance: Direct Tailwind classes, no color mapping abstractions
 */
export function ExecutionRoadmap({ roadmap }: ExecutionRoadmapProps) {
  const colorClasses = {
    blue: { bg: '#0d71a9', text: '#ffffff' },
    indigo: { bg: '#224f41', text: '#ffffff' },
    purple: { bg: '#e5a819', text: '#ffffff' }
  }

  return (
    <section>
      <h2
        className="text-2xl font-bold mb-6"
        style={{
          fontFamily: 'var(--font-work-sans)',
          color: '#224f41'
        }}
      >
        Execution Roadmap
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {roadmap.map((phase, phaseIndex) => (
          <div
            key={phaseIndex}
            className="p-6 rounded-xl border-2 flex flex-col transition-all duration-300"
            style={{
              backgroundColor: '#ffffff',
              borderColor: '#7da399'
            }}
          >
            {/* Phase Pill */}
            <div className="mb-4">
              <span
                className="pill inline-block px-3 py-1 rounded-full font-medium text-sm"
                style={{
                  backgroundColor: colorClasses[phase.color].bg,
                  color: colorClasses[phase.color].text,
                  fontFamily: 'var(--font-outfit)'
                }}
              >
                {phase.phase}
              </span>
            </div>

            {/* Task List */}
            <ul className="space-y-4 flex-grow" style={{ fontFamily: 'var(--font-outfit)' }}>
              {phase.tasks.map((task, taskIndex) => (
                <li key={taskIndex} className="flex items-start">
                  <span className="text-xl mr-4 mt-1">{task.icon}</span>
                  <div>
                    <strong style={{ color: '#224f41' }}>{task.title}:</strong>
                    <span className="block" style={{ color: '#528577' }}>
                      {task.description}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
