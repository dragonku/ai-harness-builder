"use client";

import { memo, useState, useRef } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { useHarnessStore } from "@/lib/store";
import { MC } from "@/lib/model-colors";
import { RoleIcon } from "@/components/icons/RoleIcon";
import type { ModelType } from "@/lib/types";

interface AgentNodeData {
  readonly role: string;
  readonly model: ModelType;
  readonly skillCount: number;
  readonly toolCount: number;
  readonly skillNames?: readonly string[];
}

function AgentNodeComponent({ id, data }: NodeProps<AgentNodeData>) {
  const selectedNodeId = useHarnessStore((s) => s.selectedNodeId);
  const isSelected = selectedNodeId === id;
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mc = MC[data.model];

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (data.skillCount > 0 && data.skillNames && data.skillNames.length > 0) {
      tooltipTimer.current = setTimeout(() => setShowTooltip(true), 500);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowTooltip(false);
    if (tooltipTimer.current) {
      clearTimeout(tooltipTimer.current);
      tooltipTimer.current = null;
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        minWidth: 180,
        background: "var(--bg-primary)",
        borderRadius: 12,
        border: "1px solid var(--border-subtle)",
        boxShadow: isSelected
          ? "var(--shadow-node-selected)"
          : isHovered
            ? "var(--shadow-node-hover)"
            : "var(--shadow-node)",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        transform: isHovered ? "translateY(-1px)" : "none",
        overflow: "hidden",
        cursor: "grab",
      }}
    >
      {/* Top color bar */}
      <div style={{ height: 3, background: mc.color, width: "100%" }} />

      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          {/* Role icon */}
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: mc.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <RoleIcon role={data.role} size={15} color={mc.color} />
          </div>

          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--fg-primary)",
              letterSpacing: "-0.01em",
            }}
          >
            {data.role}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          {/* Model badge */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: 20,
              padding: "0 8px",
              borderRadius: 10,
              fontSize: 11,
              fontWeight: 500,
              background: mc.bg,
              color: mc.color,
              border: `1px solid ${mc.border}`,
            }}
          >
            {data.model}
          </span>

          {data.skillCount > 0 && (
            <span style={{ fontSize: 11, color: "var(--fg-tertiary)" }}>
              {data.skillCount} skill{data.skillCount > 1 ? "s" : ""}
            </span>
          )}

          {data.toolCount > 0 && (
            <span style={{ fontSize: 11, color: "var(--fg-tertiary)" }}>
              {data.toolCount} tool{data.toolCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && data.skillNames && data.skillNames.length > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
            borderRadius: 8,
            padding: "6px 10px",
            boxShadow: "var(--shadow-float)",
            fontSize: 11,
            color: "var(--fg-secondary)",
            whiteSpace: "nowrap",
            zIndex: 100,
            pointerEvents: "none",
          }}
        >
          {data.skillNames.join(", ")}
        </div>
      )}

      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          border: `2px solid ${mc.color}`,
          background: "var(--bg-primary)",
          left: -6,
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          border: `2px solid ${mc.color}`,
          background: "var(--bg-primary)",
          right: -6,
        }}
      />
    </div>
  );
}

export const AgentNode = memo(AgentNodeComponent);
