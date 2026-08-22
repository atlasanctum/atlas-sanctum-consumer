# Atlas Consumer Roadmap Completion Model

The synced roadmap is implemented as a **cohesive Life OS**, rather than a collection of isolated utility screens. Each domain contributes user-controlled context to the Personal Graph, produces explainable recommendations, and ends with a prepared or confirmed action. Sensitive health, financial, and purchase actions remain bounded by explicit consent and confirmation.

| Roadmap area | Consumer surface | Intelligence and safety boundary |
| --- | --- | --- |
| Wallet | Financial plan, affordability context, goals, subscriptions, and scenarios | Informational planning only; no transfer, investment, or payment execution. |
| Food and Health | Meal, pantry, wellness, recovery, document, and appointment-preparation plans | Educational organisation only; no diagnosis, treatment, or clinical interpretation. |
| Home and Wardrobe | Asset, maintenance, repair, resale, warranty, and duplicate-prevention workflows | An asset is only changed after user confirmation. |
| Mobility | User-weighted walk, cycle, transit, and car comparisons | Time, cost, health, and impact trade-offs remain visible. |
| Learning and Opportunities | Capability Passport, projects, skills evidence, and opportunity fit | Atlas separates evidence from inference and asks before saving an application task. |
| Community and Projects | Milestones, contribution preparation, collaborators, and outcome records | No invitation, commitment, or public action occurs automatically. |
| Marketplace and Impact | New, used, repair, resale, share, donation, and recycling paths with RIU accounting | Impact is marked verified, supported, estimated, reported, or unknown. |
| Specialized agents | Finance, Food, Wellness, Commerce, Home, Capability, and Impact reasoning lanes | The Atlas Orchestrator selects a lane, reports why, and preserves final user authority. |

## Persistence and Provider Strategy

Atlas uses the existing authenticated server and user-scoped database procedures as its current cloud persistence layer. The data contract is provider-independent so a future Supabase, PostgreSQL, or external domain provider can be introduced behind the same boundaries. Live health, financial, retail, or mapping providers remain visibly unavailable until their credentials and consent flows are configured; Atlas does not imitate a connection or manufacture upstream data.

## Completion Criteria

The consumer roadmap is considered implemented when each domain is discoverable from the mobile Life Hub, has a useful decision or planning workflow, can prepare a user-confirmed action, participates in the Personal Graph model, and preserves the platform’s privacy, uncertainty, and autonomy controls.
