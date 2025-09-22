import React, { useEffect, useState } from "react";
import { Heading } from "@/components/atoms/Heading";
import { Select } from "@/components/atoms/Select";
import { BrandCart, type BrandCartProps } from "@/components/molecules/BrandCart";
import { SupplierService } from "@/features/user/supplier/service/supplier.service";
import type { Supplier } from "@/features/user/supplier/model/supplier.model";

type BrandSupplierProps = {
  title?: string;
  description?: string;
};

function BrandSupplier({ title, description }: BrandSupplierProps) {
  const [brands, setBrands] = useState<BrandCartProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SupplierService.findAllMarked()
      .then((result: Supplier[]) => {
        const mapped: BrandCartProps[] = result.map((supplier) => ({
          id: supplier.id ?? "",
          name: supplier.name ?? "Sin nombre",
          logo: supplier.logo ?? "/placeholder.png",
          website: supplier.website ?? "#",
          color: undefined,
          showName: true,
          bussinessCategory: supplier.bussinessCategory ?? "Sin categoría",
        }));
        setBrands(mapped);
      })
      .catch((err) => {
        console.error("Error fetching brands:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Cargando marcas...</div>;
  if (!brands.length) return <div className="p-8 text-center">No hay marcas disponibles.</div>;

  return (
    <main className="mx-4 md:mx-6 lg:mx-8">
      {/* Encabezado */}
      <div className="text-center mb-6 bg-gray-900 text-white p-4 rounded">
        <Heading color="white" className="text-4xl font-extrabold">{title}</Heading>
        <Heading color="white" className="font-light">{description}</Heading>
      </div>

      {/* Selector */}
      <div className="w-full md:w-md m-auto">
        <Select
          options={brands.map((brand) => ({
            value: (brand.bussinessCategory ?? "Sin categoría").toLowerCase().replace(/\s+/g, "-"),
            label: brand.bussinessCategory ?? "Sin categoría",
          }))}
        />
      </div>

      {/* Lista de marcas */}
      <div className="flex flex-wrap justify-center items-center gap-6 mt-6">
        {brands.map((brand) => (
          <BrandCart key={brand.id} {...brand} />
        ))}
      </div>
    </main>
  );
}

export default BrandSupplier;
