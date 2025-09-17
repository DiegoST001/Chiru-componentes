import React from "react";
import { cntl } from "@/utils/cntl";

type HelperTextProps = React.HTMLAttributes<HTMLSpanElement> & {
  type?: "default" | "helper" | "error";
};

function HelperText({ type = "default", children, ...props }: HelperTextProps) {
  const styles = {
    default: "text-gray-600 text-sm",
    helper: "text-gray-500 text-xs",
    error: "text-red-600 text-sm",
  };

  return (
    <span className={cntl`${styles[type]}`} {...props}>
      {children}
    </span>
  );
}

export { HelperText };
