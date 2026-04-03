import React from "react";
import clsx from "clsx";

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
}

const FormInput = ({value, label,  onChange, type, pattern, inputMode, name, className, maxLength, placeholder}: InputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input
        type={type}
        inputMode={inputMode}
        name={name}
        value={value}
        pattern={pattern}
        maxLength={maxLength}
        onChange={onChange}
        placeholder={placeholder}
        className={clsx("w-full px-4 py-3 rounded-l border border-gray-200 focus:border-theme-blue  outline-none transition",
          {className}
        )}
      />
    </div>
  )
}
export default FormInput
