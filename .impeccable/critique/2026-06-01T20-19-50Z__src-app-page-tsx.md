---
target: /Users/noahjenkins/Code/ark-builder-labs-site/src/app/page.tsx
total_score: 25
p0_count: 0
p1_count: 2
timestamp: 2026-06-01T20-19-50Z
slug: src-app-page-tsx
---
**Design Health Score**

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Active navigation and button states are clear; viewport-triggered reveals can make below-fold content appear absent in full-page snapshots. |
| 2 | Match System / Real World | 3 | Stewardship and service intent are clear; phrases like "digital age" and unsupported success claims feel generic. |
| 3 | User Control and Freedom | 3 | Navigation and mobile menu exits exist; there is no persistent contact path after a long mobile scroll. |
| 4 | Consistency and Standards | 3 | Components are consistent; gradient text, metric rows, and icon cards are repeated as section grammar. |
| 5 | Error Prevention | 2 | Contact flow has required fields, but the homepage does little to guide users toward the right service before contact. |
| 6 | Recognition Rather Than Recall | 3 | Services and contact paths are visible; repeated "Learn More" links do not differentiate the service decisions. |
| 7 | Flexibility and Efficiency | 2 | There are multiple contact routes, but the mobile path is long and lacks a compact decision shortcut. |
| 8 | Aesthetic and Minimalist Design | 2 | The page is clean, but the centered hero, hero metrics, gradient text, and identical cards read as a template. |
| 9 | Error Recovery | 2 | Contact form states exist elsewhere; rate-limit recovery copy is thin, and the homepage does not surface fallback guidance. |
| 10 | Help and Documentation | 2 | Blog and FAQ content exist elsewhere; the homepage does not expose process guidance or expectation setting. |
| **Total** | | **25/40** | **Acceptable: functional, trustworthy baseline, but brand distinctiveness and mobile polish need work.** |

**Anti-Patterns Verdict**

**LLM assessment:** The homepage does not look broken, but it does look plausibly AI-generated. The strongest tells are the centered gradient hero, the hero-metric row, the repeated icon-card service grid, the blue gradient proof band, and generic agency phrasing. The faith-informed stewardship voice is the strongest differentiator, but the visual system does not yet carry that idea with equivalent specificity.

**Deterministic scan:** `npx impeccable detect --json ...` returned 2 findings:

- `gradient-text` in `src/app/globals.css:94`: true positive. It is used across hero, section headings, stats, nav brand, and CTA text.
- `overused-font` in `src/app/globals.css:2`: contextual warning. Inter is acceptable as body type in the current design system, but it does not help the brand feel distinct.

**Visual overlays:** The CLI available in this environment does not expose `impeccable live`, so no browser overlay tab was created. Playwright screenshots were captured instead for desktop, mobile, section scroll states, and the mobile menu.

**Cognitive Load**

Moderate load: 3 checklist failures.

- Single focus fails in the hero: quote, mission, two CTAs, and three metrics all compete for first-screen meaning.
- Minimal choices fails in the mobile menu: 5 navigation links, a primary CTA, and 4 social links appear in one panel, and the social row overflows horizontally.
- Progressive disclosure is weak in services: each card exposes title, description, technologies, features, and a repeated CTA at once.

Decision counts:

- Desktop nav: 5 page links, primary CTA, theme toggle.
- Hero: 2 primary decisions plus 3 proof metrics.
- Services: 3 cards plus 4 service-related links.
- Mobile menu: 10 visible choices, with Facebook partially off-screen at 390px.

**Overall Impression**

This is a competent service-site baseline. It is legible, calm, and easy to navigate. The biggest opportunity is to make the site feel like Ark Builder Labs specifically, not a well-behaved agency template with stewardship copy dropped into it.

**What's Working**

- The primary contact path is visible early. "Get a Quote" appears above the fold on desktop and mobile, and the final CTA offers both conversation and scheduling.
- The service categories are understandable. Web/mobile, cloud, and AI consulting are clear enough for a prospect to self-identify a path.
- The brand voice has a real center. Honesty, stewardship, and long-term responsibility are more memorable than typical "innovation partner" language.

**Priority Issues**

**[P1] Template-brand language in the visual system**

**Why it matters:** The stated brand is faithful, practical, trustworthy, and enduring, but the visual structure says generic tech agency: gradient text, centered stack, metric row, identical service cards, blue gradient band. Prospects can understand the offer, but they do not get a strong reason to remember this studio.

**Fix:** Replace the hero metric row with proof that feels like stewardship: a short operating promise, project lifecycle, maintenance posture, or concrete client handoff standard. Use solid text color instead of gradient text. Give the hero a more specific visual object, such as a workshop/process diagram, code-to-deployment path, or case-study artifact.

**Suggested command:** `$impeccable bolder`

**[P1] Mobile menu social row overflows**

**Why it matters:** At 390px wide, the mobile menu pushes the Facebook link past the right edge. This makes the menu feel unfinished and weakens trust at the exact moment a visitor is choosing a contact route.

**Fix:** Stack social links vertically or use a wrapping grid. Make the close button at least 44px by 44px. Consider reducing the panel width pressure by using `min(20rem, 100vw)` and checking the menu at 320px, 390px, and 430px.

**Suggested command:** `$impeccable adapt`

**[P2] Services section spends too much scroll on same-shaped cards**

**Why it matters:** On mobile, the services section is nearly 2,000px tall. Each card repeats the same visual structure, so the scroll feels longer than the amount of new information justifies.

**Fix:** Turn the homepage services area into a faster chooser: one compact comparison table, three use-case rows, or a "what you need / what we build" selector. Keep deep technology lists on service detail pages.

**Suggested command:** `$impeccable distill`

**[P2] Proof claims are duplicated and under-supported**

**Why it matters:** "3+", "100+ Projects Created", "100% Client Satisfaction", and "100% Success Rate" repeat the hero-metric template. Without context, "100%" claims can feel less trustworthy, not more.

**Fix:** Swap broad metrics for concrete evidence: project types, certifications with links, example deliverables, client workflow promises, response SLA, or short case-study outcomes. If metrics remain, qualify what they measure.

**Suggested command:** `$impeccable clarify`

**[P2] Critical content depends heavily on reveal animation**

**Why it matters:** Full-page screenshots from page top showed blank bands because below-fold animated sections had not intersected yet. A human scroll sees the content, but no-JS, reduced-motion, printing, crawler snapshots, and some automated QA paths can see an emptier page than intended.

**Fix:** Ensure critical content is present by default, then animate from a visible or near-visible state. Add reduced-motion handling and avoid opacity-zero gates for essential section content.

**Suggested command:** `$impeccable harden`

**Persona Red Flags**

**Jordan (First-Timer):** The first action is visible, but the homepage asks Jordan to parse mission, scripture, metrics, service categories, technologies, and features before explaining how engagement works. Repeated "Learn More" links force Jordan to guess which service path fits.

**Casey (Distracted Mobile User):** The top CTA is visible, but the page becomes a long scroll quickly. Services take nearly 2,000px on mobile, the final CTA sits around 4,600px, and the mobile menu social row overflows. Casey may never reach the bottom CTA.

**Riley (Stress Tester):** Riley will question unsupported "100%" claims and notice polish gaps like "Automate Buisness Workflows" in constants, "front of our mind" copy, and the mobile menu overflow. Those details create doubt about implementation rigor.

**Operator Prospect: "Morgan"**

**Profile:** Business owner or operator looking for a dependable technical partner, not a flashy vendor.

**Red flags:** Morgan needs evidence of process, handoff, risk management, and post-launch stewardship. The homepage emphasizes values but gives limited operational proof, so Morgan still has to infer how the team works.

**Minor Observations**

- `src/lib/constants.ts` has a typo: "Automate Buisness Workflows".
- "We build with security in the front of our mind" sounds awkward. "We design with security from the start" is clearer.
- The nav brand uses gradient text too, which spreads the gradient-text issue beyond headings.
- The small floating circular "N" overlay appears in screenshots. If it is a third-party widget, confirm it is intended and not visually competing with the page.
- Next.js warned that it inferred `/Users/noahjenkins` as the workspace root because multiple lockfiles exist. This is not a design issue, but it can affect local builds and tracing.

**Questions to Consider**

- What proof would make a cautious business owner trust Ark Builder Labs in the first 30 seconds?
- Could the homepage teach the engagement process before listing technologies?
- What visual metaphor says "stewardship workshop" more clearly than blue gradient cards?
- Which metric would you still publish if a skeptical prospect asked how it was measured?
