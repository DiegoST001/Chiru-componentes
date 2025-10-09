import React, { useEffect, useState } from "react";
import { Icon } from "@/components/atoms/Icon";
import { MagnifyingGlass } from "phosphor-react";
import { cntl } from "@/utils/cntl";

type SearchBarProps = {
  placeholder?: string;
  value?: string;
  dropdownOptions?: Array<{ value: string; label: string } | string>; // usamos solo ["Productos","Servicios"]
  defaultDropdownValue?: string; // default: "Productos"
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  onSearch?: (searchValue: string, selectedOption?: string) => void; // Enter / botón
  onChange?: (value: string) => void; // al tipear
  onDropdownSelect?: (option: string) => void; // cambio de tipo
  disabled?: boolean;
  showSearchButton?: boolean;
};

function getSearchBarStyles({ fullWidth }: { fullWidth?: boolean }) {
  return cntl`
    flex flex-row items-center w-full rounded-full bg-white overflow-hidden
    focus-within:ring-1 focus-within:ring-gray-200 focus-within:border-gray-200
    ${fullWidth ? "w-full" : "w-auto"} h-10 lg:h-12
  `;
}

function getSelectStyles({ size }: { size?: "small" | "medium" | "large" }) {
  return cntl`
    border-none bg-gray-200 focus:ring-0 focus:border-none appearance-none
    text-transparent lg:text-gray-900
    px-0 min-w-[32px] w-[32px] h-full
    lg:px-3 lg:min-w-[140px] lg:w-auto
    transition-all rounded-l-full
  `;
}

function getInputStyles({ size }: { size?: "small" | "medium" | "large" }) {
  const sizes = {
    small: "h-8 px-2 text-xs",
    medium: "h-10 px-3 text-sm",
    large: "h-12 px-4 text-base",
  };
  return cntl`flex-1 border-none bg-gray-100 focus:ring-0 outline-none h-full ${sizes[size || "medium"]}`;
}

function getButtonStyles({ size }: { size?: "small" | "medium" | "large" }) {
  const sizes = { small: "w-8", medium: "w-10", large: "w-12" };
  return cntl`
    h-full ${sizes[size || "medium"]} bg-gray-200 hover:bg-gray-200 transition-colors
    flex items-center justify-center border-none rounded-r-full text-gray-600 hover:text-gray-800
  `;
}

function normalizeOptions(
  options?: Array<{ value: string; label: string } | string>
): { value: string; label: string }[] {
  const base = options && options.length > 0 ? options : ["Productos", "Servicios"];
  return base.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
}

function SearchBar({
  placeholder = "Buscar",
  value,
  dropdownOptions,
  defaultDropdownValue = "Productos",
  size = "medium",
  fullWidth = false,
  onSearch,
  onChange,
  onDropdownSelect,
  disabled = false,
  showSearchButton = true,
}: SearchBarProps) {
  const [searchValue, setSearchValue] = useState(value ?? "");
  const [selectedOption, setSelectedOption] = useState(defaultDropdownValue);

  useEffect(() => {
    if (typeof value === "string") setSearchValue(value);
  }, [value]);

  const options = normalizeOptions(dropdownOptions);

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setSelectedOption(newValue);
    onDropdownSelect?.(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    onChange?.(newValue);
  };

  const handleSearch = () => {
    if (disabled) return;
    onSearch?.(searchValue.trim(), selectedOption);
  };

  return (
    <div className={getSearchBarStyles({ fullWidth })}>
      <div className="relative h-full flex items-center">
        <select
          value={selectedOption}
          onChange={handleDropdownChange}
          disabled={disabled}
          className={getSelectStyles({ size })}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-gray-900">
              {option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      <input
        type="text"
        value={searchValue}
        onChange={handleInputChange}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder={placeholder}
        disabled={disabled}
        className={getInputStyles({ size })}
      />

      {showSearchButton && (
        <button onClick={handleSearch} disabled={disabled} className={getButtonStyles({ size })} type="button" title="Buscar">
          <Icon tamano={size === "small" ? "small" : "medium"} color="red">
            <MagnifyingGlass />
          </Icon>
        </button>
      )}
    </div>
  );
}

export { SearchBar };
