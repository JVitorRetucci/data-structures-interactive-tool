import { Node } from "@/domain/entities/Node";

interface Edge {
  [key: string]: unknown
}

export interface IUseNodesParams<T = undefined> {
  initialNodes: Array<Node<T>>;
}

export interface IUseNodesUtilities<T = undefined> {
  /* ===== PROPERTIES ===== */
  nodes: Array<Node<T>>;
  edges: Edge[];
  Canvas: JSX.Element;

  /* ===== METHODS ===== */
  addNodeAtStart: (value: string) => void;
  addNodeAtPosition: (node: Node<T>) => void;
  addNodeAtEnd: (value: string) => void;
  
  removeNodeAtStart: () => void;
  removeNodeAtPosition: (index: number) => void;
  removeNodeAtEnd: () => void;
  
  getNodeAt: (index: number) => Node<T>;
  getNodeByValue: (value: number | string) => Node<T>;
  getNodeById: (id: string) => Node<T>;
  
  getEdgeAt: (index: number) => Edge;
  getEdgeById: (id: string) => Edge;
  getEdgeByNodeId: (id: string) => Edge;
  
  emphasisNodeByPosition: (index: number) => void;
  emphasisNodeById: (id: string) => void;
  
  disableNodeByPosition: (index: number) => void;
  disableNodeById: (id: string) => void;
  
  emphasisEdgeAt: (index: number) => void;
  emphasisEdgeById: (id: string) => void;
  emphasisEdgeByNodeId: (id: string) => void;
}

export type TUseNodes<T = undefined> = (params: IUseNodesParams<T>) => IUseNodesUtilities<T>;