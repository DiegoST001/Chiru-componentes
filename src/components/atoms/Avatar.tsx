import React from "react";
import { cntl } from "@/utils/cntl"; 

type AvatarProps = {

  src: string;

  alt: string;

  size?: "xs" | "sm" | "md" | "lg" | "xl";

  shape?: "circle" | "rounded" | "square";
};

function getAvatarStyles(size: AvatarProps["size"], shape: AvatarProps["shape"]) {
  const baseStyles = "object-cover";

  const sizes = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const shapes = {
    circle: "rounded-full",
    rounded: "rounded-lg",
    square: "rounded-none",
  };

  return cntl`
    ${baseStyles}
    ${sizes[size || "md"]}
    ${shapes[shape || "circle"]}
  `;
}


function Avatar({ src, alt, size, shape }: AvatarProps) {
  return <img src={src} alt={alt} className={getAvatarStyles(size, shape)} />;
}

export { Avatar };
