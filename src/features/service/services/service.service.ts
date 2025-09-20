import { apiClient } from '@/lib/api';
import type {
  Service,
  CreateServiceDto,
  UpdateServiceDto
} from '@/features/service/model/service.model';

export class ServiceService {
  private static baseUrl = '/services';

  static async findAll(query: any): Promise<any> {
    try {
      const response = await apiClient.get(this.baseUrl, { params: query });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error fetching services');
      throw error;
    }
  }

  static async create(createServiceDto: CreateServiceDto): Promise<Service> {
    try {
      const response = await apiClient.post<Service>(this.baseUrl, createServiceDto);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error creating service');
      throw error;
    }
  }

  static async findOne(id: number): Promise<Service> {
    try {
      const response = await apiClient.get<Service>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error fetching service with ID: ${id}`);
      throw error;
    }
  }

  static async update(id: number, updateServiceDto: UpdateServiceDto): Promise<Service> {
    try {
      const response = await apiClient.patch<Service>(`${this.baseUrl}/${id}`, updateServiceDto);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error updating service with ID: ${id}`);
      throw error;
    }
  }

  static async remove(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error: any) {
      this.handleError(error, `Error deleting service with ID: ${id}`);
      throw error;
    }
  }

  static async saveImagesForService(serviceData: {
    serviceId: number;
    images: string[];
  }): Promise<{ message: string; savedImages: any[] }> {
    try {
      const response = await apiClient.post<{ message: string; savedImages: any[] }>(
        `${this.baseUrl}/images`, 
        serviceData
      );
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error saving images for service');
      throw error;
    }
  }

  static async deleteImage(imageId: number): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<{ message: string }>(`${this.baseUrl}/images/${imageId}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error deleting image');
      throw error;
    }
  }

  static async findByName(
    name?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    services: Service[];
    totalPages: number;
    totalResults: number;
  }> {
    try {
      const params = {
        name,
        page,
        limit
      };

      const response = await apiClient.get<{
        services: Service[];
        totalPages: number;
        totalResults: number;
      }>(`${this.baseUrl}/search`, { params });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error searching services by name');
      throw error;
    }
  }

  static async filterServices(filters: {
    priceMin?: number;
    priceMax?: number;
    category?: string;
    estimatedDuration?: string;
    supplierId: string;
    page: number;
    limit: number;
    name?: string;
  }): Promise<{
    data: Service[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const response = await apiClient.get<{
        data: Service[];
        total: number;
        page: number;
        limit: number;
      }>(`${this.baseUrl}/filter`, { params: filters });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error filtering services');
      throw error;
    }
  }

  static async findRecentServicesBySupplier(supplierId: string): Promise<Service[]> {
    try {
      const response = await apiClient.get<Service[]>(`${this.baseUrl}/supplier/${supplierId}/recent`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error fetching recent services for supplier: ${supplierId}`);
      throw error;
    }
  }

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