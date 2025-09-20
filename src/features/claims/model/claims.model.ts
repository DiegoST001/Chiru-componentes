export interface ClaimShareResponse {
  message: string;
}

export interface ClaimDeletionAudit {
  action: string;
  timestamp: string;
  userId: string;
  claimId: number;
  reason: string;
  complianceNote: string;
}

export interface DeletionNotifications {
  customerNotified: boolean;
  notificationSent: string;
  complianceReported: boolean;
}

export interface DeletedClaimInfo {
  id: number;
  claimNumber: string;
  customerName: string;
  customerEmail: string;
  status: ClaimStatus;
  deletedAt: string;
  deletedBy: string;
  archiveReference: string;
}

export interface DeleteClaimResponse {
  message: string;
  deletedClaim: DeletedClaimInfo;
  auditRecord: ClaimDeletionAudit;
  notifications: DeletionNotifications;
}

export interface ClaimErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  details?: string[];
  existingClaimId?: number;
  existingClaimNumber?: string;
}

export interface NoClaimsResponse {
  message: string;
  totalClaims: number;
  retrievedAt: string;
}

export interface ChangeHistoryEntry {
  field: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
  changedAt: string;
}

export interface ResolutionHistoryEntry {
  date: string;
  action: string;
  description: string;
  performedBy: string;
}

export interface UpdateClaimRequest {
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  description?: string;
  status?: ClaimStatus;
  request?: string;
  country?: string;
  state?: string;
  city?: string;
}

export interface UpdateClaimResponse extends ClaimDetail {
  lastUpdateBy: string;
  changeHistory: ChangeHistoryEntry[];
}

export interface ClaimDetail extends Claim {
  claimNumber: string;
  assignedTo: string;
  resolutionHistory: ResolutionHistoryEntry[];
  customerNotified: boolean;
  lastContactDate: string;
}

export interface CreateClaimRequest {
  name: string;
  fullName: string;
  email: string;
  phone: string;
  documentType: string;
  documentNumber: string;
  description: string;
  country: string;
  state: string;
  city: string;
  status: 'Pending Review';
  request: string;
}

export interface CreateClaimResponse extends Claim {
  claimNumber: string;
  customerNotified: boolean;
}

export interface ClaimNotFoundError extends ClaimErrorResponse {
  claimId: number;
  suggestions: string[];
}

export interface ClaimForbiddenError extends ClaimErrorResponse {
  requiredPermissions: string[];
}

export interface ClaimBadRequestError extends ClaimErrorResponse {
  providedId: string;
  expectedFormat: string;
}

export interface ClaimConflictError extends ClaimErrorResponse {
  claimStatus: string;
  constraints: string[];
}

export interface Claim {
  id: number;
  name: string;
  fullName: string;
  email: string;
  phone: string;
  documentType: string;
  documentNumber: string;
  description: string;
  country: string;
  state: string;
  city: string;
  status: ClaimStatus;
  request: string;
  createdAt: string;
  updatedAt: string;
  assignedAgent: string;
  estimatedResolution?: string;
  resolutionDate?: string;
}

export type ClaimStatus = 
  | 'Pendiente'    // Pending
  | 'En proceso'   // In Progress
  | 'Resuelto';    // Resolved