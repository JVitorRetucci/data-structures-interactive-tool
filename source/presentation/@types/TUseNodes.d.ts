import { Node } from "@/domain/entities/Node";
import { JSXElementConstructor } from "react";

interface Edge {
  [key: string]: unknown
}

export interface IUseNodesParams<T = undefined> {
  initialNodes: Node[];
}

export interface IUseNodesUtilities<T = undefined> {
  /* ===== PROPERTIES ===== */
  nodes: Node<T>[];
  edges: Edge[];
  Canvas: JSX.Element;

  /* ===== METHODS ===== */
  addNodeAtStart: (node: Node<T>) => void;
  addNodeAtPosition: (node: Node<T>) => void;
  addNodeAtEnd: (node: Node<T>) => void;
  
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