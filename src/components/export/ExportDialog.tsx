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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useHarnessStore } from "@/lib/store";
import { validateHarness, type ValidationError } from "@/lib/validation";
import {
  exportAsZip,
  downloadBlob,
  type ExportFormat,
} from "@/lib/export/zip";

export function ExportDialog() {
  const harness = useHarnessStore((s) => s.harness);
  const [format, setFormat] = useState<ExportFormat>("claude-code");
  const [errors, setErrors] = useState<readonly ValidationError[]>([]);
  const [exporting, setExporting] = useState(false);

  const handleExport = useCallback(async () => {
    if (!harness) return;

    const validationErrors = validateHarness(harness);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setExporting(true);
    try {
      const blob = await exportAsZip(harness, format);
      const filename = `${harness.name.replace(/\s+/g, "-")}-${format}.zip`;
      downloadBlob(blob, filename);
    } finally {
      setExporting(false);
    }
  }, [harness, format]);

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button size="sm" variant="outline" disabled={!harness}>
            내보내기
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>하네스 내보내기</DialogTitle>
          <DialogDescription>
            내보내기 형식을 선택하고 ZIP으로 다운로드합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-1.5">
            <Label className="text-sm">형식</Label>
            <Select
              value={format}
              onValueChange={(v) => setFormat(v as ExportFormat)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="claude-code">
                  Claude Code (AGENTS.md + skills/)
                </SelectItem>
                <SelectItem value="yaml">YAML</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="all">모두 포함</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {errors.length > 0 && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950">
              <p className="mb-1 text-sm font-medium text-red-800 dark:text-red-200">
                검증 오류가 있습니다:
              </p>
              <ul className="list-inside list-disc text-xs text-red-700 dark:text-red-300">
                {errors.map((err, i) => (
                  <li key={i}>{err.message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose
            render={
              <Button variant="outline" size="sm">
                취소
              </Button>
            }
          />
          <Button size="sm" onClick={handleExport} disabled={exporting}>
            {exporting ? "내보내는 중..." : "내보내기"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
