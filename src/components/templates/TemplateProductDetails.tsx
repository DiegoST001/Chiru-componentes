import React, { useEffect, useState } from "react";
import { ProductDetailView } from "../organisms/ProductDetailView";
import { ProductService } from "@/features/product/services/product.service";
import type { Product } from "@/features/product/models/product.model";
import type { ProductDetailViewProps } from "../organisms/ProductDetailView";

type TemplateProductDetailsProps = {
  productId: string;
};

function TemplateProductDetails({ productId }: TemplateProductDetailsProps) {
  const [productDetail, setProductDetail] = useState<ProductDetailViewProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    ProductService.findOne(productId)
      .then((product: Product) => {
        const promo = product.promotions?.[0];
        const mapped: ProductDetailViewProps = {
          images: product.images?.map(img => ({
            id: img.idImageProduct?.toString() ?? "",
            imgUrl: img.urlImage,
          })) ?? [],
          productList: product.images?.map(img => ({
            id: img.idImageProduct?.toString() ?? "",
            imgUrl: img.urlImage,
          })) ?? [],
          description: {
            name: product.name,
            description: product.description,
            provider: product.supplier?.name ?? "",
            verified: product.supplier?.verificationStatus === "Verified",
          },
          priceInfo: {
            currentPrice: product.price?.ranges?.[0]?.cost
              ? `S/. ${product.price.ranges[0].cost}`
              : "S/. 0.00",
            // discount: promo?.discount ?? undefined, 
          },
          actions: {
            onBuy: () => alert("Comprar producto"),
            onContact: () => alert("Contactar proveedor"),
            onReport: () => alert("Reportar producto"),
          },
          cartCompany: {
            size: "medium",
            variant: "default",
            id: product.supplier?.id ?? "",
            avatarUrl: product.supplier?.logo ?? "/placeholder.png",
            name: product.supplier?.name ?? "",
            tagLabel: product.supplier?.bussinessCategory ?? "",
            rightText: product.stock > 0 ? "En stock" : "Sin stock",
          },
          specs: product.specifications
            ? product.specifications.split(",").map(s => s.trim())
            : [],
        };
        setProductDetail(mapped);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
      })
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) return <main className="p-8 text-center">Cargando producto...</main>;
  if (!productDetail) return <main className="p-8 text-center">Producto no encontrado.</main>;

  return (
    <main>
      <ProductDetailView {...productDetail} />
    </main>
  );
}

export default TemplateProductDetails;
