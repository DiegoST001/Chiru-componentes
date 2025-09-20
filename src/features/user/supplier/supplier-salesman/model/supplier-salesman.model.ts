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

export interface SupplierContact {
  id: number;
  name: string;
  lastName: string | null;
  email: string | null;
  contactPhone: string | null;
  address: string | null;
  country: string | null;
  image: string | null;
  supplier: Supplier;
  createdAt: Date;
  updatedAt: Date;
}

// DTOs
export interface CreateSupplierContactDto {
  name: string;
  lastName?: string | null;
  email?: string | null;
  contactPhone?: string | null;
  address?: string | null;
  country?: string | null;
  image?: string | null;
  user: number;
  supplierId?: string;
}

export interface UpdateSupplierContactDto {
  name?: string;
  lastName?: string | null;
  email?: string | null;
  contactPhone?: string | null;
  address?: string | null;
  country?: string | null;
  image?: string | null;
  user?: number;
  supplierId?: string;
}