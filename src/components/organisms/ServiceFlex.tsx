import React, { useEffect, useState } from "react";
import { cntl } from "@/utils/cntl";
import { CartService } from "@/components/molecules/CartService";
import { Text } from "@/components/atoms/Text";
import type { Service } from "@/features/service/model/service.model";
import { ServiceService } from "@/features/service/services/service.service";

type ServiceFlexProps = {
  title?: string;
  services?: Service[]; // Permite pasar servicios ya cargados externamente
  autoFetch?: boolean; // Si true y no se pasan services, hace fetch
  queryParams?: any; // Parámetros opcionales para findAll
  className?: string;
  limit?: number; // Número máximo de servicios a mostrar
};

function getGridStyles() {
  return cntl`
    grid gap-6
    grid-cols-1
    sm:grid-cols-2
    md:grid-cols-3
    xl:grid-cols-4
  `;
}

function getTitleStyles() {
  return cntl`
    text-2xl font-bold text-gray-900
    md:text-3xl
    xl:text-4xl
  `;
}

function ServiceFlex({
  title,
  services: externalServices,
  autoFetch = true,
  queryParams,
  className,
  limit,
}: ServiceFlexProps) {
  const [services, setServices] = useState<Service[] | undefined>(
    externalServices,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch automático si no llegan servicios por props (igual que TopService)
  useEffect(() => {
    if (!externalServices && autoFetch) {
      let active = true;
      const load = async () => {
        try {
          setLoading(true);
          setError(null);
          // Devolver datos en formato esperado (mismo código que TopService)
          const resp = await ServiceService.findAll({
            page: 1,
            limit: limit || 20, // Más servicios por defecto para la vista completa
            ...(queryParams || {}),
          });
          let list: Service[] | undefined;
          if (Array.isArray(resp)) list = resp as Service[];
          else if (resp?.data && Array.isArray(resp.data))
            list = resp.data as Service[];
          else if (resp?.services && Array.isArray(resp.services))
            list = resp.services as Service[];
          else if (resp?.results && Array.isArray(resp.results))
            list = resp.results as Service[];
          else if (resp?.items && Array.isArray(resp.items))
            list = resp.items as Service[];
          else if (resp?.content && Array.isArray(resp.content))
            list = resp.content as Service[];
          if (!list) {
            // Log diagnóstico para ayudar a detectar estructura real
            console.warn(
              "[ServiceFlex] Estructura de respuesta no reconocida",
              resp,
            );
          }
          if (active) {
            setServices(limit ? list?.slice(0, limit) : list);
          }
        } catch (e: any) {
          if (active) setError(e.message || "Error loading services");
        } finally {
          if (active) setLoading(false);
        }
      };
      load();
      return () => {
        active = false;
      };
    } else {
      setServices(externalServices);
    }
  }, [externalServices, autoFetch, queryParams, limit]);

  return (
    <section
      className={cntl`w-full max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8 xl:px-8 xl:py-10 ${className || ""}`}
    >
      {/* Header con título solamente */}
      {title && (
        <div className="mb-8 md:mb-10 xl:mb-12">
          <Text className={getTitleStyles()}>{title}</Text>
        </div>
      )}

      {/* Estados de carga y error */}
      {loading && (
        <div className="flex justify-center items-center min-h-[200px]">
          <Text className="text-sm text-gray-500">Cargando servicios...</Text>
        </div>
      )}

      {error && (
        <div className="flex justify-center items-center min-h-[200px]">
          <Text className="text-sm text-red-600">{error}</Text>
        </div>
      )}

      {/* Grid de servicios */}
      {!loading && !error && services && services.length > 0 && (
        <div className={getGridStyles()}>
          {services.map((service, idx) => (
            <div key={service.id || idx} className="flex justify-center">
              <CartService
                service={service}
                size="medium"
                cardWidth={320}
                imageHeight={200}
              />
            </div>
          ))}
        </div>
      )}

      {/* Estado sin servicios */}
      {!loading && !error && (!services || services.length === 0) && (
        <div className="flex justify-center items-center min-h-[200px]">
          <Text className="text-sm text-gray-500">
            No hay servicios disponibles.
          </Text>
        </div>
      )}
    </section>
  );
}

export { ServiceFlex };
export type { ServiceFlexProps };
