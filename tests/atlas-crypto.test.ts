import { describe, expect, it } from "vitest";
import { decryptAtlasPayload, encryptAtlasPayload, getAtlasEncryptionKey, getAtlasEncryptionReadiness } from "../server/atlas-crypto";

describe("Atlas sensitive-data encryption", () => {
  it("round-trips a protected payload using a valid 32-byte server key", () => {
    const key = Buffer.alloc(32, 7).toString("base64");
    expect(getAtlasEncryptionKey(key)).toHaveLength(32);
    const source = { category: "health_record", record: { allergy: "latex" }, consent: "explicit" };
    const encrypted = encryptAtlasPayload(source, key);
    expect(encrypted.ciphertext).not.toContain("latex");
    expect(decryptAtlasPayload<typeof source>(encrypted, key)).toEqual(source);
  });

  it("reports an invalid production key without allowing callers to encrypt", () => { expect(getAtlasEncryptionReadiness("invalid").ready).toBe(false); });
});
