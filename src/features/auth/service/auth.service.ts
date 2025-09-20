import { apiClient } from '@/lib/api';
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  AuthResetPasswordRequest,
  AuthResetPasswordResponse,
  AuthRequestResetPasswordRequest,
  AuthRequestResetPasswordResponse,
  VerifyCodeDto,
  GoogleProfileDto,
  User
} from '@/features/auth/model/auth.model';

export class AuthService {
  private static baseUrl = '/auth';

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

  static async signup(email: string, password: string, userName: string, gender: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/signup`, {
        email,
        password,
        userName,
        gender
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to signup');
      throw error;
    }
  }

  static async login(credentials: LoginRequest, ipAddress: any): Promise<LoginResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/login`, credentials, {
        headers: {
          'X-Real-IP': ipAddress
        }
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to login');
      throw error;
    }
  }

  static async logout(userId: number, accessToken: string, refreshToken: string): Promise<boolean> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/logout`, {
        userId,
        accessToken,
        refreshToken
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to logout');
      throw error;
    }
  }

  static async refresh(accessToken: string, refreshToken: string, ipAddress: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/refresh`, {
        accessToken,
        refreshToken,
        ipAddress
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to refresh token');
      throw error;
    }
  }

  static async updatePassword(id: any, password: string): Promise<User> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/update-password`, {
        id,
        password
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to update password');
      throw error;
    }
  }

  static async getByEmail(email: string): Promise<User> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/user/email/${email}`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get user by email');
      throw error;
    }
  }

  static async getByToken(token: string): Promise<User> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/user/token/${token}`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get user by token');
      throw error;
    }
  }

  static async registerTryResetPassword(user: User, token: string, date: Date): Promise<User> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/register-reset-password`, {
        user,
        token,
        date
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to register reset password');
      throw error;
    }
  }

  static async verifyCode(email: string, code: string, password: string, userName: string, gender: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/verify-code`, {
        email,
        code,
        password,
        userName,
        gender
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to verify code');
      throw error;
    }
  }

  static async loginWithGoogle(profile: GoogleProfileDto, ipAddress: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/google`, profile, {
        headers: {
          'X-Real-IP': ipAddress
        }
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to login with Google');
      throw error;
    }
  }
}