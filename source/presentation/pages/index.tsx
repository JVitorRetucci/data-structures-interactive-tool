import { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  BackgroundVariant,
  Controls, MarkerType, MiniMap, Node, ReactFlowInstance, useEdgesState,
  useNodesState
} from "reactflow";
import "reactflow/dist/style.css";
import DefaultEdge from "../components/DefaultEdge";
import { ListNode, ListNodeProps } from "../components/ListNode";

const initialNodes: Node<ListNodeProps>[] = [];

const initialEdges = [];

export default function Home(): JSX.Element {
  const [reactFlow, setInstance] = useState<ReactFlowInstance>();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  const onClick = useCallback(() => {
    setNodes((nodes) => {
      if (!nodes.length) {
        return [
          {
            id: `${nodes.length + 1}`,
            position: { x: 0, y: 0 },
            draggable: false,
            data: { value: 4, nextNodeId: 0, prevNodeId: 0 },
            type: "listNode",
          },
        ];
      }
      const {
        position: lastPosition,
        width: width = 0,
        id: lastId,
      } = nodes.at(-1) as Node<ListNodeProps>;
      const newNode: Node<ListNodeProps> = {
        id: `${nodes.length + 1}`,
        position: {
          x: lastPosition.x + (width ?? 0) + 50,
          y: lastPosition.y,
        },
        draggable: false,
        data: {
          value: nodes.length % 2 === 0 ? 121212 : 4,
          nextNodeId: 0,
          prevNodeId: 1,
        },
        type: "listNode",
      };
      setEdges([
        ...addEdge(
          {
            id: `e${lastId}-${newNode.id}`,
            source: lastId,
            target: newNode.id,
          },
          edges
        ),
      ]);

      return [...nodes, newNode];
    });
  }, [setNodes, reactFlow, edges]);

  const nodeTypes = useMemo(() => ({ listNode: ListNode }), []);
  const edgeTypes = useMemo(() => ({ default: DefaultEdge }), []);

  useEffect(() => {
    reactFlow?.setViewport({ x: 0, y: 0, zoom: 1.2 }, { duration: 200 });
  }, [reactFlow?.viewportInitialized]);

  return (
    <div className="relative h-screen flex justify-center items-center">
      <div className="bg-gradient-to-b from-slate-700 to-slate-800 px-6 py-4 fixed z-10 bottom-8 min-w-[22.5rem] grid gap-4 grid-flow-col justify-around rounded-md drop-shadow-md">
        <button
          className="bg-gray-500 hover:bg-gradient-to-br from-gray-400 to-gray-500 p-2 rounded text-white w-fit active:brightness-50"
          onClick={onClick}
        >
          Adicionar nó
        </button>
        <button
          className="bg-gray-500 hover:bg-gradient-to-br from-gray-400 to-gray-500 p-2 rounded text-white w-fit"
          onClick={onClick}
        >
          Adicionar nó
        </button>
      </div>
      <main className="h-full w-full bg-white">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          defaultEdgeOptions={{
            type: "default",
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
          }}
          onInit={(instance) => {
            setInstance(instance);
          }}
        >
          <Background className="bg-zinc-800" color="#ffffff22" variant={BackgroundVariant.Lines} />
          <MiniMap />
          <Controls showInteractive={false} />
          <Background />
        </ReactFlow>
      </main>
    </div>
  );
}
