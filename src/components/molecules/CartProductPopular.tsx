import React from "react";
import { cntl } from "@/utils/cntl";
import { Image } from "../atoms/Image";
import { Text } from "../atoms/Text";

type CartProductPopularProps = {
  size?: "small" | "medium" | "large";
  dataProduct?: {
    id: string;
    urlImage: string;
    name: string;
    price: number;
    oldPrice?: number;
    rating: number;
    description?: string;
  };
};

function getCartProductPopularStyles(size: CartProductPopularProps["size"]) {
  return cntl`
    flex flex-col bg-white text-gray-900
  rounded-md shadow-md overflow-hidden p-3
    ${size === "small" ? "w-48" : ""}
    ${size === "medium" ? "w-60" : ""}
    ${size === "large" ? "w-72" : ""}
  `;
}

function CartProductPopular({ size = "medium", dataProduct }: CartProductPopularProps) {
  return (
    <div className={getCartProductPopularStyles(size)}>
      <Image
        src={dataProduct?.urlImage}
        alt={dataProduct?.name || "Product Image"}
        width={300}
        height={350}
        className="object-cover w-full h-52 rounded"
      />

      <div className="mt-3 flex flex-col gap-1">
        <Text weight="bold">{dataProduct?.name}</Text>

        <div className="flex items-center gap-2">
          <Text>S/. {dataProduct?.price.toFixed(2)}</Text>
          {dataProduct?.oldPrice && (
            <Text className="line-through text-gray-400 text-xs">
              S/. {dataProduct.oldPrice.toFixed(2)}
            </Text>
          )}
        </div>

        <div className="flex items-center gap-1">
          <span className="text-yellow-500">★</span>
          <Text>{dataProduct?.rating}</Text>
        </div>

        <Text size="sm" color="muted">
          {dataProduct?.description}
        </Text>
      </div>
    </div>
  );
}

export { CartProductPopular };
