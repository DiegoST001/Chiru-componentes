import React, { useEffect, useState } from "react";
import { cntl } from "@/utils/cntl";
import { CartService } from "@/components/molecules/CartService";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/atoms/Button";
import type { Service } from "@/features/service/model/service.model";
import { ServiceService } from "@/features/service/services/service.service";

type TopServiceProps = {
  title?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  services?: Service[]; // Permite pasar servicios ya cargados externamente
  autoFetch?: boolean; // Si true y no se pasan services, hace fetch
  queryParams?: any; // Parámetros opcionales para findAll
  className?: string;
};

type TopServiceData = {
  services: Service[];
};

function getTopServiceStyles() {
  return cntl`
    w-full max-w-7xl mx-auto px-4
  `;
}

function getHeaderStyles() {
  return cntl`
    flex items-center justify-between mb-6
  `;
}

function getTitleStyles() {
  return cntl`
    text-2xl font-bold text-gray-900
  `;
}

function getGridStyles() {
  return cntl`
    grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 h-fit
  `;
}

function getMainCardStyles() {
  return cntl`
    flex justify-center lg:justify-start w-full
  `;
}

function getSecondaryCardsStyles() {
  return cntl`
    flex flex-col gap-4 justify-start w-full
  `;
}

function getResponsiveCardStyles() {
  return cntl`
    w-full max-w-full
    [&>div]:w-full [&>div]:max-w-none
    [&>div]:mx-auto lg:[&>div]:mx-0
  `;
}

function TopService({
  title = "Top Services",
  buttonText = "View All",
  onButtonClick,
  services: externalServices,
  autoFetch = true,
  queryParams,
  className,
}: TopServiceProps) {
  const [services, setServices] = useState<Service[] | undefined>(externalServices);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch automático si no llegan servicios por props
  useEffect(() => {
    if (!externalServices && autoFetch) {
      let active = true;
      const load = async () => {
        try {
          setLoading(true);
          setError(null);
          // Devolver datos en formato esperado
          const resp = await ServiceService.findAll({ page: 1, limit: 3, ...(queryParams || {}) });
          let list: Service[] | undefined;
          if (Array.isArray(resp)) list = resp as Service[];
          else if (resp?.data && Array.isArray(resp.data)) list = resp.data as Service[];
          else if (resp?.services && Array.isArray(resp.services)) list = resp.services as Service[];
          else if (resp?.results && Array.isArray(resp.results)) list = resp.results as Service[];
          else if (resp?.items && Array.isArray(resp.items)) list = resp.items as Service[];
          else if (resp?.content && Array.isArray(resp.content)) list = resp.content as Service[];
          if (!list) {
            // Log diagnóstico para ayudar a detectar estructura real
            console.warn('[TopService] Estructura de respuesta no reconocida', resp);
          }
          if (active) setServices(list?.slice(0, 3));
        } catch (e: any) {
          if (active) setError(e.message || 'Error loading services');
        } finally {
          if (active) setLoading(false);
        }
      };
      load();
      return () => { active = false; };
    } else {
      setServices(externalServices);
    }
  }, [externalServices, autoFetch, queryParams]);

  const handleButtonClick = () => {
    onButtonClick?.();
  };

  const main = services?.[0];
  const secondary = services?.slice(1, 3);

  return (
    <section className={cntl`${getTopServiceStyles()} ${className || ""}`}>
      {(title || buttonText) && (
        <div className={getHeaderStyles()}>
          {title && (
            <Text className={getTitleStyles()}>
              {title}
            </Text>
          )}
          {buttonText && (
            <Button
              variant="outline"
              size="medium"
              text={buttonText}
              onClick={handleButtonClick}
            />
          )}
        </div>
      )}

      {loading && (
        <Text className="text-sm text-gray-500">Cargando servicios...</Text>
      )}
      {error && (
        <Text className="text-sm text-red-600">{error}</Text>
      )}

      {!loading && !error && services && services.length >= 1 && (
        <div className={getGridStyles()}>
          <div className={`${getMainCardStyles()} ${getResponsiveCardStyles()}`}>
            {main && (
              <CartService
                size="large"
                cardWidth={600}
                imageHeight={400}
                service={main}
              />
            )}
          </div>

          <div className={`${getSecondaryCardsStyles()} ${getResponsiveCardStyles()}`}>
            {secondary?.map((s, idx) => (
              <CartService
                key={s.id || idx}
                size="medium"
                cardWidth={500}
                imageHeight={160}
                service={s}
              />
            ))}
          </div>
        </div>
      )}
      {!loading && !error && (!services || services.length === 0) && (
        <Text className="text-sm text-gray-500">No hay servicios disponibles.</Text>
      )}
    </section>
  );
}

export { TopService };
export type { TopServiceProps, TopServiceData };