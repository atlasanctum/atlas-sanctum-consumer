# Atlas Sanctum Consumer — Intelligence Architecture

Atlas is organized as a personal intelligence system whose client experience remains local-first while sensitive records are protected behind authenticated server boundaries. The Master Prompt II expansion establishes a modular life-model layer that can support richer providers and durable orchestration later without allowing external content or integrations to bypass user authority.

## Intelligence Flow

| Layer | Current module | Responsibility |
| --- | --- | --- |
| Personal Graph | `lib/atlas-life-model.ts` | Models declared people, goals, skills, assets, opportunities, values, decisions, outcomes, impact, and trust nodes. |
| Memory | `lib/atlas-life-context.tsx` | Maintains scoped, inspectable, removable, and disableable local records with source and confidence metadata. |
| Context | `lib/atlas-life-engine.ts` | Selects ranked actions and resolves relevant entities rather than serializing the entire graph. |
| Reasoning | `server/atlas-services.ts` | Uses a server-side, schema-validated AI request with minimized context and cited supporting evidence. |
| Decision | `lib/atlas-life-engine.ts` | Scores actions by importance, urgency, expected value, risk reduction, goal alignment, effort, reversibility, and confidence. |
| Action and outcome | `lib/atlas-life-context.tsx` | Supports prepare, complete, snooze, reject, automate, and outcome feedback states. |
| Learning | `lib/atlas-life-context.tsx` | Records user outcomes and domain events for future provider-backed learning, without silently treating inference as fact. |

## Safety and Authority

Atlas treats the user as the final authority. The action model explicitly distinguishes observation, recommendation, preparation, confirmed execution, and guardrailed automation. Sensitive health and financial writes remain unavailable until the server-side encryption guard reports a valid production key. External product and knowledge content is evidence, not instruction, and structured AI output is validated before it reaches the interface.

## Roadmap Domain Model

The completed consumer roadmap is expressed through interoperable Wallet, Food, Health, Home, Wardrobe, Mobility, Learning, Opportunity, Project, Community, Marketplace, and Impact domain workflows. Each workflow adds only declared or clearly labelled inferred context to the Personal Graph, then delegates prioritisation to the same decision, action, outcome, and learning loop. The Life Hub provides a single entry point for these domains so users can move from a question to a prepared action without losing context.

The Atlas Orchestrator routes a request to a small set of specialised reasoning lanes—Finance, Food, Wellness, Commerce, Home, Capability, and Impact—based on the request’s language and active graph context. This is an explainable selection aid rather than concealed agent autonomy. Every lane returns its scope, supporting context, uncertainties, and a user-confirmed next step.

## Provider Boundaries

The mobile client communicates only through typed server procedures. Provider-specific health, financial, commerce, AI, and optional Supabase-compatible persistence integrations sit behind adapter-ready services, allowing unavailable credentials or unsafe services to be disabled without replacing app screens. The feature flags and orchestration boundaries can be extended by a future internal console; normal users receive no internal diagnostic data.

## Persistence Strategy

The initial life model is persisted locally for an offline-capable personal experience. The database already contains protected connection, consent, and sensitive-record tables. Future server persistence for memories, actions, outcomes, trust, projects, and impact must remain user-scoped and follow the same explicit-consent model.
