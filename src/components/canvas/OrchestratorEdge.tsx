"use client";

import { memo, useState } from "react";
import {
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "reactflow";
import { useHarnessStore } from "@/lib/store";
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
}: EdgeProps<OrchestratorEdgeData>) {
  const removeEdge = useHarnessStore((s) => s.removeEdge);
  const [isHovered, setIsHovered] = useState(false);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isParallel = data?.edgeType === "parallel";
  const strokeColor = isHovered
    ? (isParallel ? "#af52de" : "#6b7280")
    : (isParallel ? "#af52de" : "#d1d5db");

  return (
    <>
      {/* Invisible wide path for hover */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={16}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ cursor: "pointer" }}
      />
      {/* Visible path */}
      <path
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={isHovered ? 2.5 : 2}
        strokeDasharray={isParallel ? "6 4" : "none"}
        markerEnd={!isParallel ? "url(#arrowhead)" : undefined}
        style={{ transition: "stroke 0.15s ease, stroke-width 0.15s ease", pointerEvents: "none" }}
      />
      {/* Arrowhead marker */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="10"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill={strokeColor}
          />
        </marker>
      </defs>

      {/* Parallel label */}
      {isParallel && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan pointer-events-none absolute"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "var(--model-opus-bg)",
              border: "1px solid var(--model-opus-border)",
              borderRadius: 6,
              padding: "2px 8px",
              fontSize: 10,
              fontWeight: 500,
              color: "var(--model-opus)",
            }}
          >
            parallel
          </div>
        </EdgeLabelRenderer>
      )}

      {/* Condition label */}
      {data?.condition && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan pointer-events-none absolute"
            style={{
              transform: `translate(-50%, ${isParallel ? "50%" : "-50%"}) translate(${labelX}px,${labelY + (isParallel ? 16 : 0)}px)`,
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 6,
              padding: "2px 8px",
              fontSize: 10,
              color: "var(--fg-tertiary)",
            }}
          >
            {data.condition}
          </div>
        </EdgeLabelRenderer>
      )}

      {/* Delete button on hover */}
      {isHovered && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan pointer-events-auto absolute"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX + (isParallel ? 50 : 0)}px,${labelY}px)`,
            }}
          >
            <button
              onClick={() => removeEdge(id)}
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#ef4444",
                color: "#fff",
                border: "2px solid var(--bg-primary)",
                fontSize: 12,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                lineHeight: 1,
                boxShadow: "var(--shadow-node)",
              }}
              aria-label="Delete edge"
            >
              &times;
            </button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const OrchestratorEdge = memo(OrchestratorEdgeComponent);
