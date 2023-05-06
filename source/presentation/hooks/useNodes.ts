import {
  IUseNodesParams,
  IUseNodesUtilities,
  TUseNodes,
} from "@/presentation/@types/TUseNodes";
import { useCallback, useMemo } from "react";
import { addEdge, MarkerType, Node, useEdgesState, useNodesState } from "reactflow";
import { Canvas } from "../components/Canvas";
import { DefaultEdge } from "../components/DefaultEdge";
import { ListNode, ListNodeProps } from "../components/ListNode";
import generateRandomId from "@/utils/generateRandomId";

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
              id: `#${generateRandomId()}`,
              position: { x: 0, y: 0 },
              draggable: false,
              data: { value: 4, nextNodeId: 0 },
              type: "listNode",
            },
          ];
        }

        const {
          position: lastPosition,
          width = 0,
          id: lastId,
        } = nodes.at(-1) as Node<ListNodeProps>;

        const newNode: Node<ListNodeProps> = {
          id: `#${generateRandomId()}`,
          position: {
            x: lastPosition.x + (width ?? 0) + 50,
            y: lastPosition.y,
          },
          draggable: false,
          data: {
            value: newNodeParams.value,
            nextNodeId: newNodeParams.nextNodeId,
          },
          type: "listNode",
        };
        setEdges([
          ...addEdge(
            {
              id: `e${lastId}-${newNode.id}`,
              source: lastId,
              target: newNode.id,
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#ff0070'
              },
              style:{
                strokeWidth: 2,
                stroke: '#FF0072',
              }
            },
            edges
          ),
        ]);

        return [...nodes, newNode];
      });
    },
    [setNodes, edges]
  );

  const addNodeAtPosition = (): void => {
    throw new Error("Not implemented yet");
  };

  const addNodeAtStart = useCallback(
    (newNodeParams) => {
      setNodes((nodes) => {
        if (!nodes.length) {
          return [
            {
              id: `#${generateRandomId()}`,
              position: { x: 0, y: 0 },
              draggable: false,
              data: { value: 4, nextNodeId: 0 },
              type: "listNode",
            },
          ];
        }
        const { position: firstPosition, id: firstId } = nodes[0] as Node<ListNodeProps>;

        const newNode: Node<ListNodeProps> = {
          id: `#${generateRandomId()}`,
          position: {
            x: firstPosition.x - 150,
            y: firstPosition.y,
          },
          draggable: false,
          data: {
            value: newNodeParams.value,
            nextNodeId: newNodeParams.nextNodeId,
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

  const removeNodeAtStart = (): void => {
    throw new Error("Not implemented yet");
  };

  const removeNodeAtPosition = (): void => {
    throw new Error("Not implemented yet");
  };

  const removeNodeAtEnd = (): void => {
    throw new Error("Not implemented yet");
  };

  const getNodeAt = (): void => {
    throw new Error("Not implemented yet");
  };

  const getNodeByValue = (): void => {
    throw new Error("Not implemented yet");
  };

  const getNodeById = (): void => {
    throw new Error("Not implemented yet");
  };

  const getEdgeAt = (): void => {
    throw new Error("Not implemented yet");
  };

  const getEdgeById = (): void => {
    throw new Error("Not implemented yet");
  };

  const getEdgeByNodeId = (): void => {
    throw new Error("Not implemented yet");
  };

  const emphasisNodeByPosition = (): void => {
    throw new Error("Not implemented yet");
  };

  const emphasisNodeById = (): void => {
    throw new Error("Not implemented yet");
  };

  const disableNodeByPosition = (): void => {
    throw new Error("Not implemented yet");
  };

  const disableNodeById = (): void => {
    throw new Error("Not implemented yet");
  };

  const emphasisEdgeAt = (): void => {
    throw new Error("Not implemented yet");
  };

  const emphasisEdgeById = () => {
    throw new Error("Not implemented yet");
  };

  const emphasisEdgeByNodeId = (): void => {
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
