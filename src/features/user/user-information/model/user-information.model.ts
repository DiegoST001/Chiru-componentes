// User Information Models - Frontend Implementation

export interface UserInformation {
  id: number;
  user_id: User;
  userName: string;
  userAbbreviation: string;
  mainAddress?: number;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  gender?: string;
  createdAt: string;
}

export interface User {
  id: number;
}

export interface PaginationDto {
  page: number;
  limit: number;
  search?: string;
}