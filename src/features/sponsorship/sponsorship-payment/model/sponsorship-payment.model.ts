export interface SponsorshipContent {
  id: number;
  contentType: 'banner' | 'product' | 'supplier' | 'category';
  contentId: string;
}

export interface Supplier {
  id: string;
  name: string;
  logo?: string;
}

export interface SponsorshipPayment {
  id: number;
  sponsorship: SponsorshipContent;
  supplier: Supplier;
  paymentType: 'monthly' | 'one_time';
  amount: number;
  system?: number;
  paymentDate?: Date;
  nextPaymentDate?: Date;
  startDate?: Date;
  endDate?: Date;
}