import React from "react";
import { Minus, Plus, Trash } from "phosphor-react";
import { Button } from "../atoms/Button";
import { Image } from "../atoms/Image";
import { Text } from "../atoms/Text";

export type ProductCartItem = {
  id: number | string;
  name: string;
  brand?: string;
  imageUrl?: string;
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  quantity?: number;
  maxQuantity?: number;
  inStock?: boolean;
};

type ProductCartProps = {
  product: ProductCartItem;
  selected?: boolean;
  onSelect?: (id: ProductCartItem["id"], value: boolean) => void;
  onQuantityChange?: (id: ProductCartItem["id"], qty: number) => void;
  onRemove?: (id: ProductCartItem["id"]) => void;
  className?: string;
};

function formatCurrency(v: number) {
  return `S/ ${v.toFixed(2)}`;
}

function ProductCart({
  product,
  selected = false,
  onSelect,
  onQuantityChange,
  onRemove,
  className,
}: ProductCartProps) {
  const qty = product.quantity ?? 1;
  const max = product.maxQuantity ?? 10;

  const inc = () => onQuantityChange?.(product.id, Math.min(qty + 1, max));
  const dec = () => onQuantityChange?.(product.id, Math.max(qty - 1, 1));
  const toggle = (e: React.ChangeEvent<HTMLInputElement>) =>
    onSelect?.(product.id, e.target.checked);

  return (
    <article
      className={`w-full bg-white rounded-lg border border-gray-100 p-4 flex items-center gap-2 md:gap-3 ${className || ""}`}
      data-id={product.id}
    > 
    {/* seccion2 */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        {/* <input
          type="checkbox"
          checked={selected}
          onChange={toggle}
          className="w-5 h-5 mt-1 text-blue-600"
          aria-label={`Seleccionar ${product.name}`}
        /> */}
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
          <Image
            src={product.imageUrl ?? "/placeholder.png"}
            alt={product.name}
            fit="cover"
            radius="none"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col items-start gap-2">
        <Text weight="bold" className="truncate">
          {product.name}
        </Text>
        {product.brand && (
          <Text size="sm" color="muted" className="block">
            {product.brand}
          </Text>
        )}

        <div className="mt-2 flex items-center gap-2">
          <span className="inline-block text-xs font-light lg:font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded">
            Retira mañana
          </span>
          {product.discountPercent ? (
            <span className="ml-2 inline-block text-xs font-semibold bg-red-100 text-red-600 px-2 py-0.5 rounded">
              -{product.discountPercent}%
            </span>
          ) : null}
        </div>
      </div>

          {/* seccion1 */}
      <div className="flex flex-col items-end gap-3 min-w-[140px]">
        <div className="text-right">
          <Text weight="bold" className="text-lg">
            {formatCurrency(product.price)}
          </Text>
          {product.oldPrice !== undefined && (
            <div className="text-xs text-gray-400 line-through">
              {formatCurrency(product.oldPrice)}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={dec}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700"
            aria-label="Disminuir cantidad"
          >
            <Minus className="text-sm" />
          </button>
          <div className="text-sm">{qty}</div>
          <button
            type="button"
            onClick={inc}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700"
            aria-label="Aumentar cantidad"
          >
            <Plus className="text-sm md:text-base" />
          </button>
        </div>

        <div>
          <button
            type="button"
            onClick={() => onRemove?.(product.id)}
            className="text-sm text-gray-500 hover:text-gray-800"
            aria-label="Eliminar producto"
          >
            <Trash weight="regular" className="text-xl text-red-600" />
          </button>
        </div>
      </div>
    </article>
  );
}

export { ProductCart };

export type { ProductCartProps, ProductCartItem };