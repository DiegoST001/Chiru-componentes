import React from "react";
import { cntl } from "@/utils/cntl";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  /** Opciones del select */
  options: { value: string; label: string }[];
  /** Variante */
  variant?: "default" | "outline";
  /** Tamaño */
  size?: "small" | "medium" | "large";
  /** Texto del label */
  label?: string;
  /** Ocupa todo el ancho */
  fullWidth?: boolean;
};

function getSelectStyles({ variant, size, fullWidth, disabled }: Partial<SelectProps>) {
  const base =
    "rounded-md border transition focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    default: "bg-gray-100 border-gray-300 text-gray-900",
    outline: "bg-white border-gray-400 text-gray-900",
  };

  const sizes = {
    small: "h-8 px-2 text-sm",
    medium: "h-10 px-3 text-base",
    large: "h-12 px-4 text-lg",
  };

  return cntl`
    ${base}
    ${variants[variant || "default"]}
    ${sizes[size || "medium"]}
    ${fullWidth ? "w-full" : ""}
    ${disabled ? "opacity-50" : ""}
  `;
}

function Select({ options, label, variant, size, fullWidth, disabled, ...props }: SelectProps) {
  return (
    <div className={`flex flex-col gap-1 ${fullWidth ? "w-full" : "w-auto"}`}>
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      <select className={getSelectStyles({ variant, size, fullWidth, disabled })} disabled={disabled} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export { Select };
