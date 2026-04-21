"use client";

import type { DragEvent } from "react";
import { RoleIcon } from "@/components/icons/RoleIcon";
import { MC } from "@/lib/model-colors";
import type { ModelType } from "@/lib/types";

interface PaletteAgent {
  readonly role: string;
  readonly model: ModelType;
  readonly label: string;
  readonly description: string;
}

const paletteAgents: readonly PaletteAgent[] = [
  { role: "planner", model: "opus", label: "Planner", description: "계획 수립 및 작업 분해" },
  { role: "architect", model: "opus", label: "Architect", description: "시스템 설계 및 구조" },
  { role: "executor", model: "sonnet", label: "Executor", description: "코드 구현 및 실행" },
  { role: "reviewer", model: "sonnet", label: "Reviewer", description: "코드 리뷰 및 검증" },
  { role: "tester", model: "sonnet", label: "Tester", description: "테스트 작성 및 QA" },
  { role: "designer", model: "sonnet", label: "Designer", description: "UI/UX 설계" },
  { role: "writer", model: "haiku", label: "Writer", description: "문서 및 가이드 작성" },
  { role: "debugger", model: "sonnet", label: "Debugger", description: "버그 분석 및 수정" },
];

export function AgentPalette() {
  const onDragStart = (event: DragEvent, role: string) => {
    event.dataTransfer.setData("application/harness-agent-role", role);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {paletteAgents.map((agent) => {
        const mc = MC[agent.model];
        return (
          <div
            key={agent.role}
            draggable
            onDragStart={(e) => onDragStart(e, agent.role)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 10,
              background: "var(--bg-primary)",
              border: "1px solid var(--border-subtle)",
              cursor: "grab",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--bg-elevated)";
              (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-node)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--bg-primary)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            {/* Role icon */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: mc.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <RoleIcon role={agent.role} size={16} color={mc.color} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--fg-primary)",
                  marginBottom: 2,
                }}
              >
                {agent.label}
              </div>
              <div style={{ fontSize: 11, color: "var(--fg-tertiary)", lineHeight: 1.3 }}>
                {agent.description}
              </div>
            </div>

            {/* Model pill */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: 18,
                padding: "0 7px",
                borderRadius: 9,
                fontSize: 10,
                fontWeight: 500,
                background: mc.bg,
                color: mc.color,
                border: `1px solid ${mc.border}`,
                flexShrink: 0,
              }}
            >
              {agent.model}
            </span>
          </div>
        );
      })}
    </div>
  );
}
