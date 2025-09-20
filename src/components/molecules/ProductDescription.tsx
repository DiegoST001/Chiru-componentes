// src/components/molecules/ProductDescription.tsx
import React from "react";
import { Heading } from "../atoms/Heading";
import { Paragraph } from "../atoms/Paragraph";
import { Tag } from "../atoms/Tag";
import { Text } from "../atoms/Text";

type ProductDescriptionProps = {
  name: string;
  description: string;
  provider: string;
  verified?: boolean;
};

function ProductDescription({
  name,
  description,
  provider,
  verified = false,
}: ProductDescriptionProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Nombre del producto */}
      <Heading  level={2} color="default">
        {name}
      </Heading>

      {/* Descripción */}
      <Paragraph size="medium" variant="muted" leading="relaxed">
        {description}
      </Paragraph>

      {/* Proveedor + Tag en la misma línea */}
      <div className="flex justify-between items-center w-full">
        <Text size="sm" weight="medium" color="default">
          {provider}
        </Text>
        {verified && <Tag text="Verificado" variant="success" textColor="white" />}
      </div>
    </div>
  );
}

export { ProductDescription };
export type { ProductDescriptionProps };
