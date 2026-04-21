import yaml from "js-yaml";
import { nanoid } from "nanoid";
import type {
  Harness,
  AgentNode,
  OrchestratorEdge,
  ModelType,
  EdgeType,
} from "@/lib/types";

export type ImportResult =
  | { readonly success: true; readonly harness: Harness }
  | { readonly success: false; readonly error: string };

interface RawAgent {
  readonly id?: string;
  readonly role: string;
  readonly model?: string;
  readonly skills?: readonly unknown[];
  readonly tools?: readonly string[];
}

interface RawPipelineStep {
  readonly step?: number;
  readonly agent: string;
  readonly target: string;
  readonly type?: string;
  readonly condition?: string;
}

interface RawEdge {
  readonly id?: string;
  readonly source: string;
  readonly target: string;
  readonly type?: string;
  readonly condition?: string;
}

interface RawHarness {
  readonly name: string;
  readonly description?: string;
  readonly agents?: readonly RawAgent[];
  readonly pipeline?: readonly RawPipelineStep[];
  readonly edges?: readonly RawEdge[];
}

function isValidModel(model: string): model is ModelType {
  return ["haiku", "sonnet", "opus"].includes(model);
}

function isValidEdgeType(type: string): type is EdgeType {
  return ["sequential", "parallel"].includes(type);
}

function transformAgents(rawAgents: readonly RawAgent[]): readonly AgentNode[] {
  return rawAgents.map((raw, index) => ({
    id: nanoid(),
    role: raw.role,
    model: raw.model && isValidModel(raw.model) ? raw.model : "sonnet",
    skills: [],
    tools: raw.tools ?? [],
    position: { x: index * 250, y: 100 },
  }));
}

function transformPipelineToEdges(
  pipeline: readonly RawPipelineStep[],
  agents: readonly AgentNode[],
  rawAgents: readonly RawAgent[],
): readonly OrchestratorEdge[] {
  return pipeline.map((step) => {
    const sourceIndex = rawAgents.findIndex(
      (a) => a.id === step.agent || a.role === step.agent,
    );
    const targetIndex = rawAgents.findIndex(
      (a) => a.id === step.target || a.role === step.target,
    );

    const sourceId = sourceIndex >= 0 ? agents[sourceIndex].id : step.agent;
    const targetId = targetIndex >= 0 ? agents[targetIndex].id : step.target;

    return {
      id: nanoid(),
      source: sourceId,
      target: targetId,
      type: step.type && isValidEdgeType(step.type) ? step.type : "sequential",
      ...(step.condition ? { condition: step.condition } : {}),
    };
  });
}

function transformEdges(
  rawEdges: readonly RawEdge[],
): readonly OrchestratorEdge[] {
  return rawEdges.map((raw) => ({
    id: nanoid(),
    source: raw.source,
    target: raw.target,
    type: raw.type && isValidEdgeType(raw.type) ? raw.type : "sequential",
    ...(raw.condition ? { condition: raw.condition } : {}),
  }));
}

function parseRawData(raw: unknown): ImportResult {
  if (raw === null || typeof raw !== "object") {
    return { success: false, error: "Invalid data: expected an object" };
  }

  const data = raw as Record<string, unknown>;

  if (!("harness" in data) || data.harness === undefined) {
    return {
      success: false,
      error: 'Missing required "harness" root key',
    };
  }

  const rawHarness = data.harness as RawHarness;

  if (!rawHarness.name || typeof rawHarness.name !== "string") {
    return { success: false, error: "harness.name is required" };
  }

  const rawAgents: readonly RawAgent[] = rawHarness.agents ?? [];
  const agents = transformAgents(rawAgents);

  const edges =
    rawHarness.pipeline && rawHarness.pipeline.length > 0
      ? transformPipelineToEdges(rawHarness.pipeline, agents, rawAgents)
      : rawHarness.edges
        ? transformEdges(rawHarness.edges)
        : [];

  const now = new Date().toISOString();

  const harness: Harness = {
    id: nanoid(),
    name: rawHarness.name,
    description: rawHarness.description ?? "",
    agents,
    edges,
    metadata: {
      version: "1.0.0",
      createdAt: now,
      updatedAt: now,
      tags: [],
    },
  };

  return { success: true, harness };
}

export function parseImport(
  content: string,
  format: "yaml" | "json",
): ImportResult {
  try {
    const raw = format === "yaml" ? yaml.load(content) : JSON.parse(content);
    return parseRawData(raw);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown parse error";
    return { success: false, error: `Failed to parse ${format}: ${message}` };
  }
}
