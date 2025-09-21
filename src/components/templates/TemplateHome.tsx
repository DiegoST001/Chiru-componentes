import React, { useEffect, useState } from "react";
import ProductFlex from "../organisms/ProductFlex";
import { ProductService } from "@/features/product/services/product.service";
import type { Product } from "@/features/product/models/product.model";
import type { ProductCard } from "../molecules/CartProduct";

function TemplateHome() {
  const [products, setProducts] = useState<ProductCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ProductService.findAll({ page: 1, limit: 24 })
      .then((result) => {
        // El array de productos está en result.data
        const mapped = (result.data ?? []).map((product: Product) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price?.ranges?.[0]?.cost ?? 0,
          imageUrl: product.images?.[0]?.urlImage ?? "/placeholder.png",
          discount: undefined, // El backend aún no lo envía
          brand: product.supplier?.name ?? undefined,
        }));
        setProducts(mapped);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Cargando productos...</div>;
  if (!products.length) return <div className="p-8 text-center">No hay productos disponibles.</div>;

  return <ProductFlex products={products} />;
}

export { TemplateHome };