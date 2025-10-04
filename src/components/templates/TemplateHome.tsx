import React from "react";
import ProductsFlex from "../organisms/ProductFlex";
import BrandSupplier from "../organisms/BrandSupplier";
// import ProductsFlex from "../organisms/ProductsFlex";
// import FeaturedProducts from "../organisms/FeaturedProducts";
// import BrandsBanner from "../organisms/BrandsBanner";
import { BannerCompanyStars } from "../organisms/BannerCompanyStars";
import { BannerPromotional } from "../molecules/BannerPromotional";
import { BannerOfertasTop } from "../organisms/BannerOfertasTop";
import { BannerImg } from "../molecules/BannerImg";
import { SectionOffersByCategory } from "../organisms/SectionOffersByCategory";
import { TopService } from "../organisms/TopService";
import type { TopServiceProps, TopServiceData } from "../organisms/TopService";
function TemplateHome() {
  return (
    <main className="w-full space-y-8 my-8">
      <BannerPromotional />
      <BannerCompanyStars />
      <BannerOfertasTop />
      <BannerImg
        autoFetchTopSold
        limit={3}
        itemAspect="video" 
        minItemWidth={100}
        title="Producto ofertas de temporada"
      />
      <ProductsFlex />
      <SectionOffersByCategory />
      <TopService
        title="Nuestros Servicios Destacados"
        buttonText="Ver todos los servicios"
        autoFetch={true}
      />
      <BrandSupplier
        title="Brand Supplier"
        description="A section showcasing brand logos to build trust and credibility."
      />
    </main>
  );
}
//mx-4 md:mx-6 lg:mx-8
export { TemplateHome };
