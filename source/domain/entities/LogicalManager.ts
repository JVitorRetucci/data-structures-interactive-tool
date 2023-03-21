import { Node } from "@/domain/entities/Node";
import { PositionManager } from "@/domain/entities/PositionManager";

export interface ILogicalManagerConstructorParams {
  initialNodes: Node[],
  positionManager: PositionManager;
}

export class LogicalManager {
  initialNodes: Node<unknown>[];
  positionManager: PositionManager;

  constructor ({initialNodes, positionManager}: ILogicalManagerConstructorParams) {
    this.initialNodes = initialNodes;
    this.positionManager = positionManager;
  }
}