import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { FC, Fragment, InputHTMLAttributes, useEffect, useState } from "react";

type TInputProps = Omit<
  InputHTMLAttributes<unknown>,
  "onChange" | "id" | "value"
>;

export interface IActionOptions {
  label: string;
  action: () => void;
  disabled?: boolean;
}

export interface IActionPanelProps {
  value: string;
  valueOptions: TInputProps;
  onValueUpdate: (value: string) => void;
  index: string;
  indexOptions: TInputProps;
  onIndexUpdate: (index: string) => void;
  actions: IActionOptions[];
}

export const ActionPanel: FC<IActionPanelProps> = ({
  value,
  valueOptions,
  onValueUpdate,
  index,
  indexOptions,
  onIndexUpdate,
  actions,
}): JSX.Element => {
  const [currentAction, setCurrentAction] = useState<IActionOptions>({
    action: () => {},
    label: "Select",
    disabled: true,
  });

  useEffect(() => {
    if (currentAction.disabled) return;

    const updatedAction = actions.find(
      (action) => action.label === currentAction.label
    );

    if (updatedAction) {
      setCurrentAction(updatedAction);
    }
  }, [actions]);

  return (
    <div
      className="bg-gradient-to-b from-slate-700 to-slate-800 px-6 py-4 fixed z-10 bottom-8 min-w-[22.5rem] 
    grid gap-4 grid-cols-3 justify-around rounded-md drop-shadow-md"
    >
      <div
        className="absolute h-fit items-center justify-center p-2 max-w-[80%] bg-slate-500 -translate-y-full 
      left-1/2 -translate-x-1/2 rounded-t flex w-full space-x-2"
      >
        <div className="labelled-input">
          <label htmlFor="value">Value</label>
          <input
            {...valueOptions}
            id="value"
            value={value}
            onChange={({ target: { value } }) => onValueUpdate(value)}
          />
        </div>
        <div className="labelled-input">
          <label htmlFor="index">Index</label>
          <input
            {...indexOptions}
            id="index"
            value={index}
            onChange={({ target: { value } }) => onIndexUpdate(value)}
          />
        </div>
      </div>
      <Listbox value={currentAction} onChange={setCurrentAction}>
        <div className="col-span-2 relative">
          <Listbox.Button className="btn-full text-left">
            <span>{currentAction.label}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className="absolute bottom-[calc(100%_+_0.5rem)] mt-1 max-h-60 w-full overflow-auto 
            rounded-md bg-gradient-to-br from-slate-400 to-slate-500 py-1 text-lg shadow-lg ring-1 ring-black 
            ring-opacity-5 focus:outline-none sm:text-sm"
            >
              <Listbox.Option
                key="default-action"
                value="Select"
                className="sr-only"
                disabled
              >
                Select
              </Listbox.Option>
              {actions.map((action, index) => (
                <Listbox.Option
                  key={action.label.replace(/\s/gm, "_") + `_${index}`}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 font-semibold ${
                      active ? "bg-slate-600 text-white" : "text-slate-800"
                    }
                    last:after:content-none after:content-[''] after:absolute after:block after:bottom-0 
                    after:bg-slate-800/25 after:mx-auto after:w-4/5 after:h-px`
                  }
                  value={action}
                >
                  {action.label}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      <button
        className="btn-full font-bold bg-dracula-green hover:bg-transparent 
          from-dracula-green/90 to-dracula-green/50 ring-dracula-green/30"
        onClick={currentAction.action}
        disabled={currentAction.disabled}
      >
        Run!
      </button>
    </div>
  );
};
