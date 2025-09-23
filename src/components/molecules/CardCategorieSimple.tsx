import React from "react";
import { cntl } from "@/utils/cntl";
import { Image } from "../atoms/Image";
import { Text } from "../atoms/Text";

export type CategoryData = {
  id: string;
  urlImage: string;
  name: string;
};

type CardCategorieSimpleProps = {
  size?: "small" | "medium" | "large" | "full" | "stretch";
  dataCategorie?: CategoryData;
  imageWidth?: number;
};

function getCardCategorieStyles(size: CardCategorieSimpleProps["size"]) {
  const sizes = {
    small: "min-h-[140px] max-h-[180px]",
    medium: "min-h-[160px] max-h-[220px]",
    large: "min-h-[180px] max-h-[260px]",
    full: "h-full",
    stretch: "h-full",
  } as const;
  return cntl`
    flex flex-col items-center bg-gray-100 rounded-lg hover:shadow-md transition cursor-pointer overflow-hidden w-full border border-transparent hover:border-gray-200
    ${sizes[size || "medium"]}
    p-2
  `;
}

function CardCategorieSimple({ dataCategorie, size = "medium", imageWidth = 112 }: CardCategorieSimpleProps) {
  // Define tamaño máximo de imagen según el tamaño de la tarjeta
  const imgMaxMap = {
    small: 80,
    medium: 96,
    large: 112,
    full: 128,
    stretch: 128,
  };
  const imgMax = imgMaxMap[size] || 96;

  return (
    <div className={getCardCategorieStyles(size)}>
      {/* Imagen ocupa todo el ancho y altura disponible */}
      <div
        className="rounded-md overflow-hidden flex items-center justify-center bg-white mb-2 w-full h-full"
      >
        <Image
          src={dataCategorie?.urlImage}
          alt={dataCategorie?.name || "Categoria"}
          fit="cover"
          radius="none"
          className="w-full h-full object-cover"
        />
      </div>
      {/* Texto pegado debajo */}
      <div className="w-full flex items-end justify-center text-center mt-0">
        <Text
          size="lg"
          weight="semibold"
          color="default"
          className="truncate"
        >
          {dataCategorie?.name}
        </Text>
      </div>
    </div>
  );
}

export { CardCategorieSimple };
