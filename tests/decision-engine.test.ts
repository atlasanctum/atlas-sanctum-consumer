import { describe, expect, it } from "vitest";
import { calculateDecisionScore, getRecommendationForPrompt, rankDecisionOptions, type DecisionOption } from "../lib/decision-engine";
describe("Atlas decision engine", () => {
  it("weights personal alignment and financial value in the composite score", () => { expect(calculateDecisionScore({ financialValue: 90, healthValue: 70, environmentalValue: 50, socialValue: 40, resilience: 80, personalAlignment: 95, convenience: 60, confidence: 80 })).toBe(76); });
  it("orders options by their composite decision score", () => { const options: DecisionOption[] = [{ id: "lower", label: "Lower fit", tradeOff: "", factors: { financialValue: 35, healthValue: 40, environmentalValue: 40, socialValue: 30, resilience: 35, personalAlignment: 30, convenience: 85, confidence: 55 } }, { id: "higher", label: "Higher fit", tradeOff: "", factors: { financialValue: 80, healthValue: 85, environmentalValue: 75, socialValue: 60, resilience: 80, personalAlignment: 90, convenience: 65, confidence: 85 } }]; expect(rankDecisionOptions(options)[0]?.id).toBe("higher"); });
  it("selects concise recommendation categories based on the request", () => { expect(getRecommendationForPrompt("Can I afford this purchase?").title).toBe("A steadier money choice"); expect(getRecommendationForPrompt("Build a meal plan").title).toBe("A balanced food plan"); });
});
