export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  _id?: string;
}

export interface Quiz {
  _id: string;
  owner: string;
  sourceType: 'note' | 'document';
  title: string;
  questions: QuizQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuizResponse {
  message: string;
  quiz: Quiz;
}

export interface QuizResultItem {
  question: string;
  options: string[];
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  explanation: string;
}

export interface SubmitQuizResponse {
  message: string;
  score: number;
  total: number;
  percentage: number;
  results: QuizResultItem[];
}
