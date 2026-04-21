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
        width: 248,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border-subtle)",
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "16px 16px 12px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: "var(--accent-apple)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="4" stroke="#fff" strokeWidth="1.5"/>
            <circle cx="8.5" cy="9" r="1.5" fill="#fff"/>
            <circle cx="15.5" cy="9" r="1.5" fill="#fff"/>
            <path d="M8 15c1.5 1.5 6.5 1.5 8 0" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "var(--fg-primary)",
            letterSpacing: "-0.01em",
          }}
        >
          하네스 빌더
        </span>
      </div>

      {/* Segmented control */}
      <div style={{ padding: "0 12px 8px" }}>
        <div
          style={{
            display: "flex",
            background: "var(--border-subtle)",
            borderRadius: 8,
            padding: 2,
          }}
        >
          {(["agents", "templates"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: "6px 0",
                borderRadius: 6,
                border: "none",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.15s ease",
                background: activeTab === tab ? "var(--bg-primary)" : "transparent",
                color: activeTab === tab ? "var(--fg-primary)" : "var(--fg-tertiary)",
                boxShadow: activeTab === tab ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {tab === "agents" ? "에이전트" : "템플릿"}
            </button>
          ))}
        </div>
      </div>

      {/* Hint text */}
      <div style={{ padding: "0 16px 8px" }}>
        <p style={{ fontSize: 11, color: "var(--fg-tertiary)", margin: 0 }}>
          {activeTab === "agents"
            ? "드래그하여 캔버스에 추가"
            : "템플릿을 선택하여 시작"}
        </p>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", padding: "0 12px 12px" }}>
        {activeTab === "agents" ? <AgentPalette /> : <TemplateGallery />}
      </div>
    </aside>
  );
}
