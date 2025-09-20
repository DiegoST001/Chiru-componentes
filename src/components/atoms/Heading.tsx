import React from "react";
import { cntl } from "@/utils/cntl";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingTag;
  color?: keyof typeof colors;
  level?: keyof typeof sizes;
  children: React.ReactNode;
}

const sizes = {
  1: "text-4xl font-bold",
  2: "text-3xl font-bold",
  3: "text-2xl font-semibold",
  4: "text-xl font-semibold",
  5: "text-lg font-medium",
  6: "text-base font-medium",
};

const colors = {
  default: "text-gray-900",
  primary: "text-indigo-600",
  danger: "text-red-600",
  white: "text-white",
};

function Heading({
  as = "h2",
  color = "default",
  level = 2,
  children,
  ...props
}: HeadingProps) {
  const Tag = as;

  return (
    <Tag className={cntl`${sizes[level]} ${colors[color]}`} {...props}>
      {children}
    </Tag>
  );
}

export { Heading };
