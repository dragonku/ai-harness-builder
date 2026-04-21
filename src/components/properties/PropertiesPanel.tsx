"use client";

import { useCallback, useMemo } from "react";
import { useHarnessStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SkillEditor } from "./SkillEditor";
import type { ModelType, Skill } from "@/lib/types";

const availableTools = [
  "Read",
  "Write",
  "Edit",
  "Bash",
  "Glob",
  "Grep",
  "TodoRead",
  "TodoWrite",
  "WebFetch",
  "WebSearch",
];

export function PropertiesPanel() {
  const harness = useHarnessStore((s) => s.harness);
  const selectedNodeId = useHarnessStore((s) => s.selectedNodeId);
  const updateAgent = useHarnessStore((s) => s.updateAgent);
  const removeAgent = useHarnessStore((s) => s.removeAgent);

  const selectedAgent = useMemo(
    () => harness?.agents.find((a) => a.id === selectedNodeId) ?? null,
    [harness?.agents, selectedNodeId],
  );

  const handleRoleChange = useCallback(
    (value: string) => {
      if (selectedNodeId) {
        updateAgent(selectedNodeId, { role: value });
      }
    },
    [selectedNodeId, updateAgent],
  );

  const handleModelChange = useCallback(
    (value: ModelType) => {
      if (selectedNodeId) {
        updateAgent(selectedNodeId, { model: value });
      }
    },
    [selectedNodeId, updateAgent],
  );

  const handleToolToggle = useCallback(
    (tool: string) => {
      if (!selectedAgent || !selectedNodeId) return;
      const currentTools = selectedAgent.tools;
      const newTools = currentTools.includes(tool)
        ? currentTools.filter((t) => t !== tool)
        : [...currentTools, tool];
      updateAgent(selectedNodeId, { tools: newTools });
    },
    [selectedAgent, selectedNodeId, updateAgent],
  );

  const handleSkillsChange = useCallback(
    (skills: readonly Skill[]) => {
      if (selectedNodeId) {
        updateAgent(selectedNodeId, { skills });
      }
    },
    [selectedNodeId, updateAgent],
  );

  const handleDelete = useCallback(() => {
    if (selectedNodeId) {
      removeAgent(selectedNodeId);
    }
  }, [selectedNodeId, removeAgent]);

  if (!harness) {
    return (
      <aside className="flex w-72 items-center justify-center border-l border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <p className="text-sm text-zinc-400">하네스를 먼저 불러오세요</p>
      </aside>
    );
  }

  if (!selectedAgent) {
    return (
      <aside className="flex w-72 items-center justify-center border-l border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <p className="px-4 text-center text-sm text-zinc-400">
          노드를 선택하면 속성을 편집할 수 있습니다
        </p>
      </aside>
    );
  }

  return (
    <aside className="flex w-72 flex-col border-l border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          에이전트 속성
        </h3>
      </div>

      <ScrollArea className="flex-1 px-4 py-3">
        <div className="flex flex-col gap-4">
          {/* Role */}
          <div className="space-y-1.5">
            <Label className="text-xs">역할 (Role)</Label>
            <Input
              value={selectedAgent.role}
              onChange={(e) => handleRoleChange(e.target.value)}
              placeholder="에이전트 역할"
              className="h-8 text-sm"
            />
          </div>

          {/* Model */}
          <div className="space-y-1.5">
            <Label className="text-xs">모델</Label>
            <Select
              value={selectedAgent.model}
              onValueChange={(v) => handleModelChange(v as ModelType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="haiku">Haiku</SelectItem>
                <SelectItem value="sonnet">Sonnet</SelectItem>
                <SelectItem value="opus">Opus</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Tools */}
          <div className="space-y-1.5">
            <Label className="text-xs">도구</Label>
            <div className="flex flex-wrap gap-1.5">
              {availableTools.map((tool) => {
                const isActive = selectedAgent.tools.includes(tool);
                return (
                  <Button
                    key={tool}
                    size="sm"
                    variant={isActive ? "default" : "outline"}
                    className="h-6 px-2 text-xs"
                    onClick={() => handleToolToggle(tool)}
                  >
                    {tool}
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Skills */}
          <SkillEditor
            skills={[...selectedAgent.skills]}
            onChange={handleSkillsChange}
          />

          <Separator />

          {/* Delete */}
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={handleDelete}
          >
            에이전트 삭제
          </Button>
        </div>
      </ScrollArea>
    </aside>
  );
}
