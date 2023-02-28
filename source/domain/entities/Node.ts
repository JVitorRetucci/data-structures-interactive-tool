import Position from "@/domain/entities/Position";

export class Node<T = string> {
  id: string;
  position: Position;
  value: T;
}