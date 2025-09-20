import { apiClient } from '@/lib/api';
import type {
  Blacklist
} from '@/features/blacklist/model/blacklist.model';

export class BlacklistService {
  private static baseUrl = '/blacklist';

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

  static async find(value: string): Promise<Blacklist | null> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/find`, {
        params: { value }
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to find blacklist entry');
      throw error;
    }
  }

  static async create(value: string): Promise<Blacklist> {
    try {
      const response = await apiClient.post(this.baseUrl, { value });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to create blacklist entry');
      throw error;
    }
  }
}