import React from "react";
import { cntl } from "@/utils/cntl"; // tagged template para clases

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  /** Tamaño visual del contenedor */
  size?: "small" | "medium" | "large";
  /** Radio de borde */
  radius?: "none" | "sm" | "md" | "lg" | "full";
  /** Sombra */
  shadow?: boolean;
  /** Borde sutil */
  bordered?: boolean;
  /** Ajuste del objeto dentro del contenedor */
  fit?: "cover" | "contain" | "fill" | "none" | "scale-down";
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getImageWrapper(size?: ImageProps["size"], radius?: ImageProps["radius"], shadow?: boolean, bordered?: boolean) {
  const base = "inline-block overflow-hidden bg-white";
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
    ${sizes[size || "medium"]}
    ${radii[radius || "md"]}
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
function Image({ size, radius, shadow, bordered, fit = "cover", className, alt, ...props }: ImageProps) {
  // alt es obligatorio semánticamente
  if (!alt) {
    // si tu linter no permite console.warn, quítalo
    console.warn("[Image] Se recomienda proveer `alt` por accesibilidad.");
  }

  const wrapper = getImageWrapper(size, radius, shadow, bordered);
  const imgCls = getImageClass(fit);

  return (
    <span className={cx(wrapper, className)}>
      <img className={imgCls} alt={alt || ""} {...props} />
    </span>
  );
}

export { Image };
export type { ImageProps };
