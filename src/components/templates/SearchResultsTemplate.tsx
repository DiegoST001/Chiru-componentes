import React, { useEffect, useMemo, useState } from "react";
import type { Product } from "@/features/product/models/product.model";
import type { Category } from "@/features/category/models/category.model";
import { ProductService } from "@/features/product/services/product.service";
import { CategoryService } from "@/features/category/services/category.service";
import { ProductCart, type ProductCartItem } from "@/components/molecules/ProductCart";

type SearchType = "all" | "products" | "services";

function priceNumber(p: Product): number {
  const any = (p as any).price || {};
  const v = any.amount ?? any.price ?? any.value ?? 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function toCartItem(p: Product): ProductCartItem {
  return {
    id: p.id,
    name: p.name,
    brand: p.supplier?.name,
    imageUrl: p.images?.[0]?.urlImage,
    price: priceNumber(p) || 0,
    quantity: 1,
    maxQuantity: Math.max(1, p.stock ?? 10),
    inStock: (p.stock ?? 0) > 0,
  };
}

export default function SearchResultsTemplate({
  initialQuery,
  initialType,
  locale,
}: {
  initialQuery: string;
  initialType: SearchType;
  locale: string;
}) {
  const [q, setQ] = useState(initialQuery);
  const [type, setType] = useState<SearchType>(initialType);
  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [counts, setCounts] = useState({ products: 0, categories: 0 });

  // Mantener la URL sincronizada al cambiar q o type
  useEffect(() => {
    const params = new URLSearchParams({ q, type });
    const next = `/${locale}/buscar?${params.toString()}`;
    window.history.replaceState({}, "", next);
  }, [q, type, locale]);

  // Cargar resultados
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const wantProducts = type === "all" || type === "products";
        const wantCategories = type === "all" || type === "services";

        const [prodRes, catRes] = await Promise.all([
          wantProducts ? ProductService.findByName(q, 1, 20) : Promise.resolve(null),
          wantCategories ? CategoryService.findByName(q, 1, 20) : Promise.resolve(null),
        ]);

        if (cancelled) return;

        const prod = prodRes?.products ?? [];
        const cat = catRes?.categories ?? [];
        setProducts(prod);
        setCategories(cat);
        setCounts({
          products: prodRes?.totalResults ?? 0,
          categories: catRes?.totalResults ?? 0,
        });
      } catch {
        setProducts([]);
        setCategories([]);
        setCounts({ products: 0, categories: 0 });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [q, type]);

  const tabs = useMemo(
    () => [
      { key: "all", label: `Todos (${counts.products + counts.categories})` },
      { key: "products", label: `Productos (${counts.products})` },
      { key: "services", label: `Servicios (${counts.categories})` },
    ],
    [counts]
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Resultados para “{q}”</h1>
        <div className="mt-3 flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={`px-3 py-1.5 rounded-full text-sm border ${
                type === (t.key as SearchType)
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-200"
              }`}
              onClick={() => setType(t.key as SearchType)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Buscador interno para refinar */}
      <div className="mb-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Refinar búsqueda…"
          className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4"
        />
      </div>

      {loading && <div className="text-gray-500">Cargando…</div>}

      {!loading && (type === "all" || type === "products") && products.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Productos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {products.map((p) => (
              <ProductCart key={p.id} product={toCartItem(p)} />
            ))}
          </div>
        </section>
      )}

      {!loading && (type === "all" || type === "services") && categories.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Servicios</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c) => (
              <article key={c.id} className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden">
                    {c.image ? (
                      <img src={c.image} className="w-full h-full object-cover" alt={c.name} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{c.name}</div>
                    {c.description && (
                      <div className="text-sm text-gray-500 line-clamp-2">{c.description}</div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {!loading && products.length === 0 && categories.length === 0 && (
        <div className="text-gray-600">No se encontraron resultados. Prueba con otros términos.</div>
      )}
    </div>
  );
}
