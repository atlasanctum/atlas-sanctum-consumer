import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { atlasConnections, atlasConsents, atlasSensitiveRecords, type InsertAtlasConnection, type InsertAtlasConsent, type InsertAtlasSensitiveRecord, type InsertUser, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;
export async function getDb() { if (!_db && process.env.DATABASE_URL) { try { _db = drizzle(process.env.DATABASE_URL); } catch { _db = null; } } return _db; }
export async function upsertUser(user: InsertUser): Promise<void> { if (!user.openId) throw new Error("User openId is required for upsert"); const db = await getDb(); if (!db) return; const values: InsertUser = { ...user, role: user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user"), lastSignedIn: user.lastSignedIn ?? new Date() }; await db.insert(users).values(values).onDuplicateKeyUpdate({ set: { name: values.name ?? null, email: values.email ?? null, loginMethod: values.loginMethod ?? null, lastSignedIn: new Date() } }); }
export async function getUserByOpenId(openId: string) { const db = await getDb(); if (!db) return undefined; return (await db.select().from(users).where(eq(users.openId, openId)).limit(1))[0]; }
export async function listAtlasConnections(userId: number) { const db = await getDb(); if (!db) return []; return db.select().from(atlasConnections).where(eq(atlasConnections.userId, userId)).orderBy(desc(atlasConnections.updatedAt)); }
export async function createAtlasConsent(input: InsertAtlasConsent) { const db = await getDb(); if (!db) return false; await db.insert(atlasConsents).values(input); return true; }
export async function createAtlasConnection(input: InsertAtlasConnection) { const db = await getDb(); if (!db) return false; await db.insert(atlasConnections).values(input); return true; }
export async function createAtlasSensitiveRecord(input: InsertAtlasSensitiveRecord) { const db = await getDb(); if (!db) return false; await db.insert(atlasSensitiveRecords).values(input); return true; }
