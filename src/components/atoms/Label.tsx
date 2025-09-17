import React from "react";
import { cntl } from "@/utils/cntl"; 


type LabelProps = {
  variant?: "error" | "normal";

  size?: "small" | "medium" | "large";

  fontWeight?: "normal" | "medium" | "bold";

  text: string;
};

function getLabelStyles(
  variant: LabelProps["variant"],
  size: LabelProps["size"],
  fontWeight: LabelProps["fontWeight"]
) {
  const baseStyles = "inline-block"; 
  const stylesVariant = {
    normal: cntl`text-gray-900`,
    error: cntl`text-red-600`,
  };

   const sizes = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };
  const weights = {
    normal: "font-normal",
    medium: "font-medium",
    bold: "font-bold",
  };

  return cntl`
    ${baseStyles}
    ${stylesVariant[variant || "normal"]}
    ${sizes[size || "medium"]}
    ${weights[fontWeight || "normal"]}
  `;
}


function Label({ variant, size, fontWeight, text }: LabelProps) {
  return <span className={getLabelStyles(variant, size, fontWeight)}>{text}</span>;
}

export { Label };
