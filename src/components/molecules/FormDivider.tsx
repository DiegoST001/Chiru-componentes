import React from "react";
import { Divider } from "@/components/atoms/Divider";
import { Text } from "@/components/atoms/Text";
import { cntl } from "@/utils/cntl";

type FormDividerProps = {
  text?: string;
  variant?: "solid" | "dashed";
  spacing?: "small" | "medium" | "large";
  textColor?: "default" | "muted" | "primary" | "danger";
  textSize?: "xs" | "sm" | "base" | "lg" | "xl";
};

function getFormDividerStyles() {
  return cntl`
    relative flex items-center justify-center w-full
  `;
}

function getTextContainerStyles() {
  return cntl`
    absolute bg-white px-4
  `;
}

function FormDivider({
  text,
  variant = "solid",
  spacing = "medium",
  textColor = "muted",
  textSize = "sm",
}: FormDividerProps) {
  return (
    <div className={getFormDividerStyles()}>
      <Divider 
        orientation="horizontal" 
        variant={variant} 
        spacing={spacing}
      />
      {text && (
        <div className={getTextContainerStyles()}>
          <Text 
            size={textSize}
            color={textColor}
            weight="medium"
          >
            {text}
          </Text>
        </div>
      )}
    </div>
  );
}

export { FormDivider };
