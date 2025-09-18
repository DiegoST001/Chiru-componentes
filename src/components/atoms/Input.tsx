import React from "react";
import { cntl } from "@/utils/cntl";

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  /** Tipo de input: text, email, number, date... */
  type?: "text" | "email" | "number" | "password" | "date";
  /** Ícono opcional (phosphor-react) */
  icon?: React.ReactNode;
  /** Posición del ícono */
  positionIcon?: "left" | "right";
  /** Si ocupa todo el ancho */
  fullWidth?: boolean;
  /** Tamaño */
  size?: "small" | "medium" | "large";
  /** Variante */
  variant?: "default" | "outline";
};

/**
 * Genera estilos dinámicos para el input
 */
function getInputStyles({
  type,
  size,
  variant,
  fullWidth,
  positionIcon,
  disabled,
}: Partial<InputProps>) {
  const baseStyles =
    "flex items-center rounded-md border transition focus-within:ring-2 focus-within:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    default: cntl`bg-gray-100 border-gray-300 text-gray-900 focus-within:border-indigo-500`,
    outline: cntl`bg-white border-gray-400 text-gray-900 focus-within:border-indigo-500`,
  };

  const sizes = {
    small: "h-8 px-2 text-sm gap-2",
    medium: "h-10 px-3 text-base gap-2",
    large: "h-12 px-4 text-lg gap-3",
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

/**
 * Input atómico con soporte para íconos
 */
function Input({
  type = "text",
  icon,
  positionIcon = "left",
  fullWidth,
  size,
  variant,
  disabled,
  ...props
}: InputProps) {
  return (
    <div className={getInputStyles({ type, size, variant, fullWidth, positionIcon, disabled })}>
      {icon && <span className="text-gray-500">{icon}</span>}
      <input
        type={type}
        className="w-full bg-transparent outline-none"
        disabled={disabled}
        {...props}
      />
    </div>
  );
}

export { Input };