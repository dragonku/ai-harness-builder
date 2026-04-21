"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AgentPalette } from "./AgentPalette";
import { TemplateGallery } from "./TemplateGallery";

export function Sidebar() {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <Tabs defaultValue="agents" className="flex h-full flex-col">
        <TabsList className="mx-3 mt-3">
          <TabsTrigger value="agents">에이전트</TabsTrigger>
          <TabsTrigger value="templates">템플릿</TabsTrigger>
        </TabsList>
        <TabsContent value="agents" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-3 pb-3">
            <AgentPalette />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="templates" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-3 pb-3">
            <TemplateGallery />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </aside>
  );
}
