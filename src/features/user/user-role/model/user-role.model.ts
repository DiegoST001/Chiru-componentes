export interface UserRole {
  id: number;
  name: string;
  users: User[];
}

export interface User {
  id: number;
}

export interface CreateUserRoleDto {
  name: string;
}

export interface UpdateUserRoleDto {
  name?: string;
}