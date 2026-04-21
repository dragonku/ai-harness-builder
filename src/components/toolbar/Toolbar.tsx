"use client";

import { useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useHarnessStore } from "@/lib/store";
import { createHarness } from "@/lib/types";
import { saveHarness } from "@/lib/db";
import { parseImport, type ImportResult } from "@/lib/import/parser";
import { ExportDialog } from "@/components/export/ExportDialog";

export function Toolbar() {
  const harness = useHarnessStore((s) => s.harness);
  const loadHarness = useHarnessStore((s) => s.loadHarness);
  const updateHarnessName = useHarnessStore((s) => s.updateHarnessName);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      // Reset input so same file can be loaded again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [loadHarness],
  );

  return (
    <header className="flex h-12 items-center gap-2 border-b border-zinc-200 bg-white px-4 dark:border-zinc-700 dark:bg-zinc-900">
      <h1 className="mr-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">
        AI 하네스 빌더
      </h1>

      <Separator orientation="vertical" className="h-6" />

      <Button size="sm" variant="outline" onClick={handleNew}>
        새로 만들기
      </Button>

      {harness && (
        <>
          <Input
            value={harness.name}
            onChange={(e) => updateHarnessName(e.target.value)}
            className="h-7 w-48 text-sm"
            placeholder="하네스 이름"
          />

          <Button size="sm" variant="outline" onClick={handleSave}>
            저장
          </Button>

          <Button size="sm" variant="outline" onClick={handleLoadClick}>
            불러오기
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".yaml,.yml,.json"
            className="hidden"
            onChange={handleFileChange}
          />

          <Separator orientation="vertical" className="h-6" />

          <ExportDialog />
        </>
      )}

      {!harness && (
        <>
          <Button size="sm" variant="outline" onClick={handleLoadClick}>
            불러오기
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".yaml,.yml,.json"
            className="hidden"
            onChange={handleFileChange}
          />
        </>
      )}
    </header>
  );
}
