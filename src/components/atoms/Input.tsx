import React from "react";
import { cntl } from "@/utils/cntl";

type InputTypes = React.InputHTMLAttributes<HTMLInputElement>["type"];

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  type?: InputTypes;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "fill";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
};

function getInputStyle(
  variant?: InputProps["variant"],
  size?: InputProps["size"],
  disabled?: boolean,
  fullWidth?: boolean
) {
  const baseStyles =
    "inline-flex items-center justify-start font-medium rounded-md transition-colors disabled:pointer-events-none gap-4";

  const stylesVariant = {
    primary: cntl`bg-indigo-50 text-gray-900 border border-indigo-300 focus-visible:ring-indigo-700`,
    secondary: cntl`bg-gray-100 text-gray-800 border border-gray-300 focus-visible:ring-0`,
    outline: cntl`border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-50 focus-visible:ring-indigo-700`,
    ghost: cntl`text-gray-900 bg-transparent hover:bg-gray-100 focus-visible:ring-gray-500`,
    danger: cntl`bg-red-50 text-red-800 border border-red-300 focus-visible:ring-red-500`,
    fill: cntl`bg-gray-50 text-gray-900 focus-visible:ring-gray-500 border border-gray-200`,
  };

  const sizeStyles = {
    small: "h-8 px-3 text-sm",
    medium: "h-10 px-4 text-base",
    large: "h-12 px-6 text-lg",
  };

  return cntl`
    ${baseStyles}
    ${stylesVariant[variant || "primary"]}
    ${sizeStyles[size || "medium"]}
    ${fullWidth ? "w-full" : ""}
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
  `;
}

const Input: React.FC<InputProps> = ({
  type = "text",
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  className,
  ...rest
}) => {
  const inputClassName = getInputStyle(variant, size, disabled, fullWidth);

  return (
    <input
      type={type}
      className={cntl`${inputClassName} ${className || ""}`}
      disabled={disabled}
      {...rest}
    />
  );
};

export { Input };
