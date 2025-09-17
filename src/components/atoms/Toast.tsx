import React from "react";
import { cntl } from "@/utils/cntl";

type ToastProps = {
  message: string;
  variant?: "success" | "error" | "info" | "warning";
};

function Toast({ message, variant = "info" }: ToastProps) {
  const variants = {
    success: "bg-green-100 text-green-700 border border-green-300",
    error: "bg-red-100 text-red-700 border border-red-300",
    info: "bg-blue-100 text-blue-700 border border-blue-300",
    warning: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  };

  return (
    <div
      className={cntl`px-4 py-2 rounded shadow-md text-sm font-medium ${variants[variant]}`}
    >
      {message}
    </div>
  );
}

export { Toast };
