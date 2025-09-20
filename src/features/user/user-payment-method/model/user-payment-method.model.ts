export interface UserPaymentMethod {
  id: number;
  paymentMethod: string;
  user: User;
}

export interface User {
  id: number;
}