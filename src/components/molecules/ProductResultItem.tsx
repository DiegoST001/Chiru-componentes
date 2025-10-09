import React from "react";
import { Image } from "@/components/atoms/Image";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/atoms/Button";
import type { Product } from "@/features/product/models/product.model";

function priceNumber(p: Product): number {
  const any = (p as any).price || {};
  const v = any.amount ?? any.price ?? any.value ?? 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function formatCurrency(n: number) {
  return `S/ ${n.toFixed(2)}`;
}

export type ProductResultItemProps = {
  product: Product;
  /** (Opcional) locale para componer URL de detalle */
  locale?: string;
  /** (Opcional) callback para ver detalle. Si no se pasa, navega a /{locale}/productos/{id} */
  onOpenDetail?: (productId: string) => void;
};

export default function ProductResultItem({ product, locale = "es", onOpenDetail }: ProductResultItemProps) {
  const img = product.images?.[0]?.urlImage ?? "/placeholder.png";
  const brand = product.supplier?.name ?? product.category?.name;
  const price = priceNumber(product);

  const goDetail = () => {
    if (onOpenDetail) return onOpenDetail(product.id);
    // Ajusta esta ruta si tu detalle es distinto
    window.location.href = `/${locale}/productos/${product.id}`;
  };

  return (
    <article
      className="w-full bg-white rounded-lg border border-gray-100 p-4 flex items-center gap-3"
      data-id={product.id}
    >
      {/* imagen */}
      <div className="flex-shrink-0">
        <Image
          src={img}
          alt={product.name}
          fit="cover"
          className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50"
        />
      </div>

      {/* texto */}
      <div className="flex-1 min-w-0">
        <Text weight="bold" className="truncate">
          {product.name}
        </Text>
        {brand && (
          <Text size="sm" color="muted" className="truncate">
            {brand}
          </Text>
        )}

        <div className="mt-2 flex items-center gap-2">
          {(product.stock ?? 0) > 0 ? (
            <span className="inline-block text-xs font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded">
              En stock
            </span>
          ) : (
            <span className="inline-block text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              Sin stock
            </span>
          )}
        </div>
      </div>

      {/* precio + acción */}
      <div className="min-w-[150px] flex flex-col items-end gap-3">
        <div className="text-right">
          <Text weight="bold" className="text-lg">
            {formatCurrency(price)}
          </Text>
        </div>

        <Button variant="primary" size="small" text="Ver detalle" onClick={goDetail} />
      </div>
    </article>
  );
}
