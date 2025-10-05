import React, { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import { CartOrderProductSupplier } from '@/components/molecules/CartOrderProductSupplier';
import { ServiceService } from '@/features/service/services/service.service';
import { ProductService } from '@/features/product/services/product.service';
import type { Service } from '@/features/service/model/service.model';
import type { Product } from '@/features/product/models/product.model';

interface SupplierDashboardContentProps {
  initialServices: any[]; // Puede ser Service[] o Product[] convertidos
}

export function SupplierDashboardContent({ initialServices }: SupplierDashboardContentProps) {
  const [services, setServices] = useState<any[]>(initialServices);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Cargar datos automáticamente al montar el componente
  useEffect(() => {
    if (initialServices.length === 0) {
      handleRefreshServices();
    }
  }, []);

  const handleRefreshServices = async () => {
    setLoading(true);
    try {
      // Primero intentar productos (como tu compañero)
      const products = await ProductService.getFeaturedProducts();
      const convertedServices = products.map((product: any, index: number) => {
        // Función para extraer precio de manera segura
        const extractPrice = (price: any): number => {
          if (typeof price === 'number') return price;
          if (typeof price === 'string') {
            const parsed = parseFloat(price);
            return isNaN(parsed) ? 0 : parsed;
          }
          if (typeof price === 'object' && price !== null) {
            const first = Object.values(price)[0];
            if (typeof first === 'number') return first;
            if (typeof first === 'string') {
              const parsed = parseFloat(first);
              return isNaN(parsed) ? 0 : parsed;
            }
          }
          return 0;
        };
        
        return {
          id: product.id,
          name: product.name,
          description: product.description || "Producto disponible",
          price: extractPrice(product.price),
          serviceCategory: { 
            id: product.category?.id || `cat-${index}`, 
            name: product.category?.name || "Productos" 
          },
          supplier: { 
            id: product.supplier?.id || `sup-${index}`, 
            name: product.supplier?.name || "Proveedor",
          },
          images: product.images || [],
        };
      });
      setServices(convertedServices);
    } catch (error) {
      console.error('Error refreshing products, trying services:', error);
      try {
        const response = await ServiceService.findAll({ limit: 10 });
        
        // Convertir servicios con ID basado en fecha y precio extraído
        const convertedServiceData = (response.data || []).map((service: any, index: number) => {
          // Generar ID más amigable
          let serviceId: string | number = index + 1; // Fallback por defecto
          
          console.log('Service original ID:', service.id, typeof service.id);
          console.log('Service createdAt:', service.createdAt);
          
          // Prioridad 1: Si tiene fecha, usar fecha como ID
          if (service.createdAt) {
            try {
              const date = new Date(service.createdAt);
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              serviceId = `${month}${day}`;
              console.log('Using date-based ID:', serviceId);
            } catch {
              serviceId = index + 1;
              console.log('Date failed, using index:', serviceId);
            }
          }
          // Prioridad 2: Si tiene ID numérico, usarlo
          else if (service.id && typeof service.id === 'number') {
            serviceId = service.id;
            console.log('Using numeric ID:', serviceId);
          } 
          // Prioridad 3: Si tiene ID string largo (UUID), usar los primeros 4 caracteres
          else if (service.id && typeof service.id === 'string') {
            serviceId = `#${service.id.substring(0, 4)}`;
            console.log('Using short UUID:', serviceId);
          }
          
          console.log('Final serviceId:', serviceId);

          // Función para extraer precio del servicio
          const extractPrice = (service: any): number => {
            // Intentar extraer precio de diferentes campos posibles
            let priceValue = service.price || service.cost || service.amount;
            
            console.log(`Service ${service.name}: price=${service.price}, cost=${service.cost}, amount=${service.amount}`);
            
            if (typeof priceValue === 'number' && priceValue > 0) return priceValue;
            if (typeof priceValue === 'string') {
              const parsed = parseFloat(priceValue);
              return isNaN(parsed) ? 0 : parsed;
            }
            if (typeof priceValue === 'object' && priceValue !== null) {
              const first = Object.values(priceValue)[0];
              if (typeof first === 'number') return first;
              if (typeof first === 'string') {
                const parsed = parseFloat(first);
                return isNaN(parsed) ? 0 : parsed;
              }
            }
            
            // Si no hay precio, usar un precio de ejemplo para que se vea algo
            return Math.floor(Math.random() * 100) + 10; // Precio aleatorio entre 10-110 para demo
          };

          return {
            ...service,
            id: serviceId,
            name: service.name || 'Servicio sin nombre',
            description: service.description || "Servicio disponible",
            price: extractPrice(service), // Extraer precio del servicio
            serviceCategory: service.serviceCategory || { 
              id: `cat-${index}`, 
              name: "Servicios" 
            },
            supplier: service.supplier || { 
              id: `sup-${index}`, 
              name: "Proveedor" 
            },
            images: service.images || []
          };
        });
        
        setServices(convertedServiceData);
        console.log('Services loaded successfully:', convertedServiceData);
        console.log('Raw service data from API:', response.data);
      } catch (serviceError) {
        console.error('Error refreshing services:', serviceError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = () => {
    // Navegación a página de creación de servicio
    console.log('Crear nuevo servicio');
  };

  const handleDeleteServices = () => {
    // Lógica para eliminar servicios seleccionados
    console.log('Eliminar servicios seleccionados');
  };

  const filteredServices = services.filter(service => {
    if (selectedFilter === 'all') return true;
    // Agregar más filtros según necesidad
    return true;
  });

  console.log('Current services state:', services);
  console.log('Filtered services to display:', filteredServices);

  return (
    <div className="flex-1 p-6">
      {/* Header del contenido */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-base">Text-Title</span>
          <select 
            className="border border-gray-300 rounded-md px-3 py-2 bg-white"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="all">Text-Title</option>
          </select>
          <span className="text-base">Text-Title</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">text</span>
          <Button 
            variant="primary" 
            size="small"
            onClick={handleRefreshServices}
            disabled={loading}
          >
            text
          </Button>
        </div>
      </div>
      
      {/* Grid de servicios/productos usando CartOrderProductSupplier */}
      <div className="space-y-4">
        {loading && <div className="text-center">Cargando servicios...</div>}
        {!loading && filteredServices.length === 0 && <div className="text-center text-gray-500">No hay servicios disponibles</div>}
        {filteredServices.map((service, index) => {
          // Preparar datos para CartOrderProductSupplier
          const productInfo = {
            imageUrl: (() => {
              // Manejo de imágenes para productos y servicios
              if (service.images && service.images.length > 0) {
                const image = service.images[0];
                return image.urlImage || image || "https://dummyimage.com/100x100/eee/aaa.png&text=ProductImage+100x100";
              }
              return "https://dummyimage.com/100x100/eee/aaa.png&text=ProductImage+100x100";
            })(),
            title: service.name || "Text-Title",
            subtitle: service.description || "text",
            price: (() => {
              // Función para extraer precio de manera segura
              const extractPrice = (price: any): string => {
                if (typeof price === 'number') return `S/. ${price.toFixed(2)}`;
                if (typeof price === 'string') {
                  const parsed = parseFloat(price);
                  return isNaN(parsed) ? "S/. 0.00" : `S/. ${parsed.toFixed(2)}`;
                }
                if (typeof price === 'object' && price !== null) {
                  const first = Object.values(price)[0];
                  if (typeof first === 'number') return `S/. ${first.toFixed(2)}`;
                  if (typeof first === 'string') {
                    const parsed = parseFloat(first);
                    return isNaN(parsed) ? "S/. 0.00" : `S/. ${parsed.toFixed(2)}`;
                  }
                }
                return "S/. 0.00";
              };
              return extractPrice(service.price);
            })(),
          };

          return (
            <CartOrderProductSupplier
              key={service.id}
              id={service.id} // Usar el ID que ya calculamos (con fecha)
              selectLabel="text:"
              selectOptions={[{ value: "texto", label: "texto" }]}
              buttonText="text"
              productInfo={productInfo}
            />
          );
        })}
        
        {filteredServices.length === 0 && (
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center">
            <span className="text-gray-500">No hay servicios disponibles</span>
          </div>
        )}
      </div>
      
      {/* Botones inferiores */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <Button 
          variant="outline" 
          size="medium"
          onClick={handleCreateService}
        >
          text
        </Button>
        
        <Button 
          variant="danger" 
          size="medium"
          onClick={handleDeleteServices}
        >
          text
        </Button>
      </div>
    </div>
  );
}