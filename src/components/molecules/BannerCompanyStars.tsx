import React, { useState, useRef } from "react";
import { Icon } from "../atoms/Icon";
import { Heading } from "../atoms/Heading";
import { Text } from "../atoms/Text";
import { Image } from "../atoms/Image";
import { Badge } from "../atoms/Badge";
import { cntl } from "@/utils/cntl";
import { CaretLeft, CaretRight } from "phosphor-react";

// Simple company card based on CartCompany structure but simplified
interface CompanyCardProps {
  id: string;
  companyName: string;
  category: string;
  location: string;
  logoUrl: string;
  size?: "small" | "medium" | "large";
}

function CompanyCard({ 
  companyName, 
  category, 
  location, 
  logoUrl, 
  size = "medium" 
}: CompanyCardProps) {
  const cardClasses = cntl`
    bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-300
    flex flex-col items-center p-4 text-center min-w-0
    ${size === "small" ? "w-40 p-3" : ""}
    ${size === "medium" ? "w-52 p-4" : ""}
    ${size === "large" ? "w-60 p-6" : ""}
  `;

  const logoSize = size === "small" ? 50 : size === "medium" ? 60 : 80;

  return (
    <div className={cardClasses}>
      {/* Company Logo */}
      <div className="mb-3">
        <Image
          src={logoUrl}
          alt={`${companyName} logo`}
          width={logoSize}
          height={logoSize}
          className="rounded-lg object-cover bg-gray-100"
        />
      </div>

      {/* Company Name */}
      <Text 
        size={size === "small" ? "sm" : "base"} 
        weight="semibold" 
        className="mb-2 line-clamp-1"
      >
        {companyName}
      </Text>

      {/* Category Badge */}
      <div className="mb-2">
        <Badge 
          variant="default" 
          size={size === "small" ? "small" : "medium"}
        >
          {category}
        </Badge>
      </div>

      {/* Location */}
      <Text 
        size="xs" 
        color="muted" 
        className="line-clamp-1"
      >
        {location}
      </Text>
    </div>
  );
}

interface CompanyData extends Omit<CompanyCardProps, 'id'> {
  id: string;
}

interface BannerCompanyStarsProps {
  title?: string;
  companies?: CompanyData[];
  showNavigation?: boolean;
  cardSize?: "small" | "medium" | "large";
  className?: string;
}

/**
 * BannerCompanyStars - Carrusel horizontal de empresas estrella
 * Muestra tarjetas de empresas en un carrusel scrolleable horizontal
 */
function BannerCompanyStars({
  title = "Empresas Estrella",
  companies = [
    {
      id: "company1",
      companyName: "TechCorp",
      category: "Tecnología",
      location: "Lima, Perú",
      logoUrl: "https://via.placeholder.com/80x80/3b82f6/ffffff?text=TC"
    },
    {
      id: "company2", 
      companyName: "EcoSolutions",
      category: "Medio Ambiente",
      location: "Arequipa, Perú",
      logoUrl: "https://via.placeholder.com/80x80/10b981/ffffff?text=ES"
    },
    {
      id: "company3",
      companyName: "FinanceMax",
      category: "Finanzas",
      location: "Cusco, Perú", 
      logoUrl: "https://via.placeholder.com/80x80/f59e0b/ffffff?text=FM"
    },
    {
      id: "company4",
      companyName: "HealthPlus",
      category: "Salud",
      location: "Trujillo, Perú",
      logoUrl: "https://via.placeholder.com/80x80/ef4444/ffffff?text=HP"
    },
    {
      id: "company5",
      companyName: "EduTech",
      category: "Educación", 
      location: "Piura, Perú",
      logoUrl: "https://via.placeholder.com/80x80/8b5cf6/ffffff?text=ET"
    }
  ],
  showNavigation = true,
  cardSize = "medium",
  className
}: BannerCompanyStarsProps) {
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
      const cardWidth = cardSize === "small" ? 200 : cardSize === "medium" ? 250 : 300;
      scrollContainerRef.current.scrollBy({
        left: -cardWidth * 2,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = cardSize === "small" ? 200 : cardSize === "medium" ? 250 : 300;
      scrollContainerRef.current.scrollBy({
        left: cardWidth * 2,
        behavior: 'smooth'
      });
    }
  };

  const containerClasses = cntl`
    relative
    w-full
    bg-white
    py-6
    ${className}
  `;

  const scrollContainerClasses = cntl`
    flex
    gap-4
    overflow-x-auto
    scrollbar-hide
    scroll-smooth
    px-4
    pb-2
  `;

  const navigationButtonClasses = cntl`
    absolute
    top-1/2
    transform
    -translate-y-1/2
    z-10
    w-10
    h-10
    bg-white
    border
    border-gray-300
    rounded-full
    flex
    items-center
    justify-center
    shadow-md
    hover:shadow-lg
    transition-all
    duration-200
    hover:bg-gray-50
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
  `;

  const titleClasses = cntl`
    px-4
    mb-6
  `;

  return (
    <div className={containerClasses}>
      {/* Título */}
      {title && (
        <div className={titleClasses}>
          <Heading level={2} className="text-gray-800">
            {title}
          </Heading>
        </div>
      )}

      {/* Contenedor del carrusel */}
      <div className="relative">
        {/* Botón anterior */}
        {showNavigation && canScrollLeft && (
          <button
            className={`${navigationButtonClasses} left-2`}
            onClick={scrollLeft}
            aria-label="Deslizar empresas hacia la izquierda"
          >
            <Icon tamano="small" className="text-gray-600">
              <CaretLeft />
            </Icon>
          </button>
        )}

        {/* Container scrolleable */}
        <div
          ref={scrollContainerRef}
          className={scrollContainerClasses}
          onScroll={checkScrollButtons}
        >
          {companies.map((company) => (
            <div key={company.id} className="flex-shrink-0">
              <CompanyCard
                {...company}
                size={cardSize}
              />
            </div>
          ))}
        </div>

        {/* Botón siguiente */}
        {showNavigation && canScrollRight && (
          <button
            className={`${navigationButtonClasses} right-2`}
            onClick={scrollRight}
            aria-label="Deslizar empresas hacia la derecha"
          >
            <Icon tamano="small" className="text-gray-600">
              <CaretRight />
            </Icon>
          </button>
        )}
      </div>
    </div>
  );
}

export { BannerCompanyStars };
export type { BannerCompanyStarsProps, CompanyData };