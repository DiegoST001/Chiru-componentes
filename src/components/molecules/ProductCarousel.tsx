// src/components/molecules/ProductCarousel.tsx
import React, { useState } from "react";
import { Image } from "../atoms/Image";
import { Icon } from "../atoms/Icon";
import { Heart, ShareNetwork, CaretLeft, CaretRight } from "phosphor-react";

type ImgProduct = {
  id: string;
  imgUrl: string;
};

type ProductCarouselProps = {
  products: ImgProduct[];
  size?: "small" | "medium" | "large";
  current?: number;
  setCurrent?: (idx: number) => void;
};

function ProductCarousel({
  products,
  size = "medium",
  current,
  setCurrent,
}: ProductCarouselProps) {
  // Si no se controla desde fuera, usa estado interno
  const [internalCurrent, internalSetCurrent] = useState(0);
  const idx = current ?? internalCurrent;
  const updateCurrent = setCurrent ?? internalSetCurrent;

  const prev = () =>
    updateCurrent(idx === 0 ? products.length - 1 : idx - 1);
  const next = () =>
    updateCurrent(idx === products.length - 1 ? 0 : idx + 1);

  if (!products || products.length === 0) return null;

  return (
    <div className="relative w-full flex justify-center">
      {/* Imagen principal */}
      <Image
        src={products[idx].imgUrl}
        alt={`Producto ${products[idx].id}`}
        size={size}
        radius="md"
        shadow
      />

      {/* Botón izquierda */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2"
        aria-label="Anterior"
      >
        <Icon tamano="medium" variant="default">
          <CaretLeft />
        </Icon>
      </button>

      {/* Botón derecha */}
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2"
        aria-label="Siguiente"
      >
        <Icon tamano="medium" variant="default">
          <CaretRight />
        </Icon>
      </button>

      {/* Like y compartir en columna */}
      <div className="absolute top-2 right-2 flex flex-col gap-2">
        <button className="bg-white rounded-full shadow p-2" aria-label="Me gusta">
          <Icon tamano="medium" variant="danger">
            <Heart />
          </Icon>
        </button>
        <button className="bg-white rounded-full shadow p-2" aria-label="Compartir">
          <Icon tamano="medium" variant="info">
            <ShareNetwork />
          </Icon>
        </button>
      </div>
    </div>
  );
}

export { ProductCarousel };
export type { ImgProduct, ProductCarouselProps };
