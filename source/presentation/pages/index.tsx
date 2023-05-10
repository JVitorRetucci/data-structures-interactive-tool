import { ListNodeProps } from "@/presentation/components/ListNode";
import React, { Fragment, useState } from "react";
import { Node } from "reactflow";
import "reactflow/dist/style.css";
import { useNodes } from "@/presentation/hooks/useNodes";
import generateValueBetween from "@/utils/generateValueBetween";
import { Editor } from "@monaco-editor/react";
import { DialogWrapper } from "@/presentation/components/DialogWrapper";
import classNames from "classnames";
import { Transition } from "@headlessui/react";

const initialNodes: Array<Node<ListNodeProps>> = [];

export default function Home(): JSX.Element {
  const [showEditor, setShowEditor] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { Canvas, addNodeAtStart, addNodeAtEnd } = useNodes({ initialNodes });

  const buttonStart = (): void => {
    addNodeAtStart(generateValueBetween(1, 10).toString());
  };

  const buttonEnd = (): void => {
    addNodeAtEnd(generateValueBetween(1, 10).toString());
  };

  return (
    <div className="flex w-full bg-slate-700">
      <div className="relative h-screen flex justify-center items-center w-full">
        <Transition
          as="div"
          className="h-full max-h-full flex flex-col"
          show={showEditor}
          enter="transform transition duration-200 origin-left"
          enterFrom="-translate-x-1/2"
          enterTo="translate-x-0"
          leave="transform duration-200 transition ease"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-1/2 "
        >
          <Editor
            width="20vw"
            height="100%"
            defaultLanguage="json"
            options={{
              tabSize: 2
            }}
            theme="vs-dark"
            onValidate={(m) =>
              m.forEach((marker) => console.log("onValidate:", marker.message))
            }
            onChange={(value: string) => console.log(JSON.parse(value))}
            className="shrink pt-4 bg-editor"
          />
          <div className="h-fit flex justify-center items-center p-4">
            <button className="bg-gray-500 hover:bg-gradient-to-br from-gray-400 to-gray-500 p-2 rounded text-white w-full active:brightness-50">
              Enter
            </button>
          </div>
        </Transition>
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
        <main className="h-full w-full bg-white relative">
          <button
            className="min-w-[7.5rem] bg-gradient-to-b from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-800 text-white absolute top-10 left-0 z-20 p-4 rounded-r-md"
            onClick={() => setShowEditor(!showEditor)}
          >
            {showEditor ? "Hide" : "Input JSON"}
          </button>
          <React.StrictMode>{Canvas}</React.StrictMode>
        </main>
      </div>
    </div>
  );
}
