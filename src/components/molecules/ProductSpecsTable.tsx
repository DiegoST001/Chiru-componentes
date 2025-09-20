import React from "react";
import { Text } from "../atoms/Text";

export type ProductSpecsTableProps = {
  title?: string;
  specs: { key: string; value: string }[];
};

export function ProductSpecsTable({ title = "Información Básica", specs }: ProductSpecsTableProps) {
  return (
    <div className="w-full bg-gray-50 rounded-lg p-4">
      <Text size="base" weight="bold" color="default" className="mb-2">{title}</Text>
      <table className="w-full text-left border-collapse">
        <tbody>
          {specs.map((spec, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}>
              <td className="py-2 px-4 font-medium text-gray-600 w-1/2">{spec.key}</td>
              <td className="py-2 px-4 text-gray-900 w-1/2">{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
