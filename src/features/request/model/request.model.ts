
export interface User {
  id: number;
  email: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
}

export interface RequestResponse {
  id: number;
  formalResponse: string;
  estimatedPrice: number;
  currency: string;
  additionalNotes: string;
  status: string;
  estimatedDeliveryDays: number;
  createdAt: Date;
  updatedAt: Date;
  request: Request;
  supplier: Supplier;
}

export interface Request {
  id: number;
  productName: string;
  quantity: number;
  commercialTerms: string;
  targetUnitPrice: number;
  maxBudget: number;
  details: string;
  shippingMethod: string;
  waitingTime: number;
  paymentTerms: string;
  place: string;
  currency: string;
  status: string;
  image: string[];
  createdAt: Date;
  updatedAt: Date;
  category: Category;
  user: User;
  comments: Comment[];
  responses: RequestResponse[];
}

// DTOs
export interface CreateRequestResponseDto {
  formalResponse: string;
  estimatedPrice: number;
  currency?: string;
  additionalNotes?: string;
  estimatedDeliveryDays?: number;
  requestId: number;
  supplierId?: string;
}

export interface CreateRequestDto {
  productName: string;
  quantity: number;
  commercialTerms: string;
  targetUnitPrice: number;
  maxBudget: number;
  details: string;
  shippingMethod: string;
  waitingTime: number;
  paymentTerms: string;
  categoryId: string;
  place?: string;
  currency?: string;
  status?: string;
  image?: string[];
  userId?: number;
}

export interface UpdateRequestResponseDto {
  formalResponse?: string;
  estimatedPrice?: number;
  currency?: string;
  additionalNotes?: string;
  estimatedDeliveryDays?: number;
  status?: string;
}

export interface UpdateRequestDto {
  productName?: string;
  quantity?: number;
  commercialTerms?: string;
  targetUnitPrice?: number;
  maxBudget?: number;
  details?: string;
  shippingMethod?: string;
  waitingTime?: number;
  paymentTerms?: string;
  userId?: number;
  categoryId?: string;
  place?: string;
  currency?: string;
  status?: string;
  image?: string[];
}

// Response types
export interface ResponseStats {
  totalResponses: number;
  pendingResponses: number;
  acceptedResponses: number;
  rejectedResponses: number;
}