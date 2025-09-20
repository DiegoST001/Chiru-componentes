export interface CreateQuotationRequest {
  price: number;
  comments: string;
  logisticsOrderId: string;
}

export interface Quotation {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  logisticsId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuotationResponse extends Quotation {}

export interface QuotationErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

export interface QuotationConflictError extends QuotationErrorResponse {
  message: string;
}

export interface QuotationBadRequestError extends QuotationErrorResponse {
  message: string[];
}

export interface QuotationUnauthorizedError extends QuotationErrorResponse {
  message: string;
}