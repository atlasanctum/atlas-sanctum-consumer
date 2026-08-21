# Atlas Sanctum Consumer — Mobile Interface Design

Atlas Sanctum Consumer is designed as a **calm, capable personal intelligence system**, not a bundle of separate utilities. The mobile experience prioritizes a single next-best action, then provides deliberate paths into discovery, planning, impact, and personal configuration. The initial build uses local, illustrative personal data and clear “connected data” affordances so the product model is credible without claiming live financial, health, or marketplace integrations.

## Device and Interaction Foundation

The interface is designed for a **9:16 portrait phone** and one-handed use. Primary actions sit in the lower half of the screen or inside a persistent bottom navigation bar. The Atlas AI orb floats directly above that bar on the right, with a generous 48pt hit target. The visual language follows iOS conventions: system-style navigation, readable text hierarchy, rounded continuous cards, restrained elevation, short sheets for contextual work, and visible press feedback.

## Screen List

| Screen | Primary content and functionality |
| --- | --- |
| Welcome | Introduces the personal Atlas proposition and starts progressive onboarding. |
| Priorities | Lets the user choose several current priorities such as health, financial security, food, community, and learning. |
| Values | Lets the user rank guiding values and establishes the decision weighting model. |
| Home | Presents the daily briefing, immediate action, balance context, goal progress, and the Atlas Lens entry point. |
| Discover | Surfaces opportunity cards, useful services, selected learning pathways, and category filters. |
| Act | Organizes today’s actions, plans, and active goals in a focused task-oriented timeline. |
| Impact | Shows regenerative contribution, R.I.U. balance, impact themes, and community projects. |
| Profile | Shows the personal graph summary, context settings, consent controls, and connected-data placeholders. |
| Atlas AI sheet | Accepts a typed prompt and returns an action-oriented recommendation with decision factors, confidence, trade-offs, and next actions. |
| Atlas Lens sheet | Provides scan, photo, upload, and manual-search entry points. |
| Product intelligence sheet | Shows a scored product analysis, decision alternatives, justification, and follow-on actions. |

## Key User Flows

| Flow | Steps |
| --- | --- |
| Progressive onboarding | Welcome → choose priorities → rank values → enter the Home command center. |
| Daily decision | Home → select “Review plan” or a briefing card → Atlas AI sheet → read recommendation → save an action. |
| Product intelligence | Home → Atlas Lens → choose a scan method → product intelligence → compare options or save the item. |
| Opportunity discovery | Discover → filter an opportunity → open its relevant action → add it to the Act plan. |
| Values-to-impact loop | Act → complete an action → Impact → see the contribution and next community-oriented action. |
| Privacy configuration | Profile → data & consent → review permission groups and connection status. |

## Information Hierarchy

The Home screen answers “what is the best next decision?” before displaying secondary information. The top greeting and mode pill establish personal context. A large daily briefing card carries the primary recommendation, while lower cards are grouped by health, money, progress, and opportunities. The remaining tabs provide a direct, stable mental model: discover possibilities, act on commitments, understand contribution, and manage the underlying personal context.

## Color and Type System

| Token | Color | Intended use |
| --- | --- | --- |
| Ink | `#13221C` | Primary text and dark navigation surfaces. |
| Atlas green | `#1D6B54` | Primary action, active states, and optimistic intelligence. |
| Moss | `#447261` | Secondary labels, icon circles, and data accents. |
| Mist | `#F5F4EF` | Warm app background, supporting a calm editorial surface. |
| Paper | `#FFFFFF` | Cards, sheets, and elevated controls. |
| Sun | `#EAB464` | Financial/attention accent and active score highlights. |
| Terracotta | `#C96843` | Caution, trade-offs, and urgent action affordances. |
| Line | `#D8DDD7` | Hairline dividers and card outlines. |

The headline style is a compact, high-contrast 30–34pt system serif where available, while all operational UI uses the platform system sans-serif for accessibility and familiarity. Numerals are tabular where values are compared. Text meets the iOS expectation of clear contrast and uses a minimum 14pt body size.

## Domain Vocabulary and Local Data Model

The first build retains a small local personal graph. `Profile` owns priorities and ranked values. `Goal`, `ActionItem`, `Opportunity`, `ImpactMetric`, and `ProductInsight` all refer to a context tag and may be surfaced by the decision layer. `DecisionRecommendation` contains the best option, a concise explanation, trade-offs, confidence, four to six decision factors, and available actions. This vocabulary keeps the prototype ready for a future API, database, and provider-agnostic AI implementation without pretending to perform live analysis.

## Accessibility and Safety Decisions

Each icon is paired with an accessible label, interactive controls supply visible pressed states, and status information is not communicated by color alone. Health-related content is educational and avoids diagnosis or treatment claims. Financial and product recommendations are clearly labelled as planning guidance. Consent controls are visible in Profile rather than hidden in setup.

## Connected Product Architecture

The connected build adds three user-controlled capabilities. Atlas Lens becomes a full-screen camera experience that requests access only after the user chooses to scan, reads supported barcode formats locally, and sends the captured identifier into a product-intelligence request. The Connection Center is nested under Profile and separates Health Passport, financial accounts, and consent history into distinct cards. A connection begins only after a signed-in user confirms the data category, purpose, and revocation control.

| Capability | User experience | Service boundary | Protection |
| --- | --- | --- | --- |
| Atlas Lens | Scan an EAN, UPC, QR, or Code 128 barcode with a dedicated camera sheet. | The client sends a normalized barcode payload to a protected product procedure. | Camera access is requested just in time; repeated scan events are ignored. |
| Health Passport | View encrypted record cards and explicitly connect a health source when credentials are configured. | Protected records and consent endpoints scoped to the authenticated Atlas user. | Health content is encrypted before persistence and blocked when the production key is not valid. |
| Financial context | Connect an account provider, review the consent scope, and disconnect later. | Provider adapter boundary stores opaque encrypted connection metadata, never raw account credentials. | The production flow remains disabled until a valid server encryption key and provider credentials are configured. |
| Atlas AI | Ask for a decision and receive a recommendation, concise rationale, trade-off, confidence, and supporting sources. | A protected server procedure selects a live built-in language model and returns a validated response contract. | The model sees a minimized request context; source links are rendered as evidence, not as hidden reasoning. |

## Connected Screen and Flow Additions

The Profile screen gains an authenticated **Connection Center** and an individual **Consent Detail** sheet. The camera scanner opens only from Atlas Lens, so a scanner preview is never mounted behind another screen. The AI sheet adds a source row beneath the recommendation and shows a transparent readiness message when protected context has not been connected. All potentially sensitive writes are gated by a server-side encryption readiness check. In development, this makes the connection architecture observable without silently storing protected records under an invalid key.
