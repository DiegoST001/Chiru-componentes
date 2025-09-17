import React from "react";
import { cntl } from "@/utils/cntl";

type TextProps = React.HTMLAttributes<HTMLParagraphElement> & {
  /** Tamaño del texto */
  size?: "xs" | "sm" | "base" | "lg" | "xl";
  /** Peso de la fuente */
  weight?: "normal" | "medium" | "semibold" | "bold";
  /** Color */
  color?: "default" | "muted" | "primary" | "danger";
};

function Text({ size = "base", weight = "normal", color = "default", children, ...props }: TextProps) {
  const sizes = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const weights = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  const colors = {
    default: "text-gray-900",
    muted: "text-gray-500",
    primary: "text-indigo-600",
    danger: "text-red-600",
  };

  return (
    <p className={cntl`${sizes[size]} ${weights[weight]} ${colors[color]}`} {...props}>
      {children}
    </p>
  );
}

export { Text };
