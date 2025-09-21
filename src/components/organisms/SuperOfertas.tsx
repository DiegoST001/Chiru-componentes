import React from "react";
import { Text } from "../atoms/Text";
import { BannerImg } from "../molecules/BannerImg";

// Cada oferta es una imagen
type Oferta = {
  src: string;
  alt?: string;
};

type SuperOfertasProps = {
  title: string;
  ofertas: Oferta[];
};

export function SuperOfertas({ title, ofertas }: SuperOfertasProps) {
  return (
    <div>
      {/* Título arriba, centrado */}
      <Text size="xl" weight="bold" className="text-center mb-6">
        {title}
      </Text>
      {/* UNA sola molécula BannerImg, con todas las imágenes */}
      <BannerImg
        images={ofertas.map((oferta, idx) => ({
          src: oferta.src,
          alt: oferta.alt ?? `Banner image ${idx + 1}`,
        }))}
      />
    </div>
  );
}