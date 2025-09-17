import React from "react";
import { cntl } from "@/utils/cntl";

type BreadcrumbItemProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  active?: boolean;
};

function BreadcrumbItem({ active = false, children, ...props }: BreadcrumbItemProps) {
  const base = "text-sm font-medium transition-colors";
  const classes = active
    ? "text-indigo-600 cursor-default"
    : "text-gray-600 hover:text-indigo-600";

  return (
    <a className={cntl`${base} ${classes}`} {...props}>
      {children}
    </a>
  );
}

export { BreadcrumbItem };
