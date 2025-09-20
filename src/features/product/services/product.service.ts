import { apiClient } from '@/lib/api';
import type {
  Product,
  CreateProductDto,
  UpdateProductDto,
  ProductFilterDto,
  ProductPaginationDto,
  RateProductDto,
  ShareProductDto,
  PaginatedProducts
} from '@/features/product/models/product.model';

export class ProductService {
  private static baseUrl = '/products';

  static async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const response = await apiClient.post<Product>(this.baseUrl, createProductDto);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error creating product');
      throw error;
    }
  }

  static async findOne(id: string): Promise<Product> {
    try {
      const response = await apiClient.get<Product>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error fetching product with ID: ${id}`);
      throw error;
    }
  }

  static async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    try {
      const response = await apiClient.patch<Product>(`${this.baseUrl}/${id}`, updateProductDto);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error updating product with ID: ${id}`);
      throw error;
    }
  }

  static async remove(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error: any) {
      this.handleError(error, `Error deleting product with ID: ${id}`);
      throw error;
    }
  }

  static async toggleFreeShipping(id: string, isFreeShipping: boolean): Promise<Product> {
    try {
      const response = await apiClient.patch<Product>(`${this.baseUrl}/${id}/free-shipping`, { isFreeShipping });
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error toggling free shipping for product: ${id}`);
      throw error;
    }
  }

  static async shareProductByEmail(email: string, productUrl: string, message: string): Promise<string> {
    try {
      const response = await apiClient.post<string>(`${this.baseUrl}/share-email`, {
        email,
        productUrl,
        message
      });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error sharing product by email');
      throw error;
    }
  }

  static async findAll(query: ProductPaginationDto): Promise<PaginatedProducts> {
    try {
      const response = await apiClient.get<PaginatedProducts>(this.baseUrl, { params: query });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error fetching products');
      throw error;
    }
  }

  static async findByCategoryId(categoryId: string): Promise<Product[]> {
    try {
      const response = await apiClient.get<Product[]>(`${this.baseUrl}/category/${categoryId}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error fetching products for category: ${categoryId}`);
      throw error;
    }
  }

  static async findByFilters(
    filters: ProductFilterDto,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC'
  ): Promise<{
    products: Product[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }> {
    try {
      const params = {
        ...filters,
        page,
        limit,
        sortBy,
        sortOrder
      };

      const response = await apiClient.get<{
        products: Product[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalItems: number;
          itemsPerPage: number;
        };
      }>(`${this.baseUrl}/filters`, { params });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error fetching products by filters');
      throw error;
    }
  }

  static async getSimilarProducts(productId: string): Promise<Product[]> {
    try {
      const response = await apiClient.get<Product[]>(`${this.baseUrl}/${productId}/similar`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error fetching similar products for: ${productId}`);
      throw error;
    }
  }

  static async getFeaturedProducts(): Promise<Product[]> {
    try {
      const response = await apiClient.get<Product[]>(`${this.baseUrl}/featured`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error fetching featured products');
      throw error;
    }
  }

  static async findByName(
    name?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    products: Product[];
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
        products: Product[];
        totalPages: number;
        totalResults: number;
      }>(`${this.baseUrl}/search`, { params });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error searching products by name');
      throw error;
    }
  }

  static async getTopMostSoldProducts(): Promise<Product[]> {
    try {
      const response = await apiClient.get<Product[]>(`${this.baseUrl}/top-sold`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error fetching top most sold products');
      throw error;
    }
  }

  static async saveImagesForProduct(productData: {
    productId: string;
    images: string[];
  }): Promise<{ message: string; savedImages: any[] }> {
    try {
      const response = await apiClient.post<{ message: string; savedImages: any[] }>(
        `${this.baseUrl}/images`, 
        productData
      );
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error saving images for product');
      throw error;
    }
  }

  static async deleteImage(imageId: number): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<{ message: string }>(`${this.baseUrl}/images/${imageId}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error deleting image');
      throw error;
    }
  }

  static async findRecentProductsByCompany(companyId: string): Promise<Product[]> {
    try {
      const response = await apiClient.get<Product[]>(`${this.baseUrl}/company/${companyId}/recent`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error fetching recent products for company: ${companyId}`);
      throw error;
    }
  }

  static async getTopSoldProductsByCompany(companyIdOrName: string): Promise<{
    id: string;
    name: string;
    totalSold: number;
  }[]> {
    try {
      const response = await apiClient.get<{
        id: string;
        name: string;
        totalSold: number;
      }[]>(`${this.baseUrl}/company/${companyIdOrName}/top-sold`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error fetching top sold products for company: ${companyIdOrName}`);
      throw error;
    }
  }

  static async rateProduct(userId: number, rateProductDto: RateProductDto): Promise<any> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/rate`, {
        userId,
        ...rateProductDto
      });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error rating product');
      throw error;
    }
  }

  static async getProductRatings(productId: string): Promise<{
    user: number;
    rating: number;
    comment?: string;
  }[]> {
    try {
      const response = await apiClient.get<{
        user: number;
        rating: number;
        comment?: string;
      }[]>(`${this.baseUrl}/${productId}/ratings`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error fetching ratings for product: ${productId}`);
      throw error;
    }
  }

  static async getProductRatingSummary(productId: string): Promise<{
    productId: string;
    totalRatings: number;
    averageRating: number;
    ratingDistribution: Record<number, number>;
  }> {
    try {
      const response = await apiClient.get<{
        productId: string;
        totalRatings: number;
        averageRating: number;
        ratingDistribution: Record<number, number>;
      }>(`${this.baseUrl}/${productId}/rating-summary`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error fetching rating summary for product: ${productId}`);
      throw error;
    }
  }

  static async getCompanyRatingSummary(companyId: string): Promise<{
    companyId: string;
    totalProductsRated: number;
    companyRating: number;
    products: {
      productId: string;
      productName: string;
      totalRatings: number;
      averageRating: number;
      ratingDistribution: Record<number, number>;
    }[];
  }> {
    try {
      const response = await apiClient.get<{
        companyId: string;
        totalProductsRated: number;
        companyRating: number;
        products: {
          productId: string;
          productName: string;
          totalRatings: number;
          averageRating: number;
          ratingDistribution: Record<number, number>;
        }[];
      }>(`${this.baseUrl}/company/${companyId}/rating-summary`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error fetching rating summary for company: ${companyId}`);
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