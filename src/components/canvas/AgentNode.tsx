"use client";

import { memo, useState, useRef } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { useHarnessStore } from "@/lib/store";
import { MODEL_META } from "@/lib/model-colors";
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

  const m = MODEL_META[data.model];

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
        width: 200,
        minHeight: 84,
        background: "var(--cds-layer-02)",
        border: "1px solid var(--cds-border-subtle-00)",
        outline: isSelected ? "2px solid var(--cds-focus)" : "none",
        outlineOffset: -1,
        cursor: "grab",
        userSelect: "none",
        zIndex: isSelected ? 10 : isHovered ? 5 : 1,
        boxShadow: isSelected ? "0 2px 6px rgba(0,0,0,0.3)" : isHovered ? "0 1px 3px rgba(0,0,0,0.15)" : "none",
      }}
    >
      {/* Left color bar */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: m.dotColor }} />

      <div style={{ padding: "12px 16px 12px 19px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <RoleIcon role={data.role} size={16} color="var(--cds-icon-primary)" />
          <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.16px", color: "var(--cds-text-primary)", textTransform: "capitalize" as const }}>
            {data.role}
          </span>
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
          {/* Model tag - flat rectangle */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: 20,
              padding: "0 8px",
              fontSize: 12,
              letterSpacing: "0.32px",
              background: m.tagBg,
              color: m.tagFg,
            }}
          >
            {m.label}
          </span>
          {data.skillCount > 0 && (
            <span style={{ fontSize: 12, letterSpacing: "0.32px", color: "var(--cds-text-helper)" }}>
              {data.skillCount} skill{data.skillCount > 1 ? "s" : ""}
            </span>
          )}
          {data.toolCount > 0 && (
            <span style={{ fontSize: 12, letterSpacing: "0.32px", color: "var(--cds-text-helper)" }}>
              &middot; {data.toolCount} tool{data.toolCount > 1 ? "s" : ""}
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
            background: "var(--cds-layer-02)",
            border: "1px solid var(--cds-border-subtle-00)",
            padding: "6px 10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            fontSize: 12,
            letterSpacing: "0.32px",
            color: "var(--cds-text-secondary)",
            whiteSpace: "nowrap",
            zIndex: 100,
            pointerEvents: "none",
          }}
        >
          {data.skillNames.join(", ")}
        </div>
      )}

      {/* Input handle - square */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: 10,
          height: 10,
          borderRadius: 0,
          border: "1px solid var(--cds-border-strong-01)",
          background: "var(--cds-layer-02)",
          left: -5,
        }}
      />
      {/* Output handle - square, filled */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: 10,
          height: 10,
          borderRadius: 0,
          border: "1px solid var(--cds-interactive)",
          background: "var(--cds-interactive)",
          right: -5,
        }}
      />
    </div>
  );
}

export const AgentNode = memo(AgentNodeComponent);
