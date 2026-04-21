"use client";

import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createSkill, type Skill } from "@/lib/types";

interface SkillEditorProps {
  readonly skills: readonly Skill[];
  readonly onChange: (skills: readonly Skill[]) => void;
}

export function SkillEditor({ skills, onChange }: SkillEditorProps) {
  const handleAdd = useCallback(() => {
    const newSkill = createSkill({
      name: "",
      description: "",
      prompt: "",
    });
    onChange([...skills, newSkill]);
  }, [skills, onChange]);

  const handleUpdate = useCallback(
    (id: string, field: keyof Omit<Skill, "id">, value: string) => {
      onChange(
        skills.map((skill) =>
          skill.id === id ? { ...skill, [field]: value } : skill,
        ),
      );
    },
    [skills, onChange],
  );

  const handleRemove = useCallback(
    (id: string) => {
      onChange(skills.filter((skill) => skill.id !== id));
    },
    [skills, onChange],
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">스킬</Label>
        <Button size="sm" variant="outline" onClick={handleAdd}>
          + 추가
        </Button>
      </div>

      {skills.length === 0 && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          스킬이 없습니다
        </p>
      )}

      {skills.map((skill, index) => (
        <div key={skill.id} className="flex flex-col gap-2">
          {index > 0 && <Separator />}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">
              스킬 {index + 1}
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs text-red-500 hover:text-red-700"
              onClick={() => handleRemove(skill.id)}
            >
              삭제
            </Button>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">이름</Label>
            <Input
              value={skill.name}
              onChange={(e) => handleUpdate(skill.id, "name", e.target.value)}
              placeholder="스킬 이름"
              className="h-7 text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">설명</Label>
            <Input
              value={skill.description}
              onChange={(e) =>
                handleUpdate(skill.id, "description", e.target.value)
              }
              placeholder="스킬 설명"
              className="h-7 text-xs"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">프롬프트</Label>
            <Textarea
              value={skill.prompt}
              onChange={(e) => handleUpdate(skill.id, "prompt", e.target.value)}
              placeholder="스킬 프롬프트..."
              rows={3}
              className="text-xs"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
