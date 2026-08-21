import { z } from "zod";
import { COOKIE_NAME } from "../shared/const";
import { encryptAtlasPayload, getAtlasEncryptionReadiness } from "./atlas-crypto";
import { generateCitedRecommendation, getProviderReadiness, lookupOpenFoodFactsProduct, retailSearchSchema, searchRetailPrices } from "./atlas-services";
import { normalizeBriefPreferences, reconcileBriefSchedules } from "./atlas-briefs";
import * as db from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

export const connectionInput = z.object({ domain: z.enum(["health", "financial"]), provider: z.string().min(2).max(80), purpose: z.string().min(3).max(255), scopes: z.array(z.string().min(1).max(120)).min(1).max(12) });
export const appRouter = router({
  system: systemRouter,
  auth: router({ me: publicProcedure.query((opts) => opts.ctx.user), logout: publicProcedure.mutation(({ ctx }) => { ctx.res.clearCookie(COOKIE_NAME, { ...getSessionCookieOptions(ctx.req), maxAge: -1 }); return { success: true } as const; }) }),
  atlas: router({
    security: publicProcedure.query(() => getAtlasEncryptionReadiness()),
    lens: router({ lookup: publicProcedure.input(z.object({ barcode: z.string() })).query(({ input }) => lookupOpenFoodFactsProduct(input.barcode)) }),
    commerce: router({ search: publicProcedure.input(retailSearchSchema).query(({ input }) => searchRetailPrices(input)) }),
    ai: router({ recommend: publicProcedure.input(z.object({ prompt: z.string().min(2).max(2000), barcode: z.string().optional(), profileSummary: z.string().max(900).optional() })).mutation(async ({ input }) => { const lens = input.barcode ? await lookupOpenFoodFactsProduct(input.barcode) : null; return generateCitedRecommendation({ prompt: input.prompt, profileSummary: input.profileSummary, sources: lens?.sources ?? [] }); }) }),
    life: router({
      snapshot: protectedProcedure.query(async ({ ctx }) => { const snapshot = await db.getAtlasLifeSnapshot(ctx.user.id); return snapshot ? { payloadJson: snapshot.payloadJson, updatedAt: snapshot.updatedAt } : null; }),
      saveSnapshot: protectedProcedure.input(z.object({ payloadJson: z.string().min(2).max(150000) })).mutation(async ({ ctx, input }) => db.saveAtlasLifeSnapshot(ctx.user.id, input.payloadJson)),
    }),
    briefs: router({
      preferences: protectedProcedure.query(async ({ ctx }) => await db.getAtlasBriefPreferences(ctx.user.id)),
      updatePreferences: protectedProcedure.input(z.object({ dailyEnabled: z.boolean(), dailyHour: z.number().int().min(0).max(23), dailyMinute: z.number().int().min(0).max(59), weeklyEnabled: z.boolean(), weeklyWeekday: z.number().int().min(0).max(6), weeklyHour: z.number().int().min(0).max(23), weeklyMinute: z.number().int().min(0).max(59), notificationEnabled: z.boolean(), digestMode: z.boolean() })).mutation(async ({ ctx, input }) => db.saveAtlasBriefPreferences(ctx.user.id, normalizeBriefPreferences(input))),
      activateSchedules: protectedProcedure.input(z.object({ dailyEnabled: z.boolean(), dailyHour: z.number().int().min(0).max(23), dailyMinute: z.number().int().min(0).max(59), weeklyEnabled: z.boolean(), weeklyWeekday: z.number().int().min(0).max(6), weeklyHour: z.number().int().min(0).max(23), weeklyMinute: z.number().int().min(0).max(59), notificationEnabled: z.boolean(), digestMode: z.boolean() })).mutation(async ({ ctx, input }) => { const preferences = normalizeBriefPreferences(input); const existing = await db.getAtlasBriefPreferences(ctx.user.id); await db.saveAtlasBriefPreferences(ctx.user.id, preferences); return reconcileBriefSchedules(ctx.req, ctx.user.id, preferences, existing); }),
    }),
    connections: router({
      catalog: protectedProcedure.query(() => ({ providers: getProviderReadiness(), encryption: getAtlasEncryptionReadiness() })),
      status: protectedProcedure.query(async ({ ctx }) => ({ connections: await db.listAtlasConnections(ctx.user.id), encryption: getAtlasEncryptionReadiness() })),
      begin: protectedProcedure.input(connectionInput).mutation(async ({ ctx, input }) => { const readiness = getAtlasEncryptionReadiness(); if (!readiness.ready) return { status: "blocked" as const, reason: readiness.reason }; const provider = getProviderReadiness().find((item) => item.provider === input.provider && item.domain === input.domain); if (!provider?.configured) return { status: "needs_credentials" as const, reason: `${input.provider} development credentials are not configured` }; const encryptedMetadata = JSON.stringify(encryptAtlasPayload({ provider: input.provider, scopes: input.scopes, consentedAt: new Date().toISOString() })); await db.createAtlasConsent({ userId: ctx.user.id, domain: input.domain, purpose: input.purpose, scopesJson: JSON.stringify(input.scopes), consentVersion: "2026-08" }); await db.createAtlasConnection({ userId: ctx.user.id, domain: input.domain, provider: input.provider, status: "needs_credentials", encryptedMetadata }); return { status: "ready_for_oauth" as const }; }),
      saveRecord: protectedProcedure.input(z.object({ domain: z.enum(["health", "financial"]), recordType: z.string().min(2).max(80), payload: z.record(z.string(), z.unknown()) })).mutation(async ({ ctx, input }) => { const readiness = getAtlasEncryptionReadiness(); if (!readiness.ready) return { status: "blocked" as const, reason: readiness.reason }; await db.createAtlasSensitiveRecord({ userId: ctx.user.id, domain: input.domain, recordType: input.recordType, encryptedPayload: JSON.stringify(encryptAtlasPayload(input.payload)) }); return { status: "stored" as const }; }),
    }),
  }),
});
export type AppRouter = typeof appRouter;
