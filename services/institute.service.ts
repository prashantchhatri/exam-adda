import api from '@/lib/api';

export type InstitutePayload = {
  name: string;
  description?: string;
};

export type Institute = {
  id: string;
  name: string;
  description?: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

export const getMyInstitute = () => api.get<Institute>('/institutes/me');

export const createInstitute = (payload: InstitutePayload) =>
  api.post<Institute>('/institutes', payload);
