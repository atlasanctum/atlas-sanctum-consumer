import { z } from "zod";
import { COOKIE_NAME } from "../shared/const";
import { encryptAtlasPayload, getAtlasEncryptionReadiness } from "./atlas-crypto";
import { generateCitedRecommendation, getProviderReadiness, lookupOpenFoodFactsProduct } from "./atlas-services";
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
    ai: router({ recommend: publicProcedure.input(z.object({ prompt: z.string().min(2).max(2000), barcode: z.string().optional(), profileSummary: z.string().max(900).optional() })).mutation(async ({ input }) => { const lens = input.barcode ? await lookupOpenFoodFactsProduct(input.barcode) : null; return generateCitedRecommendation({ prompt: input.prompt, profileSummary: input.profileSummary, sources: lens?.sources ?? [] }); }) }),
    connections: router({
      catalog: protectedProcedure.query(() => ({ providers: getProviderReadiness(), encryption: getAtlasEncryptionReadiness() })),
      status: protectedProcedure.query(async ({ ctx }) => ({ connections: await db.listAtlasConnections(ctx.user.id), encryption: getAtlasEncryptionReadiness() })),
      begin: protectedProcedure.input(connectionInput).mutation(async ({ ctx, input }) => { const readiness = getAtlasEncryptionReadiness(); if (!readiness.ready) return { status: "blocked" as const, reason: readiness.reason }; const provider = getProviderReadiness().find((item) => item.provider === input.provider && item.domain === input.domain); if (!provider?.configured) return { status: "needs_credentials" as const, reason: `${input.provider} development credentials are not configured` }; const encryptedMetadata = JSON.stringify(encryptAtlasPayload({ provider: input.provider, scopes: input.scopes, consentedAt: new Date().toISOString() })); await db.createAtlasConsent({ userId: ctx.user.id, domain: input.domain, purpose: input.purpose, scopesJson: JSON.stringify(input.scopes), consentVersion: "2026-08" }); await db.createAtlasConnection({ userId: ctx.user.id, domain: input.domain, provider: input.provider, status: "needs_credentials", encryptedMetadata }); return { status: "ready_for_oauth" as const }; }),
      saveRecord: protectedProcedure.input(z.object({ domain: z.enum(["health", "financial"]), recordType: z.string().min(2).max(80), payload: z.record(z.string(), z.unknown()) })).mutation(async ({ ctx, input }) => { const readiness = getAtlasEncryptionReadiness(); if (!readiness.ready) return { status: "blocked" as const, reason: readiness.reason }; await db.createAtlasSensitiveRecord({ userId: ctx.user.id, domain: input.domain, recordType: input.recordType, encryptedPayload: JSON.stringify(encryptAtlasPayload(input.payload)) }); return { status: "stored" as const }; }),
    }),
  }),
});
export type AppRouter = typeof appRouter;
