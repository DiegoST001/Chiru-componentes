import { apiClient } from '@/lib/api';
import type {
  CreateCarouselSponsorshipDto,
  CreateSupplierSponsorshipDto,
  CreateProductSponsorshipDto,
  CreateSponsorshipContentDto,
  CreateSponsorshipWithContentDto,
  CreateSponsorshipDto,
  UpdateSponsorshipDto,
  SponsoredSupplier,
  SponsoredProduct,
  PaginatedSponsoredProducts,
  StripeSessionResponse,
  ProductSponsorshipResponse,
  Category
} from '@/features/sponsorship/model/sponsorship.model';

export class SponsorshipService {
  private static baseUrl = '/sponsorship';

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

  static async createLateralSupplierSponsorshipWithStripe(
    supplierId: string,
    startDateStr: string,
    periodDays: number,
    price: number,
    successUrl: string,
    cancelUrl: string
  ): Promise<StripeSessionResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/lateral-supplier-stripe`, {
        supplierId,
        startDateStr,
        periodDays,
        price,
        successUrl,
        cancelUrl
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to create lateral supplier sponsorship with Stripe');
      throw error;
    }
  }

  static async centralSponsor(): Promise<Category[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/central-categories`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get central sponsor categories');
      throw error;
    }
  }

  static async createProductSponsorshipWithStripe(
    productId: string,
    startDateStr: string,
    periodDays: number,
    price: number,
    successUrl: string,
    cancelUrl: string
  ): Promise<ProductSponsorshipResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/product-stripe`, {
        productId,
        startDateStr,
        periodDays,
        price,
        successUrl,
        cancelUrl
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to create product sponsorship with Stripe');
      throw error;
    }
  }

  static async getSponsoredSuppliers(): Promise<SponsoredSupplier[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/suppliers`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get sponsored suppliers');
      throw error;
    }
  }

  static async getSponsoredProductsList(categoryId?: string): Promise<SponsoredProduct[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/sponsored-products-list`, {
        params: categoryId ? { categoryId } : {}
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get sponsored products list');
      throw error;
    }
  }

  static async getSponsoredProducts(categoryId?: string): Promise<SponsoredProduct[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/sponsored-products`, {
        params: categoryId ? { categoryId } : {}
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get sponsored products');
      throw error;
    }
  }

  static async getSponsoredProductsBySupplier(
    supplierId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedSponsoredProducts> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/sponsored-products-by-supplier`, {
        params: { supplierId, page, limit }
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get sponsored products by supplier');
      throw error;
    }
  }
}