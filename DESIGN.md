---
name: "Ark Builder Labs"
description: "Building software for every season."
colors:
  background: "#ffffff"
  foreground: "#1a1a1a"
  muted: "#f8f9fa"
  muted-foreground: "#666666"
  card: "#ffffff"
  card-foreground: "#1a1a1a"
  border: "#e5e7eb"
  input: "#ffffff"
  primary: "#2B5797"
  primary-foreground: "#ffffff"
  secondary: "#f8f9fa"
  secondary-foreground: "#1a1a1a"
  accent: "#4A7CC7"
  accent-foreground: "#ffffff"
  destructive: "#ef4444"
  destructive-foreground: "#ffffff"
  success: "#06D6A0"
  warning: "#FFB700"
  dark-background: "#0A1628"
  dark-surface: "#1A2332"
  dark-border: "#334155"
  dark-muted-foreground: "#94a3b8"
typography:
  display:
    fontFamily: "Poppins, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(2.25rem, 6vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "normal"
  headline:
    fontFamily: "Poppins, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "normal"
  title:
    fontFamily: "Poppins, system-ui, -apple-system, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "normal"
rounded:
  md: "6px"
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "80px"
  section-lg: "128px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
    height: "40px"
    typography: "{typography.label}"
  button-secondary:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
    height: "40px"
    typography: "{typography.label}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.muted-foreground}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
    height: "40px"
    typography: "{typography.label}"
  badge-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
    typography: "{typography.label}"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.xl}"
    padding: "24px"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    height: "40px"
    typography: "{typography.label}"
---

# Design System: Ark Builder Labs

## 1. Overview

**Creative North Star: "The Steward's Workshop"**

Ark Builder Labs should feel like a disciplined workshop run by people who care about the work after delivery. The current system pairs practical software-company structure with a service-minded brand voice: clear pages, direct calls to action, faith-informed mission language, and restrained blue technology cues.

The visual atmosphere is professional, calm, and capable. It uses generous sections, centered marketing moments, service cards, simple form controls, and soft motion to reduce uncertainty for prospects. The system currently leans on blue gradients and animated weather-like hero details; future work should preserve trust while reducing template-like flourishes where they compete with the mission.

It explicitly rejects the anti-references in PRODUCT.md: generic agency-template presentation, inflated SaaS claims, vague innovation language, and visual choices that feel impersonal, trend-driven, or disconnected from stewardship.

**Key Characteristics:**
- Mission-first technology brand with practical service clarity.
- Light and dark theme support with blue as the core trust signal.
- Rounded, approachable components with visible focus states.
- Layered cards and soft hover elevation for service exploration.
- Motion is present but should remain supportive, not theatrical.

## 2. Colors

The palette is a blue-led technology system: bright enough to feel capable, muted enough to support a trustworthy service posture.

### Primary
- **Ark Blue**: the main trust color used for primary buttons, active navigation, links, icon marks, focus rings, and section gradients.
- **Harbor Blue**: the lighter accent used with Ark Blue in gradients, hero sweeps, icon backgrounds, and high-emphasis bands.

### Secondary
- **Quiet Canvas**: the pale muted surface for alternating sections, secondary badges, and low-emphasis backgrounds.
- **Signal Green**: success state, reassurance dots, and positive confirmation messages.
- **Response Amber**: attention state and lightweight urgency markers.

### Neutral
- **Clean Page**: the default light background and card surface.
- **Ink Text**: primary body and heading text in light theme.
- **Soft Boundary**: borders, dividers, input outlines, and navigation separators.
- **Deep Hold**: dark theme background for low-light browsing.
- **Night Surface**: dark cards, dark inputs, and mobile menu panels.
- **Slate Boundary**: dark theme borders.

### Named Rules

**The Trust Color Rule.** Ark Blue carries primary action, active state, and focus. Do not scatter unrelated accent colors through the interface.

**The Gradient Containment Rule.** Existing gradients belong to high-emphasis brand moments such as section bands, icon tiles, and legacy headings. Do not add new gradient text; use solid Ark Blue or stronger type instead.

**The State Color Rule.** Green and amber are functional signals. They are not decorative palette colors.

## 3. Typography

**Display Font:** Poppins, with system sans fallback.
**Body Font:** Inter, with system sans fallback.
**Label/Mono Font:** JetBrains Mono exists for code and technical content, but should not be used as generic "technical" decoration.

**Character:** The pairing is direct and serviceable: Poppins provides broad, friendly confidence for headings, while Inter keeps service descriptions, forms, navigation, and blog content readable. The typography should feel clear before it feels clever.

### Hierarchy

- **Display** (700, clamp(2.25rem, 6vw, 4.5rem), 1.05): hero headlines and major page titles only.
- **Headline** (700, clamp(1.875rem, 4vw, 3rem), 1.15): section headings and conversion bands.
- **Title** (700, 1.25rem, 1.25): card titles, value headings, FAQ questions, and process steps.
- **Body** (400, 1rem, 1.625): service descriptions, mission copy, and long-form prose. Keep readable lines near 65 to 75 characters.
- **Label** (500, 0.875rem, normal spacing): navigation, form labels, buttons, small metadata, and badges.

### Named Rules

**The Plainspoken Rule.** Typography should make the mission easier to trust. Avoid decorative type gestures that make the company feel like a generic agency.

**The One Mono Rule.** JetBrains Mono is reserved for code or explicitly technical material. It is forbidden as an ornamental label style.

## 4. Elevation

The system uses a hybrid of tonal layering and soft shadow elevation. Cards are flat or lightly lifted at rest, then gain stronger shadows on hover. Section depth usually comes from muted backgrounds, gradients, and spacious rhythm rather than heavy shadows.

### Shadow Vocabulary

- **Resting Card** (`shadow-sm`): base card separation from the page.
- **Interactive Card** (`hover:shadow-md`, `hover:shadow-lg`, `hover:shadow-xl`): cards and service blocks that invite exploration.
- **Primary Action** (`shadow-lg`, `hover:shadow-xl`): primary and gradient buttons.
- **Feature Lift** (`shadow-2xl`): large service illustration cards that need stronger hierarchy.
- **Mobile Sheet** (`0 10px 15px -3px rgba(0, 0, 0, 0.1)`): mobile navigation panel.

### Named Rules

**The Earned Lift Rule.** Elevation must signal hierarchy or interaction. Do not add shadow to make empty layouts feel designed.

**The Tonal First Rule.** Prefer muted section backgrounds, borders, and spacing before adding stronger shadows.

## 5. Components

### Buttons

- **Shape:** approachable rounded rectangles (8px radius by default, 6px on large and small size variants).
- **Primary:** Ark Blue background with white text, medium label weight, 40px default height, and soft shadow.
- **Hover / Focus:** primary darkens to 90 percent opacity, shadow increases, focus uses a 2px ring with offset, active state scales to 0.98.
- **Secondary:** white or background surface with a 2px Ark Blue border, Ark Blue text, and a filled Ark Blue hover state.
- **Ghost:** low-emphasis muted text that becomes Ark Blue on hover with a faint blue wash.
- **Gradient:** legacy high-emphasis variant for brand moments only. Do not make it the default action style.

### Chips

- **Style:** rounded-full badges with 10px horizontal padding, 2px vertical padding, small semibold labels, and transparent borders.
- **State:** secondary badges are quiet technology tags. Success, warning, and destructive badges are reserved for state communication.

### Cards / Containers

- **Corner Style:** rounded-xl cards (12px radius), with 16px radius reserved for large brand image containers.
- **Background:** card surface over page background, muted section, or soft card-to-muted gradient for featured content.
- **Shadow Strategy:** light rest elevation, stronger hover elevation for interactive content.
- **Border:** normal cards keep a thin border; feature cards sometimes remove the border when gradient or tonal layering provides separation.
- **Internal Padding:** 24px default padding; section cards may use 32px when the content is sparse.

### Inputs / Fields

- **Style:** 40px height, 6px radius, 1px input border, background surface, 12px horizontal padding, 14px label-sized text.
- **Focus:** 2px Ark Blue ring with ring offset. Select fields match this treatment.
- **Error / Disabled:** destructive border and text for validation; disabled fields lower opacity and disable pointer interaction.

### Navigation

Navigation is sticky, 64px tall, and lightly translucent over the page (`bg-background/95` with backdrop blur where supported). The brand mark uses a rounded blue gradient tile with an "A" letterform, followed by the Ark Builder Labs wordmark. Desktop links are medium 14px text with Ark Blue hover and active states; the active route uses a 1px underline animated with Framer Motion. Mobile navigation opens as a right-side sheet with a dark translucent backdrop and direct full-height links.

### Signature Motion

Hero and section reveals use Framer Motion fade-ins with 0.6s duration and the project easing curve `[0.25, 0.25, 0.25, 0.75]`. Service cards lift 5px on hover, icons scale to 110 percent, and arrow icons translate 4px to indicate forward movement. The hero includes seasonal motion, light-theme snowfall and dark-theme rain or lightning, which should remain subtle and pointer-events-free.

## 6. Do's and Don'ts

### Do:

- **Do** use Ark Blue for primary action, active navigation, focus, and core brand marks.
- **Do** keep service copy plain and specific; the design should make technical expertise legible.
- **Do** preserve keyboard focus rings on buttons, inputs, navigation, badges, and mobile controls.
- **Do** use rounded cards and gentle elevation for interactive service exploration.
- **Do** keep faith-informed mission language present but balanced with practical service proof.
- **Do** use reduced-motion accommodations for nonessential animation when adding new motion.

### Don't:

- **Don't** expand generic agency-template presentation: centered stacks, identical icon cards, and vague "innovation" copy need stronger purpose.
- **Don't** use inflated SaaS claims, vague innovation language, or urgency patterns that conflict with trust before urgency.
- **Don't** add new gradient text. Existing `gradient-text` is legacy surface language, not a pattern to multiply.
- **Don't** use side-stripe borders, decorative glassmorphism, or hero-metric templates.
- **Don't** turn JetBrains Mono into a costume for technical credibility.
- **Don't** make green or amber decorative accents; they are state colors.
