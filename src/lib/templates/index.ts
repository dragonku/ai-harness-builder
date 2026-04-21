import type { Harness } from "../types";
import { createFullStackTemplate } from "./full-stack";
import { createTodoAppTemplate } from "./todo-app";
import { createCxStrategyTemplate } from "./cx-strategy";

export interface TemplateInfo {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly agentCount: number;
  readonly phaseCount: number;
  readonly tags: readonly string[];
  readonly create: () => Harness;
}

export const templates: readonly TemplateInfo[] = [
  {
    id: "full-stack",
    name: "Full-Stack App 하네스",
    description: "UI 설계 → 병렬 프론트/백엔드 구현 → QA 검증",
    agentCount: 4,
    phaseCount: 5,
    tags: ["web", "full-stack", "parallel"],
    create: createFullStackTemplate,
  },
  {
    id: "todo-app",
    name: "Todo App 하네스",
    description: "순차 파이프라인 + Karpathy Loop QA",
    agentCount: 5,
    phaseCount: 8,
    tags: ["web", "sequential", "tdd"],
    create: createTodoAppTemplate,
  },
  {
    id: "cx-strategy",
    name: "CX 제안 전략 하네스",
    description: "Fan-out/Fan-in 병렬 조사 → 전략 수립 → 제안서",
    agentCount: 8,
    phaseCount: 9,
    tags: ["business", "parallel", "fan-out"],
    create: createCxStrategyTemplate,
  },
];
