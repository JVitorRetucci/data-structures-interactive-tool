import { ListNodeProps } from "@/presentation/components/ListNode";
import { Node } from "reactflow";
import "reactflow/dist/style.css";
import { useNodes } from "../hooks/useNodes";

const initialNodes: Node<ListNodeProps>[] = [];

const initialEdges = [];

export default function Home(): JSX.Element {
  const { Canvas, addNodeAtStart, addNodeAtEnd } = useNodes({ initialNodes });

  const buttonStart = () => {
    addNodeAtStart({
      value: 'dfsdf',
      nextNodeId: 2,
      prevNodeId: 1,
    })
  }

  const buttonEnd = () => {
    addNodeAtEnd({
      value: 'dfsdf',
      nextNodeId: 2,
      prevNodeId: 1,
    })
  }

  return (
    <div className="relative h-screen flex justify-center items-center">
      <div className="bg-gradient-to-b from-slate-700 to-slate-800 px-6 py-4 fixed z-10 bottom-8 min-w-[22.5rem] grid gap-4 grid-flow-col justify-around rounded-md drop-shadow-md">
        <button
          className="bg-gray-500 hover:bg-gradient-to-br from-gray-400 to-gray-500 p-2 rounded text-white w-fit active:brightness-50"
          onClick={buttonStart}
        >
          Adicionar no início
        </button>
        <button
          className="bg-gray-500 hover:bg-gradient-to-br from-gray-400 to-gray-500 p-2 rounded text-white w-fit"
          onClick={buttonEnd}
        >
          Adicionar no fim
        </button>
      </div>
      <main className="h-full w-full bg-white">
        { Canvas }
      </main>
    </div>
  );
}
