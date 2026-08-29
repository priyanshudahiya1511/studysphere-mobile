export interface SummarySection {
  heading: string;
  content: string;
}

export interface Summary {
  _id: string;
  owner: string;
  sourceType: 'note' | 'document';
  sourceId: string;
  title: string;
  overview: string;
  sections: SummarySection[];
  keyPoints: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GenerateSummaryResponse {
  message: string;
  summary: Summary;
}

export interface GetSummariesResponse {
  count: number;
  summaries: Summary[];
}
