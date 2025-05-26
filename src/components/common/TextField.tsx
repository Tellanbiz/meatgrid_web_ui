import React, { ChangeEvent } from "react";

interface TextFieldProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: "text" | "password" | "email" | "number";
  name: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  name,
  leftIcon,
  rightIcon,
  helperText,
  error = false,
  disabled = false,
  required = false,
  multiline = false,
  rows = 3,
}) => {
  const inputClass = `w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
    error
      ? "border-red-500 focus:ring-red-400"
      : "border-gray-300 focus:ring-blue-500"
  } ${leftIcon ? "pl-10" : ""} ${rightIcon ? "pr-10" : ""} ${
    disabled ? "bg-gray-100 cursor-not-allowed" : ""
  }`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm font-medium mb-1 ${
            error ? "text-red-600" : "text-gray-700"
          }`}
        >
          {label} {required && "*"}
        </label>
      )}

      <div className="relative">
        {leftIcon && !multiline && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {leftIcon}
          </div>
        )}

        {multiline ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            className={inputClass}
          />
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={inputClass}
          />
        )}

        {rightIcon && !multiline && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightIcon}
          </div>
        )}
      </div>

      {helperText && (
        <p
          className={`text-xs mt-1 ${error ? "text-red-500" : "text-gray-500"}`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default TextField;
