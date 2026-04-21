"use client";

import { useState, type DragEvent } from "react";
import { RoleIcon } from "@/components/icons/RoleIcon";
import { CarbonIcon } from "@/components/icons/CarbonIcon";
import { MODEL_META } from "@/lib/model-colors";
import type { ModelType } from "@/lib/types";

interface PaletteAgent {
  readonly role: string;
  readonly model: ModelType;
  readonly label: string;
  readonly description: string;
}

const paletteAgents: readonly PaletteAgent[] = [
  { role: "planner", model: "opus", label: "Planner", description: "Decompose tasks and plan" },
  { role: "architect", model: "opus", label: "Architect", description: "Design system structure" },
  { role: "executor", model: "sonnet", label: "Executor", description: "Write and run code" },
  { role: "reviewer", model: "sonnet", label: "Reviewer", description: "Review code quality" },
  { role: "tester", model: "sonnet", label: "Tester", description: "Author and run tests" },
  { role: "designer", model: "sonnet", label: "Designer", description: "Design UI and UX" },
  { role: "writer", model: "haiku", label: "Writer", description: "Write documentation" },
  { role: "debugger", model: "sonnet", label: "Debugger", description: "Trace and fix bugs" },
];

export function AgentPalette() {
  const [hoverAgent, setHoverAgent] = useState<string | null>(null);

  const onDragStart = (event: DragEvent, agent: PaletteAgent) => {
    event.dataTransfer.setData("application/harness-agent-role", agent.role);
    event.dataTransfer.setData("application/harness-agent-model", agent.model);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <>
      <div style={{ fontSize: 12, letterSpacing: "0.32px", color: "var(--cds-text-helper)", padding: "12px 16px 8px" }}>
        Drag an agent onto the canvas
      </div>
      {paletteAgents.map((agent) => {
        const hov = hoverAgent === agent.role;
        const meta = MODEL_META[agent.model];
        return (
          <div
            key={agent.role}
            draggable
            onDragStart={(e) => onDragStart(e, agent)}
            onMouseEnter={() => setHoverAgent(agent.role)}
            onMouseLeave={() => setHoverAgent(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: hov ? "0 16px 0 13px" : "0 16px",
              height: 56,
              cursor: "grab",
              background: hov ? "var(--cds-layer-hover-01)" : "transparent",
              borderLeft: hov ? "3px solid var(--cds-interactive)" : "3px solid transparent",
              transition: "background 110ms cubic-bezier(0.2,0,0.38,0.9)",
            }}
          >
            <CarbonIcon name="dragVertical" size={16} color="var(--cds-icon-secondary)" />
            <RoleIcon role={agent.role} size={16} color="var(--cds-icon-primary)" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, color: "var(--cds-text-primary)", letterSpacing: "0.16px", lineHeight: "18px" }}>
                {agent.label}
              </div>
              <div style={{ fontSize: 12, color: "var(--cds-text-helper)", letterSpacing: "0.32px", lineHeight: "16px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {agent.description}
              </div>
            </div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: 20,
                padding: "0 8px",
                fontSize: 12,
                letterSpacing: "0.32px",
                background: meta.tagBg,
                color: meta.tagFg,
                flexShrink: 0,
              }}
            >
              {meta.label}
            </span>
          </div>
        );
      })}
    </>
  );
}
