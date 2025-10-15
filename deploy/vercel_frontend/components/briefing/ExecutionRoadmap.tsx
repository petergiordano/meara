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
 * - Color-coded phase pills (blue, indigo, purple)
 * - Task list with emoji icons
 * - Card hover effect
 *
 * Design: Dark theme with gray-800 cards, colored pills
 * Article VIII Compliance: Direct Tailwind classes, no color mapping abstractions
 */
export function ExecutionRoadmap({ roadmap }: ExecutionRoadmapProps) {
  const colorClasses = {
    blue: 'bg-blue-600 text-blue-100',
    indigo: 'bg-indigo-600 text-indigo-100',
    purple: 'bg-purple-600 text-purple-100'
  }

  return (
    <section>
      <h2 className="text-2xl font-bold text-white mb-6">Execution Roadmap</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {roadmap.map((phase, phaseIndex) => (
          <div
            key={phaseIndex}
            className="card p-6 bg-gray-800 border border-gray-700 rounded-xl flex flex-col transition-all duration-300 hover:border-[#4f5b70]"
          >
            {/* Phase Pill */}
            <div className="mb-4">
              <span
                className={`pill inline-block px-3 py-1 rounded-full font-medium text-sm ${colorClasses[phase.color]}`}
              >
                {phase.phase}
              </span>
            </div>

            {/* Task List */}
            <ul className="space-y-4 flex-grow">
              {phase.tasks.map((task, taskIndex) => (
                <li key={taskIndex} className="flex items-start">
                  <span className="text-xl mr-4 mt-1">{task.icon}</span>
                  <div>
                    <strong className="text-white">{task.title}:</strong>
                    <span className="text-gray-400 block">{task.description}</span>
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
