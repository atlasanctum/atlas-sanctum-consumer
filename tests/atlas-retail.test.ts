import { describe, expect, it } from "vitest";
import { getRetailProviderReadiness, searchRetailPrices } from "../server/atlas-services";

describe("Atlas retail price provider", () => {
  it("fails closed with transparent evidence when live credentials are absent", async () => {
    const result = await searchRetailPrices({ query: "running shoes", limit: 3 });
    if (!getRetailProviderReadiness().configured) {
      expect(result.live).toBe(false);
      expect(result.status).toBe("credentials_missing");
      expect(result.sources[0]?.title).toContain("eBay Browse API");
    }
  });
});
