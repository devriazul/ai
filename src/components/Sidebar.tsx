'use client';

import { Conversation } from '@/types/chat';
import { PlusIcon, TrashIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

export function Sidebar({
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
}: SidebarProps) {
  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex h-full w-64 flex-col border-r border-gray-200 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="p-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md"
        >
          <PlusIcon className="h-5 w-5" />
          New Chat
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        <div className="space-y-1.5">
          <AnimatePresence>
            {conversations.map((conversation) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'group relative flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all',
                  currentConversationId === conversation.id
                    ? 'bg-blue-50 text-blue-900 shadow-sm border border-blue-100'
                    : 'text-gray-700 hover:bg-gray-100 border border-transparent'
                )}
              >
                <button
                  onClick={() => onSelectConversation(conversation.id)}
                  className="flex flex-1 items-center gap-2.5 truncate text-left"
                >
                  <ChatBubbleLeftIcon className={cn(
                    "h-4 w-4 flex-shrink-0",
                    currentConversationId === conversation.id
                      ? "text-blue-500"
                      : "text-gray-400"
                  )} />
                  <span className={cn(
                    "truncate font-medium",
                    currentConversationId === conversation.id
                      ? "text-blue-900"
                      : "text-gray-700"
                  )}>
                    {conversation.title}
                  </span>
                </button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onDeleteConversation(conversation.id)}
                  className={cn(
                    "ml-2 hidden rounded p-1.5 text-gray-400 hover:bg-gray-200 group-hover:block",
                    currentConversationId === conversation.id && "hover:bg-blue-100 hover:text-blue-600"
                  )}
                >
                  <TrashIcon className="h-4 w-4" />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
          <div className="h-2 w-2 rounded-full bg-green-500 shadow-sm shadow-green-500/50" />
          <span>AI Assistant Online</span>
        </div>
      </div>
    </motion.div>
  );
} 