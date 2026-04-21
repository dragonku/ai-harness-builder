import { describe, it, expect } from "vitest";
import { exportYAML } from "@/lib/export/yaml-export";
import yaml from "js-yaml";
import type { Harness } from "@/lib/types";

const testHarness: Harness = {
  id: "h1", name: "full-stack-app", description: "Full-stack app harness",
  agents: [
    { id: "a1", role: "ui-architect", model: "opus", skills: [], tools: ["Read"], position: { x: 0, y: 0 } },
    { id: "a2", role: "frontend-builder", model: "sonnet", skills: [], tools: [], position: { x: 200, y: 0 } },
  ],
  edges: [{ id: "e1", source: "a1", target: "a2", type: "sequential" }],
  metadata: { version: "1.0.0", createdAt: "2026-04-21", updatedAt: "2026-04-21", tags: [] },
};

describe("exportYAML", () => {
  it("should produce valid YAML", () => {
    const result = exportYAML(testHarness);
    const parsed = yaml.load(result) as Record<string, unknown>;
    expect(parsed).toHaveProperty("harness");
  });
  it("should include agents with roles and models", () => {
    const result = exportYAML(testHarness);
    const parsed = yaml.load(result) as any;
    expect(parsed.harness.agents).toHaveLength(2);
    expect(parsed.harness.agents[0].role).toBe("ui-architect");
    expect(parsed.harness.agents[0].model).toBe("opus");
  });
  it("should include pipeline steps", () => {
    const result = exportYAML(testHarness);
    const parsed = yaml.load(result) as any;
    expect(parsed.harness.pipeline).toHaveLength(1);
    expect(parsed.harness.pipeline[0].type).toBe("sequential");
  });
});
