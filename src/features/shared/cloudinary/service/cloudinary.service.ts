import { apiClient } from '@/lib/api';
import type {
  CloudinaryUploadResponse,
  CloudinarySignatureResponse
} from '@/features/shared/cloudinary/model/cloudinary.model';

export class CloudinaryService {
  private static baseUrl = '/cloudinary';

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

  static async generateSignature(publicId: string): Promise<CloudinarySignatureResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/signature`, { publicId });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to generate signature');
      throw error;
    }
  }

  static async deleteFile(publicId: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/file/${publicId}`);
    } catch (error) {
      this.handleError(error, 'Failed to delete file');
      throw error;
    }
  }

  static async uploadFile(file: File, folder: string = 'uploads'): Promise<CloudinaryUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await apiClient.post(`${this.baseUrl}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to upload file');
      throw error;
    }
  }
}