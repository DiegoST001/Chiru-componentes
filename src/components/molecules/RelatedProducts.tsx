import React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { cntl } from "@/utils/cntl";
import { Image } from "@/components/atoms/Image";
import { Text } from "@/components/atoms/Text";
import { Paragraph } from "@/components/atoms/Paragraph";

export type RelatedProduct = {
  id: string;
  imageUrl: string;
  title: string;
  price: number;
  currency?: string;
  description?: string;
};

export type RelatedProductsProps = {
  items: RelatedProduct[];
  minColWidth?: number;
  gap?: number;
  className?: string;
};

function cardCls() {
  return cntl`bg-white rounded-md shadow-sm overflow-hidden keen-slider__slide`;
}

export function RelatedProducts({
  items,
  minColWidth = 220,
  gap = 16,
  className,
}: RelatedProductsProps) {
  // minimizar spacing en pantallas pequeñas, usar gap completo en breakpoints mayores
  const smallGap = Math.min(gap, 8); // gap mínimo en móvil
  const defaultPerView = 1.15; // muestra ~1 tarjeta + parte de la siguiente en móvil

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    breakpoints: {
      "(min-width: 1024px)": {
        slides: { perView: 3, spacing: gap },
      },
      "(min-width: 1280px)": {
        slides: { perView: 4, spacing: gap },
      },
    },
    // configuración por defecto (móvil): perView reducido y spacing mínimo
    slides: { perView: defaultPerView, spacing: smallGap },
    loop: true,
  });

  return (
    <div className={cntl`w-full ${className || ""}`}>
      <div ref={sliderRef} className="keen-slider py-5">
        {items.map((p) => (
          <a
            key={p.id}
            className={cardCls()}
            href={`/es/docs/dev/ui/templates/product-detail/${p.id}`}
            style={{ minWidth: minColWidth }}
          >
            <div className="relative w-full bg-gray-300 max-h-[300px]" style={{ aspectRatio: "1 / 1" }}>
              <Image
                src={p.imageUrl}
                alt={p.title}
                fit="cover"
                radius="none"
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <div className="p-3">
              <Text className="font-semibold">{p.title}</Text>
              <Text weight="bold" className="mt-1">
                {(p.currency ?? "S/.")} {p.price.toFixed(2)}
              </Text>
              {p.description && (
                <Paragraph variant="muted" size="small" leading="relaxed" className="mt-2">
                  {p.description}
                </Paragraph>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
