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
  size?: "small" | "medium" | "large" | "full" | "stretch"; // stretch: ocupar celda completa
  dataCategorie?: CategoryData;
  imageWidth?: number; // ancho fijo para uniformidad (px)
};

function getCardCategorieStyles(size: CardCategorieSimpleProps["size"]) {
  const sizes = {
    small: "h-24",
    medium: "h-28",
    large: "h-32",
    full: "h-full",
    stretch: "h-full", // alias semantic para grid controlada
  } as const;
  return cntl`
    flex flex-row items-center bg-gray-50 rounded-lg hover:shadow-md transition cursor-pointer overflow-hidden w-full border border-transparent hover:border-gray-200
    ${sizes[size || "medium"]}
  `;
}

function CardCategorieSimple({ dataCategorie, size = "medium", imageWidth = 112 }: CardCategorieSimpleProps) {
  return (
    <div className={getCardCategorieStyles(size)}>
      {/* Texto a la izquierda */}
      <div className="flex-1 pl-2 pr-3 flex items-center">
        <Text size="lg" weight="semibold" color="default">
          {dataCategorie?.name}
        </Text>
      </div>

      {/* Imagen ancho fijo, altura se estira para alinear visual */}
      <div className="h-full flex-shrink-0 rounded-md overflow-hidden flex items-center justify-center bg-white" style={{ width: imageWidth }}>
        <Image
          src={dataCategorie?.urlImage}
          alt={dataCategorie?.name || "Categoria"}
          fit="fill"
          radius="none"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export { CardCategorieSimple };
