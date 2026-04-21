import { describe, it, expect } from "vitest";
import { exportJSON } from "@/lib/export/json-export";
import type { Harness } from "@/lib/types";

const testHarness: Harness = {
  id: "h1", name: "test", description: "",
  agents: [{ id: "a1", role: "planner", model: "opus", skills: [], tools: [], position: { x: 0, y: 0 } }],
  edges: [],
  metadata: { version: "1.0.0", createdAt: "", updatedAt: "", tags: [] },
};

describe("exportJSON", () => {
  it("should produce valid JSON", () => {
    const result = exportJSON(testHarness);
    const parsed = JSON.parse(result);
    expect(parsed).toHaveProperty("harness");
  });
  it("should exclude position data from export", () => {
    const result = exportJSON(testHarness);
    const parsed = JSON.parse(result);
    expect(parsed.harness.agents[0]).not.toHaveProperty("position");
  });
  it("should include metadata", () => {
    const result = exportJSON(testHarness);
    const parsed = JSON.parse(result);
    expect(parsed.harness.metadata).toHaveProperty("version", "1.0.0");
  });
});
