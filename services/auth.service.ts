import api from '@/lib/api';
import { SessionUser } from '@/lib/auth';

export type AuthResponse = {
  accessToken: string;
  user: SessionUser;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type InstituteRegisterPayload = {
  email: string;
  password: string;
  ownerName: string;
  phone: string;
  instituteName: string;
  description?: string;
};

export type StudentRegisterPayload = {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  instituteId: string;
};

export const login = (payload: LoginPayload) =>
  api.post<AuthResponse>('/auth/login', payload);

export const loginForInstitute = (slug: string, payload: LoginPayload) =>
  api.post<AuthResponse>(`/auth/login/institute/${slug}`, payload);

export const registerInstitute = (payload: InstituteRegisterPayload) =>
  api.post<AuthResponse>('/auth/register/institute', payload);

export const registerStudent = (payload: StudentRegisterPayload) =>
  api.post<AuthResponse>('/auth/register/student', payload);

export const logout = () => api.post('/auth/logout');
