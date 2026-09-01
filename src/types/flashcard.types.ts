export interface Flashcard {
  front: string;
  back: string;
  _id?: string;
}

export interface FlashcardSet {
  _id: string;
  owner: string;
  sourceType: 'note' | 'document';
  sourceId: string;
  title: string;
  cards: Flashcard[];
  createdAt: string;
  updatedAt: string;
}

export interface GenerateFlashcardResponse {
  message: string;
  flashcardSet: FlashcardSet;
}

export interface GetFlashcardSetsResponse {
  count: number;
  flashcardSets: FlashcardSet[];
}
