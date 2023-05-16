import { FC, ReactNode } from "react";
import { Dialog } from "@headlessui/react";

interface IDialogProps {
  children?: ReactNode;
  title?: string;
  message?: string;
  applyLabel?: string;
  cancelLabel?: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  apply?: () => void;
}

export const DialogWrapper: FC<IDialogProps> = ({
  title = "",
  message = "Are you sure?",
  applyLabel,
  cancelLabel,
  isOpen,
  children,
  setIsOpen,
  apply = () => {},
}): JSX.Element => {
  return (
    <Dialog
      className="flex justify-center items-center text-white"
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <div
        className="fixed inset-0 z-10 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />
      <Dialog.Panel className="z-10 mx-auto bg-gradient-to-b from-slate-700 to-slate-800 px-6 py-4 fixed rounded-md drop-shadow-md bottom-4 md:bottom-auto right-4 md:right-auto left-4 md:left-auto md:top-1/2 md:-translate-y-1/2">
        {!!title && (
          <Dialog.Title className="w-full text-center text-2xl font-semibold mb-5">
            {title}
          </Dialog.Title>
        )}
        {children ?? (
          <>
            <p className="block w-full text-center mb-4">{message}</p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-4">
              <button
                className="w-full bg-dracula-purple/90 hover:bg-gradient-to-br from-dracula-purple to-dracula-purple/50 p-2 rounded text-white"
                onClick={apply}
              >
                {applyLabel ?? "Apply"}
              </button>
              <button className="btn-full" onClick={() => setIsOpen(false)}>
                {cancelLabel ?? "Cancel"}
              </button>
            </div>
          </>
        )}
      </Dialog.Panel>
    </Dialog>
  );
};
