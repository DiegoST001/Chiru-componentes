import React from "react";
import { cntl } from "@/utils/cntl";

type PaginationItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  disabled?: boolean;
};

function PaginationItem({ active = false, disabled = false, children, ...props }: PaginationItemProps) {
  const base =
    "w-9 h-9 flex items-center justify-center rounded-md border text-sm font-medium transition-colors select-none";

  const activeStyle = active
    ? "bg-red-600 text-white border-red-600"
    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100";

  const disabledStyle = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      className={cntl`${base} ${activeStyle} ${disabledStyle}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export { PaginationItem };
