import { apiClient } from '@/lib/api';
import type {
  CreateInternationalDocumentsOrderRequest,
  CreateInternationalDocumentsOrderResponse,
  InternationalDocumentsOrder,
  InternationalDocumentsOrderListResponse,
  InternationalDocumentsOrderError,
} from '../model/international-documents-order.model';

export class InternationalDocumentsOrderService {
  private static baseUrl = '/logistics-order';

  static async createOrder(
    dto: CreateInternationalDocumentsOrderRequest,
    userId: number
  ): Promise<CreateInternationalDocumentsOrderResponse> {
    try {
      const response = await apiClient.post<CreateInternationalDocumentsOrderResponse>(
        this.baseUrl,
        dto
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error(error.response.data.message || 'Forbidden: insufficient access');
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Bad request: invalid input');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication required');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('An unexpected error occurred while creating the logistics order');
      }
    }
  }

  static async findAllRuc20Orders(): Promise<InternationalDocumentsOrderListResponse> {
    try {
      const response = await apiClient.get<InternationalDocumentsOrder[]>(`${this.baseUrl}/ruc20-orders`);
      return {
        total: response.data?.length || 0,
        orders: response.data || [],
      };
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Authentication required');
      } else {
        throw new Error('An unexpected error occurred while retrieving orders');
      }
    }
  }
}
