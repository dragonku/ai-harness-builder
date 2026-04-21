"use client";

import { useCallback, useMemo, useState } from "react";
import { useHarnessStore } from "@/lib/store";
import { RoleIcon } from "@/components/icons/RoleIcon";
import { MC } from "@/lib/model-colors";
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

  const emptyContent = (msg: string) => (
    <aside
      style={{
        width: 280,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderLeft: "1px solid var(--border-subtle)",
        background: "var(--bg-primary)",
      }}
    >
      <p style={{ fontSize: 13, color: "var(--fg-tertiary)", padding: "0 24px", textAlign: "center" }}>
        {msg}
      </p>
    </aside>
  );

  if (!harness) return emptyContent("하네스를 먼저 불러오세요");
  if (!selectedAgent) return emptyContent("노드를 선택하면 속성을 편집할 수 있습니다");

  const mc = MC[selectedAgent.model];

  const sectionTitle = (text: string) => (
    <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: "var(--fg-tertiary)",
        textTransform: "uppercase" as const,
        letterSpacing: "0.5px",
        marginBottom: 8,
      }}
    >
      {text}
    </div>
  );

  return (
    <aside
      style={{
        width: 280,
        display: "flex",
        flexDirection: "column",
        borderLeft: "1px solid var(--border-subtle)",
        background: "var(--bg-primary)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: mc.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <RoleIcon role={selectedAgent.role} size={18} color={mc.color} />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--fg-primary)" }}>
            {selectedAgent.role}
          </div>
          <div style={{ fontSize: 11, color: "var(--fg-tertiary)" }}>에이전트 속성</div>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Role */}
          <div>
            {sectionTitle("역할")}
            <input
              value={selectedAgent.role}
              onChange={(e) => handleRoleChange(e.target.value)}
              placeholder="에이전트 역할"
              style={{
                width: "100%",
                height: 32,
                padding: "0 10px",
                borderRadius: 8,
                border: "1px solid var(--border-default)",
                background: "var(--bg-secondary)",
                color: "var(--fg-primary)",
                fontSize: 13,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Model - segmented control */}
          <div>
            {sectionTitle("모델")}
            <div
              style={{
                display: "flex",
                background: "var(--bg-secondary)",
                borderRadius: 8,
                padding: 2,
                gap: 2,
              }}
            >
              {models.map((m) => {
                const isActive = selectedAgent.model === m;
                const mColor = MC[m];
                return (
                  <button
                    key={m}
                    onClick={() => handleModelChange(m)}
                    style={{
                      flex: 1,
                      padding: "6px 0",
                      borderRadius: 6,
                      border: "none",
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      background: isActive ? "var(--bg-primary)" : "transparent",
                      color: isActive ? mColor.color : "var(--fg-tertiary)",
                      boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    }}
                  >
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Separator */}
          <div style={{ height: 1, background: "var(--border-subtle)" }} />

          {/* Tools */}
          <div>
            {sectionTitle("도구")}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {availableTools.map((tool) => {
                const isActive = selectedAgent.tools.includes(tool);
                return (
                  <button
                    key={tool}
                    onClick={() => handleToolToggle(tool)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      border: `1px solid ${isActive ? "var(--accent-apple)" : "var(--border-default)"}`,
                      background: isActive ? "rgba(0,113,227,0.08)" : "transparent",
                      color: isActive ? "var(--accent-apple)" : "var(--fg-secondary)",
                      fontSize: 11,
                      fontFamily: "var(--font-mono)",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {tool}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Separator */}
          <div style={{ height: 1, background: "var(--border-subtle)" }} />

          {/* Skills */}
          <SkillEditor
            skills={[...selectedAgent.skills]}
            onChange={handleSkillsChange}
          />

          {/* Separator */}
          <div style={{ height: 1, background: "var(--border-subtle)" }} />

          {/* Delete */}
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                width: "100%",
                padding: "8px 0",
                borderRadius: 8,
                background: "transparent",
                color: "#ef4444",
                fontSize: 13,
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
              }}
            >
              에이전트 삭제
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ fontSize: 12, color: "#ef4444", textAlign: "center", margin: 0 }}>
                정말 삭제하시겠습니까?
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{
                    flex: 1,
                    padding: "6px 0",
                    borderRadius: 8,
                    border: "1px solid var(--border-default)",
                    background: "transparent",
                    color: "var(--fg-secondary)",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  취소
                </button>
                <button
                  onClick={handleDelete}
                  style={{
                    flex: 1,
                    padding: "6px 0",
                    borderRadius: 8,
                    border: "none",
                    background: "#ef4444",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  확인
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
