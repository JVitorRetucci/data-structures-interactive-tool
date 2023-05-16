import { ValidationError } from "@/core/Errors";
import { Node } from "@/domain/entities/Node";
import Position from "@/domain/entities/Position";
import { LogicalManager } from "@/domain/services/LogicalManager";
import { PositionManager } from "@/domain/services/PositionManager";
import generateRandomId from "@/utils/generateRandomId";

export interface ILinkedListValue {
  value: string;
  nextNodeId: string;
}

export interface LinkedListParams<T> {
  positionManager: PositionManager;
  initialNodes?: Array<Node<T>>;
}

export class LinkedList {
  private readonly _logicalManager: LogicalManager;
  constructor({ positionManager, initialNodes }: LinkedListParams<ILinkedListValue>) {
    const initials = !initialNodes ? [] : initialNodes;

    this._logicalManager = new LogicalManager({
      positionManager,
      initialNodes: [
        new Node<ILinkedListValue>({
          id: generateRandomId(),
          position: new Position(0, 0),
          value: {
            value: "HEAD",
            nextNodeId: !initials[0] ? "" : initials[0].id,
          },
          connectedNodesIds: [],
        }),
        ...initials,
      ],
    });
  }

  get nodes(): Array<Node<ILinkedListValue>> {
    return this._logicalManager.nodes as Array<Node<ILinkedListValue>>;
  }

  public removeNodeAtStart(): Array<Node<ILinkedListValue>> {
    const newNodes = this.nodes.slice(2);
    const updatedHead = new Node<ILinkedListValue>({
      ...this.nodes[0],
      value: {
        value: "HEAD",
        nextNodeId: !newNodes[0] ? "TAIL" : newNodes[0].id,
      },
      connectedNodesIds: [!newNodes[0] ? "TAIL" : newNodes[0].id],
    });

    this.updateNodes([updatedHead, ...newNodes]);
    return this.nodes;
  }

  public addNodeAtStart(value: string): Array<Node<ILinkedListValue>> {
    const newId = generateRandomId();

    const newHead = new Node({
      ...this.nodes[0],
      value: {
        value: "HEAD",
        nextNodeId: newId,
      },
    });

    const newNodes = [
      newHead,
      new Node<ILinkedListValue>({
        id: newId,
        position: new Position(0, 0),
        value: {
          value: value,
          nextNodeId: this.nodes.at(1)?.id ?? "TAIL",
        },
        connectedNodesIds: [this.nodes.at(1)?.id as string],
      }),
      ...this.nodes.filter((_, index) => index !== 0),
    ];

    this.updateNodes(newNodes);
    return this.nodes;
  }

  public removeNodeAtEnd(): Array<Node<ILinkedListValue>> {
    if(this.nodes.length < 2) {
      const head = this.nodes[0];
      this.updateNodes([ new Node<ILinkedListValue>({
        ...head,
        value: {
          ...head.value,
          nextNodeId: "TAIL",
        },
        connectedNodesIds: [],
      })]);
      return this.nodes;
    }

    const newNodes = this.nodes.slice(0, -2);
    const oldTail = this.nodes[this.nodes.length - 2];
    const newTail = new Node<ILinkedListValue>({
      ...oldTail,
      value: {
        ...oldTail.value,
        nextNodeId: "TAIL",
      },
      connectedNodesIds: [],
    });

    this.updateNodes([...newNodes, newTail]);
    return this.nodes;
  }

  public addNodeAtEnd(value: string): Array<Node<ILinkedListValue>> {
    const newId = generateRandomId();

    this.nodes.at(-1)?.updateValue({
      value: this.nodes.at(-1)?.value.value as string,
      nextNodeId: newId,
    });
    this.nodes.at(-1)?.updateConnectedNodesIds([newId]);

    const newNodes = [
      ...this.nodes,
      new Node<ILinkedListValue>({
        id: newId,
        position: new Position(0, 0),
        value: {
          value: value,
          nextNodeId: "TAIL",
        },
        connectedNodesIds: [],
      }),
    ];

    this.updateNodes(newNodes);
    return this.nodes;
  }

  public removeNodeAtPosition(index: number): Array<Node<ILinkedListValue>> {
    if (!this.nodes[index])
      throw new ValidationError([
        { parameter: "index", error: "Invalid index" },
      ]);

    const removedNode = this.nodes[index];

    const firstHalf = this.nodes.slice(0, index);
    const lastHalf = this.nodes.slice(index + 1);

    firstHalf[firstHalf.length - 1].value.nextNodeId = removedNode.value.nextNodeId;
    firstHalf[firstHalf.length - 1].connectedNodesIds = [removedNode.value.nextNodeId];

    const newNodes = [...firstHalf, ...lastHalf];

    this.updateNodes(newNodes);
    return this.nodes;
  }

  public addNodeAtPosition(value: string, index: number): Array<Node<ILinkedListValue>> {
    if (!this.nodes[index])
      throw new ValidationError([
        { parameter: "index", error: "Invalid index" },
      ]);

    const newNode = new Node({
      id: generateRandomId(),
      position: new Position(0, 0),
      value: {
        value,
        nextNodeId: this.nodes[index].value.nextNodeId,
      },
      connectedNodesIds: [this.nodes[index].value.nextNodeId],
    });

    const firstHalf = this.nodes.slice(0, index + 1);
    const lastHalf = this.nodes.slice(index + 1);

    firstHalf[firstHalf.length - 1].value.nextNodeId = newNode.id;
    firstHalf[firstHalf.length - 1].connectedNodesIds = [newNode.id];

    const newNodes = [...firstHalf, newNode, ...lastHalf];

    this.updateNodes(newNodes);
    return this.nodes;
  }

  setNodesByJSON(nodes: Array<Node<ILinkedListValue>>): void {
    const newNodes = nodes.map((node, index) => {
      const next = nodes.find((nxt) => node.connectedNodesIds.includes(nxt.id));

      return new Node<ILinkedListValue>({
        id: node.id ?? generateRandomId(),
        position: new Position(0, 0),
        value: {
          value: node.value.value,
          nextNodeId:
            next?.id ?? index + 1 !== nodes.length
              ? nodes[index + 1].id
              : "TAIL",
        },
        connectedNodesIds: !next?.id ? [] : [next?.id],
      });
    });

    this.updateNodes([
      new Node<ILinkedListValue>({
        id: generateRandomId(),
        position: new Position(0, 0),
        value: {
          value: "HEAD",
          nextNodeId: newNodes[0].id,
        },
        connectedNodesIds: [],
      }),
      ...newNodes,
    ]);
  }

  private updateNodes(nodes: Array<Node<ILinkedListValue>>): void {
    this._logicalManager.nodes = nodes;
    this._logicalManager.updatePositions();
  }
}
