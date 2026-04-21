import JSZip from "jszip";
import type { Harness } from "../types";
import { exportClaudeCode } from "./claude-code";
import { exportYAML } from "./yaml-export";
import { exportJSON } from "./json-export";

export type ExportFormat = "claude-code" | "yaml" | "json" | "all";

export async function exportAsZip(harness: Harness, format: ExportFormat): Promise<Blob> {
  const zip = new JSZip();
  if (format === "claude-code" || format === "all") {
    const files = exportClaudeCode(harness);
    for (const file of files) { zip.file(file.path, file.content); }
  }
  if (format === "yaml" || format === "all") { zip.file("harness.yaml", exportYAML(harness)); }
  if (format === "json" || format === "all") { zip.file("harness.json", exportJSON(harness)); }
  return zip.generateAsync({ type: "blob" });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
