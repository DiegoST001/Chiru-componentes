import React, { useState } from "react";
import { TabItem } from "../atoms/TabItem";
import { ProductSpecsTable } from "../molecules/ProductSpecsTable";
import { ProductDescriptionList } from "../molecules/ProductDescriptionList";
import { Text } from "../atoms/Text";

export type ProductDetailsTabsProps = {
  specs: { key: string; value: string }[];
  descriptions: string[];
  companyInfo?: React.ReactNode;
};

export function ProductDetailsTabs({ specs, descriptions, companyInfo }: ProductDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="w-full bg-gray-50 rounded-lg p-4">
      <div className="flex border-b mb-4">
        <TabItem active={activeTab === 0} onClick={() => setActiveTab(0)}>
          Descripción del Producto
        </TabItem>
        <TabItem active={activeTab === 1} onClick={() => setActiveTab(1)}>
          Información de la empresa
        </TabItem>
      </div>
      {activeTab === 0 && (
        <>
          <ProductSpecsTable specs={specs} />
          <ProductDescriptionList descriptions={descriptions} />
        </>
      )}
      {activeTab === 1 && (
        <div className="mt-6">
          {companyInfo || <Text size="base" color="muted">Sin información de empresa.</Text>}
        </div>
      )}
    </div>
  );
}
