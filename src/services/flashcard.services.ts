import api from './api';
import { GenerateFlashcardResponse } from '../types/flashcard.types';

export const generateFlashcardsService = async (
  sourceType: 'note' | 'document',
  sourceId: string,
): Promise<GenerateFlashcardResponse> => {
  const response = await api.post('/api/v1/flashcards/generate', {
    sourceType,
    sourceId,
  });
  return response.data;
};
