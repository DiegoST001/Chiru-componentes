import React from "react";
import { cntl } from "@/utils/cntl";

type TabItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

function TabItem({ active = false, children, ...props }: TabItemProps) {
  const base = "px-4 py-2 text-sm font-medium border-b-2 transition-colors";
  const classes = active
    ? "border-indigo-600 text-indigo-600"
    : "border-transparent text-gray-500 hover:text-indigo-600 hover:border-gray-300";

  return (
    <button className={cntl`${base} ${classes}`} {...props}>
      {children}
    </button>
  );
}

export { TabItem };
