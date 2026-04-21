"use client";

import { templates } from "@/lib/templates";
import { useHarnessStore } from "@/lib/store";
import { CarbonIcon } from "@/components/icons/CarbonIcon";

export function TemplateGallery() {
  const loadHarness = useHarnessStore((s) => s.loadHarness);

  return (
    <>
      <div style={{ fontSize: 12, letterSpacing: "0.32px", color: "var(--cds-text-helper)", padding: "12px 16px 8px" }}>
        Start from a template
      </div>
      {templates.map((template) => (
        <div
          key={template.id}
          style={{ background: "var(--cds-background)", padding: 16, marginBottom: 1 }}
        >
          <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.16px", color: "var(--cds-text-primary)", marginBottom: 4 }}>
            {template.name}
          </div>
          <div style={{ fontSize: 12, color: "var(--cds-text-secondary)", letterSpacing: "0.32px", lineHeight: "16px", marginBottom: 8 }}>
            {template.description}
          </div>
          <div style={{ fontSize: 12, color: "var(--cds-text-helper)", letterSpacing: "0.32px", marginBottom: 12, display: "flex", gap: 8 }}>
            <span>{template.agentCount} agents</span>
            <span>&middot;</span>
            <span>{template.phaseCount} phases</span>
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 12 }}>
            {template.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: 24,
                  padding: "0 8px",
                  fontSize: 12,
                  letterSpacing: "0.32px",
                  background: "var(--cds-gray-20)",
                  color: "var(--cds-text-primary)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={() => loadHarness(template.create())}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--cds-button-primary-hover)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--cds-button-primary)";
            }}
            style={{
              width: "100%",
              height: 40,
              padding: "0 16px",
              fontSize: 14,
              letterSpacing: "0.16px",
              background: "var(--cds-button-primary)",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "background 110ms cubic-bezier(0.2,0,0.38,0.9)",
            }}
          >
            Use this template
            <CarbonIcon name="chevronRight" size={16} color="#fff" />
          </button>
        </div>
      ))}
    </>
  );
}
