import React, { useEffect, useState } from "react";
import { CartProduct } from "../molecules/CartProduct";
import { ProductService } from "@/features/product/services/product.service";
import type { Product } from "@/features/product/models/product.model";
import type { ProductCard } from "../molecules/CartProduct";

type ProductsFlexProps = {
  query?: { page: number; limit: number };
};

function ProductsFlex({ query = { page: 1, limit: 24 } }: ProductsFlexProps) {
  const [products, setProducts] = useState<ProductCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ProductService.findAll(query)
      .then((result) => {
        const mapped = (result.data ?? []).map((product: Product) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price?.ranges?.[0]?.cost ?? 0,
          imageUrl: product.images?.[0]?.urlImage ?? "/placeholder.png",
          discount: undefined,
          brand: product.supplier?.name ?? undefined,
        }));
        setProducts(mapped);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      })
      .finally(() => setLoading(false));
  }, [query]);

  if (loading) return <div className="p-8 text-center">Cargando productos...</div>;
  if (!products.length) return <div className="p-8 text-center">No hay productos disponibles.</div>;

  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mx-4 md:mx-6 lg:mx-8">
      {products.map((product) => (
        <CartProduct key={product.id} product={product} className="hover:shadow-lg transition-shadow cursor-pointer" />
      ))}
    </section>
  );
}

export default ProductsFlex;
