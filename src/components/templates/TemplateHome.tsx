import React from "react";
import ProductsFlex from "../organisms/ProductFlex";
import BrandSupplier from "../organisms/BrandSupplier";
// import ProductsFlex from "../organisms/ProductsFlex";
// import FeaturedProducts from "../organisms/FeaturedProducts";
// import BrandsBanner from "../organisms/BrandsBanner";
import { BannerCompanyStars } from "../organisms/BannerCompanyStars";
import { BannerPromotional } from "../molecules/BannerPromotional";
import { TopService } from "../organisms/TopService";
function TemplateHome() {
  return (
    <main className="w-full space-y-8 my-8">
      <BannerPromotional />
      <BannerCompanyStars />
      <ProductsFlex />
      {/* <TopService /> */} {/* Falta responsive provoca desbordamiento */}
      <BrandSupplier
        title="Brand Supplier"
        description="A section showcasing brand logos to build trust and credibility."
      />
    </main>
  );
}
//mx-4 md:mx-6 lg:mx-8
export { TemplateHome };