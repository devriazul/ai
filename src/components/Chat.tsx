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
  clearConversations,
} from '@/lib/storage';
import { useRouter } from 'next/navigation';
import { Bars3Icon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

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
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Clear old conversations when component mounts
    clearConversations();
    setState(prev => ({
      ...prev,
      conversations: [],
      currentConversationId: null,
    }));
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const toggleSidebarMobile = () => {
    setShowSidebarMobile(!showSidebarMobile);
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
    <div className="relative flex h-full overflow-hidden md:flex-row flex-col">
      {/* Animated Background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Bubble 1 */}
        <div className="absolute left-10 top-10 w-60 h-60 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-30 blur-2xl animate-bubble1" />
        {/* Bubble 2 */}
        <div className="absolute right-16 top-32 w-44 h-44 rounded-full bg-gradient-to-br from-blue-400 to-purple-300 opacity-20 blur-2xl animate-bubble2" />
        {/* Bubble 3 */}
        <div className="absolute left-1/2 bottom-10 w-80 h-80 rounded-full bg-gradient-to-br from-pink-300 to-blue-300 opacity-20 blur-3xl animate-bubble3" />
        {/* Bubble 4 */}
        <div className="absolute right-1/4 bottom-24 w-36 h-36 rounded-full bg-gradient-to-br from-purple-300 to-pink-200 opacity-30 blur-2xl animate-bubble4" />
        {/* Bubble 5 */}
        <div className="absolute left-1/4 top-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-blue-300 to-purple-200 opacity-20 blur-2xl animate-bubble5" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {showSidebarMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebarMobile}
        />
      )}

      {/* Sidebar and Main Chat Content Area Wrapper */}
      {/* This div is the flex-row that holds the sidebar and the chat messages */}
      <div className="flex flex-row flex-1">
        {/* Sidebar */}
        <motion.div
          initial={isMobile ? { x: '-100%' } : { x: 0 }}
          animate={isMobile ? (showSidebarMobile ? { x: 0 } : { x: '-100%' }) : { x: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-200 md:relative md:translate-x-0 md:shadow-none md:flex-shrink-0 md:flex md:flex-col md:h-full"
        >
          <Sidebar
            conversations={state.conversations}
            currentConversationId={state.currentConversationId}
            onNewChat={handleNewChat}
            onSelectConversation={handleSelectConversation}
            onDeleteConversation={handleDeleteConversation}
          />
        </motion.div>

        {/* Main Chat Content Area */}
        {/* This flex-col holds the mobile header and the scrollable messages */}
        <div className={cn(
          "flex flex-col transition-all duration-200 flex-1 overflow-y-hidden md:h-full",
          isMobile ? (showSidebarMobile ? '' : 'w-full') : ''
        )}>
          {/* Mobile Header with Hamburger (moved here)*/}
          <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white flex-shrink-0">
            <button onClick={toggleSidebarMobile} className="text-gray-500 hover:text-gray-700">
              <Bars3Icon className="h-6 w-6" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">AI Chat</h2>
            <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700">
              <ArrowLeftOnRectangleIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Main Chat Area (Scrollable Messages) */}
          <div className="flex-1 overflow-y-auto h-0"> {/* flex-1 and h-0 combined to make it fill remaining height and scroll */}
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
          </div> {/* End of Main Chat Area (Scrollable Messages) */}

          {/* Input Area - Moved back inside this flex-col */}
          <div className="border-t border-gray-200 bg-white px-4 py-4 flex-shrink-0"> {/* Moved back here */}
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
          </div> {/* End of Input Area */}
        </div> {/* End of Main Chat Content Area */}
      </div> {/* End of Sidebar and Main Chat Content Area Wrapper (flex-row)*/}

      <style jsx global>{`
        @keyframes bubble1 {
          0% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-40px) scale(1.08); opacity: 0.5; }
          100% { transform: translateY(0) scale(1); opacity: 0.3; }
        }
        .animate-bubble1 { animation: bubble1 7s ease-in-out infinite; }
        @keyframes bubble2 {
          0% { transform: translateY(0) scale(1); opacity: 0.2; }
          50% { transform: translateY(-30px) scale(1.12); opacity: 0.4; }
          100% { transform: translateY(0) scale(1); opacity: 0.2; }
        }
        .animate-bubble2 { animation: bubble2 8s ease-in-out infinite; }
        @keyframes bubble3 {
          0% { transform: translateY(0) scale(1); opacity: 0.25; }
          50% { transform: translateY(-60px) scale(1.05); opacity: 0.4; }
          100% { transform: translateY(0) scale(1); opacity: 0.25; }
        }
        .animate-bubble3 { animation: bubble3 10s ease-in-out infinite; }
        @keyframes bubble4 {
          0% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.1); opacity: 0.5; }
          100% { transform: translateY(0) scale(1); opacity: 0.3; }
        }
        .animate-bubble4 { animation: bubble4 9s ease-in-out infinite; }
        @keyframes bubble5 {
          0% { transform: translateY(0) scale(1); opacity: 0.2; }
          50% { transform: translateY(-25px) scale(1.13); opacity: 0.35; }
          100% { transform: translateY(0) scale(1); opacity: 0.2; }
        }
        .animate-bubble5 { animation: bubble5 11s ease-in-out infinite; }
      `}</style>
    </div>
  );
} 