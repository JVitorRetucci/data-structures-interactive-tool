import { FC } from "react";
import { DialogWrapper } from "@/presentation/components/DialogWrapper";

interface IErrorDialog {
  message: string;
  label?: string;
  isOpen: boolean;
  close: () => void;
}

export const ErrorDialog: FC<IErrorDialog> = ({
  message,
  label = "Ok",
  isOpen,
  close,
}): JSX.Element => {
  return (
    <DialogWrapper isOpen={isOpen} setIsOpen={close}>
      <h2 className="w-full text-center text-2xl font-semibold mb-5">
        Error!
      </h2>
      <p className="block w-full text-center mb-4">{message}</p>
      <div className="flex flex-col md:flex-row justify-center items-center gap-4">
        <button
          className="w-full bg-dracula-red/90 hover:bg-gradient-to-br from-dracula-red to-dracula-red/50 p-2 rounded text-white"
          onClick={() => close()}
        >
          {label}
        </button>
      </div>
    </DialogWrapper>
  );
};
