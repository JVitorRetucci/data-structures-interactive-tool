import classNames from "classnames";
import { FC, InputHTMLAttributes } from "react";

type TInputProps = Omit<
  InputHTMLAttributes<unknown>,
  "onChange" | "id" | "value"
>;

interface IAction {
  label: string;
  action: () => void;
  extraClasses?: string;
}

export interface IActionPanelProps {
  value: string;
  valueOptions: TInputProps;
  onValueUpdate: (value: string) => void;
  index: string;
  indexOptions: TInputProps;
  onIndexUpdate: (index: string) => void;
  actions: IAction[];
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
  return (
    <div className="bg-gradient-to-b from-slate-700 to-slate-800 px-6 py-4 fixed z-10 bottom-8 min-w-[22.5rem] grid gap-4 grid-cols-3 justify-around rounded-md drop-shadow-md">
      <div className="absolute h-fit items-center justify-center p-2 max-w-[80%] bg-slate-500 -translate-y-full left-1/2 -translate-x-1/2 rounded-t flex w-full space-x-2">
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
      {actions.map((action, index) => (
        <button
          key={`${action.label.replace(/\s/g, "_").toLowerCase()}_${index}`}
          className={classNames("btn-full", action.extraClasses)}
          onClick={action.action}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
};
