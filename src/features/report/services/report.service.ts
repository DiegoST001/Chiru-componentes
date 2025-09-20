import { apiClient } from '@/lib/api';
import type {
  Report,
  CreateReportDto,
  ReportSupplierDto,
  UpdateReportDto
} from '@/features/report/model/report.model';

export class ReportService {
  private static baseUrl = '/reports';

  static async createReport(createReportDto: CreateReportDto): Promise<Report> {
    try {
      const response = await apiClient.post<Report>(this.baseUrl, createReportDto);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error creating report');
      throw error;
    }
  }

  static async checkIfReported(userId: number, productId: string): Promise<boolean> {
    try {
      const response = await apiClient.get<boolean>(`${this.baseUrl}/check-reported`, {
        params: { userId, productId }
      });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error checking if reported');
      throw error;
    }
  }

  static async checkIfSupplierReported(userId: number, supplierId: string): Promise<boolean> {
    try {
      const response = await apiClient.get<boolean>(`${this.baseUrl}/check-supplier-reported`, {
        params: { userId, supplierId }
      });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error checking if supplier reported');
      throw error;
    }
  }

  static async updateReport(id: number, updateReportDto: UpdateReportDto): Promise<Report> {
    try {
      const response = await apiClient.patch<Report>(`${this.baseUrl}/${id}`, updateReportDto);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error updating report with ID: ${id}`);
      throw error;
    }
  }

  static async getAllReports(): Promise<Report[]> {
    try {
      const response = await apiClient.get<Report[]>(this.baseUrl);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error fetching all reports');
      throw error;
    }
  }

  static async getReportsByUser(userId: number): Promise<Report[]> {
    try {
      const response = await apiClient.get<Report[]>(`${this.baseUrl}/user/${userId}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error, `Error fetching reports for user: ${userId}`);
      throw error;
    }
  }

  static async reportSupplier(userId: number, reportSupplierDto: ReportSupplierDto): Promise<Report> {
    try {
      const response = await apiClient.post<Report>(`${this.baseUrl}/supplier`, {
        userId,
        ...reportSupplierDto
      });
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error reporting supplier');
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