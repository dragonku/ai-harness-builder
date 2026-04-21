import yaml from "js-yaml";
import type { Harness } from "@/lib/types";

interface YAMLAgent {
  readonly id: string;
  readonly role: string;
  readonly model: string;
  readonly tools: readonly string[];
  readonly skills: readonly { readonly name: string; readonly description: string }[];
}

interface YAMLPipelineStep {
  readonly source: string;
  readonly target: string;
  readonly type: string;
  readonly condition?: string;
}

interface YAMLHarness {
  readonly harness: {
    readonly name: string;
    readonly description: string;
    readonly agents: readonly YAMLAgent[];
    readonly pipeline: readonly YAMLPipelineStep[];
    readonly metadata: {
      readonly version: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      readonly tags: readonly string[];
    };
  };
}

export function exportYAML(harness: Harness): string {
  const agents: YAMLAgent[] = harness.agents.map((a) => ({
    id: a.id,
    role: a.role,
    model: a.model,
    tools: [...a.tools],
    skills: a.skills.map((s) => ({ name: s.name, description: s.description })),
  }));

  const pipeline: YAMLPipelineStep[] = harness.edges.map((e) => {
    const step: YAMLPipelineStep = {
      source: e.source,
      target: e.target,
      type: e.type,
      ...(e.condition !== undefined ? { condition: e.condition } : {}),
    };
    return step;
  });

  const doc: YAMLHarness = {
    harness: {
      name: harness.name,
      description: harness.description,
      agents,
      pipeline,
      metadata: {
        version: harness.metadata.version,
        createdAt: harness.metadata.createdAt,
        updatedAt: harness.metadata.updatedAt,
        tags: [...harness.metadata.tags],
      },
    },
  };

  return yaml.dump(doc, { lineWidth: 120, noRefs: true });
}
