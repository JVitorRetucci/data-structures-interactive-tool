import { FC, ReactNode } from "react";
import { Dialog } from '@headlessui/react';

interface IDialogProps {
  children: ReactNode;
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void;
}

export const DialogWrapper: FC<IDialogProps> = ({
  isOpen,
  setIsOpen, 
  children
}): JSX.Element => {
  return (
    <Dialog className="flex justify-center items-center text-white" open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="fixed inset-0 z-10 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
      <Dialog.Panel className="z-10 mx-auto bg-gradient-to-b from-slate-700 to-slate-800 px-6 py-4 fixed rounded-md drop-shadow-md top-1/2 -translate-y-1/2">
        <Dialog.Title>Deactivate account</Dialog.Title>
        <Dialog.Description>
          This will permanently deactivate your account
          { children }
        </Dialog.Description>
        <button onClick={() => setIsOpen(false)}>Deactivate</button>
        <button onClick={() => setIsOpen(false)}>Cancel</button>
      </Dialog.Panel>
    </Dialog>
  );
};