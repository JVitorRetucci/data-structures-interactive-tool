import { ListNodeProps } from "@/presentation/components/ListNode";
import React, { useState } from "react";
import { Node } from "reactflow";
import "reactflow/dist/style.css";
import { useNodes } from "@/presentation/hooks/useNodes";
import generateValueBetween from "@/utils/generateValueBetween";
import { Editor } from "@monaco-editor/react";
import { DialogWrapper } from "@/presentation/components/DialogWrapper";

const initialNodes: Array<Node<ListNodeProps>> = [];

export default function Home(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const { Canvas, addNodeAtStart, addNodeAtEnd } = useNodes({ initialNodes });

  const buttonStart = (): void => {
    addNodeAtStart(generateValueBetween(1, 10).toString());
  };

  const buttonEnd = (): void => {
    addNodeAtEnd(generateValueBetween(1, 10).toString());
  };

  return (
    <div className="flex w-full">
      <div className="relative h-screen flex justify-center items-center w-full">
        <DialogWrapper
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        >
          olamundo
        </DialogWrapper>
        <Editor
          width="20vw"
          height="100vh"
          defaultLanguage="json"
          theme="vs-dark"
          onValidate={(m) =>
            m.forEach((marker) => console.log("onValidate:", marker.message))
          }
          onChange={(value: string) => console.log(JSON.parse(value))}
        />
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
          <React.StrictMode>{Canvas}</React.StrictMode>
        </main>
      </div>
    </div>
  );
}
