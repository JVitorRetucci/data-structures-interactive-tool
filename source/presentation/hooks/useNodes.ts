import {
  IUseNodesParams,
  IUseNodesUtilities,
  TUseNodes,
} from "@/presentation/@types/TUseNodes";
import { useCallback, useMemo } from "react";
import { addEdge, Node, useEdgesState, useNodesState } from "reactflow";
import { Canvas } from "../components/Canvas";
import { DefaultEdge } from "../components/DefaultEdge";
import { ListNode, ListNodeProps } from "../components/ListNode";

export const useNodes: TUseNodes = ({
  initialNodes = [],
}: IUseNodesParams): IUseNodesUtilities => {
  // =================================================================

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const nodeTypes = useMemo(() => ({ listNode: ListNode }), []);
  const edgeTypes = useMemo(() => ({ default: DefaultEdge }), []);

  // =================================================================

  const addNodeAtEnd = useCallback(
    (newNodeParams) => {
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
          // draggable: false,
          data: {
            value: newNodeParams.value,
            nextNodeId: newNodeParams.nextNodeId,
            prevNodeId: newNodeParams.prevNodeId,
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
    },
    [setNodes, edges]
  );

  const addNodeAtPosition = () => {
    throw new Error("Not implemented yet");
  };

  const addNodeAtStart = useCallback(
    (newNodeParams) => {
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
        const { position: firstPosition, id: firstId } = nodes[0] as Node<ListNodeProps>;

        const newNode: Node<ListNodeProps> = {
          id: `${nodes.length + 1}`,
          width: 100,
          position: {
            x: firstPosition.x - 250,
            y: firstPosition.y,
          },
          draggable: false,
          data: {
            value: newNodeParams.value,
            nextNodeId: newNodeParams.nextNodeId,
            prevNodeId: newNodeParams.prevNodeId,
          },
          type: "listNode",
        };
        setEdges([
          ...addEdge(
            {
              id: `e${firstId}-${newNode.id}`,
              source: newNode.id,
              target: firstId,
            },
            edges
          ),
        ]);

        return [newNode, ...nodes];
      });
    },
    [setNodes, edges]
  );

  const removeNodeAtStart = () => {
    throw new Error("Not implemented yet");
  };

  const removeNodeAtPosition = () => {
    throw new Error("Not implemented yet");
  };

  const removeNodeAtEnd = () => {
    throw new Error("Not implemented yet");
  };

  const getNodeAt = () => {
    throw new Error("Not implemented yet");
  };

  const getNodeByValue = () => {
    throw new Error("Not implemented yet");
  };

  const getNodeById = () => {
    throw new Error("Not implemented yet");
  };

  const getEdgeAt = () => {
    throw new Error("Not implemented yet");
  };

  const getEdgeById = () => {
    throw new Error("Not implemented yet");
  };

  const getEdgeByNodeId = () => {
    throw new Error("Not implemented yet");
  };

  const emphasisNodeByPosition = () => {
    throw new Error("Not implemented yet");
  };

  const emphasisNodeById = () => {
    throw new Error("Not implemented yet");
  };

  const disableNodeByPosition = () => {
    throw new Error("Not implemented yet");
  };

  const disableNodeById = () => {
    throw new Error("Not implemented yet");
  };

  const emphasisEdgeAt = () => {
    throw new Error("Not implemented yet");
  };

  const emphasisEdgeById = () => {
    throw new Error("Not implemented yet");
  };

  const emphasisEdgeByNodeId = () => {
    throw new Error("Not implemented yet");
  };

  return {
    Canvas: Canvas({
      nodes,
      edges,
      nodeTypes,
      edgeTypes,
      onNodesChange,
      onEdgesChange,
      onConnect,
    }),
    nodes,
    edges,

    addNodeAtStart,
    addNodeAtPosition,
    addNodeAtEnd,
    removeNodeAtStart,
    removeNodeAtPosition,
    removeNodeAtEnd,
    getNodeAt,
    getNodeByValue,
    getNodeById,
    getEdgeAt,
    getEdgeById,
    getEdgeByNodeId,
    emphasisNodeByPosition,
    emphasisNodeById,
    disableNodeByPosition,
    disableNodeById,
    emphasisEdgeAt,
    emphasisEdgeById,
    emphasisEdgeByNodeId,
  };
};
