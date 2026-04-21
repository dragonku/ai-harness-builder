import { nanoid } from "nanoid";
import { createAgentNode, createSkill, createHarness } from "@/lib/types";
import type { Harness } from "@/lib/types";

export function createFullStackTemplate(): Harness {
  const uiArchitect = createAgentNode({
    role: "ui-architect",
    model: "opus",
    position: { x: 400, y: 50 },
    skills: [
      createSkill({
        name: "UI 설계",
        description: "사용자 요구사항을 분석하여 UI 와이어프레임과 컴포넌트 구조를 설계합니다",
        prompt:
          "주어진 요구사항을 분석하고 UI 와이어프레임, 컴포넌트 트리, 페이지 구조를 설계하세요. 반응형 레이아웃과 접근성을 고려하세요.",
      }),
    ],
    tools: ["Read", "Glob", "Grep", "Write"],
  });

  const frontendBuilder = createAgentNode({
    role: "frontend-builder",
    model: "sonnet",
    position: { x: 200, y: 250 },
    skills: [
      createSkill({
        name: "프론트엔드 구현",
        description: "UI 설계를 기반으로 React 컴포넌트와 페이지를 구현합니다",
        prompt:
          "UI 설계 문서를 참고하여 React 컴포넌트, 상태 관리, 라우팅을 구현하세요. TypeScript 타입 안전성과 테스트를 포함하세요.",
      }),
    ],
    tools: ["Read", "Edit", "Write", "Bash"],
  });

  const backendBuilder = createAgentNode({
    role: "backend-builder",
    model: "sonnet",
    position: { x: 600, y: 250 },
    skills: [
      createSkill({
        name: "백엔드 구현",
        description: "API 엔드포인트, 데이터 모델, 비즈니스 로직을 구현합니다",
        prompt:
          "REST API 엔드포인트, 데이터베이스 스키마, 인증/인가 로직을 구현하세요. 입력 검증과 에러 처리를 철저히 하세요.",
      }),
    ],
    tools: ["Read", "Edit", "Write", "Bash"],
  });

  const integrationQa = createAgentNode({
    role: "integration-qa",
    model: "sonnet",
    position: { x: 400, y: 450 },
    skills: [
      createSkill({
        name: "통합 QA",
        description: "프론트엔드와 백엔드의 통합 테스트를 수행하고 품질을 검증합니다",
        prompt:
          "프론트엔드-백엔드 통합을 검증하세요. API 호출, 데이터 흐름, 에러 시나리오를 테스트하고 결함을 보고하세요.",
      }),
    ],
    tools: ["Read", "Bash", "Grep"],
  });

  return createHarness({
    name: "Full-Stack App 하네스",
    description: "UI 설계 → 병렬 프론트/백엔드 구현 → QA 검증",
    templateId: "full-stack",
    agents: [uiArchitect, frontendBuilder, backendBuilder, integrationQa],
    edges: [
      {
        id: nanoid(),
        source: uiArchitect.id,
        target: frontendBuilder.id,
        type: "parallel",
      },
      {
        id: nanoid(),
        source: uiArchitect.id,
        target: backendBuilder.id,
        type: "parallel",
      },
      {
        id: nanoid(),
        source: frontendBuilder.id,
        target: integrationQa.id,
        type: "sequential",
      },
      {
        id: nanoid(),
        source: backendBuilder.id,
        target: integrationQa.id,
        type: "sequential",
      },
    ],
  });
}
