import { LogicalManager } from "./LogicalManager";
import { PositionManager } from "./PositionManager";
import { mockDeep, MockProxy } from "jest-mock-extended";
import { Node } from "../entities/Node";

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
      positionManager: positionManager,
    });
  });
  afterEach(() => {});
  afterAll(() => {});

  it("has correct initial value", () => {
    expect(logicalManager.nodes).toHaveLength(1);
    expect(logicalManager.getTargetNode("0")).toEqual(initialNode);
  });
});
