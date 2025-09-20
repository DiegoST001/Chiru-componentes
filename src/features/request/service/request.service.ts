import { apiClient } from '@/lib/api';
import type {
  Request,
  RequestResponse,
  CreateRequestDto,
  UpdateRequestDto,
  CreateRequestResponseDto,
  UpdateRequestResponseDto,
  ResponseStats
} from '@/features/request/model/request.model';

export class RequestService {
  private static baseUrl = '/request';

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

  static async create(createRequestDto: CreateRequestDto): Promise<Request> {
    try {
      const response = await apiClient.post(this.baseUrl, createRequestDto);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to create request');
      throw error;
    }
  }

  static async findRequestsBySupplierProductCategories(supplierId: string): Promise<Request[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/supplier-categories/${supplierId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to find requests by supplier product categories');
      throw error;
    }
  }

  static async findRequestsByCategory(categoryId: string): Promise<Request[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/category/${categoryId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to find requests by category');
      throw error;
    }
  }

  static async update(requestId: number, updateRequestDto: UpdateRequestDto): Promise<Request> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${requestId}`, updateRequestDto);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to update request');
      throw error;
    }
  }

  static async findRequestsByUserId(tokenString: number): Promise<Request[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/user/${tokenString}`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to find requests by user');
      throw error;
    }
  }

  static async requestThreeLast(userId: number): Promise<Request[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/user/${userId}/last-three`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get last three requests');
      throw error;
    }
  }

  static async numberPertitionsActive(userId: number): Promise<number> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/user/${userId}/active-count`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get active petitions count');
      throw error;
    }
  }

  static async totalCommentsCount(userId: number): Promise<number> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/user/${userId}/comments-count`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get total comments count');
      throw error;
    }
  }

  static async averageCommentsPerRequest(userId: number): Promise<number> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/user/${userId}/average-comments`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get average comments per request');
      throw error;
    }
  }

  static async responseRate(userId: number): Promise<number> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/user/${userId}/response-rate`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get response rate');
      throw error;
    }
  }
}

export class RequestResponseService {
  private static baseUrl = '/request-response';

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

  static async create(createDto: CreateRequestResponseDto): Promise<RequestResponse> {
    try {
      const response = await apiClient.post(this.baseUrl, createDto);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to create request response');
      throw error;
    }
  }

  static async getResponsesByRequestId(requestId: number, userId: number): Promise<RequestResponse[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/request/${requestId}`, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get responses by request ID');
      throw error;
    }
  }

  static async getResponsesBySupplierId(supplierId: string): Promise<RequestResponse[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/supplier/${supplierId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get responses by supplier ID');
      throw error;
    }
  }

  static async update(responseId: number, updateDto: UpdateRequestResponseDto, supplierId: string): Promise<RequestResponse> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${responseId}`, updateDto, {
        params: { supplierId }
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to update request response');
      throw error;
    }
  }

  static async delete(responseId: number, supplierId: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${responseId}`, {
        params: { supplierId }
      });
    } catch (error) {
      this.handleError(error, 'Failed to delete request response');
      throw error;
    }
  }

  static async getResponseStats(supplierId: string): Promise<ResponseStats> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/supplier/${supplierId}/stats`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get response stats');
      throw error;
    }
  }

  static async findOne(responseId: number): Promise<RequestResponse> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${responseId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to find request response');
      throw error;
    }
  }
}