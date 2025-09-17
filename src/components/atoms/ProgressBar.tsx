import React from "react";
import { cntl } from "@/utils/cntl";

type ProgressBarProps = {
  value: number; // 0-100
  color?: "indigo" | "green" | "red" | "yellow";
};

function ProgressBar({ value, color = "indigo" }: ProgressBarProps) {
  return (
    <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
      <div
        className={cntl`h-full transition-all ${{
          indigo: "bg-indigo-600",
          green: "bg-green-600",
          red: "bg-red-600",
          yellow: "bg-yellow-500",
        }[color]}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export { ProgressBar };
