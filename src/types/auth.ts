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
