
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

export interface Certification {
  idCertification: number;
  certificationName: string;
  issueDate: Date;
  expiryDate: Date | null;
  certificationurl: string | null;
  imageUrl: string | null;
  supplier: Supplier;
}

// DTOs
export interface CreateCertificationDto {
  certificationName: string;
  issueDate: Date;
  expiryDate?: Date | null;
  certificationurl?: string;
  imageUrl?: string;
  supplierId: string;
}

export interface UpdateCertificationDto {
  certificationName?: string;
  issueDate?: Date;
  expiryDate?: Date | null;
  certificationurl?: string;
  imageUrl?: string;
  supplierId?: string;
}