import React from "react";
import { cntl } from "@/utils/cntl";
import { Button } from "@/components/atoms/Button";
import { Badge } from "../atoms/Badge";
import { Image } from "../atoms/Image";
import { Heading } from "../atoms/Heading";
import { Text } from "../atoms/Text";
import clsx from "clsx";
import type { Product } from "@/features/cart-item/model/cart-item.model";

export type ProductCard = Pick<Product, "id" | "name" | "description"> & {
  price: number; // sobrescribimos para normalizarlo
  imageUrl: string; // tomamos la primera imagen
  discount?: number;
  brand?: string;
};

type CartProductProps = {
  size?: "small" | "medium" | "large";
  className?: string;
  imageHeight?: string;
  product?: ProductCard;
  showFreeShipping?: boolean;
};

function getCartProductStyles(size: CartProductProps["size"]) {
  return cntl`
    flex flex-col bg-white rounded-lg overflow-hidden shadow-md border border-gray-200
    ${size === "small" ? "text-sm" : ""}
    ${size === "medium" ? "text-base" : ""}
  `;
}

function CartProduct({
  size = "medium",
  imageHeight = "h-64",
  product,
  className,
  showFreeShipping = true,
}: CartProductProps) {
  const price = product?.price || 0;
  const discount = Math.min(Math.max(product?.discount || 0, 0), 100);
  const discountedPrice = price - (price * discount) / 100;

  return (
    <div className={clsx(getCartProductStyles(size), "flex flex-col", className)}>
      <div className="relative">
        <Image
          src={product?.imageUrl || "/placeholder.png"}
          alt={product?.name || "Producto"}
          className={clsx("w-full bg-gray-200", imageHeight)}
          fit="cover"
          radius="none"
        />
        {discount > 0 && (
          <Badge
            variant="dangerInvert"
            size={size === "large" ? "medium" : size}
            className="absolute top-3 left-3"
          >
            {discount}%
          </Badge>
        )}
        {product?.brand && (
          <Badge
            variant="black"
            size={size === "large" ? "medium" : size}
            className="absolute top-3 right-3"
          >
            {product.brand}
          </Badge>
        )}
      </div>

      <div className="flex flex-col flex-grow p-2 pt-0 sm:p-4 space-y-2">
        <Heading
          level={3}
          className={clsx(
            size === "small" && "text-base",
            size === "medium" && "text-lg",
            size === "large" && "text-2xl"
          )}
        >
          {product?.name || "Text-Title"}
        </Heading>

        <Text
          className={clsx(
            "text-gray-600",
            size === "small" && "text-xs",
            size === "medium" && "text-sm",
            size === "large" && "text-base"
          )}
        >
          {product?.description ||
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
        </Text>

        <div className="flex flex-col gap-2 mt-auto">
          <div className="flex flex-wrap sm:items-center max-sm:flex-col gap-x-4 gap-y-0.5">
            {discount > 0 && (
              <Text
                className={clsx(
                  "line-through text-gray-400 max-w-md",
                  size === "small" ? "text-xs" : "text-sm"
                )}
              >
                S/. {price.toFixed(2)}
              </Text>
            )}
            <Text
              className={clsx(
                "font-bold text-gray-800",
                size === "small" && "text-base",
                size === "medium" && "text-lg",
                size === "large" && "text-2xl"
              )}
            >
              S/. {discountedPrice.toFixed(2)}
            </Text>
          </div>

          {showFreeShipping && (
            <Badge
              variant="successInvert"
              size={size === "large" ? "medium" : size}
              className="w-fit"
            >
              Envío gratuito
            </Badge>
          )}

          <Button text="Agregar" variant="ghost" fullWidth size={size} />
        </div>
      </div>
    </div>
  );
}

export { CartProduct };
