"use client";

import { useCallback, useState } from "react";
import { createSkill, type Skill } from "@/lib/types";

interface SkillEditorProps {
  readonly skills: readonly Skill[];
  readonly onChange: (skills: readonly Skill[]) => void;
}

export function SkillEditor({ skills, onChange }: SkillEditorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAdd = useCallback(() => {
    const newSkill = createSkill({
      name: "",
      description: "",
      prompt: "",
    });
    onChange([...skills, newSkill]);
    setExpandedId(newSkill.id);
  }, [skills, onChange]);

  const handleUpdate = useCallback(
    (id: string, field: keyof Omit<Skill, "id">, value: string) => {
      onChange(
        skills.map((skill) =>
          skill.id === id ? { ...skill, [field]: value } : skill,
        ),
      );
    },
    [skills, onChange],
  );

  const handleRemove = useCallback(
    (id: string) => {
      onChange(skills.filter((skill) => skill.id !== id));
      if (expandedId === id) setExpandedId(null);
    },
    [skills, onChange, expandedId],
  );

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--fg-tertiary)",
            textTransform: "uppercase" as const,
            letterSpacing: "0.5px",
          }}
        >
          스킬
        </div>
        <button
          onClick={handleAdd}
          style={{
            padding: "3px 10px",
            borderRadius: 6,
            border: "1px solid var(--border-default)",
            background: "transparent",
            color: "var(--fg-accent)",
            fontSize: 11,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          + 추가
        </button>
      </div>

      {skills.length === 0 && (
        <p style={{ fontSize: 12, color: "var(--fg-tertiary)", margin: 0 }}>스킬이 없습니다</p>
      )}

      {skills.map((skill) => {
        const isExpanded = expandedId === skill.id;
        return (
          <div
            key={skill.id}
            style={{
              borderRadius: 8,
              border: "1px solid var(--border-subtle)",
              overflow: "hidden",
            }}
          >
            {/* Accordion header */}
            <button
              onClick={() => toggleExpand(skill.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 10px",
                background: "var(--bg-secondary)",
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 500,
                color: "var(--fg-primary)",
              }}
            >
              <span>{skill.name || "이름 없는 스킬"}</span>
              <span
                style={{
                  display: "inline-block",
                  transition: "transform 0.2s ease",
                  transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  fontSize: 10,
                  color: "var(--fg-tertiary)",
                }}
              >
                &#9660;
              </span>
            </button>

            {/* Accordion content */}
            {isExpanded && (
              <div style={{ padding: "10px", display: "flex", flexDirection: "column", gap: 8 }}>
                <div>
                  <label style={{ fontSize: 11, color: "var(--fg-tertiary)", display: "block", marginBottom: 4 }}>
                    이름
                  </label>
                  <input
                    value={skill.name}
                    onChange={(e) => handleUpdate(skill.id, "name", e.target.value)}
                    placeholder="스킬 이름"
                    style={{
                      width: "100%",
                      height: 28,
                      padding: "0 8px",
                      borderRadius: 6,
                      border: "1px solid var(--border-default)",
                      background: "var(--bg-secondary)",
                      color: "var(--fg-primary)",
                      fontSize: 12,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11, color: "var(--fg-tertiary)", display: "block", marginBottom: 4 }}>
                    설명
                  </label>
                  <input
                    value={skill.description}
                    onChange={(e) => handleUpdate(skill.id, "description", e.target.value)}
                    placeholder="스킬 설명"
                    style={{
                      width: "100%",
                      height: 28,
                      padding: "0 8px",
                      borderRadius: 6,
                      border: "1px solid var(--border-default)",
                      background: "var(--bg-secondary)",
                      color: "var(--fg-primary)",
                      fontSize: 12,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11, color: "var(--fg-tertiary)", display: "block", marginBottom: 4 }}>
                    프롬프트
                  </label>
                  <textarea
                    value={skill.prompt}
                    onChange={(e) => handleUpdate(skill.id, "prompt", e.target.value)}
                    placeholder="스킬 프롬프트..."
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "6px 8px",
                      borderRadius: 6,
                      border: "1px solid var(--border-default)",
                      background: "var(--bg-secondary)",
                      color: "var(--fg-primary)",
                      fontSize: 12,
                      fontFamily: "var(--font-mono)",
                      outline: "none",
                      resize: "vertical",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <button
                  onClick={() => handleRemove(skill.id)}
                  style={{
                    alignSelf: "flex-end",
                    padding: "3px 10px",
                    borderRadius: 6,
                    border: "none",
                    background: "transparent",
                    color: "#ef4444",
                    fontSize: 11,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
