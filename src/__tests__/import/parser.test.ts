import { describe, it, expect } from "vitest";
import { parseImport, type ImportResult } from "@/lib/import/parser";

const validYaml = `
harness:
  name: test-harness
  agents:
    - id: planner
      role: planner
      model: opus
    - id: executor
      role: executor
      model: sonnet
  pipeline:
    - step: 1
      agent: planner
      target: executor
      type: sequential
`;

const validJson = JSON.stringify({
  harness: {
    name: "json-harness",
    agents: [{ id: "a1", role: "reviewer", model: "opus" }],
    edges: [],
  },
});

describe("parseImport", () => {
  it("should parse valid YAML", () => {
    const result = parseImport(validYaml, "yaml");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.harness.name).toBe("test-harness");
      expect(result.harness.agents).toHaveLength(2);
      expect(result.harness.edges).toHaveLength(1);
    }
  });
  it("should parse valid JSON", () => {
    const result = parseImport(validJson, "json");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.harness.name).toBe("json-harness");
      expect(result.harness.agents).toHaveLength(1);
    }
  });
  it("should return error for invalid YAML", () => {
    const result = parseImport("invalid: [yaml: broken", "yaml");
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBeDefined();
  });
  it("should return error for invalid JSON", () => {
    const result = parseImport("{invalid json", "json");
    expect(result.success).toBe(false);
  });
  it("should return error for missing harness key", () => {
    const result = parseImport(JSON.stringify({ foo: "bar" }), "json");
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toContain("harness");
  });
  it("should auto-assign positions to imported agents", () => {
    const result = parseImport(validYaml, "yaml");
    expect(result.success).toBe(true);
    if (result.success) {
      for (const agent of result.harness.agents) {
        expect(agent.position).toBeDefined();
        expect(agent.position.x).toBeGreaterThanOrEqual(0);
      }
    }
  });
});
