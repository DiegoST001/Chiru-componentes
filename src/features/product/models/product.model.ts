export interface User {
  id: number;
  email: string;
  lastLoginDate?: Date;
  isVisible?: number;
  isActive?: number;
  createdAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  address?: string;
  supplierType?: string;
  bussinessCategory?: string;
  city?: string;
  state?: string;
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
  isVisible?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  parent?: Category;
  children?: Category[];
  created_at: Date;
  updated_at: Date;
}

export interface ProductImage {
  idImageProduct: number;
  urlImage: string;
  product: Product;
}

export interface ProductRating {
  id: number;
  user: User;
  product: Product;
  rating: number;
  comment?: string;
}

export interface ProductPromotion {
  id: string;
  product: Product;
  valveSource: string;
  isSponsored: number;
  periodDays: number;
  sponsorStart: Date | null;
  sponsorPrice: number;
  sponsorEnd: Date | null;
  stripeSessionId: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price?: Record<string, any>;
  isFeatured: number;
  soldCount: number;
  stock: number;
  details?: Record<string, any>;
  basicInfo?: Record<string, any>;
  specifications?: string;
  productStatus: string;
  createdAt: Date;
  updatedAt: Date;
  supplier: Supplier;
  category: Category;
  images: ProductImage[];
  ratings: ProductRating[];
  promotions: ProductPromotion[];
}

// DTOs
export interface CreateProductDto {
  name: string;
  description: string;
  price?: Record<string, any>;
  isFeatured: number;
  soldCount: number;
  categoryId?: string;
  stock: number;
  details?: Record<string, any>;
  basicInfo?: Record<string, any>;
  specifications?: string;
  productStatus: string;
  companyId: string;
}

export interface ProductFilterDto {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  stock?: number;
  minAmount?: number;
  maxAmount?: number;
}

export interface ProductPaginationDto {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
}

export interface RateProductDto {
  productId: string;
  rating: number;
  comment?: string;
}

export interface ShareProductDto {
  channel: 'email' | 'social';
  email?: string;
  productUrl: string;
  message?: string;
}

// Response types
export interface PaginatedProducts {
  data: Product[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy: string[][];
    searchBy: string[];
    search: string;
    filter?: Record<string, any>;
  };
  links: {
    first?: string;
    previous?: string;
    current: string;
    next?: string;
    last?: string;
  };
}