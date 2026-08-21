export interface AnalyticsContent {
  notes: number;
  documents: number;
  summaries: number;
  quizzes: number;
  flashcardSets: number;
}

export interface AnalyticsPlanner {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
}

export interface QuizAttemptSummary {
  percentage: number;
  score: number;
  total: number;
  date: string;
}

export interface AnalyticsQuizPerformance {
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  recentAttempts: QuizAttemptSummary[];
}

export interface Analytics {
  content: AnalyticsContent;
  planner: AnalyticsPlanner;
  quizPerformance: AnalyticsQuizPerformance;
}
