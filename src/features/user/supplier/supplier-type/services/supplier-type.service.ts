import { apiClient } from '@/lib/api';
import type {
  SupplierType,
  CreateSupplierTypeDto,
  UpdateSupplierTypeDto
} from '@/features/user/supplier/supplier-type/model/supplier-type.model';

export class SupplierTypeService {
  private static baseUrl = '/supplier-type';

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

  static async create(supplierId: string, typeData: CreateSupplierTypeDto): Promise<SupplierType> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${supplierId}`, typeData);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to create supplier type');
      throw error;
    }
  }

  static async update(idType: number, updateData: UpdateSupplierTypeDto): Promise<SupplierType> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${idType}`, updateData);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to update supplier type');
      throw error;
    }
  }

  static async delete(idType: number): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${idType}`);
    } catch (error) {
      this.handleError(error, 'Failed to delete supplier type');
      throw error;
    }
  }
}