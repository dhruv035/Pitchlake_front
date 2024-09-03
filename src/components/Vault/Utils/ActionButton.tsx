import React from "react";

interface ActionButtonProps {
  onClick: () => void;
  disabled: boolean;
  text: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  disabled,
  text,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full py-2 rounded-md ${
      disabled
        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
        : "bg-[#F5EBB8] text-[#121212]"
    }`}
  >
    {text}
  </button>
);

export default ActionButton;