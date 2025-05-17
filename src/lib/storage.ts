import { Conversation, Message } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'chat-conversations';

export function getConversations(): Conversation[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveConversations(conversations: Conversation[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

export function createNewConversation(firstMessage: Message): Conversation {
  const conversation: Conversation = {
    id: uuidv4(),
    title: firstMessage.content.slice(0, 30) + (firstMessage.content.length > 30 ? '...' : ''),
    messages: [firstMessage],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const conversations = getConversations();
  conversations.unshift(conversation);
  saveConversations(conversations);
  
  return conversation;
}

export function updateConversation(conversation: Conversation) {
  const conversations = getConversations();
  const index = conversations.findIndex(c => c.id === conversation.id);
  
  if (index !== -1) {
    conversations[index] = {
      ...conversation,
      updatedAt: new Date().toISOString(),
    };
    saveConversations(conversations);
  }
}

export function deleteConversation(id: string) {
  const conversations = getConversations();
  const filtered = conversations.filter(c => c.id !== id);
  saveConversations(filtered);
} 