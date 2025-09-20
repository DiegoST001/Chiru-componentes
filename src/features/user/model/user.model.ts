// User Models - Frontend Implementation

export interface User {
  id: number;
  email: string;
  password: string;
  lastLoginDate?: string;
  isVisible?: number;
  isActive?: number;
  tokenRefreshPassword?: string;
  tokenExpiryDate?: string;
  role: UserRole;
  userAddress: UserAddress[];
  userInformation: UserInformation;
  createdAt: string;
  supplier: Supplier[];
  notifications: Notification[];
  identifications: UserIdentification[];
  extraSuppliers: UserExtraSupplier[];
  paymentMethods: UserPaymentMethod[];
  shoppingCart: ShoppingCart;
}

export interface UserRole {
  id: number;
}

export interface UserAddress {
  id: number;
}

export interface UserInformation {
  id: number;
  userName: string;
  userAbbreviation: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

export interface Supplier {
  id: string;
}

export interface Notification {
  id: number;
}

export interface UserIdentification {
  id: number;
}

export interface UserExtraSupplier {
  id: number;
}

export interface UserPaymentMethod {
  id: number;
}

export interface ShoppingCart {
  id: number;
}

export interface UserFilterRequest {
  role: number;
}

export interface UserInformationRequest {
  id: number;
}

export interface ResetPasswordRequest {
  id: number;
  password: string;
}

export interface ResetMyPasswordRequest {
  password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
}

export interface CreateUserDto {
  email: string;
  password?: string;
  isVisible: number;
  isActive: number;
  role: number;
  userName: string;
  userAbbreviation: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

export interface ProfileUserDto {
  email: string;
  password?: string;
  userName: string;
  userAbbreviation: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
}