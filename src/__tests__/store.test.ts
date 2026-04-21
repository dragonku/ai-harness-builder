import { describe, it, expect, beforeEach } from "vitest";
import { useHarnessStore } from "@/lib/store";
import { createAgentNode, createHarness } from "@/lib/types";

describe("useHarnessStore", () => {
  beforeEach(() => {
    useHarnessStore.getState().reset();
  });

  it("should initialize with empty harness", () => {
    const state = useHarnessStore.getState();
    expect(state.harness).toBeNull();
    expect(state.selectedNodeId).toBeNull();
  });
  it("should load a harness", () => {
    const harness = createHarness({ name: "test" });
    useHarnessStore.getState().loadHarness(harness);
    expect(useHarnessStore.getState().harness?.name).toBe("test");
  });
  it("should add an agent node", () => {
    useHarnessStore.getState().loadHarness(createHarness({ name: "test" }));
    const node = createAgentNode({
      role: "planner",
      position: { x: 0, y: 0 },
    });
    useHarnessStore.getState().addAgent(node);
    expect(useHarnessStore.getState().harness?.agents).toHaveLength(1);
    expect(useHarnessStore.getState().harness?.agents[0].role).toBe("planner");
  });
  it("should update an agent node immutably", () => {
    useHarnessStore.getState().loadHarness(createHarness({ name: "test" }));
    const node = createAgentNode({
      role: "planner",
      position: { x: 0, y: 0 },
    });
    useHarnessStore.getState().addAgent(node);
    const original = useHarnessStore.getState().harness;
    useHarnessStore.getState().updateAgent(node.id, { model: "opus" });
    const updated = useHarnessStore.getState();
    expect(updated.harness?.agents[0].model).toBe("opus");
    expect(updated.harness).not.toBe(original);
  });
  it("should remove an agent and its connected edges", () => {
    useHarnessStore.getState().loadHarness(createHarness({ name: "test" }));
    const a1 = createAgentNode({
      role: "planner",
      position: { x: 0, y: 0 },
    });
    const a2 = createAgentNode({
      role: "executor",
      position: { x: 200, y: 0 },
    });
    useHarnessStore.getState().addAgent(a1);
    useHarnessStore.getState().addAgent(a2);
    useHarnessStore.getState().addEdge({
      source: a1.id,
      target: a2.id,
      type: "sequential",
    });
    useHarnessStore.getState().removeAgent(a1.id);
    expect(useHarnessStore.getState().harness?.agents).toHaveLength(1);
    expect(useHarnessStore.getState().harness?.edges).toHaveLength(0);
  });
  it("should add an edge", () => {
    useHarnessStore.getState().loadHarness(createHarness({ name: "test" }));
    const a1 = createAgentNode({
      role: "planner",
      position: { x: 0, y: 0 },
    });
    const a2 = createAgentNode({
      role: "executor",
      position: { x: 200, y: 0 },
    });
    useHarnessStore.getState().addAgent(a1);
    useHarnessStore.getState().addAgent(a2);
    useHarnessStore.getState().addEdge({
      source: a1.id,
      target: a2.id,
      type: "sequential",
    });
    expect(useHarnessStore.getState().harness?.edges).toHaveLength(1);
    expect(useHarnessStore.getState().harness?.edges[0].source).toBe(a1.id);
  });
  it("should select and deselect nodes", () => {
    useHarnessStore.getState().selectNode("node-1");
    expect(useHarnessStore.getState().selectedNodeId).toBe("node-1");
    useHarnessStore.getState().selectNode(null);
    expect(useHarnessStore.getState().selectedNodeId).toBeNull();
  });
});
