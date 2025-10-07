import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import { Input } from "@/components/atoms/Input";
import { Select } from "@/components/atoms/Select";
import { Spinner } from "@/components/atoms/Spinner";
import { Heading } from "@/components/atoms/Heading";
import { Image } from "@/components/atoms/Image";
import { PaginationItem } from "@/components/atoms/PaginationItem";
import { Badge } from "@/components/atoms/Badge";
import {
  CalendarBlank,
  CaretLeft,
  CaretRight,
} from "phosphor-react";

const API_BASE_URL = "https://eyes-lodging-vegas-contracts.trycloudflare.com";
const SUPPLIER_ID = "1ec2538d-29b0-4470-b05e-d5956b1c0cb1";
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJtZ29tZXpAZW1wcmVzYS5jb20iLCJpc1Zpc2libGUiOjEsImlzQWN0aXZlIjoxLCJ0b2tlblJlZnJlc2hQYXNzd29yZCI6bnVsbCwidG9rZW5FeHBpcnlEYXRlIjpudWxsLCJjcmVhdGVkQXQiOiIyMDI1LTA5LTIzVDIyOjU1OjI1LjI0M1oiLCJyb2xlIjp7ImlkIjoyLCJuYW1lIjoiU3VwcGxpZXIifSwidXNlckluZm9ybWF0aW9uIjp7ImlkIjoyLCJ1c2VyTmFtZSI6Ik1hcsOtYSBHw7NtZXoiLCJ1c2VyQWJicmV2aWF0aW9uIjoiTUciLCJtYWluQWRkcmVzcyI6MSwiY29udGFjdE5hbWUiOiJNYXLDrWEgR8OzbWV6IiwiY29udGFjdEVtYWlsIjoibWdvbWV6QGVtcHJlc2EuY29tIiwiY29udGFjdFBob25lIjoiKzUxOTg3NjU0MzIxIiwiZ2VuZGVyIjpudWxsLCJjcmVhdGVkQXQiOiIyMDI1LTA5LTIzVDIyOjU1OjI1LjI0M1oifSwidXNlckFkZHJlc3MiOlt7ImlkIjoxLCJ1c2VyIjp7ImlkIjoyLCJlbWFpbCI6Im1nb21lekBlbXByZXNhLmNvbSIsInBhc3N3b3JkIjoiJDJhJDA4JEtGTmpFVWdKL0FoYWFvbkxtUDIxWXUuaHdUQ25yMS8zQzVBTFRRdTY4MXVKZDZGZVVONEQyIiwibGFzdExvZ2luRGF0ZSI6IjIwMjUtMDktMjNUMjI6NTU6MjUuMjQzWiIsImlzVmlzaWJsZSI6MSwiaXNBY3RpdmUiOjEsInRva2VuUmVmcmVzaFBhc3N3b3JkIjpudWxsLCJ0b2tlbkV4cGlyeURhdGUiOm51bGwsImNyZWF0ZWRBdCI6IjIwMjUtMDktMjNUMjI6NTU6MjUuMjQzWiIsInRlbXBQYXNzd29yZCI6IiQyYSQwOCRLRk5qRVVnSi9BaGFhb25MbVAyMVl1Lmh3VENucjEvM0M1QUxUUXU2ODF1SmQ2RmVVTjREMiJ9LCJsYWJlbCI6Ik9maWNpbmEgUHJpbmNpcGFsIiwiY29udGFjdE5hbWUiOiJNYXLDrWEgR8OzbWV6IiwiY29udGFjdEVtYWlsIjoibWdvbWV6QGVtcHJlc2EuY29tIiwiY29udGFjdFBob25lIjoiKzUxOTg3NjU0MzIxIiwiYWRkcmVzcyI6IkF2LiBMb3MgT2xpdm9zIDEyMyIsImNpdHkiOiJMaW1hIiwic3RhdGUiOiJMaW1hIiwiemlwQ29kZSI6IjE1MDQ4IiwiY291bnRyeSI6IlBlcsO6IiwiY3JlYXRlQXQiOiIyMDI1LTA5LTIzVDIyOjU1OjI1LjI0M1oiLCJ1cGRhdGVBdCI6IjIwMjUtMDktMjNUMjI6NTU6MjUuMjQzWiJ9XSwic3VwcGxpZXIiOlt7ImlkIjoiMWVjMjUzOGQtMjliMC00NDcwLWIwNWUtZDU5NTZiMWMwY2IxIiwibmFtZSI6IlRlY2hQZXLDuiBTQUMiLCJhZGRyZXNzIjoiQXYuIFRlY25vbMOzZ2ljYSA3ODkiLCJidXNzaW5lc3NDYXRlZ29yeSI6IlRlY25vbG9nw61hIiwiY2l0eSI6IkxpbWEiLCJzdGF0ZSI6IkxpbWEiLCJjb3VudHJ5IjoiUGVyw7oiLCJwb3N0YWxDb2RlIjoiMTUwNDgiLCJ3ZWJzaXRlIjoiaHR0cHM6Ly90ZWNocGVydS5jb20iLCJ5ZWFyc09mRXhwZXJpZW5jZSI6IjEwIiwidmVyaWZpY2F0aW9uU3RhdHVzIjoiVmVyaWZpZWQiLCJsb2dvIjoiaHR0cHM6Ly9jZG4taWNvbnMtcG5nLmZsYXRpY29uLmNvbS81MTIvODc0My84NzQzOTk2LnBuZyIsImNvbW1lcmNpYWxDYXBhY2l0eSI6IkhpZ2gtdm9sdW1lIEIyQiBzYWxlcyIsInByb2R1Y3Rpb25DYXBhY2l0eSI6IjIwMDAwIHRvbnMvbW9udGgiLCJtYXJjYSI6ZmFsc2UsInN1cHBsaWVyUGVyZmlsIjpudWxsLCJzdXBwbGllcm51bWJlciI6Ijk5MjgwMDEyNCIsInNvY2lhbG1lZGlhIjp7InR3aXR0ZXIiOiJodHRwczovL3R3aXR0ZXIuY29tL3RlY2hwZXJ1IiwiZmFjZWJvb2siOiJodHRwczovL2ZhY2Vib29rLmNvbS90ZWNocGVydSIsImxpbmtlZGluIjoiaHR0cHM6Ly9saW5rZWRpbi5jb20vaW4vdGVjaHBlcnUifX1dLCJ0ZW1wUGFzc3dvcmQiOiIkMmEkMDgkS0ZOakVVZ0ovQWhhYW9uTG1QMjFZdS5od1RDbnIxLzNDNUFMVFF1NjgxdUpkNkZlVU40RDIiLCJpYXQiOjE3NTk2NTY0NjUsImV4cCI6MTc2MjI0ODQ2NSwianRpIjoiMjAyYjMzNzktZmRmYS00Njg3LWExZjQtYzZiYmJkMTdjNzIwIn0.iuS5xrIUJYJWnZGgJgBBFAFd9MBrhpOT2rSfH85rnus";

type BadgeVariant = "default" | "success" | "danger" | "warning" | "info" | "successInvert" | "dangerInvert" | "black";
type KnownDeliveryStatus = "pending" | "shipping" | "en_ruta" | "entregado" | "received" | "cancelado";
type DeliveryStatus = KnownDeliveryStatus | string;
type FilterStatus = "all" | KnownDeliveryStatus;

const STATUS_OPTIONS: Array<{ value: KnownDeliveryStatus; label: string }> = [
  { value: "pending", label: "Pendiente" },
  { value: "shipping", label: "En envío" },
  { value: "en_ruta", label: "En ruta" },
  { value: "entregado", label: "Entregado" },
  { value: "received", label: "Recibido" },
  { value: "cancelado", label: "Cancelado" },
];

const STATUS_LABELS: Record<KnownDeliveryStatus, string> = STATUS_OPTIONS.reduce(
  (labels, option) => ({ ...labels, [option.value]: option.label }),
  {} as Record<KnownDeliveryStatus, string>
);

const STATUS_BADGE_VARIANT: Record<KnownDeliveryStatus, BadgeVariant> = {
  entregado: "success",
  received: "success",
  shipping: "info",
  en_ruta: "info",
  pending: "warning",
  cancelado: "danger",
};

const DEFAULT_BADGE_VARIANT: BadgeVariant = "default";

const FILTER_STATUS_OPTIONS: Array<{ value: FilterStatus; label: string }> = [
  { value: "all", label: "Todos los estados" },
  ...STATUS_OPTIONS,
];

const ROWS_PER_PAGE_OPTIONS = [10, 15, 20] as const;



// update
async function updateOrderStatus(billId: number, newStatus: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/update-status?billId=${billId}&newStatus=${newStatus}`, {
      method: 'PATCH',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

type SupplierOrder = {
  billId: number;
  deliveryDate: string;
  buyerName: string;
  productCards: Array<{
    productName: string;
    productImage: string;
  }>;
  deliveryStatus: DeliveryStatus;
};

type SupplierOrdersResponse = {
  cards: SupplierOrder[];
};

async function fetchSupplierOrders(): Promise<SupplierOrder[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/supplier-paid/${SUPPLIER_ID}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SupplierOrdersResponse = await response.json();
    return data.cards || [];
  } catch (error) {
    console.error('Error fetching supplier orders:', error);
    return [];
  }
}

type CalendarProps = {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
};

function CustomCalendar({ value, onChange, placeholder = "Seleccionar fecha" }: CalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day); 
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDay = new Date(year, month, -i);
      days.push({ 
        date: prevDay.getDate(), 
        isCurrentMonth: false, 
        fullDate: prevDay 
      });
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      days.push({ 
        date: day, 
        isCurrentMonth: true, 
        fullDate: currentDate 
      });
    }
    
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDay = new Date(year, month + 1, day);
      days.push({ 
        date: day, 
        isCurrentMonth: false, 
        fullDate: nextDay 
      });
    }
    
    return days;
  };

  const handleDateSelect = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const localDateString = `${year}-${month}-${day}`;
    onChange(localDateString);
    setIsOpen(false);
  };

  const goToPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const monthNames = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  const dayNames = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  const days = getDaysInMonth(currentMonth);
  
  let selectedDate = null;
  if (value) {
    const [year, month, day] = value.split('-').map(Number);
    selectedDate = new Date(year, month - 1, day);
  }
  
  const today = new Date();

  return (
    <div className="relative w-full" ref={calendarRef}>
      <div 
        className="flex items-center border border-gray-300 rounded-md bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <input
          type="text"
          value={formatDisplayDate(value)}
          placeholder={placeholder}
          readOnly
          className="border-0 shadow-none focus:ring-0 min-w-[140px] w-full px-3 py-2 cursor-pointer bg-transparent"
        />
        <div className="px-2 border-l border-gray-300">
          <CalendarBlank size={20} className="text-gray-600" weight="regular" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 min-w-[280px]">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goToPrevMonth}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <CaretLeft size={16} className="text-gray-600" />
            </button>
            
            <div className="text-center">
              <Text weight="medium" className="text-gray-900">
                {monthNames[currentMonth.getMonth()]}
              </Text>
              <Text size="sm" color="muted">
                {currentMonth.getFullYear()}
              </Text>
            </div>
            
            <button
              onClick={goToNextMonth}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <CaretRight size={16} className="text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center p-2">
                <Text size="sm" color="muted" weight="medium">{day}</Text>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const isToday = day.isCurrentMonth && 
                day.date === today.getDate() &&
                currentMonth.getMonth() === today.getMonth() &&
                currentMonth.getFullYear() === today.getFullYear();
              
              const isSelected = selectedDate &&
                day.fullDate.getDate() === selectedDate.getDate() &&
                day.fullDate.getMonth() === selectedDate.getMonth() &&
                day.fullDate.getFullYear() === selectedDate.getFullYear();

              return (
                <button
                  key={index}
                  onClick={() => handleDateSelect(day.fullDate)}
                  className={`
                    p-2 text-center rounded text-sm hover:bg-gray-100 transition-colors
                    ${!day.isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}
                    ${isToday ? 'bg-blue-100 text-blue-600 font-medium' : ''}
                    ${isSelected ? 'bg-blue-500 text-white font-medium' : ''}
                  `}
                >
                  {day.date}
                </button>
              );
            })}
          </div>

          {value && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <Button
                variant="secondary"
                size="small"
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
                className="w-full"
              >
                Limpiar fecha
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

type TileCardProps = { 
  product: any; 
  onStatusUpdate?: (id: number, status: string) => void;
};

const normalizeStatus = (status: DeliveryStatus): KnownDeliveryStatus | null => {
  const normalized = String(status || "").toLowerCase() as KnownDeliveryStatus;
  return normalized in STATUS_LABELS ? normalized : null;
};

const getStatusLabel = (status: DeliveryStatus) => {
  const normalized = normalizeStatus(status);
  return normalized ? STATUS_LABELS[normalized] : status;
};

const getStatusBadgeVariant = (status: DeliveryStatus): BadgeVariant => {
  const normalized = normalizeStatus(status);
  return normalized ? STATUS_BADGE_VARIANT[normalized] : DEFAULT_BADGE_VARIANT;
};

function TileCard({ product, onStatusUpdate }: TileCardProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<DeliveryStatus>(product?.deliveryStatus || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const img = product?.images?.[0]?.urlImage || "https://placehold.co/100x100/E5E7EB/9CA3AF?text=Order";
  const title = product?.name || "Orden sin título";
  
  const billId = product?.billId || 0;
  const buyerName = product?.buyerName || "Cliente desconocido";
  const deliveryDate = product?.deliveryDate || "Fecha no disponible";
  const deliveryStatus: DeliveryStatus = product?.deliveryStatus || "unknown";
  const productCards = product?.productCards || [];

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf" && file.name.toLowerCase().endsWith('.pdf')) {
        setUploadedFile(file);
        console.log("Factura PDF seleccionada:", file.name);
      } else {
        alert("Error: Solo se permiten archivos PDF para las facturas");
        event.target.value = "";
      }
    }
  };

  const handleStatusChange = (newStatus: string) => {
    const nextStatus = newStatus as DeliveryStatus;
    setSelectedStatus(nextStatus);
    if (onStatusUpdate) {
      onStatusUpdate(billId, nextStatus);
    }
  };

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Vista móvil: Layout vertical compacto */}
      <div className="block sm:hidden">
        {/* Header con #ID y ícono text */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900">#{billId}</h3>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
              <span className="text-xs text-white">👁</span>
            </div>
            <Text size="sm" color="muted">{buyerName}</Text>
          </div>
        </div>

        {/* Ícono calendario con fecha real */}
        <div className="flex items-center gap-2 mb-4">
          <CalendarBlank size={16} className="text-indigo-600" />
          <Text size="sm" color="muted">{deliveryDate}</Text>
        </div>

        {/* Dropdown con estado real y botón funcional */}
        <div className="flex items-center gap-2 mb-4">
          <Text size="sm" color="default">Estado:</Text>
          <Select 
            options={STATUS_OPTIONS}
            size="small"
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="flex-1"
          />
          <Button 
            variant={!uploadedFile ? "danger" : "primary"}
            size="small" 
            className="px-3 py-1"
            onClick={handleFileUpload}
          >
            {uploadedFile ? '✓ Factura subida' : 'Subir factura'}
          </Button>
        </div>

        {/* Información de productos */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-4 rounded-full border border-indigo-600 flex items-center justify-center">
            <span className="text-xs text-indigo-600">👁</span>
          </div>
          <Text size="sm" color="muted">
            {productCards.length > 0 ? `${productCards.length} productos` : 'Sin productos'}
          </Text>
        </div>

        {/* Tarjeta de producto principal */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
            {productCards[0]?.productImage ? (
              <Image
                src={productCards[0].productImage}
                alt={productCards[0].productName || 'Producto'}
                className="w-full h-full object-cover rounded"
                width={64}
                height={64}
              />
            ) : (
              <div className="text-center">
                <div className="text-xs text-gray-500 leading-tight">
                  Product image
                  <br />
                  100x100
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 mb-1">
              {productCards[0]?.productName || 'Producto sin nombre'}
            </h4>
            <p className="text-gray-500 text-sm mb-2">
              Cliente: {buyerName}
            </p>
            <p className="font-bold text-lg text-gray-900">S/. 0.00</p>
          </div>
        </div>

        {/* Mostrar archivo subido si existe */}
        {uploadedFile && (
          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <Text size="sm" color="default" className="truncate">📄 {uploadedFile.name}</Text>
                <Text size="xs" color="muted">({(uploadedFile.size / 1024).toFixed(1)} KB)</Text>
              </div>
              <Button 
                variant="dangerInverse" 
                size="small"
                onClick={() => setUploadedFile(null)}
                className="px-2 py-1 flex-shrink-0"
              >
                ✕
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Vista desktop: Layout original */}
      <div className="hidden sm:block">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
              <div className="flex items-center gap-3">
                <Heading level={3} color="default">#{billId}</Heading>
                <Badge variant={getStatusBadgeVariant(deliveryStatus)} size="small">
                  {getStatusLabel(deliveryStatus)}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-400"></div>
                <Text size="sm" color="muted">{buyerName}</Text>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <CalendarBlank size={16} className="text-indigo-600" />
              <Text size="sm" color="muted">{deliveryDate}</Text>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              {productCards.slice(0, 3).map((productCard: any, index: number) => (
                <div key={index} className="flex items-center gap-2 min-w-0">
                  <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    <Image
                      src={productCard.productImage || img}
                      alt={productCard.productName || title}
                      className="w-full h-full object-cover rounded"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="min-w-0">
                    <Text size="sm" weight="medium" color="default" className="truncate">
                      {productCard.productName}
                    </Text>
                  </div>
                </div>
              ))}
              {productCards.length > 3 && (
                <Text size="sm" color="muted">+{productCards.length - 3} más</Text>
              )}
            </div>
          </div>

          <div className="flex-shrink-0 w-full sm:w-80">
            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
              <Text size="sm" color="default" className="sm:whitespace-nowrap">Factura:</Text>
              <Button 
                variant={!uploadedFile ? "danger" : "primary"}
                size="small" 
                className="w-full sm:w-auto"
                onClick={handleFileUpload}
              >
                {uploadedFile ? '✓ Factura subida' : 'Subir factura'}
              </Button>
            </div>

            {uploadedFile && (
              <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <Text size="sm" color="default" className="truncate">📄 {uploadedFile.name}</Text>
                    <Text size="xs" color="muted">({(uploadedFile.size / 1024).toFixed(1)} KB)</Text>
                  </div>
                  <Button 
                    variant="dangerInverse" 
                    size="small"
                    onClick={() => setUploadedFile(null)}
                    className="px-2 py-1 flex-shrink-0"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
              <Text size="sm" color="default" className="sm:whitespace-nowrap">Estado:</Text>
              <Select 
                options={STATUS_OPTIONS}
                size="small"
                value={selectedStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full sm:w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

interface SupplierOrdersProductInventoryProps {
  className?: string;
}

export default function SupplierOrdersProductInventory({
  className = "",
}: SupplierOrdersProductInventoryProps) {
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterDate, setFilterDate] = useState("");
  const [pagination, setPagination] = useState({ currentPage: 1, limit: 10, totalItems: 0 });
  const [isMobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const ordersData = await fetchSupplierOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleStatusUpdate = useCallback(
    async (orderId: number, newStatus: string) => {
      try {
        await updateOrderStatus(orderId, newStatus);
        console.log('Estado actualizado:', orderId, newStatus);
        await loadOrders();
        alert(`¡Estado actualizado a ${newStatus}!`);
      } catch (error) {
        console.error('Error updating status:', error);
        alert('Error al actualizar el estado');
      }
    },
    [loadOrders]
  );

  const applyFilters = useCallback(() => {
    loadOrders();
    setMobileFiltersOpen(false);
  }, [loadOrders, setMobileFiltersOpen]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productCards.some(product => 
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const normalizedStatus = normalizeStatus(order.deliveryStatus);
    const matchesStatus =
      filterStatus === "all" || (normalizedStatus !== null && normalizedStatus === filterStatus);
    
    let matchesDate = true;
    if (filterDate) {
      try {
        
        const orderDate = new Date(order.deliveryDate);
        const selectedDate = new Date(filterDate + 'T00:00:00'); // Agregar hora local para evitar UTC
        
        matchesDate = 
          orderDate.getFullYear() === selectedDate.getFullYear() &&
          orderDate.getMonth() === selectedDate.getMonth() &&
          orderDate.getDate() === selectedDate.getDate();
      } catch (error) {
        console.log('Error parsing dates:', error);
        matchesDate = true;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const orderToProduct = (order: SupplierOrder) => {
    const mainProduct = order.productCards[0];
    return {
      id: order.billId.toString(),
      name: mainProduct?.productName || 'Producto sin nombre',
      description: `Orden #${order.billId} - Cliente: ${order.buyerName}`,
      images: [{ urlImage: mainProduct?.productImage || "https://placehold.co/100x100/E5E7EB/9CA3AF?text=Order" }],
      billId: order.billId,
      deliveryDate: order.deliveryDate,
      buyerName: order.buyerName,
      deliveryStatus: order.deliveryStatus,
      productCards: order.productCards
    };
  };

  const convertedProducts = filteredOrders.map(orderToProduct);

  //  paginación
  const startIndex = (pagination.currentPage - 1) * pagination.limit;
  const endIndex = startIndex + pagination.limit;
  const paginatedProducts = convertedProducts.slice(startIndex, endIndex);
  const currentPageStart = convertedProducts.length === 0 ? 0 : startIndex + 1;
  const currentPageEnd = Math.min(endIndex, convertedProducts.length);
  
  // Actualizar items
  useEffect(() => {
    setPagination(prev => ({ ...prev, totalItems: convertedProducts.length }));
  }, [convertedProducts.length]);

  const totalPages = Math.max(1, Math.ceil(convertedProducts.length / pagination.limit));

  return (
    <div className={`bg-gray-50 min-h-screen ${className}`}>
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 sm:flex-nowrap">
            <div className="w-full sm:flex-1 sm:min-w-[280px]">
              <Input
                placeholder="Buscar por cliente o producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex gap-2 sm:hidden">
              <Button
                variant="secondary"
                size="small"
                className="w-full"
                onClick={() => setMobileFiltersOpen((prev) => !prev)}
                aria-expanded={isMobileFiltersOpen}
                aria-controls="supplier-filters"
              >
                {isMobileFiltersOpen ? "Ocultar filtros" : "Mostrar filtros"}
              </Button>
            </div>

            <div
              id="supplier-filters"
              className={`${isMobileFiltersOpen ? "grid gap-3" : "hidden"} sm:flex sm:flex-nowrap sm:items-center sm:gap-3 sm:ml-auto`}
            >
              <div className="w-full sm:w-52 flex-shrink-0">
                <Select
                  fullWidth
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                  options={FILTER_STATUS_OPTIONS}
                />
              </div>

              <div className="w-full sm:w-56 flex-shrink-0">
                <CustomCalendar
                  value={filterDate}
                  onChange={setFilterDate}
                  placeholder="Seleccionar fecha"
                />
              </div>

              <Button 
                variant="primary" 
                onClick={applyFilters}
                className="w-full sm:w-auto sm:flex-shrink-0"
              >
                Buscar
              </Button>

              {(filterDate || filterStatus !== "all" || searchTerm) && (
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("all");
                    setFilterDate("");
                    setMobileFiltersOpen(false);
                  }}
                  className="w-full sm:w-auto sm:flex-shrink-0"
                  title="Limpiar filtros"
                >
                  ✕
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedProducts.map((product) => (
                <TileCard 
                  key={product.id} 
                  product={product}
                  onStatusUpdate={handleStatusUpdate}
                />
              ))}
            </div>

            {convertedProducts.length === 0 && !loading && (
              <div className="text-center py-12">
                <Text color="muted">No se encontraron órdenes</Text>
              </div>
            )}
          </>
        )}
      </div>

      {/* Paginación */}
      {!loading && convertedProducts.length > 0 && (
        <div className="mt-6 border-t border-gray-200 px-4 sm:px-6 pb-6 pt-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
              <Text size="sm" color="muted" className="sm:whitespace-nowrap">
                Mostrando {currentPageStart}-{currentPageEnd} de {convertedProducts.length} órdenes
              </Text>

              <div className="flex items-center gap-2">
                <Text size="sm" color="muted" className="sm:whitespace-nowrap">
                  Filas por página:
                </Text>
                <Select
                  value={String(pagination.limit)}
                  onChange={(e) => {
                    const newLimit = Number(e.target.value);
                    setPagination(prev => ({
                      ...prev,
                      limit: newLimit,
                      currentPage: 1,
                    }));
                  }}
                  size="small"
                  options={ROWS_PER_PAGE_OPTIONS.map((value) => ({
                    value: String(value),
                    label: String(value),
                  }))}
                />
              </div>
            </div>

            <div className="flex items-center gap-1 flex-wrap justify-center sm:justify-end">
              <PaginationItem
                disabled={pagination.currentPage === 1}
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
              >
                {"<"}
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  const current = pagination.currentPage;
                  const last = totalPages;
                  return page === 1 || page === last || (page >= current - 1 && page <= current + 1);
                })
                .map((page, idx, arr) => (
                  <React.Fragment key={page}>
                    {idx > 0 && arr[idx - 1] !== page - 1 && <span className="px-1 sm:px-2 text-gray-500">…</span>}
                    <PaginationItem
                      active={page === pagination.currentPage}
                      onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
                    >
                      {page}
                    </PaginationItem>
                  </React.Fragment>
                ))}

              <PaginationItem
                disabled={pagination.currentPage === totalPages}
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
              >
                {">"}
              </PaginationItem>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}