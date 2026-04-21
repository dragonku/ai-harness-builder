"use client";

import { templates } from "@/lib/templates";
import { useHarnessStore } from "@/lib/store";

export function TemplateGallery() {
  const loadHarness = useHarnessStore((s) => s.loadHarness);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {templates.map((template) => (
        <div
          key={template.id}
          style={{
            background: "var(--bg-primary)",
            borderRadius: 12,
            border: "1px solid var(--border-subtle)",
            padding: 16,
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--fg-primary)",
              marginBottom: 4,
              letterSpacing: "-0.01em",
            }}
          >
            {template.name}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--fg-tertiary)",
              marginBottom: 12,
              lineHeight: 1.4,
            }}
          >
            {template.description}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: "var(--fg-tertiary)" }}>
              에이전트 {template.agentCount}개
            </span>
            <span style={{ fontSize: 11, color: "var(--fg-tertiary)" }}>
              페이즈 {template.phaseCount}개
            </span>
          </div>

          <button
            onClick={() => loadHarness(template.create())}
            style={{
              width: "100%",
              padding: "8px 0",
              borderRadius: 8,
              background: "var(--accent-apple)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              transition: "opacity 0.15s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "0.85";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "1";
            }}
          >
            사용하기
          </button>
        </div>
      ))}
    </div>
  );
}
