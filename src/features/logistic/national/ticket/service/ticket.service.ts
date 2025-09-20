import { apiClient } from '@/lib/api';
import type {
  CreateTicketRequest,
  TicketEntity,
  TicketDetailUpdateResponse,
  ApiErrorResponse,
} from '../model/ticket.model';

export class TicketService {
  private static baseUrl = '/ticket';

  static async createTicketForPayment(
    userId: number,
    cartItems: CreateTicketRequest['cartItems'],
    destination: string
  ): Promise<TicketEntity> {
    try {
      const response = await apiClient.post<TicketEntity>(
        `${this.baseUrl}/payment/${userId}`,
        { cartItems, destination }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Invalid user ID, empty cart items, or missing destination');
      } else if (error.response?.status === 404) {
        throw new Error('User not found or one or more products in cart no longer available');
      }
      this.handleError(error, 'Failed to create ticket');
    }
  }

  static async getTicketById(id: string): Promise<TicketEntity> {
    try {
      const response = await apiClient.get<TicketEntity>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error(`Ticket with ID ${id} not found`);
      } else if (error.response?.status === 400) {
        throw new Error('Invalid ticket ID format');
      }
      this.handleError(error, 'Failed to retrieve ticket');
    }
  }

  static async getAllTickets(): Promise<TicketEntity[]> {
    try {
      const response = await apiClient.get<TicketEntity[]>(this.baseUrl);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Failed to retrieve tickets');
    }
  }

  static async updateTicketDetailQuantity(detailId: string, cantidad: number): Promise<TicketDetailUpdateResponse> {
    try {
      const response = await apiClient.put<TicketDetailUpdateResponse>(
        `${this.baseUrl}/detail/${detailId}/quantity`,
        { cantidad }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Invalid ticket detail ID or quantity');
      } else if (error.response?.status === 404) {
        throw new Error('Ticket detail not found');
      }
      this.handleError(error, 'Failed to update ticket detail quantity');
    }
  }

  private static handleError(error: any, defaultMessage: string): never {
    if (error.response?.data) {
      const apiErr = error.response.data as ApiErrorResponse;
      throw new Error(Array.isArray(apiErr.message) ? apiErr.message.join(', ') : apiErr.message || defaultMessage);
    }
    if (error.message) throw new Error(error.message);
    throw new Error(defaultMessage);
  }
}
