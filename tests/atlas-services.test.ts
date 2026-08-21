import { describe, expect, it } from "vitest";
import { normalizeBarcode, productSourceForBarcode } from "../server/atlas-services";

describe("Atlas Lens service contracts", () => {
  it("normalizes supported barcode values before provider lookup", () => { expect(normalizeBarcode("3017624010701")).toBe("3017624010701"); });
  it("rejects malformed barcode payloads", () => { expect(() => normalizeBarcode("wrong value!")).toThrow(); });
  it("produces a concrete, retrievable source citation for a scanned product", () => { expect(productSourceForBarcode("3017624010701").url).toContain("/product/3017624010701"); });
});
