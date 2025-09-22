import React, { useState, useEffect, useRef } from "react";
import { Icon } from "../atoms/Icon";
import { Image } from "../atoms/Image";
import { cntl } from "@/utils/cntl";
import { CaretLeft, CaretRight } from "phosphor-react";
import type { Category } from "@/features/sponsorship/model/sponsorship.model";
import { SponsorshipService } from "@/features/sponsorship/service/sponsorship.service";

interface BannerPromotionalProps {
  categories?: Category[];
  autoFetchCategories?: boolean;
  autoPlayInterval?: number;
  disableNavigation?: boolean;
  showDots?: boolean;
  onCategoryClick?: (category: Category) => void;
  className?: string;
}

function BannerPromotional({
  categories,
  autoFetchCategories = true,
  autoPlayInterval = 5000,
  disableNavigation = false,
  showDots = false, // por requerimiento: ocultar puntos por defecto
  onCategoryClick,
  className
}: BannerPromotionalProps) {
  const [slides, setSlides] = useState<Category[]>(categories || []);
  const [currentIndex, setCurrentIndex] = useState(slides.length > 1 ? 1 : 0); // incluye clones
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Fetch
  useEffect(() => {
    let active = true;
    async function fetchCategories() {
      if (!autoFetchCategories || (categories && categories.length)) return;
      try {
        setLoading(true); setError(null);
        const resp = await SponsorshipService.centralSponsor();
        if (active && Array.isArray(resp)) {
          setSlides(resp);
          setCurrentIndex(resp.length > 1 ? 1 : 0);
        }
      } catch (e: any) {
        if (active) setError(e.message || 'Error cargando categorías');
      } finally {
        if (active) setLoading(false);
      }
    }
    if (categories && categories.length) {
      setSlides(categories);
      setCurrentIndex(categories.length > 1 ? 1 : 0);
    } else {
      fetchCategories();
    }
    return () => { active = false; };
  }, [categories, autoFetchCategories]);

  const realLength = slides.length;
  const extendedSlides = realLength > 1 ? [slides[realLength - 1], ...slides, slides[0]] : slides;

  // autoplay
  useEffect(() => {
    if (autoPlayInterval > 0 && realLength > 1) {
      const interval = setInterval(() => nextSlide(), autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlayInterval, realLength]);

  const nextSlide = () => {
    if (isTransitioning || realLength <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex(i => i + 1);
  };
  const prevSlide = () => {
    if (isTransitioning || realLength <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex(i => i - 1);
  };

  useEffect(() => {
    if (!trackRef.current) return;
    const handler = () => {
      setIsTransitioning(false);
      if (currentIndex === 0) {
        trackRef.current!.style.transition = 'none';
        setCurrentIndex(realLength);
        requestAnimationFrame(() => { if (trackRef.current) trackRef.current.style.transition = ''; });
      } else if (currentIndex === realLength + 1) {
        trackRef.current!.style.transition = 'none';
        setCurrentIndex(1);
        requestAnimationFrame(() => { if (trackRef.current) trackRef.current.style.transition = ''; });
      }
    };
    const node = trackRef.current;
    node?.addEventListener('transitionend', handler);
    return () => node?.removeEventListener('transitionend', handler);
  }, [currentIndex, realLength]);

  const handleCategoryClick = () => {
    if (realLength === 0 || !onCategoryClick) return;
    const logicalIndex = realLength === 0 ? 0 : ((currentIndex - 1 + realLength) % realLength);
    onCategoryClick(slides[logicalIndex]);
  };

  const containerClasses = cntl`relative w-full bg-white overflow-hidden group ${className}`;
  const carouselClasses = cntl`relative h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden cursor-pointer`;
  const trackClasses = cntl`flex h-full w-full`;
  const slideClasses = cntl`flex-shrink-0 w-full h-full relative`;
  const navigationButtonClasses = cntl`absolute z-20 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white bg-opacity-80 hover:bg-opacity-100 border border-gray-300 rounded-full flex items-center justify-center transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto`;
  const dotClasses = (active: boolean) => cntl`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 cursor-pointer ${active ? 'bg-white border-2 border-blue-500 scale-110' : 'bg-white bg-opacity-60 hover:bg-opacity-80'} opacity-0`;

  if (loading) {
    return <div className={cntl`w-full h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center bg-gray-100`}><span className="text-gray-500 text-sm">Cargando categorías...</span></div>;
  }
  if (error) {
    return <div className={cntl`w-full h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center bg-red-50`}><span className="text-red-600 text-sm">{error}</span></div>;
  }
  if (!loading && realLength === 0) return null;

  return (
    <div className={containerClasses}>
      <div className={carouselClasses + ' w-screen'} onClick={handleCategoryClick}>
        <div
          ref={trackRef}
          className={trackClasses}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: isTransitioning ? 'transform 0.55s ease-in-out' : 'none'
          }}
        >
          {extendedSlides.map((cat, idx) => (
            <div key={cat.id + '-' + idx} className={slideClasses}>
              <Image
                src={cat.image || 'https://placehold.co/1200x400?text=Categoria'}
                alt={cat.name}
                className="w-full h-full"
                fit="cover"
                radius="none"
                loading={idx === currentIndex ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 bg-black/20 flex items-end p-4">
                {/* <span className="text-white text-lg font-semibold drop-shadow">{cat.name}</span> */}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!disableNavigation && realLength > 1 && (
        <>
          <button
            className={navigationButtonClasses + ' left-4 md:left-8'}
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            aria-label="Anterior"
          >
            <Icon tamano="medium" className="text-gray-700"><CaretLeft /></Icon>
          </button>
          <button
            className={navigationButtonClasses + ' right-4 md:right-8'}
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
            aria-label="Siguiente"
          >
            <Icon tamano="medium" className="text-gray-700"><CaretRight /></Icon>
          </button>
        </>
      )}

      {showDots && realLength > 1 && (
        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10 pointer-events-none">
          {slides.map((_, i) => {
            const logical = (currentIndex - 1 + realLength) % realLength;
            return (
              <button
                key={i}
                className={dotClasses(i === logical)}
                aria-label={`Ir a categoría ${i + 1}`}
                tabIndex={-1}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export { BannerPromotional };
export type { BannerPromotionalProps };