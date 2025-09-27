import React from "react";
import { cntl } from "@/utils/cntl";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "dangerInverse" | "ofBackgroundRed";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  text?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  positionIcon?: "left" | "right";
  className?: string; 
};

function getButtonStyles(
  variant: ButtonProps["variant"],
  size: ButtonProps["size"],
  fullWidth?: boolean,
  disabled?: boolean,
  positionIcon?: "left" | "right"
) {
  const baseStyles =
    cntl`inline-flex items-center justify-center font-extralight md:font-light lg:font-normal rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none gap-2 cursor-pointer`;
  const stylesVariant = {
    primary: cntl`bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-700`,
    secondary: cntl`bg-gray-600 text-white hover:bg-gray-700 focus-visible:ring-gray-500`,
    outline: cntl`border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-500`,
    ghost: cntl`bg-gray-900 text-white hover:bg-gray-800 transition`,
    danger: cntl`bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500`,
    dangerInverse: cntl`bg-red-100 text-red-600 hover:bg-red-50 focus-visible:ring-red-500`,
    ofBackgroundRed: cntl`bg-white text-red-600 hover:bg-red-50`,
  };
  const sizes = {
    small: "h-8 px-3 text-sm",
    medium: "h-10 px-4 text-base",
    large: "h-12 px-6 text-lg",
  };
  const position = {
    left: "flex-row",
    right: "flex-row-reverse",
  };
  return cntl`
    ${baseStyles} 
    ${stylesVariant[variant || "primary"]} 
    ${sizes[size || "medium"]} 
    ${fullWidth ? "w-full" : ""}
    ${position[positionIcon || "left"]}
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
  positionIcon = "left",
  className, 
  children,
  ...props
}: ButtonProps & { children?: React.ReactNode }) {
  return (
    <button
      className={`${getButtonStyles(variant, size, fullWidth, disabled, positionIcon)} ${className || ""}`} 
      disabled={disabled}
      {...props}
    >
      {children ? (
        children
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {text && <span>{text}</span>}
        </>
      )}
    </button>
  );
}

export { Button };
