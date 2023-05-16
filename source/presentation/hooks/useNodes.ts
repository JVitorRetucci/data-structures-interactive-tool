import {
  IUseNodesParams,
  IUseNodesUtilities,
  TUseNodes,
} from "@/presentation/@types/TUseNodes";
import { useCallback, useMemo } from "react";
import {
  addEdge,
  Edge,
  MarkerType,
  useEdgesState,
  useNodesState,
} from "reactflow";
import { Canvas } from "../components/Canvas";
import { DefaultEdge } from "@/presentation/components/DefaultEdge";
import { ListNode } from "@/presentation/components/ListNode";
import { ListManager } from "@/infra/positionManagers/ListManager";
import { ILinkedListValue, LinkedList } from "@/domain/services/dataStructures/LinkedList";
import { Node } from "@/domain/entities/Node";
import { TEither, left, right } from "@/core/Either";
import { TApplicationError } from "@/core/Errors";

enum MarkerColors {
  GREEN = "#0DFA83",
  PINK = "#FF79C5",
  PURPLE = "#BF93F6",
  RED = "#FF555A",
  CYAN = "#7BE9FB",
  ORANGE = "#FFB873",
  YELLOW = "#F1FA94",
};

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
      linkedList.setNodesByJSON(nodes as Array<Node<ILinkedListValue>>);

      setEdges(updateEdges());

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

        setEdges(updateEdges());

        return linkedList.nodes.map((item, index) => ({
          id: item.id,
          position: item.position,
          draggable: true,
          data: {
            ...item.value,
            isActive: index === linkedList.nodes.length - 1,
          },
          type: "listNode",
        }));
      });
    },
    [setNodes, edges]
  );

  const addNodeAtPosition = useCallback(
    (value: string, index: number): TEither<TApplicationError, void> => {
      try {
        linkedList.addNodeAtPosition(value, index);

        setNodes(() => {
          setEdges(updateEdges());

          return linkedList.nodes.map((item, idx) => ({
            id: item.id,
            position: item.position,
            draggable: true,
            data: { ...item.value, isActive: index + 1 === idx },
            type: "listNode",
          }));
        });
      } catch (error) {
        return left(error);
      }

      return right(undefined);
    },
    [setNodes, nodes, edges]
  );

  const addNodeAtStart = useCallback(
    (newNodeParams) => {
      setNodes(() => {
        linkedList.addNodeAtStart(newNodeParams);

        setEdges(updateEdges());

        return linkedList.nodes.map((item, index) => ({
          id: item.id,
          position: item.position,
          draggable: true,
          data: { ...item.value, isActive: index === 1 },
          type: "listNode",
        }));
      });
    },
    [setNodes, edges]
  );

  const removeNodeAtStart = useCallback((): void => {
    setNodes(() => {
      linkedList.removeNodeAtStart();

      setEdges(updateEdges());

      return linkedList.nodes.map((item) => ({
        id: item.id,
        position: item.position,
        draggable: true,
        data: item.value,
        type: "listNode",
      }));
    });
  }, [setNodes, nodes, edges]);

  const removeNodeAtPosition = useCallback(
    (index: number): TEither<TApplicationError, void> => {
      try {
        linkedList.removeNodeAtPosition(index);
        setNodes(() => {
          setEdges(updateEdges());

          return linkedList.nodes.map((item) => ({
            id: item.id,
            position: item.position,
            draggable: true,
            data: item.value,
            type: "listNode",
          }));
        });
        return right(undefined);
      } catch (error) {
        return left(error);
      }
    },
    [setNodes, nodes, edges]
  );

  const removeNodeAtEnd = useCallback((): void => {
    setNodes(() => {
      linkedList.removeNodeAtEnd();

      setEdges(updateEdges());

      return linkedList.nodes.map((item) => ({
        id: item.id,
        position: item.position,
        draggable: true,
        data: item.value,
        type: "listNode",
      }));
    });
  }, [setNodes, nodes, edges]);

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
      setNodes((list) => {
        return [
          ...list.map((node, idx) => ({
            id: node.id,
            position: node.position,
            draggable: true,
            data: { ...node.data, isActive: index === idx },
            type: "listNode",
          })),
        ];
      });
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

  const emphasisEdgeById = useCallback(
    (id: string): void => {
      setEdges((list) => {
        return [
          ...list.map((edge) => ({
            ...edge,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: edge.id === id ? MarkerColors.GREEN : MarkerColors.RED,
            },
            style: {
              strokeWidth: 2,
              stroke: edge.id === id ? MarkerColors.GREEN : MarkerColors.RED,
            },
          })),
        ];
      });
    },
    [setEdges, edges]
  );

  const emphasisEdgeByNodeId = (): void => {
    throw new Error("Not implemented yet");
  };

  const updateEdges = (): Edge[] => {
    return linkedList.nodes.reduce((acc, current, index) => {
      if (!linkedList.nodes[index + 1]) return acc;
      const nextId = current.value.nextNodeId ?? undefined;

      const edge = {
        id: `e${current.id}-${nextId}`,
        source: current.id,
        target: nextId,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: MarkerColors.RED,
        },
        style: {
          strokeWidth: 2,
          stroke: MarkerColors.RED,
        },
      };

      return [...acc, edge];
    }, []);
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
