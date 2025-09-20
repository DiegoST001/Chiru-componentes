import { apiClient } from '@/lib/api';
import type {
  SupplierPromotion
} from '@/features/user/supplier/supplier-promotion/model/supplier-promotion.model';

export class SupplierPromotionService {
  private static baseUrl = '/supplier-promotion';

  private static handleError(error: any, defaultMessage: string): void {
    if (error.response?.status === 401) {
      throw new Error('Unauthorized. Please login again.');
    } else if (error.response?.status === 404) {
      throw new Error('Resource not found.');
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error(defaultMessage);
    }
  }
}