import { Node } from "@/domain/entities/Node";
import Position from "@/domain/entities/Position";
import { LogicalManager } from "@/domain/services/LogicalManager";
import { PositionManager } from "@/domain/services/PositionManager";
import generateRandomId from "@/utils/generateRandomId";

interface T {
  value: string;
  nextNodeId: string;
}

export interface LinkedListParams<T> {
  positionManager: PositionManager;
  initialNodes?: Array<Node<T>>;
}

export class LinkedList {
  private readonly _logicalManager: LogicalManager;
  constructor({ positionManager, initialNodes }: LinkedListParams<T>) {
    const initials = !initialNodes ? [] : initialNodes;

    this._logicalManager = new LogicalManager({
      positionManager,
      initialNodes: [new Node<T>({
        id: generateRandomId(),
        position: new Position(0,0),
        value: {
          value: "HEAD",
          nextNodeId: !initials[0] ? '' : initials[0].id,
        },
        connectedNodesIds: [],
      }) , ...initials],
    });
  }

  get nodes(): Array<Node<T>> {
    return this._logicalManager.nodes as Array<Node<T>>;
  }

  public addNodeAtStart(value: string): Array<Node<T>> {
    const newNodes = [
      this.nodes[0],
      new Node<T>({
        id: generateRandomId(),
        position: new Position(0, 0),
        value: {
          value: value,
          nextNodeId: this.nodes.at(1)?.id ?? ''
        },
        connectedNodesIds: [this.nodes.at(1)?.id as string],
      }),
      ...this.nodes.filter((_, index) => index !== 0),
    ];

    this.updateNodes(newNodes);
    return this.nodes;
  }

  public addNodeAtEnd(value: string): Array<Node<T>> {
    const newId = generateRandomId();

    this.nodes.at(-1)?.updateValue({ value: this.nodes.at(-1)?.value.value as string, nextNodeId: newId });
    this.nodes.at(-1)?.updateConnectedNodesIds([newId]);

    const newNodes = [
      ...this.nodes,
      new Node<T>({
        id: newId,
        position: new Position(0, 0),
        value: {
          value: value,
          nextNodeId: 'TAIL'
        },
        connectedNodesIds: [],
      }),
    ];

    this.updateNodes(newNodes);
    return this.nodes;
  }

  private updateNodes(nodes: Array<Node<T>>): void {
    this._logicalManager.nodes = nodes;
    this._logicalManager.updatePositions();
  }
}
