export interface CartItem {
  id: number;
  product: any;
  amount: number;
  subtotal: number;
}

// Enums
export enum PaymentType {
  SINGLE = 'SINGLE',
}

// DTOs
export interface CreateIzipayPaymentDto {
  amount: number;
  orderId: string;
  paymentType: PaymentType;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone?: string;
  orderInfo?: string;
  returnUrl?: string;
}

export interface IzipayWebhookDto {
  vads_site_id: string;
  vads_ctx_mode: string;
  vads_trans_id: string;
  vads_trans_date: string;
  vads_trans_status: string;
  vads_amount: string;
  vads_currency: string;
  vads_order_id?: string;
  vads_cust_email?: string;
  signature: string;
  vads_hash?: string;
  vads_url_check_src?: string;
  [key: string]: any;
}

// Response types
export interface IzipayFormData {
  [key: string]: string;
}

export interface WebhookConfiguration {
  webhookUrl: string;
  returnUrl: string;
  isProduction: boolean;
  siteId: string;
}

export interface ConfigurationValidation {
  isValid: boolean;
  missingFields: string[];
  warnings: string[];
}