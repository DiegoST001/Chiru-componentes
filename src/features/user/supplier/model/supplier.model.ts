// Supplier Models - Frontend Implementation

export interface Supplier {
  id: string;
  name: string | null;
  address: string | null;
  bussinessCategory: string | null;
  city: string | null;
  state: string | null;
  promotions: SupplierPromotion[];
  country: string | null;
  postalCode: string | null;
  website: string | null;
  yearsOfExperience: string | null;
  verificationStatus: string | null;
  logo: string | null;
  commercialCapacity: string | null;
  productionCapacity: string | null;
  marca: boolean | null;
  user: User[];
  supplierPerfil: string | null;
  suppliernumber: string | null;
  socialmedia: Record<string, any> | null;
  certifications: Certification[];
  images: SupplierImage[];
  types: SupplierType[];
  supplierContact: SupplierContact | null;
  sponsorshipContents: SponsorshipContent[];
  sponsorshipPayments: SponsorshipPayment[];
  supplierService: Service[];
  identification: SupplierIdentification | null;
  logistics: Logistics | null;
}

export interface SupplierPromotion {
  id: string;
}

export interface User {
  id: number;
}

export interface Certification {
  id: string;
}

export interface SupplierImage {
  id: string;
}

export interface SupplierType {
  id: string;
}

export interface SupplierContact {
  id: string;
}

export interface SponsorshipContent {
  id: string;
}

export interface SponsorshipPayment {
  id: string;
}

export interface Service {
  id: number;
}

export interface SupplierIdentification {
  id: string;
}

export interface Logistics {
  id: string;
}

export interface CreateSupplierDto {
  name: string;
  address?: string;
  supplierType?: string;
  bussinessCategory?: string;
  city?: string;
  state?: string;
  isSponsor?: boolean;
  country?: string;
  postalCode?: string;
  website?: string;
  yearsOfExperience?: string;
  verificationStatus?: string;
  logo?: string;
  commercialCapacity?: string;
  productionCapacity?: string;
  supplierPerfil?: string;
  suppliernumber?: string;
  socialmedia?: Record<string, any>;
  marca?: boolean;
}

export interface UpdateSupplierDto {
  name?: string;
  address?: string;
  supplierType?: string;
  bussinessCategory?: string;
  city?: string;
  state?: string;
  isSponsor?: boolean;
  country?: string;
  postalCode?: string;
  website?: string;
  yearsOfExperience?: string;
  verificationStatus?: string;
  logo?: string;
  commercialCapacity?: string;
  productionCapacity?: string;
  supplierPerfil?: string;
  suppliernumber?: string;
  socialmedia?: Record<string, any>;
  marca?: boolean;
}

export interface CreateSupplierAndIdentificationDto {
  name: string;
  address?: string;
  bussinessCategory?: string;
  city?: string;
  state?: string;
  isSponsor?: boolean;
  country?: string;
  postalCode?: string;
  website?: string;
  yearsOfExperience?: string;
  verificationStatus?: string;
  logo?: string;
  commercialCapacity?: string;
  productionCapacity?: string;
  supplierPerfil?: string;
  suppliernumber?: string;
  socialmedia?: Record<string, any>;
  marca?: boolean;
  identificationValue: string;
  countrycode: string;
  issueddate?: string;
  expirationdate?: string;
}

export interface UpdateSocialMediaDto {
  socialmedia: Record<string, any>;
}