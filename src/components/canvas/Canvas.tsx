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
import { CarbonIcon } from "@/components/icons/CarbonIcon";
import { MODEL_META } from "@/lib/model-colors";

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
    loadHarness(createHarness({ name: "Untitled harness" }));
  }, [loadHarness]);

  const handleFromTemplate = useCallback(() => {
    const first = templates[0];
    if (first) {
      loadHarness(first.create());
    }
  }, [loadHarness]);

  // Empty state
  if (!harness) {
    return (
      <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "var(--cds-background)", height: "100%" }}>
        {/* Dot grid background */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.6 }}>
          <defs>
            <pattern id="dotgrid-empty" width={16} height={16} patternUnits="userSpaceOnUse">
              <circle cx={8} cy={8} r={1} fill="var(--cds-border-subtle-00)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotgrid-empty)" />
        </svg>
        {/* Empty state card */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 480, background: "var(--cds-layer-01)", border: "1px solid var(--cds-border-subtle-00)", padding: 32 }}>
            <CarbonIcon name="workflow" size={20} color="var(--cds-icon-secondary)" style={{ marginBottom: 16 }} />
            <h2 style={{
              fontSize: "var(--cds-heading-04-size)",
              lineHeight: "var(--cds-heading-04-lh)",
              fontWeight: 400,
              color: "var(--cds-text-primary)",
              marginBottom: 8,
            }}>
              Create an AI harness
            </h2>
            <p style={{ fontSize: 14, lineHeight: "18px", letterSpacing: "0.16px", color: "var(--cds-text-secondary)", marginBottom: 24 }}>
              Start from a template, or drag agents from the palette to compose a new pipeline.
            </p>
            <div style={{ display: "flex", gap: 1 }}>
              <button
                onClick={handleFromTemplate}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--cds-button-primary-hover)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--cds-button-primary)";
                }}
                style={{
                  flex: 1,
                  height: 48,
                  padding: "0 64px 0 16px",
                  background: "var(--cds-button-primary)",
                  color: "#fff",
                  border: "none",
                  fontSize: 14,
                  letterSpacing: "0.16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                Use template
                <span style={{ position: "absolute", right: 16 }}>
                  <CarbonIcon name="template" size={20} color="#fff" />
                </span>
              </button>
              <button
                onClick={handleNewBlank}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--cds-button-secondary-hover)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--cds-button-secondary)";
                }}
                style={{
                  flex: 1,
                  height: 48,
                  padding: "0 64px 0 16px",
                  background: "var(--cds-button-secondary)",
                  color: "#fff",
                  border: "none",
                  fontSize: 14,
                  letterSpacing: "0.16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                Start blank
                <span style={{ position: "absolute", right: 16 }}>
                  <CarbonIcon name="add" size={20} color="#fff" />
                </span>
              </button>
            </div>
          </div>
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
        style={{ background: "var(--cds-background)" }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="var(--cds-border-subtle-00)" />
        <Controls showInteractive={false} />
        <MiniMap
          style={{ width: 160, height: 100 }}
          nodeColor={(node) => {
            const model = node.data?.model as keyof typeof MODEL_META | undefined;
            if (model && MODEL_META[model]) {
              return MODEL_META[model].dotColor;
            }
            return "var(--cds-interactive)";
          }}
          maskColor="var(--cds-background)"
        />
      </ReactFlow>
    </div>
  );
}
