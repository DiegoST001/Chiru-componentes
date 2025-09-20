import { apiClient } from '@/lib/api';
import type { 
  ClaimShareResponse, 
  Claim, 
  NoClaimsResponse,
  CreateClaimRequest,
  CreateClaimResponse,
  ClaimDetail,
  ClaimNotFoundError,
  ClaimForbiddenError,
  ClaimBadRequestError,
  UpdateClaimRequest,
  UpdateClaimResponse,
  DeleteClaimResponse,
  ClaimConflictError
} from '../model/claims.model';

export class ClaimsService {
  private static baseUrl = '/claims';

  static async getClaims(): Promise<Claim[] | NoClaimsResponse> {
    try {
      const response = await apiClient.get<Claim[]>(this.baseUrl);
      
      // If the response is empty, return the NoClaimsResponse format
      if (!response.data || response.data.length === 0) {
        return {
          message: 'No claims found in the system',
          totalClaims: 0,
          retrievedAt: new Date().toISOString()
        };
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Invalid request parameters');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication credentials were missing or incorrect');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to access claims information');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('An unexpected error occurred while fetching claims');
      }
    }
  }

  static async getClaimById(id: number): Promise<ClaimDetail> {
    try {
      const response = await apiClient.get<ClaimDetail>(
        `${this.baseUrl}/${id}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        const badRequestError = error.response.data as ClaimBadRequestError;
        throw new Error(
          `Invalid claim ID format: ${badRequestError.providedId}. Expected: ${badRequestError.expectedFormat}`
        );
      } else if (error.response?.status === 401) {
        throw new Error('Authentication credentials were missing or incorrect');
      } else if (error.response?.status === 403) {
        const forbiddenError = error.response.data as ClaimForbiddenError;
        const permissions = forbiddenError.requiredPermissions.join(', ');
        throw new Error(
          `Insufficient permissions. Required: ${permissions}`
        );
      } else if (error.response?.status === 404) {
        const notFoundError = error.response.data as ClaimNotFoundError;
        const suggestions = notFoundError.suggestions.join('; ');
        throw new Error(
          `Claim with ID ${notFoundError.claimId} not found. Suggestions: ${suggestions}`
        );
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('An unexpected error occurred while retrieving the claim');
      }
    }
  }

  static async updateClaim(
    id: number,
    updateData: UpdateClaimRequest
  ): Promise<UpdateClaimResponse> {
    try {
      const response = await apiClient.patch<UpdateClaimResponse>(
        `${this.baseUrl}/${id}`,
        updateData
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        const errors = error.response.data.errors;
        throw new Error(
          `Invalid update data: ${errors ? errors.join(', ') : 'Please check your input'}`
        );
      } else if (error.response?.status === 401) {
        throw new Error('Authentication credentials were missing or incorrect');
      } else if (error.response?.status === 403) {
        const forbiddenError = error.response.data as ClaimForbiddenError;
        const permissions = forbiddenError.requiredPermissions.join(', ');
        throw new Error(
          `Insufficient permissions to update claim. Required: ${permissions}`
        );
      } else if (error.response?.status === 404) {
        const notFoundError = error.response.data as ClaimNotFoundError;
        const suggestions = notFoundError.suggestions.join('; ');
        throw new Error(
          `Claim with ID ${notFoundError.claimId} was not found and cannot be updated. Suggestions: ${suggestions}`
        );
      } else if (error.response?.status === 422) {
        const validationErrors = error.response.data.details;
        throw new Error(
          `Validation failed: ${validationErrors ? validationErrors.join(', ') : 'Unable to process update'}`
        );
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('An unexpected error occurred while updating the claim');
      }
    }
  }

  static async deleteClaim(id: number): Promise<DeleteClaimResponse> {
    try {
      const response = await apiClient.delete<DeleteClaimResponse>(
        `${this.baseUrl}/${id}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        const badRequestError = error.response.data as ClaimBadRequestError;
        throw new Error(
          `Invalid claim ID format: ${badRequestError.providedId}. Expected: ${badRequestError.expectedFormat}`
        );
      } else if (error.response?.status === 401) {
        throw new Error('Authentication credentials were missing or incorrect');
      } else if (error.response?.status === 403) {
        const forbiddenError = error.response.data as ClaimForbiddenError;
        const requiredPerms = forbiddenError.requiredPermissions.join(', ');
        const userPerms = (error.response.data as any).userPermissions?.join(', ') || 'none';
        throw new Error(
          `Insufficient permissions to delete claim. Required: [${requiredPerms}], Current: [${userPerms}]`
        );
      } else if (error.response?.status === 404) {
        const notFoundError = error.response.data as ClaimNotFoundError;
        const suggestions = notFoundError.suggestions.join('; ');
        throw new Error(
          `Claim with ID ${notFoundError.claimId} was not found and cannot be deleted. Suggestions: ${suggestions}`
        );
      } else if (error.response?.status === 409) {
        const conflictError = error.response.data as ClaimConflictError;
        const constraints = conflictError.constraints.join('; ');
        throw new Error(
          `Cannot delete claim in status "${conflictError.claimStatus}". Constraints: ${constraints}`
        );
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('An unexpected error occurred while deleting the claim');
      }
    }
  }

  static async createClaim(claimData: CreateClaimRequest): Promise<CreateClaimResponse> {
    try {
      const response = await apiClient.post<CreateClaimResponse>(
        this.baseUrl,
        claimData
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        const errorMessage = error.response.data.errors 
          ? `Invalid claim data: ${error.response.data.errors.join(', ')}`
          : 'Invalid claim data provided';
        throw new Error(errorMessage);
      } else if (error.response?.status === 401) {
        throw new Error('Authentication credentials were missing or incorrect');
      } else if (error.response?.status === 409) {
        const existingClaim = error.response.data.existingClaimNumber
          ? ` (Existing claim number: ${error.response.data.existingClaimNumber})`
          : '';
        throw new Error(`A similar claim has already been submitted${existingClaim}`);
      } else if (error.response?.status === 422) {
        const validationErrors = error.response.data.details
          ? `Validation failed: ${error.response.data.details.join(', ')}`
          : 'Claim data validation failed';
        throw new Error(validationErrors);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('An unexpected error occurred while creating the claim');
      }
    }
  }

  static async shareClaim(claimId: number): Promise<ClaimShareResponse> {
    try {
      const response = await apiClient.post<ClaimShareResponse>(
        `${this.baseUrl}/share/${claimId}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Invalid claim ID provided');
      } else if (error.response?.status === 401) {
        throw new Error(error.response.data.message || 'Authentication required to share claim');
      } else if (error.response?.status === 404) {
        throw new Error(error.response.data.message || 'No claim found with the provided ID');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('An unexpected error occurred while sharing the claim');
      }
    }
  }
}