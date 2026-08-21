import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

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

export const atlasLifeSnapshots = mysqlTable("atlasLifeSnapshots", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  version: varchar("version", { length: 24 }).notNull().default("v1"),
  payloadJson: text("payloadJson").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const atlasBriefPreferences = mysqlTable("atlasBriefPreferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  dailyEnabled: boolean("dailyEnabled").default(false).notNull(),
  dailyHour: int("dailyHour").default(8).notNull(),
  dailyMinute: int("dailyMinute").default(0).notNull(),
  weeklyEnabled: boolean("weeklyEnabled").default(false).notNull(),
  weeklyWeekday: int("weeklyWeekday").default(1).notNull(),
  weeklyHour: int("weeklyHour").default(9).notNull(),
  weeklyMinute: int("weeklyMinute").default(0).notNull(),
  notificationEnabled: boolean("notificationEnabled").default(false).notNull(),
  digestMode: boolean("digestMode").default(true).notNull(),
  dailyTaskUid: varchar("dailyTaskUid", { length: 65 }),
  weeklyTaskUid: varchar("weeklyTaskUid", { length: 65 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const atlasBriefRecords = mysqlTable("atlasBriefRecords", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  cadence: mysqlEnum("cadence", ["daily", "weekly"]).notNull(),
  summary: text("summary").notNull(),
  source: varchar("source", { length: 64 }).notNull().default("atlas-life-os"),
  deliveredAt: timestamp("deliveredAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type AtlasConnection = typeof atlasConnections.$inferSelect;
export type InsertAtlasConnection = typeof atlasConnections.$inferInsert;
export type AtlasConsent = typeof atlasConsents.$inferSelect;
export type InsertAtlasConsent = typeof atlasConsents.$inferInsert;
export type AtlasSensitiveRecord = typeof atlasSensitiveRecords.$inferSelect;
export type InsertAtlasSensitiveRecord = typeof atlasSensitiveRecords.$inferInsert;
export type AtlasLifeSnapshot = typeof atlasLifeSnapshots.$inferSelect;
export type InsertAtlasLifeSnapshot = typeof atlasLifeSnapshots.$inferInsert;
export type AtlasBriefPreference = typeof atlasBriefPreferences.$inferSelect;
export type InsertAtlasBriefPreference = typeof atlasBriefPreferences.$inferInsert;
