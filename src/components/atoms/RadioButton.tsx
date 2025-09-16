import React from "react";
import { cntl } from "@/utils/cntl";

type RadioButtonSize = "small" | "medium" | "large";

type RadioButtonProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  /** Texto del label */
  label?: string;
  /** Tamaño */
  size?: RadioButtonSize;
};

function RadioButton({ label, size = "medium", disabled, ...props }: RadioButtonProps) {
  const sizes = {
    small: "h-3 w-3",
    medium: "h-4 w-4",
    large: "h-5 w-5",
  };

  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        disabled={disabled}
        className={`${sizes[size]} text-indigo-600 focus:ring-indigo-500 border-gray-300 disabled:opacity-50`}
        {...props}
      />
      {label && <span className={`text-${size === "small" ? "sm" : size === "large" ? "lg" : "base"}`}>{label}</span>}
    </label>
  );
}

export { RadioButton };
