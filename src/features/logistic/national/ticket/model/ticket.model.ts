export type ProductSize = 'small' | 'medium' | 'large' | 'extralarge';

export interface CartProductSummary {
  id: string;
  name?: string;
  size?: ProductSize;
}

export interface CartItemSummary {
  id: number;
  amount: number;
  price: number;
  product: CartProductSummary;
}

export interface CreateTicketRequest {
  destination: string;
  cartItems: CartItemSummary[];
}

export interface TicketDetail {
  id: string;
  cantidad: number;
  price: number;
  product: CartProductSummary;
}

export type TicketType = 'bajo' | 'alto' | 'express';

export interface TicketEntity {
  id: string;
  destino: string;
  type: TicketType;
  createdAt: string;
  updatedAt: string;
  ticketDetails: TicketDetail[];
}

export interface TicketDetailUpdateResponse {
  id: string;
  cantidad: number;
  price: number;
  product: {
    id: string;
    name?: string;
  };
  ticket: {
    id: string;
    destino: string;
  };
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}
