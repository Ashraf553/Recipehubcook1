import { motion } from 'framer-motion';
import { ChefHat, User } from 'lucide-react';
import type { ChatMessage } from '../data/types';
import { cn } from '../lib/cn';

interface ChatBubbleProps {
  message: ChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className={cn('flex items-end gap-2', isUser && 'flex-row-reverse')}
    >
      <span
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[var(--color-accent-contrast)]',
          isUser ? 'bg-[var(--color-text-tertiary)]' : 'bg-[var(--color-accent)]',
        )}
        aria-hidden="true"
      >
        {isUser ? <User size={14} /> : <ChefHat size={14} />}
      </span>
      <div
        className={cn(
          'max-w-[78%] whitespace-pre-wrap rounded-glass px-4 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'rounded-br-glass-sm bg-[var(--color-accent)] text-[var(--color-accent-contrast)]'
            : 'card rounded-bl-glass-sm',
        )}
      >
        {message.content}
      </div>
    </motion.div>
  );
}
