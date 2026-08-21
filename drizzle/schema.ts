import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const atlasConsents = mysqlTable("atlasConsents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  domain: mysqlEnum("domain", ["health", "financial"]).notNull(),
  purpose: varchar("purpose", { length: 255 }).notNull(),
  scopesJson: text("scopesJson").notNull(),
  consentVersion: varchar("consentVersion", { length: 32 }).notNull(),
  revokedAt: timestamp("revokedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const atlasConnections = mysqlTable("atlasConnections", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  domain: mysqlEnum("domain", ["health", "financial"]).notNull(),
  provider: varchar("provider", { length: 80 }).notNull(),
  status: mysqlEnum("status", ["needs_credentials", "connected", "revoked", "blocked"]).default("needs_credentials").notNull(),
  encryptedMetadata: text("encryptedMetadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  revokedAt: timestamp("revokedAt"),
});

export const atlasSensitiveRecords = mysqlTable("atlasSensitiveRecords", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  domain: mysqlEnum("domain", ["health", "financial"]).notNull(),
  recordType: varchar("recordType", { length: 80 }).notNull(),
  encryptedPayload: text("encryptedPayload").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type AtlasConnection = typeof atlasConnections.$inferSelect;
export type InsertAtlasConnection = typeof atlasConnections.$inferInsert;
export type AtlasConsent = typeof atlasConsents.$inferSelect;
export type InsertAtlasConsent = typeof atlasConsents.$inferInsert;
export type AtlasSensitiveRecord = typeof atlasSensitiveRecords.$inferSelect;
export type InsertAtlasSensitiveRecord = typeof atlasSensitiveRecords.$inferInsert;
