import { GenerateSummaryResponse } from '../types/summary.types';
import api from './api';

export const generateSummaryService = async (
  sourceType: 'note' | 'document',
  sourceId: string,
): Promise<GenerateSummaryResponse> => {
  const response = await api.post('/api/v1/summaries/generate', {
    sourceType,
    sourceId,
  });
  return response.data;
};
