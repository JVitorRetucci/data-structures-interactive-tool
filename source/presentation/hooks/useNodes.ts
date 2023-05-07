import {
  IUseNodesParams,
  IUseNodesUtilities,
  TUseNodes,
} from "@/presentation/@types/TUseNodes";
import { useCallback, useMemo } from "react";
import {
  addEdge,
  MarkerType,
  Node,
  useEdgesState,
  useNodesState,
} from "reactflow";
import { Canvas } from "../components/Canvas";
import { DefaultEdge } from "../components/DefaultEdge";
import { ListNode, ListNodeProps } from "../components/ListNode";
import generateRandomId from "@/utils/generateRandomId";
import { ListManager } from "@/infra/positionManagers/ListManager";
import { LinkedList } from "@/infra/dataStructures/LinkedList";

const positionManager = new ListManager({ padding: 60 });
const ll = new LinkedList({ positionManager });

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
      setNodes(() => {
        ll.addNodeAtEnd(newNodeParams);

        const updatedEdges = ll.nodes.reduce((acc, current, index) => {
          if (!ll.nodes[index+1]) return acc;
          const nextId = ll.nodes[index + 1].id ?? undefined;

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

        return ll.nodes.map((item) => ({
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
        ll.addNodeAtStart(newNodeParams);

        const updatedEdges = ll.nodes.reduce((acc, current, index) => {
          if (!ll.nodes[index+1]) return acc;
          const nextId = ll.nodes[index + 1].id ?? undefined;

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

        return ll.nodes.map((item) => ({
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
