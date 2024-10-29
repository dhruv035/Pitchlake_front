import React from "react";

interface InputFieldProps {
  type?: string;
  label: string;
  label2?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  type = "text",
  label,
  label2,
  value,
  onChange,
  placeholder,
  icon,
  error,
}) => (
  <div className="mb-4">
    <label className="flex flex-row justify-between text-sm font-medium text-[#fafafa] text-[14px] mb-1">
      {label}
      <p className="font-regular text-[var(--buttongrey)]">{label2}</p>
    </label>
    <div className="relative w-full">
      <input
        type={type}
        placeholder={placeholder}
        min={0}
        value={value}
        onChange={onChange}
        className={`w-full bg-[#0A0A0A] border rounded-md p-2 pr-8 appearance-none flex flex-row justify-between
          [&::-webkit-outer-spin-button]:appearance-none
          [&::-webkit-inner-spin-button]:appearance-none
          ${error ? "border-[#CC455E]" : "border-gray-700"}
          ${error ? "text-[#CC455E]" : "text-white"} px-6`}
      />
      <div className="flex items-center pointer-events-none">{icon}</div>
    </div>
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

export default InputField;

