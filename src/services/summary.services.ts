import {
  GenerateSummaryResponse,
  GetSummariesResponse,
  Summary,
} from '../types/summary.types';
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

export const getSummariesService = async (): Promise<GetSummariesResponse> => {
  const response = await api.get('/api/v1/summaries/getsummaries');
  return response.data;
};

export const getSummaryByIdService = async (
  id: string,
): Promise<{ summary: Summary }> => {
  const response = await api.get(`/api/v1/summaries/getsummarybyid/${id}`);
  return response.data;
};

export const deleteSummaryService = async (id: string) => {
  const response = await api.delete(`/api/v1/summaries/deletesummary/${id}`);
  return response.data;
};
