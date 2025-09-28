import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Spinner } from '@/components/atoms/Spinner';
import { Icon } from '@/components/atoms/Icon';
import { CaretRight } from 'phosphor-react';
import { CartService } from '@/components/molecules/CartService';
import type { Service } from '@/features/service/model/service.model';
import { SupplierService } from '@/features/user/supplier/service/supplier.service';

interface SupplierServiceSectionProps {
  supplierId: string;
  pageSize?: number; // pagination inside component (client side)
  className?: string;
  initialCategoryId?: string;
}

interface CategoryWithServices { categoryId: string; categoryName: string; services: Service[]; }

const SupplierServiceSection: React.FC<SupplierServiceSectionProps> = ({
  supplierId,
  pageSize = 12,
  className,
  initialCategoryId
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryWithServices[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(initialCategoryId);
  const [page, setPage] = useState(1);

  // Sync external initialCategory changes
  useEffect(() => {
    setSelectedCategory(initialCategoryId);
    setPage(1);
  }, [initialCategoryId]);

  const load = useCallback(() => {
    let active = true;
    setLoading(true); setError(null);
    SupplierService.getCategoriesAndServicesySupplierId(supplierId)
      .then(res => { if (!active) return; setCategories(res as any); })
      .catch(e => { if (!active) return; setError(e.message || 'Error cargando servicios'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [supplierId]);

  useEffect(() => { const cleanup = load(); return cleanup; }, [load]);

  const flatFilteredServices: Service[] = useMemo(() => {
    if (selectedCategory) {
      const cat = categories.find(c => c.categoryId === selectedCategory);
      return cat ? (cat.services as Service[]) : [];
    }
    return categories.flatMap(c => c.services as Service[]);
  }, [categories, selectedCategory]);

  const pageSizeNum = pageSize;
  const total = flatFilteredServices.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSizeNum));
  const paginated = flatFilteredServices.slice((page - 1) * pageSizeNum, page * pageSizeNum);

  const handleSelectCategory = (catId?: string) => {
    setSelectedCategory(catId);
    setPage(1);
  };

  return (
    <div className={`w-full flex flex-col md:flex-row gap-6 ${className || ''}`}>
      <aside className="md:w-64 flex-shrink-0 space-y-10">
        <div>
          <Heading level={3} className="text-xl font-bold text-[#7d0e0e] leading-snug mb-2 border-b-2 border-[#7d0e0e] inline-block pb-1">Categorias</Heading>
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
              {categories.map(cat => {
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
            {selectedCategory ? categories.find(c=>c.categoryId===selectedCategory)?.categoryName || 'Servicios' : 'Servicios'}
          </Heading>
          <div className="text-xs text-gray-500">Página {page} de {totalPages} ({total} resultados)</div>
        </div>
        {loading && (
          <div className="py-10 text-center"><Spinner size="lg" /> <Text size="sm" className="mt-2">Cargando servicios...</Text></div>
        )}
        {error && (
          <div className="py-6 text-center text-red-600 text-sm">{error}</div>
        )}
        {!loading && !error && paginated.length === 0 && (
          <div className="py-6 text-center text-sm text-gray-600">No hay servicios para mostrar.</div>
        )}
        <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
          {paginated.map(s => (
            <div
              key={s.id}
              className="hover:shadow-lg transition-shadow min-w-[160px] sm:min-w-[200px] md:min-w-[240px] lg:min-w-[260px] flex-1 max-w-xs"
            >
              <CartService service={s as any} cardWidth={260} />
            </div>
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

export default SupplierServiceSection;