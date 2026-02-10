const TOKEN_KEY = 'exam_adda_token';

export const setToken = (token?: string) => {
  if (typeof window === 'undefined') return;
  if (!token) return;
  window.localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
};

export const clearToken = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_KEY);
};
