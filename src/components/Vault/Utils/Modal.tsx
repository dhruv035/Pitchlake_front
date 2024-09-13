import React from "react";
import { ArrowLeftIcon } from "lucide-react";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-[#121212] p-6 rounded-lg max-w-sm w-full">
      <div className="flex items-center mb-4">
        <ArrowLeftIcon className="h-5 w-5 mr-2" onClick={onClose} />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  </div>
);

export default Modal;