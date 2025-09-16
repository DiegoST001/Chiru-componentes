import React from "react";

type SwitchProps = {
  /** Estado del switch */
  checked: boolean;
  /** Cambiar estado */
  onChange: (checked: boolean) => void;
  /** Label opcional */
  label?: string;
  /** Deshabilitado */
  disabled?: boolean;
};

function Switch({ checked, onChange, label, disabled }: SwitchProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
          checked ? "bg-indigo-600" : "bg-gray-300"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </div>
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  );
}

export { Switch };
