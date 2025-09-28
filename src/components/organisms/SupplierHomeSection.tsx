import React, { useEffect, useState, useCallback } from 'react';
import { SupplierService } from '@/features/user/supplier/service/supplier.service';
import type { Supplier } from '@/features/user/supplier/model/supplier.model';
import { CartProduct } from '@/components/molecules/CartProduct';
import type { ProductCard } from '@/components/molecules/CartProduct';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Spinner } from '@/components/atoms/Spinner';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { CaretRight } from 'phosphor-react';

interface SimpleCategory { categoryId: string; categoryName: string; }

interface SupplierHomeSectionProps {
  supplierId: string;
  pageSize?: number;
  className?: string;
 onGoToProducts?: (categoryId?: string) => void;
  /** Si true, en Home se cargan todos los productos (paginando internamente) y se oculta la paginación visual */
  showAllProducts?: boolean;
}

export const SupplierHomeSection: React.FC<SupplierHomeSectionProps> = ({ supplierId, pageSize = 12, className, onGoToProducts, showAllProducts = true }) => {
  const [categories, setCategories] = useState<SimpleCategory[]>([]);
  const [featuredCategories, setFeaturedCategories] = useState<SimpleCategory[]>([]);
  const [products, setProducts] = useState<ProductCard[]>([]);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loadingSupplier, setLoadingSupplier] = useState(false);
  const [errorSupplier, setErrorSupplier] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingCats, setLoadingCats] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [errorCats, setErrorCats] = useState<string | null>(null);
  const [errorProducts, setErrorProducts] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Fetch supplier detail + categories & featured once
  useEffect(() => {
    let active = true;
    setLoadingCats(true); setErrorCats(null);
    setLoadingSupplier(true); setErrorSupplier(null);
    Promise.all([
      SupplierService.findOne(supplierId),
      SupplierService.getCategoriesBySupplierId(supplierId),
      SupplierService.getFeaturedCategoriesBySupplierId(supplierId)
    ])
      .then(([sup, cats, feats]) => { if (!active) return; setSupplier(sup); setCategories(cats); setFeaturedCategories(feats); })
      .catch(e => { if (active) { const msg = e.message || 'Error cargando datos'; setErrorCats(msg); setErrorSupplier(msg); } })
      .finally(() => { if (active) { setLoadingCats(false); setLoadingSupplier(false); } });
    return () => { active = false; };
  }, [supplierId]);

  const loadProducts = useCallback(() => {
    let active = true;
    setLoadingProducts(true); setErrorProducts(null);

    // Si se pide "todos" juntamos páginas hasta completar total.
    const fetchPaged = async () => {
      try {
        if (showAllProducts) {
          // Petición única con límite grande (ajustable si backend lo permite)
          const BIG_LIMIT = 500; // puedes ajustar según tope backend
          const res = await SupplierService.findProductsBySupplier(supplierId, 1, BIG_LIMIT, undefined, undefined, selectedCategory);
          if (!active) return;
          setTotal(res.total || (res.data?.length || 0));
          const mapped: ProductCard[] = (res.data || []).map((p: any) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: p.price?.ranges?.[0]?.cost ?? 0,
            imageUrl: p.images?.[0]?.urlImage ?? '/placeholder.png',
            discount: undefined,
            brand: p.supplier?.name
          }));
          setProducts(mapped);
          return; // no seguir abajo
        }

        // Modo paginado normal
        const res = await SupplierService.findProductsBySupplier(supplierId, page, pageSize, undefined, undefined, selectedCategory);
        if (!active) return;
        setTotal(res.total || 0);
        const mapped: ProductCard[] = (res.data || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price?.ranges?.[0]?.cost ?? 0,
          imageUrl: p.images?.[0]?.urlImage ?? '/placeholder.png',
          discount: undefined,
          brand: p.supplier?.name
        }));
        setProducts(mapped);
      } catch (e: any) {
        if (active) setErrorProducts(e.message || 'Error cargando productos');
      } finally {
        if (active) setLoadingProducts(false);
      }
    };

    fetchPaged();
    return () => { active = false; };
  }, [supplierId, page, pageSize, selectedCategory, showAllProducts]);

  // Banner carousel images (supplier images if available)
  const bannerImages = (supplier?.images || []).slice(0, 10); // limit

  // EFFECT: ejecutar carga de productos cuando cambien dependencias
  useEffect(() => {
    const cleanup = loadProducts();
    return cleanup;
  }, [loadProducts]);

  const handleSelectCategory = (catId?: string, goProducts?: boolean) => {
    setSelectedCategory(catId);
    setPage(1);
    if (goProducts && onGoToProducts) onGoToProducts(catId);
  };

  return (
    <div className={`w-full flex flex-col gap-10 ${className || ''}`}>
      { !loadingSupplier && !errorSupplier && bannerImages.length > 0 && (
        <div className="w-full">
          <div className="relative w-full h-64 md:h-80 xl:h-96 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
            {bannerImages.length === 1 && (
              <img
                src={(bannerImages[0] as any).urlImage || (bannerImages[0] as any).url || '/placeholder.png'}
                alt={supplier?.name || 'Imagen proveedor'}
                className="w-full h-full object-cover object-center"
                loading="eager"
              />
            )}
            {bannerImages.length > 1 && (
              <div className="flex h-full animate-[scroll-x_40s_linear_infinite]" style={{ width: 'max-content' }}>
                {bannerImages.concat(bannerImages).map((img, idx) => (
                  <div key={(img.id || idx)+ '-slide'} className="w-screen md:w-[60vw] h-full relative">
                    <img
                      src={(img as any).urlImage || (img as any).url || '/placeholder.png'}
                      alt={supplier?.name || 'Imagen proveedor'}
                      className="w-full h-full object-cover object-center"
                      loading={idx < 2 ? 'eager' : 'lazy'}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5" />
          </div>
        </div>
      )}
  <div className="w-full grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-8">
      {/* Left column */}
      <aside className="md:w-64 flex-shrink-0 space-y-10">
        {/* Categorías normales */}
        <div>
          <Heading level={3} className="text-xl font-bold text-[#7d0e0e] leading-snug mb-2 border-b-2 border-[#7d0e0e] inline-block pb-1">Categories</Heading>
          {loadingCats && <Text size="sm">Cargando...</Text>}
          {errorCats && <Text size="sm" color="danger">{errorCats}</Text>}
          {!loadingCats && !errorCats && (
            <ul className="mt-4 space-y-2">
              <li>
                <button
                  onClick={() => handleSelectCategory(undefined)}
                  className={`w-full group flex items-center justify-between px-3 py-2 border rounded-md text-sm font-medium transition-colors ${!selectedCategory ? 'bg-white border-[#7d0e0e] text-[#7d0e0e]' : 'bg-white border-gray-300 text-gray-700 hover:border-[#7d0e0e] hover:text-[#7d0e0e]'}`}
                >
                  <span className="truncate">Todas</span>
                  <Icon tamano="small" variant="danger" className="group-hover:translate-x-0.5 transition-transform"><CaretRight size={14} /></Icon>
                </button>
              </li>
              {categories.map(cat => {
                const active = selectedCategory === cat.categoryId;
                return (
                  <li key={cat.categoryId}>
                    <button
                      onClick={() => handleSelectCategory(cat.categoryId, true)}
                      className={`w-full group flex items-center justify-between px-3 py-2 border rounded-md text-sm font-medium transition-colors ${active ? 'bg-white border-[#7d0e0e] text-[#7d0e0e]' : 'bg-white border-gray-300 text-gray-700 hover:border-[#7d0e0e] hover:text-[#7d0e0e]'}`}
                    >
                      <span className="truncate text-left">{cat.categoryName}</span>
                      <Icon tamano="small" variant="danger" className="group-hover:translate-x-0.5 transition-transform"><CaretRight size={14} /></Icon>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {/* Categorías destacadas */}
        <div>
          <Heading level={3} className="text-xl font-bold text-[#7d0e0e] leading-snug mb-2 border-b-2 border-[#7d0e0e] inline-block pb-1">Featured Categories</Heading>
          {loadingCats && <Text size="sm">Cargando...</Text>}
          {!loadingCats && !errorCats && (
            <ul className="mt-4 space-y-2">
              {featuredCategories.length === 0 && <li className="text-gray-500 text-sm">Sin destacadas</li>}
              {featuredCategories.map(cat => (
                <li key={cat.categoryId}>
                  <button
                    onClick={() => handleSelectCategory(cat.categoryId, true)}
                    className="w-full group flex items-center justify-between px-3 py-2 border rounded-md text-sm font-medium transition-colors bg-white border-gray-300 text-gray-700 hover:border-[#7d0e0e] hover:text-[#7d0e0e]">
                    <span className="truncate text-left">{cat.categoryName}</span>
                    <Icon tamano="small" variant="danger" className="group-hover:translate-x-0.5 transition-transform"><CaretRight size={14} /></Icon>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* Right column */}
      <section className="flex-1">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <Heading level={2} className="text-xl font-bold text-[#7d0e0e] leading-snug inline-flex items-center gap-2">
            {selectedCategory ? categories.find(c=>c.categoryId===selectedCategory)?.categoryName || 'Productos' : 'Productos'}
          </Heading>
          <div className="text-xs text-gray-500">Página {page} de {totalPages} ({total} resultados)</div>
        </div>
        {loadingProducts && (
          <div className="py-10 text-center"><Spinner size="lg" /> <Text size="sm" className="mt-2">Cargando productos...</Text></div>
        )}
        {errorProducts && (
          <div className="py-6 text-center text-red-600 text-sm">{errorProducts}</div>
        )}
        {!loadingProducts && !errorProducts && products.length === 0 && (
          <div className="py-6 text-center text-sm text-gray-600">No hay productos para mostrar.</div>
        )}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map(p => (
            <CartProduct key={p.id} product={p} className="hover:shadow-lg transition-shadow" />
          ))}
        </div>
        {/* Pagination */}
        {!showAllProducts && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
            <Button size="small" variant="secondary" disabled={page === 1 || loadingProducts} onClick={() => setPage(p => Math.max(1, p - 1))}>Anterior</Button>
            <div className="text-xs text-gray-600">{page} / {totalPages}</div>
            <Button size="small" variant="secondary" disabled={page === totalPages || loadingProducts} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Siguiente</Button>
          </div>
        )}
      </section>
      </div>
    </div>
  );
};

export default SupplierHomeSection;
