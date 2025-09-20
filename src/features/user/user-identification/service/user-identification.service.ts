import { apiClient } from '@/lib/api';
import type {
  UserIdentification,
  CreateUserIdentificationDto,
  UpdateUserIdentificationDto
} from '@/features/user/user-identification/model/user-identification.model';

export class UserIdentificationService {
  private static baseUrl = '/user-identification';

  static async findAll(): Promise<UserIdentification[]> {
    try {
      const response = await apiClient.get<UserIdentification[]>(this.baseUrl);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error fetching user identifications');
      throw error;
    }
  }

  static async findOne(id: number): Promise<UserIdentification> {
    try {
      const response = await apiClient.get<UserIdentification>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error fetching user identification with ID: ${id}`);
      throw error;
    }
  }

  static async create(data: CreateUserIdentificationDto): Promise<UserIdentification> {
    try {
      const response = await apiClient.post<UserIdentification>(this.baseUrl, data);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error creating user identification');
      throw error;
    }
  }

  static async update(id: number, data: UpdateUserIdentificationDto): Promise<UserIdentification> {
    try {
      const response = await apiClient.patch<UserIdentification>(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error updating user identification with ID: ${id}`);
      throw error;
    }
  }

  static async remove(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error: any) {
      this.handleError(error, `Error deleting user identification with ID: ${id}`);
      throw error;
    }
  }

  static async findDniByUser(userId: number): Promise<UserIdentification> {
    try {
      const response = await apiClient.get<UserIdentification>(`${this.baseUrl}/user/${userId}/dni`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error fetching DNI for user: ${userId}`);
      throw error;
    }
  }

  static async findByUser(userId: number): Promise<UserIdentification[]> {
    try {
      const response = await apiClient.get<UserIdentification[]>(`${this.baseUrl}/user/${userId}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error fetching identifications for user: ${userId}`);
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