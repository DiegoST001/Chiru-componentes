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
  size?: "small" | "medium" | "large" | "full";
  dataCategorie?: CategoryData;
};

function getCardCategorieStyles(size: CardCategorieSimpleProps["size"]) {
  const sizes = {
    small: "h-24",
    medium: "h-28",
    large: "h-32",
    full: "h-full", // 👈 nueva opción para ocupar toda la altura
  };
  return cntl`
    flex flex-row items-center bg-gray-50 rounded-lg hover:shadow-md transition cursor-pointer overflow-hidden w-full
    ${sizes[size || "medium"]}
  `;
}

function CardCategorieSimple({ dataCategorie, size = "medium" }: CardCategorieSimpleProps) {
  return (
    <div className={getCardCategorieStyles(size)}>
      {/* Texto a la izquierda */}
      <div className="flex-1 p-2 flex items-center">
        <Text size="lg" weight="semibold" color="default">
          {dataCategorie?.name}
        </Text>
      </div>

      {/* Imagen ocupa 100% de la altura */}
      <div className="h-full aspect-square flex-shrink-0">
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
