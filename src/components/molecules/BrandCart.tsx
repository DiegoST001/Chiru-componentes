import React from "react";
import { Image } from "@/components/atoms/Image";
import { Heading } from "@/components/atoms/Heading";
import type { Supplier } from "@/features/product/models/product.model";

export type BrandCartProps = Pick<Supplier, "id" | "name" | "logo" | "website"> & {
  color?: string;
  showName?: boolean;
  bussinessCategory?: string;
};

function BrandCart({ id, name, logo, website, color, showName = true }: BrandCartProps) {
  console.log("Rendering BrandCart for:", id);
  return (
    <a
      href={website || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center min-w-[150px] max-w[500] hover:scale-105 transition-transform cursor-pointer border-1 border-gray-200 shadow rounded-lg p-2"
    >
      <Image
        src={logo || "/placeholder.png"}
        alt={name}
        size="small"
        fit="contain"
        radius="md"
        className="p-2"
        style={{
          backgroundColor: color ?? "white",
        }}
      />

      {showName && name && (
        <Heading level={6} className="text-center mt-2">
          {name}
        </Heading>
      )}
    </a>
  );
}

export { BrandCart };
