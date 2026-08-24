import { CreateQuizResponse, SubmitQuizResponse } from '../types/quiz.types';
import api from './api';

export const createQuizService = async (
  sourceType: 'note' | 'document',
  sourceId: string,
  numQuestions: number = 5,
): Promise<CreateQuizResponse> => {
  const response = await api.post('/api/v1/quizzes/create', {
    sourceType,
    sourceId,
    numQuestions,
  });
  return response.data;
};

export const submitQuizService = async (
  quizId: string,
  answers: number[],
): Promise<SubmitQuizResponse> => {
  const response = await api.post(`/api/v1/quizzes/submit/${quizId}`, {
    answers,
  });
  return response.data;
};
