import { TEither, left, right } from "@/core/Either";
import { NotFoundError, TApplicationError } from "@/core/Errors";
import { Node as NodeEntity } from "@/domain/entities/Node";
import Position from "@/domain/entities/Position";
import { PositionManager } from "@/domain/services/PositionManager";

type Node = NodeEntity<unknown>; // Node.data type is not important here.
type NodeId = string;

export interface ListManagerParams {
  padding: number;
}

const DEFAULT_CONFIG: ListManagerParams = {
  padding: 0,
} as const;

export class ListManager implements PositionManager {
  private readonly _padding: number;

  constructor({ padding }: ListManagerParams = {...DEFAULT_CONFIG}) {
    this._padding = padding;
  }

  updatePositions(
    nodes: Node[]
  ): TEither<TApplicationError, Record<NodeId, Position>> {
    let sum: number = this._padding;

    const positions = nodes.reduce((acc, current, index) => {
      const prev = nodes[index - 1];

      if (!prev)
        return {
          [current.id]: new Position(sum, this._padding),
        };

      sum += 200;

      return {
        ...acc,
        [current.id]: new Position(sum, this._padding),
      };
    }, {});

    return right(positions);
  }

  updateTargetPosition(
    nodes: Node[],
    targetId: string
  ): TEither<TApplicationError, Record<NodeId, Position>> {
    const targetIndex = nodes.findIndex((node) => node.id === targetId);
    if (targetIndex === -1)
      return left(new NotFoundError(new Error("Node not found")));

    const positions = nodes.reduce((acc, current, index) => {
      if (index < targetIndex) return acc;

      if (!index)
        return {
          [current.id]: new Position(this._padding, this._padding),
        };

      const lastNodePosition: Position = acc[nodes[index-1].id] ?? nodes[index - 1].position;

      return {
        ...acc,
        [current.id]: new Position(lastNodePosition.x + 200, this._padding),
      };
    }, {});

    return right(positions);
  }
}
