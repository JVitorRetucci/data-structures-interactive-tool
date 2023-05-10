import {
  IUseNodesParams,
  IUseNodesUtilities,
  TUseNodes,
} from "@/presentation/@types/TUseNodes";
import { useCallback, useMemo } from "react";
import { addEdge, MarkerType, useEdgesState, useNodesState } from "reactflow";
import { Canvas } from "../components/Canvas";
import { DefaultEdge } from "@/presentation/components/DefaultEdge";
import { ListNode } from "@/presentation/components/ListNode";
import { ListManager } from "@/infra/positionManagers/ListManager";
import { LinkedList } from "@/domain/services/dataStructures/LinkedList";
import { Node } from "@/domain/entities/Node";

const positionManager = new ListManager({ padding: 60 });
const linkedList = new LinkedList({ positionManager });

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

  const setNodesByJSON = useCallback(
    (nodes: Array<Node<unknown>>): void => {
      linkedList.setNodesByJSON(nodes);

      const edges = linkedList.nodes.reduce((acc, current, index) => {
        if (!linkedList.nodes[index + 1]) return acc;
        const nextId = linkedList.nodes[index + 1].id ?? undefined;

        const edge = {
          id: `e${current.id}-${nextId}`,
          source: current.id,
          target: nextId,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#ff0070",
          },
          style: {
            strokeWidth: 2,
            stroke: "#FF0072",
          },
        };

        return [...acc, edge];
      }, []);

      setEdges(edges);

      setNodes(
        linkedList.nodes.map((item) => ({
          id: item.id,
          position: item.position,
          draggable: true,
          data: item.value,
          type: "listNode",
        }))
      );
    },
    [nodes, setNodes]
  );

  const addNodeAtEnd = useCallback(
    (newNodeParams) => {
      setNodes(() => {
        linkedList.addNodeAtEnd(newNodeParams);

        const updatedEdges = linkedList.nodes.reduce((acc, current, index) => {
          if (!linkedList.nodes[index + 1]) return acc;
          const nextId = linkedList.nodes[index + 1].id ?? undefined;

          const edge = {
            id: `e${current.id}-${nextId}`,
            source: current.id,
            target: nextId,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#ff0070",
            },
            style: {
              strokeWidth: 2,
              stroke: "#FF0072",
            },
          };

          return [...acc, edge];
        }, []);

        setEdges(updatedEdges);

        return linkedList.nodes.map((item) => ({
          id: item.id,
          position: item.position,
          draggable: true,
          data: item.value,
          type: "listNode",
        }));
      });
    },
    [setNodes, edges]
  );

  const addNodeAtPosition = (): void => {
    throw new Error("Not implemented yet");
  };

  const addNodeAtStart = useCallback(
    (newNodeParams) => {
      setNodes(() => {
        linkedList.addNodeAtStart(newNodeParams);

        const updatedEdges = linkedList.nodes.reduce((acc, current, index) => {
          if (!linkedList.nodes[index + 1]) return acc;
          const nextId = linkedList.nodes[index + 1].id ?? undefined;

          const edge = {
            id: `e${current.id}-${nextId}`,
            source: current.id,
            target: nextId,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#ff0070",
            },
            style: {
              strokeWidth: 2,
              stroke: "#FF0072",
            },
          };

          return [...acc, edge];
        }, []);

        setEdges(updatedEdges);

        return linkedList.nodes.map((item) => ({
          id: item.id,
          position: item.position,
          draggable: true,
          data: item.value,
          type: "listNode",
        }));
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

  const emphasisNodeByPosition = useCallback(
    (index: number): void => {
      const emphasized = nodes[index];
      emphasized.data.isActive = true;
      setNodes([...nodes.filter((_, idx) => idx !== index), emphasized]);
    },
    [setNodes, nodes]
  );

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
    setNodesByJSON,
  };
};
