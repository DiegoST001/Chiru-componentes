import React from "react";
import { cntl } from "@/utils/cntl";
import { Input } from "../atoms/Input";
import { Select } from "../atoms/Select";
import { Button } from "../atoms/Button";

// Tipo para los filtros
type FilterSupplierProps = {
  size?: "small" | "medium" | "large";
  onFilter?: (filters: { text: string; option: string; date: string }) => void;
};

function getFilterSupplierStyles(size: FilterSupplierProps["size"]) {
  return cntl`
    flex items-center gap-3 bg-transparent
    ${size === "small" ? "text-sm" : ""}
    ${size === "medium" ? "text-base" : ""}
    ${size === "large" ? "text-lg gap-4" : ""}
  `;
}

// Ícono calendario (inline SVG, sin librerías externas)
const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      d="M7 2v2H5a2 2 0 0 0-2 2v2h18V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7zm13 
             8H4v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10z"
    />
  </svg>
);

function FilterSupplier({ size = "medium", onFilter }: FilterSupplierProps) {
  const [text, setText] = React.useState("");
  const [option, setOption] = React.useState("");
  const [date, setDate] = React.useState("");

  const handleSubmit = () => {
    if (onFilter) {
      onFilter({ text, option, date });
    }
  };

  return (
    <div className={getFilterSupplierStyles(size)}>
      {/* Input texto */}
      <Input
        type="text"
        placeholder="Text-Title"
        size={size}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <Select
        size={(size as "small" | "medium" | "large") ?? "medium"}
        value={option}
        onChange={(e) => setOption(e.target.value)}
        options={[
          { value: "", label: "Text-Title" },
          { value: "opt1", label: "Opción 1" },
          { value: "opt2", label: "Opción 2" },
        ]}
      />

      {/* Input con calendario */}
      <Input
        type="date"
        placeholder="Text-Title"
        size={size}
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {/* Botón */}
      <Button
        text="text"
        variant="primary"
        size={size}
        onClick={handleSubmit}
      />
    </div>
  );
}

export { FilterSupplier };
