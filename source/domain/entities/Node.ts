import Position from "@/domain/entities/Position";

export class Node<T = string> {
  position: Position;
  value: T;
}