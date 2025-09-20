export type DeliveryStatus = 'pending' | 'shipping' | 'received' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'transmitted';

export interface BillDetail {
  id: number;
  product: string; // product id
  quantity: number;
  unitPrice?: number;
  subtotal?: number;
}

export interface BillEntity {
  code: number;
  userId: number;
  total: number;
  discount: number;
  vat: number;
  totalAmount: number;
  deliveryStatus: DeliveryStatus;
  paymentStatus: PaymentStatus;
  deliveryStartDate?: string | null;
  estimatedDeliveryDays?: number | null;
  deliveryDate?: string | null;
  stripeSessionId?: string | null;
  billsDetails?: BillDetail[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBillRequest {
  userId: number;
  total: number;
  discount?: number;
  vat?: number;
  totalAmount?: number;
  deliveryStatus?: DeliveryStatus;
  deliveryStartDate?: string | null;
  estimatedDeliveryDays?: number | null;
  paymentStatus?: PaymentStatus;
}

export interface PreviewCheckoutItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface PreviewCheckoutResponse {
  subtotal: number;
  vat: number;
  discount: number;
  total: number;
  izipayCommission: number;
  finalAmount: number;
  items: PreviewCheckoutItem[];
}

export interface PendingOrderResponse {
  bill: BillEntity | Record<string, unknown>;
  message: string;
  reservationExpiresAt?: string;
}

export interface BillAnalyticsSupplier {
  supplierId: string;
  period: { month: number; year: number; monthName?: string };
  salesMetrics: { totalSales: number; totalRevenue: number; averageOrderValue: number; totalProductsSold: number };
  topProducts: Array<{ productId: string; productName: string; unitsSold: number; revenue: number; averagePrice: number }>;
  salesTrend?: { previousMonth?: number; growthRate?: number; trendDirection?: 'up' | 'down' | 'flat' };
  deliveryPerformance?: { averageDeliveryDays?: number; onTimeDeliveryRate?: number; customerSatisfactionScore?: number };
}

export interface BillErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}
