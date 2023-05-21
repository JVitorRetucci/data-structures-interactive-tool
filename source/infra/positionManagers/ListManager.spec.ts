import { Node } from "@/domain/entities/Node";
import { ListManager } from "./ListManager";
import generateRandomId from "@/utils/generateRandomId";
import Position from "@/domain/entities/Position";

describe("ListManager", () => {
  it("should create ListManager successfully", () => {
    const manager1 = new ListManager({ padding: 40 });
    expect(manager1).toBeInstanceOf(ListManager);
    const manager2 = new ListManager();
    expect(manager2).toBeInstanceOf(ListManager);
  });

  it("should set first position according to padding", () => {
    const manager = new ListManager({ padding: 40 });
    const idList = Array.from({ length: 5 }, () => generateRandomId());
    const nodes = idList.map(
      (id: string, index: number, ids: string[]) =>
        new Node({
          id,
          position: new Position(0, 0),
          value: undefined,
          connectedNodesIds: [!ids[index + 1] ? "" : ids[index + 1]],
        })
    );

    const {value: positions} = manager.updatePositions(nodes);

    expect(positions[idList[0]].x).toBe(40);
    expect(positions[idList[0]].y).toBe(40);
  });

  it("should set nodes positions successfully", () => {
    const manager = new ListManager({ padding: 40 });
    const idList = Array.from({ length: 5 }, () => generateRandomId());
    const nodes = idList.map(
      (id: string, index: number, ids: string[]) =>
        new Node({
          id,
          position: new Position(0, 0),
          value: undefined,
          connectedNodesIds: [!ids[index + 1] ? "" : ids[index + 1]],
        })
    );

    const {value: positions} = manager.updatePositions(nodes);

    expect(positions).toStrictEqual({
      [idList[0]]: new Position(40, 40),
      [idList[1]]: new Position(240, 40),
      [idList[2]]: new Position(440, 40),
      [idList[3]]: new Position(640, 40),
      [idList[4]]: new Position(840, 40),
    });
  });

  it("should return right when updating target node's position successfully", () => {
    const manager = new ListManager({ padding: 40 });
    const idList = Array.from({ length: 5 }, () => generateRandomId());
    const nodes = idList.map(
      (id: string, index: number, ids: string[]) =>
        new Node({
          id,
          position: new Position(0, 0),
          value: undefined,
          connectedNodesIds: [!ids[index + 1] ? "" : ids[index + 1]],
        })
    );

    const response = manager.updateTargetPosition(nodes, idList[2]);
      
    expect(response.isRight()).toBeTruthy();
    expect(response.value).toStrictEqual({
      // [idList[0]]: new Position(0, 0),
      // [idList[1]]: new Position(0, 0),
      [idList[2]]: new Position(200, 40),
      [idList[3]]: new Position(400, 40),
      [idList[4]]: new Position(600, 40),
    });
  });

  it("should return left when target is not found", () => {
    const manager = new ListManager({ padding: 40 });
    const idList = Array.from({ length: 5 }, () => generateRandomId());
    const nodes = idList.map(
      (id: string, index: number, ids: string[]) =>
        new Node({
          id,
          position: new Position(0, 0),
          value: undefined,
          connectedNodesIds: [!ids[index + 1] ? "" : ids[index + 1]],
        })
    );

    const response = manager.updateTargetPosition(nodes, "#lorem_id");
      
    expect(response.isLeft()).toBeTruthy();
  });
});
