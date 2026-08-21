export type DecisionFactors = {
  financialValue: number;
  healthValue: number;
  environmentalValue: number;
  socialValue: number;
  resilience: number;
  personalAlignment: number;
  convenience: number;
  confidence: number;
};

export type DecisionOption = { id: string; label: string; factors: DecisionFactors; tradeOff: string };
export type DecisionRecommendation = {
  title: string;
  recommendation: string;
  summary: string;
  tradeOff: string;
  confidence: number;
  factors: Array<{ label: string; score: number }>;
  action: string;
};

const factorWeights: Record<keyof DecisionFactors, number> = {
  financialValue: 0.18,
  healthValue: 0.17,
  environmentalValue: 0.1,
  socialValue: 0.06,
  resilience: 0.11,
  personalAlignment: 0.19,
  convenience: 0.09,
  confidence: 0.1,
};

export function calculateDecisionScore(factors: DecisionFactors): number {
  const score = (Object.keys(factorWeights) as Array<keyof DecisionFactors>).reduce((total, key) => total + factors[key] * factorWeights[key], 0);
  return Math.round(score);
}

export function rankDecisionOptions(options: DecisionOption[]): DecisionOption[] {
  return [...options].sort((first, second) => calculateDecisionScore(second.factors) - calculateDecisionScore(first.factors));
}

const dailyDecision: DecisionRecommendation = {
  title: "Best next decision",
  recommendation: "Protect your energy before adding new commitments.",
  summary: "A 25-minute walk and a focused career block fit your health, learning, and financial-security priorities with the least friction today.",
  tradeOff: "You may defer one low-urgency errand until tomorrow.",
  confidence: 86,
  factors: [{ label: "Personal fit", score: 93 }, { label: "Health value", score: 88 }, { label: "Financial value", score: 79 }, { label: "Convenience", score: 85 }],
  action: "Schedule a 25-minute momentum walk",
};
const foodDecision: DecisionRecommendation = {
  title: "A balanced food plan",
  recommendation: "Choose the seasonal pantry plan for the next three dinners.",
  summary: "It keeps the basket under your planned budget, supports your nutrition intention, and uses versatile ingredients with less waste.",
  tradeOff: "It requires one short prep session this evening.",
  confidence: 82,
  factors: [{ label: "Budget fit", score: 89 }, { label: "Health value", score: 86 }, { label: "Lower waste", score: 81 }, { label: "Convenience", score: 72 }],
  action: "Save the three-dinner pantry plan",
};
const moneyDecision: DecisionRecommendation = {
  title: "A steadier money choice",
  recommendation: "Keep the €340 buffer intact and delay the non-essential purchase.",
  summary: "Your local plan leaves a modest buffer after planned expenses. Preserving it supports resilience while keeping your weekly food goal recoverable.",
  tradeOff: "The purchase moves to next week unless a need becomes urgent.",
  confidence: 84,
  factors: [{ label: "Financial resilience", score: 92 }, { label: "Personal fit", score: 87 }, { label: "Long-term value", score: 83 }, { label: "Convenience", score: 68 }],
  action: "Review the purchase next Tuesday",
};
const productDecision: DecisionRecommendation = {
  title: "Atlas product intelligence",
  recommendation: "Choose the repairable option with verified material sourcing.",
  summary: "It costs a little more today, but its durability and repairability produce a stronger lifetime-value result for your stated values.",
  tradeOff: "€15 more today than the cheapest alternative.",
  confidence: 88,
  factors: [{ label: "Long-term value", score: 90 }, { label: "Quality", score: 91 }, { label: "Trust", score: 84 }, { label: "Environment", score: 71 }],
  action: "Save the repairable option for comparison",
};

export function getRecommendationForPrompt(prompt: string): DecisionRecommendation {
  const normalized = prompt.toLowerCase();
  if (/(food|meal|nutrition|grocery|groceries)/.test(normalized)) return foodDecision;
  if (/(afford|money|budget|spend|purchase|cost)/.test(normalized)) return moneyDecision;
  if (/(product|compare|scan|inside this)/.test(normalized)) return productDecision;
  return dailyDecision;
}
