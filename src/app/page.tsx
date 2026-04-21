"use client";

import { useEffect, useCallback, useState } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Canvas } from "@/components/canvas/Canvas";
import { PropertiesPanel } from "@/components/properties/PropertiesPanel";
import { Toolbar } from "@/components/toolbar/Toolbar";
import { useHarnessStore } from "@/lib/store";
import { saveHarness } from "@/lib/db";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const harness = useHarnessStore((s) => s.harness);
  const selectedNodeId = useHarnessStore((s) => s.selectedNodeId);
  const removeAgent = useHarnessStore((s) => s.removeAgent);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("harness-dark-mode");
    if (saved === "true") {
      setDarkMode(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
      localStorage.setItem("harness-dark-mode", String(next));
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
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "var(--bg-primary)" }}>
      <Toolbar darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
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
