import { create } from "zustand";
import { nanoid } from "nanoid";
import type { AgentNode, EdgeType, Harness, OrchestratorEdge } from "./types";

interface HarnessState {
  harness: Harness | null;
  selectedNodeId: string | null;
  loadHarness: (harness: Harness) => void;
  reset: () => void;
  addAgent: (agent: AgentNode) => void;
  updateAgent: (id: string, updates: Partial<AgentNode>) => void;
  removeAgent: (id: string) => void;
  addEdge: (edge: {
    source: string;
    target: string;
    type: EdgeType;
    condition?: string;
  }) => void;
  removeEdge: (id: string) => void;
  selectNode: (id: string | null) => void;
  updateHarnessName: (name: string) => void;
  updateHarnessDescription: (description: string) => void;
}

const updatedMetadata = (harness: Harness) => ({
  ...harness.metadata,
  updatedAt: new Date().toISOString(),
});

export const useHarnessStore = create<HarnessState>((set) => ({
  harness: null,
  selectedNodeId: null,

  loadHarness: (harness) => set({ harness }),

  reset: () => set({ harness: null, selectedNodeId: null }),

  addAgent: (agent) =>
    set((state) => {
      if (!state.harness) return state;
      return {
        harness: {
          ...state.harness,
          agents: [...state.harness.agents, agent],
          metadata: updatedMetadata(state.harness),
        } as Harness,
      };
    }),

  updateAgent: (id, updates) =>
    set((state) => {
      if (!state.harness) return state;
      return {
        harness: {
          ...state.harness,
          agents: state.harness.agents.map((agent) =>
            agent.id === id ? ({ ...agent, ...updates } as AgentNode) : agent,
          ),
          metadata: updatedMetadata(state.harness),
        } as Harness,
      };
    }),

  removeAgent: (id) =>
    set((state) => {
      if (!state.harness) return state;
      return {
        harness: {
          ...state.harness,
          agents: state.harness.agents.filter((agent) => agent.id !== id),
          edges: state.harness.edges.filter(
            (edge) => edge.source !== id && edge.target !== id,
          ),
          metadata: updatedMetadata(state.harness),
        } as Harness,
      };
    }),

  addEdge: (edge) =>
    set((state) => {
      if (!state.harness) return state;
      const newEdge: OrchestratorEdge = {
        id: nanoid(),
        source: edge.source,
        target: edge.target,
        type: edge.type,
        condition: edge.condition,
      };
      return {
        harness: {
          ...state.harness,
          edges: [...state.harness.edges, newEdge],
          metadata: updatedMetadata(state.harness),
        } as Harness,
      };
    }),

  removeEdge: (id) =>
    set((state) => {
      if (!state.harness) return state;
      return {
        harness: {
          ...state.harness,
          edges: state.harness.edges.filter((edge) => edge.id !== id),
          metadata: updatedMetadata(state.harness),
        } as Harness,
      };
    }),

  selectNode: (id) => set({ selectedNodeId: id }),

  updateHarnessName: (name) =>
    set((state) => {
      if (!state.harness) return state;
      return {
        harness: {
          ...state.harness,
          name,
          metadata: updatedMetadata(state.harness),
        } as Harness,
      };
    }),

  updateHarnessDescription: (description) =>
    set((state) => {
      if (!state.harness) return state;
      return {
        harness: {
          ...state.harness,
          description,
          metadata: updatedMetadata(state.harness),
        } as Harness,
      };
    }),
}));
