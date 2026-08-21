import { z } from "zod";
import { invokeLLM, listLLMModels } from "./_core/llm";

export const barcodeSchema = z.string().trim().regex(/^[0-9A-Za-z._-]{6,64}$/i, "Enter a valid barcode");
export const evidenceSourceSchema = z.object({ id: z.string(), title: z.string(), url: z.string().url(), retrievedAt: z.string() });
export const aiRecommendationSchema = z.object({ recommendation: z.string().min(1).max(300), reasoningSummary: z.string().min(1).max(700), tradeOff: z.string().min(1).max(300), confidence: z.number().min(0).max(100), factors: z.array(z.object({ label: z.string().min(1).max(64), score: z.number().min(0).max(100) })).min(2).max(5), citedSourceIds: z.array(z.string()).max(6), safetyNote: z.string().max(240) });
export type AtlasEvidenceSource = z.infer<typeof evidenceSourceSchema>;

type OpenFoodFactsResponse = { status?: number; status_verbose?: string; code?: string; product?: Record<string, unknown> };
export function normalizeBarcode(value: string) { return barcodeSchema.parse(value).toUpperCase(); }
export function productSourceForBarcode(barcode: string): AtlasEvidenceSource { return { id: `open-food-facts-${barcode}`, title: "Open Food Facts product record", url: `https://world.openfoodfacts.net/api/v2/product/${barcode}`, retrievedAt: new Date().toISOString() }; }
export async function lookupOpenFoodFactsProduct(rawBarcode: string) {
  const barcode = normalizeBarcode(rawBarcode); const source = productSourceForBarcode(barcode);
  const response = await fetch(`${source.url}?fields=product_name,brands,nutrition_grades,ingredients_text,allergens_tags,packaging_text,ecoscore_grade`, { headers: { "User-Agent": "AtlasSanctumConsumer/1.0 contact@atlas.example" } });
  if (!response.ok) throw new Error(`Product provider returned ${response.status}`);
  const data = (await response.json()) as OpenFoodFactsResponse; const product = data.product ?? {};
  return { barcode, found: data.status === 1, status: data.status_verbose ?? (data.status === 1 ? "product found" : "product not found"), product: { name: typeof product.product_name === "string" ? product.product_name : "Unidentified product", brand: typeof product.brands === "string" ? product.brands : "Unknown brand", nutritionGrade: typeof product.nutrition_grades === "string" ? product.nutrition_grades.toUpperCase() : null, ecoScore: typeof product.ecoscore_grade === "string" ? product.ecoscore_grade.toUpperCase() : null, ingredients: typeof product.ingredients_text === "string" ? product.ingredients_text : null, allergens: Array.isArray(product.allergens_tags) ? product.allergens_tags.filter((tag): tag is string => typeof tag === "string") : [], packaging: typeof product.packaging_text === "string" ? product.packaging_text : null }, sources: [source] };
}
export const providerCatalog = [
  { domain: "health", provider: "SMART on FHIR", credentialKey: "ATLAS_FHIR_BASE_URL", scopes: ["patient/*.read"], description: "Clinical record exchange via a configured FHIR endpoint." },
  { domain: "financial", provider: "Plaid", credentialKey: "ATLAS_PLAID_CLIENT_ID", scopes: ["transactions", "accounts"], description: "Financial account connection through a configured aggregation provider." },
] as const;
export function getProviderReadiness() { return providerCatalog.map((provider) => ({ ...provider, configured: Boolean(process.env[provider.credentialKey]) })); }
export async function generateCitedRecommendation(input: { prompt: string; sources: AtlasEvidenceSource[]; profileSummary?: string }) {
  const catalog = await listLLMModels(); const model = catalog.data.find((item) => item.id === "gpt-5-mini")?.id ?? catalog.data.find((item) => item.id.startsWith("claude-haiku"))?.id;
  const sources = input.sources.length ? input.sources : [{ id: "atlas-local-context", title: "Atlas local context", url: "https://atlas-sanctum.local/context", retrievedAt: new Date().toISOString() }];
  const response = await invokeLLM({ model, messages: [{ role: "system", content: "You are Atlas, a personal decision assistant. Return JSON only. Give concise, user-relevant reasoning; never reveal private chain-of-thought. Do not diagnose, prescribe, execute purchases, or make definitive financial claims. Cite only source IDs supplied in the evidence list. If evidence is limited, state that in safetyNote." }, { role: "user", content: JSON.stringify({ request: input.prompt, profileSummary: input.profileSummary ?? "No connected sensitive data is available.", evidence: sources.map(({ id, title, url }) => ({ id, title, url })) }) }], response_format: { type: "json_object" }, max_tokens: 900 });
  const raw = response.choices[0]?.message?.content; const parsed = aiRecommendationSchema.parse(JSON.parse(typeof raw === "string" ? raw : "{}"));
  const citedSources = sources.filter((source) => parsed.citedSourceIds.includes(source.id));
  return { ...parsed, sources: citedSources.length ? citedSources : sources.slice(0, 1) };
}
