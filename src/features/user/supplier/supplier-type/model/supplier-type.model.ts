export interface Supplier {
  id: string;
  name: string;
  address?: string;
  supplierType?: string;
  bussinessCategory?: string;
  city?: string;
  state?: string;
  country?: string;
  website?: string;
  logo?: string;
}

export interface SupplierType {
  idType: number;
  legalStructure: string;
  businessType: string;
  size: string;
  formal: boolean;
  supplier: Supplier;
}

// DTOs
export interface CreateSupplierTypeDto {
  legalStructure?: string | null;
  businessType?: string | null;
  size?: string | null;
  formal?: boolean | null;
}

export interface UpdateSupplierTypeDto {
  legalStructure?: string;
  businessType?: string;
  size?: string;
  formal?: boolean;
}