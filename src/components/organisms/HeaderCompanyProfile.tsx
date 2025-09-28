import React, { useEffect, useState } from "react";
import { Text } from "@/components/atoms/Text";
import NavegationSupplier from "../molecules/NavegationSupplier";
import { Image } from "../atoms/Image";
import { Heading } from "../atoms/Heading";
import { Badge } from "../atoms/Badge";
import { SupplierService } from "@/features/user/supplier/service/supplier.service";
import type { Supplier } from "@/features/user/supplier/model/supplier.model";
import { Wrench, House, Package } from 'phosphor-react';

interface HeaderCompanyProfileProps {
  supplierId?: string;
  autoFetch?: boolean; // por si en algún caso se pasa directamente el objeto y no se quiere fetch
  supplier?: Supplier;
  className?: string;
  /** sección activa controlada externamente (home, products, etc) */
  activeSectionId?: string;
  /** callback cuando cambia la sección vía navegación */
  onSectionChange?: (id: string) => void;
}

function HeaderCompanyProfile({ supplierId, autoFetch = true, supplier: supplierProp, className, activeSectionId, onSectionChange }: HeaderCompanyProfileProps) {
  const [supplier, setSupplier] = useState<Supplier | undefined>(supplierProp);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasServices, setHasServices] = useState(false);

  useEffect(() => {
    if (!autoFetch) return;
    if (supplierProp) return; // ya tenemos el objeto
    if (!supplierId) return;
    let active = true;
    setLoading(true); setError(null);
    SupplierService.findOne(supplierId)
      .then(res => { if (active) setSupplier(res); })
      .catch(e => { if (active) setError(e.message || 'Error cargando proveedor'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [supplierId, supplierProp, autoFetch]);

  useEffect(() => {
    if (!supplierId) return;
    let active = true;
    SupplierService.getCategoriesAndServicesySupplierId(supplierId)
      .then(res => { if (!active) return; const anyService = res.some(c => (c.services || []).length > 0); setHasServices(anyService); })
      .catch(() => { if (active) setHasServices(false); });
    return () => { active = false; };
  }, [supplierId]);

  const verified = supplier?.verificationStatus === 'Verified';
  const logo = supplier?.logo || '/chiru_logo_full.svg';
  const name = supplier?.name || 'Proveedor';
  const addressParts = [supplier?.city, supplier?.state, supplier?.country].filter(Boolean).join(', ');

  const navItems = [
    { id: 'home', icon: <House />, label: 'Inicio' },
    { id: 'products', icon: <Package />, label: 'Productos' },
    ...(hasServices ? [{ id: 'services', icon: <Wrench />, label: 'Servicios' }] : []),
  ];

  return (
    <div className={`w-full bg-white space-y-2 md:space-y-4 ${className || ''}`}>
      <div className="flex flex-col md:flex-row items-center justify-start gap-4 md:gap-6 lg:gap-8 w-full bg-gray-900 p-2 md:p-4 lg:p-6 relative">
        <Image
          radius="full"
            src={logo}
          fit="cover"
          className="w-20 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 p-0.5 md:p-2 object-cover bg-white border border-gray-200"
        />

        <div className="flex flex-col justify-start gap-2 md:gap-3 px-4 flex-1 min-w-0 w-full">
          <div className="flex items-center gap-3 flex-wrap">
            <Heading
              color="white"
              className="text-white text-2xl md:text-3xl lg:text-4xl font-extrabold truncate max-w-full"
            >
              {name}
            </Heading>
            {verified && (
              <Badge variant="success" size="medium" className="!bg-green-500 text-white">
                Verificado
              </Badge>
            )}
          </div>
          <Text size="sm" weight="normal" className="text-white/80">
            {supplier?.bussinessCategory || 'Categoría no definida'}
          </Text>
          <Text size="sm" className="text-white font-light truncate max-w-full">
            {addressParts || supplier?.address || 'Dirección no disponible'}
          </Text>
          <div className="flex gap-4 flex-wrap text-xs text-white/70">
            {supplier?.yearsOfExperience && (
              <span><strong>Experiencia:</strong> {supplier.yearsOfExperience} {Number(supplier.yearsOfExperience) === 1 ? 'año' : 'años'}</span>
            )}
            {supplier?.postalCode && (
              <span><strong>Código Postal:</strong> {supplier.postalCode}</span>
            )}
          </div>
        </div>
        {loading && <div className="absolute top-2 right-3 text-xs text-white/70 animate-pulse">Cargando...</div>}
        {error && <div className="absolute top-2 right-3 text-xs text-red-300">{error}</div>}
      </div>
      <NavegationSupplier className="justify-start"
        activeId={activeSectionId}
        onActiveChange={onSectionChange}
        items={navItems as any}
      />
    </div>
  );
}
export { HeaderCompanyProfile };
export type { HeaderCompanyProfileProps };
