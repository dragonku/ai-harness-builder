"use client";

import { useEffect, useCallback, useState } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Canvas } from "@/components/canvas/Canvas";
import { PropertiesPanel } from "@/components/properties/PropertiesPanel";
import { Toolbar } from "@/components/toolbar/Toolbar";
import { useHarnessStore } from "@/lib/store";
import { saveHarness } from "@/lib/db";

type CarbonTheme = "white" | "g90" | "g100";

export default function Home() {
  const [theme, setTheme] = useState<CarbonTheme>("white");
  const harness = useHarnessStore((s) => s.harness);
  const selectedNodeId = useHarnessStore((s) => s.selectedNodeId);
  const removeAgent = useHarnessStore((s) => s.removeAgent);

  // Initialize theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cds-theme") as CarbonTheme | null;
    if (saved && (saved === "white" || saved === "g90" || saved === "g100")) {
      setTheme(saved);
      document.documentElement.setAttribute("data-carbon-theme", saved);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: CarbonTheme = prev === "white" ? "g100" : "white";
      document.documentElement.setAttribute("data-carbon-theme", next);
      localStorage.setItem("cds-theme", next);
      return next;
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Delete selected node
      if (e.key === "Delete" || e.key === "Backspace") {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        if (selectedNodeId) {
          e.preventDefault();
          removeAgent(selectedNodeId);
        }
      }

      // Cmd+S = save
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (harness) {
          saveHarness(harness).catch(() => {});
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedNodeId, removeAgent, harness]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "var(--cds-background)", color: "var(--cds-text-primary)" }}>
      <Toolbar theme={theme} onToggleTheme={toggleTheme} />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar />
        <main style={{ flex: 1, position: "relative" }}>
          <Canvas />
        </main>
        <PropertiesPanel />
      </div>
    </div>
  );
}
