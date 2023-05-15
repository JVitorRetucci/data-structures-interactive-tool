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
import generateRandomId from "@/utils/generateRandomId";

export default function Home(): JSX.Element {
  const [throttle, setThrottle] = useState(false);
  const [code, setCode] = useState("[]");
  const [targetIndex, setTargetIndex] = useState<string>("");
  const [newValue, setNewValue] = useState<string>("");
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
    addNodeAtStart(newValue);
  };

  const buttonAtPosition = (): void => {
    const result = addNodeAtPosition(newValue, Number(targetIndex));
    if (result.isLeft()){
      const err = !!(result.value as ValidationError).errors
        ? (result.value as ValidationError).errors[0].error
        : result.value.message;
      setErrorModal(err);
    }
  };

  const buttonEnd = (): void => {
    addNodeAtEnd(newValue);
  };

  const buttonRemoveAtStart = (): void => {
    removeNodeAtStart();
  };

  const buttonRemoveAtPosition = (): void => {
    const result = removeNodeAtPosition(Number(targetIndex));
    if (result.isLeft()) {
      const err = !!(result.value as ValidationError).errors
        ? (result.value as ValidationError).errors[0].error
        : result.value.message;
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
    setTargetIndex("");
    setNewValue(generateValueBetween(0, 10).toString());
  }, [nodes]);

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
        <div className="bg-gradient-to-b from-slate-700 to-slate-800 px-6 py-4 fixed z-10 bottom-8 min-w-[22.5rem] grid gap-4 grid-cols-3 justify-around rounded-md drop-shadow-md">
          <div className="absolute h-fit items-center justify-center p-2 w-fit max-w-[80%] bg-slate-500 -translate-y-full left-1/2 -translate-x-1/2 rounded-t flex w-full space-x-2">
            <div className="w-full flex rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-dracula-purple items-center">
              <label className="text-white bg-slate-800 p-2" htmlFor="value">
                Value
              </label>
              <input
                id="value"
                type="number"
                className="text-white w-full outline-none bg-slate-600 ring-0 border-none focus:ring-0"
                value={newValue}
                onChange={({ target: { value } }) => setNewValue(value)}
              />
            </div>
            <div className="w-full flex rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-dracula-purple items-center">
              <label className="text-white bg-slate-800 p-2" htmlFor="index">
                Index
              </label>
              <input
                id="index"
                type="number"
                className="text-white w-full outline-none bg-slate-600 ring-0 border-none focus:ring-0"
                max={nodes.length - 1}
                min={0}
                value={targetIndex}
                onChange={({ target: { value } }) => setTargetIndex(value)}
              />
            </div>
          </div>
          <button
            className="w-full bg-gray-500 hover:bg-gradient-to-br from-gray-400 to-gray-500 p-2 rounded text-white active:brightness-50"
            onClick={buttonStart}
          >
            Add at start
          </button>
          <button
            className="w-full bg-gray-500 hover:bg-gradient-to-br from-gray-400 to-gray-500 p-2 rounded text-white"
            onClick={buttonAtPosition}
          >
            Add at position
          </button>
          <button
            className="w-full bg-gray-500 hover:bg-gradient-to-br from-gray-400 to-gray-500 p-2 rounded text-white"
            onClick={buttonEnd}
          >
            Add at end
          </button>
          <button
            className="w-full bg-gray-500 hover:bg-gradient-to-br from-gray-400 to-gray-500 p-2 rounded text-white active:brightness-50"
            onClick={buttonRemoveAtStart}
          >
            Remove at start
          </button>
          <button
            className="w-full bg-gray-500 hover:bg-gradient-to-br from-gray-400 to-gray-500 p-2 rounded text-white"
            onClick={buttonRemoveAtPosition}
          >
            Remove at position
          </button>
          <button
            className="w-full bg-gray-500 hover:bg-gradient-to-br from-gray-400 to-gray-500 p-2 rounded text-white"
            onClick={buttonRemoveAtEnd}
          >
            Remove at end
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
