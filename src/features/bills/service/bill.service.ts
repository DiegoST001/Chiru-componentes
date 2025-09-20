import { apiClient } from '@/lib/api';
import type {
  BillEntity,
  CreateBillRequest,
  PreviewCheckoutResponse,
  PendingOrderResponse,
  BillAnalyticsSupplier,
  BillErrorResponse,
} from '../model/bill.model';

export class BillService {
  private static base = '/bills';

  static async findAll(): Promise<BillEntity[]> {
    try {
      const res = await apiClient.get<BillEntity[]>(this.base);
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('Insufficient permissions to access all bills');
      }
      throw new Error('Failed to retrieve bills');
    }
  }

  static async createManual(payload: CreateBillRequest): Promise<BillEntity> {
    try {
      const res = await apiClient.post<BillEntity>(this.base, payload);
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Invalid bill data or user ID not found');
      }
      if (error.response?.status === 422) {
        throw new Error('Business logic validation failed or calculation errors');
      }
      throw new Error('Failed to create bill');
    }
  }

  static async previewCheckout(userId: number): Promise<PreviewCheckoutResponse> {
    try {
      const res = await apiClient.get<PreviewCheckoutResponse>(`${this.base}/preview-checkout/${userId}`);
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('User not authenticated');
      }
      if (error.response?.status === 404) {
        throw new Error('User not found or empty cart');
      }
      throw new Error('Failed to calculate checkout preview');
    }
  }

  static async createPending(userId: number, payload: Record<string, any>): Promise<PendingOrderResponse> {
    try {
      const res = await apiClient.post<PendingOrderResponse>(`${this.base}/create-pending/${userId}`, payload);
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Invalid data or missing required information');
      }
      if (error.response?.status === 401) {
        throw new Error('User not authenticated');
      }
      if (error.response?.status === 404) {
        throw new Error('User not found, empty cart, or no address registered');
      }
      throw new Error('Failed to create pending order');
    }
  }

  static async createFromCart(userId: number, cartItems: any[]): Promise<BillEntity> {
    try {
      const res = await apiClient.post<BillEntity>(`${this.base}/payment/${userId}`, cartItems);
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Invalid user ID or empty cart items array');
      }
      if (error.response?.status === 404) {
        throw new Error('User not found or one or more products unavailable');
      }
      if (error.response?.status === 422) {
        throw new Error('Cart validation failed or product price changes detected');
      }
      throw new Error('Failed to create bill from cart');
    }
  }

  static async createIzipay(userId: number, payload: any): Promise<any> {
    try {
      const res = await apiClient.post(`${this.base}/payment/izipay/${userId}`, payload);
      return res.data;
    } catch (error: any) {
      throw new Error('Failed to create Izipay payment bill');
    }
  }

  static async findByUser(userId: number): Promise<BillEntity[]> {
    try {
      const res = await apiClient.get<BillEntity[]>(`${this.base}/user/${userId}`);
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error(`No bills found for user Id ${userId}`);
      }
      if (error.response?.status === 400) {
        throw new Error('Invalid user ID format provided');
      }
      throw new Error('Failed to retrieve user bills');
    }
  }

  static async findPendingDeliveries(): Promise<BillEntity[]> {
    try {
      const res = await apiClient.get<BillEntity[]>(`${this.base}/pending-deliveries`);
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('Insufficient permissions to access delivery information');
      }
      throw new Error('Failed to retrieve pending deliveries');
    }
  }

  static async topCategories(): Promise<Array<{ category: string; totalSold: number; revenue: number; averageOrderValue: number; marketShare: number }>> {
    try {
      const res = await apiClient.get(`${this.base}/top-categories`);
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('Insufficient permissions to access sales analytics data');
      }
      throw new Error('Failed to retrieve top categories');
    }
  }

  static async topSuppliers(): Promise<any[]> {
    try {
      const res = await apiClient.get(`${this.base}/top-suppliers`);
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('Insufficient permissions to access supplier analytics data');
      }
      throw new Error('Failed to retrieve top suppliers');
    }
  }

  static async findOne(id: number): Promise<BillEntity> {
    try {
      const res = await apiClient.get<BillEntity>(`${this.base}/${id}`);
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error(`Bill with ID ${id} not found`);
      }
      if (error.response?.status === 400) {
        throw new Error('Invalid bill ID format provided');
      }
      throw new Error('Failed to retrieve bill');
    }
  }

  static async update(id: number, payload: Partial<CreateBillRequest>): Promise<BillEntity> {
    try {
      const res = await apiClient.patch<BillEntity>(`${this.base}/${id}`, payload);
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Invalid bill ID format or update data validation failed');
      }
      if (error.response?.status === 403) {
        throw new Error('Insufficient permissions to modify this bill');
      }
      if (error.response?.status === 404) {
        throw new Error('Bill not found with the specified ID');
      }
      if (error.response?.status === 422) {
        throw new Error('Business logic validation failed or calculation errors');
      }
      throw new Error('Failed to update bill');
    }
  }

  static async remove(id: number): Promise<{ message: string; deletedBillId?: number }> {
    try {
      const res = await apiClient.delete(`${this.base}/${id}`);
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Invalid bill ID format provided');
      }
      if (error.response?.status === 403) {
        throw new Error('Insufficient permissions to delete this bill');
      }
      if (error.response?.status === 404) {
        throw new Error(`Bill with ID ${id} not found`);
      }
      if (error.response?.status === 409) {
        throw new Error('Bill cannot be deleted due to business constraints');
      }
      throw new Error('Failed to delete bill');
    }
  }

  static async initDelivery(billCode: number, payload: { estimatedDays: number }): Promise<BillEntity> {
    try {
      const res = await apiClient.patch<BillEntity>(`${this.base}/${billCode}/delivery-info`, payload);
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Invalid bill code format or estimated days value');
      }
      if (error.response?.status === 404) {
        throw new Error('Bill not found with the specified bill code');
      }
      if (error.response?.status === 409) {
        throw new Error('Bill delivery information already initialized or invalid status for update');
      }
      if (error.response?.status === 422) {
        throw new Error('Business logic validation failed - bill may not be ready for shipment');
      }
      throw new Error('Failed to initialize delivery information');
    }
  }

  static async confirmDelivery(billCode: number): Promise<BillEntity> {
    try {
      const res = await apiClient.patch<BillEntity>(`${this.base}/${billCode}/confirm-delivery`);
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Invalid bill code format provided');
      }
      if (error.response?.status === 403) {
        throw new Error('Insufficient permissions to confirm delivery for this bill');
      }
      if (error.response?.status === 404) {
        throw new Error('Bill not found with the specified bill code');
      }
      if (error.response?.status === 409) {
        throw new Error('Delivery already confirmed or bill not in shippable status');
      }
      if (error.response?.status === 422) {
        throw new Error('Bill status does not allow delivery confirmation (must be in "shipping" status)');
      }
      throw new Error('Failed to confirm delivery');
    }
  }

  static async updateDeliveryDetails(billCode: number, payload: Partial<CreateBillRequest & { notes?: string }>): Promise<BillEntity> {
    try {
      const res = await apiClient.patch<BillEntity>(`${this.base}/${billCode}/delivery-details`, payload);
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Invalid bill code format or update data validation failed');
      }
      if (error.response?.status === 403) {
        throw new Error('Insufficient permissions to modify delivery details for this bill');
      }
      if (error.response?.status === 404) {
        throw new Error('Bill not found with the specified bill code');
      }
      if (error.response?.status === 409) {
        throw new Error('Update conflicts with current bill state or status constraints');
      }
      if (error.response?.status === 422) {
        throw new Error('Business logic validation failed or invalid status transitions');
      }
      throw new Error('Failed to update delivery details');
    }
  }

  static async supplierSalesAnalytics(payload: { supplierId: string; month: number; year: number }): Promise<BillAnalyticsSupplier> {
    try {
      const res = await apiClient.post<BillAnalyticsSupplier>(`${this.base}/sales`, payload);
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        const data = error.response?.data as BillErrorResponse;
        throw new Error(Array.isArray(data?.message) ? data.message.join(', ') : data?.message || 'Invalid request parameters');
      }
      if (error.response?.status === 401) {
        throw new Error('Authentication required - invalid or missing JWT token');
      }
      if (error.response?.status === 403) {
        throw new Error('Insufficient permissions to access supplier sales data');
      }
      throw new Error('Failed to retrieve supplier sales analytics');
    }
  }
}
