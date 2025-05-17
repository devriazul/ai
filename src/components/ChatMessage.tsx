'use client';

import { cn } from '@/lib/utils';
import { Message } from '@/types/chat';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx';
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';
import javascript from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript';
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json';
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css';
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';

// Register languages
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('bash', bash);

interface ChatMessageProps {
  message: Message;
  isLastMessage?: boolean;
}

export function ChatMessage({ message, isLastMessage }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const timestamp = new Date(message.timestamp).toLocaleTimeString();
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLastMessage && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isLastMessage]);

  const renderMessage = (content: string) => {
    // Simple markdown-like formatting
    const formattedContent = content
      .split('\n')
      .map((line: string, i: number) => {
        // Handle code blocks
        if (line.startsWith('```')) {
          const language = line.slice(3).trim();
          const codeBlock = content
            .split('```')
            .find((block: string, index: number) => index % 2 === 1 && block.startsWith(language));
          
          if (codeBlock) {
            const code = codeBlock.slice(language.length).trim();
            return (
              <SyntaxHighlighter
                key={i}
                language={language}
                style={vscDarkPlus}
                customStyle={{
                  margin: '1em 0',
                  borderRadius: '0.5rem',
                  padding: '1.25em',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  backgroundColor: '#1E1E1E',
                }}
              >
                {code}
              </SyntaxHighlighter>
            );
          }
        }
        
        // Handle inline code
        if (line.includes('`')) {
          const parts = line.split('`');
          return (
            <p key={i} className="text-gray-700 leading-relaxed">
              {parts.map((part, j) => (
                j % 2 === 1 ? (
                  <code key={j} className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-900 border border-gray-200">
                    {part}
                  </code>
                ) : part
              ))}
            </p>
          );
        }

        // Handle lists
        if (line.trim().match(/^\d+\.\s/)) {
          return (
            <li key={i} className="text-gray-700 leading-relaxed pl-1">
              {line.replace(/^\d+\.\s/, '')}
            </li>
          );
        }
        if (line.trim().startsWith('- ')) {
          return (
            <li key={i} className="text-gray-700 leading-relaxed pl-1">
              {line.replace(/^-\s/, '')}
            </li>
          );
        }

        // Regular text
        return <p key={i} className="text-gray-700 leading-relaxed">{line}</p>;
      });

    return formattedContent;
  };

  return (
    <motion.div
      ref={messageRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'group relative flex w-full items-start gap-4 px-6 py-4',
        isUser ? 'bg-gray-50/80' : 'bg-white',
        'hover:bg-opacity-90 transition-colors duration-200 border-b border-gray-100'
      )}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className={cn(
          "flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full shadow-lg",
          isUser ? "bg-gradient-to-br from-blue-500 to-blue-600" : "bg-gradient-to-br from-purple-500 to-pink-500"
        )}
      >
        {isUser ? (
          <UserCircleIcon className="h-6 w-6 text-white" />
        ) : (
          <img
            src="/devriazul-profile.jpg"
            alt="DevRiazul Profile Icon"
            className="h-full w-full rounded-full object-cover"
          />
        )}
      </motion.div>

      <div className="flex-1 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={cn(
              "text-sm font-semibold",
              isUser ? "text-blue-600" : "text-purple-600"
            )}
          >
            {isUser ? 'You' : 'Devriazul Ai'}
          </motion.p>
          <div className="flex items-center gap-2 min-w-fit">
            <motion.p
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xs font-medium text-gray-500"
            >
              {timestamp}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <button
                onClick={() => navigator.clipboard.writeText(message.content)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                title="Copy message"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                  />
                </svg>
              </button>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="prose prose-sm max-w-none dark:prose-invert prose-pre:bg-gray-900 prose-pre:p-0 prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-li:leading-relaxed"
        >
          {renderMessage(message.content)}
        </motion.div>
      </div>
    </motion.div>
  );
} 