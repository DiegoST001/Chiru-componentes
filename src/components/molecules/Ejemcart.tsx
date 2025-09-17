import React from "react";
import { cntl } from "@/utils/cntl";
import { Button } from "../atoms/Button";
import { Text } from "../atoms/Text";
import { Image } from "../atoms/Image";

type CartProps = {
  size?: "small" | "medium" | "large";
  dataCart?: {
    id: string;
    urlImage: string;
    name: string;
    price: number;
    quantity: number;
  };
};

function getCartStyles(size: CartProps["size"]) {
  return cntl`
    flex items-center justify-between gap-4 p-4 border-b border-gray-200 bg-white rounded-md shadow-sm
    ${size === "small" ? "text-sm" : ""}
    ${size === "medium" ? "text-base" : ""}
    ${size === "large" ? "text-lg p-6" : ""}
  `;
}

function EjemCart({ size = "medium", dataCart }: CartProps) {
  const total = (dataCart?.price || 0) * (dataCart?.quantity || 0);

  return (
    <div className={getCartStyles(size)}>
      <div className="flex items-center gap-4 flex-1">
        <Image
          src={dataCart?.urlImage}
          alt={dataCart?.name || "Product"}
          width={60}
          height={60}
          className="rounded-md w-16 h-16 object-cover"
        />
        <div className="flex flex-col">
          <Text className="font-semibold">{dataCart?.name}</Text>
          <Text className="text-gray-500">
            {dataCart?.quantity} x ${dataCart?.price.toFixed(2)}
          </Text>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <Text className="font-bold text-primary">${total.toFixed(2)}</Text>
        <Button variant="primary" size={size} text=" comprar"></Button>
      </div>
    </div>
  );
}

export { EjemCart };
