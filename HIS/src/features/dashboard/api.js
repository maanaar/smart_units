import apiClient from '../../services/apiClient';

export const getDashboardData = () => apiClient.get('/dashboard');
