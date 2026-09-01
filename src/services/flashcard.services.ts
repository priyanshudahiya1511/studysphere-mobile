import api from './api';
import {
  FlashcardSet,
  GenerateFlashcardResponse,
  GetFlashcardSetsResponse,
} from '../types/flashcard.types';

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

export const getFlashcardSetsService =
  async (): Promise<GetFlashcardSetsResponse> => {
    const response = await api.get('/api/v1/flashcards/getflashcardsets');
    return response.data;
  };

export const getFlashcardSetByIdService = async (
  id: string,
): Promise<{ flashcardSet: FlashcardSet }> => {
  const response = await api.get(
    `/api/v1/flashcards/getflashcardsetbyid/${id}`,
  );
  return response.data;
};

export const deleteFlashcardSetService = async (id: string) => {
  const response = await api.delete(
    `/api/v1/flashcards/deleteflashcardset/${id}`,
  );
  return response.data;
};
