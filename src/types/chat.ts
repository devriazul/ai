export type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
};

export type ChatState = {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
}; 