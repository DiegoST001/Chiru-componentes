import { Heading } from "@/components/atoms/Heading";
import { Select } from "@/components/atoms/Select";
import { BrandCart } from "@/components/molecules/BrandCart";
import React from "react";

type BrandSupplierProps = {
  brands?: {
    name: string;
    logoUrl: string;
    websiteUrl: string;
    color?: string;
  }[];
  title?: string;
    description?: string;
};

function BrandSupplier({ brands = [], title, description }: BrandSupplierProps) {
  return (
    <div className="w-full">
      {/* Encabezado */}
      <div className="text-center mb-6 bg-red-600 text-white p-4 rounded">
        <Heading level={1} color="white">{title}</Heading>
        <Heading level={5} color="white">{description}</Heading>
      </div>

      {/* Selector */}
      <div className="w-full md:w-md m-auto">
        <Select
          options={brands.map((brand) => ({
            value: brand.name.toLowerCase().replace(/\s+/g, "-"),
            label: brand.name,
          }))}
        />
      </div>

      {/* Lista de marcas */}
      <div className="flex flex-wrap justify-center items-center gap-8 mt-6 ">
        {brands.map((brand, index) => (
          <BrandCart
            key={index}
            name={brand.name}
            logoUrl={brand.logoUrl}
            websiteUrl={brand.websiteUrl}
            color={brand.color}
          />
        ))}
      </div>
    </div>
  );
}

export default BrandSupplier;
