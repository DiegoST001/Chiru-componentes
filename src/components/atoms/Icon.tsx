import React from "react";
import type { IconProps } from "phosphor-react";
import { cntl } from "@/utils/cntl";

type CustomIconProps = IconProps & {
  tamano?: "small" | "medium" | "large";
  variant?: "default" | "primary" | "success" | "danger" | "warning" | "info";
};

function Icon({ tamano = "medium", variant = "default", children, weight = "regular", ...props }: CustomIconProps) {
  const sizes: Record<NonNullable<CustomIconProps["tamano"]>, number> = {
    small: 16,
    medium: 24,
    large: 32,
  };

  const variants: Record<NonNullable<CustomIconProps["variant"]>, string> = {
    default: "text-gray-700",
    primary: "text-indigo-600",
    success: "text-green-600",
    danger: "text-red-600",
    warning: "text-yellow-600",
    info: "text-blue-600",
  };

  // ✅ Arreglo: Maneja correctamente los elementos React
  if (!React.isValidElement(children)) {
    return null;
  }

  return (
    <span className={cntl`inline-flex ${variants[variant]}`}>
      {React.cloneElement(children as React.ReactElement<any>, {
        size: sizes[tamano],
        weight,
        ...props,
      })}
    </span>
  );
}

export { Icon };