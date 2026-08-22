import { roadmapDomains, type AtlasRoadmapDomain } from "./atlas-roadmap";

export type AtlasAgentRoute = { domain: AtlasRoadmapDomain; agent: string; rationale: string; confidence: "high" | "medium" | "low"; requiresConfirmation: boolean };

const keywordMap: Array<{ domain: AtlasRoadmapDomain; words: string[] }> = [
  { domain: "wallet", words: ["budget", "money", "afford", "spend", "subscription", "saving"] },
  { domain: "food", words: ["meal", "grocery", "pantry", "food", "recipe"] },
  { domain: "health", words: ["health", "wellness", "sleep", "recovery", "appointment", "activity"] },
  { domain: "lens", words: ["scan", "product", "material", "durable"] },
  { domain: "marketplace", words: ["repair", "used", "resell", "donate", "recycle"] },
  { domain: "mobility", words: ["walk", "bike", "transit", "drive", "commute"] },
  { domain: "learning", words: ["learn", "skill", "course", "portfolio"] },
  { domain: "opportunities", words: ["job", "grant", "scholarship", "opportunity", "internship"] },
  { domain: "projects", words: ["project", "milestone", "plan"] },
  { domain: "community", words: ["community", "volunteer", "neighbourhood"] },
  { domain: "impact", words: ["impact", "contribution", "regenerative"] },
  { domain: "wardrobe", words: ["wardrobe", "clothes", "outfit"] },
];

export function routeAtlasIntent(intent: string): AtlasAgentRoute {
  const normalized = intent.toLowerCase();
  const matches = keywordMap.map((entry) => ({ domain: entry.domain, score: entry.words.filter((word) => normalized.includes(word)).length })).sort((a, b) => b.score - a.score);
  const top = matches[0] ?? { domain: "projects" as const, score: 0 };
  const blueprint = roadmapDomains.find((domain) => domain.id === top.domain)!;
  return { domain: top.domain, agent: blueprint.agent, rationale: top.score ? `Matched your request to ${top.score === 1 ? "one" : String(top.score)} ${blueprint.title.toLowerCase()} context cue${top.score === 1 ? "" : "s"}.` : "No strong domain signal was detected, so Atlas is using a general planning lane.", confidence: top.score >= 2 ? "high" : top.score === 1 ? "medium" : "low", requiresConfirmation: true };
}

export function searchRoadmapDomains(query: string) { const term = query.trim().toLowerCase(); if (!term) return roadmapDomains; return roadmapDomains.filter((domain) => [domain.title, domain.eyebrow, domain.agent, domain.prompt].join(" ").toLowerCase().includes(term)); }
