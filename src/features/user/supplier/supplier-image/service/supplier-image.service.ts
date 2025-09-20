import { apiClient } from '@/lib/api';
import type {
  ImageSupplier,
  CreateImageSupplierDto,
  UpdateImageSupplierDto
} from '@/features/user/supplier/supplier-image/model/supplier-image.model';

export class SupplierImageService {
  private static baseUrl = '/supplier-image';

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

  static async create(imageData: CreateImageSupplierDto): Promise<ImageSupplier> {
    try {
      const response = await apiClient.post(this.baseUrl, imageData);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to create supplier image');
      throw error;
    }
  }

  static async findAll(): Promise<ImageSupplier[]> {
    try {
      const response = await apiClient.get(this.baseUrl);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch supplier images');
      throw error;
    }
  }

  static async findBySupplierId(supplierId: string): Promise<ImageSupplier[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/supplier/${supplierId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch supplier images by supplier');
      throw error;
    }
  }

  static async update(id: number, updateData: UpdateImageSupplierDto): Promise<ImageSupplier> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${id}`, updateData);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to update supplier image');
      throw error;
    }
  }

  static async remove(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      this.handleError(error, 'Failed to delete supplier image');
      throw error;
    }
  }
}