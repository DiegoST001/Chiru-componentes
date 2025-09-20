import React from "react";
import { Text } from "../atoms/Text";
import { Icon } from "../atoms/Icon";
import { Check } from "phosphor-react";

export type ProductSpecsListProps = {
  specs: string[];
  checkColor?: "success" | "primary" | "danger" | "warning" | "info";
};

function ProductSpecsList({ specs, checkColor = "success" }: ProductSpecsListProps) {
  return (
    <ul className="list-none p-0 m-0 flex flex-col gap-2">
      {specs.map((spec, idx) => (
        <li key={idx} className="flex items-center gap-2">
          <Icon tamano="small" variant={checkColor}>
            <Check weight="bold" />
          </Icon>
          <Text size="base" weight="medium" color="default">
            {spec}
          </Text>
        </li>
      ))}
    </ul>
  );
}

export { ProductSpecsList };