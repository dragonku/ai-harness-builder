import type { Harness } from "./types";

export interface ValidationError {
  readonly type:
    | "isolated-node"
    | "circular-reference"
    | "missing-field"
    | "duplicate-id";
  readonly nodeId?: string;
  readonly field?: string;
  readonly message: string;
}

export function validateHarness(harness: Harness): readonly ValidationError[] {
  const errors: ValidationError[] = [];
  errors.push(...checkDuplicateIds(harness));
  errors.push(...checkMissingFields(harness));
  errors.push(...checkIsolatedNodes(harness));
  errors.push(...checkCircularReferences(harness));
  return errors;
}

function checkDuplicateIds(harness: Harness): readonly ValidationError[] {
  const seen = new Set<string>();
  const errors: ValidationError[] = [];
  for (const agent of harness.agents) {
    if (seen.has(agent.id)) {
      errors.push({
        type: "duplicate-id",
        nodeId: agent.id,
        message: `Duplicate agent ID: ${agent.id}`,
      });
    }
    seen.add(agent.id);
  }
  return errors;
}

function checkMissingFields(harness: Harness): readonly ValidationError[] {
  const errors: ValidationError[] = [];
  for (const agent of harness.agents) {
    if (!agent.role.trim()) {
      errors.push({
        type: "missing-field",
        nodeId: agent.id,
        field: "role",
        message: `Agent ${agent.id} is missing role`,
      });
    }
  }
  return errors;
}

function checkIsolatedNodes(harness: Harness): readonly ValidationError[] {
  if (harness.agents.length <= 1) {
    return [];
  }
  const connected = new Set<string>();
  for (const edge of harness.edges) {
    connected.add(edge.source);
    connected.add(edge.target);
  }
  const errors: ValidationError[] = [];
  for (const agent of harness.agents) {
    if (!connected.has(agent.id)) {
      errors.push({
        type: "isolated-node",
        nodeId: agent.id,
        message: `Agent ${agent.role} (${agent.id}) is not connected`,
      });
    }
  }
  return errors;
}

function checkCircularReferences(
  harness: Harness
): readonly ValidationError[] {
  const adjacency = new Map<string, readonly string[]>();
  for (const agent of harness.agents) {
    adjacency.set(agent.id, []);
  }
  for (const edge of harness.edges) {
    const existing = adjacency.get(edge.source) ?? [];
    adjacency.set(edge.source, [...existing, edge.target]);
  }

  const visited = new Set<string>();
  const inStack = new Set<string>();

  function hasCycle(nodeId: string): boolean {
    visited.add(nodeId);
    inStack.add(nodeId);
    for (const neighbor of adjacency.get(nodeId) ?? []) {
      if (!visited.has(neighbor)) {
        if (hasCycle(neighbor)) {
          return true;
        }
      } else if (inStack.has(neighbor)) {
        return true;
      }
    }
    inStack.delete(nodeId);
    return false;
  }

  for (const agentId of adjacency.keys()) {
    if (!visited.has(agentId)) {
      if (hasCycle(agentId)) {
        return [
          {
            type: "circular-reference",
            message: "Pipeline contains a circular reference",
          },
        ];
      }
    }
  }
  return [];
}
