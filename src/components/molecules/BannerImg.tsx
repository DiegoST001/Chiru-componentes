import React, { useEffect, useState, useRef } from "react";
import { Image, type ImageProps } from "../atoms/Image";
import { ProductService } from "@/features/product/services/product.service";
import type { Product } from "@/features/product/models/product.model";

type StaticImageItem = {
  src: string;
  alt?: string;
  size?: ImageProps["size"];
  radius?: ImageProps["radius"];
  shadow?: boolean;
  bordered?: boolean;
  fit?: ImageProps["fit"];
};

interface BannerImgProps {
  /** Imágenes estáticas manuales (se ignoran si autoFetchTopSold está activo y llegan productos) */
  images?: StaticImageItem[];
  /** Activa fetch automático de productos más vendidos */
  autoFetchTopSold?: boolean;
  /** Límite de productos/imágenes a mostrar (default 3) */
  limit?: number;
  /** Mostrar ID debajo de la imagen */
  showId?: boolean;
  /** Forzar tamaño wrapper (override de size por item) */
  forceSize?: ImageProps["size"];
  className?: string;
  /** Render prop para personalizar capa inferior (recibe product) */
  renderFooter?: (p: Product) => React.ReactNode;
  /** Forzar relación de aspecto (ej: 16/9, 5/3, 4/3, 1/1). Si se pasa fixedHeight tiene prioridad esa altura. */
  itemAspect?: 'video' | 'wide' | 'classic' | 'square' | 'tall';
  /** Altura fija en px (aplica min-h + h-auto para mantener responsive horizontal). */
  fixedHeight?: number;
  /** Centrar grid dentro de su contenedor y limitar ancho máximo */
  center?: boolean;
  /** Ancho mínimo de cada item en px para controlar cuántas columnas caben (responsive). */
  minItemWidth?: number;
  /** Máximo ancho del contenedor (px). */
  maxContainerWidth?: number;
  /** Separación opcional entre imágenes (px). Default 0 para flush. */
  gap?: number;
  /** Título opcional mostrado arriba del banner */
  title?: string;
  /** Multiplicador aplicado a fixedHeight para escalar (ej 1.5 = 50% más alto) */
  heightMultiplier?: number;
}

export function BannerImg({
  images = [],
  autoFetchTopSold = false,
  limit = 3,
  showId = false,
  forceSize,
  className,
  renderFooter,
  itemAspect = 'wide',
  fixedHeight,
  center = true,
  minItemWidth = 520,
  maxContainerWidth = 1800,
  gap = 0
  ,title = 'Producto ofertas de temporada',
  heightMultiplier = 1
}: BannerImgProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!autoFetchTopSold || fetchedRef.current) return;
      try {
        setLoading(true); setError(null);
        const resp = await ProductService.getTopMostSoldProducts();
        if (!active) return;
        setProducts(Array.isArray(resp) ? resp.slice(0, limit) : []);
      } catch (e: any) {
        if (active) setError(e.message || 'Error cargando productos top sold');
      } finally {
        if (active) setLoading(false);
        fetchedRef.current = true;
      }
    }
    load();
    return () => { active = false; };
  }, [autoFetchTopSold, limit]);

  // Derivar lista final de elementos a mostrar
  const items: Array<{ key: string; src: string; product?: Product; title?: string }> = autoFetchTopSold && products.length
    ? products.map(p => ({
        key: p.id,
        src: p.images?.[0]?.urlImage || `https://placehold.co/1200x800?text=${encodeURIComponent(p.name)}`,
        product: p,
        title: p.name
      }))
    : images.slice(0, limit).map((img, idx) => ({ key: `static-${idx}`, src: img.src }));

  const aspectClass = (() => {
    if (fixedHeight) return '';
    switch (itemAspect) {
      case 'video': return 'aspect-video'; // 16/9
      case 'classic': return 'aspect-[4/3]';
      case 'square': return 'aspect-square';
      case 'tall': return 'aspect-[3/4]';
      case 'wide':
      default: return 'aspect-[5/3]';
    }
  })();

  const wrapperMax = center ? 'mx-auto max-w-[1800px]' : '';
  // Sólo forzamos altura si fixedHeight está definido; caso contrario se deja fluir por aspect-ratio y ancho del grid.
  const scaledHeight = fixedHeight ? Math.round(fixedHeight * (heightMultiplier || 1)) : undefined;
  const heightStyle: React.CSSProperties | undefined = scaledHeight ? { minHeight: scaledHeight, height: scaledHeight } : undefined;

  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}px, 1fr))`,
    gap: gap ? `${gap}px` : undefined
  };

  return (
    <div className={`w-full ${wrapperMax} ${className || ""}`} style={{ maxWidth: maxContainerWidth }}>
      {title && (
        <h2 className="text-center text-lg font-semibold mb-4">{title}</h2>
      )}
      <div className="w-full grid" style={gridStyle}>
        {items.map((item, i) => (
          <div
            key={item.key}
            className={`relative group w-full h-full overflow-hidden ${aspectClass}`}
            style={heightStyle}
          >
            <img
              src={item.src}
              alt={item.product?.name || `Banner image ${i + 1}`}
              className="w-full h-full object-cover select-none"
              draggable={false}
              loading={i < 4 ? 'eager' : 'lazy'}
            />
            {(showId || renderFooter) && (
              <div className="absolute inset-x-0 bottom-0 bg-black/45 backdrop-blur-sm text-white px-3 py-2 text-[11px] flex flex-col gap-0">
                {showId && (
                  <span className="font-mono truncate">{item.product ? item.product.id : `#${i + 1}`}</span>
                )}
                {item.product && renderFooter && (
                  <span className="opacity-90">
                    {renderFooter(item.product)}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {loading && (
        <div className="mt-2 text-center text-xs text-gray-500">Cargando...</div>
      )}
      {error && (
        <div className="mt-2 text-center text-xs text-red-500">{error}</div>
      )}
    </div>
  );
}

export type { BannerImgProps };