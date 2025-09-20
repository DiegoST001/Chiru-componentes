// Report Models - Frontend Implementation

export interface Report {
  id: number;
  description: string;
  type: string;
  user: User;
  supplier: Supplier;
  product: Product | null;
  status: string;
  adminResponse: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
}

export interface Supplier {
  id: string;
}

export interface Product {
  id: string;
}

export interface CreateReportDto {
  description: string;
  userId: number;
  supplierId: string;
  productId?: string;
}

export interface ReportSupplierDto {
  supplierId: string;
  productId?: string;
  description: string;
}

export interface UpdateReportDto {
  status?: string;
  adminResponse?: string;
}