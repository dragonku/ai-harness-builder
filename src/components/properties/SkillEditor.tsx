"use client";

import { useCallback, useState } from "react";
import { createSkill, type Skill } from "@/lib/types";
import { CarbonIcon } from "@/components/icons/CarbonIcon";

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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.32px", color: "var(--cds-text-secondary)", textTransform: "uppercase" as const }}>
          Skills
        </div>
        <button
          onClick={handleAdd}
          style={{
            height: 32,
            padding: "0 12px",
            background: "transparent",
            border: "none",
            color: "var(--cds-link-primary)",
            fontSize: 14,
            letterSpacing: "0.16px",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <CarbonIcon name="add" size={16} />
          Add
        </button>
      </div>

      {skills.length === 0 && (
        <div style={{ fontSize: 12, color: "var(--cds-text-helper)", letterSpacing: "0.32px", padding: "8px 0" }}>
          No skills configured.
        </div>
      )}

      {skills.map((skill) => {
        const isExpanded = expandedId === skill.id;
        return (
          <div
            key={skill.id}
            style={{
              border: "1px solid var(--cds-border-subtle-00)",
              marginBottom: 1,
              background: "var(--cds-background)",
            }}
          >
            {/* Accordion header */}
            <button
              onClick={() => toggleExpand(skill.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "0 16px",
                height: 40,
                width: "100%",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                color: "var(--cds-text-primary)",
                letterSpacing: "0.16px",
                textAlign: "left",
              }}
            >
              <CarbonIcon
                name={isExpanded ? "chevronDown" : "chevronRight"}
                size={16}
                color="var(--cds-icon-secondary)"
              />
              <span style={{ flex: 1 }}>{skill.name || "Unnamed skill"}</span>
            </button>

            {/* Accordion content */}
            {isExpanded && (
              <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12, borderTop: "1px solid var(--cds-border-subtle-00)", background: "var(--cds-layer-01)" }}>
                <div>
                  <label style={{ fontSize: 12, letterSpacing: "0.32px", color: "var(--cds-text-secondary)", display: "block", marginBottom: 4 }}>
                    Name
                  </label>
                  <input
                    value={skill.name}
                    onChange={(e) => handleUpdate(skill.id, "name", e.target.value)}
                    placeholder="Skill name"
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

                <div>
                  <label style={{ fontSize: 12, letterSpacing: "0.32px", color: "var(--cds-text-secondary)", display: "block", marginBottom: 4 }}>
                    Description
                  </label>
                  <input
                    value={skill.description}
                    onChange={(e) => handleUpdate(skill.id, "description", e.target.value)}
                    placeholder="Skill description"
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

                <div>
                  <label style={{ fontSize: 12, letterSpacing: "0.32px", color: "var(--cds-text-secondary)", display: "block", marginBottom: 4 }}>
                    Prompt
                  </label>
                  <textarea
                    value={skill.prompt}
                    onChange={(e) => handleUpdate(skill.id, "prompt", e.target.value)}
                    placeholder="Skill prompt..."
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "8px 16px",
                      background: "var(--cds-field-01)",
                      border: "none",
                      borderBottom: "1px solid var(--cds-border-strong-01)",
                      fontSize: 12,
                      fontFamily: "var(--cds-font-mono)",
                      lineHeight: "16px",
                      letterSpacing: "0.32px",
                      color: "var(--cds-text-secondary)",
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
                    padding: "4px 12px",
                    background: "transparent",
                    border: "none",
                    color: "var(--cds-support-error)",
                    fontSize: 12,
                    letterSpacing: "0.32px",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
