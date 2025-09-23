import React, { useEffect, useLayoutEffect, useState, useCallback, useRef } from "react";
import { Text } from "../atoms/Text";
import { Button } from "../atoms/Button";
import { CartProductPopular, type ProductData } from "../molecules/CartProductPopular";
import { CardCategorieSimple, type CategoryData } from "../molecules/CardCategorieSimple";
import { ProductService } from "@/features/product/services/product.service";
import { CategoryService } from "@/features/category/services/category.service";
import type { Product } from "@/features/product/models/product.model";
import type { Category as CategoryModel } from "@/features/category/models/category.model";
import { Icon } from "../atoms/Icon";
import { CaretLeft, CaretRight } from "phosphor-react";

interface SectionOffersByCategoryProps {
  /** Si se pasan productos manuales se usan en lugar de auto-fetch */
  products?: ProductData[];
  /** Si se pasan categorías manuales se usan en lugar de auto-fetch */
  categories?: CategoryData[];
  /** Activar auto fetch (default true) */
  autoFetch?: boolean;
  className?: string;
}

const CATEGORY_PAGE_SIZE = 6;

function mapProduct(p: Product): ProductData {
  const rawPrice = p.price ? Object.values(p.price)[0] : undefined;
  const price = typeof rawPrice === 'number' ? rawPrice : parseFloat(String(rawPrice || 0)) || 0;
  const avg = p.ratings?.length ? (p.ratings.reduce((a, r) => a + r.rating, 0) / p.ratings.length) : 0;
  return {
    id: p.id,
    urlImage: p.images?.[0]?.urlImage || 'https://placehold.co/300x350?text=Producto',
    name: p.name,
    price,
    oldPrice: undefined,
    rating: parseFloat(avg.toFixed(1)),
    description: p.category?.name
  };
}

function mapCategory(c: CategoryModel): CategoryData {
  return {
    id: c.id,
    urlImage: c.image || 'https://placehold.co/200x200?text=Category',
    name: c.name
  };
}

function SectionOffersByCategory({ products, categories, autoFetch = true, className }: SectionOffersByCategoryProps) {
  const [internalProducts, setInternalProducts] = useState<ProductData[]>(products || []);
  const [internalCategories, setInternalCategories] = useState<CategoryData[]>(categories || []);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [errorProducts, setErrorProducts] = useState<string | null>(null);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);
  const [categoryPage, setCategoryPage] = useState(0); // índice de página
  // Altura sincronizada entre panel izquierdo y derecho
  const leftRef = useRef<HTMLDivElement | null>(null);
  const [leftHeight, setLeftHeight] = useState<number | null>(null);

  const totalPages = Math.max(1, Math.ceil(internalCategories.length / CATEGORY_PAGE_SIZE));

  const loadData = useCallback(async () => {
    if (!autoFetch) return;
    try {
      setLoadingCategories(true); setErrorCategories(null);
      const cats = await CategoryService.findAll();
      const mappedCats = cats.map(mapCategory);
      setInternalCategories(mappedCats);

      if (mappedCats.length) {
        setLoadingProducts(true); setErrorProducts(null);
        // usar la primera categoría
        const firstCatId = mappedCats[0].id;
        const prods = await ProductService.findByCategoryId(firstCatId);
        setInternalProducts(prods.slice(0,3).map(mapProduct));
      }
    } catch (e: any) {
      if (!internalCategories.length) setErrorCategories(e.message || 'Error cargando categorías');
      if (!internalProducts.length) setErrorProducts(e.message || 'Error cargando productos de la categoría');
    } finally {
      setLoadingCategories(false);
      setLoadingProducts(false);
    }
  }, [autoFetch]);

  useEffect(() => { loadData(); }, [loadData]);

  const currentCategorySlice = internalCategories.slice(
    categoryPage * CATEGORY_PAGE_SIZE,
    categoryPage * CATEGORY_PAGE_SIZE + CATEGORY_PAGE_SIZE
  );

  const nextPage = () => setCategoryPage(p => (p + 1 < totalPages ? p + 1 : p));
  const prevPage = () => setCategoryPage(p => (p - 1 >= 0 ? p - 1 : p));

  // Observa cambios de tamaño del panel izquierdo para sincronizar altura del derecho
  // Medición inicial sin parpadeo
  useLayoutEffect(() => {
    if (leftRef.current) {
      setLeftHeight(leftRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    if (!leftRef.current) return;
    const el = leftRef.current;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Preferir borderBoxSize si está disponible para incluir padding
        // borderBoxSize puede ser un array en algunos navegadores
        let h: number | undefined;
        const anyEntry: any = entry as any;
        if (anyEntry.borderBoxSize) {
          const box = Array.isArray(anyEntry.borderBoxSize) ? anyEntry.borderBoxSize[0] : anyEntry.borderBoxSize;
          h = box.blockSize;
        }
        if (!h) {
          h = entry.target instanceof HTMLElement ? entry.target.offsetHeight : entry.contentRect.height;
        }
        if (h && h !== leftHeight) {
          setLeftHeight(h);
        }
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [internalProducts, internalCategories, leftHeight]);

  return (
    <section className={`w-full py-10 ${className || ''}`}>
  <div className="max-w-7xl mx-auto flex flex-col items-center px-4">
        {/* Título */}
        <div className="text-center mb-8">
          <Text size="xl" weight="bold">Ofertas por categoría</Text>
        </div>

        {/* Layout responsive - mismas alturas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
          {/* Panel izquierdo (productos) */}
          <div ref={leftRef} className="bg-sky-100 p-6 rounded-lg flex flex-col gap-6 w-full">
            <div className="flex flex-row items-center justify-between flex-wrap gap-4">
              <div className="flex flex-col gap-1">
                <Text size="lg" weight="bold">{internalCategories[0]?.name || 'Categoría'}</Text>
                <Text size="sm" color="muted">Los 3 primeros productos</Text>
              </div>
              <Button text="Ver más" variant="primary" size="medium" />
            </div>
            <div className="grid grid-cols-3 gap-5 w-full flex-1 items-stretch">
              {loadingProducts && !internalProducts.length && (
                <Text size="sm" color="muted">Cargando productos...</Text>
              )}
              {errorProducts && !internalProducts.length && (
                <Text size="sm" color="danger">{errorProducts}</Text>
              )}
              {internalProducts.map(prod => (
                <CartProductPopular key={prod.id} dataProduct={prod} size="fluid" />
              ))}
            </div>
          </div>

          {/* Panel derecho (categorías) */}
          <div
            className="relative w-full flex flex-col bg-gray-50 rounded-lg p-6 overflow-hidden"
            style={leftHeight ? { height: `${leftHeight}px` } : undefined}
          >
            <div className="grid grid-cols-2 grid-rows-3 gap-6 h-full">
              {loadingCategories && !internalCategories.length && (
                <Text size="sm" color="muted">Cargando categorías...</Text>
              )}
              {errorCategories && !internalCategories.length && (
                <Text size="sm" color="danger">{errorCategories}</Text>
              )}
              {currentCategorySlice.map(cat => (
                <CardCategorieSimple key={cat.id} dataCategorie={cat} size="stretch" imageWidth={120} />
              ))}
            </div>
            {/* Controles paginación */}
            {internalCategories.length > CATEGORY_PAGE_SIZE && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center justify-center gap-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full shadow">
                <button
                  onClick={prevPage}
                  disabled={categoryPage === 0}
                  className="p-1.5 rounded-full bg-white shadow disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                  aria-label="Anterior"
                >
                  <Icon tamano="small"><CaretLeft /></Icon>
                </button>
                <Text size="xs" color="muted">{categoryPage + 1} / {totalPages}</Text>
                <button
                  onClick={nextPage}
                  disabled={categoryPage + 1 === totalPages}
                  className="p-1.5 rounded-full bg-white shadow disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                  aria-label="Siguiente"
                >
                  <Icon tamano="small"><CaretRight /></Icon>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export { SectionOffersByCategory };
