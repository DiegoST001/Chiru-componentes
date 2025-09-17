import React, { useState } from "react";
import { cntl } from "@/utils/cntl";

type TooltipProps = {
  text: string;
  position?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
};

function Tooltip({ text, position = "top", children }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  const base = "absolute z-10 px-2 py-1 text-xs text-white bg-black rounded";
  const positions = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-1",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-1",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-1",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-1",
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span className={cntl`${base} ${positions[position]}`}>{text}</span>
      )}
    </div>
  );
}

export { Tooltip };
