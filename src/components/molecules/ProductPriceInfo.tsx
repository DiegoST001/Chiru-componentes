import React from "react";
import { Heading } from "../atoms/Heading";
import { Text } from "../atoms/Text";
import { Badge } from "../atoms/Badge";

export type ProductPriceInfoProps = {
  currentPrice: string;
  oldPrice?: string;
  saving?: string;
  freeShipping?: boolean;
};

function ProductPriceInfo({
  currentPrice,
  oldPrice,
  saving,
  freeShipping = false,
}: ProductPriceInfoProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Precio actual */}
      <Heading as="h3" level={3} color="primary">
        {currentPrice}
      </Heading>

      {/* Precio anterior y ahorro */}
      <div className="flex items-center gap-2">
        {oldPrice && (
          <Text size="sm" weight="normal" color="muted" style={{ textDecoration: "line-through" }}>
            {oldPrice}
          </Text>
        )}
        {saving && (
          <Text size="sm" weight="medium" color="danger">
            Ahorras {saving}
          </Text>
        )}
      </div>

      {/* Badge de envío */}
      <div>
        {freeShipping ? (
          <Badge variant="success" size="medium">Envío gratis</Badge>
        ) : (
          <Badge variant="danger" size="medium">Envío no gratis</Badge>
        )}
      </div>
    </div>
  );
}

export { ProductPriceInfo };