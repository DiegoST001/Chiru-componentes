export interface SponsorshipContent {
  id: number;
  sponsorship: Sponsorship;
  contentType: string;
  contentId: string;
}

export interface Sponsorship {
  id: number;
  type: 'lateral_panel' | 'carousel' | 'other';
  description?: string;
  status: boolean;
  sponsorshipContents: SponsorshipContent[];
}

export interface Category {
  id: string;
  name: string;
  image?: string;
  parent?: Category;
  children?: Category[];
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  images?: any[];
  supplier: any;
}

export interface Supplier {
  id: string;
  name: string;
  logo?: string;
}

// DTOs
export interface CreateCarouselSponsorshipDto {
  type: 'lateral_panel' | 'carousel' | 'other';
  description?: string;
  status: boolean;
  contentType: 'banner' | 'product' | 'supplier';
  supplierId: string;
  paymentType: 'monthly' | 'one_time';
  amount: number;
  paymentDate: string;
  nextPaymentDate?: string;
  startDate?: string;
  endDate?: string;
  imagePath: string;
  title?: string;
}

export interface CreateSupplierSponsorshipDto {
  supplierId: string;
  startDateStr: string;
  periodDays: number;
  price: number;
  successUrl: string;
  cancelUrl: string;
}

export interface CreateProductSponsorshipDto {
  productId: string;
  startDateStr: string;
  periodDays: number;
  price: number;
  successUrl: string;
  cancelUrl: string;
}

export interface CreateSponsorshipContentDto {
  contentType: 'banner' | 'product' | 'supplier';
  contentId: string;
}

export interface CreateSponsorshipWithContentDto extends CreateSponsorshipDto {
  sponsorshipContents: CreateSponsorshipContentDto[];
}

export interface CreateSponsorshipDto {
  type: 'lateral_panel' | 'carousel' | 'other';
  description?: string;
  status: boolean;
}

export interface UpdateSponsorshipDto {
  type?: 'lateral_panel' | 'carousel' | 'other';
  description?: string;
  status?: boolean;
}

// Response types
export interface SponsoredSupplier {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierLogo?: string;
  sponsorStart: Date;
  sponsorEnd: Date;
  sponsorPrice: number;
  stripeSessionId?: string;
}

export interface SponsoredProduct {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  sponsorStart: Date | null;
  sponsorEnd: Date | null;
  sponsorPrice: number;
  stripeSessionId: string | null;
  categories: Array<{ id: string; name: string }>;
}

export interface PaginatedSponsoredProducts {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: SponsoredProduct[];
}

export interface StripeSessionResponse {
  sessionUrl: string;
}

export interface ProductSponsorshipResponse {
  promotionId: string;
  stripeSessionId: string;
  checkoutUrl: string;
}