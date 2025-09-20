import { apiClient } from '@/lib/api';
import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto
} from '@/features/category/models/category.model';

export class CategoryService {
  private static baseUrl = '/categories';

  static async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const response = await apiClient.post<Category>(this.baseUrl, createCategoryDto);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error creating category');
      throw error;
    }
  }

  static async findAll(): Promise<Category[]> {
    try {
      const response = await apiClient.get<Category[]>(this.baseUrl);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error fetching categories');
      throw error;
    }
  }

  static async findOne(id: string): Promise<Category> {
    try {
      const response = await apiClient.get<Category>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error fetching category with ID: ${id}`);
      throw error;
    }
  }

  static async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    try {
      const response = await apiClient.patch<Category>(`${this.baseUrl}/${id}`, updateCategoryDto);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error updating category with ID: ${id}`);
      throw error;
    }
  }

  static async remove(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error: any) {
      this.handleError(error, `Error deleting category with ID: ${id}`);
      throw error;
    }
  }

  static async findByLevel(level: number = 0): Promise<Category[]> {
    try {
      const response = await apiClient.get<Category[]>(`${this.baseUrl}/level/${level}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error fetching categories by level: ${level}`);
      throw error;
    }
  }

  static async getCategoryTree(): Promise<Category[]> {
    try {
      const response = await apiClient.get<Category[]>(`${this.baseUrl}/tree`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error fetching category tree');
      throw error;
    }
  }

  static async findByName(
    name?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    categories: Category[];
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
        categories: Category[];
        totalPages: number;
        totalResults: number;
      }>(`${this.baseUrl}/search`, { params });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error searching categories by name');
      throw error;
    }
  }

  static async searchCategories(filters: {
    name?: string;
    hasParent?: boolean;
    hasChildren?: boolean;
    parentId?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: Category[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const response = await apiClient.get<{
        data: Category[];
        total: number;
        page: number;
        limit: number;
      }>(`${this.baseUrl}/advanced-search`, { params: filters });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error searching categories');
      throw error;
    }
  }

  static async getSimilarCategories(categoryId: string, limit: number = 5): Promise<Category[]> {
    try {
      const response = await apiClient.get<Category[]>(`${this.baseUrl}/${categoryId}/similar`, {
        params: { limit }
      });
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error fetching similar categories for: ${categoryId}`);
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