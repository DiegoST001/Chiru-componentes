import React from "react";
import { cntl } from "@/utils/cntl";
import { Button } from "@/components/atoms/Button";
import { Text } from "../atoms/Text";
import { Image } from "../atoms/Image";
import { Heading } from "../atoms/Heading";
import { Badge } from "../atoms/Badge";
import clsx from "clsx";
type CartProductProps = {
  size?: "small" | "medium";
  className?: string;
  product?: {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    discount?: number;
    brand?: string;
  };
};

function getCartProductStyles(size: CartProductProps["size"]) {
  return cntl`
    flex items-center justify-between gap-4 p-4 border-b border-gray-200 bg-white rounded-md shadow-sm
    ${size === "small" ? "text-sm" : ""}
    ${size === "medium" ? "text-base" : ""}
  `;
}

function CartProduct({
  size = "medium",
  product,
  className,
}: CartProductProps) {
  const price = product?.price || 0;
  const discount = product?.discount || 0;
  const discountedPrice = price - (price * discount) / 100;

  return (
    <div
      className={clsx(
        "bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200 max-w-sm w-full",
        className,
      )}
    >
      <div className="relative">
        <img
          src={product?.imageUrl}
          alt={product?.name}
          className="w-full h-64 object-cover bg-gray-200"
        />
        {discount > 0 && (
          <Badge
            variant="dangerInvert"
            size={size}
            className="absolute top-3 left-3"
          >
            {discount}%
          </Badge>
        )}
        {product?.brand && (
          <Badge variant="black" size={size} className="absolute top-3 right-3">
            {product.brand}
          </Badge>
        )}
      </div>

      <div className=" p-2 pt-0 sm:p-4 space-y-2">
        <h3
          className={`font-bold ${size === "small" ? "text-base" : size === "large" ? "text-2xl" : "text-lg"}`}
        >
          {product?.name || "Text-Title"}
        </h3>
        <p
          className={`text-gray-600 ${size === "small" ? "text-xs" : size === "large" ? "text-base" : "text-sm"}`}
        >
          {product?.description ||
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vulputate nulla at ante rhonc."}
        </p>

        <div className="flex flex-wrap sm:items-center max-sm:flex-col gap-x-4 gap-y-0.5">
          {discount > 0 && (
            <span
              className={`line-through text-gray-400 ${size === "small" ? "text-xs" : "text-sm"} max-w-md`}
            >
              S/. {price.toFixed(2)}
            </span>
          )}
          <span
            className={`font-bold text-gray-800 ${size === "small" ? "text-base" : size === "large" ? "text-2xl" : "text-xl"}`}
          >
            S/. {discountedPrice.toFixed(2)}
          </span>
        </div>

        <div>
          <Badge variant="successInvert" size={size}>
            Envío gratuito
          </Badge>
        </div>

        <div className="pt-2">
          <Button text="Agregar" variant="ghost" fullWidth size={size} />
        </div>
      </div>
    </div>
  );
}

export { CartProduct };
