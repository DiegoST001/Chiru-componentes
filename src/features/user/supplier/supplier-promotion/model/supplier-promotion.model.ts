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

export interface SupplierPromotion {
  id: string;
  supplier: Supplier;
  valveSource: string;
  isSponsored: number;
  periodDays: number;
  sponsorStart: Date | null;
  sponsorEnd: Date | null;
  sponsorPrice: number;
  stripeSessionId: string;
}