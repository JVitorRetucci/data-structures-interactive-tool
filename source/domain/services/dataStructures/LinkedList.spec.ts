/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { mockDeep } from "jest-mock-extended";
import { ILinkedListValue, LinkedList } from "./LinkedList";
import { ListManager } from "@/infra/positionManagers/ListManager";
import { Node } from "@/domain/entities/Node";
import generateRandomId from "@/utils/generateRandomId";
import Position from "@/domain/entities/Position";
import generateValueBetween from "@/utils/generateValueBetween";

function generateMockedNode(): Node<ILinkedListValue> {
  return new Node({
    id: generateRandomId(),
    position: new Position(0, 0),
    value: {
      value: generateValueBetween(0, 10).toString(),
      nextNodeId: "",
    },
  });
}

describe("LinkedList", () => {
  it("should create LinkedList successfully", () => {
    const positionManager = mockDeep<ListManager>();

    const linkedList1 = new LinkedList({ positionManager });
    expect(linkedList1).toBeInstanceOf(LinkedList);

    const linkedList2 = new LinkedList({
      positionManager,
      initialNodes: [
        new Node({
          id: generateRandomId(),
          position: new Position(0, 0),
          value: {
            nextNodeId: "",
            value: "3",
          },
          connectedNodesIds: [],
        }),
      ],
    });
    expect(linkedList2).toBeInstanceOf(LinkedList);
  });

  it("should create an additional node on init to be the HEAD", () => {
    const positionManager = mockDeep<ListManager>();

    const linkedList1 = new LinkedList({ positionManager });
    expect(linkedList1).toBeInstanceOf(LinkedList);
    expect(linkedList1.nodes).toHaveLength(1);
    expect(linkedList1.nodes[0].value.value).toBe("HEAD");

    const linkedList2 = new LinkedList({
      positionManager,
      initialNodes: [
        new Node({
          id: generateRandomId(),
          position: new Position(0, 0),
          value: {
            nextNodeId: "",
            value: "3",
          },
          connectedNodesIds: [],
        }),
      ],
    });
    expect(linkedList2).toBeInstanceOf(LinkedList);
    expect(linkedList2.nodes).toHaveLength(2);
    expect(linkedList2.nodes[0].value.value).toBe("HEAD");
  });

  const positionManager = new ListManager({ padding: 40 });
  const linkedList = new LinkedList({
    positionManager,
    initialNodes: Array.from({ length: 5 }, () => generateMockedNode()),
  });

  it("should add node at start", () => {
    linkedList.addNodeAtStart("new_value");
    expect(linkedList.nodes[1].value.value).toBe("new_value");
  });

  it("should add node at end", () => {
    linkedList.addNodeAtEnd("new_last_value");
    expect(linkedList.nodes.at(-1)!.value.value).toBe("new_last_value");
  });

  it("should add node at position", () => {
    linkedList.addNodeAtPosition("new_pos_value", 3);
    expect(linkedList.nodes[4].value.value).toBe("new_pos_value");
    linkedList.addNodeAtPosition("new_pos_value2", 3);
    expect(linkedList.nodes[4].value.value).toBe("new_pos_value2");
  });

  it("should remove node at position", () => {
    expect(linkedList.nodes[4].value.value).toBe("new_pos_value2");
    linkedList.removeNodeAtPosition(3);
    expect(linkedList.nodes[4].value.value).not.toBe("new_pos_value2");
    linkedList.removeNodeAtPosition(3);
    expect(linkedList.nodes[4].value.value).not.toBe("new_pos_value");
  });

  it("should remove node at start", () => {
    linkedList.removeNodeAtStart();
    expect(linkedList.nodes[1].value.value).not.toBe("new_value");
  });

  it("should remove node at end", () => {
    linkedList.removeNodeAtEnd();
    expect(linkedList.nodes.at(-1)!.value.value).not.toBe("new_last_value");
  });

  it("should leave HEAD value as TAIL if last node was removed", () => {
    const linkedList1 = new LinkedList({positionManager, initialNodes: [generateMockedNode()]});
    const linkedList2 = new LinkedList({positionManager, initialNodes: [generateMockedNode()]});
    const linkedList3 = new LinkedList({positionManager, initialNodes: [generateMockedNode()]});

    linkedList1.removeNodeAtEnd();
    linkedList2.removeNodeAtStart();
    linkedList3.removeNodeAtPosition(0);

    expect(linkedList1.nodes[0].value).toStrictEqual({ value: "HEAD", nextNodeId: "TAIL" });
    expect(linkedList2.nodes[0].value).toStrictEqual({ value: "HEAD", nextNodeId: "TAIL" });
    expect(linkedList3.nodes[0].value).toStrictEqual({ value: "HEAD", nextNodeId: "TAIL" });
  });

  it("should create node with next node value as TAIL when it's the only one", () => {
    const linkedList1 = new LinkedList({positionManager});
    const linkedList2 = new LinkedList({positionManager});
    const linkedList3 = new LinkedList({positionManager});

    linkedList1.addNodeAtEnd("my_new_value1");
    linkedList2.addNodeAtStart("my_new_value2");
    linkedList3.addNodeAtPosition("my_new_value3", 0);

    expect(linkedList1.nodes[1].value).toStrictEqual({ value: "my_new_value1", nextNodeId: "TAIL" });
    expect(linkedList2.nodes[1].value).toStrictEqual({ value: "my_new_value2", nextNodeId: "TAIL" });
    expect(linkedList3.nodes[1].value).toStrictEqual({ value: "my_new_value3", nextNodeId: "TAIL" });
  });

  it("should throw errors when target index is impossible to reach", () => {
    expect(() => linkedList.addNodeAtPosition("", -1)).toThrow("Error on validation");
    expect(() => linkedList.removeNodeAtPosition(-1)).toThrow("Error on validation");
  });

  it("should do nothing when trying to remove from empty list", () => {
    const linkedList1 = new LinkedList({positionManager});
    const linkedList2 = {...linkedList1};

    linkedList1.removeNodeAtEnd();
    linkedList1.removeNodeAtStart();

    expect(linkedList1).toEqual(linkedList2);
    expect(linkedList1).toEqual(linkedList2);
  });

  it("should create list from parsed JSON", () => {
    const nodes = [
      {
        "id": "#c329ef",
        "value": {
          "value": 5,
          "nextNodeId": "#a7b1d8"
        },
        "connectedNodesIds": ["#a7b1d8"]
      },
      {
        "id": "#a7b1d8",
        "value": {
          "value": 3,
          "nextNodeId": "#8f6e72"
        },
        "connectedNodesIds": ["#8f6e72"]
      },
      {
        "id": "#8f6e72",
        "value": {
          "value": 7,
          "nextNodeId": "#e4962a"
        },
        "connectedNodesIds": ["#e4962a"]
      },
      {
        "id": "#e4962a",
        "value": {
          "value": 1,
          "nextNodeId": "#d7bf5c"
        },
        "connectedNodesIds": ["#d7bf5c"]
      },
      {
        "id": "#d7bf5c",
        "value": {
          "value": 9,
          "nextNodeId": "#f3a9e8"
        },
        "connectedNodesIds": ["#f3a9e8"]
      },
      {
        "id": "#f3a9e8",
        "value": {
          "value": 4,
        },
        "connectedNodesIds": ["#b2d84f"]
      },
      {
        "value": {
          "value": 2,
          "nextNodeId": ""
        },
        "connectedNodesIds": []
      }
    ]

    linkedList.setNodesByJSON(nodes as unknown as Array<Node<ILinkedListValue>>);

    expect(linkedList.nodes).toHaveLength(8);
  });

});
