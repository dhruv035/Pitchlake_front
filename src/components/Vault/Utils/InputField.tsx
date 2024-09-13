import React from "react";

interface InputFieldProps {
  type?: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  type = "text",
  label,
  value,
  onChange,
  placeholder,
  icon,
  error,
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
        className={`w-full bg-[#1E1E1E] border rounded-md p-2 pr-8 appearance-none 
          [&::-webkit-outer-spin-button]:appearance-none 
          [&::-webkit-inner-spin-button]:appearance-none
          ${error ? 'border-[#CC455E]' : 'border-gray-700'}
          ${error ? 'text-[#CC455E]' : 'text-white'}`}
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        {icon}
      </div>
    </div>
    {error && (
      <p className="mt-1 text-sm text-red-500">{error}</p>
    )}
  </div>
);

export default InputField;