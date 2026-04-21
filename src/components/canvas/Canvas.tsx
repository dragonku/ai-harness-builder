"use client";

import { useCallback, useMemo, type DragEvent } from "react";
import ReactFlow, {
  Background,
  Controls,
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
import { createAgentNode, type ModelType } from "@/lib/types";

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

  if (!harness) {
    return (
      <div className="flex h-full items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center">
          <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">
            하네스를 불러오거나 새로 만들어 주세요
          </p>
          <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
            툴바에서 &ldquo;새로 만들기&rdquo; 버튼을 클릭하거나 템플릿을
            선택하세요
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
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
        className="bg-zinc-50 dark:bg-zinc-950"
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
