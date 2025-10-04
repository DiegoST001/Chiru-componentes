import React from "react";
import { cntl } from "@/utils/cntl";
import { cx } from "@/utils/cx";

type SpinnerProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Tamaño del spinner */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Color del spinner */
  color?: "gray" | "primary" | "white";
  /** Texto que acompaña al spinner (visible y para accesibilidad) */
  label?: string;
};

/** Clases del contenedor (alineación + color de texto para el label) */
function getContainerClass(color?: SpinnerProps["color"]) {
  const base = "inline-flex items-center gap-2";
  const text = {
    gray: "text-gray-700",
    primary: "text-indigo-700",
    white: "text-white",
  };
  return cntl`${base} ${text[color || "primary"]}`;
}

/** Clases del círculo giratorio (tamaño + grosor + color) */
function getWheelClass(size?: SpinnerProps["size"], color?: SpinnerProps["color"]) {
  const base =
    "animate-spin rounded-full border-solid border-current border-t-transparent";

  // Tamaños (dimensiones) + grosor de borde
  const dim = {
    xs: "h-4 w-4",
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-10 w-10",
  }[size || "md"];

  // Grosor: fino para xs/sm/md, más grueso para lg/xl
  const thick =
    size === "lg" || size === "xl" ? "border-4" : "border-2";

  // Color del trazo (usamos text-* para que border-current adopte ese color)
  const tone = {
    gray: "text-gray-400",
    primary: "text-indigo-600",
    white: "text-white",
  }[color || "primary"];

  return cntl`${base} ${dim} ${thick} ${tone}`;
}

/** Átomo: Spinner */
function Spinner({ size, color = "primary", label = "Cargando…", className, ...props }: SpinnerProps) {
  const container = getContainerClass(color);
  const wheel = getWheelClass(size, color);

  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label={label}
      className={cx(container, className)}
      {...props}
    >
      <span className={wheel} />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}

export { Spinner };
export type { SpinnerProps };
