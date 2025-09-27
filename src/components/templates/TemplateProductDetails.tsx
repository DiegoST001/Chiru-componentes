import React, { useEffect, useState } from "react";
import { ProductDetailView } from "../organisms/ProductDetailView";
import { ProductService } from "@/features/product/services/product.service";
import type { Product } from "@/features/product/models/product.model";
import type { ProductDetailViewProps } from "../organisms/ProductDetailView";
import { RelatedProducts } from "../molecules/RelatedProducts";
import type { RelatedProduct } from "../molecules/RelatedProducts";
import { ProductDetailsTabs } from "../organisms/ProductDetailsTabs";
import type { CartCompanyProps } from "../molecules/CartCompany";
type TemplateProductDetailsProps = {
  productId: string;
};

function TemplateProductDetails({ productId }: TemplateProductDetailsProps) {
  const [productDetail, setProductDetail] = useState<ProductDetailViewProps | null>(null);
  const [related, setRelated] = useState<RelatedProduct[]>([]);
  const [tabsData, setTabsData] = useState<{
    specs: { key: string; value: string }[];
    descriptions: string[];
    companyInfo: React.ReactNode;
  }>({ specs: [], descriptions: [], companyInfo: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);

    ProductService.findOne(productId)
      .then((product: Product) => {
        // Mapeo para ProductDetailView
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
          },
          actions: {
            onBuy: () => alert("Comprar producto"),
            onContact: () => alert("Contactar proveedor"),
            onReport: () => alert("Reportar producto"),
          },
          cartCompany: {
            variant: "default",
            id: product.supplier?.id ?? "",
            avatarUrl: product.supplier?.logo ?? "/placeholder.png",
            name: product.supplier?.name ?? "",
            tagLabel: product.supplier?.bussinessCategory ?? "",
            rightText: product.stock > 0 ? "En stock" : "Sin stock",
          },
          specs: product.specifications
            ? product.specifications.replace(/(^"|"$)/g, "").split(",").map(s => s.trim())
            : [],
        };
        setProductDetail(mapped);

        // Mapeo para ProductDetailsTabs
        // specs: usa details si existe, si no basicInfo
        const specsObj = product.details ?? product.basicInfo ?? {};
        const specs = Object.entries(specsObj).map(([key, value]) => ({
          key,
          value: String(value),
        }));

        // descriptions: specifications como lista
        const descriptions: string[] = product.specifications
          ? product.specifications.replace(/(^"|"$)/g, "").split(",").map(s => s.trim())
          : [];

        // companyInfo: datos del supplier
        const supplier = product.supplier;
        const companyInfo = (
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-white rounded-lg p-6 shadow-sm">
            <img
              src={supplier?.logo ?? "/placeholder.png"}
              alt={supplier?.name ?? "Logo empresa"}
              className="w-24 h-24 object-contain rounded-full border bg-gray-100"
              loading="lazy"
            />
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">{supplier?.name}</h3>
              <div className="text-gray-700 text-sm mb-2">{supplier?.address}</div>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-gray-600 text-sm">
                <span><strong>Categoría:</strong> {supplier?.bussinessCategory}</span>
                <span><strong>Ciudad:</strong> {supplier?.city}, {supplier?.country}</span>
                <span><strong>Contacto:</strong> {supplier?.suppliernumber}</span>
              </div>
              <div className="mt-2 flex gap-3 items-center">
                <span className="font-semibold text-gray-700">Redes:</span>
                {supplier?.socialmedia?.twitter && (
                  <a href={supplier.socialmedia.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Twitter</a>
                )}
                {supplier?.socialmedia?.facebook && (
                  <a href={supplier.socialmedia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Facebook</a>
                )}
                {supplier?.socialmedia?.linkedin && (
                  <a href={supplier.socialmedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">LinkedIn</a>
                )}
              </div>
            </div>
          </div>
        );

        setTabsData({ specs, descriptions, companyInfo });
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
      });

    ProductService.getSimilarProducts(productId)
      .then((products: Product[]) => {
        const mappedRelated: RelatedProduct[] = products.map((p) => ({
          id: p.id ?? "",
          imageUrl: p.images?.[0]?.urlImage ?? "/placeholder.png",
          title: p.name,
          price: p.price?.ranges?.[0]?.cost ?? 0,
          currency: p.price?.ranges?.[0]?.currency ?? "S/.",
          description: p.description,
        }));
        setRelated(mappedRelated);
      })
      .catch((err) => {
        console.error("Error fetching related products:", err);
      })
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading)
    return <main className="p-8 text-center">Cargando producto...</main>;
  if (!productDetail)
    return <main className="p-8 text-center">Producto no encontrado.</main>;

  return (
    <main className="max-w-7xl mx-auto  px-4 md:px-6 lg:px-8 my-8">
      <ProductDetailView {...productDetail} />
      <RelatedProducts items={related} minColWidth={50} gap={24} />
      <ProductDetailsTabs
        specs={tabsData.specs}
        descriptions={tabsData.descriptions}
        companyInfo={tabsData.companyInfo}
      />
    </main>
  );
}

export default TemplateProductDetails;
