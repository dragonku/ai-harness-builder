import { nanoid } from "nanoid";

export type ModelType = "haiku" | "sonnet" | "opus";
export type EdgeType = "sequential" | "parallel";

export interface Skill {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly prompt: string;
}

export interface AgentNode {
  readonly id: string;
  readonly role: string;
  readonly model: ModelType;
  readonly skills: readonly Skill[];
  readonly tools: readonly string[];
  readonly position: { readonly x: number; readonly y: number };
}

export interface OrchestratorEdge {
  readonly id: string;
  readonly source: string;
  readonly target: string;
  readonly type: EdgeType;
  readonly condition?: string;
}

export interface HarnessMetadata {
  readonly version: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly templateId?: string;
  readonly tags: readonly string[];
}

export interface Harness {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly agents: readonly AgentNode[];
  readonly edges: readonly OrchestratorEdge[];
  readonly metadata: HarnessMetadata;
}

export function createSkill(params: {
  readonly name: string;
  readonly description: string;
  readonly prompt: string;
}): Skill {
  return {
    id: nanoid(),
    name: params.name,
    description: params.description,
    prompt: params.prompt,
  };
}

export function createAgentNode(params: {
  readonly role: string;
  readonly position: { readonly x: number; readonly y: number };
  readonly model?: ModelType;
  readonly skills?: readonly Skill[];
  readonly tools?: readonly string[];
}): AgentNode {
  return {
    id: nanoid(),
    role: params.role,
    model: params.model ?? "sonnet",
    skills: params.skills ?? [],
    tools: params.tools ?? [],
    position: params.position,
  };
}

export function createHarness(params: {
  readonly name: string;
  readonly description?: string;
  readonly agents?: readonly AgentNode[];
  readonly edges?: readonly OrchestratorEdge[];
  readonly templateId?: string;
}): Harness {
  const now = new Date().toISOString();
  return {
    id: nanoid(),
    name: params.name,
    description: params.description ?? "",
    agents: params.agents ?? [],
    edges: params.edges ?? [],
    metadata: {
      version: "1.0.0",
      createdAt: now,
      updatedAt: now,
      templateId: params.templateId,
      tags: [],
    },
  };
}
