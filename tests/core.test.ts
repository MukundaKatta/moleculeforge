import { describe, it, expect } from "vitest";
import { Moleculeforge } from "../src/core.js";
describe("Moleculeforge", () => {
  it("init", () => { expect(new Moleculeforge().getStats().ops).toBe(0); });
  it("op", async () => { const c = new Moleculeforge(); await c.search(); expect(c.getStats().ops).toBe(1); });
  it("reset", async () => { const c = new Moleculeforge(); await c.search(); c.reset(); expect(c.getStats().ops).toBe(0); });
});
