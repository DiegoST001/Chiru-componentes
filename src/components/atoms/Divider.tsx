import React from "react";
import { cntl } from "@/utils/cntl"; 

type DividerProps = {

    orientation?: "horizontal" | "vertical";

  variant?: "solid" | "dashed";

  spacing?: "small" | "medium" | "large";
};

function getDividerStyles(
  orientation: DividerProps["orientation"],
  variant: DividerProps["variant"],
  spacing: DividerProps["spacing"]
) {
  const baseStyles = "bg-gray-300";

  const variants = {
    solid: "border-solid",
    dashed: "border-dashed",
  };

  const spacings = {
    small: "my-2 mx-2",
    medium: "my-4 mx-4",
    large: "my-6 mx-6",
  };

  const orientationStyles = {
    horizontal: "w-full h-px border-t",
    vertical: "h-full w-px border-l inline-block",
  };

  return cntl`
    ${baseStyles} 
    ${variants[variant || "solid"]} 
    ${spacings[spacing || "medium"]}
    ${orientationStyles[orientation || "horizontal"]}
  `;
}

function Divider({ orientation, variant, spacing }: DividerProps) {
  return <div className={getDividerStyles(orientation, variant, spacing)} />;
}

export { Divider };
