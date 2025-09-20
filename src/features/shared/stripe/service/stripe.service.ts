import { apiClient } from '@/lib/api';

export class StripeService {
  private static baseUrl = '/stripe';

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

  static async createCheckoutSession(
    items: any[],
    successUrl: string,
    cancelUrl: string
  ): Promise<any> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/create-checkout-session`, {
        items,
        successUrl,
        cancelUrl
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to create checkout session');
      throw error;
    }
  }

  static async getSessionStatus(sessionId: string): Promise<{ status: string; customer_email?: string }> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/session-status/${sessionId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get session status');
      throw error;
    }
  }
}