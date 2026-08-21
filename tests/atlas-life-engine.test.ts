import { describe, expect, it } from "vitest";
import { buildSavingsScenario, canEnableAutomation, nextBestAction, resolveEntity, sortPulse } from "../lib/atlas-life-engine";
import { initialGraph, initialLifeActions, initialPulse } from "../lib/atlas-life-model";

describe("Atlas Life OS decision contracts", () => {
  it("selects the highest-leverage open action as the next best action", () => {
    expect(nextBestAction(initialLifeActions)?.id).toBe("life-action-fellowship");
  });
  it("removes dismissed situations before Pulse prioritization", () => {
    const items = initialPulse.map((item) => item.id === "pulse-fellowship" ? { ...item, dismissed: true } : item);
    expect(sortPulse(items)[0]?.id).toBe("pulse-budget");
  });
  it("creates explicit current, best, base, and worst-case estimate paths", () => {
    const plan = buildSavingsScenario(250);
    expect(plan.baseCase.monthlyChange).toBe(250);
    expect(plan.current.isEstimate).toBe(true);
    expect(plan.bestCase.risk).toBe("Low");
    expect(plan.worstCase.title).toBe("Worst case");
  });
  it("resolves an owned graph entity without expanding unrelated context", () => {
    expect(resolveEntity("laptop", initialGraph.nodes)?.id).toBe("asset-laptop");
  });
  it("requires the guarded level and blocks health or financial autonomous execution", () => {
    const repairAction = initialLifeActions.find((action) => action.id === "life-action-repair")!;
    const financeAction = initialLifeActions.find((action) => action.id === "life-action-purchase")!;
    expect(canEnableAutomation(repairAction, 4)).toBe(true);
    expect(canEnableAutomation(repairAction, 3)).toBe(false);
    expect(canEnableAutomation(financeAction, 4)).toBe(false);
  });
});
