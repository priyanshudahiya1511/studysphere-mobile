export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  _id?: string;
  createdAt?: string;
}

export interface ChatSession {
  _id: string;
  owner: string;
  document: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface StartChatResponse {
  message: string;
  session: ChatSession;
}

export interface SendMessageResponse {
  answer: string;
  sources: { chunkIndex: number; score: number }[];
}
