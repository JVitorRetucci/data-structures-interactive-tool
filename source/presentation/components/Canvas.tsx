import ReactFlow, {
  Background,
  BackgroundVariant, Controls, MarkerType, MiniMap, ReactFlowProps
} from "reactflow";

export interface ICanvasProps extends ReactFlowProps {}

export const Canvas = ({
  nodes,
  edges,
  nodeTypes,
  edgeTypes,
  onNodesChange,
  onEdgesChange,
  onConnect,
}: ICanvasProps): JSX.Element => {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitViewOptions={{ 
        padding: 4
      }}
      defaultEdgeOptions={{
        type: "default",
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      }}
    >
      <Background
        className="bg-editor"
        color="#ffffff22"
        variant={BackgroundVariant.Lines}
      />
      <MiniMap />
      <Controls showInteractive={false} />
      <Background />
    </ReactFlow>
  );
};
