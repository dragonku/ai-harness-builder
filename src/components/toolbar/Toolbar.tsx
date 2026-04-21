"use client";

import { useCallback, useRef, useState } from "react";
import { useHarnessStore } from "@/lib/store";
import { createHarness } from "@/lib/types";
import { saveHarness } from "@/lib/db";
import { parseImport, type ImportResult } from "@/lib/import/parser";
import { ExportDialog } from "@/components/export/ExportDialog";

interface ToolbarProps {
  readonly darkMode: boolean;
  readonly onToggleDarkMode: () => void;
}

export function Toolbar({ darkMode, onToggleDarkMode }: ToolbarProps) {
  const harness = useHarnessStore((s) => s.harness);
  const loadHarness = useHarnessStore((s) => s.loadHarness);
  const updateHarnessName = useHarnessStore((s) => s.updateHarnessName);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingName, setIsEditingName] = useState(false);

  const handleNew = useCallback(() => {
    loadHarness(createHarness({ name: "새 하네스" }));
  }, [loadHarness]);

  const handleSave = useCallback(async () => {
    if (!harness) return;
    try {
      await saveHarness(harness);
    } catch {
      // Save failed silently for now
    }
  }, [harness]);

  const handleLoadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const content = await file.text();
      const format = file.name.endsWith(".yaml") || file.name.endsWith(".yml")
        ? "yaml" as const
        : "json" as const;

      const result: ImportResult = parseImport(content, format);
      if (result.success) {
        loadHarness(result.harness);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [loadHarness],
  );

  const toolbarButton = (
    label: string,
    onClick: () => void,
    opts?: { icon?: React.ReactNode; title?: string },
  ) => (
    <button
      onClick={onClick}
      title={opts?.title}
      style={{
        height: 30,
        padding: opts?.icon ? "0 8px" : "0 14px",
        borderRadius: 6,
        border: "1px solid var(--border-subtle)",
        background: "transparent",
        color: "var(--fg-secondary)",
        fontSize: 12,
        fontWeight: 500,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 4,
        transition: "background 0.15s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "var(--border-subtle)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      {opts?.icon}
      {label}
    </button>
  );

  return (
    <header
      style={{
        height: 48,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "0 16px",
        borderBottom: "1px solid var(--border-subtle)",
        background: "var(--bg-nav)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        position: "relative",
        zIndex: 10,
      }}
    >
      {/* Logo icon */}
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 7,
          background: "var(--accent-apple)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="4" stroke="#fff" strokeWidth="1.5"/>
          <circle cx="8.5" cy="9" r="1.5" fill="#fff"/>
          <circle cx="15.5" cy="9" r="1.5" fill="#fff"/>
          <path d="M8 15c1.5 1.5 6.5 1.5 8 0" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Harness name (inline editing) */}
      {harness ? (
        isEditingName ? (
          <input
            autoFocus
            value={harness.name}
            onChange={(e) => updateHarnessName(e.target.value)}
            onBlur={() => setIsEditingName(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setIsEditingName(false);
            }}
            style={{
              height: 28,
              width: 160,
              padding: "0 8px",
              borderRadius: 6,
              border: "1px solid var(--accent-apple)",
              background: "var(--bg-primary)",
              color: "var(--fg-primary)",
              fontSize: 13,
              fontWeight: 600,
              outline: "none",
            }}
          />
        ) : (
          <span
            onClick={() => setIsEditingName(true)}
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--fg-primary)",
              cursor: "text",
              padding: "4px 8px",
              borderRadius: 6,
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--border-subtle)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            {harness.name}
          </span>
        )
      ) : (
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg-primary)" }}>
          AI 하네스 빌더
        </span>
      )}

      {/* Separator */}
      <div
        style={{
          width: 1,
          height: 20,
          background: "var(--border-default)",
          margin: "0 4px",
        }}
      />

      {toolbarButton("새로 만들기", handleNew)}

      {harness && (
        <>
          {toolbarButton("저장", handleSave, { title: "Cmd+S" })}
          {toolbarButton("불러오기", handleLoadClick)}
        </>
      )}

      {!harness && toolbarButton("불러오기", handleLoadClick)}

      <input
        ref={fileInputRef}
        type="file"
        accept=".yaml,.yml,.json"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <div style={{ flex: 1 }} />

      {/* Dark mode toggle */}
      <button
        onClick={onToggleDarkMode}
        title="다크 모드 전환"
        style={{
          width: 30,
          height: 30,
          borderRadius: 6,
          border: "1px solid var(--border-subtle)",
          background: "transparent",
          color: "var(--fg-secondary)",
          fontSize: 16,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {darkMode ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>

      {/* Separator */}
      <div
        style={{
          width: 1,
          height: 20,
          background: "var(--border-default)",
          margin: "0 4px",
        }}
      />

      {/* Export button */}
      {harness && <ExportDialog />}
    </header>
  );
}
