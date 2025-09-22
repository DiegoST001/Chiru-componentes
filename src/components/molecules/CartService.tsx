import React from "react";
import { cntl } from "@/utils/cntl";
import { Image } from "@/components/atoms/Image";
import { Text } from "@/components/atoms/Text";
import { Paragraph } from "@/components/atoms/Paragraph";
import type { Service } from "@/features/service/model/service.model";

type CartServiceProps = {
  size?: "small" | "medium" | "large";
  cardWidth?: number;
  imageHeight?: number;
  service: Service;
  metaRightExtractor?: (service: Service) => string | undefined;
};

function getCardClass(size?: CartServiceProps["size"]) {
  return cntl`
    inline-block bg-white rounded-2xl shadow-sm overflow-hidden
    ${size === "small" ? "" : ""}
    ${size === "medium" ? "" : ""}
    ${size === "large" ? "" : ""}
  `;
}

function CartService({
  size = "medium",
  cardWidth = 360,
  imageHeight = 220,
  service,
  metaRightExtractor,
}: CartServiceProps) {
  const cls = getCardClass(size);

  // Extraer datos del modelo Service
  const title = service.name;
  const description = service.description;
  let price: number = 0;
  if (service.price === null || service.price === undefined || service.price === ("" as any)) {
    price = 0;
  } else if (typeof service.price === "string") {
    const parsed = parseFloat(service.price as any);
    price = isNaN(parsed) ? 0 : parsed;
  } else {
    price = Number(service.price) || 0;
  }
  const currency = service.currency ?? "S/.";
  const imageUrl = service.images?.[0]?.urlImage ||
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYwIiBoZWlnaHQ9IjIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWxsPScjZWVlJy8+PC9zdmc+";
  const metaRight = metaRightExtractor ? metaRightExtractor(service) : service.estimatedDuration;

  return (
    <div className={cls} style={{ width: cardWidth }}>
      <div className="relative w-full bg-gray-200" style={{ height: imageHeight }}>
        <Image
          src={imageUrl}
          alt={title}
          fit="cover"
          radius="none"
          className="absolute inset-0 w-full h-full"
        />
      </div>

      <div className="border-t border-gray-200" />

      <div className="p-4">
        <Text className="font-semibold text-lg">{title}</Text>

        <Paragraph
          variant="muted"
          size="small"
          leading="relaxed"
          className="mt-1"
          text={description}
        />

        <div className="mt-3 flex items-end justify-between">
          <Text size="xl" weight="bold" color="danger">
            {currency} {Number.isFinite(price) ? price.toFixed(2) : "0.00"}
          </Text>

            {metaRight && (
              <Paragraph variant="muted" size="small" className="ml-4 whitespace-nowrap">
                {metaRight}
              </Paragraph>
            )}
        </div>
      </div>
    </div>
  );
}

export { CartService };
export type { CartServiceProps };
