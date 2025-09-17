import React from "react";
import { cntl } from "@/utils/cntl";

type StatusDotProps = {
  color?: "green" | "red" | "yellow" | "gray";
};

function StatusDot({ color = "green" }: StatusDotProps) {
  const colors = {
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-400",
    gray: "bg-gray-400",
  };

  return (
    <span
      className={cntl`inline-block w-3 h-3 rounded-full ${colors[color]}`}
    />
  );
}

export { StatusDot };
