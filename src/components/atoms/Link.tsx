import React from "react";
import { cntl } from "@/utils/cntl"; // tagged template para clases

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** Color/tono del link */
  variant?: "primary" | "secondary" | "muted";
  /** Tamaño tipográfico */
  size?: "small" | "medium" | "large";
  /** true: subrayado permanente; false: sólo en hover */
  underline?: boolean;
  /** Texto a mostrar (paridad con Button) */
  text?: string | "text";
  /** Simular deshabilitado (bloquea click y navegación) */
  disabled?: boolean;
};

// util para unir clases
function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getLinkStyles(
  variant: LinkProps["variant"],
  size: LinkProps["size"],
  underline?: boolean,
  disabled?: boolean
) {
  const base =
    "inline-flex items-center justify-center font-medium rounded transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
    "cursor-pointer";

  const stylesVariant = {
    primary: cntl`text-indigo-600 hover:text-indigo-700 focus-visible:ring-indigo-700`,
    secondary: cntl`text-gray-900 hover:text-gray-700 focus-visible:ring-gray-500`,
    muted: cntl`text-gray-500 hover:text-gray-700 focus-visible:ring-gray-500`,
  };

  const sizes = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  const underlineCls = underline
    ? "underline underline-offset-4 decoration-2"
    : "no-underline hover:underline underline-offset-4";

  return cntl`
    ${base}
    ${stylesVariant[variant || "primary"]}
    ${sizes[size || "medium"]}
    ${underlineCls}
    ${disabled ? "opacity-50 pointer-events-none cursor-not-allowed" : ""}
  `;
}

function Link({
  variant,
  size,
  underline = false,
  disabled,
  target,
  rel,
  className,
  text,
  onClick,
  children,
  ...props
}: LinkProps) {
  // seguridad por defecto si target="_blank"
  const safeRel = target === "_blank" ? rel ?? "noopener noreferrer" : rel;

  // bloquear navegación si está "deshabilitado"
  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick?.(e);
  };

  const cls = cx(getLinkStyles(variant, size, underline, disabled), className);

  return (
    <a
      className={cls}
      target={target}
      rel={safeRel}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : props.tabIndex}
      onClick={handleClick}
      {...props}
    >
      {/* prioriza `text`; si no hay, usa `children` */}
      {text !== undefined ? <span>{text}</span> : children}
    </a>
  );
}

export { Link };
