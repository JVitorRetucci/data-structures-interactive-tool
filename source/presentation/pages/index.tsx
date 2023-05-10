import { ListNodeProps } from "@/presentation/components/ListNode";
import React, { Fragment, useEffect, useState } from "react";
import { Node } from "reactflow";
import "reactflow/dist/style.css";
import { useNodes } from "@/presentation/hooks/useNodes";
import generateValueBetween from "@/utils/generateValueBetween";
import { Editor } from "@monaco-editor/react";
import { DialogWrapper } from "@/presentation/components/DialogWrapper";
import { Transition } from "@headlessui/react";
import { objectContainsKey } from "jest-mock-extended";

const initialNodes: Array<Node<ListNodeProps>> = [];

export default function Home(): JSX.Element {
  const [code, setCode] = useState<string>();
  const [showEditor, setShowEditor] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const { Canvas, addNodeAtStart, addNodeAtEnd, setNodesByJSON } = useNodes({ initialNodes });

  const buttonStart = (): void => {
    addNodeAtStart(generateValueBetween(1, 10).toString());
  };

  const buttonEnd = (): void => {
    addNodeAtEnd(generateValueBetween(1, 10).toString());
  };

  const handleApplyNodes = (): void => {
    try {
      const obj = JSON.parse(code as string);
      if(!obj.length) throw new Error("The value must be an array.")
      setNodesByJSON(obj);
    } catch (error) {
      console.log(error)
    }
    setIsOpen(false);
  };

  const checkCodeValidation = (): void => {
    if (!isCodeValid) return;
    setIsOpen(true);
  };

  useEffect(() => {
    setIsCodeValid(isCodeValid && !!code);
  }, [code])

  return (
    <main className="flex w-full bg-slate-700">
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
              tabSize: 2,
            }}
            theme="vs-dark"
            onValidate={(validations) => setIsCodeValid(!validations.length)}
            onChange={(value: string) => setCode(value)}
            className="shrink pt-4 bg-editor"
          />
          <div className="h-fit flex justify-center items-center p-4">
            <button className="bg-gray-500 hover:bg-gradient-to-br from-gray-400 to-gray-500 p-2 rounded text-white w-full active:brightness-50" onClick={checkCodeValidation}>
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
        <div className="h-full w-full bg-white relative">
          <button
            className="min-w-[7.5rem] bg-gradient-to-b from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-800 text-white absolute top-10 left-0 z-10 p-4 rounded-r-md"
            onClick={() => setShowEditor(!showEditor)}
          >
            {showEditor ? "Hide" : "Input JSON"}
          </button>
          <React.StrictMode>{Canvas}</React.StrictMode>
        </div>
      </div>
      <DialogWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
        <h2 className="w-full text-center text-2xl font-semibold mb-5">
          Are you sure you want to insert these nodes?
        </h2>
        <p className="block w-full text-center mb-4">
          This action will substitute all your current nodes.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <button
            className="w-full bg-dracula-purple/90 hover:bg-gradient-to-br from-dracula-purple to-dracula-purple/50 p-2 rounded text-white"
            onClick={handleApplyNodes}
          >
            Apply
          </button>
          <button
            className="w-full bg-gray-500 hover:bg-gradient-to-br from-gray-400 to-gray-500 p-2 rounded text-white"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
        </div>
      </DialogWrapper>
    </main>
  );
}
