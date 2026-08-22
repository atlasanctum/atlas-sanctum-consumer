import { describe, expect, it } from "vitest";
import { routeAtlasIntent, searchRoadmapDomains } from "../lib/atlas-orchestrator";

describe("Atlas roadmap orchestration", () => {
  it("routes a wellness question to the Wellness Agent with confirmation required", () => {
    const route = routeAtlasIntent("Help me plan sleep and recovery this week");
    expect(route.domain).toBe("health");
    expect(route.agent).toBe("Wellness Agent");
    expect(route.requiresConfirmation).toBe(true);
  });

  it("searches the domain catalog without inventing a domain", () => {
    expect(searchRoadmapDomains("repair").map((domain) => domain.id)).toContain("marketplace");
    expect(searchRoadmapDomains("not-a-domain")).toEqual([]);
  });
});
