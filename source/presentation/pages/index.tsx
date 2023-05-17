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
import { ActionPanel } from "../components/ActionPanel";

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
    runThroughList,
    simulatedAddNodeAtEnd,
  } = useNodes({ initialNodes: [] });

  const buttonAtPosition = (): void => {
    const result = addNodeAtPosition(newValue, Number(targetIndex));
    if (result.isLeft()) {
      const err = !!(result.value as ValidationError).errors
        ? (result.value as ValidationError).errors[0].error
        : result.value.message;
      setErrorModal(err);
    }
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

  const actions = [
    {
      label: "Add at start",
      action: () => addNodeAtStart(newValue),
    },
    {
      label: "Add at position",
      action: buttonAtPosition,
    },
    {
      label: "Add at end",
      action: () => addNodeAtEnd(newValue),
    },
    {
      label: "Remove at start",
      action: removeNodeAtStart,
    },
    {
      label: "Remove at position",
      action: buttonRemoveAtPosition,
    },
    {
      label: "Remove at end",
      action: removeNodeAtEnd,
    },
    {
      label: "Simulate add",
      action: () => simulatedAddNodeAtEnd(newValue),
      extraClasses: "col-span-2",
    },
    {
      label: "Run",
      action: () => runThroughList(0),
    },
  ]

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
  }, [nodes.length]);

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
    <>
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
              width="32vw"
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
                className="btn w-full active:brightness-50"
                onClick={checkCodeValidation}
              >
                Enter
              </button>
            </div>
          </Transition>
          <div className="h-full w-full bg-white relative">
            <button
              className="min-w-[7.5rem] bg-gradient-to-b from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-800 focus:ring ring-slate-600 text-white absolute top-10 left-0 z-10 p-4 rounded-r-md"
              onClick={() => setShowEditor(!showEditor)}
            >
              {showEditor ? "Hide" : "Input JSON"}
            </button>
            <React.StrictMode>{Canvas}</React.StrictMode>
          </div>
          <ActionPanel
            value={newValue}
            onValueUpdate={setNewValue}
            valueOptions={{
              type: "number",
            }}
            index={targetIndex}
            onIndexUpdate={setTargetIndex}
            indexOptions={{
              type: "number",
              max: nodes.length - 1,
              min: 0,
            }}
            actions={actions}
          />
        </div>
      </main>
      <DialogWrapper
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Are you sure you want to insert these nodes?"
        message="This action will substitute all your current nodes."
        applyLabel="Confirm"
        apply={handleApplyNodes}
      />
      <ErrorDialog
        message={errorModal}
        isOpen={!!errorModal}
        close={() => setErrorModal("")}
      />
    </>
  );
}
