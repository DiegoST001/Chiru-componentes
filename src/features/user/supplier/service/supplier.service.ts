import { apiClient } from '@/lib/api';
import type {
  Supplier,
  CreateSupplierDto,
  UpdateSupplierDto,
  CreateSupplierAndIdentificationDto,
  UpdateSocialMediaDto
} from '@/features/user/supplier/model/supplier.model';

export class SupplierService {
  private static baseUrl = '/supplier';

  static async create(id: number, createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    try {
      const response = await apiClient.post<Supplier>(`${this.baseUrl}/${id}`, createSupplierDto);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error creating supplier');
      throw error;
    }
  }

  static async findAll(): Promise<Supplier[]> {
    try {
      const response = await apiClient.get<Supplier[]>(this.baseUrl);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error fetching suppliers');
      throw error;
    }
  }

  static async updateSocialMedia(id: string, socialmedia: Record<string, any>): Promise<Supplier> {
    try {
      const response = await apiClient.patch<Supplier>(`${this.baseUrl}/${id}/social-media`, { socialmedia });
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error updating social media for supplier: ${id}`);
      throw error;
    }
  }

  static async getSocialMedia(id: string): Promise<Record<string, any>> {
    try {
      const response = await apiClient.get<Record<string, any>>(`${this.baseUrl}/${id}/social-media`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error getting social media for supplier: ${id}`);
      throw error;
    }
  }

  static async findAll_with_sponsorship(): Promise<Supplier[]> {
    try {
      const response = await apiClient.get<Supplier[]>(`${this.baseUrl}/with-sponsorship`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error fetching suppliers with sponsorship');
      throw error;
    }
  }

  static async findOne(id: string): Promise<Supplier> {
    try {
      const response = await apiClient.get<Supplier>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error fetching supplier with ID: ${id}`);
      throw error;
    }
  }

  static async update(id: string, updateSupplierDto: UpdateSupplierDto): Promise<Supplier> {
    try {
      const response = await apiClient.patch<Supplier>(`${this.baseUrl}/${id}`, updateSupplierDto);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error updating supplier with ID: ${id}`);
      throw error;
    }
  }

  static async remove(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error: any) {
      this.handleError(error, `Error deleting supplier with ID: ${id}`);
      throw error;
    }
  }

  static async findSupplierByProduct(productId: string): Promise<Supplier> {
    try {
      const response = await apiClient.get<Supplier>(`${this.baseUrl}/by-product/${productId}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error finding supplier by product: ${productId}`);
      throw error;
    }
  }

  static async getSampleProducts(): Promise<Array<{ id: string; name: string; supplierId: string }>> {
    try {
      const response = await apiClient.get<Array<{ id: string; name: string; supplierId: string }>>(`${this.baseUrl}/sample-products`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error getting sample products');
      throw error;
    }
  }

  static async findProductsBySupplier(
    supplierId: string,
    page: number = 1,
    limit: number = 10,
    minPrice?: number,
    maxPrice?: number,
    category?: string,
    name?: string
  ): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const params = { page, limit, minPrice, maxPrice, category, name };
      const response = await apiClient.get<{
        data: any[];
        total: number;
        page: number;
        limit: number;
      }>(`${this.baseUrl}/${supplierId}/products`, { params });
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error finding products by supplier: ${supplierId}`);
      throw error;
    }
  }

  static async findServicesBySupplier(
    supplierId: string,
    page: number,
    limit: number
  ): Promise<{
    services: any[];
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  }> {
    try {
      const params = { page, limit };
      const response = await apiClient.get<{
        services: any[];
        page: number;
        limit: number;
        totalPages: number;
        totalItems: number;
      }>(`${this.baseUrl}/${supplierId}/services`, { params });
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error finding services by supplier: ${supplierId}`);
      throw error;
    }
  }

  static async findSupplierDetails(id: string): Promise<any> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${id}/details`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error finding supplier details: ${id}`);
      throw error;
    }
  }

  static async getCategoriesAndProductsBySupplierId(supplierId: string): Promise<{ categoryId: string; categoryName: string; products: any[] }[]> {
    try {
      const response = await apiClient.get<{ categoryId: string; categoryName: string; products: any[] }[]>(`${this.baseUrl}/${supplierId}/categories-products`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error getting categories and products by supplier: ${supplierId}`);
      throw error;
    }
  }

  static async getCategoriesAndServicesySupplierId(supplierId: string): Promise<{ categoryId: string; categoryName: string; services: any[] }[]> {
    try {
      const response = await apiClient.get<{ categoryId: string; categoryName: string; services: any[] }[]>(`${this.baseUrl}/${supplierId}/categories-services`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error getting categories and services by supplier: ${supplierId}`);
      throw error;
    }
  }

  static async findRequestsBySupplierProductCategories(supplierId: string): Promise<any[]> {
    try {
      const response = await apiClient.get<any[]>(`${this.baseUrl}/${supplierId}/requests`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error finding requests by supplier product categories: ${supplierId}`);
      throw error;
    }
  }

  static async getCategoriesBySupplierId(supplierId: string): Promise<{ categoryId: string; categoryName: string }[]> {
    try {
      const response = await apiClient.get<{ categoryId: string; categoryName: string }[]>(`${this.baseUrl}/${supplierId}/categories`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error getting categories by supplier: ${supplierId}`);
      throw error;
    }
  }

  static async getCategoriesServicesBySupplierId(supplierId: string): Promise<{ categoryId: string; categoryName: string }[]> {
    try {
      const response = await apiClient.get<{ categoryId: string; categoryName: string }[]>(`${this.baseUrl}/${supplierId}/categories-services-list`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error getting service categories by supplier: ${supplierId}`);
      throw error;
    }
  }

  static async getFeaturedCategoriesBySupplierId(supplierId: string): Promise<{ categoryId: string; categoryName: string }[]> {
    try {
      const response = await apiClient.get<{ categoryId: string; categoryName: string }[]>(`${this.baseUrl}/${supplierId}/featured-categories`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error getting featured categories by supplier: ${supplierId}`);
      throw error;
    }
  }

  static async findOneByUserId(userId: number): Promise<any> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/user/${userId}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error finding supplier by user ID: ${userId}`);
      throw error;
    }
  }

  static async getUserSuppliersByUserId(userId: number): Promise<Supplier[]> {
    try {
      const response = await apiClient.get<Supplier[]>(`${this.baseUrl}/user/${userId}/suppliers`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error getting user suppliers by user ID: ${userId}`);
      throw error;
    }
  }

  static async setVerificationPending(supplierId: string): Promise<Supplier> {
    try {
      const response = await apiClient.patch<Supplier>(`${this.baseUrl}/${supplierId}/verification-pending`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error setting verification pending for supplier: ${supplierId}`);
      throw error;
    }
  }

  static async getPendingVerifications(): Promise<Supplier[]> {
    try {
      const response = await apiClient.get<Supplier[]>(`${this.baseUrl}/pending-verifications`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error getting pending verifications');
      throw error;
    }
  }

  static async setVerificationConfirmed(supplierId: string): Promise<Supplier> {
    try {
      const response = await apiClient.patch<Supplier>(`${this.baseUrl}/${supplierId}/verification-confirmed`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error setting verification confirmed for supplier: ${supplierId}`);
      throw error;
    }
  }

  static async getConfirmedVerifications(): Promise<Supplier[]> {
    try {
      const response = await apiClient.get<Supplier[]>(`${this.baseUrl}/confirmed-verifications`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error getting confirmed verifications');
      throw error;
    }
  }

  static async findAllProductsBySupplier(
    supplierId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const params = { page, limit };
      const response = await apiClient.get<{
        data: any[];
        total: number;
        page: number;
        limit: number;
      }>(`${this.baseUrl}/${supplierId}/all-products`, { params });
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error finding all products by supplier: ${supplierId}`);
      throw error;
    }
  }

  static async validateSupplier(inputData: any): Promise<any> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/validate`, inputData);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error validating supplier');
      throw error;
    }
  }

  static async createSupplierAndIdentification(
    userId: number,
    createSupplierAndIdentificationDto: CreateSupplierAndIdentificationDto
  ): Promise<{
    supplier: Supplier;
    identification: any;
  }> {
    try {
      const response = await apiClient.post<{
        supplier: Supplier;
        identification: any;
      }>(`${this.baseUrl}/${userId}/with-identification`, createSupplierAndIdentificationDto);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error creating supplier and identification');
      throw error;
    }
  }

  static async findSupplierWithIdentification(id: string): Promise<Supplier> {
    try {
      const response = await apiClient.get<Supplier>(`${this.baseUrl}/${id}/with-identification`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error finding supplier with identification: ${id}`);
      throw error;
    }
  }

  static async findAllSuppliersWithIdentification(): Promise<Supplier[]> {
    try {
      const response = await apiClient.get<Supplier[]>(`${this.baseUrl}/with-identification`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error finding all suppliers with identification');
      throw error;
    }
  }

  static async findAllMarked(): Promise<Supplier[]> {
    try {
      const response = await apiClient.get<Supplier[]>(`${this.baseUrl}/marked`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error finding all marked suppliers');
      throw error;
    }
  }

  static async findProductsByMarkedSupplierName(
    supplierName: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
    suppliers: { id: string; name: string }[];
  }> {
    try {
      const params = { page, limit };
      const response = await apiClient.get<{
        data: any[];
        total: number;
        page: number;
        limit: number;
        suppliers: { id: string; name: string }[];
      }>(`${this.baseUrl}/marked/by-name/${supplierName}/products`, { params });
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error finding products by marked supplier name: ${supplierName}`);
      throw error;
    }
  }

  static async findProductsFromMarkedSuppliers(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
    suppliers: { id: string; name: string; productsCount: number }[];
  }> {
    try {
      const params = { page, limit };
      const response = await apiClient.get<{
        data: any[];
        total: number;
        page: number;
        limit: number;
        suppliers: { id: string; name: string; productsCount: number }[];
      }>(`${this.baseUrl}/marked/products`, { params });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error finding products from marked suppliers');
      throw error;
    }
  }

  static async findProductsByMarkedSupplierId(
    supplierId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
    supplier: { id: string; name: string; marca: boolean };
    isMarked: boolean;
  }> {
    try {
      const params = { page, limit };
      const response = await apiClient.get<{
        data: any[];
        total: number;
        page: number;
        limit: number;
        supplier: { id: string; name: string; marca: boolean };
        isMarked: boolean;
      }>(`${this.baseUrl}/marked/${supplierId}/products`, { params });
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error finding products by marked supplier ID: ${supplierId}`);
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