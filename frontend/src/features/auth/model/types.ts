export interface LoginRequest {
  login: string;
  password: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}