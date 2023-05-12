/* eslint-disable no-extra-boolean-cast */
import React, { useEffect, useState } from "react";
import "reactflow/dist/style.css";
import { useNodes } from "@/presentation/hooks/useNodes";
import generateValueBetween from "@/utils/generateValueBetween";
import { Editor } from "@monaco-editor/react";
import { DialogWrapper } from "@/presentation/components/DialogWrapper";
import { Transition } from "@headlessui/react";
import { LocalStorageKeys } from "../enums/LocalStorageKeys";
import { ValidationError } from "@/core/Errors";
import { ErrorDialog } from "@/presentation/components/ErrorDialog";

export default function Home(): JSX.Element {
  const [throttle, setThrottle] = useState(false);
  const [code, setCode] = useState("[]");
  const [activeNodeIndex, setActiveNodeIndex] = useState<number>(0);
  const [showEditor, setShowEditor] = useState(false);
  const [errorModal, setErrorModal] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(true);
  const {
    Canvas,
    addNodeAtStart,
    addNodeAtPosition,
    addNodeAtEnd,
    removeNodeAtStart,
    removeNodeAtPosition,
    removeNodeAtEnd,
    setNodesByJSON,
    nodes,
    emphasisNodeByPosition,
  } = useNodes({ initialNodes: [] });

  const buttonStart = (): void => {
    addNodeAtStart(generateValueBetween(1, 10).toString());
  };

  const buttonAtPosition = (): void => {
    const result = addNodeAtPosition(generateValueBetween(1, 10).toString(), 2);
    if (result.isLeft())
      setErrorModal((result.value as ValidationError).errors[0].error);
  };

  const buttonEnd = (): void => {
    addNodeAtEnd(generateValueBetween(1, 10).toString());
  };

  const buttonRemoveAtStart = (): void => {
    removeNodeAtStart();
  };

  const buttonRemoveAtPosition = (): void => {
    const result = removeNodeAtPosition(activeNodeIndex);
    if (result.isLeft()) {
      const err = !!(result.value as ValidationError).errors ? (result.value as ValidationError).errors[0].error : result.value.message;
      setErrorModal(err);
    }
  };

  const buttonRemoveAtEnd = (): void => {
    removeNodeAtEnd();
  };

  const handleApplyNodes = (): void => {
    try {
      const obj = JSON.parse(code);
      if (!obj.length) throw new Error("The value must be an array.");
      setNodesByJSON(obj);
    } catch (error) {
      const err = error as Error;
      setErrorModal(err.message);
    }
    setIsOpen(false);
  };

  const checkCodeValidation = (): void => {
    if (!isCodeValid) return;
    setIsOpen(true);
  };

  useEffect(() => {
    setIsCodeValid(isCodeValid && !!code);

    if (throttle && isCodeValid) {
      window.localStorage.setItem(LocalStorageKeys.EDITOR_CONTENT, code);
      setTimeout(() => {
        setThrottle(false);
      }, 200);
    } else {
      setThrottle(true);
    }
  }, [code]);

  useEffect(() => {
    const initialCode = window.localStorage.getItem(
      LocalStorageKeys.EDITOR_CONTENT
    );
    if (!!initialCode) {
      setCode(initialCode);
    }
  }, []);

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
            value={code}
            defaultValue="[]"
            className="shrink pt-4 bg-editor"
          />
          <div className="h-fit flex justify-center items-center p-4">
            <button
              className="bg-gray-500 hover:bg-gradient-to-br from-gray-400 to-gray-500 p-2 rounded text-white w-full active:brightness-50"
              onClick={checkCodeValidation}
            >
              Enter
            </button>
          </div>
        </Transition>
        <div className="h-full w-full bg-white relative">
          <button
            className="min-w-[7.5rem] bg-gradient-to-b from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-800 text-white absolute top-10 left-0 z-10 p-4 rounded-r-md"
            onClick={() => setShowEditor(!showEditor)}
          >
            {showEditor ? "Hide" : "Input JSON"}
          </button>
          <React.StrictMode>{Canvas}</React.StrictMode>
        </div>
        <div className="bg-gradient-to-b from-slate-700 to-slate-800 px-6 py-4 fixed z-10 bottom-8 min-w-[22.5rem] grid gap-4 grid-cols-4 justify-around rounded-md drop-shadow-md">
          <button
            className="w-full bg-gray-500 hover:bg-gradient-to-br from-gray-400 to-gray-500 p-2 rounded text-white active:brightness-50"
            onClick={buttonStart}
          >
            Adicionar no início
          </button>
          <button
            className="w-full bg-gray-500 hover:bg-gradient-to-br from-gray-400 to-gray-500 p-2 rounded text-white"
            onClick={buttonAtPosition}
          >
            Adicionar na posição
          </button>
          <button
            className="w-full bg-gray-500 hover:bg-gradient-to-br from-gray-400 to-gray-500 p-2 rounded text-white"
            onClick={buttonEnd}
          >
            Adicionar no fim
          </button>
          <div className="w-full flex overflow-hidden rounded text-white">
            <input
              className="h-full bg-canvas px-4 w-16 outline-none border-0"
              min={0}
              max={nodes.length - 1}
              type="number"
              value={activeNodeIndex}
              onChange={(evt) => setActiveNodeIndex(Number(evt.target.value))}
            />
            <button
              className="w-full bg-gray-500 hover:bg-gradient-to-br from-gray-400 to-gray-500 p-2"
              onClick={() => emphasisNodeByPosition(activeNodeIndex)}
            >
              Activate
            </button>
          </div>
          <button
            className="w-full bg-gray-500 hover:bg-gradient-to-br from-gray-400 to-gray-500 p-2 rounded text-white active:brightness-50"
            onClick={buttonRemoveAtStart}
          >
            Remover do início
          </button>
          <button
            className="w-full bg-gray-500 hover:bg-gradient-to-br from-gray-400 to-gray-500 p-2 rounded text-white"
            onClick={buttonRemoveAtPosition}
          >
            Remover da posição
          </button>
          <button
            className="w-full bg-gray-500 hover:bg-gradient-to-br from-gray-400 to-gray-500 p-2 rounded text-white"
            onClick={buttonRemoveAtEnd}
          >
            Remover do fim
          </button>
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
      <ErrorDialog
        message={errorModal}
        isOpen={!!errorModal}
        close={() => setErrorModal("")}
      />
    </main>
  );
}
