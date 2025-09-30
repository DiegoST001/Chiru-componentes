import React from "react";
import { cntl } from "@/utils/cntl";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  variant?: "default" | "success" | "danger";
  size?: "small" | "medium" | "large"; 
};

function Checkbox({ variant = "default", size = "small", ...props }: CheckboxProps) {
  const sizes = {
    small: "w-3 h-3",
    medium: "w-4 h-4",
    large: "w-5 h-5",
  };

  const variants = {
    default: "text-gray-700",
    success: "text-green-600",
    danger: "text-red-600",
  };

  return (
    <input
      type="checkbox"
      className={cntl`rounded ${sizes[size]} ${variants[variant]}`}
      {...props}
    />
  );
}

export { Checkbox };
