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
});
