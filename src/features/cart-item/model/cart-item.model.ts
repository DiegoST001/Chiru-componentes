export interface ShoppingCart {
  id: number;
  user: any;
  createdAt: Date;
  updatedAt: Date;
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
}


export interface CartItem {
  id: number;
  shoppingCart: ShoppingCart;
  product: Product;
  amount: number;
  subtotal: number;
}