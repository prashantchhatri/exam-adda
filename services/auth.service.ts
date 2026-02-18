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

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', payload);
  return response.data;
};

export const loginForInstitute = async (slug: string, payload: LoginPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(`/auth/login/institute/${slug}`, payload);
  return response.data;
};

export const registerInstitute = async (payload: InstituteRegisterPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register/institute', payload);
  return response.data;
};

export const registerStudent = async (payload: StudentRegisterPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register/student', payload);
  return response.data;
};

export const logout = () => api.post('/auth/logout');
