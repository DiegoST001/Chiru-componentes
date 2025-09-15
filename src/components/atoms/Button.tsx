import React from "react";
import { cntl } from "@/utils/cntl"; //ayuda tailwind css

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  text?: string | "text";
  icon?: React.ReactNode;
  fullWidth?: boolean;
  positionIcon?: "left" | "right";
};

function getButtonStyles(
  variant: ButtonProps["variant"],
  size: ButtonProps["size"],
  fullWidth?: boolean,
  disabled?: boolean,
) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none gap-4 cursor-pointer";
  const stylesVariant = {
    primary: cntl`bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-700`,
    secondary: cntl`bg-gray-600 text-white hover:bg-gray-700 focus-visible:ring-gray-500`,
    outline: cntl`border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-500`,
    ghost: cntl`text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-500`,
    danger: cntl`bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500`,
  };
  const sizes = {
    small: "h-8 px-3 text-sm",
    medium: "h-10 px-4 text-base",
    large: "h-12 px-6 text-lg",
  };
  const position = {
    left: "flex-row",
    right: "lex-row-reverse",
  };
  return cntl`
        ${baseStyles} 
        ${stylesVariant[variant || "primary"]} 
        ${sizes[size || "medium"]} 
        ${fullWidth ? "w-full" : ""}
        ${position["left"]}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}

    `;
}

function Button({
  variant,
  size,
  fullWidth,
  disabled,
  text,
  icon,
}: ButtonProps) {
  return (
    <button className={getButtonStyles(variant, size, fullWidth, disabled)} disabled={disabled}>
      {icon !== undefined && <span>{icon}</span>}
      {text}
    </button>
    
  );
}

export { Button };
