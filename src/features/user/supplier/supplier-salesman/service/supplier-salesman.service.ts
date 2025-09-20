import { apiClient } from '@/lib/api';
import type {
  SupplierContact,
  CreateSupplierContactDto,
  UpdateSupplierContactDto
} from '@/features/user/supplier/supplier-salesman/model/supplier-salesman.model';

export class SupplierSalesmanService {
  private static baseUrl = '/supplier-contact';

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

  static async create(contactData: CreateSupplierContactDto): Promise<SupplierContact> {
    try {
      const response = await apiClient.post(this.baseUrl, contactData);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to create supplier contact');
      throw error;
    }
  }

  static async findAll(): Promise<SupplierContact[]> {
    try {
      const response = await apiClient.get(this.baseUrl);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch supplier contacts');
      throw error;
    }
  }

  static async findOne(id: number): Promise<SupplierContact> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch supplier contact');
      throw error;
    }
  }

  static async update(id: number, updateData: UpdateSupplierContactDto): Promise<SupplierContact> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${id}`, updateData);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to update supplier contact');
      throw error;
    }
  }

  static async remove(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      this.handleError(error, 'Failed to delete supplier contact');
      throw error;
    }
  }

  static async findSupplierContactBySupplierId(supplierId: string): Promise<SupplierContact | null> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/supplier/${supplierId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch supplier contact by supplier');
      throw error;
    }
  }
}