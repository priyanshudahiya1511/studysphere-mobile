import {
  CreateQuizResponse,
  GetQuizzesResponse,
  Quiz,
  SubmitQuizResponse,
} from '../types/quiz.types';
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

export const getQuizzesService = async (): Promise<GetQuizzesResponse> => {
  const response = await api.get('/api/v1/quizzes/getquizzes');
  return response.data;
};

export const getQuizByIdService = async (
  id: string,
): Promise<{ quiz: Quiz }> => {
  const response = await api.get(`/api/v1/quizzes/getquizbyid/${id}`);
  return response.data;
};

export const deleteQuizService = async (id: string) => {
  const response = await api.delete(`/api/v1/quizzes/deletequiz/${id}`);
  return response.data;
};
