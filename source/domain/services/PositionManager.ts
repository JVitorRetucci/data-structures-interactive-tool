import { TEither } from "@/core/Either";
import { TApplicationError } from "@/core/Errors";
import { Node as NodeEntity } from "@/domain/entities/Node";
import Position from "../entities/Position";

type Node = NodeEntity<unknown>; // Node.data type is not important here.
type NodeId = string;

export abstract class PositionManager {
  abstract updatePositions(
    nodes: Node[]
  ): TEither<TApplicationError, Record<NodeId, Position>>;

  abstract updateTargetPosition(
    node: Node
  ): TEither<TApplicationError, Record<NodeId, Position>>;
  // abstract getPositions(nodes: Node[]): TEither<TApplicationError, Record<NodeId, Position>>;
  // abstract getTargetPosition(node: Node): TEither<TApplicationError, Record<NodeId, Position>>;
}
