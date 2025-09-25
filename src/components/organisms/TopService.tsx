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
    w-full max-w-7xl mx-auto px-4 py-6
    md:px-6 md:py-8
    xl:px-8 xl:py-10
  `;
}

function getHeaderStyles() {
  return cntl`
    flex items-center justify-between mb-8
    md:mb-10
    xl:mb-12
  `;
}

function getTitleStyles() {
  return cntl`
    text-2xl font-bold text-gray-900
    md:text-3xl
    xl:text-4xl
  `;
}

function getGridStyles() {
  return cntl`
    flex flex-col items-center gap-6 w-full max-w-7xl mx-auto
    md:flex-col md:items-center md:gap-8
    xl:flex-row xl:items-center xl:justify-start xl:gap-8
  `;
}

function getMainCardStyles() {
  return cntl`
    flex justify-center items-center w-full
    md:w-full md:max-w-2xl
    xl:w-auto xl:flex-shrink-0 xl:flex-grow xl:max-w-none xl:self-center
  `;
}

function getSecondaryCardsStyles() {
  return cntl`
    flex flex-col items-center gap-6 w-full
    md:flex-row md:justify-center md:gap-8 md:max-w-4xl
    xl:flex-col xl:gap-6 xl:max-w-none xl:justify-between xl:flex-shrink-0 xl:w-80 xl:h-full
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
  const [services, setServices] = useState<Service[] | undefined>(
    externalServices,
  );
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
          const resp = await ServiceService.findAll({
            page: 1,
            limit: 3,
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
              "[TopService] Estructura de respuesta no reconocida",
              resp,
            );
          }
          if (active) setServices(list?.slice(0, 3));
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
          {title && <Text className={getTitleStyles()}>{title}</Text>}
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
      {error && <Text className="text-sm text-red-600">{error}</Text>}

      {!loading && !error && services && services.length >= 1 && (
        <div className={getGridStyles()}>
          {/* Tarjeta principal */}
          <div className={getMainCardStyles()}>
            {main && (
              <>
                {/* Vista móvil y tablet */}
                <div className="xl:hidden">
                  <CartService
                    size="medium"
                    cardWidth={340}
                    imageHeight={220}
                    service={main}
                  />
                </div>
                {/* Vista desktop */}
                <div className="hidden xl:block">
                  <CartService
                    size="large"
                    cardWidth={700}
                    imageHeight={480}
                    service={main}
                  />
                </div>
              </>
            )}
          </div>

          {/* Tarjetas secundarias */}
          {secondary && secondary.length > 0 && (
            <div className={getSecondaryCardsStyles()}>
              {secondary.map((s, idx) => (
                <CartService
                  key={s.id || idx}
                  size="medium"
                  cardWidth={340}
                  imageHeight={200}
                  service={s}
                />
              ))}
            </div>
          )}
        </div>
      )}
      {!loading && !error && (!services || services.length === 0) && (
        <Text className="text-sm text-gray-500">
          No hay servicios disponibles.
        </Text>
      )}
    </section>
  );
}

export { TopService };
export type { TopServiceProps, TopServiceData };
