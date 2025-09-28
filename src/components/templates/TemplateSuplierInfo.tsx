import React, { useState, useCallback, useEffect } from "react";
import { Header } from "../organisms/Header";
import { HeaderCompany } from "../organisms/HeaderCompany";
import { HeaderCompanyProfile } from "../organisms/HeaderCompanyProfile";
import SupplierHomeSection from "../organisms/SupplierHomeSection";
import SupplierProductSection from "../organisms/SupplierProductSection";
import SupplierServiceSection from "../organisms/SupplierServiceSection";
import { SupplierService } from "@/features/user/supplier/service/supplier.service";

interface TemplateSupplierInfoProps {
  supplierId?: string;
}

const TemplateSupplierInfo = ({ supplierId }: TemplateSupplierInfoProps) => {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [selectedCategoryForProducts, setSelectedCategoryForProducts] = useState<string | undefined>();
  const [hasServices, setHasServices] = useState<boolean>(false);

  useEffect(() => {
    if (!supplierId) return;
    let active = true;
    SupplierService.getCategoriesAndServicesySupplierId(supplierId)
      .then(res => { if (!active) return; setHasServices(res.some(c => (c.services || []).length > 0)); })
      .catch(() => { if (active) setHasServices(false); });
    return () => { active = false; };
  }, [supplierId]);

  const handleSectionChange = useCallback((id: string) => {
    setActiveSection(id);
  }, []);

  return (
    <div>
      <Header />
      <HeaderCompanyProfile supplierId={supplierId} activeSectionId={activeSection} onSectionChange={handleSectionChange} />
      {supplierId && (
        <div className="mt-6 px-4 md:px-8">
          {activeSection === 'home' && <SupplierHomeSection supplierId={supplierId} onGoToProducts={(catId) => {
            setSelectedCategoryForProducts(catId);
            setActiveSection('products');
          }} />}
          {activeSection === 'products' && <SupplierProductSection supplierId={supplierId} initialCategoryId={selectedCategoryForProducts} />}
          {activeSection === 'services' && hasServices && <SupplierServiceSection supplierId={supplierId} />}
        </div>
      )}
    </div>
  );
};

export default TemplateSupplierInfo;
