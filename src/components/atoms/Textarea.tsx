import React from "react";
import { cntl } from "@/utils/cntl";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  /** Variante de estilos */
  variant?: "default" | "outline";
  /** Tamaño del textarea */
  size?: "small" | "medium" | "large";
  /** Ícono opcional (ej: para notas, comentarios, etc.) */
  icon?: React.ReactNode;
  /** Posición del ícono */
  positionIcon?: "left" | "right";
  /** Ocupa todo el ancho */
  fullWidth?: boolean;
  /** Deshabilitado */
  disabled?: boolean;
  /** Cantidad de filas inicial */
  rows?: number;
};

function getTextareaStyles({
  variant,
  size,
  fullWidth,
  positionIcon,
  disabled,
}: Partial<TextareaProps>) {
  const baseStyles =
    "flex items-start rounded-md border transition focus-within:ring-2 focus-within:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    default: cntl`bg-gray-100 border-gray-300 text-gray-900 focus-within:border-indigo-500`,
    outline: cntl`bg-white border-gray-400 text-gray-900 focus-within:border-indigo-500`,
  };

  const sizes = {
    small: "px-2 py-1 text-sm gap-2",
    medium: "px-3 py-2 text-base gap-2",
    large: "px-4 py-3 text-lg gap-3",
  };

  const positions = {
    left: "flex-row",
    right: "flex-row-reverse",
  };

  return cntl`
    ${baseStyles}
    ${variants[variant || "default"]}
    ${sizes[size || "medium"]}
    ${positions[positionIcon || "left"]}
    ${fullWidth ? "w-full" : "w-auto"}
    ${disabled ? "opacity-50" : ""}
  `;
}

function Textarea({
  variant,
  size,
  fullWidth,
  disabled,
  icon,
  positionIcon = "left",
  rows = 3,
  ...props
}: TextareaProps) {
  return (
    <div
      className={getTextareaStyles({
        variant,
        size,
        fullWidth,
        positionIcon,
        disabled,
      })}
    >
      {icon && <span className="mt-2 text-gray-500">{icon}</span>}
      <textarea
        rows={rows}
        disabled={disabled}
        className="w-full bg-transparent outline-none resize-none"
        {...props}
      />
    </div>
  );
}

export { Textarea };
