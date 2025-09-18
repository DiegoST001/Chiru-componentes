import React from "react";
import { cntl } from "@/utils/cntl";
import { Button } from "@/components/atoms/Button";
import { Badge } from "../atoms/Badge";
import clsx from "clsx";

type CartProductProps = {
  size?: "small" | "medium";
  className?: string;
  imageHeight?: string; // <-- Nueva prop opcional para adaptar la altura de la imagen si es necesario
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
    flex flex-col bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200
    ${size === "small" ? "text-sm" : ""}
    ${size === "medium" ? "text-base" : ""}

  `;
}
  // ${size === "large" ? "text-lg" : ""}

function CartProduct({
  size = "medium",
  imageHeight = "h-64",
  product,
  className,
}: CartProductProps) {
  const price = product?.price || 0;
  const discount = product?.discount || 0;
  const discountedPrice = price - (price * discount) / 100;

  return (
    <div className={clsx(getCartProductStyles(size), className)}>
      <div className="relative">
        <img
          src={product?.imageUrl}
          alt={product?.name}
          className={clsx("w-full object-cover bg-gray-200", imageHeight)}
        />
        {discount > 0 && (
          <Badge variant="dangerInvert" size={size} className="absolute top-3 left-3">
            {discount}%
          </Badge>
        )}
        {product?.brand && (
          <Badge variant="black" size={size} className="absolute top-3 right-3">
            {product.brand}
          </Badge>
        )}
      </div>

      <div className="p-2 pt-0 sm:p-4 space-y-2">
        <h3
          className={clsx(
            "font-bold",
            size === "small" && "text-base",
            size === "medium" && "text-lg",
            size === "large" && "text-2xl"
          )}
        >
          {product?.name || "Text-Title"}
        </h3>

        <p
          className={clsx(
            "text-gray-600",
            size === "small" && "text-xs",
            size === "medium" && "text-sm",
            size === "large" && "text-base"
          )}
        >
          {product?.description ||
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vulputate nulla at ante rhonc."}
        </p>

        <div className="flex flex-wrap sm:items-center max-sm:flex-col gap-x-4 gap-y-0.5">
          {discount > 0 && (
            <span
              className={clsx(
                "line-through text-gray-400 max-w-md",
                size === "small" ? "text-xs" : "text-sm"
              )}
            >
              S/. {price.toFixed(2)}
            </span>
          )}
          <span
            className={clsx(
              "font-bold text-gray-800",
              size === "small" && "text-base",
              size === "medium" && "text-xl",
              size === "large" && "text-2xl"
            )}
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
