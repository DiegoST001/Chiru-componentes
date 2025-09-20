import React from "react";
import { FreeShippingToggle } from "../molecules/FreeShippingToggle";
import { DropdownCheckboxList } from "../molecules/DropdownCheckboxList";
import { Select } from "../atoms/Select";
import { Text } from "../atoms/Text";

export type ProductFiltersPanelProps = {
  freeShipping: boolean;
  onFreeShippingChange: (checked: boolean) => void;
  categories: { value: string; label: string }[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  brands: { id: string; name: string }[];
  selectedBrands: string[];
  onBrandChange: (id: string) => void;
  colors: { value: string; label: string }[];
  selectedColor: string;
  onColorChange: (value: string) => void;
  sizes: { value: string; label: string }[];
  selectedSize: string;
  onSizeChange: (value: string) => void;
};

export function ProductFiltersPanel({
  freeShipping,
  onFreeShippingChange,
  categories,
  selectedCategory,
  onCategoryChange,
  brands,
  selectedBrands,
  onBrandChange,
  colors,
  selectedColor,
  onColorChange,
  sizes,
  selectedSize,
  onSizeChange,
}: ProductFiltersPanelProps) {
  return (
  <div className="bg-gray-100 p-4 rounded flex flex-col gap-4 w-[300px] transition-all duration-300">
      <Text size="lg" weight="bold" color="default" className="mb-2">Text-Title</Text>
      <FreeShippingToggle checked={freeShipping} onChange={onFreeShippingChange} />
      <Select
        label="Categorías"
        options={categories}
        value={selectedCategory}
        onChange={e => onCategoryChange(e.target.value)}
        size="medium"
        variant="default"
        fullWidth
      />
      <DropdownCheckboxList
        label="Marcas"
        options={brands}
        selected={selectedBrands}
        onChange={onBrandChange}
      />
      <Select
        label="Color"
        options={colors}
        value={selectedColor}
        onChange={e => onColorChange(e.target.value)}
        size="medium"
        variant="default"
        fullWidth
      />
      <Select
        label="Talla"
        options={sizes}
        value={selectedSize}
        onChange={e => onSizeChange(e.target.value)}
        size="medium"
        variant="default"
        fullWidth
      />
    </div>
  );
}
