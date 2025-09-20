export interface User {
  id: number;
  email: string;
  password: string;
  lastLoginDate?: Date;
  isVisible?: number;
  isActive?: number;
  tokenRefreshPassword?: string;
  tokenExpiryDate?: Date;
  createdAt: Date;
}

export interface UserRole {
  id: number;
  name: string;
}

export interface UserInformation {
  id: number;
  userName: string;
  userAbbreviation: string;
  mainAddress?: number;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  gender?: string;
  createdAt: Date;
}

export interface AuthCredentials {
  id: number;
  user: User;
  passwordHash: string;
  primaryMethod: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthProvider {
  id: number;
  user: User;
  provider: string;
  providerUserId: string;
  accessToken: string;
  refreshToken: string;
  profileData: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailCodeLog {
  id: number;
  user?: User;
  email: string;
  purpose: string;
  tokenHash: string;
  createdAt: Date;
  expiresAt: Date;
  used: boolean;
  consumedAt: Date;
  ip: string;
  userAgent: string;
  meta: any;
}

export interface PersistentSession {
  id: number;
  sessionId: string;
  user: User;
  ip: string;
  userAgent: string;
  createdAt: Date;
  lastActive: Date;
  expiresAt: Date;
  data: any;
  revoked: boolean;
}

export interface RefreshToken {
  id: number;
  value: string;
  user: User;
  expiresAt: Date;
  ipAddress: string;
}

export interface UserVerification {
  id: number;
  email: string;
  code: string;
  expiresAt: Date;
}

// DTOs
export interface GoogleProfileDto {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
}

export interface UserSession {
  email: string;
  role: string;
  userName: string;
  userAbbreviation?: string;
  mainAddress?: number;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  session: UserSession;
}

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface AuthResetPasswordRequest {
  token: string;
  password: string;
}

export interface AuthResetPasswordResponse {
  success: boolean;
}

export interface AuthRequestResetPasswordRequest {
  email: string;
}

export interface AuthRequestResetPasswordResponse {
  success: boolean;
}

export interface SignupResponse {
  success: boolean;
}

export interface SignupRequest {
  email: string;
  password: string;
  userName: string;
  gender: string;
}

export interface VerifyCodeDto {
  email: string;
  code: string;
  password: string;
  userName: string;
}