import React, { useState } from "react";
import { ProductCarousel } from "../molecules/ProductCarousel";
import { ProductListImg } from "../molecules/ProductListImg";
import { ProductDescription } from "../molecules/ProductDescription";
import { ProductPriceInfo } from "../molecules/ProductPriceInfo";
import { ProductActions } from "../molecules/ProductActions";
import { CartCompany } from "../molecules/CartCompany";
import { ProductSpecsList } from "../molecules/ProductSpecsList";
import type { Product } from "@/features/product/models/product.model";

// Tipos de props para cada sección
import type { ImgProduct } from "../molecules/ProductCarousel";
import type { ProductListImgProps } from "../molecules/ProductListImg";
import type { ProductDescriptionProps } from "../molecules/ProductDescription";
import type { ProductPriceInfoProps } from "../molecules/ProductPriceInfo";
import type { ProductActionsProps } from "../molecules/ProductActions";
import type { CartCompanyProps } from "../molecules/CartCompany";
import type { ProductSpecsListProps } from "../molecules/ProductSpecsList";
import { TopService } from "../organisms/TopService";

export type ProductDetailViewProps = {
  images: ImgProduct[];
  productList: ProductListImgProps["products"];
  description: ProductDescriptionProps;
  priceInfo: ProductPriceInfoProps; // discount va aquí, no fuera
  actions: ProductActionsProps;
  cartCompany: CartCompanyProps;
  specs: ProductSpecsListProps["specs"];
};

function ProductDetailView({
  images,
  productList,
  description,
  priceInfo,
  actions,
  cartCompany,
  specs,
}: ProductDetailViewProps) {
  const [current, setCurrent] = useState(0);

  return (
    <div className="flex flex-col md:flex-row gap-8  mx-auto min-h-[600px]">
      {/* Sección de imágenes */}
      <div className="flex flex-col flex-1 justify-center gap-4 items-center bg-white rounded-xl shadow p-6">
        <ProductCarousel
          products={images}
          size="large"
          current={current}
          setCurrent={setCurrent}
        />
        <ProductListImg
          products={productList}
          direction="horizontal"
          size="small" // Cambia a "medium" o "large"
          onSelect={setCurrent}
          selectedIndex={current}
        />
      </div>
      {/* Sección de información */}
      <div className="flex flex-col gap-6 flex-1 justify-between bg-white rounded-xl shadow p-6">
        <ProductDescription {...description} />
        <ProductPriceInfo {...priceInfo} />
        <ProductActions {...actions} />
        {/* pasar el objeto tal cual para respetar la variante (supplier vs legacy) */}
        <CartCompany
          {...cartCompany}
          className="bg-gray-50 p-0"
          noBorder
          noShadow
          size="medium"
        />
        <ProductSpecsList specs={specs} />
      </div>
    </div>
  );
}

export { ProductDetailView };
