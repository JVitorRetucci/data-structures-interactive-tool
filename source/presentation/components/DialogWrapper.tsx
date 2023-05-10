import { FC, ReactNode } from "react";
import { Dialog } from "@headlessui/react";

interface IDialogProps {
  children: ReactNode;
  title?: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const DialogWrapper: FC<IDialogProps> = ({
  title,
  isOpen,
  setIsOpen,
  children,
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
        {!!title && <Dialog.Title>{title}</Dialog.Title>}
        {children}
      </Dialog.Panel>
    </Dialog>
  );
};
