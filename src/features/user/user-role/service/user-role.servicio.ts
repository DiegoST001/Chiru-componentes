import { apiClient } from '@/lib/api';
import type {
  UserRole,
  CreateUserRoleDto,
  UpdateUserRoleDto
} from '@/features/user/user-role/model/user-role.model';

export class UserRoleService {
  private static baseUrl = '/user-role';

  static async create(createUserRoleDto: CreateUserRoleDto): Promise<{
    status: number;
    data: UserRole | null;
    message: string;
    errors: string | null;
  }> {
    try {
      const response = await apiClient.post<{
        status: number;
        data: UserRole | null;
        message: string;
        errors: string | null;
      }>(this.baseUrl, createUserRoleDto);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error creating user role');
      throw error;
    }
  }

  static async findAll(): Promise<{
    status: number;
    data: UserRole[] | null;
    message: string;
    errors: string | null;
  }> {
    try {
      const response = await apiClient.get<{
        status: number;
        data: UserRole[] | null;
        message: string;
        errors: string | null;
      }>(this.baseUrl);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error fetching user roles');
      throw error;
    }
  }

  static async findOne(id: number): Promise<{
    status: number;
    data: UserRole | null;
    message: string;
    errors: string | null;
  }> {
    try {
      const response = await apiClient.get<{
        status: number;
        data: UserRole | null;
        message: string;
        errors: string | null;
      }>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error fetching user role with ID: ${id}`);
      throw error;
    }
  }

  static async update(id: number, updateUserRoleDto: UpdateUserRoleDto): Promise<{
    status: number;
    data: any;
    message: string;
    errors: string | null;
  }> {
    try {
      const response = await apiClient.patch<{
        status: number;
        data: any;
        message: string;
        errors: string | null;
      }>(`${this.baseUrl}/${id}`, updateUserRoleDto);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error updating user role with ID: ${id}`);
      throw error;
    }
  }

  static async remove(id: number): Promise<{
    status: number;
    data: any;
    message: string;
    errors: string | null;
  }> {
    try {
      const response = await apiClient.delete<{
        status: number;
        data: any;
        message: string;
        errors: string | null;
      }>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error deleting user role with ID: ${id}`);
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