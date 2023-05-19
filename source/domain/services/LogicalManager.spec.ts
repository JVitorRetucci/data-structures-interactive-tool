import { LogicalManager } from "./LogicalManager";
import { PositionManager } from "./PositionManager";
import { mockDeep, MockProxy } from "jest-mock-extended";
import { Node } from "../entities/Node";
import Position from "../entities/Position";
import { left, right } from "@/core/Either";

describe("LogicalManager", () => {
  let logicalManager: LogicalManager;
  let positionManager: MockProxy<PositionManager>;
  const initialNode = new Node<string>({
    id: "0",
    value: "newNode",
    position: { x: 200, y: 100 },
    connectedNodesIds: [],
  });

  beforeAll(() => {});
  beforeEach(() => {
    positionManager = mockDeep<PositionManager>();
    logicalManager = new LogicalManager({
      initialNodes: [initialNode],
      positionManager,
    });
  });
  afterEach(() => {});
  afterAll(() => {});

  it("should have correct initial value", () => {
    expect(logicalManager.nodes).toHaveLength(1);
    expect(logicalManager.getTargetNode("0")).toEqual(initialNode);
  });

  it("should update target node", () => {
    initialNode.updateValue("updated value");
    logicalManager.setTargetNode(initialNode);

    expect(logicalManager.nodes).toHaveLength(1);
    expect(logicalManager.getTargetNode("0")?.value).toBe("updated value");
  });

  it("should update nodes positions", () => {
    const nodes = Array.from({ length: 5 }, (_, index) => {
      return new Node<string>({
        id: index.toString(),
        position: new Position(0, 0),
        value: `my_value ${index}`,
        connectedNodesIds: [],
      });
    });

    positionManager.updatePositions.mockReturnValue(
      right({
        "0": new Position(0, 0),
        "1": new Position(1, 0),
        "2": new Position(2, 0),
        "3": new Position(3, 0),
        "4": new Position(4, 0),
      })
    );

    logicalManager.nodes = nodes;
    logicalManager.updatePositions();

    expect(logicalManager.nodes).toHaveLength(5);
    expect(logicalManager.nodes.map((node) => node.position)).toStrictEqual([
      new Position(0, 0),
      new Position(1, 0),
      new Position(2, 0),
      new Position(3, 0),
      new Position(4, 0),
    ]);
  });

  it("should return left when updating nodes positions", () => {
    const nodes = Array.from({ length: 5 }, (_, index) => {
      return new Node<string>({
        id: index.toString(),
        position: new Position(0, 0),
        value: `my_value ${index}`,
        connectedNodesIds: [],
      });
    });

    positionManager.updatePositions.mockReturnValue(
      left(new Error("Error updating positions."))
    );

    logicalManager.nodes = nodes;

    expect(logicalManager.nodes).toHaveLength(5);
    expect(() => logicalManager.updatePositions()).toThrow(
      "Error updating positions."
    );
  });

  it("should update target positions", () => {
    const nodes = Array.from({ length: 5 }, (_, index) => {
      return new Node<string>({
        id: index.toString(),
        position: new Position(0, 0),
        value: `my_value ${index}`,
        connectedNodesIds: [],
      });
    });

    positionManager.updateTargetPosition.mockReturnValue(
      right({
        "0": new Position(0, 0),
        "1": new Position(5, 0),
        "2": new Position(2, 0),
        "3": new Position(3, 0),
        "4": new Position(4, 0),
      })
    );

    logicalManager.nodes = nodes;
    logicalManager.updateTargetPosition(
      logicalManager.getTargetNode(nodes[1]) as Node
    );

    expect(positionManager.updateTargetPosition).toHaveBeenCalledWith(
      logicalManager.nodes,
      logicalManager.nodes[1].id
    );
    expect(logicalManager.nodes).toHaveLength(5);
    expect(logicalManager.nodes.map((node) => node.position)).toEqual([
      new Position(0, 0),
      new Position(5, 0),
      new Position(2, 0),
      new Position(3, 0),
      new Position(4, 0),
    ]);
  });

  it("should return left when updating target node position", () => {
    const newManager = new LogicalManager({
      positionManager,
    });
    const nodes = Array.from({ length: 5 }, (_, index) => {
      return new Node<string>({
        id: index.toString(),
        position: new Position(0, 0),
        value: `my_value ${index}`,
        connectedNodesIds: [],
      });
    });

    positionManager.updateTargetPosition.mockReturnValue(
      left(new Error("Error updating positions."))
    );

    newManager.nodes = nodes;

    expect(newManager.nodes).toHaveLength(5);
    expect(() => newManager.updateTargetPosition(newManager.nodes[1])).toThrow(
      "Error updating positions."
    );
  });
});
