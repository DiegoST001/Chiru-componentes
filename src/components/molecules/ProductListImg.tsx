import React from "react";
import { Image } from "@/components/atoms/Image";

type ImgProduct = {
  id: number | string;
  imgUrl: string;
};

type ProductListImgProps = {
  products: ImgProduct[];
  /** Dirección de la lista: vertical (columna) u horizontal (fila) */
  direction?: "vertical" | "horizontal";
  /** Tamaño que se usará en las imágenes */
  size?: "small" | "medium" | "large";
};

const sizeMap: Record<NonNullable<ProductListImgProps["size"]>, number> = {
  small: 96, // 24 * 4 = w-24
  medium: 192, // 48 * 4 = w-48
  large: 288, // 72 * 4 = w-72
};

function ProductListImg({
  products,
  direction = "vertical",
  size = "medium",
}: ProductListImgProps) {
  const itemSize = sizeMap[size];
  const min5 = itemSize * 5 + 40; // sumamos un gap aproximado

  const layout =
    direction === "vertical"
      ? `flex flex-col gap-6 max-h-[${min5}px] overflow-y-auto`
      : `flex flex-row flex-wrap gap-6 max-w-[${min5}px] overflow-x-auto`;

  return (
    <div className={layout}>
      {products.map((product) => (
        <div
          key={product.id}
          className="flex flex-col items-center text-center"
        >
          <Image
            src={product.imgUrl}
            alt={`Producto ${product.id}`}
            size={size}
            radius="md"
            shadow
          />
        </div>
      ))}
    </div>
  );
}

export { ProductListImg };
export type { ProductListImgProps, ImgProduct };
