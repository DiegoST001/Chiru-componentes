import React from "react";
import { cntl } from "@/utils/cntl";
import { Image } from "@/components/atoms/Image";
import { Text } from "@/components/atoms/Text";
import { Paragraph } from "@/components/atoms/Paragraph";

type CartServiceProps = {
  size?: "small" | "medium" | "large";
  cardWidth?: number;
  imageHeight?: number;
  dataService: {
    imageUrl: string;
    title: string;
    description: string;
    price: number;
    currency?: string;
    metaRight?: string;
  };
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
  dataService,
}: CartServiceProps) {
  const cls = getCardClass(size);
  const {
    imageUrl,
    title,
    description,
    price,
    currency = "S/.",
    metaRight,
  } = dataService;

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
            {currency} {price.toFixed(2)}
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
