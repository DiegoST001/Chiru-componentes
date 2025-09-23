import React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
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
  onSelect?: (index: number) => void; // <-- Nuevo prop
  selectedIndex?: number; // <-- Nuevo prop
};

const sizeMap: Record<NonNullable<ProductListImgProps["size"]>, number> = {
  small: 64, // Mejor proporción cuadrada
  medium: 96, // 48 * 2 = w-48
  large: 128, // 72 * 2 = w-72
};

function ProductListImg({
  products,
  direction = "horizontal",
  size = "medium",
  onSelect,
  selectedIndex,
}: ProductListImgProps) {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 5, spacing: 12 },
    breakpoints: {
      "(min-width: 640px)": { slides: { perView: 7, spacing: 16 } },
      "(min-width: 1024px)": { slides: { perView: 10, spacing: 20 } },
    },
    vertical: direction === "vertical",
  });

  const itemSize = sizeMap[size];

  return (
    <div ref={sliderRef} className="keen-slider">
      {products.map((product, idx) => (
        <div
          key={product.id}
          className="keen-slider__slide flex items-center justify-center cursor-pointer"
          onClick={() => onSelect?.(idx)}
        >
          <div
            className={`transition-all duration-150 rounded-xl overflow-hidden border-2 m-2
              ${
                selectedIndex === idx
                  ? "border-blue-500 shadow-lg"
                  : "border-gray-200"
              }
            `}
            style={{
              width: itemSize,
              height: itemSize,
              minWidth: itemSize,
              minHeight: itemSize,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src={product.imgUrl}
              alt={`Producto ${product.id}`}
              size={size}
              radius="xl"
              shadow={selectedIndex === idx}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export { ProductListImg };
export type { ProductListImgProps, ImgProduct };
