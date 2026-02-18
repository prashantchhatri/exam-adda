const TOKEN_KEY = 'exam_adda_token';
const USER_KEY = 'exam_adda_user';

export type SessionUser = {
  id: string;
  email: string;
  role: 'SUPER_ADMIN' | 'INSTITUTE' | 'STUDENT';
};

export const setToken = (token?: string) => {
  if (typeof window === 'undefined') return;
  if (!token) return;
  window.localStorage.setItem(TOKEN_KEY, token);
};

export const setUser = (user?: SessionUser) => {
  if (typeof window === 'undefined') return;
  if (!user) return;
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const setSession = (token?: string, user?: SessionUser) => {
  setToken(token);
  setUser(user);
};

export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
};

export const getCurrentUser = (): SessionUser | null => {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
};

export const clearToken = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_KEY);
};

export const clearSession = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
};

export const dashboardPathByRole = (role?: SessionUser['role']) => {
  if (role === 'SUPER_ADMIN') return '/super-admin';
  if (role === 'INSTITUTE') return '/institute';
  if (role === 'STUDENT') return '/student';
  return '/';
};
