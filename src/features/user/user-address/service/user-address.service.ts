import { apiClient } from '@/lib/api';
import type {
  UserAddress,
  CreateUserAddressDto,
  UpdateUserAddressDto,
  GetByUserDto,
  UserAddressResponseDto,
  Police
} from '@/features/user/user-address/model/user-address.model';

export class UserAddressService {
  private static baseUrl = '/user-address';

  static async getAllUserAddresses(query: any): Promise<any> {
    try {
      const response = await apiClient.get(this.baseUrl, { params: query });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error fetching user addresses');
      throw error;
    }
  }

  static async getUserAddressById(id: number): Promise<UserAddress> {
    try {
      const response = await apiClient.get<UserAddress>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error fetching user address with ID: ${id}`);
      throw error;
    }
  }

  static async getUserAddressByIdUser(id: number, query: any): Promise<any> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/user/${id}`, { params: query });
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error fetching addresses for user: ${id}`);
      throw error;
    }
  }

  static async findPoliceByCity(city: string): Promise<Police | null> {
    try {
      const response = await apiClient.get<Police | null>(`${this.baseUrl}/police/city/${city}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error finding police for city: ${city}`);
      throw error;
    }
  }

  static async assignPoliceToAddress(userAddress: UserAddress): Promise<UserAddress> {
    try {
      const response = await apiClient.post<UserAddress>(`${this.baseUrl}/assign-police`, userAddress);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error assigning police to address');
      throw error;
    }
  }

  static async createUserAddress(data: CreateUserAddressDto): Promise<UserAddress> {
    try {
      const response = await apiClient.post<UserAddress>(this.baseUrl, data);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error creating user address');
      throw error;
    }
  }

  static async updateUserAddress(id: number, updatedUserAddress: UpdateUserAddressDto): Promise<UserAddress> {
    try {
      const response = await apiClient.patch<UserAddress>(`${this.baseUrl}/${id}`, updatedUserAddress);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error updating user address with ID: ${id}`);
      throw error;
    }
  }

  static async deleteUserAddress(id: number): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<{ message: string }>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error deleting user address with ID: ${id}`);
      throw error;
    }
  }

  static async findAllByUser(filter: GetByUserDto): Promise<UserAddress[]> {
    try {
      const response = await apiClient.get<UserAddress[]>(`${this.baseUrl}/by-user`, { params: filter });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error fetching addresses by user');
      throw error;
    }
  }

  static async updateAllAddressesWithPolice(): Promise<{ updated: number; total: number }> {
    try {
      const response = await apiClient.post<{ updated: number; total: number }>(`${this.baseUrl}/update-police`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error updating addresses with police');
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