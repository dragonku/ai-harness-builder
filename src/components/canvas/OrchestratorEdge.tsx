"use client";

import { memo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "reactflow";
import type { EdgeType } from "@/lib/types";

interface OrchestratorEdgeData {
  readonly edgeType: EdgeType;
  readonly condition?: string;
}

function OrchestratorEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}: EdgeProps<OrchestratorEdgeData>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isParallel = data?.edgeType === "parallel";

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: isParallel ? "#8b5cf6" : "#9ca3af",
          strokeWidth: 2,
          strokeDasharray: isParallel ? "6 4" : "none",
        }}
      />
      {isParallel && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan pointer-events-auto absolute rounded bg-purple-100 px-1.5 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900 dark:text-purple-300"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
          >
            parallel
          </div>
        </EdgeLabelRenderer>
      )}
      {data?.condition && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan pointer-events-auto absolute rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            style={{
              transform: `translate(-50%, ${isParallel ? "50%" : "-50%"}) translate(${labelX}px,${labelY + (isParallel ? 16 : 0)}px)`,
            }}
          >
            {data.condition}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const OrchestratorEdge = memo(OrchestratorEdgeComponent);
