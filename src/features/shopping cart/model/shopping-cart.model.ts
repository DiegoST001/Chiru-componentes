export interface ShoppingCartResponse {
  message: string;
  updatedQuantity: number;
  newSubtotal: number;
}

export interface RemoveProductResponse {
  message: string;
  removedProductId: string;
  updatedCartTotal: number;
}

export interface CartTotalResponse {
  total: number;
  itemCount: number;
  currency: string;
}

export interface ClearCartResponse {
  message: string;
  cartId: number;
  removedItems: number;
  clearedAt: string;
}

export interface CartAccessResponse {
  authorized: boolean;
  userId: number;
  accessLevel: string;
}

export interface CartUser {
  id: number;
  name: string;
  email: string;
}

export interface CreateCartResponse {
  id: number;
  user: CartUser;
  cartItems: ShoppingCartItem[];
  createdAt: string;
  total: number;
}

export interface ShoppingCartErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

// Main shopping cart interface that was referenced in user.model.ts
export interface ShoppingCart {
  id: number;
  userId: string;
  items: ShoppingCartItem[];
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingCartItem {
  id: number;
  productId: string;
  quantity: number;
  price: number;
  subtotal: number;
}

// DTOs for various operations
export interface UpdateQuantityRequest {
  userId: string;
  productId: string;
  amount: string;
  price: number;
}

export interface SingleUnitUpdateRequest {
  userId: string;
  productId: string;
  price: number;
}

export interface AddToCartRequest {
  productId: string;
  amount: number;
  price: number;
}

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl?: string;
}

export interface CartItemDetail {
  id: number;
  product: CartProduct;
  amount: number;
  subtotal: number;
  addedAt: string;
}

export interface GetCartResponse {
  id: number;
  user: CartUser;
  cartItems: CartItemDetail[];
  totalAmount: number;
  itemCount: number;
  lastUpdated: string;
}

export interface AddToCartResponse {
  id: number;
  shoppingCart: {
    id: number;
    userId: number;
  };
  product: CartProduct;
  amount: number;
  subtotal: number;
  addedAt: string;
}
