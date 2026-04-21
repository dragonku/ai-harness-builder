"use client";

import { useCallback, useMemo, useState } from "react";
import { useHarnessStore } from "@/lib/store";
import { RoleIcon } from "@/components/icons/RoleIcon";
import { CarbonIcon } from "@/components/icons/CarbonIcon";
import { MODEL_META } from "@/lib/model-colors";
import { SkillEditor } from "./SkillEditor";
import type { ModelType, Skill } from "@/lib/types";

const availableTools = [
  "Read",
  "Write",
  "Edit",
  "Bash",
  "Glob",
  "Grep",
  "TodoRead",
  "TodoWrite",
  "WebFetch",
  "WebSearch",
];

const models: ModelType[] = ["haiku", "sonnet", "opus"];

export function PropertiesPanel() {
  const harness = useHarnessStore((s) => s.harness);
  const selectedNodeId = useHarnessStore((s) => s.selectedNodeId);
  const updateAgent = useHarnessStore((s) => s.updateAgent);
  const removeAgent = useHarnessStore((s) => s.removeAgent);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const selectedAgent = useMemo(
    () => harness?.agents.find((a) => a.id === selectedNodeId) ?? null,
    [harness?.agents, selectedNodeId],
  );

  const handleRoleChange = useCallback(
    (value: string) => {
      if (selectedNodeId) {
        updateAgent(selectedNodeId, { role: value });
      }
    },
    [selectedNodeId, updateAgent],
  );

  const handleModelChange = useCallback(
    (value: ModelType) => {
      if (selectedNodeId) {
        updateAgent(selectedNodeId, { model: value });
      }
    },
    [selectedNodeId, updateAgent],
  );

  const handleToolToggle = useCallback(
    (tool: string) => {
      if (!selectedAgent || !selectedNodeId) return;
      const currentTools = selectedAgent.tools;
      const newTools = currentTools.includes(tool)
        ? currentTools.filter((t) => t !== tool)
        : [...currentTools, tool];
      updateAgent(selectedNodeId, { tools: newTools });
    },
    [selectedAgent, selectedNodeId, updateAgent],
  );

  const handleSkillsChange = useCallback(
    (skills: readonly Skill[]) => {
      if (selectedNodeId) {
        updateAgent(selectedNodeId, { skills });
      }
    },
    [selectedNodeId, updateAgent],
  );

  const handleDelete = useCallback(() => {
    if (selectedNodeId) {
      removeAgent(selectedNodeId);
      setShowDeleteConfirm(false);
    }
  }, [selectedNodeId, removeAgent]);

  // Empty state
  if (!harness || !selectedAgent) {
    return (
      <aside
        style={{
          width: 320,
          height: "100%",
          borderLeft: "1px solid var(--cds-border-subtle-00)",
          background: "var(--cds-layer-01)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <div style={{ textAlign: "left", padding: 24, maxWidth: 240 }}>
          <CarbonIcon name="eye" size={20} color="var(--cds-icon-secondary)" style={{ marginBottom: 12 }} />
          <h3 style={{ fontSize: 16, fontWeight: 600, letterSpacing: "0.16px", color: "var(--cds-text-primary)", marginBottom: 4, lineHeight: "22px" }}>
            No selection
          </h3>
          <p style={{ fontSize: 14, lineHeight: "18px", letterSpacing: "0.16px", color: "var(--cds-text-secondary)" }}>
            {harness
              ? "Select an agent on the canvas to view and edit its properties."
              : "Create or load a harness to begin."}
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside
      style={{
        width: 320,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "var(--cds-layer-01)",
        borderLeft: "1px solid var(--cds-border-subtle-00)",
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: 16,
          borderBottom: "1px solid var(--cds-border-subtle-00)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "var(--cds-background)",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            background: "var(--cds-layer-02)",
            border: "1px solid var(--cds-border-subtle-00)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <RoleIcon role={selectedAgent.role} size={16} color="var(--cds-icon-primary)" />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: "0.16px", color: "var(--cds-text-primary)", textTransform: "capitalize" as const, lineHeight: "22px" }}>
            {selectedAgent.role}
          </div>
          <div style={{ fontSize: 12, letterSpacing: "0.32px", color: "var(--cds-text-helper)", lineHeight: "16px" }}>
            Agent properties
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Identity section */}
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.32px", color: "var(--cds-text-secondary)", marginBottom: 8, textTransform: "uppercase" as const }}>
            Identity
          </div>
          <label style={{ display: "block", fontSize: 12, letterSpacing: "0.32px", color: "var(--cds-text-secondary)", marginBottom: 4 }}>
            Role
          </label>
          <input
            value={selectedAgent.role}
            onChange={(e) => handleRoleChange(e.target.value)}
            style={{
              width: "100%",
              height: 40,
              padding: "0 16px",
              background: "var(--cds-field-01)",
              border: "none",
              borderBottom: "1px solid var(--cds-border-strong-01)",
              fontSize: 14,
              letterSpacing: "0.16px",
              color: "var(--cds-text-primary)",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ height: 1, background: "var(--cds-border-subtle-00)" }} />

        {/* Model section */}
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.32px", color: "var(--cds-text-secondary)", marginBottom: 8, textTransform: "uppercase" as const }}>
            Model
          </div>
          <div style={{ display: "flex", border: "1px solid var(--cds-border-strong-01)" }}>
            {models.map((m) => {
              const isActive = selectedAgent.model === m;
              return (
                <button
                  key={m}
                  onClick={() => handleModelChange(m)}
                  style={{
                    flex: 1,
                    height: 40,
                    fontSize: 14,
                    letterSpacing: "0.16px",
                    border: "none",
                    cursor: "pointer",
                    textTransform: "capitalize" as const,
                    background: isActive ? "var(--cds-background-inverse)" : "transparent",
                    color: isActive ? "var(--cds-text-inverse)" : "var(--cds-text-primary)",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ height: 1, background: "var(--cds-border-subtle-00)" }} />

        {/* Tools section */}
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.32px", color: "var(--cds-text-secondary)", marginBottom: 8, textTransform: "uppercase" as const }}>
            Tools
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {availableTools.map((tool) => {
              const isActive = selectedAgent.tools.includes(tool);
              return (
                <button
                  key={tool}
                  onClick={() => handleToolToggle(tool)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    height: 24,
                    padding: "0 8px",
                    fontSize: 12,
                    letterSpacing: "0.32px",
                    fontFamily: "var(--cds-font-mono)",
                    background: isActive ? "var(--cds-blue-20)" : "var(--cds-gray-20)",
                    color: isActive ? "var(--cds-blue-80)" : "var(--cds-text-primary)",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {isActive && <CarbonIcon name="checkmark" size={16} color="var(--cds-blue-80)" style={{ marginRight: 4, marginLeft: -4 }} />}
                  {tool}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ height: 1, background: "var(--cds-border-subtle-00)" }} />

        {/* Skills section */}
        <div style={{ padding: 16 }}>
          <SkillEditor
            skills={[...selectedAgent.skills]}
            onChange={handleSkillsChange}
          />
        </div>
      </div>

      {/* Delete footer */}
      <div style={{ padding: 16, borderTop: "1px solid var(--cds-border-subtle-00)", background: "var(--cds-background)" }}>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--cds-button-danger-hover)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--cds-button-danger)";
            }}
            style={{
              width: "100%",
              height: 48,
              padding: "0 64px 0 16px",
              background: "var(--cds-button-danger)",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              letterSpacing: "0.16px",
              display: "flex",
              alignItems: "center",
              position: "relative",
              transition: "background 110ms cubic-bezier(0.2,0,0.38,0.9)",
            }}
          >
            Delete agent
            <span style={{ position: "absolute", right: 16 }}>
              <CarbonIcon name="trash" size={16} color="#fff" />
            </span>
          </button>
        ) : (
          <div style={{ display: "flex", gap: 1 }}>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              style={{
                flex: 1,
                height: 48,
                padding: "0 16px",
                background: "var(--cds-button-secondary)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                letterSpacing: "0.16px",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              style={{
                flex: 1,
                height: 48,
                padding: "0 16px",
                background: "var(--cds-button-danger)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                letterSpacing: "0.16px",
              }}
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
