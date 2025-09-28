import React, { useState, useEffect } from "react";
import { cntl } from "@/utils/cntl";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import { Spinner } from "@/components/atoms/Spinner";
import { apiClient } from "@/lib/api";
import { ShoppingCart } from "phosphor-react";

interface BillDetail {
  id: number;
  product: string;
  quantity: string;
}

interface Bill {
  code: number;
  userId: number;
  total: string;
  discount: string;
  vat: string;
  totalAmount: string;
  deliveryStatus: string;
  paymentStatus: string;
  deliveryStartDate: string;
  estimatedDeliveryDays: number;
  deliveryDate: string;
  stripeSessionId: string;
  billsDetails: BillDetail[];
}

type MyOrdersSectionProps = {
  userId: number;
};

export function MyOrdersSection({ userId }: MyOrdersSectionProps) {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserBills = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get<Bill[]>(`/bills/user/${userId}`);
        setBills(response.data);
      } catch (err) {
        console.error("Error fetching bills:", err);
        setError("Error al cargar los pedidos");
      } finally {
        setLoading(false);
      }
    };

    fetchUserBills();
  }, [userId]);

  const getDeliveryStatusBadge = (status: string) => {
    const statusMap = {
      received: { variant: "success" as const, text: "Recibido" },
      shipping: { variant: "warning" as const, text: "En envío" },
      pending: { variant: "info" as const, text: "Pendiente" },
      cancelled: { variant: "danger" as const, text: "Cancelado" }
    };
    return statusMap[status as keyof typeof statusMap] || { variant: "default" as const, text: status };
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusMap = {
      paid: { variant: "success" as const, text: "Pagado" },
      pending: { variant: "warning" as const, text: "Pendiente" },
      failed: { variant: "danger" as const, text: "Fallido" }
    };
    return statusMap[status as keyof typeof statusMap] || { variant: "default" as const, text: status };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatPrice = (price: string) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
        <Text className="ml-3">Cargando pedidos...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Text className="text-red-600 mb-4">{error}</Text>
        <Button 
          variant="outline" 
          text="Reintentar"
          onClick={() => window.location.reload()}
        />
      </div>
    );
  }

  if (bills.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart size={48} className="text-gray-400 mx-auto mb-4" />
        <Text className="text-xl font-semibold text-gray-900 mb-2">
          No tienes pedidos aún
        </Text>
        <Text className="text-gray-600 mb-6">
          Cuando realices tu primer pedido, aparecerá aquí
        </Text>
        <Button variant="primary" text="Explorar productos" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart size={24} className="text-gray-600" />
        <h1 className="text-2xl font-bold text-gray-900">Mis Pedidos</h1>
        <Badge variant="info" size="small">
          {bills.length}
        </Badge>
      </div>

      <div className="space-y-6">
        {bills.map((bill) => (
          <div
            key={bill.code}
            className={cntl`
              bg-white rounded-lg border border-gray-200 p-6 
              hover:shadow-md transition-shadow duration-200
            `}
          >
            {/* Header del pedido */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Text className="font-semibold text-gray-900">
                  Pedido #{bill.code}
                </Text>
                <Badge 
                  variant={getDeliveryStatusBadge(bill.deliveryStatus).variant}
                  size="small"
                >
                  {getDeliveryStatusBadge(bill.deliveryStatus).text}
                </Badge>
                <Badge 
                  variant={getPaymentStatusBadge(bill.paymentStatus).variant}
                  size="small"
                >
                  {getPaymentStatusBadge(bill.paymentStatus).text}
                </Badge>
              </div>
              <Text className="text-gray-500 text-sm">
                {formatDate(bill.deliveryStartDate)}
              </Text>
            </div>

            {/* Detalles del pedido */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <Text className="text-gray-500 text-sm mb-1">Productos</Text>
                <Text className="font-medium">
                  {bill.billsDetails.reduce((total, item) => total + parseFloat(item.quantity), 0)} artículos
                </Text>
              </div>
              
              <div>
                <Text className="text-gray-500 text-sm mb-1">Subtotal</Text>
                <Text className="font-medium">
                  {formatPrice(bill.total)}
                </Text>
              </div>

              <div>
                <Text className="text-gray-500 text-sm mb-1">Descuento</Text>
                <Text className="font-medium text-green-600">
                  -{formatPrice(bill.discount)}
                </Text>
              </div>

              <div>
                <Text className="text-gray-500 text-sm mb-1">Total</Text>
                <Text className="font-semibold text-lg">
                  {formatPrice(bill.totalAmount)}
                </Text>
              </div>
            </div>

            {/* Información de entrega */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Text className="text-gray-500 text-sm mb-1">Fecha de envío</Text>
                  <Text className="text-sm">
                    {formatDate(bill.deliveryStartDate)}
                  </Text>
                </div>
                <div>
                  <Text className="text-gray-500 text-sm mb-1">Días estimados</Text>
                  <Text className="text-sm">
                    {bill.estimatedDeliveryDays} días
                  </Text>
                </div>
                <div>
                  <Text className="text-gray-500 text-sm mb-1">Fecha de entrega</Text>
                  <Text className="text-sm">
                    {formatDate(bill.deliveryDate)}
                  </Text>
                </div>
              </div>
            </div>

            {/* Lista de productos */}
            <div className="space-y-2 mb-4">
              <Text className="font-medium text-gray-900 mb-2">Productos:</Text>
              {bill.billsDetails.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <Text className="text-sm text-gray-600">
                      Producto {index + 1}
                    </Text>
                    <Text className="text-xs text-gray-500 font-mono">
                      ID: {item.product.substring(0, 8)}...
                    </Text>
                  </div>
                  <Text className="text-sm font-medium">
                    Cantidad: {item.quantity}
                  </Text>
                </div>
              ))}
            </div>

            {/* Acciones */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button variant="outline" size="small" text="Ver detalles" />
              <Button variant="outline" size="small" text="Descargar factura" />
              {bill.deliveryStatus === 'shipping' && (
                <Button variant="primary" size="small" text="Rastrear envío" />
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}