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

export interface ImageSupplier {
  id: number;
  urlImage: string;
  supplier: Supplier;
}

// DTOs
export interface CreateImageSupplierDto {
  urlImage: string;
  supplierId: string;
}

export interface UpdateImageSupplierDto {
  urlImage?: string;
}