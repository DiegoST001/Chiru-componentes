import React, { useEffect, useState, useCallback } from 'react';
import { SupplierService } from '@/features/user/supplier/service/supplier.service';
import type { Supplier } from '@/features/user/supplier/model/supplier.model';
import { CartProduct } from '@/components/molecules/CartProduct';
import type { ProductCard } from '@/components/molecules/CartProduct';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Spinner } from '@/components/atoms/Spinner';
import { Icon } from '@/components/atoms/Icon';
import { CaretRight } from 'phosphor-react';

interface SimpleCategory { categoryId: string; categoryName: string; }

interface SupplierProductSectionProps {
  supplierId: string;
  pageSize?: number;
  className?: string;
  initialCategoryId?: string;
}

export const SupplierProductSection: React.FC<SupplierProductSectionProps> = ({ supplierId, pageSize = 12, className, initialCategoryId }) => {
  const [categoriesData, setCategoriesData] = useState<Array<{ categoryId: string; categoryName: string; products: any[] }>>([]);
  const [featuredCategories, setFeaturedCategories] = useState<Array<{ categoryId: string; categoryName: string; products: any[] }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(initialCategoryId);
  // Sync prop changes
  useEffect(() => { setSelectedCategory(initialCategoryId); setPage(1); }, [initialCategoryId]);
  const [page, setPage] = useState(1);

  const pageSizeNum = pageSize;

  const flatFilteredProducts: any[] = React.useMemo(() => {
    if (selectedCategory) {
      const cat = categoriesData.find(c => c.categoryId === selectedCategory);
      return cat ? cat.products : [];
    }
    // Combinar todos
    return categoriesData.flatMap(c => c.products);
  }, [categoriesData, selectedCategory]);

  const total = flatFilteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSizeNum));
  const paginated = flatFilteredProducts.slice((page - 1) * pageSizeNum, page * pageSizeNum);

  const mappedProducts: ProductCard[] = paginated.map((p: any) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price?.ranges?.[0]?.cost ?? 0,
    imageUrl: p.images?.[0]?.urlImage || p.images?.[0]?.url || '/placeholder.png',
    discount: undefined,
    brand: p.supplier?.name
  }));

  const load = useCallback(() => {
    let active = true;
    setLoading(true); setError(null);
    SupplierService.getCategoriesAndProductsBySupplierId(supplierId)
      .then(res => { if (active) {
        setCategoriesData(res);
        // Asumimos featured = isFeatured=1 dentro de sus productos (filtrar categorías con algún producto destacado) si se desea algo mejor luego se cambia.
        const feats = res.filter(c => c.products?.some(p => p.isFeatured));
        setFeaturedCategories(feats);
      } })
      .catch(e => { if (active) setError(e.message || 'Error cargando productos'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [supplierId]);

  useEffect(() => {
    const cleanup = load();
    return cleanup;
  }, [load]);

  const handleSelectCategory = (catId?: string) => {
    setSelectedCategory(catId);
    setPage(1);
  };

  return (
    <div className={`w-full flex flex-col md:flex-row gap-6 ${className || ''}`}>
      <aside className="md:w-64 flex-shrink-0 space-y-10">
        <div>
          <Heading level={3} className="text-xl font-bold text-[#7d0e0e] leading-snug mb-2 border-b-2 border-[#7d0e0e] inline-block pb-1">Categories</Heading>
          {loading && <Text size="sm">Cargando...</Text>}
          {error && <Text size="sm" color="danger">{error}</Text>}
          {!loading && !error && (
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
              {categoriesData.map(cat => {
                const active = selectedCategory === cat.categoryId;
                return (
                  <li key={cat.categoryId}>
                    <button
                      onClick={() => handleSelectCategory(cat.categoryId)}
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
        <div>
          <Heading level={3} className="text-xl font-bold text-[#7d0e0e] leading-snug mb-2 border-b-2 border-[#7d0e0e] inline-block pb-1">Featured Categories</Heading>
          {loading && <Text size="sm">Cargando...</Text>}
          {!loading && !error && (
            <ul className="mt-4 space-y-2">
              {featuredCategories.length === 0 && <li className="text-gray-500 text-sm">Sin destacadas</li>}
              {featuredCategories.map(cat => {
                const active = selectedCategory === cat.categoryId;
                return (
                  <li key={cat.categoryId}>
                    <button
                      onClick={() => handleSelectCategory(cat.categoryId)}
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
      </aside>
      <section className="flex-1">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <Heading level={2} className="text-xl font-bold text-[#7d0e0e] leading-snug inline-flex items-center gap-2">
            {selectedCategory ? categoriesData.find(c=>c.categoryId===selectedCategory)?.categoryName || 'Productos' : 'Productos'}
          </Heading>
          <div className="text-xs text-gray-500">Página {page} de {totalPages} ({total} resultados)</div>
        </div>
        {loading && (
          <div className="py-10 text-center"><Spinner size="lg" /> <Text size="sm" className="mt-2">Cargando productos...</Text></div>
        )}
        {error && (
          <div className="py-6 text-center text-red-600 text-sm">{error}</div>
        )}
        {!loading && !error && mappedProducts.length === 0 && (
          <div className="py-6 text-center text-sm text-gray-600">No hay productos para mostrar.</div>
        )}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {mappedProducts.map(p => (
            <CartProduct key={p.id} product={p} className="hover:shadow-lg transition-shadow" />
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
            <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1 text-xs rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50">Anterior</button>
            <div className="text-xs text-gray-600">{page} / {totalPages}</div>
            <button disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="px-3 py-1 text-xs rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50">Siguiente</button>
          </div>
        )}
      </section>
    </div>
  );
};

export default SupplierProductSection;
