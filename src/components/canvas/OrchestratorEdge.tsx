"use client";

import { memo, useState } from "react";
import {
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "reactflow";
import { useHarnessStore } from "@/lib/store";
import { CarbonIcon } from "@/components/icons/CarbonIcon";
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
  const color = isHovered
    ? (isParallel ? "var(--cds-purple-70)" : "var(--cds-blue-70)")
    : (isParallel ? "var(--cds-purple-60)" : "var(--cds-gray-70)");

  const markerId = isParallel
    ? (isHovered ? "arr-par-h" : "arr-par")
    : (isHovered ? "arr-seq-h" : "arr-seq");

  return (
    <>
      {/* Arrow markers */}
      <defs>
        <marker id="arr-seq" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
          <path d="M0,0 L9,5 L0,10 L2,5 z" fill="var(--cds-gray-70)" />
        </marker>
        <marker id="arr-seq-h" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
          <path d="M0,0 L9,5 L0,10 L2,5 z" fill="var(--cds-blue-70)" />
        </marker>
        <marker id="arr-par" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
          <path d="M0,0 L9,5 L0,10 L2,5 z" fill="var(--cds-purple-60)" />
        </marker>
        <marker id="arr-par-h" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
          <path d="M0,0 L9,5 L0,10 L2,5 z" fill="var(--cds-purple-70)" />
        </marker>
      </defs>

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
        stroke={color}
        strokeWidth={isHovered ? 2 : 1.5}
        strokeDasharray={isParallel ? "4 3" : "none"}
        markerEnd={`url(#${markerId})`}
        style={{ transition: "stroke 110ms cubic-bezier(0.2,0,0.38,0.9)", pointerEvents: "none" }}
      />

      {/* Parallel label */}
      {isParallel && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan pointer-events-none absolute"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              display: "flex",
              alignItems: "center",
              height: 20,
              lineHeight: "20px",
              padding: "0 8px",
              fontSize: 12,
              letterSpacing: "0.32px",
              background: "var(--cds-purple-30)",
              color: "var(--cds-purple-70)",
              whiteSpace: "nowrap",
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
              background: "var(--cds-layer-02)",
              border: "1px solid var(--cds-border-subtle-00)",
              padding: "2px 8px",
              fontSize: 12,
              letterSpacing: "0.32px",
              color: "var(--cds-text-helper)",
            }}
          >
            {data.condition}
          </div>
        </EdgeLabelRenderer>
      )}

      {/* Delete button on hover - square */}
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
                background: "var(--cds-button-danger)",
                color: "#fff",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              aria-label="Delete edge"
            >
              <CarbonIcon name="close" size={16} color="#fff" />
            </button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const OrchestratorEdge = memo(OrchestratorEdgeComponent);
