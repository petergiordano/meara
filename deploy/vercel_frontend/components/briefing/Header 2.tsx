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
 * Design: Scale VP brand - Work Sans bold for headline, Outfit for subtitle
 * Colors: Dark green (#224f41) headline, mid-green (#528577) subtitle
 * Article VIII Compliance: No abstractions, direct HTML/Tailwind
 */
export function Header({ companyName, reportDate, preparedBy }: HeaderProps) {
  return (
    <header className="mb-12">
      <h1
        className="text-3xl md:text-4xl font-bold mb-2"
        style={{
          fontFamily: 'var(--font-work-sans)',
          color: '#224f41'
        }}
      >
        GTM Scalability Briefing: {companyName}
      </h1>
      <p
        className="text-lg"
        style={{
          fontFamily: 'var(--font-outfit)',
          color: '#528577'
        }}
      >
        Prepared by: {preparedBy} | {reportDate}
      </p>
    </header>
  )
}
