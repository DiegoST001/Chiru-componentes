import { apiClient } from '@/lib/api';
import type {
  Comment,
  CreateCommentDto,
  UpdateCommentContentDto
} from '@/features/comments/model/comments.model';

export class CommentService {
  private static baseUrl = '/comments';

  static async addCommentToRequest(commentData: {
    content: string;
    requestId: number;
    supplierId: string;
  }): Promise<Comment> {
    try {
      const response = await apiClient.post<Comment>(`${this.baseUrl}/request`, commentData);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error adding comment to request');
      throw error;
    }
  }

  static async updateComment(commentId: number, content: string): Promise<Comment> {
    try {
      const response = await apiClient.patch<Comment>(`${this.baseUrl}/${commentId}`, { content });
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error updating comment with ID: ${commentId}`);
      throw error;
    }
  }

  static async findCommentsForRequest(
    requestId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    comments: Comment[];
    totalComments: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      const params = { page, limit };
      const response = await apiClient.get<{
        comments: Comment[];
        totalComments: number;
        totalPages: number;
        currentPage: number;
      }>(`${this.baseUrl}/request/${requestId}`, { params });
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error fetching comments for request: ${requestId}`);
      throw error;
    }
  }

  static async findCommentById(commentId: number): Promise<Comment> {
    try {
      const response = await apiClient.get<Comment>(`${this.baseUrl}/${commentId}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error fetching comment with ID: ${commentId}`);
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