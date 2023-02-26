import { JSXElementConstructor } from "react";

interface Node {
  [key: string]: unknown
}

interface Edge {
  [key: string]: unknown
}

export interface IUseNodesParams {
  initialNodes: Node[];
}

export interface IUseNodesUtilities {
  /* ===== PROPERTIES ===== */
  nodes: Node[];
  edges: Edge[];
  Canvas: JSX.Element;

  /* ===== METHODS ===== */
  addNodeAtStart: (node: Node) => void;
  addNodeAtPosition: (node: Node) => void;
  addNodeAtEnd: (node: Node) => void;
  
  removeNodeAtStart: () => void;
  removeNodeAtPosition: (index: number) => void;
  removeNodeAtEnd: () => void;
  
  getNodeAt: (index: number) => Node;
  getNodeByValue: (value: number | string) => Node;
  getNodeById: (id: string) => Node;
  
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

export type TUseNodes = (params: IUseNodesParams) => IUseNodesUtilities;