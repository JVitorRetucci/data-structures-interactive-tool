import Position from "@/domain/entities/Position";

export interface INodeConstructorParams<T> {
  id: string;
  position: Position;
  value: T;
  connectedNodesIds: string[];
}

export class Node<T = string> {
  id: string;
  position: Position;
  value: T;
  connectedNodesIds: string[];

  constructor({
    id, position, value, connectedNodesIds = []
  }: INodeConstructorParams<T>){
    this.id = id;
    this.position = position;
    this.value = value;
    this.connectedNodesIds = connectedNodesIds
  }
}