import { apiClient } from '@/lib/api';
import type {
  LogisticsEntry,
  DocumentsStatusResponse,
  UpdateLogisticsDocumentsRequest,
  DocumentUrlResponse,
  ApiError,
  DocumentFieldName,
} from '../model/international-documents.model';

export class InternationalDocumentsService {
  private static baseUrl = '/logistics';

  static async getAllLogistics(): Promise<LogisticsEntry[]> {
    try {
      const response = await apiClient.get<LogisticsEntry[]>(this.baseUrl);
      return response.data;
    } catch (error: any) {
      this.handleError(error, 'Error fetching logistics entries');
    }
  }

  static async getLogisticsById(id: string): Promise<LogisticsEntry> {
    try {
      const response = await apiClient.get<LogisticsEntry>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Invalid UUID format');
      } else if (error.response?.status === 404) {
        throw new Error(`Logistics entry with id ${id} not found`);
      }
      this.handleError(error, 'Error fetching logistics entry');
    }
  }

  static async updateLogistics(id: string, data: UpdateLogisticsDocumentsRequest): Promise<LogisticsEntry> {
    try {
      const response = await apiClient.put<LogisticsEntry>(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Invalid update data or malformed UUID');
      } else if (error.response?.status === 404) {
        throw new Error(`Logistics entry with id ${id} not found`);
      }
      this.handleError(error, 'Error updating logistics entry');
    }
  }

  static async deleteLogistics(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<{ message: string }>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error(`Logistics entry with id ${id} not found`);
      }
      this.handleError(error, 'Error deleting logistics entry');
    }
  }

  static async createForSupplier(supplierId: string, data?: UpdateLogisticsDocumentsRequest): Promise<LogisticsEntry> {
    try {
      const response = await apiClient.post<LogisticsEntry>(`${this.baseUrl}/supplier/${supplierId}`, data || {});
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Malformed supplier UUID or invalid data');
      } else if (error.response?.status === 404) {
        throw new Error('Supplier not found');
      }
      this.handleError(error, 'Error creating logistics for supplier');
    }
  }

  static async getBySupplier(supplierId: string): Promise<LogisticsEntry> {
    try {
      const response = await apiClient.get<LogisticsEntry>(`${this.baseUrl}/supplier/${supplierId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Malformed supplier UUID');
      } else if (error.response?.status === 404) {
        throw new Error('No logistics found for the specified supplier');
      }
      this.handleError(error, 'Error fetching supplier logistics');
    }
  }

  static async updateSupplierDocuments(supplierId: string, data: UpdateLogisticsDocumentsRequest): Promise<{ message: string }> {
    try {
      const response = await apiClient.put<{ message: string }>(`${this.baseUrl}/supplier/${supplierId}/documents`, data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Invalid URLs or malformed supplier UUID');
      }
      this.handleError(error, 'Error updating supplier documents');
    }
  }

  static async updateDocumentField(logisticsId: string, fieldName: DocumentFieldName, documentUrl: string): Promise<{ message: string; documentUrl: string }>{
    try{
      const response = await apiClient.put<{ message: string; documentUrl: string }>(`${this.baseUrl}/${logisticsId}/document/${fieldName}`, { documentUrl });
      return response.data;
    }catch(error:any){
      if(error.response?.status === 400){
        throw new Error('Non-existent field or invalid URL');
      } else if(error.response?.status === 404){
        throw new Error('Logistics entry not found');
      }
      this.handleError(error, 'Error updating document field');
    }
  }

  static async getDocumentField(logisticsId: string, fieldName: DocumentFieldName): Promise<DocumentUrlResponse>{
    try{
      const response = await apiClient.get<DocumentUrlResponse>(`${this.baseUrl}/${logisticsId}/document/${fieldName}`);
      return response.data;
    }catch(error:any){
      if(error.response?.status === 400){
        throw new Error('Invalid document field or malformed UUID');
      } else if(error.response?.status === 404){
        throw new Error('Logistics entry not found');
      }
      this.handleError(error, 'Error fetching document field');
    }
  }

  static async deleteDocumentField(logisticsId: string, fieldName: DocumentFieldName): Promise<{ message: string }>{
    try{
      const response = await apiClient.delete<{ message: string }>(`${this.baseUrl}/${logisticsId}/document/${fieldName}`);
      return response.data;
    }catch(error:any){
      if(error.response?.status === 400){
        throw new Error('Invalid document field or malformed UUID');
      } else if(error.response?.status === 404){
        throw new Error('Logistics entry or document not found');
      }
      this.handleError(error, 'Error deleting document field');
    }
  }

  static async updateSupplierDocumentField(supplierId: string, fieldName: DocumentFieldName, documentUrl: string): Promise<{ message: string; documentUrl: string }>{
    try{
      const response = await apiClient.put<{ message: string; documentUrl: string }>(`${this.baseUrl}/supplier/${supplierId}/document/${fieldName}`, { documentUrl });
      return response.data;
    }catch(error:any){
      if(error.response?.status === 400){
        throw new Error('Non-existent field or invalid URL');
      } else if(error.response?.status === 404){
        throw new Error('Supplier not found');
      }
      this.handleError(error, 'Error updating supplier document field');
    }
  }

  static async deleteSupplierDocumentField(supplierId: string, fieldName: DocumentFieldName): Promise<{ message: string }>{
    try{
      const response = await apiClient.delete<{ message: string }>(`${this.baseUrl}/supplier/${supplierId}/document/${fieldName}`);
      return response.data;
    }catch(error:any){
      if(error.response?.status === 400){
        throw new Error('Invalid document field or malformed UUID');
      } else if(error.response?.status === 404){
        throw new Error('Supplier, logistics or document not found');
      }
      this.handleError(error, 'Error deleting supplier document field');
    }
  }

  static async getDocumentsStatus(logisticsId: string): Promise<DocumentsStatusResponse>{
    try{
      const response = await apiClient.get<DocumentsStatusResponse>(`${this.baseUrl}/${logisticsId}/documents/status`);
      return response.data;
    }catch(error:any){
      if(error.response?.status === 400){
        throw new Error('Malformed logistics UUID');
      } else if(error.response?.status === 404){
        throw new Error('Logistics entry not found');
      }
      this.handleError(error, 'Error fetching documents status');
    }
  }

  static async getSupplierDocumentsStatus(supplierId: string): Promise<DocumentsStatusResponse>{
    try{
      const response = await apiClient.get<DocumentsStatusResponse>(`${this.baseUrl}/supplier/${supplierId}/documents/status`);
      return response.data;
    }catch(error:any){
      if(error.response?.status === 400){
        throw new Error('Malformed supplier UUID');
      }
      this.handleError(error, 'Error fetching supplier documents status');
    }
  }

  private static handleError(error:any, defaultMessage:string): never{
    if(error.response?.data){
      const apiErr = error.response.data as ApiError;
      throw new Error(Array.isArray(apiErr.message) ? apiErr.message.join(', ') : apiErr.message || defaultMessage);
    }
    if(error.message) throw new Error(error.message);
    throw new Error(defaultMessage);
  }
}
