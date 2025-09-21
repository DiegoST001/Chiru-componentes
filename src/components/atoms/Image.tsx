import React from "react";
import { cntl } from "@/utils/cntl"; // tagged template para clases

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  /** Tamaño visual del contenedor (si no se pasa, no fuerza ancho/alto) */
  size?: "small" | "medium" | "large";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  shadow?: boolean;
  bordered?: boolean;
  fit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  wrapperStyle?: React.CSSProperties;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getImageWrapper(
  size?: ImageProps["size"],
  radius?: ImageProps["radius"],
  shadow?: boolean,
  bordered?: boolean
) {
  const base = "inline-block overflow-hidden";
  const sizes = {
    small: "w-24 h-24",
    medium: "w-48 h-48",
    large: "w-72 h-72",
  };
  const radii = {
    none: "rounded-none",
    sm: "rounded",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };
  return cntl`
    ${base}
    ${size ? sizes[size] : ""}
    ${radii["none"]}
    ${shadow ? "shadow" : ""}
    ${bordered ? "ring-1 ring-gray-200" : ""}
  `;
}

function getImageClass(fit?: ImageProps["fit"]) {
  const obj = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
    none: "object-none",
    "scale-down": "object-scale-down",
  };
  return cntl`w-full h-full ${obj[fit || "cover"]}`;
}

/** Átomo: Image (wrapper + <img/>) */
function Image({
  size,
  radius,
  shadow,
  bordered,
  fit = "cover",
  className,
  wrapperStyle,
  alt,
  ...props
}: ImageProps) {
  if (!alt) {
    console.warn("[Image] Se recomienda proveer `alt` por accesibilidad.");
  }

  const wrapper = getImageWrapper(size, radius, shadow, bordered);
  const imgCls = getImageClass(fit);

  return (
    <span className={cx(wrapper, className)} style={wrapperStyle}>
      <img className={imgCls} alt={alt || ""} {...props} />
    </span>
  );
}

export { Image };
export type { ImageProps };
