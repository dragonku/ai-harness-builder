"use client";

import { useCallback, useRef, useState } from "react";
import { useHarnessStore } from "@/lib/store";
import { createHarness } from "@/lib/types";
import { saveHarness } from "@/lib/db";
import { parseImport, type ImportResult } from "@/lib/import/parser";
import { ExportDialog } from "@/components/export/ExportDialog";
import { CarbonIcon } from "@/components/icons/CarbonIcon";

interface ToolbarProps {
  readonly theme: "white" | "g90" | "g100";
  readonly onToggleTheme: () => void;
}

export function Toolbar({ theme, onToggleTheme }: ToolbarProps) {
  const harness = useHarnessStore((s) => s.harness);
  const loadHarness = useHarnessStore((s) => s.loadHarness);
  const updateHarnessName = useHarnessStore((s) => s.updateHarnessName);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [hover, setHover] = useState<string | null>(null);

  const handleNew = useCallback(() => {
    loadHarness(createHarness({ name: "Untitled harness" }));
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

  const isDark = theme !== "white";

  const btnStyle = (key: string): React.CSSProperties => ({
    width: 48,
    height: 48,
    background: hover === key ? "var(--cds-gray-80-hover)" : "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 110ms cubic-bezier(0.2,0,0.38,0.9)",
  });

  const divider = (
    <div style={{ width: 1, height: 48, background: "var(--cds-gray-80)" }} />
  );

  return (
    <header
      style={{
        height: 48,
        background: "var(--cds-gray-100)",
        display: "flex",
        alignItems: "center",
        color: "#fff",
        flexShrink: 0,
        position: "relative",
        zIndex: 50,
      }}
    >
      {/* Menu button */}
      <button
        style={btnStyle("menu")}
        onMouseEnter={() => setHover("menu")}
        onMouseLeave={() => setHover(null)}
      >
        <CarbonIcon name="menu" size={20} />
      </button>

      {/* Brand */}
      <div style={{ padding: "0 16px 0 0", fontSize: 14, letterSpacing: "0.16px", whiteSpace: "nowrap" }}>
        <span>IBM </span>
        <span style={{ fontWeight: 600 }}>AI Harness Builder</span>
      </div>

      {divider}

      {/* Harness name / breadcrumb */}
      {harness ? (
        <div style={{ display: "flex", alignItems: "center", height: "100%", paddingLeft: 16, minWidth: 0, flex: 1 }}>
          <span style={{ fontSize: 12, color: "var(--cds-gray-30)", letterSpacing: "0.32px", marginRight: 12 }}>
            PIPELINE /
          </span>
          {isEditingName ? (
            <input
              autoFocus
              value={harness.name}
              onChange={(e) => updateHarnessName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setIsEditingName(false);
              }}
              style={{
                fontSize: 14,
                color: "#fff",
                background: "var(--cds-gray-80)",
                border: "none",
                borderBottom: "2px solid #fff",
                outline: "none",
                padding: "4px 8px",
                width: 280,
              }}
            />
          ) : (
            <span
              onClick={() => setIsEditingName(true)}
              title="Click to rename"
              style={{
                fontSize: 14,
                color: "#fff",
                padding: "4px 8px",
                cursor: "text",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 340,
              }}
            >
              {harness.name}
            </span>
          )}
        </div>
      ) : (
        <div style={{ flex: 1 }} />
      )}

      {/* Right actions */}
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        <button
          style={btnStyle("new")}
          onMouseEnter={() => setHover("new")}
          onMouseLeave={() => setHover(null)}
          onClick={handleNew}
          title="New"
        >
          <CarbonIcon name="add" size={20} />
        </button>
        {harness && (
          <>
            <button
              style={btnStyle("save")}
              onMouseEnter={() => setHover("save")}
              onMouseLeave={() => setHover(null)}
              onClick={handleSave}
              title="Save"
            >
              <CarbonIcon name="download" size={20} />
            </button>
            <button
              style={btnStyle("load")}
              onMouseEnter={() => setHover("load")}
              onMouseLeave={() => setHover(null)}
              onClick={handleLoadClick}
              title="Load"
            >
              <CarbonIcon name="upload" size={20} />
            </button>
            <ExportDialog />
          </>
        )}
        {!harness && (
          <button
            style={btnStyle("load")}
            onMouseEnter={() => setHover("load")}
            onMouseLeave={() => setHover(null)}
            onClick={handleLoadClick}
            title="Load"
          >
            <CarbonIcon name="upload" size={20} />
          </button>
        )}

        {divider}

        {/* Theme toggle */}
        <button
          style={btnStyle("theme")}
          onMouseEnter={() => setHover("theme")}
          onMouseLeave={() => setHover(null)}
          onClick={onToggleTheme}
          title="Toggle theme"
        >
          <CarbonIcon name={isDark ? "light" : "asleep"} size={20} />
        </button>

        {/* Notification */}
        <button
          style={btnStyle("notif")}
          onMouseEnter={() => setHover("notif")}
          onMouseLeave={() => setHover(null)}
        >
          <CarbonIcon name="notification" size={20} />
        </button>

        {/* User */}
        <button
          style={btnStyle("user")}
          onMouseEnter={() => setHover("user")}
          onMouseLeave={() => setHover(null)}
        >
          <CarbonIcon name="user" size={20} />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".yaml,.yml,.json"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </header>
  );
}
