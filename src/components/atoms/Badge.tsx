import React from "react";
import { cntl } from "@/utils/cntl";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "success" | "danger" | "warning" | "info";
  size?: "small" | "medium";
};

function Badge({ variant = "default", size = "medium", children, ...props }: BadgeProps) {
  const variants = {
    default: "bg-gray-200 text-gray-800",
    success: "bg-green-100 text-green-700",
    danger: "bg-red-100 text-red-700",
    warning: "bg-yellow-100 text-yellow-700",
    info: "bg-blue-100 text-blue-700",
  };

  const sizes = {
    small: "px-2 py-0.5 text-xs",
    medium: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={cntl`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
