"use client";

import { useState } from "react";
import { AgentPalette } from "./AgentPalette";
import { TemplateGallery } from "./TemplateGallery";

type TabKey = "agents" | "templates";

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<TabKey>("agents");

  return (
    <aside
      style={{
        width: 256,
        background: "var(--cds-layer-01)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid var(--cds-border-subtle-00)",
        flexShrink: 0,
      }}
    >
      {/* Carbon tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--cds-border-subtle-00)", background: "var(--cds-background)" }}>
        {(["agents", "templates"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              height: 48,
              fontSize: 14,
              letterSpacing: "0.16px",
              color: activeTab === tab ? "var(--cds-text-primary)" : "var(--cds-text-secondary)",
              fontWeight: activeTab === tab ? 600 : 400,
              background: activeTab === tab ? "var(--cds-layer-01)" : "var(--cds-background)",
              border: "none",
              cursor: "pointer",
              borderBottom: activeTab === tab ? "3px solid var(--cds-interactive)" : "3px solid transparent",
              textTransform: "capitalize",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {activeTab === "agents" ? <AgentPalette /> : <TemplateGallery />}
      </div>
    </aside>
  );
}
