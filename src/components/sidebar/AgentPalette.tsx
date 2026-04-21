"use client";

import type { DragEvent } from "react";
import type { ModelType } from "@/lib/types";

interface PaletteAgent {
  readonly role: string;
  readonly model: ModelType;
  readonly label: string;
}

const paletteAgents: readonly PaletteAgent[] = [
  { role: "planner", model: "opus", label: "Planner" },
  { role: "architect", model: "opus", label: "Architect" },
  { role: "executor", model: "sonnet", label: "Executor" },
  { role: "reviewer", model: "sonnet", label: "Reviewer" },
  { role: "tester", model: "sonnet", label: "Tester" },
  { role: "designer", model: "sonnet", label: "Designer" },
  { role: "writer", model: "haiku", label: "Writer" },
  { role: "debugger", model: "sonnet", label: "Debugger" },
];

const modelColorMap: Record<ModelType, string> = {
  haiku: "bg-green-500",
  sonnet: "bg-blue-500",
  opus: "bg-purple-500",
};

export function AgentPalette() {
  const onDragStart = (event: DragEvent, role: string) => {
    event.dataTransfer.setData("application/harness-agent-role", role);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="flex flex-col gap-1.5">
      <p className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">
        에이전트를 캔버스에 드래그하세요
      </p>
      {paletteAgents.map((agent) => (
        <div
          key={agent.role}
          draggable
          onDragStart={(e) => onDragStart(e, agent.role)}
          className="flex cursor-grab items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50 active:cursor-grabbing dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-750"
        >
          <span
            className={`h-2 w-2 rounded-full ${modelColorMap[agent.model]}`}
          />
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {agent.label}
          </span>
          <span className="ml-auto text-xs text-zinc-400 dark:text-zinc-500">
            {agent.model}
          </span>
        </div>
      ))}
    </div>
  );
}
