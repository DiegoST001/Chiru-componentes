import { apiClient } from '@/lib/api';
import type { 
  CreateQuotationRequest, 
  CreateQuotationResponse, 
  QuotationErrorResponse 
} from '../model/quotation.model';

export class QuotationService {
  private static baseUrl = '/quotation';

  static async createQuotation(
    quotationData: CreateQuotationRequest
  ): Promise<CreateQuotationResponse> {
    try {
      const response = await apiClient.post<CreateQuotationResponse>(
        this.baseUrl,
        quotationData
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Invalid quotation data - please check all required fields');
      }
      if (error.response?.status === 401) {
        throw new Error('Authentication required - please login as a logistics provider');
      }
      if (error.response?.status === 409) {
        throw new Error('A quotation already exists for this order');
      }
      throw new Error('Failed to create quotation. Please try again.');
    }
  }

  private static handleError(error: any, defaultMessage: string): void {
    if (error.response?.data) {
      const errorResponse = error.response.data as QuotationErrorResponse;
      throw new Error(Array.isArray(errorResponse.message) 
        ? errorResponse.message.join(', ') 
        : errorResponse.message);
    }
    throw new Error(defaultMessage);
  }
}