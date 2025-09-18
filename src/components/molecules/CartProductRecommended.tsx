import React from "react";
import { cntl } from "@/utils/cntl";
import clsx from "clsx";
import { Text } from "../atoms/Text";
import { Heading } from "../atoms/Heading";
import { Image } from "../atoms/Image";

function getRecommendedProductStyles() {
  return cntl`
    flex flex-col bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200
  `;
}

type CartProductRecommendedProps = {
  className?: string;
  size?: "small" | "medium";
  product?: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    description: string;
    discount?: number;
    brand?: string;
  };
};

function CartProductRecommended({ className, product, size = "medium" }: CartProductRecommendedProps) {
  return (
    <div className={clsx(getRecommendedProductStyles(), className)}>
      <Image
        src={product?.imageUrl}
        alt={product?.name}
        className="w-full h-48 object-cover bg-gray-300"
      />
      <div className="p-4">
        <Heading level={4} className="mb-2 text-gray-900">
          {product?.name ?? "Text-Title"}
        </Heading>

        <Text className="text-xl font-bold text-black mb-1">
          S/. {product?.price?.toFixed(2) ?? "0.00"}
        </Text>

        <Text className="text-sm text-gray-500">
          {product?.description ??
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vulputate nulla at ante rhonc."}
        </Text>
      </div>
    </div>
  );
}

export { CartProductRecommended };
