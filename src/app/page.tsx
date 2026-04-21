"use client";

import { Sidebar } from "@/components/sidebar/Sidebar";
import { Canvas } from "@/components/canvas/Canvas";
import { PropertiesPanel } from "@/components/properties/PropertiesPanel";
import { Toolbar } from "@/components/toolbar/Toolbar";

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1">
          <Canvas />
        </main>
        <PropertiesPanel />
      </div>
    </div>
  );
}
