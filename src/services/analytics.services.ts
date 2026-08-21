import api from './api';
import { Analytics } from '../types/analytics.types';

export const getAnalyticsService = async (): Promise<Analytics> => {
  const response = await api.get('/api/v1/analytics');
  return response.data;
};
