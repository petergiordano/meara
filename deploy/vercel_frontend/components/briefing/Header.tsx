'use client'

interface HeaderProps {
  companyName: string
  reportDate: string
  preparedBy: string
}

/**
 * Header Component for GTM Scalability Briefing
 *
 * Displays the main title, company name, report date, and prepared by info.
 *
 * Design: Dark theme with gray-200 text on gray-900 background
 * Article VIII Compliance: No abstractions, direct HTML/Tailwind
 */
export function Header({ companyName, reportDate, preparedBy }: HeaderProps) {
  return (
    <header className="mb-12">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
        GTM Scalability Briefing: {companyName}
      </h1>
      <p className="text-lg text-gray-400">
        Prepared by: {preparedBy} | {reportDate}
      </p>
    </header>
  )
}
