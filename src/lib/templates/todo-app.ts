import { nanoid } from "nanoid";
import { createAgentNode, createSkill, createHarness } from "@/lib/types";
import type { Harness } from "@/lib/types";

export function createTodoAppTemplate(): Harness {
  const dbArchitect = createAgentNode({
    role: "db-architect",
    model: "opus",
    position: { x: 400, y: 50 },
    skills: [
      createSkill({
        name: "DB 스키마 설계",
        description: "Todo 앱의 데이터 모델과 데이터베이스 스키마를 설계합니다",
        prompt:
          "Todo 항목, 사용자, 카테고리 등의 엔티티를 정의하고 관계형 스키마를 설계하세요. 마이그레이션 파일도 작성하세요.",
      }),
    ],
    tools: ["Read", "Write", "Bash"],
  });

  const uiArchitect = createAgentNode({
    role: "ui-architect",
    model: "opus",
    position: { x: 400, y: 200 },
    skills: [
      createSkill({
        name: "UI 컴포넌트 설계",
        description: "Todo 앱의 UI 컴포넌트 구조와 상태 흐름을 설계합니다",
        prompt:
          "Todo 리스트, 필터, 입력 폼 등 컴포넌트를 설계하세요. 상태 관리 전략과 사용자 인터랙션 흐름을 정의하세요.",
      }),
    ],
    tools: ["Read", "Write", "Glob"],
  });

  const backendDev = createAgentNode({
    role: "backend-dev",
    model: "sonnet",
    position: { x: 400, y: 350 },
    skills: [
      createSkill({
        name: "API 개발",
        description: "Todo CRUD API와 비즈니스 로직을 구현합니다",
        prompt:
          "DB 스키마를 기반으로 Todo CRUD API를 구현하세요. 입력 검증, 에러 처리, 페이지네이션을 포함하세요.",
      }),
    ],
    tools: ["Read", "Edit", "Write", "Bash"],
  });

  const frontendDev = createAgentNode({
    role: "frontend-dev",
    model: "sonnet",
    position: { x: 400, y: 500 },
    skills: [
      createSkill({
        name: "프론트엔드 구현",
        description: "Todo 앱의 React 컴포넌트와 페이지를 구현합니다",
        prompt:
          "UI 설계를 기반으로 React 컴포넌트를 구현하세요. API 연동, 낙관적 업데이트, 로딩/에러 상태를 처리하세요.",
      }),
    ],
    tools: ["Read", "Edit", "Write", "Bash"],
  });

  const qaInspector = createAgentNode({
    role: "qa-inspector",
    model: "sonnet",
    position: { x: 400, y: 650 },
    skills: [
      createSkill({
        name: "Karpathy Loop QA",
        description:
          "반복적 테스트-수정 루프로 품질을 검증하고 결함을 수정합니다",
        prompt:
          "전체 기능을 테스트하고 결함을 발견하세요. 발견된 결함을 수정하고 재테스트하는 Karpathy Loop를 반복하세요.",
      }),
    ],
    tools: ["Read", "Bash", "Grep", "Edit"],
  });

  return createHarness({
    name: "Todo App 하네스",
    description: "순차 파이프라인 + Karpathy Loop QA",
    templateId: "todo-app",
    agents: [dbArchitect, uiArchitect, backendDev, frontendDev, qaInspector],
    edges: [
      {
        id: nanoid(),
        source: dbArchitect.id,
        target: uiArchitect.id,
        type: "sequential",
      },
      {
        id: nanoid(),
        source: uiArchitect.id,
        target: backendDev.id,
        type: "sequential",
      },
      {
        id: nanoid(),
        source: backendDev.id,
        target: frontendDev.id,
        type: "sequential",
      },
      {
        id: nanoid(),
        source: frontendDev.id,
        target: qaInspector.id,
        type: "sequential",
      },
    ],
  });
}
