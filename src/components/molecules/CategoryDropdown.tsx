import React from "react";
import { Icon } from "@/components/atoms/Icon";
import { List } from "phosphor-react";
import { cntl } from "@/utils/cntl";

type CategoryDropdownProps = {
  options?: string[] | { value: string; label: string }[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
};

function getCategoryDropdownStyles() {
  return cntl`

    flex items-center gap-2 px-4 py-2
    bg-gray-100 hover:bg-gray-200
    border border-gray-300 rounded-md
    transition-colors
    text-gray-700
    relative
    max-md:hidden
  `;
}

function getIconStyles() {
  return cntl`
    text-gray-600 pointer-events-none
  `;
}

function getSelectStyles() {
  return cntl`
    appearance-none bg-transparent border-none outline-none
    text-sm font-medium text-gray-700
    pr-4 cursor-pointer
    flex-1
  `;
}

function CategoryDropdown({
  options = [],
  defaultValue = "Todas las categorías",
  value,
  onChange,
  className,
}: CategoryDropdownProps) {
  // Procesar opciones
  const processedOptions = options.length > 0 ? options.map((option) => {
    if (typeof option === "string") {
      return { value: option, label: option };
    }
    return option;
  }) : [{ value: "todas", label: "Todas las categorías" }];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={cntl`${getCategoryDropdownStyles()} ${className || ""}`}>
      <Icon variant="default" tamano="small" className={getIconStyles()}>
        <List />
      </Icon>
      
      <select
        value={value || defaultValue}
        onChange={handleChange}
        className={getSelectStyles()}
      >
        {processedOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export { CategoryDropdown };