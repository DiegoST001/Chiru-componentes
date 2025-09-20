import { apiClient } from '@/lib/api';
import type {
  User,
  CreateUserDto,
  ProfileUserDto,
  UserFilterRequest,
  UserInformationRequest,
  ResetPasswordRequest,
  ResetMyPasswordRequest,
  ResetPasswordResponse,
  UserInformation
} from '@/features/user/model/user.model';

export class UserService {
  private static baseUrl = '/users';

  static async findAll(query: any): Promise<any> {
    try {
      const response = await apiClient.get(this.baseUrl, { params: query });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error fetching users');
      throw error;
    }
  }

  static async getAllUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get<User[]>(`${this.baseUrl}/all`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error fetching all users');
      throw error;
    }
  }

  static async getUserById(id: number): Promise<User> {
    try {
      const response = await apiClient.get<User>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error fetching user with ID: ${id}`);
      throw error;
    }
  }

  static async updateUser(id: number, updatedUser: any): Promise<User> {
    try {
      const response = await apiClient.patch<User>(`${this.baseUrl}/${id}`, updatedUser);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error updating user with ID: ${id}`);
      throw error;
    }
  }

  static async updateUserProfile(id: number, updatedUser: ProfileUserDto): Promise<User> {
    try {
      const response = await apiClient.patch<User>(`${this.baseUrl}/${id}/profile`, updatedUser);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error updating user profile with ID: ${id}`);
      throw error;
    }
  }

  static async updateUserVisibility(id: number, data: { isActive: number }): Promise<any> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${id}/visibility`, data);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error updating user visibility with ID: ${id}`);
      throw error;
    }
  }

  static async deleteUser(id: number): Promise<User> {
    try {
      const response = await apiClient.delete<User>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error deleting user with ID: ${id}`);
      throw error;
    }
  }

  static async createUser(data: CreateUserDto): Promise<User> {
    try {
      const response = await apiClient.post<User>(this.baseUrl, data);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error creating user');
      throw error;
    }
  }

  static async get(id: number): Promise<User> {
    try {
      const response = await apiClient.get<User>(`${this.baseUrl}/get/${id}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error getting user with ID: ${id}`);
      throw error;
    }
  }

  static async getByEmail(email: string): Promise<User> {
    try {
      const response = await apiClient.get<User>(`${this.baseUrl}/email/${email}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error getting user with email: ${email}`);
      throw error;
    }
  }

  static async getUserInformationById(userInformationId: number): Promise<UserInformation> {
    try {
      const response = await apiClient.get<UserInformation>(`${this.baseUrl}/information/${userInformationId}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error getting user information with ID: ${userInformationId}`);
      throw error;
    }
  }

  static async getByToken(token: string): Promise<User> {
    try {
      const response = await apiClient.get<User>(`${this.baseUrl}/token/${token}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error getting user by token');
      throw error;
    }
  }

  static async registerTryResetPassword(user: User, token: string, date: string): Promise<User> {
    try {
      const response = await apiClient.post<User>(`${this.baseUrl}/reset-password-register`, {
        user,
        token,
        date
      });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error registering password reset');
      throw error;
    }
  }

  static async updatePassword(id: number, password: string): Promise<User> {
    try {
      const response = await apiClient.patch<User>(`${this.baseUrl}/${id}/password`, { password });
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error updating password for user with ID: ${id}`);
      throw error;
    }
  }

  static async abbreviateField(fieldValue: string, spaceLettersLimit: number = 3): Promise<string> {
    try {
      const response = await apiClient.post<string>(`${this.baseUrl}/abbreviate`, {
        fieldValue,
        spaceLettersLimit
      });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error abbreviating field');
      throw error;
    }
  }

  static async findAllList(filter: UserFilterRequest): Promise<User[]> {
    try {
      const response = await apiClient.get<User[]>(`${this.baseUrl}/list`, { params: filter });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error fetching user list');
      throw error;
    }
  }

  static async validateAndUpdateUserRole(id: number): Promise<any> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${id}/validate-role`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error validating and updating user role with ID: ${id}`);
      throw error;
    }
  }

  static async getUserWithSuppliersById(id: number): Promise<User> {
    try {
      const response = await apiClient.get<User>(`${this.baseUrl}/${id}/suppliers`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error getting user with suppliers for ID: ${id}`);
      throw error;
    }
  }

  static async getMySuppliers(tokenString: string): Promise<{ userId: number }> {
    try {
      const response = await apiClient.get<{ userId: number }>(`${this.baseUrl}/my-suppliers`, {
        headers: {
          Authorization: tokenString
        }
      });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error getting my suppliers');
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