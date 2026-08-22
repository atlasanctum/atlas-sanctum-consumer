import { describe, expect, it } from "vitest";
import { computeRiuBalance, riuLabel } from "../lib/atlas-impact-engine";

describe("Atlas RIU accounting", () => {
  it("weights contribution records by evidence state without inflating unknown activity", () => {
    expect(computeRiuBalance([{ quantity: 2, verification: "verified" }, { quantity: 4, verification: "reported" }, { quantity: 7, verification: "unknown" }])).toBe(3);
  });
  it("labels RIU as a transparent reference unit rather than a currency or claim", () => {
    expect(riuLabel([{ quantity: 1, verification: "estimated" }]).method).toContain("not money");
  });
});
