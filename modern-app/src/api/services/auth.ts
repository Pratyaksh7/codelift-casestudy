import { client } from '../client';
import { endpoints } from '../endpoints';

export type AuthUser = {
  email: string;
  name?: string;
  role?: string;
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

export function login(email: string, password: string): Promise<LoginResponse> {
  return client.post<LoginResponse>(endpoints.auth.login, { email, password });
}
