import api from '@/lib/api';

export const getSuperAdminDashboard = () => api.get('/dashboard/super-admin');

export const getInstituteDashboard = () => api.get('/dashboard/institute');

export const getStudentDashboard = () => api.get('/dashboard/student');
