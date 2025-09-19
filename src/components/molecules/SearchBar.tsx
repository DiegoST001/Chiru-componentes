import React, { useState } from "react";
import { Input } from "@/components/atoms/Input";
import { Select } from "@/components/atoms/Select";
import { Icon } from "@/components/atoms/Icon";
import { MagnifyingGlass } from "phosphor-react";
import { cntl } from "@/utils/cntl";

type SearchBarProps = {
  /** Texto placeholder para el input */
  placeholder?: string;
  /** Valor inicial del input */
  value?: string;
  /** Opciones del dropdown */
  dropdownOptions?: string[] | { value: string; label: string }[];
  /** Valor inicial del dropdown */
  defaultDropdownValue?: string;
  /** Tamaño del componente */
  size?: "small" | "medium" | "large";
  /** Ocupa todo el ancho */
  fullWidth?: boolean;
  /** Callback cuando se hace búsqueda */
  onSearch?: (searchValue: string, selectedOption?: string) => void;
  /** Callback cuando cambia el input */
  onChange?: (value: string) => void;
  /** Callback cuando se selecciona una opción del dropdown */
  onDropdownSelect?: (option: string) => void;
  /** Componente deshabilitado */
  disabled?: boolean;
  /** Mostrar botón de búsqueda */
  showSearchButton?: boolean;
};

function getSearchBarStyles({ fullWidth }: { fullWidth?: boolean }) {
  return cntl`
    flex items-center gap-0 rounded-md border border-gray-400 bg-white overflow-hidden
    focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500
    ${fullWidth ? "w-full" : "w-auto"}
  `;
}

function getSelectStyles({ size }: { size?: "small" | "medium" | "large" }) {
  const sizes = {
    small: "h-8 px-2 text-sm",
    medium: "h-10 px-3 text-base",
    large: "h-12 px-4 text-lg",
  };

  return cntl`
    border-0 border-r border-gray-300 rounded-none bg-gray-50 focus:ring-0 focus:border-gray-300
    ${sizes[size || "medium"]}
  `;
}

function getInputStyles({ size }: { size?: "small" | "medium" | "large" }) {
  const sizes = {
    small: "h-8 px-3 text-sm",
    medium: "h-10 px-4 text-base", 
    large: "h-12 px-4 text-lg",
  };

  return cntl`
    flex-1 border-0 bg-transparent focus:ring-0 outline-none
    ${sizes[size || "medium"]}
  `;
}

function getButtonStyles({ size }: { size?: "small" | "medium" | "large" }) {
  const sizes = {
    small: "h-8 w-8",
    medium: "h-10 w-10",
    large: "h-12 w-12",
  };

  return cntl`
    ${sizes[size || "medium"]}
    bg-gray-100 hover:bg-gray-200 transition-colors
    flex items-center justify-center border-l border-gray-300
    text-gray-600 hover:text-gray-800
  `;
}

function SearchBar({
  placeholder = "Buscar...",
  value,
  dropdownOptions,
  defaultDropdownValue,
  size = "medium",
  fullWidth = false,
  onSearch,
  onChange,
  onDropdownSelect,
  disabled = false,
  showSearchButton = true,
}: SearchBarProps) {
  const [searchValue, setSearchValue] = useState(value || "");
  const [selectedOption, setSelectedOption] = useState(defaultDropdownValue || "");

  // Procesar opciones del dropdown
  const processedOptions = dropdownOptions?.map((option) => {
    if (typeof option === "string") {
      return { value: option, label: option };
    }
    return option;
  }) || [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    onChange?.(newValue);
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setSelectedOption(newValue);
    onDropdownSelect?.(newValue);
  };

  const handleSearch = () => {
    onSearch?.(searchValue, selectedOption);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={getSearchBarStyles({ fullWidth })}>
      {/* Dropdown Select */}
      {dropdownOptions && dropdownOptions.length > 0 && (
        <select
          value={selectedOption}
          onChange={handleDropdownChange}
          disabled={disabled}
          className={getSelectStyles({ size })}
        >
          <option value="">Selecciona</option>
          {processedOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {/* Search Input */}
      <input
        type="text"
        value={searchValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        className={getInputStyles({ size })}
      />

      {/* Search Button */}
      {showSearchButton && (
        <button
          onClick={handleSearch}
          disabled={disabled}
          className={getButtonStyles({ size })}
          type="button"
        >
          <Icon tamano={size === "small" ? "small" : "medium"}>
            <MagnifyingGlass />
          </Icon>
        </button>
      )}
    </div>
  );
}

export { SearchBar };