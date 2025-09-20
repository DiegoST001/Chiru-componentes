import { apiClient } from '@/lib/api';

export class NodemailerService {
  private static baseUrl = '/email';

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

  static async sendEmail(
    to: string,
    subject: string,
    templateName: string,
    context: any
  ): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/send`, {
        to,
        subject,
        templateName,
        context
      });
    } catch (error) {
      this.handleError(error, 'Failed to send email');
      throw error;
    }
  }
}