import React from "react";
import { Text } from "../atoms/Text";

export type ProductDescriptionListProps = {
  title?: string;
  descriptions: string[];
};

export function ProductDescriptionList({ title = "Descripción del producto", descriptions }: ProductDescriptionListProps) {
  return (
    <div className="mt-6">
      <Text size="base" weight="bold" color="default" className="mb-2">{title}</Text>
      <ul className="list-disc pl-6">
        {descriptions.map((desc, idx) => (
          <li key={idx} className="mb-1 text-gray-700">
            {desc}
          </li>
        ))}
      </ul>
    </div>
  );
}
