import { describe, it, expect } from "vitest";
import {
  type Harness,
  type AgentNode,
  type Skill,
  type OrchestratorEdge,
  type HarnessMetadata,
  createAgentNode,
  createSkill,
  createHarness,
} from "@/lib/types";

describe("types", () => {
  describe("createAgentNode", () => {
    it("should create an agent node with defaults", () => {
      const node = createAgentNode({ role: "executor", position: { x: 0, y: 0 } });
      expect(node.id).toBeDefined();
      expect(node.role).toBe("executor");
      expect(node.model).toBe("sonnet");
      expect(node.skills).toEqual([]);
      expect(node.tools).toEqual([]);
      expect(node.position).toEqual({ x: 0, y: 0 });
    });

    it("should allow overriding defaults", () => {
      const node = createAgentNode({
        role: "architect",
        model: "opus",
        tools: ["Read", "Grep"],
        position: { x: 100, y: 200 },
      });
      expect(node.model).toBe("opus");
      expect(node.tools).toEqual(["Read", "Grep"]);
    });
  });

  describe("createSkill", () => {
    it("should create a skill with required fields", () => {
      const skill = createSkill({ name: "code-review", description: "Reviews code", prompt: "Review this code" });
      expect(skill.id).toBeDefined();
      expect(skill.name).toBe("code-review");
      expect(skill.prompt).toBe("Review this code");
    });
  });

  describe("createHarness", () => {
    it("should create an empty harness", () => {
      const harness = createHarness({ name: "test-harness" });
      expect(harness.id).toBeDefined();
      expect(harness.name).toBe("test-harness");
      expect(harness.agents).toEqual([]);
      expect(harness.edges).toEqual([]);
      expect(harness.metadata.version).toBe("1.0.0");
    });
  });
});
