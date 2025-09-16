import React from "react";
import { cntl } from "@/utils/cntl"; // Utilidad para componer clases Tailwind de forma condicional

/**
 * ButtonProps define las propiedades que acepta el componente Button.
 * Hereda todos los atributos estándar de un <button> HTML y agrega props personalizados.
 */
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Variante de color y estilo del botón */
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  /** Tamaño del botón */
  size?: "small" | "medium" | "large";
  /** Deshabilita el botón */
  disabled?: boolean;
  /** Texto a mostrar en el botón */
  text?: string | "text";
  /** Icono React opcional a mostrar junto al texto */
  icon?: React.ReactNode;
  /** Si el botón debe ocupar todo el ancho disponible */
  fullWidth?: boolean;
  /** Posición del icono: izquierda o derecha */
  positionIcon?: "left" | "right";
};

/**
 * getButtonStyles genera las clases Tailwind para el botón según sus props.
 * - variant: define el color y estilo principal.
 * - size: define el tamaño.
 * - fullWidth: si el botón ocupa todo el ancho.
 * - disabled: aplica estilos de deshabilitado.
 * - positionIcon: define el orden de icono/texto (izquierda/derecha).
 */

function getButtonStyles(
  variant: ButtonProps["variant"],
  size: ButtonProps["size"],
  fullWidth?: boolean,
  disabled?: boolean,
  positionIcon?: "left" | "right"
) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none gap-4 cursor-pointer";
  const stylesVariant = {
    primary: cntl`bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-700`,
    secondary: cntl`bg-gray-600 text-white hover:bg-gray-700 focus-visible:ring-gray-500`,
    outline: cntl`border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-500`,
    ghost: cntl`text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-500`,
    danger: cntl`bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500`,
  };
  const sizes = {
    small: "h-8 px-3 text-sm",
    medium: "h-10 px-4 text-base",
    large: "h-12 px-6 text-lg",
  };
  const position = {
    left: "flex-row",
    right: "flex-row-reverse",
  };
  return cntl`
    ${baseStyles} 
    ${stylesVariant[variant || "primary"]} 
    ${sizes[size || "medium"]} 
    ${fullWidth ? "w-full" : ""}
    ${position[positionIcon || "left"]}
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
  `;
}

/**
 * Componente Button atómico.
 * - Muestra un botón estilizado con Tailwind.
 * - Si se pasa un icono, lo muestra junto al texto.
 * - El texto se centra si no hay icono.
 * - El icono puede ir a la izquierda o derecha según el prop positionIcon.
 */
function Button({
  variant,
  size,
  fullWidth,
  disabled,
  text,
  icon,
  positionIcon = "left",
  ...props
}: ButtonProps) {
  return (
    <button
      className={getButtonStyles(variant, size, fullWidth, disabled, positionIcon)}
      disabled={disabled}
      {...props}
    >
      {/* Si hay icono, lo muestra en la posición indicada */}
      {icon !== undefined && <span>{icon}</span>}
      {text !== undefined && <span>{text}</span>}
    </button>
  );
}

export { Button };
