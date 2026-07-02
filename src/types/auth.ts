export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface UserPermissions {
  role?: string;
  [key: string]: any;
}

export interface User {
  id: string;
  name: string;
  email: string;
  pfType?: 'FISICA' | 'JURIDICA';
  permissions?: UserPermissions;
  [key: string]: any;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PfDetailsPayload {
  cpf: string;
  phone?: string;
  birthDate?: string;
  zipCode?: string;
  city: string;
  state: string;
}

export interface PjDetailsPayload {
  cnpj: string;
  companyName: string;
  mainPartnerName: string;
  cpf: string;
  birthDate?: string;
  phone?: string;
  zipCode?: string;
  city: string;
  state: string;
  companySize: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  pfType: 'FISICA' | 'JURIDICA';
  pfDetails?: PfDetailsPayload;
  pjDetails?: PjDetailsPayload;
}

export interface RegisterResponse {
  message?: string;
  success?: boolean;
  token?: string;
  user?: User;
}

export interface VerifyEmailPayload {
  token: string;
}
