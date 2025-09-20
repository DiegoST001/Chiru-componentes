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

export interface SupplierIdentification {
  id: number;
  type: string;
  value: string;
  countrycode: string;
  issueddate: Date;
  expirationdate: Date;
  information: Record<string, any> | null;
  supplier: Supplier;
}

// DTOs
export interface CreateSupplierIdentificationDto {
  value: string;
  countrycode: string;
  issueddate: string;
  expirationdate: string;
  supplierId: string;
}

export interface UpdateSupplierIdentificationDto {
  value?: string;
  countrycode?: string;
  issueddate?: string;
  expirationdate?: string;
  type?: string;
}