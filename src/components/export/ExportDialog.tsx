"use client";

import { useCallback, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useHarnessStore } from "@/lib/store";
import { validateHarness, type ValidationError } from "@/lib/validation";
import {
  exportAsZip,
  downloadBlob,
  type ExportFormat,
} from "@/lib/export/zip";
import { CarbonIcon, type CarbonIconName } from "@/components/icons/CarbonIcon";

const formats: { value: ExportFormat; label: string; desc: string; icon: CarbonIconName }[] = [
  { value: "claude-code", label: "Claude Code", desc: "AGENTS.md + skills/ directory", icon: "workflow" },
  { value: "yaml", label: "YAML", desc: "Pipeline definition as YAML", icon: "file" },
  { value: "json", label: "JSON", desc: "Structured JSON format", icon: "code" },
  { value: "all", label: "All formats", desc: "Every format bundled as ZIP", icon: "package" },
];

export function ExportDialog() {
  const harness = useHarnessStore((s) => s.harness);
  const [format, setFormat] = useState<ExportFormat>("claude-code");
  const [errors, setErrors] = useState<readonly ValidationError[]>([]);
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(false);

  const handleExport = useCallback(async () => {
    if (!harness) return;

    const validationErrors = validateHarness(harness);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setExporting(true);
    setProgress(true);
    try {
      const blob = await exportAsZip(harness, format);
      const filename = `${harness.name.replace(/\s+/g, "-")}-${format}.zip`;
      downloadBlob(blob, filename);
    } finally {
      setExporting(false);
      setTimeout(() => setProgress(false), 300);
    }
  }, [harness, format]);

  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            style={{
              width: 48,
              height: 48,
              background: "transparent",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 110ms cubic-bezier(0.2,0,0.38,0.9)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--cds-gray-80-hover)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
            disabled={!harness}
            title="Export"
          >
            <CarbonIcon name="share" size={20} />
          </button>
        }
      />
      <DialogContent
        className=""
        showCloseButton={false}
        style={{
          maxWidth: 560,
          borderRadius: 0,
          padding: 0,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ padding: "16px 48px 0 16px", position: "relative" }}>
          <div style={{ fontSize: 12, letterSpacing: "0.32px", color: "var(--cds-text-helper)", marginBottom: 4 }}>Export</div>
          <DialogTitle style={{ fontSize: 20, lineHeight: "28px", fontWeight: 400, color: "var(--cds-text-primary)", marginBottom: 4 }}>
            Export harness
          </DialogTitle>
          <DialogDescription style={{ fontSize: 14, lineHeight: "18px", letterSpacing: "0.16px", color: "var(--cds-text-secondary)" }}>
            Select a format and download the archive.
          </DialogDescription>
          <DialogClose
            render={
              <button
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 48,
                  height: 48,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--cds-icon-primary)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--cds-background-hover)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                <CarbonIcon name="close" size={20} />
              </button>
            }
          />
        </div>

        {/* Format selection */}
        <div style={{ padding: "24px 16px 16px" }}>
          <div style={{ fontSize: 12, letterSpacing: "0.32px", color: "var(--cds-text-secondary)", marginBottom: 8 }}>Format</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "var(--cds-border-subtle-00)" }}>
            {formats.map((f) => {
              const active = format === f.value;
              return (
                <label
                  key={f.value}
                  onClick={() => setFormat(f.value)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: active ? "12px 16px 12px 13px" : "12px 16px",
                    cursor: "pointer",
                    background: active ? "var(--cds-layer-selected-01)" : "var(--cds-layer-01)",
                    borderLeft: active ? "3px solid var(--cds-interactive)" : "3px solid transparent",
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      border: active ? "5px solid var(--cds-interactive)" : "1px solid var(--cds-border-strong-01)",
                      background: active ? "var(--cds-background)" : "transparent",
                      flexShrink: 0,
                    }}
                  />
                  <CarbonIcon name={f.icon} size={20} color="var(--cds-icon-primary)" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.16px", color: "var(--cds-text-primary)" }}>{f.label}</div>
                    <div style={{ fontSize: 12, letterSpacing: "0.32px", color: "var(--cds-text-helper)", marginTop: 2 }}>{f.desc}</div>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Validation errors */}
          {errors.length > 0 && (
            <div
              style={{
                marginTop: 16,
                display: "flex",
                alignItems: "flex-start",
                padding: "14px 16px",
                gap: 12,
                borderLeft: "3px solid var(--cds-support-error)",
                background: "var(--cds-red-10)",
              }}
            >
              <CarbonIcon name="warning" size={20} color="var(--cds-support-error)" />
              <div style={{ fontSize: 14, lineHeight: "18px", letterSpacing: "0.16px", color: "var(--cds-text-primary)" }}>
                <strong>Validation failed. </strong>
                <ul style={{ listStyle: "none", margin: "4px 0 0", padding: 0 }}>
                  {errors.map((err, i) => (
                    <li key={i}>&middot; {err.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Progress bar */}
          {progress && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, letterSpacing: "0.32px", color: "var(--cds-text-secondary)", marginBottom: 4 }}>Exporting...</div>
              <div style={{ height: 4, background: "var(--cds-layer-01)", overflow: "hidden" }}>
                <div style={{ height: "100%", background: "var(--cds-interactive)", animation: "exportProgress 1.2s cubic-bezier(0.2,0,0.38,0.9)" }} />
              </div>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <DialogFooter style={{ margin: 0, padding: 0, borderRadius: 0, border: "none", background: "transparent" }}>
          <div style={{ display: "flex", width: "100%" }}>
            <DialogClose
              render={
                <button
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--cds-button-secondary-hover)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--cds-button-secondary)";
                  }}
                  style={{
                    flex: 1,
                    height: 64,
                    padding: "0 16px",
                    background: "var(--cds-button-secondary)",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    letterSpacing: "0.16px",
                    textAlign: "left",
                  }}
                >
                  Cancel
                </button>
              }
            />
            <button
              onClick={handleExport}
              disabled={exporting}
              onMouseEnter={(e) => {
                if (!exporting) (e.currentTarget as HTMLElement).style.background = "var(--cds-button-primary-hover)";
              }}
              onMouseLeave={(e) => {
                if (!exporting) (e.currentTarget as HTMLElement).style.background = "var(--cds-button-primary)";
              }}
              style={{
                flex: 1,
                height: 64,
                padding: "0 64px 0 16px",
                background: exporting ? "var(--cds-button-disabled)" : "var(--cds-button-primary)",
                color: "#fff",
                border: "none",
                cursor: exporting ? "not-allowed" : "pointer",
                fontSize: 14,
                letterSpacing: "0.16px",
                textAlign: "left",
                position: "relative",
              }}
            >
              {exporting ? "Exporting..." : "Export"}
              <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)" }}>
                <CarbonIcon name="download" size={20} color="#fff" />
              </span>
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
