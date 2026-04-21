"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { Badge } from "@/components/ui/badge";
import { useHarnessStore } from "@/lib/store";
import type { ModelType } from "@/lib/types";

interface AgentNodeData {
  readonly role: string;
  readonly model: ModelType;
  readonly skillCount: number;
  readonly toolCount: number;
}

const modelColors: Record<ModelType, string> = {
  haiku: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  sonnet: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  opus: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

function AgentNodeComponent({ id, data }: NodeProps<AgentNodeData>) {
  const selectedNodeId = useHarnessStore((s) => s.selectedNodeId);
  const isSelected = selectedNodeId === id;

  return (
    <div
      className={`rounded-lg border-2 bg-white px-4 py-3 shadow-sm transition-colors dark:bg-zinc-900 ${
        isSelected
          ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800"
          : "border-zinc-200 dark:border-zinc-700"
      }`}
      style={{ minWidth: 160 }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-white !bg-zinc-400 dark:!border-zinc-900"
      />

      <div className="flex flex-col gap-1.5">
        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {data.role}
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex h-5 items-center rounded-full px-2 text-xs font-medium ${modelColors[data.model]}`}
          >
            {data.model}
          </span>

          {data.skillCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {data.skillCount} skill{data.skillCount > 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        {data.toolCount > 0 && (
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {data.toolCount} tool{data.toolCount > 1 ? "s" : ""}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-white !bg-zinc-400 dark:!border-zinc-900"
      />
    </div>
  );
}

export const AgentNode = memo(AgentNodeComponent);
