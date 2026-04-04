import React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type InputProps = {
  value: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  type: "text" | "password" | "email" | "number",
  placeholder?: string,
  maxLength?: number,
  name?: string,
  label: string,
  inputMode?: "numeric" | "text",
  pattern?: string,
  className?: string,
  error?: boolean
}

const FormInput = ({value, label,  onChange, type, pattern, inputMode, name, className, maxLength, placeholder, error}: InputProps) => {
  return (
    <div className="space-y-2">
      <label className={twMerge("text-sm font-semibold text-gray-700",
        error && "text-red-600"
      )}>{label}</label>
      <input
        type={type}
        inputMode={inputMode}
        name={name}
        value={value}
        pattern={pattern}
        maxLength={maxLength}
        onChange={onChange}
        placeholder={placeholder}
        className={twMerge("w-full px-4 py-3 rounded-l border border-gray-200 focus:border-theme-blue  outline-none transition",
          error && "border-red-600",
          className
        )}
      />
    </div>
  )
}
export default FormInput
