import { describe, expect, it } from "vitest";
import { appRouter } from "../server/routers";

describe("Atlas Life OS authorization", () => {
  it("does not expose snapshot persistence to an unauthenticated caller", async () => {
    const caller = appRouter.createCaller({ user: null, req: {} as never, res: {} as never });
    await expect(caller.atlas.life.snapshot()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("does not expose brief preferences to an unauthenticated caller", async () => {
    const caller = appRouter.createCaller({ user: null, req: {} as never, res: {} as never });
    await expect(caller.atlas.briefs.preferences()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
