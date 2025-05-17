'use client';

import { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { ChatMessage } from './ChatMessage';
import { Sidebar } from './Sidebar';
import { Message, ChatState, Conversation } from '@/types/chat';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getConversations,
  createNewConversation,
  updateConversation,
  deleteConversation,
} from '@/lib/storage';
import { useRouter } from 'next/navigation';

export function Chat() {
  const [state, setState] = useState<ChatState>({
    conversations: [],
    currentConversationId: null,
    isLoading: false,
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@devriazul.com';

  useEffect(() => {
    if (!isInitialized) {
      setState(prev => ({
        ...prev,
        conversations: getConversations(),
      }));
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const currentConversation = state.conversations.find(
    (c) => c.id === state.currentConversationId
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isInitialized) {
      scrollToBottom();
    }
  }, [currentConversation?.messages, isInitialized]);

  useEffect(() => {
    if (!state.isLoading) {
      inputRef.current?.focus();
    }
  }, [state.isLoading]);

  const handleNewChat = () => {
    setState((prev) => ({
      ...prev,
      currentConversationId: null,
    }));
    setInput('');
    inputRef.current?.focus();
  };

  const handleSelectConversation = (id: string) => {
    setState((prev) => ({
      ...prev,
      currentConversationId: id,
    }));
    inputRef.current?.focus();
  };

  const handleDeleteConversation = (id: string) => {
    deleteConversation(id);
    setState((prev) => ({
      ...prev,
      conversations: getConversations(),
      currentConversationId:
        prev.currentConversationId === id ? null : prev.currentConversationId,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || state.isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    let conversation: Conversation;
    if (!state.currentConversationId) {
      conversation = createNewConversation(userMessage);
      setState((prev) => ({
        ...prev,
        conversations: getConversations(),
        currentConversationId: conversation.id,
        isLoading: true,
      }));
    } else {
      conversation = {
        ...currentConversation!,
        messages: [...currentConversation!.messages, userMessage],
      };
      updateConversation(conversation);
      setState((prev) => ({
        ...prev,
        conversations: getConversations(),
        isLoading: true,
      }));
    }

    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversation.messages }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString(),
      };

      const updatedConversation = {
        ...conversation,
        messages: [...conversation.messages, assistantMessage],
      };
      updateConversation(updatedConversation);

      setState((prev) => ({
        ...prev,
        conversations: getConversations(),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error:', error);
      setState((prev) => ({ ...prev, isLoading: false }));
    } finally {
      setIsTyping(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.replace('/login');
  };

  if (!isInitialized) {
    return (
      <div className="flex h-[calc(100vh-73px)] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
          <p className="text-gray-500">Loading conversations...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-73px)]">
      <Sidebar
        conversations={state.conversations}
        currentConversationId={state.currentConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-end gap-4 px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-gradient-to-br from-purple-500 to-pink-500 px-3 py-1 text-sm font-semibold text-white shadow">{adminEmail}</span>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 hover:text-red-600 transition-all shadow"
          >
            Logout
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {!currentConversation ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex h-full items-center justify-center"
              >
                <div className="text-center">
                  <h2 className="mb-2 text-2xl font-semibold text-gray-900">
                    Welcome to AI Chat
                  </h2>
                  <p className="text-gray-500">
                    Start a new conversation or select an existing one from the sidebar.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="messages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="divide-y divide-gray-100"
              >
                {currentConversation.messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    message={message}
                    isLastMessage={index === currentConversation.messages.length - 1}
                  />
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-4 py-6 text-gray-500"
                  >
                    <div className="flex gap-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.2s]" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.4s]" />
                    </div>
                    <span>AI is typing...</span>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="sticky bottom-0 border-t border-gray-200 bg-white px-4 py-4">
          <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
            <div className="flex items-center gap-4">
              <motion.input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:bg-gray-50 disabled:text-gray-500"
                disabled={state.isLoading}
                whileFocus={{ scale: 1.01 }}
                style={{
                  fontSize: '1rem',
                  lineHeight: '1.5',
                  fontWeight: 400,
                }}
              />
              <motion.button
                type="submit"
                disabled={state.isLoading || !input.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm transition-all hover:shadow-md',
                  (state.isLoading || !input.trim()) &&
                    'cursor-not-allowed bg-gray-300 hover:shadow-none'
                )}
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 