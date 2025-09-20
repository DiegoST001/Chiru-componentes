export interface UserIdentification {
  id: number;
  type: string;
  value: string;
  countrycode: string;
  issueddate: string;
  expirationdate: string;
  user: User;
}

export interface User {
  id: number;
}

export interface CreateUserIdentificationDto {
  type: string;
  value: string;
  countrycode: string;
  issueddate: string;
  expirationdate: string;
  userId: number;
}

export interface UpdateUserIdentificationDto {
  type?: string;
  value?: string;
  countrycode?: string;
  issueddate?: string;
  expirationdate?: string;
  userId?: number;
}