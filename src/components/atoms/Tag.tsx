import React from "react";
import { X } from "phosphor-react";
import { cntl } from "@/utils/cntl";

type TagProps = React.HTMLAttributes<HTMLDivElement> & {
  text: string;
  onRemove?: () => void;
  size?: "small" | "medium";
  rounded?: "none" | "md" | "lg" | "full";
  variant?: "default" | "primary" | "danger" | "success" | "warning" | "info";
  textColor?: "default" | "light" | "dark" | "white";
  weight?: "normal" | "medium" | "bold";
};

function Tag({
  text,
  onRemove,
  size = "medium",
  rounded = "full",
  variant = "default",
  textColor = "dark",
  weight = "bold",
  ...props
}: TagProps) {
  const variants = {
    default: "bg-gray-200",
    primary: "bg-blue-600",
    danger: "bg-red-600",
    success: "bg-green-600",
    warning: "bg-yellow-500",
    info: "bg-indigo-600",
  };

  const sizes = {
    small: "px-2 py-0.5 text-xs",
    medium: "px-3 py-1 text-sm",
  };

  const roundings = {
    none: "rounded-none",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  const textColors = {
    default: "text-gray-800",
    light: "text-gray-200",
    dark: "text-gray-900",
    white: "text-white",
  };

  const fontWeights = {
    normal: "font-normal",
    medium: "font-medium",
    bold: "font-bold",
  };

  return (
    <div
      className={cntl`
        inline-flex items-center gap-1
        ${variants[variant]}
        ${sizes[size]}
        ${roundings[rounded]}
        ${textColors[textColor]}
        ${fontWeights[weight]}
      `}
      {...props}
    >
      <span>{text}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="p-0.5 hover:bg-black/10 rounded-full"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export { Tag };
