// Product Promotion Models - Frontend Implementation

export interface ProductPromotion {
  id: string;
  product: Product;
  valveSource: string;
  isSponsored: number;
  periodDays: number;
  sponsorStart: string | null;
  sponsorPrice: number;
  sponsorEnd: string | null;
  stripeSessionId: string | null;
}

export interface Product {
  id: string;
}