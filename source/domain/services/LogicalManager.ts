import { Node as NodeEntity } from "@/domain/entities/Node";
import { PositionManager } from "@/domain/services/PositionManager";

type Node = NodeEntity<unknown>; // Node.data type is not important here.

export interface ILogicalManagerConstructorParams {
  initialNodes?: Node[];
  positionManager: PositionManager;
}

export class LogicalManager {
  private _nodes: Node[];
  private readonly _positionManager: PositionManager;

  constructor({
    positionManager,
    initialNodes = [],
  }: ILogicalManagerConstructorParams) {
    this._nodes = initialNodes;
    this._positionManager = positionManager;
  }

  public get nodes(): Node[] {
    return this._nodes;
  }

  public set nodes(nodes: Node[]) {
    this._nodes = nodes;
  }

  setTargetNode(node: Node): void {
    this.nodes = this.nodes.reduce((acc, value, index) => {
      if (value.id === node.id) {
        acc[index] = node;
      }
      return acc;
    }, this.nodes);
  }

  getTargetNode(value: Node | string): Node | undefined {
    const nodeId = typeof value === "string" ? value : value.id;

    return this.nodes.find((_node) => _node.id === nodeId);
  }

  updatePositions(): void {
    const result = this._positionManager.updatePositions(this.nodes);
    if (result.isLeft()) throw result.value;

    this.nodes = this.nodes.map((_node) => {
      _node.position = result.value[_node.id];
      return _node;
    });
  }

  updateTargetPosition(node: Node): void {
    const result = this._positionManager.updateTargetPosition(node);
    if (result.isLeft()) throw result.value;

    const targetNode = this.nodes.find(
      (_node) => _node.id in result.value
    ) as Node;
    targetNode.position = result.value[targetNode.id];
    this.setTargetNode(targetNode);
  }

  // getPositions() {
  //   // TODO: Implement getPositions() method;
  //   this._positionManager.getPositions(this.nodes);
  //   throw new Error("Method not implemented");
  // }

  // getTargetPosition(node: Node): Position {
  //   // TODO: Implement getTargetPosition() method;
  //   this._positionManager.getTargetPosition(node);
  //   throw new Error("Method not implemented");
  // }
}
