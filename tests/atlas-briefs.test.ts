import { describe, expect, it } from "vitest";
import { activeCadences, normalizeBriefPreferences, toCron } from "../server/atlas-briefs";

describe("Atlas brief scheduling", () => {
  it("creates six-field UTC cron expressions for daily and weekly schedules", () => {
    const preferences = normalizeBriefPreferences({ dailyEnabled: true, dailyHour: 8, dailyMinute: 15, weeklyEnabled: true, weeklyWeekday: 1, weeklyHour: 9, weeklyMinute: 30 });
    expect(toCron("daily", preferences)).toBe("0 15 8 * * *");
    expect(toCron("weekly", preferences)).toBe("0 30 9 * * 1");
    expect(activeCadences(preferences)).toEqual(["daily", "weekly"]);
  });

  it("rejects unsafe delivery times before a job can be created", () => {
    expect(() => normalizeBriefPreferences({ dailyHour: 24 })).toThrow("hours");
    expect(() => normalizeBriefPreferences({ weeklyMinute: 60 })).toThrow("minutes");
  });
});
