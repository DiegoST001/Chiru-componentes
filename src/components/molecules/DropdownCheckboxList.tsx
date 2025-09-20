import React, { useState } from "react";
import { Checkbox } from "@/components/atoms/Checkbox";
import { Text } from "@/components/atoms/Text";

type DropdownCheckboxListProps = {
  label: string;
  options: { id: string; name: string }[];
  selected: string[];
  onChange: (id: string) => void;
};

export function DropdownCheckboxList({ label, options, selected, onChange }: DropdownCheckboxListProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full bg-gray-200 rounded-md">
      <button
        className="w-full flex justify-between items-center px-4 py-2 rounded"
        onClick={() => setOpen((o) => !o)}
      >
        {label}
        <span className="ml-2">&#9662;</span>
      </button>
      {open && (
        <ul className="absolute left-0 mt-2 w-full rounded shadow-lg z-10 p-4 bg-gray-200">
          {options.map((opt) => (
            <li key={opt.id} className="flex items-center gap-2 mb-2">
              <Checkbox
                checked={selected.includes(opt.id)}
                onChange={() => onChange(opt.id)}
              />
              <Text size="base" color="default">{opt.name}</Text>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}