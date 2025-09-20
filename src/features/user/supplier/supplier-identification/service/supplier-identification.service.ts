import { apiClient } from '@/lib/api';
import type {
  SupplierIdentification,
  CreateSupplierIdentificationDto,
  UpdateSupplierIdentificationDto
} from '@/features/user/supplier/supplier-identification/model/supplier-identification.model';

export class SupplierIdentificationService {
  private static baseUrl = '/supplier-identification';

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

  static async create(identificationData: CreateSupplierIdentificationDto): Promise<SupplierIdentification> {
    try {
      const response = await apiClient.post(this.baseUrl, identificationData);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to create supplier identification');
      throw error;
    }
  }

  static async update(supplierId: string, updateData: UpdateSupplierIdentificationDto): Promise<SupplierIdentification> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${supplierId}`, updateData);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to update supplier identification');
      throw error;
    }
  }

  static async findAll(): Promise<SupplierIdentification[]> {
    try {
      const response = await apiClient.get(this.baseUrl);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch supplier identifications');
      throw error;
    }
  }

  static async findOne(supplierId: string): Promise<SupplierIdentification> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${supplierId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch supplier identification');
      throw error;
    }
  }
}