import React, { useEffect, useState, useRef } from "react";
import { Heading } from "../atoms/Heading";
import { cntl } from "@/utils/cntl";
import { CartCompany } from "../molecules/CartCompany";
import type { SponsoredSupplier } from "@/features/sponsorship/model/sponsorship.model";
import { SponsorshipService } from "@/features/sponsorship/service/sponsorship.service";

interface BannerCompanyStarsProps {
  title?: string;
  autoFetchSuppliers?: boolean;
  suppliers?: SponsoredSupplier[];
  speed?: number; // px per second for marquee scroll
  pauseOnHover?: boolean;
  cardSize?: "small" | "medium" | "large";
  className?: string;
  showPrice?: boolean;
  locale?: string;
  supplierRouteBase?: string;
}

function BannerCompanyStars({
  title = "Empresas Estrella",
  autoFetchSuppliers = true,
  suppliers,
  speed = 60,
  pauseOnHover = true,
  cardSize = "medium",
  className,
  showPrice = true,
  locale: localeProp,
  supplierRouteBase = 'SuplierInfo'
}: BannerCompanyStarsProps) {
  const [data, setData] = useState<SponsoredSupplier[]>(suppliers || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const offsetRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Fetch suppliers
  useEffect(() => {
    let active = true;
    async function load() {
      if (!autoFetchSuppliers || (suppliers && suppliers.length)) return;
      try {
        setLoading(true); setError(null);
        const resp = await SponsorshipService.getSponsoredSuppliers();
        if (active && Array.isArray(resp) && resp.length) {
          setData(resp);
        }
      } catch (e: any) {
        if (active) setError(e.message || 'Error cargando patrocinadores');
      } finally {
        if (active) setLoading(false);
      }
    }
    if (suppliers && suppliers.length) {
      setData(suppliers);
    } else {
      load();
    }
    return () => { active = false; };
  }, [suppliers, autoFetchSuppliers]);

  // Start marquee animation
  useEffect(() => {
    if (!trackRef.current || data.length === 0) return;
    const track = trackRef.current;
    let frame: number;

    const step = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const delta = ts - lastTsRef.current;
      lastTsRef.current = ts;
      const distance = (speed * delta) / 1000; // px to move this frame
      offsetRef.current += distance;

      const firstChild = track.firstElementChild as HTMLElement | null;
      if (firstChild) {
        const firstWidth = firstChild.offsetWidth;
        if (offsetRef.current >= firstWidth) {
          // Move first to end and adjust offset
            track.appendChild(firstChild);
            offsetRef.current -= firstWidth;
        }
      }
      track.style.transform = `translateX(-${offsetRef.current}px)`;
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    animRef.current = frame;
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      animRef.current = null;
      lastTsRef.current = null;
    };
  }, [data, speed]);

  // Pause on hover
  useEffect(() => {
    if (!pauseOnHover) return;
    const node = containerRef.current;
    if (!node) return;
    const handleEnter = () => { if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null; } };
    const handleLeave = () => { if (!animRef.current) { lastTsRef.current = null; animRef.current = requestAnimationFrame((ts)=>{ /* restart */ }); } };
    node.addEventListener('mouseenter', handleEnter);
    node.addEventListener('mouseleave', handleLeave);
    return () => { node.removeEventListener('mouseenter', handleEnter); node.removeEventListener('mouseleave', handleLeave); };
  }, [pauseOnHover]);

  const containerClasses = cntl`relative w-full bg-white py-6 overflow-hidden ${className}`;
  const titleClasses = cntl`px-4 mb-6`;
  const viewportClasses = cntl`w-full overflow-hidden`;
  const trackClasses = cntl`flex gap-4 items-stretch will-change-transform`;

  // Locale detection (client side) fallback
  const [locale, setLocale] = useState<string | undefined>(localeProp);
  useEffect(() => {
    if (!localeProp && typeof window !== 'undefined') {
      const seg = window.location.pathname.split('/').filter(Boolean)[0];
      if (seg && seg.length <= 5) setLocale(seg);
    }
  }, [localeProp]);

  if (loading) {
    return <div className={containerClasses}><div className={titleClasses}><Heading level={2}> {title} </Heading></div><div className="px-4 text-sm text-gray-500">Cargando empresas...</div></div>;
  }
  if (error) {
    return <div className={containerClasses}><div className={titleClasses}><Heading level={2}> {title} </Heading></div><div className="px-4 text-sm text-red-600">{error}</div></div>;
  }
  if (data.length === 0) return null;

  // Duplicate initial list to ensure continuous scroll visual fullness
  const renderList = [...data, ...data.slice(0, Math.min(data.length, 4))];

  // Helper para obtener siempre el supplierId real
  const getRealSupplierId = (sup: SponsoredSupplier): string | undefined => {
    // El modelo trae ambos: id (del sponsorship) y supplierId (del proveedor real)
    // Solo debemos usar supplierId en la URL
    if ((sup as any).supplierId) return (sup as any).supplierId as string;
    return undefined;
  };

  return (
    <div className={containerClasses} ref={containerRef}>
      <div className={viewportClasses}>
        <div ref={trackRef} className={trackClasses}>
          {renderList.map((sup, idx) => {
            const supplierId = getRealSupplierId(sup); // usar siempre supplierId real
            if (!supplierId) return null; // si no existe, omitimos (evita navegar con id interno de sponsorship)
            const loc = locale || 'es';
            const href = `/${encodeURIComponent(loc)}/${supplierRouteBase}/${encodeURIComponent(supplierId)}`;
            return (
              <div key={supplierId + '-' + idx} className="flex-shrink-0">
                <a
                  href={href}
                  aria-label={`Ver proveedor ${sup.supplierName}`}
                  data-supplier-id={supplierId}
                  className="block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md hover:shadow-md transition-shadow"
                >
                  <CartCompany supplier={sup} size={cardSize} showPrice={showPrice} />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { BannerCompanyStars };
export type { BannerCompanyStarsProps };