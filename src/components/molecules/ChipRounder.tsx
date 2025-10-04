import React from "react";
import { cntl } from "@/utils/cntl";
import { Check } from "phosphor-react";

type ChipVariant = "default" | "primary" | "success" | "muted";
type ChipSize = "small" | "medium";

export type ChipRounderProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: ChipVariant;
  size?: ChipSize;
  disabled?: boolean;
  checked?: boolean; // muestra un check
  active?: boolean; // estado "en proceso" / seleccionado
  className?: string;
};

function getChipStyles(
  variant: ChipRounderProps["variant"],
  size: ChipRounderProps["size"],
  disabled?: boolean,
  checked?: boolean,
  active?: boolean,
  extra?: string
) {
  const base = cntl`inline-flex items-center gap-2 rounded-full font-semibold transition-colors select-none`;
  const sizes = {
    small: "px-2 py-0.5 text-xs",
    medium: "px-3 py-1 text-sm",
  };
  const variants: Record<ChipVariant, string> = {
    default: " ",
    primary: "bg-blue-600 text-white",
    success: "bg-green-100 text-green-800",
    muted: "bg-white text-gray-700 border border-gray-200",
  };

  const checkedStyles = checked ? "ring-2 ring-gray-900 bg-gray-900 text-gray-50" : "";
  const activeStyles = active ? "ring-2 ring-gray-500 text-gray-900" : "";
  const disabledStyles = disabled ? "opacity-50 pointer-events-none cursor-not-allowed" : "cursor-pointer";

  return cntl`
    ${base}
    ${sizes[size || "medium"]}
    ${variants[variant || "default"]}
    ${checkedStyles}
    ${activeStyles}
    ${disabledStyles}
    ${extra || ""}
  `;
}

function ChipRounder({
  children,
  variant = "default",
  size = "medium",
  disabled = false,
  checked = false,
  active = false,
  className,
  ...rest
}: ChipRounderProps) {
  // aumentar tamaño del check según el tamaño del chip
  const checkClass = size === "small" ? "w-4 h-4" : "w-6 h-6";
  const checkSize = size === "small" ? 16 : 24;

  return (
    <div
      role={rest.onClick ? "button" : undefined}
      aria-pressed={active ? true : undefined}
      aria-disabled={disabled ? true : undefined}
      className={getChipStyles(variant, size, disabled, checked, active, className)}
      {...rest}
    >
      {checked && (
        <Check
          className={`${checkClass} text-green-400`}
          weight="bold"
          size={checkSize}
          aria-hidden="true"
        />
      )}
      <span className="truncate">{children}</span>
    </div>
  );
}

export { ChipRounder };