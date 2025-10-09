import React, { useEffect, useState } from "react";
import { Text } from "@/components/atoms/Text";
import { Spinner } from "@/components/atoms/Spinner";
import { FilterSupplier } from "@/components/molecules/FilterSupplier";
import {
  Check,
  X as XIcon,
} from "phosphor-react";
import { ServiceService } from "@/features/service/services/service.service";

function currencySymbol(code?: string) {
  if (!code) return "S/.";
  const c = String(code).toUpperCase();
  if (["PEN", "S/.", "S/"].includes(c)) return "S/.";
  if (["USD", "$"].includes(c)) return "$";
  if (["EUR", "€"].includes(c)) return "€";
  return c;
}

function toNumber(maybe: any): number | null {
  if (typeof maybe === "number" && !Number.isNaN(maybe)) return maybe;
  if (typeof maybe === "string" && maybe.trim() && !Number.isNaN(Number(maybe)))
    return Number(maybe);
  if (maybe && typeof maybe === "object") {
    if (typeof maybe.amount === "number") return maybe.amount;
    if (Array.isArray(maybe.ranges) && maybe.ranges[0]) {
      const r = maybe.ranges[0];
      if (typeof r.amountMin === "number") return r.amountMin;
      if (typeof r.amountMax === "number") return r.amountMax;
      if (typeof r.amount === "number") return r.amount;
    }
  }
  return null;
}

function getPriceAndCurrency(svc: any): { price: number | null; currency?: string } {
  const p1 = toNumber(svc?.price);
  if (p1 !== null) return { price: p1, currency: svc?.currency || svc?.price?.currency };
  const p2 = toNumber(svc?.budget);
  if (p2 !== null) return { price: p2, currency: svc?.currency || svc?.budget?.currency };
  const p3 = toNumber(svc?.price?.amount ?? svc?.price?.ranges);
  if (p3 !== null) return { price: p3, currency: svc?.price?.currency || svc?.currency };
  return { price: null, currency: svc?.currency };
}

function formatPrice(n: number | null, curr?: string) {
  if (n === null) return "S/. 0.00";
  return `${currencySymbol(curr)} ${n.toFixed(2)}`;
}

function isActive(svc: any): boolean {
  if (typeof svc?.isAvailable === "boolean") return svc.isAvailable;
  if (typeof svc?.available === "boolean") return svc.available;
  if (typeof svc?.active === "boolean") return svc.active;
  if (typeof svc?.status === "string") return svc.status.toLowerCase() === "active";
  return true;
}



function AvailabilityPill({ active }: { active: boolean }) {
  if (active) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-green-50">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-600 text-white leading-none">
          <Check size={12} weight="bold" />
        </span>
        <span className="text-green-700 text-xs leading-none">Activo</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-red-50">
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white leading-none">
        <XIcon size={12} weight="bold" />
      </span>
      <span className="text-red-700 text-xs leading-none">Inactivo</span>
    </span>
  );
}

type ServiceItemProps = {
  service: any;
  onStatusChange: (serviceId: any, newStatus: string) => void;
  index: number;
};

function ServiceItem({ service, onStatusChange, index }: ServiceItemProps) {
  const img =
    service?.images?.[0]?.urlImage ||
    service?.images?.[0]?.url ||
    service?.imageUrl ||
    service?.image ||
    "https://placehold.co/64x64/E5E7EB/6B7280?text=IMG";

  const title = service?.name ?? service?.title ?? "Text-Title";
  const desc = service?.description ?? service?.objective ?? "text";
  const categoryName =
    service?.serviceCategory?.name ??
    service?.category?.name ??
    "texto";

  const { price, currency } = getPriceAndCurrency(service);
  const priceText = formatPrice(price, currency);
  const active = isActive(service);

  const displayId = `#${index}`;

  return (
    <div className="bg-white rounded-xl shadow p-6 w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-gray-200 rounded-sm"></span>
          <Text size="base" weight="bold">{displayId}</Text>
          <Text size="sm" color="muted">text</Text>
        </div>
        
        <div className="flex items-center gap-2">
          <Text size="sm" weight="medium">Estado:</Text>
          <select
            value={active ? "Activo" : "Inactivo"}
            onChange={(e) => onStatusChange(service.id, e.target.value.toLowerCase())}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Suspendido">Suspendido</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Text size="sm" weight="bold" className="mr-2">text:</Text>
        <select className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white" defaultValue={categoryName}>
          <option value={categoryName}>{categoryName}</option>
        </select>
        <button className="px-4 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
          text
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="w-4 h-4 bg-gray-300 rounded-sm"></span>
        <Text size="sm" color="muted">text:</Text>
      </div>

      <div className="relative flex bg-gray-50 rounded-lg p-2 items-center gap-2 min-h-[80px]">
        <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
          <img
            src={img}
            alt="ServiceImage"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <Text size="base" weight="semibold">{title}</Text>
          <Text size="sm" color="muted">{desc}</Text>
          <Text size="base" weight="bold" color="primary">{priceText}</Text>
        </div>
      </div>
    </div>
  );
}

export default function AllServicesInventory() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSearchQuery, setTempSearchQuery] = useState("");

  const loadAllServices = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Cargando servicios...');
      
      let servicesList = [];
      
      try {
        const response1 = await ServiceService.filterServices({
          supplierId: "45e63354-a42a-49d6-b38f-2fd7c536342a",
          page: 1,
          limit: 50
        });
        console.log('📥 Respuesta filterServices:', response1);
        servicesList = response1?.data || [];
      } catch (filterError) {
        console.log('❌ filterServices falló, intentando findAll...');
        try {
          const response2 = await ServiceService.findAll({});
          console.log('📥 Respuesta findAll:', response2);
          servicesList = response2?.data || response2 || [];
        } catch (findAllError) {
          console.log('❌ findAll también falló, usando datos de ejemplo...');
          servicesList = [
            {
              id: 1,
              name: "Consultoría Tecnológica",
              description: "Asesoramiento especializado en tecnología",
              price: 250.00,
              currency: "PEN",
              serviceCategory: { name: "Consultoría" },
              supplier: { name: "Tech Solutions" },
              images: [{ urlImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop" }],
              status: "active"
            },
            {
              id: 2,
              name: "Desarrollo Web",
              description: "Creación de sitios web profesionales",
              price: 1200.00,
              currency: "PEN", 
              serviceCategory: { name: "Desarrollo" },
              supplier: { name: "Web Masters" },
              images: [{ urlImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=100&h=100&fit=crop" }],
              status: "active"
            },
            {
              id: 3,
              name: "Soporte Técnico 24/7",
              description: "Soporte técnico continuo para empresas",
              price: 150.00,
              currency: "PEN",
              serviceCategory: { name: "Soporte" },
              supplier: { name: "Support Pro" },
              images: [{ urlImage: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=100&h=100&fit=crop" }],
              status: "inactive"
            }
          ];
        }
      }
      
      console.log('📊 Servicios encontrados:', servicesList.length);
      setServices(servicesList);
    } catch (error: any) {
      console.error('❌ Error total cargando servicios:', error);
      setError(error?.message || "Error cargando servicios");
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllServices();
  }, []);

  const handleStatusChange = (serviceId: any, newStatus: string) => {
    console.log(`Cambiar estado del servicio ${serviceId} a: ${newStatus}`);
    setServices(prev => 
      prev.map(service => 
        service.id === serviceId 
          ? { ...service, status: newStatus, active: newStatus === 'active' }
          : service
      )
    );
  };

  const filteredServices = services.filter(service => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const name = (service?.name || "").toLowerCase();
    const desc = (service?.description || "").toLowerCase();
    const category = (service?.serviceCategory?.name || service?.category?.name || "").toLowerCase();
    return name.includes(query) || desc.includes(query) || category.includes(query);
  });

  return (
    <section className="p-4 sm:p-6">
      <div className="w-full mb-8">
        <FilterSupplier
          size="small"
          onFilter={(filters) => {
            console.log('Filtros aplicados:', filters);
          }}
        />
      </div>

      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <Spinner size="lg" />
            <Text color="muted" className="mt-4">Cargando servicios...</Text>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-center py-8">
            <Text color="danger">{error}</Text>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <Text>No se encontraron servicios.</Text>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredServices.map((service, index) => (
              <ServiceItem
                key={service?.id || index}
                service={service}
                onStatusChange={handleStatusChange}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {!loading && filteredServices.length > 0 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <Text size="sm" color="muted">
            Mostrando {filteredServices.length} servicios
          </Text>
        </div>
      )}
    </section>
  );
}