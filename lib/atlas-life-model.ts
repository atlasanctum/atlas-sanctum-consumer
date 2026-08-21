export type GraphEntityType = "person" | "household" | "goal" | "value" | "preference" | "constraint" | "habit" | "health_signal" | "financial_state" | "purchase" | "product" | "asset" | "skill" | "learning_path" | "opportunity" | "project" | "relationship" | "location" | "event" | "decision" | "recommendation" | "action" | "outcome" | "impact" | "trust_record" | "memory";
export type MemoryType = "session" | "personal" | "goal" | "decision" | "behavioral" | "household" | "project";
export type MemorySource = "user" | "system" | "integration" | "inference";
export type AutopilotLevel = 0 | 1 | 2 | 3 | 4;
export type ActionState = "today" | "snoozed" | "completed" | "rejected" | "prepared" | "automated";
export type OutcomeRating = "yes" | "partly" | "no";

export type GraphNode = { id: string; type: GraphEntityType; label: string; summary: string; confidence: number; source: MemorySource; updatedAt: string; isInference?: boolean };
export type GraphEdge = { id: string; from: string; relation: string; to: string };
export type MemoryRecord = { id: string; type: MemoryType; content: string; confidence: number; source: MemorySource; createdAt: string; updatedAt: string; expiresAt?: string; userConfirmed: boolean; enabled: boolean };
export type PreferenceProfile = { priceSensitivity: number; qualityPreference: number; sustainabilityPreference: number; conveniencePreference: number; riskTolerance: number; healthPriority: number; explanation: string; updatedAt: string };
export type PulseItem = { id: string; domain: "finance" | "health" | "opportunity" | "home" | "commerce" | "learning" | "impact"; situation: string; explanation: string; recommendation: string; alternative: string; expectedOutcome: string; importance: number; urgency: number; confidence: number; dismissed?: boolean };
export type ActionCenterItem = { id: string; title: string; detail: string; domain: PulseItem["domain"]; importance: number; urgency: number; expectedValue: number; riskReduction: number; goalAlignment: number; effort: number; reversibility: number; confidence: number; state: ActionState; dueLabel: string; automationAllowed: boolean; outcome?: OutcomeRating; outcomeNote?: string };
export type ScenarioResult = { title: string; subtitle: string; monthlyChange: number; timeImpactHours: number; opportunity: string; risk: string; resilience: string; isEstimate: true };
export type ScenarioPlan = { id: string; prompt: string; currency: string; current: ScenarioResult; bestCase: ScenarioResult; baseCase: ScenarioResult; worstCase: ScenarioResult; createdAt: string };
export type TrustRecord = { id: string; subject: string; status: "verified" | "supported" | "unverified" | "contradicted" | "unknown"; sourceQuality: number; recency: number; corroboration: number; transparency: number; summary: string };
export type ImpactRecord = { id: string; level: "individual" | "household" | "community" | "project"; type: string; quantity: number; unit: string; methodology: string; evidence: string; verification: "verified" | "reported" | "estimate"; confidence: number; createdAt: string };
export type ProductLifecycle = { id: string; name: string; status: "discovered" | "purchased" | "active" | "maintenance" | "repair" | "resale" | "reuse" | "recycle"; purchasePrice: number; estimatedLifetimeCost: number; repairability: number; nextAction: string; owned: boolean };
export type PriceWatch = { id: string; item: string; currentPrice: number; targetPrice: number; status: "watching" | "target_met" | "unavailable"; source: string; updatedAt: string };
export type DomainEventType = "PurchaseCreated" | "GoalCreated" | "GoalCompleted" | "TransactionRecorded" | "OpportunityFound" | "OpportunitySaved" | "ProjectCreated" | "ProjectCompleted" | "HealthTrendDetected" | "ProductScanned" | "RecommendationAccepted" | "RecommendationRejected" | "ImpactRecorded";
export type DomainEvent = { id: string; type: DomainEventType; occurredAt: string; payload: Record<string, string | number | boolean> };

const now = new Date().toISOString();
export const initialGraph: { nodes: GraphNode[]; edges: GraphEdge[] } = { nodes: [
  { id: "person-eugene", type: "person", label: "Eugene", summary: "Atlas profile owner", confidence: 1, source: "user", updatedAt: now },
  { id: "goal-safety", type: "goal", label: "Build a €1,200 buffer", summary: "Financial resilience goal", confidence: 0.95, source: "user", updatedAt: now },
  { id: "goal-career", type: "goal", label: "Secure a data fellowship", summary: "Career opportunity with a near deadline", confidence: 0.9, source: "user", updatedAt: now },
  { id: "asset-laptop", type: "asset", label: "Current laptop", summary: "Existing device suitable for regular work", confidence: 0.72, source: "inference", isInference: true, updatedAt: now },
  { id: "skill-data", type: "skill", label: "Data analysis", summary: "Developing capability aligned to fellowship goals", confidence: 0.86, source: "user", updatedAt: now },
  { id: "opportunity-fellowship", type: "opportunity", label: "Civic data fellowship", summary: "Application closes tomorrow", confidence: 0.88, source: "system", updatedAt: now },
], edges: [
  { id: "edge-1", from: "person-eugene", relation: "PURSUUES", to: "goal-safety" }, { id: "edge-2", from: "person-eugene", relation: "PURSUUES", to: "goal-career" }, { id: "edge-3", from: "person-eugene", relation: "OWNS", to: "asset-laptop" }, { id: "edge-4", from: "person-eugene", relation: "LEARNS", to: "skill-data" }, { id: "edge-5", from: "skill-data", relation: "ENABLES", to: "opportunity-fellowship" },
] };
export const initialMemories: MemoryRecord[] = [
  { id: "memory-1", type: "personal", content: "Prefers durable purchases when the lifetime value is clear.", confidence: 0.9, source: "user", createdAt: now, updatedAt: now, userConfirmed: true, enabled: true },
  { id: "memory-2", type: "goal", content: "Working toward a €1,200 resilience buffer.", confidence: 0.95, source: "user", createdAt: now, updatedAt: now, userConfirmed: true, enabled: true },
  { id: "memory-3", type: "behavioral", content: "May respond best to a single focused next action in the morning.", confidence: 0.58, source: "inference", createdAt: now, updatedAt: now, expiresAt: "2026-11-01T00:00:00.000Z", userConfirmed: false, enabled: true },
];
export const initialPreference: PreferenceProfile = { priceSensitivity: 72, qualityPreference: 82, sustainabilityPreference: 76, conveniencePreference: 54, riskTolerance: 43, healthPriority: 81, explanation: "Atlas has weighted your explicit priorities for security, health, and long-term value. You can edit or disable these signals anytime.", updatedAt: now };
export const initialPulse: PulseItem[] = [
  { id: "pulse-fellowship", domain: "opportunity", situation: "A high-fit fellowship closes tomorrow.", explanation: "Your current data-analysis skill and career goal suggest a strong match.", recommendation: "Reserve 35 minutes to submit the application today.", alternative: "Save the opportunity and prepare a stronger application for the next cohort.", expectedOutcome: "A completed application and clearer next skill steps.", importance: 94, urgency: 96, confidence: 88 },
  { id: "pulse-budget", domain: "finance", situation: "Your flexible-spend target is narrowing.", explanation: "A planned purchase would reduce this month’s buffer progress.", recommendation: "Delay the non-essential purchase until the weekly review.", alternative: "Proceed and reduce a different flexible category.", expectedOutcome: "Preserve more of the monthly resilience contribution.", importance: 81, urgency: 68, confidence: 78 },
  { id: "pulse-home", domain: "home", situation: "A home maintenance item is approaching its review date.", explanation: "Early preparation makes repair or replacement more reversible.", recommendation: "Add a 15-minute maintenance review to Saturday.", alternative: "Snooze this until the next monthly review.", expectedOutcome: "Fewer surprise home costs.", importance: 57, urgency: 42, confidence: 63 },
];
export const initialLifeActions: ActionCenterItem[] = [
  { id: "life-action-fellowship", title: "Submit the civic data fellowship", detail: "Deadline tomorrow · 35 minutes estimated", domain: "opportunity", importance: 94, urgency: 96, expectedValue: 90, riskReduction: 64, goalAlignment: 97, effort: 35, reversibility: 88, confidence: 88, state: "today", dueLabel: "Today", automationAllowed: false },
  { id: "life-action-purchase", title: "Review the planned purchase", detail: "Protect your buffer before buying", domain: "finance", importance: 81, urgency: 68, expectedValue: 75, riskReduction: 82, goalAlignment: 88, effort: 12, reversibility: 91, confidence: 78, state: "today", dueLabel: "This week", automationAllowed: false },
  { id: "life-action-repair", title: "Inspect the repairable home item", detail: "Prevent a larger maintenance issue", domain: "home", importance: 57, urgency: 42, expectedValue: 61, riskReduction: 69, goalAlignment: 56, effort: 15, reversibility: 79, confidence: 63, state: "today", dueLabel: "Saturday", automationAllowed: true },
];
export const initialTrustRecords: TrustRecord[] = [{ id: "trust-product", subject: "Scanned product evidence", status: "supported", sourceQuality: 72, recency: 82, corroboration: 52, transparency: 80, summary: "Product facts come from a cited external record and should be verified before purchase." }];
export const initialImpactRecords: ImpactRecord[] = [{ id: "impact-repair", level: "individual", type: "Repair preparation", quantity: 1, unit: "planned action", methodology: "User-confirmed Atlas Action Center entry", evidence: "Action created", verification: "reported", confidence: 0.72, createdAt: now }];
export const initialProductLifecycles: ProductLifecycle[] = [
  { id: "asset-laptop", name: "Current laptop", status: "active", purchasePrice: 920, estimatedLifetimeCost: 710, repairability: 74, nextAction: "Review warranty and battery health in 6 months", owned: true },
  { id: "asset-jacket", name: "Winter jacket", status: "repair", purchasePrice: 160, estimatedLifetimeCost: 115, repairability: 88, nextAction: "Compare repair before replacing", owned: true },
];
export const initialPriceWatches: PriceWatch[] = [{ id: "watch-shoes", item: "Running shoes", currentPrice: 132, targetPrice: 120, status: "watching", source: "User watch", updatedAt: now }];
