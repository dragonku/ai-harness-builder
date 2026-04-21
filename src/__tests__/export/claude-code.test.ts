import { describe, it, expect } from "vitest";
import { exportClaudeCode, type ExportFile } from "@/lib/export/claude-code";
import type { Harness } from "@/lib/types";

const testHarness: Harness = {
  id: "h1", name: "test-harness", description: "A test harness",
  agents: [
    { id: "a1", role: "planner", model: "opus",
      skills: [{ id: "s1", name: "planning", description: "Creates implementation plans", prompt: "Create a detailed plan for the given task." }],
      tools: ["Read", "Grep", "Glob"], position: { x: 0, y: 0 } },
    { id: "a2", role: "executor", model: "sonnet", skills: [], tools: ["Read", "Write", "Edit", "Bash"], position: { x: 200, y: 0 } },
  ],
  edges: [{ id: "e1", source: "a1", target: "a2", type: "sequential" }],
  metadata: { version: "1.0.0", createdAt: "", updatedAt: "", tags: ["test"] },
};

describe("exportClaudeCode", () => {
  it("should generate agent markdown files", () => {
    const files = exportClaudeCode(testHarness);
    const agentFiles = files.filter((f) => f.path.startsWith(".claude/agents/"));
    expect(agentFiles).toHaveLength(2);
    expect(agentFiles[0].path).toBe(".claude/agents/planner.md");
    expect(agentFiles[0].content).toContain("name: planner");
    expect(agentFiles[0].content).toContain("model: opus");
    expect(agentFiles[0].content).toContain("Read, Grep, Glob");
  });
  it("should generate skill markdown files", () => {
    const files = exportClaudeCode(testHarness);
    const skillFiles = files.filter((f) => f.path.startsWith(".claude/skills/"));
    expect(skillFiles).toHaveLength(1);
    expect(skillFiles[0].path).toBe(".claude/skills/planning.md");
    expect(skillFiles[0].content).toContain("name: planning");
    expect(skillFiles[0].content).toContain("Create a detailed plan");
  });
  it("should generate a README with pipeline description", () => {
    const files = exportClaudeCode(testHarness);
    const readme = files.find((f) => f.path === "README.md");
    expect(readme).toBeDefined();
    expect(readme!.content).toContain("test-harness");
    expect(readme!.content).toContain("planner");
    expect(readme!.content).toContain("executor");
  });
  it("should handle agents with no skills", () => {
    const files = exportClaudeCode(testHarness);
    const executorFile = files.find((f) => f.path === ".claude/agents/executor.md");
    expect(executorFile).toBeDefined();
    expect(executorFile!.content).toContain("name: executor");
  });
});
