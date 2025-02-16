export interface LoginRequest {
  email: string;
  password: string; 
  remember: boolean; 
  token?: string;
}
