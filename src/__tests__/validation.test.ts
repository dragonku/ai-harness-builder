import { describe, it, expect } from "vitest";
import { validateHarness, type ValidationError } from "@/lib/validation";
import {
  type Harness,
  type AgentNode,
  type OrchestratorEdge,
} from "@/lib/types";

function makeAgent(
  overrides: Partial<AgentNode> & { id: string; role: string }
): AgentNode {
  return {
    model: "sonnet",
    skills: [],
    tools: [],
    position: { x: 0, y: 0 },
    ...overrides,
  };
}

function makeEdge(
  overrides: Partial<OrchestratorEdge> & {
    id: string;
    source: string;
    target: string;
  }
): OrchestratorEdge {
  return { type: "sequential", ...overrides };
}

function makeHarness(
  agents: AgentNode[],
  edges: OrchestratorEdge[]
): Harness {
  return {
    id: "h1",
    name: "test",
    description: "",
    agents,
    edges,
    metadata: {
      version: "1.0.0",
      createdAt: "",
      updatedAt: "",
      tags: [],
    },
  };
}

describe("validateHarness", () => {
  it("should pass for a valid sequential pipeline", () => {
    const agents = [
      makeAgent({ id: "a1", role: "planner" }),
      makeAgent({ id: "a2", role: "executor" }),
    ];
    const edges = [makeEdge({ id: "e1", source: "a1", target: "a2" })];
    const errors = validateHarness(makeHarness(agents, edges));
    expect(errors).toEqual([]);
  });

  it("should detect isolated nodes", () => {
    const agents = [
      makeAgent({ id: "a1", role: "planner" }),
      makeAgent({ id: "a2", role: "executor" }),
      makeAgent({ id: "a3", role: "reviewer" }),
    ];
    const edges = [makeEdge({ id: "e1", source: "a1", target: "a2" })];
    const errors = validateHarness(makeHarness(agents, edges));
    expect(errors).toContainEqual(
      expect.objectContaining({ type: "isolated-node", nodeId: "a3" })
    );
  });

  it("should detect circular references", () => {
    const agents = [
      makeAgent({ id: "a1", role: "planner" }),
      makeAgent({ id: "a2", role: "executor" }),
    ];
    const edges = [
      makeEdge({ id: "e1", source: "a1", target: "a2" }),
      makeEdge({ id: "e2", source: "a2", target: "a1" }),
    ];
    const errors = validateHarness(makeHarness(agents, edges));
    expect(errors).toContainEqual(
      expect.objectContaining({ type: "circular-reference" })
    );
  });

  it("should detect missing required fields", () => {
    const agents = [makeAgent({ id: "a1", role: "" })];
    const errors = validateHarness(makeHarness(agents, []));
    expect(errors).toContainEqual(
      expect.objectContaining({
        type: "missing-field",
        nodeId: "a1",
        field: "role",
      })
    );
  });

  it("should detect duplicate agent IDs", () => {
    const agents = [
      makeAgent({ id: "a1", role: "planner" }),
      makeAgent({ id: "a1", role: "executor" }),
    ];
    const errors = validateHarness(makeHarness(agents, []));
    expect(errors).toContainEqual(
      expect.objectContaining({ type: "duplicate-id", nodeId: "a1" })
    );
  });

  it("should allow a single node with no edges", () => {
    const agents = [makeAgent({ id: "a1", role: "solo" })];
    const errors = validateHarness(makeHarness(agents, []));
    expect(errors).toEqual([]);
  });
});
