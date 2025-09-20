import { apiClient } from '@/lib/api';
import type {
  UserPaymentMethod
} from '@/features/user/user-payment-method/model/user-payment-method.model';

export class UserPaymentMethodService {
  private static baseUrl = '/user-payment-method';

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