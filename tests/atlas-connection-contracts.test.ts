import { describe, expect, it } from "vitest";
import { aiRecommendationSchema } from "../server/atlas-services";
import { connectionInput } from "../server/routers";

describe("Atlas connected-data contracts", () => {
  it("requires an explicit purpose and scoped consent before beginning a health connection", () => {
    expect(connectionInput.safeParse({ domain: "health", provider: "SMART on FHIR", purpose: "Prepare a clinician appointment", scopes: ["patient/*.read"] }).success).toBe(true);
    expect(connectionInput.safeParse({ domain: "health", provider: "FHIR", purpose: "", scopes: [] }).success).toBe(false);
  });
  it("accepts only concise cited recommendation payloads with bounded confidence", () => {
    const result = aiRecommendationSchema.safeParse({ recommendation: "Keep the budget buffer intact.", reasoningSummary: "Your stated resilience goal is better served by delaying a non-essential purchase.", tradeOff: "The purchase moves to next week.", confidence: 84, factors: [{ label: "Financial resilience", score: 92 }, { label: "Personal fit", score: 87 }], citedSourceIds: ["atlas-local-context"], safetyNote: "Planning guidance only." });
    expect(result.success).toBe(true);
  });
});
