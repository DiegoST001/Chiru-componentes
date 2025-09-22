import React, { useState, useRef, useEffect } from "react";
import { Icon } from "../atoms/Icon";
import { Heading } from "../atoms/Heading";
// Update the import path if CardPromotions is in another folder, e.g. molecules
import { CardPromotions } from "../molecules/CardPromotions";
import { cntl } from "@/utils/cntl";
import { CaretLeft, CaretRight } from "phosphor-react";
import { ProductService } from "@/features/product/services/product.service";
import type { Product } from "@/features/product/models/product.model";

// Shape que consume CardPromotions (normalizada)
interface PromotionCardData {
  id: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
  rightText?: string;
  price?: number;
  badge?: string;
}

/**
 * Props para BannerOfertasTop
 * - Se prioriza el uso del modelo Product (products) sobre la versión simplificada (ofertas).
 * - Prop 'ofertas' queda DEPRECADA y se mantiene solo para compatibilidad temporal con ejemplos previos.
 */
interface BannerOfertasTopProps {
  title?: string;
  /** DEPRECATED: usar 'products' */
  ofertas?: PromotionCardData[];
  /** Lista de productos completos ya obtenidos fuera del componente */
  products?: Product[];
  showNavigation?: boolean;
  cardSize?: "small" | "medium" | "large";
  className?: string;
  /** Si true y no se pasan products se hace fetch a /products/featured */
  autoFetchFeatured?: boolean;
  /** Permite personalizar el mapeo Product -> PromotionCardData */
  mapProductToCard?: (product: Product) => PromotionCardData;
}

/**
 * BannerOfertasTop - Carrusel horizontal de ofertas destacadas
 * 
 * Componente molécula que muestra un carrusel de tarjetas de promociones.
 * Cada tarjeta usa el componente CardPromotions para mantener consistencia.
 * Ideal para secciones de ofertas especiales, productos destacados o promociones.
 */
function BannerOfertasTop({
  title = "Top Ofertas",
  ofertas,
  products,
  showNavigation = true,
  cardSize = "medium",
  className,
  autoFetchFeatured = true,
  mapProductToCard
}: BannerOfertasTopProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [cards, setCards] = useState<PromotionCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Evita refetch infinito cuando solo usamos autoFetchFeatured
  const fetchedRef = useRef(false);

  // Helper: extraer precio numérico de Product.price (Record)
  const extractPrice = (p: Product): number | undefined => {
    if (!p?.price) return undefined;
    const first = Object.values(p.price)[0];
    const n = typeof first === 'string' ? parseFloat(first) : typeof first === 'number' ? first : NaN;
    return isNaN(n) ? undefined : n;
  };

  // Mapeo por defecto Product -> PromotionCardData
  const defaultMap = (p: Product): PromotionCardData => ({
    id: p.id,
    imageUrl: p.images?.[0]?.urlImage || "https://placehold.co/260x300?text=Producto",
    title: p.name,
    subtitle: p.category?.name,
    rightText: p.promotions?.[0] ? 'Promo' : undefined,
    price: extractPrice(p),
    badge: p.isFeatured ? 'TOP' : undefined
  });

  const mapProducts = (list: Product[]) => list.slice(0,5).map(p => (mapProductToCard ? mapProductToCard(p) : defaultMap(p)));

  // Fetch 5 featured products
  useEffect(() => {
    let active = true;
    const hasProducts = !!(products && products.length);
    const hasLegacy = !!(ofertas && ofertas.length);

    async function loadFeatured() {
      try {
        setLoading(true);
        setError(null);
        const resp: Product[] = await ProductService.getFeaturedProducts();
        if (!active) return;
        if (Array.isArray(resp) && resp.length) {
          setCards(mapProducts(resp));
        } else {
          setCards([]);
        }
      } catch (e: any) {
        if (active) setError(e.message || 'Error cargando productos destacados');
      } finally {
        if (active) setLoading(false);
        fetchedRef.current = true;
      }
    }

    // Prioridad: products -> ofertas -> (fetch si auto y aún no se ha hecho)
    if (hasProducts) {
      setCards(mapProducts(products!));
      fetchedRef.current = true; // Consideramos cumplido
    } else if (hasLegacy) {
      setCards(ofertas!.slice(0,5));
      fetchedRef.current = true;
    } else if (autoFetchFeatured && !fetchedRef.current) {
      loadFeatured();
    }

    return () => { active = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetchFeatured, products, ofertas, mapProductToCard]);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 280; // Ancho aproximado de CardPromotions + gap
      scrollContainerRef.current.scrollBy({
        left: -cardWidth * 2,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 280; // Ancho aproximado de CardPromotions + gap
      scrollContainerRef.current.scrollBy({
        left: cardWidth * 2,
        behavior: 'smooth'
      });
    }
  };

  const containerClasses = cntl`
    relative w-full
    ${className || ""}
  `;

  const scrollContainerClasses = cntl`
    flex gap-4 overflow-x-auto scrollbar-hide
    scroll-smooth
    pb-2
  `;

  const buttonClasses = cntl`
    absolute top-1/2 -translate-y-1/2 z-10
    w-10 h-10 rounded-full bg-white shadow-lg
    flex items-center justify-center
    hover:bg-gray-50 transition-colors
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  return (
    <div className={containerClasses}>
      {/* Título */}
      {title && (
        <div className="mb-6">
          <Heading level={2} className="text-center">
            {title}
          </Heading>
        </div>
      )}

      <div className="relative">
        {/* Botón Izquierdo */}
        {showNavigation && (
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={cntl`${buttonClasses} left-2`}
            aria-label="Anterior"
          >
            <Icon tamano="small" variant="default">
              <CaretLeft />
            </Icon>
          </button>
        )}

        {/* Contenedor de scroll */}
        <div
          ref={scrollContainerRef}
          className={scrollContainerClasses}
          onScroll={checkScrollButtons}
        >
          {cards.map(card => (
            <div key={card.id} className="flex-shrink-0">
              <CardPromotions
                size={cardSize}
                dataCard={{
                  imageUrl: card.imageUrl,
                  title: card.title,
                  subtitle: card.subtitle,
                  rightText: card.rightText,
                  price: card.price,
                  badge: card.badge
                }}
              />
            </div>
          ))}
        </div>

        {/* Botón Derecho */}
        {showNavigation && (
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={cntl`${buttonClasses} right-2`}
            aria-label="Siguiente"
          >
            <Icon tamano="small" variant="default">
              <CaretRight />
            </Icon>
          </button>
        )}
      </div>
      {loading && (
        <div className="mt-4 text-center text-xs text-gray-500">Cargando productos...</div>
      )}
      {error && (
        <div className="mt-4 text-center text-xs text-red-600">{error}</div>
      )}
    </div>
  );
}

export { BannerOfertasTop };
export default BannerOfertasTop;
export type { BannerOfertasTopProps, PromotionCardData };