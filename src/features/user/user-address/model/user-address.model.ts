// User Address Models - Frontend Implementation

export interface UserAddress {
  id: number;
  user: User;
  label: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  createAt: string;
  updateAt: string;
  police?: Police;
}

export interface User {
  id: number;
}

export interface Police {
  id: number;
  distrito: string;
}

export interface CreateUserAddressDto {
  user: number;
  label: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  country: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface UpdateUserAddressDto {
  user?: number;
  label?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  country?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface GetByUserDto {
  id_user: number;
}

export interface UserAddressResponseDto {
  id: number;
  user: { id: number };
  label: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  createAt: string;
  updateAt: string;
}