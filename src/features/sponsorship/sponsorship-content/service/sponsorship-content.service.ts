import { apiClient } from '@/lib/api';
import type {
  SponsorshipContent
} from '@/features/sponsorship/sponsorship-content/model/sponsorship-content.model';

export class SponsorshipContentService {
  private static baseUrl = '/sponsorship-content';

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

  static async validateContentType(contentType: string, contentId: string): Promise<boolean> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/validate`, {
        contentType,
        contentId
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to validate content type');
      throw error;
    }
  }
}