// Service Models - Frontend Implementation

export interface Service {
  id: number;
  name: string;
  description: string;
  objective?: string;
  serviceCategory: Category;
  price?: number;
  currency?: string;
  estimatedDuration?: string;
  supplier: Supplier;
  images: ServiceImage[];
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  user?: {
    userInformation?: {
      contactName?: string;
      contactEmail?: string;
      contactPhone?: string;
    };
  };
}

export interface Category {
  id: string;
  name: string;
}

export interface ServiceImage {
  idImageService: number;
  urlImage: string;
}

export interface CreateServiceDto {
  name: string;
  description: string;
  objective?: string;
  serviceCategory: string;
  price?: number;
  currency?: string;
  estimatedDuration?: string;
  supplierId: string;
}

export interface UpdateServiceDto {
  name?: string;
  serviceCategory?: string;
  description?: string;
  objective?: string;
  price?: number;
  currency?: string;
  estimatedDuration?: string;
  supplierId?: string;
}