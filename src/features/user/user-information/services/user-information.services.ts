import { apiClient } from '@/lib/api';
import type {
  UserInformation,
  PaginationDto
} from '@/features/user/user-information/model/user-information.model';

export class UserInformationService {
  private static baseUrl = '/user-information';

  static async findAll(query: PaginationDto): Promise<any> {
    try {
      const response = await apiClient.get(this.baseUrl, { params: query });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error fetching user information');
      throw error;
    }
  }

  static async findOne(id: number): Promise<UserInformation> {
    try {
      const response = await apiClient.get<UserInformation>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error fetching user information with ID: ${id}`);
      throw error;
    }
  }

  static async findOneByUserId(idUser: number): Promise<UserInformation> {
    try {
      const response = await apiClient.get<UserInformation>(`${this.baseUrl}/user/${idUser}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error fetching user information for user ID: ${idUser}`);
      throw error;
    }
  }

  static async update(id: number, userInformation: UserInformation): Promise<UserInformation> {
    try {
      const response = await apiClient.patch<UserInformation>(`${this.baseUrl}/${id}`, userInformation);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error updating user information with ID: ${id}`);
      throw error;
    }
  }

  static async updateByUser(
    id: number, 
    userInformation: Partial<Omit<UserInformation, 'id' | 'user_id'>>
  ): Promise<UserInformation> {
    try {
      const response = await apiClient.patch<UserInformation>(`${this.baseUrl}/${id}/by-user`, userInformation);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error updating user information by user with ID: ${id}`);
      throw error;
    }
  }

  static async updateByUserId(userId: number, userInformation: any): Promise<UserInformation> {
    try {
      const response = await apiClient.patch<UserInformation>(`${this.baseUrl}/user-id/${userId}`, userInformation);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error updating user information by user ID: ${userId}`);
      throw error;
    }
  }

  static async remove(id: number): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<{ message: string }>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error deleting user information with ID: ${id}`);
      throw error;
    }
  }

  static async updateByUserId_infor(
    user_id: number, 
    userInformation: Partial<UserInformation>
  ): Promise<UserInformation> {
    try {
      const response = await apiClient.patch<UserInformation>(`${this.baseUrl}/update-by-user-id/${user_id}`, userInformation);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error updating user information for user ID: ${user_id}`);
      throw error;
    }
  }

  static async createOrUpdate(userInformation: any): Promise<UserInformation> {
    try {
      const response = await apiClient.post<UserInformation>(`${this.baseUrl}/create-or-update`, userInformation);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error creating or updating user information');
      throw error;
    }
  }

  static async softRemove(id: number): Promise<UserInformation> {
    try {
      const response = await apiClient.patch<UserInformation>(`${this.baseUrl}/${id}/soft-remove`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error soft removing user information with ID: ${id}`);
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