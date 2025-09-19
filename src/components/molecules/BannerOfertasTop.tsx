import React, { useState, useRef } from "react";
import { Icon } from "../atoms/Icon";
import { Heading } from "../atoms/Heading";
import { CardPromotions } from "./CardPromotions";
import { cntl } from "@/utils/cntl";
import { CaretLeft, CaretRight } from "phosphor-react";

interface OfertaData {
  id: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
  rightText?: string;
  price?: number;
  badge?: string;
}

interface BannerOfertasTopProps {
  title?: string;
  ofertas?: OfertaData[];
  showNavigation?: boolean;
  cardSize?: "small" | "medium" | "large";
  className?: string;
}

/**
 * BannerOfertasTop - Carrusel horizontal de ofertas destacadas
 * 
 * Componente molécula que muestra un carrusel de tarjetas de promociones.
 * Cada tarjeta usa el componente CardPromotions para mantener consistencia.
 * Ideal para secciones de ofertas especiales, productos destacados o promociones.
 */
function BannerOfertasTop({
  title = "Ofertas Top",
  ofertas = [
    {
      id: "oferta1",
      imageUrl: "https://placehold.co/260x300/FF6B6B/ffffff?text=Oferta+1",
      title: "Smartphone Galaxy S23",
      subtitle: "Samsung Galaxy",
      rightText: "Desc. 25%",
      price: 899.99,
      badge: "HOT"
    },
    {
      id: "oferta2", 
      imageUrl: "https://placehold.co/260x300/4ECDC4/ffffff?text=Oferta+2",
      title: "Laptop Gaming ROG",
      subtitle: "ASUS ROG Strix",
      rightText: "Desc. 30%",
      price: 1299.99,
      badge: "NUEVO"
    },
    {
      id: "oferta3",
      imageUrl: "https://placehold.co/260x300/45B7D1/ffffff?text=Oferta+3", 
      title: "Auriculares Sony",
      subtitle: "Sony WH-1000XM4",
      rightText: "Desc. 40%",
      price: 199.99,
      badge: "POPULAR"
    },
    {
      id: "oferta4",
      imageUrl: "https://placehold.co/260x300/F7DC6F/ffffff?text=Oferta+4",
      title: "Smart TV 55'",
      subtitle: "LG OLED 4K",
      rightText: "Desc. 20%",
      price: 799.99,
      badge: "LIMITADO"
    },
    {
      id: "oferta5",
      imageUrl: "https://placehold.co/260x300/BB8FCE/ffffff?text=Oferta+5",
      title: "MacBook Air M2",
      subtitle: "Apple MacBook",
      rightText: "Desc. 15%",
      price: 1199.99,
      badge: "PREMIUM"
    }
  ],
  showNavigation = true,
  cardSize = "medium",
  className
}: BannerOfertasTopProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
          {ofertas.map((oferta) => (
            <div key={oferta.id} className="flex-shrink-0">
              <CardPromotions
                size={cardSize}
                dataCard={{
                  imageUrl: oferta.imageUrl,
                  title: oferta.title,
                  subtitle: oferta.subtitle,
                  rightText: oferta.rightText,
                  price: oferta.price,
                  badge: oferta.badge
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
    </div>
  );
}

export { BannerOfertasTop };
export type { BannerOfertasTopProps, OfertaData };