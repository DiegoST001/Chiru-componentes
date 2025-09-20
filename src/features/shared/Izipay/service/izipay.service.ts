import { apiClient } from '@/lib/api';
import type {
  CreateIzipayPaymentDto,
  IzipayWebhookDto,
  CartItem,
  WebhookConfiguration,
  ConfigurationValidation
} from '@/features/shared/izipay/models/izipay.model';

export class IzipayService {
  private static baseUrl = '/izipay';

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

  static async generatePaymentForm(createPaymentDto: CreateIzipayPaymentDto): Promise<string> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/generate-form`, createPaymentDto);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to generate payment form');
      throw error;
    }
  }

  static async processWebhookNotification(webhookData: IzipayWebhookDto): Promise<string> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/webhook`, webhookData);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to process webhook notification');
      throw error;
    }
  }

  static async validateWebhookSignature(webhookData: IzipayWebhookDto): Promise<boolean> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/validate-signature`, webhookData);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to validate webhook signature');
      throw error;
    }
  }

  static async getWebhookConfiguration(): Promise<WebhookConfiguration> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/webhook-config`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get webhook configuration');
      throw error;
    }
  }

  static async validateConfiguration(): Promise<ConfigurationValidation> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/validate-config`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to validate configuration');
      throw error;
    }
  }

  static async generatePaymentFormWithCartItems(
    createPaymentDto: CreateIzipayPaymentDto, 
    cartItems?: CartItem[]
  ): Promise<string> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/generate-form-with-items`, {
        ...createPaymentDto,
        cartItems
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to generate payment form with cart items');
      throw error;
    }
  }

  static async validateWebhookIP(clientIP: string): Promise<boolean> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/validate-ip`, { clientIP });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to validate webhook IP');
      throw error;
    }
  }
}