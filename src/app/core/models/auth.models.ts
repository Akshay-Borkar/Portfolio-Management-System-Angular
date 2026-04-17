export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  userName: string;
  email: string;
  token: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  password: string;
  role: string;
}

export interface RegisterResponse {
  userId: string;
}

export interface AuthState {
  user: LoginResponse | null;
  loading: boolean;
  error: string | null;
}
