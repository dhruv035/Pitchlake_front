import React from "react";
import { ChevronDownIcon } from "lucide-react";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-400 mb-1">
      {label}
    </label>
    <div className="relative">
      <input
        type="number"
        placeholder={placeholder}
        min={0}
        value={value}
        onChange={onChange}
        className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 pr-8 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  </div>
);

export default InputField;
