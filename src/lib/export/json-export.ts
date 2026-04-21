import type { Harness } from "@/lib/types";

interface JSONAgent {
  readonly id: string;
  readonly role: string;
  readonly model: string;
  readonly tools: readonly string[];
  readonly skills: readonly { readonly name: string; readonly description: string; readonly prompt: string }[];
}

interface JSONHarness {
  readonly harness: {
    readonly name: string;
    readonly description: string;
    readonly agents: readonly JSONAgent[];
    readonly edges: readonly {
      readonly id: string;
      readonly source: string;
      readonly target: string;
      readonly type: string;
      readonly condition?: string;
    }[];
    readonly metadata: {
      readonly version: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      readonly tags: readonly string[];
    };
  };
}

export function exportJSON(harness: Harness): string {
  const agents: JSONAgent[] = harness.agents.map((a) => ({
    id: a.id,
    role: a.role,
    model: a.model,
    tools: [...a.tools],
    skills: a.skills.map((s) => ({
      name: s.name,
      description: s.description,
      prompt: s.prompt,
    })),
  }));

  const edges = harness.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: e.type,
    ...(e.condition !== undefined ? { condition: e.condition } : {}),
  }));

  const doc: JSONHarness = {
    harness: {
      name: harness.name,
      description: harness.description,
      agents,
      edges,
      metadata: {
        version: harness.metadata.version,
        createdAt: harness.metadata.createdAt,
        updatedAt: harness.metadata.updatedAt,
        tags: [...harness.metadata.tags],
      },
    },
  };

  return JSON.stringify(doc, null, 2);
}
