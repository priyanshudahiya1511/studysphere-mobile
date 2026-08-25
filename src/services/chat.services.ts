import api from './api';
import { StartChatResponse, SendMessageResponse } from '../types/chat.types';

export const startChatService = async (
  documentId: string,
): Promise<StartChatResponse> => {
  const response = await api.post('/api/v1/chat/start', { documentId });
  return response.data;
};

export const sendMessageService = async (
  sessionId: string,
  question: string,
): Promise<SendMessageResponse> => {
  const response = await api.post(`/api/v1/chat/send/${sessionId}`, {
    question,
  });
  return response.data;
};
