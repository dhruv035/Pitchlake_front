import React from "react";

interface InputFieldProps {
  type?: string;
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
  type = "text",
  label,
  value,
  onChange,
  placeholder,
  icon,
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-400 mb-1">
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        min={0}
        value={value}
        onChange={onChange}
        className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 pr-8 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      {icon ? icon : <></>}
    </div>
  </div>
);

export default InputField;
