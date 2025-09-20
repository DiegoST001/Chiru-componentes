import React, { useState, useEffect } from "react";
import { Icon } from "../atoms/Icon";
import { Image } from "../atoms/Image";
import { cntl } from "@/utils/cntl";
import { CaretLeft, CaretRight } from "phosphor-react";

interface BrandItem {
  id: string;
  imageUrl: string;
  imageAlt: string;
  brandName?: string;
  href?: string;
}

interface BannerPromotionalProps {
  /** Array de marcas para el carrusel */
  brands?: BrandItem[];
  /** Tiempo de auto-reproducción en milisegundos (0 para deshabilitar) */
  autoPlayInterval?: number;
  /** Deshabilitar navegación manual */
  disableNavigation?: boolean;
  /** Mostrar indicadores de puntos */
  showDots?: boolean;
  /** Función cuando se hace click en una marca */
  onBrandClick?: (brand: BrandItem) => void;
  /** Clases CSS adicionales */
  className?: string;
}

/**
 * BannerPromotional - Carrusel de marcas
 * Componente molécula que muestra múltiples imágenes de marcas con navegación y auto-reproducción
 */
function BannerPromotional({
  brands = [
    {
      id: "falabella1",
      imageUrl: "https://images.falabella.com/v3/assets/bltf4ed0b9a176c126e/blt970823df33f67332/68c02fc64405f4b9bfa7f54a/zona-I-1x.jpg?auto=webp&quality=70&width=1200",
      imageAlt: "Oferta Falabella",
      brandName: "Falabella"
    },
    {
      id: "falabella2", 
      imageUrl: "https://images.falabella.com/v3/assets/bltf4ed0b9a176c126e/blt970823df33f67332/68c02fc64405f4b9bfa7f54a/zona-I-1x.jpg?auto=webp&quality=70&width=1200",
      imageAlt: "Promoción Falabella",
      brandName: "Falabella"
    },
    {
      id: "falabella3",
      imageUrl: "https://images.falabella.com/v3/assets/bltf4ed0b9a176c126e/blt970823df33f67332/68c02fc64405f4b9bfa7f54a/zona-I-1x.jpg?auto=webp&quality=70&width=1200", 
      imageAlt: "Descuentos Falabella",
      brandName: "Falabella"
    }
  ],
  autoPlayInterval = 5000,
  disableNavigation = false,
  showDots = true,
  onBrandClick,
  className
}: BannerPromotionalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-reproducción
  useEffect(() => {
    if (autoPlayInterval > 0 && brands.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === brands.length - 1 ? 0 : prevIndex + 1
        );
      }, autoPlayInterval);
      
      return () => clearInterval(interval);
    }
  }, [autoPlayInterval, brands.length]);

  const handlePrevious = () => {
    setCurrentIndex(currentIndex === 0 ? brands.length - 1 : currentIndex - 1);
  };

  const handleNext = () => {
    setCurrentIndex(currentIndex === brands.length - 1 ? 0 : currentIndex + 1);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleBrandClick = () => {
    const currentBrand = brands[currentIndex];
    if (currentBrand.href) {
      window.open(currentBrand.href, '_blank');
    } else if (onBrandClick) {
      onBrandClick(currentBrand);
    }
  };

  const containerClasses = cntl`
    relative
    w-full
    mx-auto
    bg-white
    overflow-hidden
    ${className}
  `;

  const carouselClasses = cntl`
    relative
    h-[300px]
    md:h-[400px]
    lg:h-[500px]
    overflow-hidden
    cursor-pointer
    transition-all
    duration-300
    hover:brightness-105
  `;

  const slideClasses = cntl`
    absolute
    inset-0
    w-full
    h-full
    transition-transform
    duration-500
    ease-in-out
  `;

  const navigationButtonClasses = cntl`
    absolute
    z-20
    top-1/2
    transform
    -translate-y-1/2
    w-12
    h-12
    md:w-14
    md:h-14
    bg-white
    bg-opacity-80
    hover:bg-opacity-100
    border
    border-gray-300
    rounded-full
    flex
    items-center
    justify-center
    transition-all
    duration-200
    hover:shadow-lg
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
    shadow-md
  `;

  const dotClasses = (isActive: boolean) => cntl`
    w-3
    h-3
    md:w-4
    md:h-4
    rounded-full
    transition-all
    duration-300
    cursor-pointer
    ${isActive 
      ? "bg-white border-2 border-blue-500 scale-110" 
      : "bg-white bg-opacity-60 hover:bg-opacity-80"
    }
  `;

  if (brands.length === 0) {
    return null;
  }

  return (
    <div className={containerClasses}>
      {/* Carrusel de marcas */}
      <div className={carouselClasses} onClick={handleBrandClick}>
        {brands.map((brand, index) => (
          <div
            key={brand.id}
            className={slideClasses}
            style={{
              transform: `translateX(${(index - currentIndex) * 100}%)`
            }}
          >
            <Image
              src={brand.imageUrl}
              alt={brand.imageAlt}
              className="w-full h-full"
              fit="cover"
              radius="none"
              loading={index === currentIndex ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {/* Controles de navegación */}
      {!disableNavigation && brands.length > 1 && (
        <>
          {/* Botón anterior */}
          <button
            className={`${navigationButtonClasses} left-4 md:left-8`}
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            aria-label="Marca anterior"
          >
            <Icon tamano="medium" className="text-gray-700">
              <CaretLeft />
            </Icon>
          </button>

          {/* Botón siguiente */}
          <button
            className={`${navigationButtonClasses} right-4 md:right-8`}
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Siguiente marca"
          >
            <Icon tamano="medium" className="text-gray-700">
              <CaretRight />
            </Icon>
          </button>
        </>
      )}

      {/* Indicadores de puntos */}
      {showDots && brands.length > 1 && (
        <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {brands.map((_, index) => (
            <button
              key={index}
              className={dotClasses(index === currentIndex)}
              onClick={(e) => {
                e.stopPropagation();
                handleDotClick(index);
              }}
              aria-label={`Ir a marca ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export { BannerPromotional };
export type { BrandItem, BannerPromotionalProps };