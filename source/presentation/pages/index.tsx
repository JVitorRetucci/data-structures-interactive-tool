/* eslint-disable no-extra-boolean-cast */
import React, { useEffect, useState } from "react";
import "reactflow/dist/style.css";
import { useNodes } from "@/presentation/hooks/useNodes";
import generateValueBetween from "@/utils/generateValueBetween";
import { DialogWrapper } from "@/presentation/components/DialogWrapper";
import { LocalStorageKeys } from "../enums/LocalStorageKeys";
import { ValidationError } from "@/core/Errors";
import { ErrorDialog } from "@/presentation/components/ErrorDialog";
import { ActionPanel, IActionOptions } from "@/presentation/components/ActionPanel";
import { CollapsibleEditor } from "@/presentation/components/CollapsibleEditor";

const initialEditorValue = `[
  {
    "id": "#c329ef",
    "value": {
      "value": 5,
      "nextNodeId": "#a7b1d8"
    },
    "connectedNodesIds": ["#a7b1d8"]
  }
]`;

export default function Home(): JSX.Element {
  const [throttle, setThrottle] = useState(false);
  const [code, setCode] = useState(initialEditorValue);
  const [targetIndex, setTargetIndex] = useState<string>("");
  const [newValue, setNewValue] = useState<string>("");
  const [showEditor, setShowEditor] = useState(false);
  const [errorModal, setErrorModal] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(true);
  const {
    Canvas,
    nodes,
    addNodeAtStart,
    addNodeAtPosition,
    addNodeAtEnd,
    removeNodeAtStart,
    removeNodeAtPosition,
    removeNodeAtEnd,
    setNodesByJSON,
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

  const actions: IActionOptions[] = [
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
    },
    {
      label: "Run through",
      action: () => runThroughList(0),
    },
  ];

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
    if (!isCodeValid) {
      setErrorModal("Invalid JSON format.");
      return;
    }
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
          <CollapsibleEditor
            showEditor={showEditor}
            value={code}
            defaultValue={initialEditorValue}
            onValidate={(validations) => setIsCodeValid(!validations.length)}
            onChange={(value: string) => setCode(value)}
            onSubmit={checkCodeValidation}
            toggleOpen={setShowEditor}
          />
          <div className="h-full w-full bg-editor relative">
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
