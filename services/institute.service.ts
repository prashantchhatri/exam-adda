import api from '@/lib/api';

export type InstitutePayload = {
  name: string;
  description?: string;
};

export type Institute = {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
  ownerId: string;
  logoUrl?: string | null;
  address?: string | null;
  phone?: string | null;
  showInfoOnLogin?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type InstituteOption = {
  id: string;
  name: string;
  slug?: string;
  logoUrl?: string | null;
};

export type InstituteLoginInfo = {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  address?: string | null;
  phone?: string | null;
  showInfoOnLogin?: boolean;
};

export type UpdateInstituteDetailsPayload = {
  logoUrl?: string;
  address?: string;
  phone?: string;
  showInfoOnLogin?: boolean;
};

export const getMyInstitute = () => api.get<Institute>('/institutes/me');

export const createInstitute = (payload: InstitutePayload) =>
  api.post<Institute>('/institutes', payload);

export const getInstitutes = () => api.get<InstituteOption[]>('/institutes');

export const getInstituteBySlug = (slug: string) =>
  api.get<InstituteLoginInfo>(`/institutes/slug/${slug}`);

export const updateMyInstituteDetails = (payload: UpdateInstituteDetailsPayload) =>
  api.patch<Institute>('/institutes/me/details', payload);
