
1. Project Overview
The objective is to create a reusable, data-driven web application to display "GTM Scalability Briefing" reports for different portfolio companies.

The application will take a structured JSON data file as input and render an interactive, consistently styled HTML report based on the provided gtm_scalability_briefing_v2.html file, which serves as the visual and functional prototype.

2. Component Architecture
The application should be built using a component-based architecture (e.g., React, Vue, Svelte, or modern web components). The UI is composed of the following distinct components:

Header: Displays the main title and byline.

StrategicVerdict: A large card containing the GTM Maturity Model and the Core Narrative.

CoreAnalysis: A two-column layout containing the "Foundation for Scale" and "Primary Growth Bottlenecks" sections.

NarrativePillars: A section that dynamically renders a list of expandable "Pillar" cards.

ExecutionRoadmap: A three-column layout that dynamically renders the phased "Roadmap" cards.

1. Data Schema (The "API Contract")The application will be driven by a single JSON object. This structure is critical and must be followed precisely. 

Below is the full schema with example data populated from the GGWP v2 report.
{
  "companyName": "GGWP",
  "reportDate": "October 14, 2025",
  "preparedBy": "Scale VP GTM Platform Team",
  "strategicVerdict": {
    "maturityStage": "REPEATABLE",
    "maturityDescriptor": "Success is driven by heroic, founder-led efforts but lacks the systems for predictable, scalable growth.",
    "coreNarrative": [
      "GGWP has achieved impressive early traction by leveraging two world-class, but fundamentally unscalable, assets: a technically excellent product that solves an acute pain point and the unparalleled industry credibility of its founding team. This is the story of a company that has perfected the art of building a great product and leveraging a powerful network to land foundational accounts.",
      "However, the very strengths that have propelled GGWP to this point are now its primary bottlenecks to scalable growth. The company's go-to-market (GTM) engine is a pristine, impeccably crafted \"digital Savile Row suit with no pockets\"—a perfect exterior with no infrastructure to capture, measure, or optimize a sales funnel. The next phase of growth requires a deliberate architectural shift to a predictable, data-driven, and scalable revenue engine."
    ]
  },
  "coreAnalysis": {
    "foundation": [
      {
        "title": "Technically Excellent Product",
        "description": "Solves an acute, validated pain point with a best-in-class solution that customers love."
      },
      {
        "title": "The \"Thresh Moat\"",
        "description": "Unparalleled founder credibility (CEO Dennis Fong) that has secured marquee logos like Meta, Netflix, and Krafton."
      },
      {
        "title": "Proven Market Fit",
        "description": "Achieved an estimated $6M+ ARR with remarkable capital efficiency, proving strong demand."
      }
    ],
    "bottlenecks": [
      {
        "title": "Un-instrumented GTM Engine",
        "description": "Critically constrains lead generation and prevents the creation of a predictable sales funnel."
      },
      {
        "title": "Single, High-Friction Conversion Path",
        "description": "Alienates the majority of prospects who are not yet ready for a sales conversation, limiting pipeline."
      },
      {
        "title": "Positioned as a Cost Center",
        "description": "The \"moderation\" narrative limits deal size and confines sales to under-resourced Trust & Safety budgets."
      }
    ]
  },
  "pillars": [
    {
      "title": "The \"Thresh Moat\" is a powerful but unscalable foundation",
      "points": [
        "GGWP's early success is a direct result of founder-led sales, leveraging CEO Dennis \"Thresh\" Fong's legendary status and deep industry network to bypass traditional GTM friction.",
        "This reliance on a founder's network is the definition of an unscalable growth model. The critical challenge is to transfer the trust embodied in the founder's personal brand to the GGWP corporate brand through scalable channels."
      ]
    },
    {
      "title": "The website is a digital brochure, not a conversion engine",
      "points": [
        "The company's website demonstrates best-in-class on-page SEO and design but completely lacks the foundational tools of a modern marketing engine for measurement and optimization.",
        "The buyer's journey is a dead end. The only conversion path is a high-friction \"Talk to an Expert\" CTA, with no low-friction options like newsletters or content downloads. This is a critical architectural flaw that throttles lead generation."
      ]
    },
    {
      "title": "The category must be redefined from cost center to revenue driver",
      "points": [
        "GGWP's most powerful strategic lever is to redefine its category from \"Trust & Safety\" to \"Community Intelligence.\" Selling moderation is a cost-center sale; selling insights that reduce churn and improve product is a high-ROI, revenue-centric sale.",
        "The \"Pulse\" sentiment analysis product is the key to this pivot. It transforms player chat from a liability to be managed into an asset to be mined for business intelligence, increasing player retention and LTV."
      ]
    },
    {
        "title": "The path to a predictable revenue engine must be built",
        "points": [
            "The immediate priority is to instrument the entire digital funnel with a marketing automation stack, conversion goals, and multiple engagement paths.",
            "A dual-pronged GTM motion offers the clearest path to scale: a bottoms-up \"Land\" motion for the core product, and a top-down, high-ACV enterprise sale of the \"Pulse\" intelligence platform."
        ]
    }
  ],
  "roadmap": [
    {
      "phase": "Phase 1: Foundation (Weeks 1-6)",
      "color": "blue",
      "tasks": [
        { "icon": "⚡️", "title": "Instrument the Funnel", "description": "Deploy a tag manager, marketing automation platform, and conversion tracking pixels immediately." },
        { "icon": "⚡️", "title": "Launch Low-Friction Offer", "description": "Create a data-driven report on player churn and feature it on the homepage with a lead capture form." },
        { "icon": "⚡️", "title": "Reposition the Narrative", "description": "Revise the sales deck and discovery script to lead with the \"Community Intelligence\" value proposition." }
      ]
    },
    {
      "phase": "Phase 2: Funnel Construction (Weeks 7-12)",
      "color": "indigo",
      "tasks": [
        { "icon": "🏛️", "title": "Build Content for the Buyer's Journey", "description": "Develop webinars, guides, and ROI calculators for each stage of the funnel." },
        { "icon": "🏛️", "title": "Systematize the \"Thresh Moat\"", "description": "Launch a consistent founder-led content series to build a scalable brand asset." },
        { "icon": "🏛️", "title": "Launch Defensive Narrative", "description": "Publish content to counter the \"Gaming Safety Coalition\" and highlight the value of an integrated platform." }
      ]
    },
    {
      "phase": "Phase 3: Scale the Engine (Months 4-6+)",
      "color": "purple",
      "tasks": [
        { "icon": "🚀", "title": "Launch Category Creation Campaign", "description": "Execute a full campaign to establish and own \"Community Intelligence for Gaming.\"" },
        { "icon": "🚀", "title": "Hire a Head of Marketing", "description": "Bring in a proven marketing leader to build and scale the GTM engine." },
        { "icon": "🚀", "title": "Optimize and Scale", "description": "Use data from the new funnel to A/B test landing pages and scale investment in proven channels." }
      ]
    }
  ]
}

4. Design System & Styling
The visual design should be implemented as a reusable design system. All styling is defined in the prototype and should be replicated.

Framework: The prototype uses Tailwind CSS. This is the preferred method for styling.

Font: Inter. Weights used are 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold).

Colors:

Background: bg-gray-900 (#111827)

Card Background: bg-gray-800 (#1F2937)

Card Border: border-gray-700 (#374151)

Primary Text: text-gray-200

Secondary Text: text-gray-400

Accent (Active Maturity): bg-amber-500 (#F59E0B)

Accent (Foundation): text-green-400

Accent (Bottleneck): text-red-400

Accent (Pillar Arrow): text-blue-400

Pills: bg-blue-600, bg-indigo-600, bg-purple-600

5. Interaction Logic
The application must replicate the following interactive behaviors from the prototype:

Card Hover States: All cards (.card) should slightly brighten their border color on hover, as defined in the prototype's CSS.

Pillar Expand/Collapse: The "Narrative Pillar" cards are implemented using the <details> and <summary> HTML elements. This behavior should be replicated. A click on the summary toggles the visibility of the content, and the arrow icon should rotate 90 degrees.

By providing this structured guide, you're not just showing the engineer what to build, but also how to build it in a scalable and maintainable way.