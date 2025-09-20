import { apiClient } from '@/lib/api';
import type { 
  ShoppingCartResponse, 
  RemoveProductResponse,
  CartTotalResponse,
  CartAccessResponse,
  CreateCartResponse,
  AddToCartRequest,
  AddToCartResponse,
  ClearCartResponse,
  GetCartResponse
} from '../model/shopping-cart.model';

export class ShoppingCartService {
  private static baseUrl = '/shopping-cart';

  static async increaseProductQuantity(
    userId: string,
    productId: string,
    amount: string,
    price: number
  ): Promise<ShoppingCartResponse> {
    try {
      const response = await apiClient.post<ShoppingCartResponse>(
        `${this.baseUrl}/increase/${userId}/${productId}/${amount}/${price}`
      );
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error increasing product quantity in shopping cart');
      throw error;
    }
  }

  static async decreaseProductQuantity(
    userId: string,
    productId: string,
    amount: string,
    price: number
  ): Promise<ShoppingCartResponse> {
    try {
      const response = await apiClient.post<ShoppingCartResponse>(
        `${this.baseUrl}/decrease/${userId}/${productId}/${amount}/${price}`
      );
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error decreasing product quantity in shopping cart');
      throw error;
    }
  }

  static async increaseByOne(
    userId: string,
    productId: string,
    price: number
  ): Promise<ShoppingCartResponse> {
    try {
      const response = await apiClient.post<ShoppingCartResponse>(
        `${this.baseUrl}/increase/${userId}/${productId}/${price}`
      );
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error increasing product quantity by one in shopping cart');
      throw error;
    }
  }

  static async decreaseByOne(
    userId: string,
    productId: string,
    price: number
  ): Promise<ShoppingCartResponse> {
    try {
      const response = await apiClient.post<ShoppingCartResponse>(
        `${this.baseUrl}/decrease/${userId}/${productId}/${price}`
      );
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error decreasing product quantity by one in shopping cart');
      throw error;
    }
  }

  static async removeProduct(
    userId: number,
    productId: string
  ): Promise<RemoveProductResponse> {
    try {
      const response = await apiClient.delete<RemoveProductResponse>(
        `${this.baseUrl}/${userId}/remove/${productId}`
      );
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error removing product from shopping cart');
      throw error;
    }
  }

  static async getCartTotal(userId: number): Promise<CartTotalResponse> {
    try {
      const response = await apiClient.get<CartTotalResponse>(
        `${this.baseUrl}/${userId}/total`
      );
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error calculating shopping cart total');
      throw error;
    }
  }

  static async verifyCartAccess(userId: number): Promise<CartAccessResponse> {
    try {
      const response = await apiClient.get<CartAccessResponse>(
        `${this.baseUrl}/${userId}/access`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Unauthorized access to shopping cart');
      }
      this.handleError(error, 'Error verifying shopping cart access');
      throw error;
    }
  }

  static async createCart(userId: number): Promise<CreateCartResponse> {
    try {
      const response = await apiClient.post<CreateCartResponse>(
        `${this.baseUrl}/${userId}/create`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new Error('Shopping cart already exists for this user');
      }
      this.handleError(error, 'Error creating shopping cart');
      throw error;
    }
  }

  static async addToCart(
    userId: number,
    addToCartRequest: AddToCartRequest
  ): Promise<AddToCartResponse> {
    try {
      const response = await apiClient.post<AddToCartResponse>(
        `${this.baseUrl}/${userId}/add`,
        addToCartRequest
      );
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error adding product to shopping cart');
      throw error;
    }
  }

  static async clearCart(userId: number): Promise<ClearCartResponse> {
    try {
      const response = await apiClient.delete<ClearCartResponse>(
        `${this.baseUrl}/${userId}/clear`
      );
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error clearing shopping cart');
      throw error;
    }
  }

  static async getCart(userId: number): Promise<GetCartResponse> {
    try {
      const response = await apiClient.get<GetCartResponse>(
        `${this.baseUrl}/${userId}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Invalid user ID format provided');
      } else if (error.response?.status === 404) {
        throw new Error('User not found in the system');
      }
      this.handleError(error, 'Error retrieving shopping cart');
      throw error;
    }
  }

  private static handleError(error: any, defaultMessage: string): void {
    if (error.response?.status === 400) {
      throw new Error(error.response.data.message || 'Invalid parameters provided');
    } else if (error.response?.status === 404) {
      throw new Error(error.response.data.message || 'User or product not found');
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error(defaultMessage);
    }
  }



}
