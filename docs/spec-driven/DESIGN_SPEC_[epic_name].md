# Design Specification: [Epic Name]

**Epic Number:** [XXX]  
**Version:** 1.0  
**Designer:** [Name]  
**Date:** YYYY-MM-DD  
**Status:** 📝 Draft | 🔄 In Review | ✅ Approved

---

## 🎨 Design Philosophy

### SLC Design Principles

#### Simple
**How we keep it intuitive and uncluttered:**
- [Principle 1: e.g., "One primary action per screen"]
- [Principle 2: e.g., "Progressive disclosure of complexity"]
- [Principle 3: e.g., "Clear visual hierarchy"]

**Minimizing Cognitive Load:**
- [Strategy 1]
- [Strategy 2]
- [Strategy 3]

**Primary User Actions:**
- **Screen/Context 1:** [Primary action users should take]
- **Screen/Context 2:** [Primary action users should take]

---

#### Lovable
**Delightful Micro-interactions:**
1. **[Interaction 1]:** [Description of delightful moment]
   - **Trigger:** [What causes it]
   - **Effect:** [What happens]
   - **Why it delights:** [Emotional impact]

2. **[Interaction 2]:** [Description]
   - **Trigger:** [What causes it]
   - **Effect:** [What happens]
   - **Why it delights:** [Emotional impact]

**Personality & Voice:**
- **Tone:** [e.g., Friendly and encouraging, Professional and trustworthy]
- **Voice Characteristics:** [How we communicate in UI copy]
- **Example copy:** 
  - Error: "[User-friendly error message]"
  - Empty state: "[Encouraging empty state message]"
  - Success: "[Celebratory success message]"

**Emotional Goals:**
Users should feel:
- **[Emotion 1]:** [e.g., Confident, Empowered, In control]
- **[Emotion 2]:** [e.g., Delighted, Understood, Supported]

---

#### Complete
**Ensuring No Dead Ends:**
- [ ] All screens have clear navigation paths
- [ ] All actions have visible outcomes
- [ ] All error states have recovery options
- [ ] All forms provide clear next steps

**Polish & Finish:**
- [What makes this feel complete and professional]
- [How we ensure consistency across the experience]
- [What makes users confident in the system]

---

## 🎨 Design System Integration

### Color Palette

#### Brand Colors
```css
/* Primary */
--color-primary-50:  #[hex];
--color-primary-100: #[hex];
--color-primary-200: #[hex];
--color-primary-300: #[hex];
--color-primary-400: #[hex];
--color-primary-500: #[hex];  /* Main brand color */
--color-primary-600: #[hex];
--color-primary-700: #[hex];
--color-primary-800: #[hex];
--color-primary-900: #[hex];

/* Secondary */
--color-secondary-500: #[hex];
/* ... similar scale */

/* Accent */
--color-accent-500: #[hex];
/* ... similar scale */
```

#### Semantic Colors
```css
/* Status & Feedback */
--color-success: #10b981;     /* Green */
--color-warning: #f59e0b;     /* Amber */
--color-error: #ef4444;       /* Red */
--color-info: #3b82f6;        /* Blue */

/* Neutral Palette */
--color-neutral-0:   #ffffff; /* White */
--color-neutral-50:  #f9fafb;
--color-neutral-100: #f3f4f6;
--color-neutral-200: #e5e7eb;
--color-neutral-300: #d1d5db;
--color-neutral-400: #9ca3af;
--color-neutral-500: #6b7280;
--color-neutral-600: #4b5563;
--color-neutral-700: #374151;
--color-neutral-800: #1f2937;
--color-neutral-900: #111827;
--color-neutral-1000: #000000; /* Black */
```

#### Accessibility Compliance
| Combination | Contrast Ratio | WCAG Level |
|-------------|---------------|------------|
| Primary-500 on White | [X:1] | AA Large / AAA Normal |
| Neutral-700 on Neutral-50 | [X:1] | AAA |
| Error text on White | [X:1] | AA |

**Tool:** [Link to contrast checker or audit results]

---

### Typography

#### Font Families
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-serif: 'Merriweather', Georgia, serif;
--font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
```

#### Type Scale
| Style | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| **Display Large** | 72px / 4.5rem | 1.1 | 700 | Hero headlines |
| **Display** | 60px / 3.75rem | 1.1 | 700 | Page titles |
| **H1** | 48px / 3rem | 1.2 | 700 | Section headlines |
| **H2** | 36px / 2.25rem | 1.3 | 600 | Subsection headlines |
| **H3** | 30px / 1.875rem | 1.3 | 600 | Card titles |
| **H4** | 24px / 1.5rem | 1.4 | 600 | Small headlines |
| **H5** | 20px / 1.25rem | 1.5 | 600 | Labels, nav items |
| **Body Large** | 18px / 1.125rem | 1.6 | 400 | Feature text |
| **Body** | 16px / 1rem | 1.6 | 400 | Default body text |
| **Body Small** | 14px / 0.875rem | 1.5 | 400 | Secondary text |
| **Caption** | 12px / 0.75rem | 1.5 | 400 | Metadata, timestamps |
| **Overline** | 12px / 0.75rem | 1.5 | 600 | All caps labels |

#### Font Weights
- **Regular:** 400 (body text)
- **Medium:** 500 (emphasis)
- **Semibold:** 600 (headings, buttons)
- **Bold:** 700 (strong emphasis)

---

### Spacing System

**Base Unit:** 4px

#### Spacing Scale
```css
--space-0:   0;      /* 0px */
--space-1:   0.25rem; /* 4px */
--space-2:   0.5rem;  /* 8px */
--space-3:   0.75rem; /* 12px */
--space-4:   1rem;    /* 16px */
--space-5:   1.25rem; /* 20px */
--space-6:   1.5rem;  /* 24px */
--space-8:   2rem;    /* 32px */
--space-10:  2.5rem;  /* 40px */
--space-12:  3rem;    /* 48px */
--space-16:  4rem;    /* 64px */
--space-20:  5rem;    /* 80px */
--space-24:  6rem;    /* 96px */
```

#### Usage Guidelines
- **Tight spacing (1-2):** Within components, icon padding
- **Default spacing (3-4):** Between related elements
- **Comfortable spacing (5-6):** Between sections
- **Generous spacing (8-12):** Between major page sections
- **Large spacing (16-24):** Page margins, hero sections

---

### Border Radius
```css
--radius-none: 0;
--radius-sm:   0.125rem; /* 2px */
--radius-md:   0.375rem; /* 6px */
--radius-lg:   0.5rem;   /* 8px */
--radius-xl:   0.75rem;  /* 12px */
--radius-2xl:  1rem;     /* 16px */
--radius-full: 9999px;   /* Pill shape */
```

**Usage:**
- **sm:** Input borders, subtle containers
- **md:** Buttons, cards (default)
- **lg:** Modal dialogs, larger cards
- **xl:** Hero sections, feature cards
- **full:** Badges, avatars, pills

---

### Shadows
```css
--shadow-sm:   0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md:   0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg:   0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl:   0 20px 25px -5px rgb(0 0 0 / 0.1);
--shadow-2xl:  0 25px 50px -12px rgb(0 0 0 / 0.25);
```

**Usage:**
- **sm:** Subtle depth (cards at rest)
- **md:** Default elevation (buttons, inputs)
- **lg:** Hover states, dropdowns
- **xl:** Modals, popovers
- **2xl:** Modal overlays, major UI elements

---

## 📐 Layout & Grid System

### Responsive Breakpoints
```css
/* Mobile First Approach */
--breakpoint-sm:  640px;   /* Tablet */
--breakpoint-md:  768px;   /* Tablet landscape */
--breakpoint-lg:  1024px;  /* Desktop */
--breakpoint-xl:  1280px;  /* Large desktop */
--breakpoint-2xl: 1536px;  /* Extra large desktop */
```

### Container Widths
| Breakpoint | Container Max-Width | Margin |
|------------|-------------------|--------|
| < 640px | 100% | 16px |
| 640px - 768px | 640px | 24px |
| 768px - 1024px | 768px | 32px |
| 1024px - 1280px | 1024px | 40px |
| 1280px+ | 1280px | 48px |

### Grid System
- **Columns:** 12-column grid
- **Gutter:** 24px (space-6)
- **Behavior:** Fluid, responsive

**Example Layouts:**
```
Mobile (< 640px):     [12 cols] (single column)
Tablet (640-1024px):  [6 | 6] or [4 | 8] (two columns)
Desktop (1024px+):    [3 | 6 | 3] or [4 | 4 | 4] (three+ columns)
```

---

## 🧩 Component Architecture

### Component Hierarchy
```
[Epic Feature Component]
├── Layout
│   ├── Header
│   │   ├── Logo
│   │   ├── Navigation
│   │   └── UserMenu
│   ├── Sidebar (optional)
│   │   ├── Nav Items
│   │   └── Footer
│   ├── Main Content Area
│   │   ├── [Feature Component 1]
│   │   ├── [Feature Component 2]
│   │   └── [Feature Component 3]
│   └── Footer
└── Modals & Overlays (portals)
```

---

### Component Specifications

#### Component 1: [ComponentName]

**Purpose:** [What this component does and why it exists]

**Type:** Atom | Molecule | Organism | Template

**Props/Interface:**
```typescript
interface [ComponentName]Props {
  // Required props
  id: string;
  title: string;
  onAction: (id: string) => void;
  
  // Optional props
  subtitle?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  
  // Accessibility
  'aria-label'?: string;
}
```

**Visual States:**

1. **Default (Resting State)**
   - Background: [color]
   - Border: [style]
   - Text: [color]
   - Shadow: [elevation]

2. **Hover**
   - Background: [color - typically darker/lighter]
   - Transform: [e.g., translateY(-2px)]
   - Shadow: [increased elevation]
   - Cursor: pointer
   - Duration: 150ms ease

3. **Active/Pressed**
   - Background: [color]
   - Transform: [e.g., scale(0.98)]
   - Duration: 100ms ease

4. **Focus**
   - Outline: [color] 2px solid
   - Outline offset: 2px
   - No other visual changes (maintain hover if applicable)

5. **Disabled**
   - Background: [neutral-100]
   - Text: [neutral-400]
   - Cursor: not-allowed
   - Opacity: 0.6

6. **Loading**
   - Spinner or skeleton UI
   - Disabled interaction
   - Accessible loading announcement

7. **Error State**
   - Border: [error-500]
   - Icon: Error icon (red)
   - Message: Below component

**Variants:**

**Primary Variant:**
```css
background: var(--color-primary-500);
color: white;
border: none;
```

**Secondary Variant:**
```css
background: var(--color-neutral-100);
color: var(--color-neutral-900);
border: 1px solid var(--color-neutral-300);
```

**Outline Variant:**
```css
background: transparent;
color: var(--color-primary-500);
border: 2px solid var(--color-primary-500);
```

**Sizes:**

| Size | Height | Padding X | Padding Y | Font Size |
|------|--------|-----------|-----------|-----------|
| sm | 32px | 12px | 6px | 14px |
| md | 40px | 16px | 8px | 16px |
| lg | 48px | 20px | 12px | 18px |

**Responsive Behavior:**

| Breakpoint | Changes |
|------------|---------|
| Mobile (<640px) | [Full width, adjusted padding, etc.] |
| Tablet (640-1024px) | [Specific behavior] |
| Desktop (>1024px) | [Specific behavior] |

**Accessibility Requirements:**
- [ ] Keyboard accessible (Tab, Enter, Space)
- [ ] Focus indicator clearly visible
- [ ] ARIA label provided if no visible text
- [ ] Screen reader announces state changes
- [ ] Color contrast meets WCAG 2.1 AA
- [ ] Touch target ≥44x44px (mobile)

**Code Example:**
```tsx
<ComponentName
  id="example-1"
  title="Click Me"
  subtitle="Optional subtitle"
  variant="primary"
  size="md"
  onAction={(id) => console.log(id)}
  aria-label="Descriptive label for screen readers"
/>
```

**Figma Link:** [Link to component in design file]

---

#### Component 2: [ComponentName]
[Repeat structure for each major component]

---

## 🎭 User Flows & Screens

### Flow 1: [Primary User Journey Name]

**Goal:** [What the user is trying to accomplish]

**Entry Points:**
- [Where users can start this flow]
- [Alternative entry points]

**Flow Diagram:**
```
1. [Screen/State 1] → User Action: [Click/Type/etc]
   ↓
2. [Screen/State 2] → Loading State (200ms)
   ↓
3. [Screen/State 3] → User sees [Result]
   ↓
4. [Screen/State 4] → Decision point: [A or B]
   ↓                   ↓
5A. [Happy Path]   5B. [Error Path]
   ↓                   ↓
6. [Goal State]     [Recovery Screen]
```

**Screens & States:**

#### Screen 1: [Screen Name]
**Purpose:** [What this screen accomplishes in the flow]

**Layout:**
```
┌──────────────────────────────────┐
│ Header                           │
├──────────────────────────────────┤
│                                  │
│  [Main Content Area]             │
│                                  │
│  [Primary Component]             │
│                                  │
│  [Secondary Components]          │
│                                  │
├──────────────────────────────────┤
│ Footer / Actions                 │
└──────────────────────────────────┘
```

**Key Elements:**
- **Header:** [What's in the header]
- **Main Content:** [Primary focus area]
- **Primary CTA:** [Main action button] - [Location]
- **Secondary Actions:** [Alternative actions] - [Location]

**User Actions:**
1. **Primary:** [Action] → [Result]
2. **Secondary:** [Action] → [Result]

**Validation Rules:**
- [Rule 1]: [Error message if violated]
- [Rule 2]: [Error message if violated]

**Error States:**
- **Validation Error:** [How shown, where displayed]
- **System Error:** [Error message, recovery option]

**Success State:**
- [What happens on success]
- [Visual feedback provided]
- [Next screen or action]

**Figma Frame:** [Link to specific screen in Figma]

---

#### Screen 2: [Screen Name]
[Repeat structure for each key screen]

---

### Flow 2: [Secondary User Journey]
[Repeat flow structure]

---

## 📱 Responsive Design Strategy

### Mobile First Approach
We design for mobile first, then enhance for larger screens.

### Breakpoint-Specific Behaviors

#### Mobile (<640px)
**Layout:**
- Single column layout
- Full-width components
- Bottom-anchored CTAs
- Hamburger navigation

**Typography:**
- Slightly smaller font sizes (-2px from desktop)
- Tighter line heights
- Reduced heading sizes

**Spacing:**
- Reduced margins (16px vs 24px+)
- Tighter component spacing
- Optimize for thumb reach

**Interactions:**
- Larger touch targets (minimum 44x44px)
- Bottom sheet modals (not centered)
- Swipe gestures where appropriate
- No hover states (touch-based)

**Navigation:**
- Hamburger menu
- Bottom navigation bar (if applicable)
- Simplified header

---

#### Tablet (640-1024px)
**Layout:**
- Two-column layouts
- Side-by-side content where appropriate
- Tablet-optimized modals (not full screen)

**Navigation:**
- Hybrid approach (some visible, some collapsed)
- Larger tap targets maintained

---

#### Desktop (1024px+)
**Layout:**
- Multi-column layouts (2-3 columns)
- Sidebar navigation visible
- Centered modals
- Richer data displays

**Interactions:**
- Hover states active
- Keyboard shortcuts available
- Drag and drop (where applicable)

---

## ✨ Interaction Patterns & Animations

### Animation Principles
- **Duration:** Fast (100-200ms) for micro-interactions, Moderate (200-400ms) for transitions
- **Easing:** `ease-out` for entrances, `ease-in` for exits, `ease-in-out` for moves
- **Purpose:** Every animation should have a purpose (feedback, attention, smooth transitions)

### Micro-interactions Catalog

#### 1. Button Click
```css
/* On mousedown */
transform: scale(0.98);
transition: transform 100ms ease-out;

/* On release */
transform: scale(1);
transition: transform 150ms ease-out;
```

**Why:** Provides tactile feedback, confirms user action

---

#### 2. Form Field Focus
```css
/* On focus */
outline: 2px solid var(--color-primary-500);
outline-offset: 2px;
box-shadow: 0 0 0 3px var(--color-primary-100);
transition: all 200ms ease-out;
```

**Why:** Clearly indicates active field, aids keyboard navigation

---

#### 3. Card Hover
```css
/* Resting */
box-shadow: var(--shadow-md);
transform: translateY(0);

/* Hover */
box-shadow: var(--shadow-lg);
transform: translateY(-4px);
transition: all 200ms ease-out;
```

**Why:** Indicates interactivity, creates sense of depth

---

#### 4. Loading Spinner
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 1s linear infinite;
}
```

**Accessibility:** Pair with `aria-live="polite"` announcement

---

#### 5. Toast Notification Entry
```css
/* Entry */
@keyframes slideInUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.toast {
  animation: slideInUp 300ms ease-out;
}
```

**Duration:** Visible for 5 seconds, then fade out over 200ms

---

#### 6. Modal Open
```css
/* Backdrop */
backdrop-filter: blur(4px);
background: rgba(0, 0, 0, 0.5);
animation: fadeIn 200ms ease-out;

/* Modal */
animation: scaleIn 250ms ease-out;

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
```

---

### Transition States

#### Page Transitions
- **Page load:** Fade in content over 300ms
- **Route change:** Crossfade between pages (200ms)
- **Back navigation:** Slide from left (if applicable)

#### Loading States

**Skeleton Screens** (< 1 second loads):
```
┌────────────────┐
│ ▓▓▓▓▓▓▓▓       │  <- Animated shimmer effect
│ ▓▓▓▓▓          │
│                │
│ ▓▓▓▓▓▓▓▓▓▓     │
└────────────────┘
```

**Spinner** (1-5 second loads):
- Centered spinner with "Loading..." text

**Progress Bar** (>5 second loads):
- Determinate progress bar if percentage known
- Estimated time remaining

---

## 🎯 Accessibility (WCAG 2.1 AA Compliance)

### Keyboard Navigation

**Tab Order:**
1. [Element 1] - [Description]
2. [Element 2] - [Description]
3. [Element 3] - [Description]

**Keyboard Shortcuts:**
| Key Combination | Action | Context |
|----------------|--------|---------|
| `Tab` | Move forward | Global |
| `Shift + Tab` | Move backward | Global |
| `Enter` | Activate/Submit | Buttons, Forms |
| `Space` | Activate | Buttons, Checkboxes |
| `Esc` | Close/Cancel | Modals, Dropdowns |
| `/` | Focus search | [If applicable] |

**Focus Management:**
- [ ] Focus indicator clearly visible (2px outline, high contrast)
- [ ] Focus trap in modals (focus stays within modal)
- [ ] Focus returns to trigger on modal close
- [ ] Skip links for main content
- [ ] Logical tab order (left-to-right, top-to-bottom)

---

### Screen Reader Support

**ARIA Labels:**
- Icon-only buttons: `aria-label="[Descriptive action]"`
- Complex widgets: Appropriate ARIA roles
- Dynamic content: `aria-live` regions

**Semantic HTML:**
- Use `<nav>`, `<main>`, `<article>`, `<aside>` appropriately
- Headings in logical order (H1 → H2 → H3)
- Lists (`<ul>`, `<ol>`) for groups of items
- `<button>` for actions, `<a>` for navigation

**Announcements:**
- Form errors: Announced immediately
- Success messages: Polite announcement
- Loading states: "Loading [content]"
- Completion: "[Task] complete"

---

### Color & Contrast

**Contrast Ratios:**
- [ ] Normal text: 4.5:1 minimum
- [ ] Large text (18px+): 3:1 minimum
- [ ] UI components: 3:1 minimum
- [ ] Focus indicators: 3:1 minimum

**Color Independence:**
- [ ] No information conveyed by color alone
- [ ] Use icons + color for status
- [ ] Text labels alongside color coding
- [ ] Patterns or textures in addition to color

---

### Motion & Animation

**Respecting User Preferences:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Vestibular Considerations:**
- No parallax scrolling
- No auto-playing videos
- No unexpected motion
- Allow users to pause animations

---

## 🚨 Error States & Edge Cases

### Error Handling Matrix

| Scenario | Visual Treatment | Message | Icon | Recovery Action |
|----------|-----------------|---------|------|----------------|
| **Validation Error** | Red border, shake | "[Field] is required" | ⚠️ | Inline guidance |
| **Network Timeout** | Error banner | "Connection lost. Retrying..." | 🔄 | Auto-retry 3x |
| **Server Error (500)** | Error page | "Something went wrong" | ❌ | Refresh button |
| **Permission Denied** | Disabled state | "You don't have access" | 🔒 | Contact admin link |
| **Not Found (404)** | Friendly 404 page | "Page not found" | 🔍 | Home link, search |
| **Form Submission Error** | Inline errors | Specific field errors | ⚠️ | Fix and resubmit |

---

### Empty States

**No Data Yet:**
```
┌──────────────────────────────┐
│                              │
│         📊 [Icon]            │
│                              │
│   No [items] yet             │
│   [Helpful message]          │
│                              │
│   [Primary CTA Button]       │
│                              │
└──────────────────────────────┘
```

**Example Message:** "No projects yet. Create your first project to get started!"

---

**No Search Results:**
```
┌──────────────────────────────┐
│         🔍 [Icon]            │
│                              │
│   No results for "[query]"   │
│   Try different keywords     │
│                              │
│   [Clear Search Button]      │
└──────────────────────────────┘
```

---

**No Internet Connection:**
```
┌──────────────────────────────┐
│         📡 [Icon]            │
│                              │
│   You're offline             │
│   Some features unavailable  │
│                              │
│   [Retry Button]             │
└──────────────────────────────┘
```

---

### Edge Cases

**Very Long Content:**
- **Truncation:** `...` after [X] characters
- **Expand Option:** "Show more" link or button
- **Tooltip:** Full content on hover (desktop)

**Extremely Short Content:**
- **Minimum Height:** Maintain consistent card heights
- **Centering:** Vertically center if sparse

**Slow Network:**
- **Progressive Loading:** Show content as it arrives
- **Skeleton Screens:** For key UI elements
- **Timeout:** If >10s, show error with retry

**Large Numbers:**
- **Formatting:** Use commas (1,234,567)
- **Abbreviation:** For very large (1.2M, 3.4B)
- **Tooltip:** Show full number on hover

---

## 📚 Design Deliverables

### Figma Files
- **Main Design File:** [Link to Figma]
- **Component Library:** [Link to components]
- **Prototype:** [Link to interactive prototype]
- **Design Tokens:** [Link to tokens or config]

### Asset Export
- **Icons:** SVG, organized by category
- **Images:** WebP format, multiple sizes (1x, 2x)
- **Illustrations:** SVG where possible
- **Animations:** Lottie JSON files

### Documentation
- [ ] Component usage guidelines
- [ ] Do's and Don'ts for each component
- [ ] Responsive behavior documented
- [ ] Accessibility notes for each component

---

## ✅ Design Review Checklist

### Visual Design
- [ ] Follows design system consistently
- [ ] Color contrast meets WCAG 2.1 AA
- [ ] Typography hierarchy is clear
- [ ] Spacing is consistent
- [ ] Responsive designs for all breakpoints
- [ ] Dark mode considered (if applicable)

### Interaction Design
- [ ] All interactive elements have hover states
- [ ] All interactive elements have focus states
- [ ] Loading states defined for async actions
- [ ] Error states designed for all scenarios
- [ ] Empty states are helpful and actionable
- [ ] Animations have purpose and are subtle

### User Experience
- [ ] User flows are logical and complete
- [ ] No dead ends or abandoned flows
- [ ] Primary actions are obvious
- [ ] Error messages are clear and actionable
- [ ] Success feedback is provided
- [ ] Copy is friendly and helpful

### Accessibility
- [ ] Keyboard navigation works for all interactions
- [ ] Screen reader testing completed
- [ ] Color is not the only indicator
- [ ] Touch targets ≥44x44px on mobile
- [ ] Reduced motion preferences respected
- [ ] ARIA labels provided where needed

### SLC Compliance
- [ ] **Simple:** Design is uncluttered and focused
- [ ] **Lovable:** Delightful touches identified and implemented
- [ ] **Complete:** All states and edge cases designed

### Handoff Readiness
- [ ] All designs in Figma up to date
- [ ] Components annotated with specs
- [ ] Prototype demonstrates key flows
- [ ] Assets exported and organized
- [ ] Design tokens exported
- [ ] Developer handoff meeting scheduled

---

**Document Owner:** [Designer Name]  
**Last Updated:** YYYY-MM-DD  
**Next Review:** YYYY-MM-DD
