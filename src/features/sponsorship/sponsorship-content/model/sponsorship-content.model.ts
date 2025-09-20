export interface Sponsorship {
  id: number;
  type: 'lateral_panel' | 'carousel' | 'other';
  description?: string;
  status: boolean;
}

export interface BannerImage {
  id: string;
  url?: string;
  title?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price?: any;
}

export interface Supplier {
  id: string;
  name: string;
  logo?: string;
}

export interface Category {
  id: string;
  name: string;
  image?: string;
}

export interface SponsorshipPayment {
  id: number;
  amount: number;
  paymentDate: Date;
  status: string;
}

export interface SponsorshipContent {
  id: number;
  sponsorship: Sponsorship;
  contentType: 'banner' | 'product' | 'supplier' | 'category';
  contentId: string;
  bannerImage?: BannerImage;
  product?: Product;
  supplier?: Supplier;
  category?: Category;
  sponsorshipPayment?: SponsorshipPayment;
}