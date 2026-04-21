import { nanoid } from "nanoid";
import { createAgentNode, createSkill, createHarness } from "@/lib/types";
import type { Harness } from "@/lib/types";

export function createCxStrategyTemplate(): Harness {
  const rfpAnalyst = createAgentNode({
    role: "rfp-analyst",
    model: "opus",
    position: { x: 400, y: 50 },
    skills: [
      createSkill({
        name: "RFP 분석",
        description: "고객 RFP를 분석하여 핵심 요구사항과 평가 기준을 추출합니다",
        prompt:
          "RFP 문서를 분석하여 핵심 요구사항, 평가 기준, 제출 조건, 일정을 정리하세요. 숨겨진 요구사항도 파악하세요.",
      }),
    ],
    tools: ["Read", "Grep", "Glob"],
  });

  const marketResearcher = createAgentNode({
    role: "market-researcher",
    model: "sonnet",
    position: { x: 100, y: 250 },
    skills: [
      createSkill({
        name: "시장 조사",
        description: "타겟 시장의 트렌드, 규모, 성장률을 조사합니다",
        prompt:
          "해당 산업의 시장 규모, 성장 트렌드, 주요 동인을 조사하세요. 고객사에 영향을 미치는 외부 환경 요인도 분석하세요.",
      }),
    ],
    tools: ["Read", "Grep"],
  });

  const cxBenchmarker = createAgentNode({
    role: "cx-benchmarker",
    model: "sonnet",
    position: { x: 400, y: 250 },
    skills: [
      createSkill({
        name: "CX 벤치마킹",
        description: "업계 CX 모범 사례와 벤치마크를 수집하고 분석합니다",
        prompt:
          "동종 업계의 CX 우수 사례를 수집하고, NPS/CSAT 벤치마크를 비교 분석하세요. 적용 가능한 인사이트를 도출하세요.",
      }),
    ],
    tools: ["Read", "Grep"],
  });

  const competitorAnalyst = createAgentNode({
    role: "competitor-analyst",
    model: "sonnet",
    position: { x: 700, y: 250 },
    skills: [
      createSkill({
        name: "경쟁사 분석",
        description: "주요 경쟁사의 CX 전략과 차별화 포인트를 분석합니다",
        prompt:
          "주요 경쟁사의 CX 전략, 채널 운영, 기술 활용 현황을 분석하세요. 차별화 기회와 위협 요인을 식별하세요.",
      }),
    ],
    tools: ["Read", "Grep"],
  });

  const cxInterpreter = createAgentNode({
    role: "cx-interpreter",
    model: "sonnet",
    position: { x: 400, y: 450 },
    skills: [
      createSkill({
        name: "조사 결과 종합",
        description:
          "병렬 조사 결과를 종합하여 핵심 인사이트와 기회 영역을 도출합니다",
        prompt:
          "시장 조사, CX 벤치마크, 경쟁사 분석 결과를 종합하세요. 교차 분석으로 핵심 인사이트와 전략 기회를 도출하세요.",
      }),
    ],
    tools: ["Read", "Grep", "Glob"],
  });

  const personaInterviewer = createAgentNode({
    role: "persona-interviewer",
    model: "sonnet",
    position: { x: 400, y: 600 },
    skills: [
      createSkill({
        name: "페르소나 인터뷰",
        description:
          "고객 페르소나를 정의하고 가상 인터뷰로 니즈를 검증합니다",
        prompt:
          "타겟 고객 페르소나를 3-5개 정의하고, 각 페르소나의 Pain Point, JTBD, 기대 경험을 심층 분석하세요.",
      }),
    ],
    tools: ["Read", "Write"],
  });

  const cxStrategist = createAgentNode({
    role: "cx-strategist",
    model: "opus",
    position: { x: 400, y: 750 },
    skills: [
      createSkill({
        name: "CX 전략 수립",
        description: "종합 분석을 기반으로 CX 혁신 전략과 로드맵을 수립합니다",
        prompt:
          "인사이트와 페르소나 분석을 기반으로 CX 비전, 핵심 전략, 실행 로드맵, KPI를 수립하세요. 단계별 우선순위를 설정하세요.",
      }),
    ],
    tools: ["Read", "Write", "Glob"],
  });

  const proposalComposer = createAgentNode({
    role: "proposal-composer",
    model: "opus",
    position: { x: 400, y: 900 },
    skills: [
      createSkill({
        name: "제안서 작성",
        description: "CX 전략을 기반으로 고객 맞춤형 제안서를 작성합니다",
        prompt:
          "CX 전략을 제안서 형태로 구성하세요. 요약, 현황 분석, 전략 제안, 기대 효과, 투자 비용, 일정을 포함하세요.",
      }),
    ],
    tools: ["Read", "Write"],
  });

  return createHarness({
    name: "CX 제안 전략 하네스",
    description: "Fan-out/Fan-in 병렬 조사 → 전략 수립 → 제안서",
    templateId: "cx-strategy",
    agents: [
      rfpAnalyst,
      marketResearcher,
      cxBenchmarker,
      competitorAnalyst,
      cxInterpreter,
      personaInterviewer,
      cxStrategist,
      proposalComposer,
    ],
    edges: [
      // Fan-out: rfp-analyst → 3 parallel research agents
      {
        id: nanoid(),
        source: rfpAnalyst.id,
        target: marketResearcher.id,
        type: "parallel",
      },
      {
        id: nanoid(),
        source: rfpAnalyst.id,
        target: cxBenchmarker.id,
        type: "parallel",
      },
      {
        id: nanoid(),
        source: rfpAnalyst.id,
        target: competitorAnalyst.id,
        type: "parallel",
      },
      // Fan-in: 3 research agents → cx-interpreter
      {
        id: nanoid(),
        source: marketResearcher.id,
        target: cxInterpreter.id,
        type: "sequential",
      },
      {
        id: nanoid(),
        source: cxBenchmarker.id,
        target: cxInterpreter.id,
        type: "sequential",
      },
      {
        id: nanoid(),
        source: competitorAnalyst.id,
        target: cxInterpreter.id,
        type: "sequential",
      },
      // Sequential: interpreter → persona → strategist → composer
      {
        id: nanoid(),
        source: cxInterpreter.id,
        target: personaInterviewer.id,
        type: "sequential",
      },
      {
        id: nanoid(),
        source: personaInterviewer.id,
        target: cxStrategist.id,
        type: "sequential",
      },
      {
        id: nanoid(),
        source: cxStrategist.id,
        target: proposalComposer.id,
        type: "sequential",
      },
    ],
  });
}
