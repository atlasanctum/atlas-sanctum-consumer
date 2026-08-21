import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
export type EncryptedPayload = { version: 1; ciphertext: string; iv: string; authTag: string };
export type EncryptionReadiness = { ready: true } | { ready: false; reason: string };

export function getAtlasEncryptionKey(rawKey = process.env.ATLAS_DATA_ENCRYPTION_KEY): Buffer {
  if (!rawKey) throw new Error("ATLAS_DATA_ENCRYPTION_KEY is not configured");
  const key = Buffer.from(rawKey, "base64");
  if (key.length !== 32) throw new Error("ATLAS_DATA_ENCRYPTION_KEY must decode to exactly 32 bytes");
  return key;
}
export function getAtlasEncryptionReadiness(rawKey = process.env.ATLAS_DATA_ENCRYPTION_KEY): EncryptionReadiness {
  try { getAtlasEncryptionKey(rawKey); return { ready: true }; } catch (error) { return { ready: false, reason: error instanceof Error ? error.message : "Encryption key is unavailable" }; }
}
export function encryptAtlasPayload(value: unknown, rawKey?: string): EncryptedPayload {
  const key = getAtlasEncryptionKey(rawKey); const iv = randomBytes(IV_LENGTH); const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  return { version: 1, ciphertext: ciphertext.toString("base64"), iv: iv.toString("base64"), authTag: cipher.getAuthTag().toString("base64") };
}
export function decryptAtlasPayload<T>(payload: EncryptedPayload, rawKey?: string): T {
  if (payload.version !== 1) throw new Error("Unsupported Atlas encrypted payload version");
  const decipher = createDecipheriv(ALGORITHM, getAtlasEncryptionKey(rawKey), Buffer.from(payload.iv, "base64"), { authTagLength: AUTH_TAG_LENGTH });
  decipher.setAuthTag(Buffer.from(payload.authTag, "base64"));
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(payload.ciphertext, "base64")), decipher.final()]).toString("utf8")) as T;
}
