import React from "react";
import { cntl } from "@/utils/cntl";
import { Image } from "../atoms/Image";
import { Text } from "../atoms/Text";

type CardPromotionsProps = {
  size?: "small" | "medium" | "large";
  dataCard?: {
    imageUrl: string;
    title: string;
    subtitle?: string;
    rightText?: string;
    price?: number;
    badge?: string;
  };
};

function getCardStyles(size: CardPromotionsProps["size"]) {
  return cntl`
    inline-block w-[260px] bg-white rounded-md shadow-sm
    ${size === "small" ? "" : ""}
    ${size === "medium" ? "" : ""}
    ${size === "large" ? "" : ""}
  `;
}

function CardPromotions({ size = "medium", dataCard }: CardPromotionsProps) {
  const cls = getCardStyles(size);

  const {
    imageUrl = "https://placehold.co/260x300/E5E7EB/6B7280?text=ProductImage%20260x300",
    title = "Text-Title",
    subtitle = "Text-Title",
    rightText = "Text-Title",
    price = 0,
    badge = "BADGE-2",
  } = dataCard ?? {};

  const priceText = `S/. ${(price ?? 0).toFixed(2)}`;

  return (
    <div className={cls}>
      <div className="p-4">
        <div className="relative mx-auto w-[228px] h-[300px] overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={title}
            fit="cover"
            radius="none"
            className="absolute inset-0 w-full h-full bg-transparent"
          />
        </div>
      </div>

      <div className="px-4 pb-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Text className="font-semibold truncate">{title}</Text>
            <Text className="text-gray-600 truncate">{subtitle}</Text>
          </div>

          <div className="shrink-0 text-right">
            <div className="flex items-baseline justify-end gap-2 whitespace-nowrap">
              <Text className="font-medium truncate max-w-[110px]">{rightText}</Text>
              <Text className="font-semibold">{priceText}</Text>
            </div>

            <div className="mt-4">
              <span className="inline-flex items-center rounded-lg border px-3 py-1 text-xs font-semibold tracking-wide">
                {badge}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CardPromotions };
