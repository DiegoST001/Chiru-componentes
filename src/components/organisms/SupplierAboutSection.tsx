import React, { useState, useRef, useEffect } from 'react';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Paragraph } from '@/components/atoms/Paragraph';
import { Icon } from '@/components/atoms/Icon';
import { Image } from '@/components/atoms/Image';
import { SupplierService } from '@/features/user/supplier/service/supplier.service';
import type { Supplier } from '@/features/user/supplier/model/supplier.model';
import { Buildings, MapPin, PaperPlaneTilt, CaretRight } from 'phosphor-react';

interface SupplierAboutSectionProps {
  supplierId: string;
  className?: string;
}

type TabId = 'info' | 'certs' | 'location';

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'info', label: 'Información', icon: <Buildings size={18} /> },
  { id: 'certs', label: 'Certificados', icon: <MapPin size={18} /> },
  { id: 'location', label: 'Ubicación', icon: <MapPin size={18} /> },
];

const demoImages = [
  'https://via.placeholder.com/600x360?text=Imagen+1',
  'https://via.placeholder.com/600x360?text=Imagen+2',
  'https://via.placeholder.com/600x360?text=Imagen+3'
];

export const SupplierAboutSection: React.FC<SupplierAboutSectionProps> = ({ supplierId, className }) => {
  const [active, setActive] = useState<TabId>('info');
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const infoRef = useRef<HTMLDivElement | null>(null);
  const certRef = useRef<HTMLDivElement | null>(null);
  const locRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let activeFlag = true;
    setLoading(true); setError(null);
    SupplierService.findOne(supplierId)
      .then(res => { if (activeFlag) setSupplier(res); })
      .catch(e => { if (activeFlag) setError(e.message || 'Error cargando proveedor'); })
      .finally(()=> { if (activeFlag) setLoading(false); });
    return () => { activeFlag = false; };
  }, [supplierId]);

  const headerOffset = 100; // approximate fixed header height for offset scrolling

  const scrollTo = (tab: TabId) => {
    setActive(tab);
    const map: Record<TabId, HTMLDivElement | null> = { info: infoRef.current, certs: certRef.current, location: locRef.current };
    const node = map[tab];
    if (node) {
      const rect = node.getBoundingClientRect();
      const absoluteTop = window.pageYOffset + rect.top - headerOffset;
      window.scrollTo({ top: absoluteTop, behavior: 'smooth' });
    }
  };

  // Update active tab while scrolling so user always sees where they are.
  useEffect(() => {
    const sections: { id: TabId; el: HTMLDivElement | null }[] = [
      { id: 'info', el: infoRef.current },
      { id: 'certs', el: certRef.current },
      { id: 'location', el: locRef.current }
    ];
    const handler = () => {
      const scrollPos = window.scrollY + headerOffset + 20; // margin for activation
      for (let i = sections.length - 1; i >= 0; i--) {
        const s = sections[i];
        if (s.el) {
          const top = s.el.offsetTop;
            if (scrollPos >= top) { setActive(s.id); break; }
        }
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <section className={`w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 ${className || ''}`}>      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Lateral Izquierdo */}
  <aside className="w-full md:w-72 flex-shrink-0 flex flex-col gap-8 md:sticky md:top-24 self-start">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col gap-2">
            <Heading level={5} className="text-sm font-semibold tracking-wide uppercase text-gray-900">Secciones</Heading>
            <div className="flex flex-col gap-2 mt-1">
              {tabs.map(t => {
                const isActive = t.id === active;
                return (
                  <button
                    key={t.id}
                    onClick={() => scrollTo(t.id)}
                    className={`flex items-center justify-between w-full gap-3 px-3 py-2 rounded-md border text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${isActive ? 'bg-[#7d0e0e] text-white border-[#7d0e0e]' : 'bg-white text-gray-700 border-gray-200 hover:border-[#7d0e0e] hover:text-[#7d0e0e]'}`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Icon tamano="small" variant={isActive ? 'danger' : 'default'}>{t.icon}</Icon>
                      {t.label}
                    </span>
                    <CaretRight size={14} className="opacity-70" />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col gap-4">
            <Heading level={5} className="text-sm font-semibold tracking-wide uppercase text-gray-900">Contacto</Heading>
            <Paragraph size="small" variant="muted" leading="relaxed" text="Envía un mensaje directo al proveedor" />
            <input
              type="text"
              placeholder="Escribe tu mensaje..."
              className="w-full rounded-md border border-gray-300 focus:border-[#7d0e0e] focus:ring-2 focus:ring-[#7d0e0e]/40 px-3 py-2 text-sm outline-none"
            />
            <button type="button" className="inline-flex items-center justify-center gap-2 bg-[#7d0e0e] text-white text-sm font-medium rounded-md px-4 py-2 hover:bg-red-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7d0e0e]">
              <PaperPlaneTilt size={16} /> Enviar
            </button>
          </div>
        </aside>

        {/* Contenido Derecho */}
        <div className="flex-1 flex flex-col gap-16">
          {/* Info */}
          <div ref={infoRef} id="about-info" className="scroll-mt-28">
            <Heading level={3} className="text-xl font-bold text-[#7d0e0e] mb-4">Información de la Empresa</Heading>
            {loading && <Text size="sm" className="text-gray-500">Cargando proveedor...</Text>}
            {error && (
              <Text size="sm" color="danger" className="mb-4">
                {error}
              </Text>
            )}
            {!loading && !error && supplier && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div className="space-y-4">
                  <Paragraph size="medium" leading="relaxed" text={(supplier?.supplierPerfil || supplier?.commercialCapacity || 'Descripción de ejemplo de la empresa.')} />
                  <Paragraph size="small" variant="muted" leading="relaxed" text="Texto adicional de ejemplo para completar el área descriptiva y mostrar el estilo tipográfico." />
                  <ul className="text-sm text-gray-700 space-y-1">
                    {supplier?.country && <li><strong>País:</strong> {supplier.country}</li>}
                    {supplier?.city && <li><strong>Ciudad:</strong> {supplier.city}</li>}
                    {supplier?.yearsOfExperience && <li><strong>Experiencia:</strong> {supplier.yearsOfExperience} años</li>}
                  </ul>
                </div>
                <div className="relative w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <CarouselDemo images={demoImages} />
                </div>
              </div>
            )}
            {!loading && !error && !supplier && (
              <div className="text-sm text-gray-500">Sin datos del proveedor para mostrar.</div>
            )}
          </div>

          {/* Certificados */}
          <div ref={certRef} id="about-certs" className="scroll-mt-28">
            <Heading level={3} className="text-xl font-bold text-[#7d0e0e] mb-4">Certificados</Heading>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {['ISO 9001','ISO 14001','BPM','HACCP'].map((cert,i)=>(
                <div key={i} className="group bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-[#7d0e0e]" />
                    <Text weight="medium" className="truncate">{cert}</Text>
                  </div>
                  <Paragraph size="small" variant="muted" leading="relaxed" text="Descripción breve del certificado." />
                  <span className="text-[10px] uppercase tracking-wide text-gray-400 mt-auto">Código #{1000+i}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ubicación */}
          <div ref={locRef} id="about-location" className="scroll-mt-28">
            <Heading level={3} className="text-xl font-bold text-[#7d0e0e] mb-4">Ubicación</Heading>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
              <div className="space-y-4">
                <Paragraph size="medium" leading="relaxed" text="Nuestra sede principal se encuentra estratégicamente ubicada para facilitar la logística y la atención." />
                <ul className="space-y-2 text-sm text-gray-700">
                  <li><strong>Dirección:</strong> {supplier?.address || 'Calle Ejemplo 123, Ciudad'}</li>
                  <li><strong>Horario:</strong> L-V 9:00 - 18:00</li>
                  <li><strong>Contacto:</strong> {supplier?.suppliernumber || '000-000-000'}</li>
                </ul>
              </div>
              <div className="relative w-full h-64 md:h-72 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <img src="https://via.placeholder.com/800x500?text=Mapa" alt="Mapa" className="absolute inset-0 w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CarouselDemo: React.FC<{ images: string[] }> = ({ images }) => {
  const [index, setIndex] = useState(0);
  useEffect(()=>{
    const id = setInterval(()=> setIndex(i => (i+1)%images.length), 3000);
    return ()=> clearInterval(id);
  },[images.length]);
  return (
    <div className="relative w-full h-60 md:h-72">
      {images.map((img,i)=>(
        <div key={img} className={`absolute inset-0 transition-opacity duration-700 ${i===index?'opacity-100':'opacity-0'}`}>
          <Image src={img} alt={`Imagen ${i+1}`} fit="cover" radius="none" className="w-full h-full" />
        </div>
      ))}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
        {images.map((_,i)=>(
          <button key={i} onClick={()=>setIndex(i)} className={`h-2.5 w-2.5 rounded-full transition-colors ${i===index?'bg-[#7d0e0e]':'bg-gray-300 hover:bg-gray-400'}`} aria-label={`Ir a imagen ${i+1}`} />
        ))}
      </div>
    </div>
  );
};

export default SupplierAboutSection;