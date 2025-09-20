export interface CreateInternationalDocumentsOrderRequest {
  supplierId: number;
  supplierName?: string;
  ruc?: string;
  fiscalAddress?: string;
  reference?: string;
  items: Array<{
    description: string;
    quantity: number;
    weightKg?: number;
    value?: number;
  }>;
}

export interface InternationalDocumentsOrder {
  id: string;
  supplierId: number;
  supplierName: string;
  ruc: string;
  fiscalAddress?: string;
  reference?: string;
  items: Array<{
    description: string;
    quantity: number;
    weightKg?: number;
    value?: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInternationalDocumentsOrderResponse extends InternationalDocumentsOrder {}

export interface InternationalDocumentsOrderListResponse {
  total: number;
  orders: InternationalDocumentsOrder[];
}

export interface InternationalDocumentsOrderError {
  statusCode: number;
  message: string | string[];
  error?: string;
}
