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
import { Button } from "@/components/ui/button";

const formats: { value: ExportFormat; label: string; icon: string; color: string }[] = [
  { value: "claude-code", label: "Claude Code", icon: "{ }", color: "#0071e3" },
  { value: "yaml", label: "YAML", icon: "Y", color: "#34c759" },
  { value: "json", label: "JSON", icon: "J", color: "#af52de" },
  { value: "all", label: "모두 포함", icon: "*", color: "#ff9500" },
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
              padding: "6px 18px",
              borderRadius: 980,
              background: "var(--accent-apple)",
              color: "#fff",
              fontSize: 12,
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              transition: "opacity 0.15s ease",
            }}
            disabled={!harness}
          >
            내보내기
          </button>
        }
      />
      <DialogContent
        className=""
        style={{
          maxWidth: 420,
          borderRadius: 16,
          padding: 0,
          overflow: "hidden",
          animation: "fadeIn 0.2s ease",
        }}
      >
        <DialogHeader style={{ padding: "20px 20px 0" }}>
          <DialogTitle style={{ fontSize: 17, fontWeight: 600, color: "var(--fg-primary)" }}>
            하네스 내보내기
          </DialogTitle>
          <DialogDescription style={{ fontSize: 13, color: "var(--fg-tertiary)" }}>
            내보내기 형식을 선택하고 ZIP으로 다운로드합니다.
          </DialogDescription>
        </DialogHeader>

        <div style={{ padding: "16px 20px" }}>
          {/* Format cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {formats.map((f) => {
              const isSelected = format === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => setFormat(f.value)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: `1.5px solid ${isSelected ? f.color : "var(--border-subtle)"}`,
                    background: isSelected ? `${f.color}08` : "var(--bg-secondary)",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    textAlign: "left",
                  }}
                >
                  {/* Radio indicator */}
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      border: `2px solid ${isSelected ? f.color : "var(--border-default)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {isSelected && (
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: f.color,
                        }}
                      />
                    )}
                  </div>
                  {/* Icon in colored square */}
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      background: `${f.color}15`,
                      color: f.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      fontFamily: "var(--font-mono)",
                      flexShrink: 0,
                    }}
                  >
                    {f.icon}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "var(--fg-primary)" }}>
                    {f.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Validation errors */}
          {errors.length > 0 && (
            <div
              style={{
                marginTop: 12,
                padding: 12,
                borderRadius: 10,
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.15)",
              }}
            >
              <p style={{ fontSize: 12, fontWeight: 600, color: "#ef4444", marginBottom: 6 }}>
                검증 오류가 있습니다:
              </p>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {errors.map((err, i) => (
                  <li key={i} style={{ fontSize: 11, color: "#ef4444", marginBottom: 2 }}>
                    {err.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Progress bar */}
          {progress && (
            <div
              style={{
                marginTop: 12,
                height: 3,
                borderRadius: 2,
                background: "var(--border-subtle)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: "var(--accent-apple)",
                  borderRadius: 2,
                  animation: "exportProgress 1.5s ease forwards",
                }}
              />
            </div>
          )}
        </div>

        <DialogFooter style={{ padding: "12px 20px", display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <DialogClose
            render={
              <button
                style={{
                  padding: "8px 18px",
                  borderRadius: 980,
                  border: "1px solid var(--border-default)",
                  background: "transparent",
                  color: "var(--fg-secondary)",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                취소
              </button>
            }
          />
          <Button
            size="sm"
            onClick={handleExport}
            disabled={exporting}
            style={{
              padding: "8px 18px",
              borderRadius: 980,
              background: "var(--accent-apple)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 500,
              border: "none",
              cursor: exporting ? "not-allowed" : "pointer",
              opacity: exporting ? 0.6 : 1,
            }}
          >
            {exporting ? "내보내는 중..." : "내보내기"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
