import React from "react";
import { cntl } from "@/utils/cntl";
import { cx } from "@/utils/cx";

type ParagraphProps = React.HTMLAttributes<HTMLParagraphElement> & {
  /** Color/tono del texto */
  variant?: "default" | "muted" | "danger" | "success" | "info";
  /** Tamaño */
  size?: "small" | "medium" | "large";
  /** Alineación */
  align?: "left" | "center" | "right" | "justify";
  /** Interlineado */
  leading?: "tight" | "normal" | "relaxed";
  text?: string | "text";
};

function getParagraphClass(
  variant?: ParagraphProps["variant"],
  size?: ParagraphProps["size"],
  align?: ParagraphProps["align"],
  leading?: ParagraphProps["leading"]
) {
  const base = "antialiased";
  const variants = {
    default: "text-gray-900",
    muted: "text-gray-600",
    danger: "text-red-600",
    success: "text-green-600",
    info: "text-blue-600",
  };
  const sizes = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };
  const aligns = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  };
  const leadings = {
    tight: "leading-tight",
    normal: "leading-normal",
    relaxed: "leading-relaxed",
  };
  return cntl`
    ${base}
    ${variants[variant || "default"]}
    ${sizes[size || "medium"]}
    ${aligns[align || "left"]}
    ${leadings[leading || "normal"]}
  `;
}

/** Átomo: Paragraph */
function Paragraph({ variant, size, align, leading, text, className, children, ...props }: ParagraphProps) {
  const cls = cx(getParagraphClass(variant, size, align, leading), className);
  return (
    <p className={cls} {...props}>
      {text !== undefined ? text : children}
    </p>
  );
}

export { Paragraph };
export type { ParagraphProps };
