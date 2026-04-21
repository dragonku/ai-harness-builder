"use client";

import { templates } from "@/lib/templates";
import { useHarnessStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function TemplateGallery() {
  const loadHarness = useHarnessStore((s) => s.loadHarness);

  return (
    <div className="flex flex-col gap-3">
      {templates.map((template) => (
        <Card key={template.id} size="sm">
          <CardHeader>
            <CardTitle className="text-sm">{template.name}</CardTitle>
            <CardDescription className="text-xs">
              {template.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
              <span>에이전트 {template.agentCount}개</span>
              <span>페이즈 {template.phaseCount}개</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {template.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => loadHarness(template.create())}
            >
              이 템플릿 사용
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
