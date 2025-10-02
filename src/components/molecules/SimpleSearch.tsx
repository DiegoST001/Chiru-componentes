import React, { useState } from 'react';
import { Icon } from '@/components/atoms/Icon';
import { MagnifyingGlass } from 'phosphor-react';
import { cntl } from '@/utils/cntl';

type SimpleSearchProps = {
  placeholder?: string;
  value?: string;
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  onSearch?: (value: string) => void;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

function getSimpleSearchStyles({ fullWidth, size }: { fullWidth?: boolean; size?: "small" | "medium" | "large" }) {
  const sizes = {
    small: "h-8",
    medium: "h-10",
    large: "h-12",
  };
  
  return cntl`
    relative flex items-center
    ${fullWidth ? "w-full" : "w-auto"}
    ${sizes[size || "medium"]}
    bg-white border border-gray-300 rounded-md
    focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500
    transition-colors
  `;
}

function getInputStyles({ size }: { size?: "small" | "medium" | "large" }) {
  const sizes = {
    small: "px-3 text-sm",
    medium: "px-4 text-base",
    large: "px-5 text-lg",
  };
  
  return cntl`
    flex-1 h-full border-none outline-none bg-transparent
    ${sizes[size || "medium"]}
    placeholder-gray-400
  `;
}

function getButtonStyles({ size }: { size?: "small" | "medium" | "large" }) {
  const sizes = {
    small: "w-8",
    medium: "w-10", 
    large: "w-12",
  };
  
  return cntl`
    h-full ${sizes[size || "medium"]}
    flex items-center justify-center
    bg-gray-100 hover:bg-gray-200
    border-l border-gray-300
    text-gray-500 hover:text-gray-700
    transition-colors
    rounded-r-md
  `;
}

function SimpleSearch({
  placeholder = "Buscar...",
  value = '',
  size = "medium",
  fullWidth = false,
  onSearch,
  onChange,
  disabled = false,
  className = '',
}: SimpleSearchProps) {
  const [searchValue, setSearchValue] = useState(value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    onChange?.(newValue);
  };

  const handleSearch = () => {
    if (disabled) return;
    onSearch?.(searchValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={`${getSimpleSearchStyles({ fullWidth, size })} ${className}`}>
      <input
        type="text"
        value={searchValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        className={getInputStyles({ size })}
      />
      
      <button
        onClick={handleSearch}
        disabled={disabled}
        className={getButtonStyles({ size })}
        type="button"
        title="Buscar"
      >
        <Icon tamano={size === "small" ? "small" : "medium"} color="default">
          <MagnifyingGlass />
        </Icon>
      </button>
    </div>
  );
}

export { SimpleSearch };
