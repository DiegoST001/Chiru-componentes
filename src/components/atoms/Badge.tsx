import React from "react";
import { cntl } from "@/utils/cntl";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "success" | "danger" | "warning" | "info" | "successInvert" | "dangerInvert" | "black";
  size?: "small" | "medium";
  className?: string; // Permite pasar clases personalizadas
};

function Badge({ variant = "default", size = "medium", className = "", children, ...props }: BadgeProps) {
  const variants = {
    default: cntl`bg-gray-200 text-gray-800`,
    black: cntl`bg-gray-900 text-white`,
    success: cntl`bg-green-100 text-green-600`,
    successInvert: cntl`bg-green-700 text-white`,
    danger: cntl`bg-red-100 text-red-600`,
    dangerInvert: cntl`bg-red-600 text-white`,
    warning: cntl`bg-yellow-100 text-yellow-600`,
    info: cntl`bg-blue-100 text-blue-600`,
  };

  const sizes = {
    small: "px-2 py-0.5 text-xs",
    medium: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={cntl`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
