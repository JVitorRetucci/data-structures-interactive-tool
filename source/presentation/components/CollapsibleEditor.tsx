import { Transition } from "@headlessui/react";
import { Editor, OnValidate, OnChange } from "@monaco-editor/react";
import { FC } from "react";

interface ICollapsibleEditorProps {
  showEditor: boolean;
  value: string;
  defaultValue: string;
  onValidate?: OnValidate;
  onChange?: OnChange;
  onSubmit: () => void;
  toggleOpen: (isOpen: boolean) => void;
}

export const CollapsibleEditor: FC<ICollapsibleEditorProps> = ({
  showEditor,
  value,
  defaultValue,
  onValidate = () => {},
  onChange = () => {},
  onSubmit,
  toggleOpen,
}): JSX.Element => {
  return (
    <div className="h-full w-fit relative left-0 bottom-0 top-0">
      <Transition
        as="div"
        className="h-full max-h-full flex flex-col z-20"
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
          onValidate={onValidate}
          onChange={onChange}
          value={value}
          defaultValue={defaultValue}
          className="shrink pt-4 bg-editor"
        />
        <div className="h-fit flex justify-center items-center p-4">
          <button
            className="btn w-full active:brightness-50"
            onClick={onSubmit}
          >
            Enter
          </button>
        </div>
      </Transition>
      <button
        className="min-w-[7.5rem] bg-gradient-to-b from-slate-700 to-slate-800 hover:from-slate-800 
              hover:to-slate-800 focus:ring ring-slate-600 text-white absolute top-10 right-0 p-4 rounded-r-md
              translate-x-full z-10"
        onClick={() => toggleOpen(!showEditor)}
      >
        {showEditor ? "Hide" : "Input JSON"}
      </button>
    </div>
  );
};
