"use client";

import { useCallback, useMemo, type DragEvent } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from "reactflow";
import "reactflow/dist/style.css";
import { AgentNode } from "./AgentNode";
import { OrchestratorEdge } from "./OrchestratorEdge";
import { useHarnessStore } from "@/lib/store";
import { createAgentNode, createHarness, type ModelType } from "@/lib/types";
import { templates } from "@/lib/templates";

const nodeTypes = { agent: AgentNode };
const edgeTypes = { orchestrator: OrchestratorEdge };

const defaultAgentModels: Record<string, ModelType> = {
  planner: "opus",
  architect: "opus",
  executor: "sonnet",
  reviewer: "sonnet",
  tester: "sonnet",
  designer: "sonnet",
  writer: "haiku",
  debugger: "sonnet",
};

export function Canvas() {
  const harness = useHarnessStore((s) => s.harness);
  const selectNode = useHarnessStore((s) => s.selectNode);
  const addAgent = useHarnessStore((s) => s.addAgent);
  const addEdgeToStore = useHarnessStore((s) => s.addEdge);
  const updateAgent = useHarnessStore((s) => s.updateAgent);
  const loadHarness = useHarnessStore((s) => s.loadHarness);

  const flowNodes: Node[] = useMemo(
    () =>
      (harness?.agents ?? []).map((agent) => ({
        id: agent.id,
        type: "agent",
        position: agent.position,
        data: {
          role: agent.role,
          model: agent.model,
          skillCount: agent.skills.length,
          toolCount: agent.tools.length,
          skillNames: agent.skills.map((s) => s.name).filter(Boolean),
        },
      })),
    [harness?.agents],
  );

  const flowEdges: Edge[] = useMemo(
    () =>
      (harness?.edges ?? []).map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: "orchestrator",
        data: {
          edgeType: edge.type,
          condition: edge.condition,
        },
      })),
    [harness?.edges],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);

  // Sync store -> local state when harness changes
  useMemo(() => {
    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [flowNodes, flowEdges, setNodes, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      addEdgeToStore({
        source: connection.source,
        target: connection.target,
        type: "sequential",
      });
      setEdges((eds) => addEdge(connection, eds));
    },
    [addEdgeToStore, setEdges],
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      selectNode(node.id);
    },
    [selectNode],
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  const onNodeDragStop: NodeMouseHandler = useCallback(
    (_event, node) => {
      updateAgent(node.id, {
        position: { x: node.position.x, y: node.position.y },
      });
    },
    [updateAgent],
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      const role = event.dataTransfer.getData("application/harness-agent-role");
      if (!role) return;

      const reactFlowBounds = (
        event.target as HTMLElement
      ).closest(".react-flow")?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const agent = createAgentNode({
        role,
        position,
        model: defaultAgentModels[role] ?? "sonnet",
      });

      addAgent(agent);
    },
    [addAgent],
  );

  const handleNewBlank = useCallback(() => {
    loadHarness(createHarness({ name: "새 하네스" }));
  }, [loadHarness]);

  const handleFromTemplate = useCallback(() => {
    const first = templates[0];
    if (first) {
      loadHarness(first.create());
    }
  }, [loadHarness]);

  if (!harness) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          background: "var(--bg-secondary)",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: "var(--accent-apple)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="4" stroke="#fff" strokeWidth="1.5"/>
            <circle cx="8.5" cy="9" r="1.5" fill="#fff"/>
            <circle cx="15.5" cy="9" r="1.5" fill="#fff"/>
            <path d="M8 15c1.5 1.5 6.5 1.5 8 0" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <p
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: "var(--fg-primary)",
            letterSpacing: "-0.02em",
          }}
        >
          AI 하네스를 만들어 보세요
        </p>
        <p style={{ fontSize: 14, color: "var(--fg-tertiary)", marginTop: -8 }}>
          에이전트를 배치하고 워크플로우를 설계합니다
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button
            onClick={handleFromTemplate}
            style={{
              padding: "8px 20px",
              borderRadius: 980,
              background: "var(--accent-apple)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
            }}
          >
            템플릿에서 시작
          </button>
          <button
            onClick={handleNewBlank}
            style={{
              padding: "8px 20px",
              borderRadius: 980,
              background: "transparent",
              color: "var(--fg-accent)",
              fontSize: 13,
              fontWeight: 500,
              border: "1px solid var(--border-default)",
              cursor: "pointer",
            }}
          >
            빈 캔버스에서 시작
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onNodeDragStop={onNodeDragStop}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        style={{ background: "var(--bg-secondary)" }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="var(--fg-tertiary)" style={{ opacity: 0.4 }} />
        <Controls showInteractive={false} />
        <MiniMap
          style={{ width: 120, height: 80 }}
          nodeColor={() => "var(--accent-apple)"}
          maskColor="var(--bg-secondary)"
        />
      </ReactFlow>
    </div>
  );
}
