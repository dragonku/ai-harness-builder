import type { AgentNode, Harness, Skill } from "@/lib/types";

export interface ExportFile {
  readonly path: string;
  readonly content: string;
}

function generateAgentMarkdown(agent: AgentNode): string {
  const toolsList = agent.tools.length > 0 ? agent.tools.join(", ") : "none";
  return [
    "---",
    `name: ${agent.role}`,
    `description: ${agent.role} agent`,
    `model: ${agent.model}`,
    `tools: ${toolsList}`,
    "---",
    "",
    `# ${agent.role}`,
    "",
    `Model: ${agent.model}`,
    `Tools: ${toolsList}`,
    "",
  ].join("\n");
}

function generateSkillMarkdown(skill: Skill): string {
  return [
    "---",
    `name: ${skill.name}`,
    `description: ${skill.description}`,
    "---",
    "",
    `# ${skill.name}`,
    "",
    skill.prompt,
    "",
  ].join("\n");
}

function generateReadme(harness: Harness): string {
  const agentRows = harness.agents
    .map((a) => `| ${a.role} | ${a.model} | ${a.tools.join(", ") || "none"} |`)
    .join("\n");

  const pipelineSteps = harness.edges
    .map((e) => {
      const source = harness.agents.find((a) => a.id === e.source);
      const target = harness.agents.find((a) => a.id === e.target);
      return `- ${source?.role ?? e.source} -> ${target?.role ?? e.target} (${e.type})`;
    })
    .join("\n");

  return [
    `# ${harness.name}`,
    "",
    harness.description,
    "",
    "## Agents",
    "",
    "| Role | Model | Tools |",
    "|------|-------|-------|",
    agentRows,
    "",
    "## Pipeline",
    "",
    pipelineSteps,
    "",
  ].join("\n");
}

export function exportClaudeCode(harness: Harness): readonly ExportFile[] {
  const files: ExportFile[] = [];

  // Agent markdown files
  for (const agent of harness.agents) {
    files.push({
      path: `.claude/agents/${agent.role}.md`,
      content: generateAgentMarkdown(agent),
    });
  }

  // Skill markdown files (deduplicated)
  const seenSkills = new Set<string>();
  for (const agent of harness.agents) {
    for (const skill of agent.skills) {
      if (!seenSkills.has(skill.name)) {
        seenSkills.add(skill.name);
        files.push({
          path: `.claude/skills/${skill.name}.md`,
          content: generateSkillMarkdown(skill),
        });
      }
    }
  }

  // README
  files.push({
    path: "README.md",
    content: generateReadme(harness),
  });

  return files;
}
