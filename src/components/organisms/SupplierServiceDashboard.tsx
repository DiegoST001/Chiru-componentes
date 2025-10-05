import React, { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import { CartOrderProductSupplier } from '@/components/molecules/CartOrderProductSupplier';
import { ServiceService } from '@/features/service/services/service.service';
import { Select } from '@/components/atoms/Select';
import { Input } from '@/components/atoms/Input';
import type { Service } from '@/features/service/model/service.model';

interface SupplierServiceDashboardProps {
  initialServices?: Service[];
}

export function SupplierServiceDashboard({ initialServices = [] }: SupplierServiceDashboardProps) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Cargar servicios automáticamente
  useEffect(() => {
    if (initialServices.length === 0) {
      loadServices();
    }
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      console.log('🔄 Iniciando carga de servicios...');
      console.log('🌐 URL base del API:', 'Llamando a /supplier-service');
      
      // Intentar múltiples endpoints
      let response = null;
      
      try {
        response = await ServiceService.findAll({ limit: 50 });
        console.log('📥 Respuesta de ServiceService.findAll:', response);
      } catch (findAllError) {
        console.log('❌ Error en findAll, probando otros métodos...');
        console.error('FindAll error:', findAllError);
        
        // Probar otros métodos si findAll falla
        try {
          response = await ServiceService.findAll({});
          console.log('📥 Respuesta sin parámetros:', response);
        } catch (noParamsError) {
          console.log('❌ Error sin parámetros también');
          throw noParamsError;
        }
      }
      
      console.log('📊 Estructura completa de respuesta:', JSON.stringify(response, null, 2));
      
      // Verificar diferentes estructuras de respuesta
      let servicesData = [];
      if (response?.data) {
        servicesData = response.data;
      } else if (Array.isArray(response)) {
        servicesData = response;
      } else if (response?.services) {
        servicesData = response.services;
      } else if (response?.items) {
        servicesData = response.items;
      }
      
      console.log('📈 Servicios extraídos:', servicesData);
      console.log('� Cantidad de servicios:', servicesData?.length || 0);
      
      if (servicesData && servicesData.length > 0) {
        setServices(servicesData);
        console.log('✅ Servicios cargados exitosamente:', servicesData.length);
      } else {
        console.log('⚠️ No se encontraron servicios en ninguna estructura');
        console.log('🔍 Disponible en response:', Object.keys(response || {}));
        setServices([]);
      }
    } catch (error) {
      console.error('❌ Error total cargando servicios:', error);
      console.error('Error stack:', (error as any)?.stack);
      console.error('Error details:', (error as any)?.message || error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar el estado de un servicio
  const updateServiceStatus = async (serviceId: string | number, newStatus: string) => {
    try {
      console.log(`Actualizando servicio ${serviceId} a estado: ${newStatus}`);
      // Aquí irían las llamadas al API para actualizar el estado
      // await ServiceService.updateStatus(serviceId, newStatus);
      
      // Por ahora solo actualizamos localmente
      setServices(prevServices => 
        prevServices.map(service => 
          service.id === serviceId 
            ? { ...service, status: newStatus }
            : service
        )
      );
    } catch (error) {
      console.error('Error actualizando estado del servicio:', error);
    }
  };

  const handleCreateService = () => {
    console.log('Crear nuevo servicio');
  };

  const handleDeleteServices = () => {
    console.log('Eliminar servicios seleccionados');
  };

  const filteredServices = services.filter(service => {
    if (selectedFilter === 'all') return true;
    return true; // Agregar más filtros según necesidad
  });

  return (
    <div className="flex-1 p-6">
      {/* Header del contenido */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-base">Lista de Servicios</span>
          <Select 
            options={[
              { value: 'all', label: 'Todos los servicios' },
              { value: 'active', label: 'Activos' },
              { value: 'inactive', label: 'Inactivos' }
            ]}
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            size="medium"
          />
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="secondary" 
            size="medium"
            text={loading ? "Cargando..." : "Actualizar"}
            onClick={loadServices}
            disabled={loading}
          />
          <Button 
            variant="primary" 
            size="medium"
            text="Nuevo Servicio"
            onClick={handleCreateService}
          />
          <Button 
            variant="secondary" 
            size="small"
            text="Debug API"
            onClick={() => {
              console.log('🔍 Debug - Estado actual:');
              console.log('Services:', services);
              console.log('Loading:', loading);
              console.log('Filtered:', filteredServices);
            }}
          />
        </div>
      </div>

      {/* Lista de servicios */}
      <div className="space-y-4">
        {loading && <div className="text-center">Cargando servicios...</div>}
        {!loading && filteredServices.length === 0 && (
          <div className="text-center text-gray-500">No hay servicios disponibles</div>
        )}
        
        {filteredServices.map((service, index) => {
          // Generar ID amigable
          const displayId = service.id && typeof service.id === 'number' 
            ? service.id 
            : index + 1;

          // Preparar datos para el componente
          const productInfo = {
            imageUrl: (() => {
              // Manejo robusto de imágenes reales del servicio
              if (service.images && service.images.length > 0) {
                const image = service.images[0];
                console.log(`🖼️ Imagen del servicio ${service.name}:`, image);
                
                if (typeof image === 'string' && (image as string).length > 0) {
                  return image;
                } else if (image && typeof image === 'object' && image.urlImage) {
                  return image.urlImage;
                }
              }
              
              // Imagen placeholder si no hay imagen real
              console.log(`⚠️ Sin imagen para servicio: ${service.name}`);
              return `https://dummyimage.com/64x64/f0f0f0/666666.png&text=${encodeURIComponent(service.name?.charAt(0) || 'S')}`;
            })(),
            title: service.name || "Servicio sin nombre",
            subtitle: service.description || "Descripción del servicio",
            price: service.price ? `S/. ${service.price.toFixed(2)}` : "S/. 0.00"
          };

          // Opciones de estado para el select
          const statusOptions = [
            { value: 'active', label: 'Activo' },
            { value: 'inactive', label: 'Inactivo' },
            { value: 'pending', label: 'Pendiente' },
            { value: 'suspended', label: 'Suspendido' }
          ];

          const currentStatus = (service as any).status || 'active';

          return (
            <div key={service.id || index} className="bg-white rounded-xl shadow p-6">
              {/* Header con ID y estado */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">#{displayId}</span>
                  <span className="text-sm text-gray-500">Servicio</span>
                </div>
                
                {/* Input para actualizar estado */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Estado:</span>
                  <Select
                    options={statusOptions}
                    value={currentStatus}
                    onChange={(e) => updateServiceStatus(service.id, e.target.value)}
                    size="small"
                  />
                </div>
              </div>

              {/* Información del servicio usando el componente existente */}
              <CartOrderProductSupplier
                id={displayId}
                selectLabel="Categoría:"
                selectOptions={[
                  { value: service.serviceCategory?.name || "general", label: service.serviceCategory?.name || "General" }
                ]}
                buttonText="Ver Detalles"
                productInfo={productInfo}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}