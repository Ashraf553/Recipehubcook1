import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Send, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAssistantStore } from '../stores/useAssistantStore';
import { ChatBubble } from '../components/ChatBubble';
import { TypingIndicator } from '../components/TypingIndicator';
import { IngredientChip } from '../components/IngredientChip';
import { GlassCard } from '../components/GlassCard';
import { cn } from '../lib/cn';
import type { DietaryRestriction } from '../data/types';

export default function Assistant() {
  const { t } = useTranslation('t');

  const restrictionLabels: Record<DietaryRestriction, string> = {
    vegan: t('restrictions.vegan'),
    vegetarian: t('restrictions.vegetarian'),
    'gluten-free': t('restrictions.gluten-free'),
    'lactose-free': t('restrictions.lactose-free'),
    'low-calorie': t('restrictions.low-calorie'),
    'nut-free': t('restrictions.nut-free'),
  };

  const quickPrompts = t('assistant.quick_prompts', { returnObjects: true }) as string[];

  const {
    messages,
    ingredients,
    isLoading,
    dietaryRestrictions,
    addIngredient,
    removeIngredient,
    toggleDietaryRestriction,
    sendToAI,
    clearChat,
  } = useAssistantStore();

  const [ingredientInput, setIngredientInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleAddIngredient = () => {
    if (!ingredientInput.trim()) return;
    addIngredient(ingredientInput);
    setIngredientInput('');
  };

  const handleSend = () => {
    if (isLoading) return;
    const text = textInput.trim();
    setTextInput('');
    sendToAI(text || undefined);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-7.5rem)] max-w-3xl flex-col px-4 md:h-[calc(100vh-7rem)]">
      <header className="mb-4">
        <p className="eyebrow mb-2 text-[var(--color-accent)]">{t('home.assistant_eyebrow')}</p>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">{t('assistant.title')}</h1>
        <p className="mt-1 text-[var(--color-text-secondary)]">{t('assistant.subtitle')}</p>
      </header>

      {/* Ingredients input */}
      <GlassCard className="mb-3 p-4">
        <p className="mb-2 text-sm font-semibold">{t('assistant.ingredients_label')}</p>
        <div className="mb-3 flex flex-wrap gap-2">
          <AnimatePresence initial={false}>
            {ingredients.map((ing) => (
              <IngredientChip key={ing} label={ing} onRemove={() => removeIngredient(ing)} />
            ))}
          </AnimatePresence>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIngredient())}
            placeholder={t('assistant.ingredient_placeholder')}
            aria-label={t('assistant.add')}
            className="flex-1 rounded-pill border border-[var(--color-line)] bg-[var(--color-bg-secondary)] px-4 py-2 text-sm outline-none transition-colors placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-accent)]"
          />
          <button
            type="button"
            onClick={handleAddIngredient}
            aria-label={t('assistant.add')}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-accent-contrast)] transition-colors hover:bg-[var(--color-text)]"
          >
            <Plus size={16} />
          </button>
        </div>

        <p className="mb-2 mt-4 text-sm font-semibold">{t('assistant.restrictions_label')}</p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(restrictionLabels) as DietaryRestriction[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => toggleDietaryRestriction(r)}
              className={cn(
                'cursor-pointer rounded-pill px-3 py-1 text-xs font-medium transition-colors duration-200',
                dietaryRestrictions.includes(r)
                  ? 'bg-[var(--color-accent)] text-[var(--color-accent-contrast)]'
                  : 'border border-[var(--color-line)] bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)]',
              )}
            >
              {restrictionLabels[r]}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Chat */}
      <div ref={scrollRef} className="no-scrollbar flex-1 space-y-4 overflow-y-auto px-1 py-2">
        {messages.map((m) => (
          <ChatBubble key={m.id} message={m} />
        ))}
        {isLoading && <TypingIndicator />}
      </div>

      {/* Quick prompts */}
      <div className="no-scrollbar mb-2 flex gap-2 overflow-x-auto py-1">
        {quickPrompts.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => sendToAI(p)}
            disabled={isLoading}
            className="shrink-0 cursor-pointer rounded-pill border border-[var(--color-line)] bg-[var(--color-surface)] px-3.5 py-1.5 text-xs font-medium transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-50"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="glass-strong flex items-center gap-2 rounded-pill p-1.5">
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={t('assistant.message_placeholder')}
          aria-label={t('assistant.send')}
          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-[var(--color-text-tertiary)]"
        />
        <button
          type="button"
          onClick={clearChat}
          aria-label={t('assistant.clear')}
          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text)]"
        >
          <Trash2 size={16} />
        </button>
        <button
          type="button"
          onClick={handleSend}
          disabled={isLoading || (!textInput.trim() && ingredients.length === 0)}
          aria-label={t('assistant.send')}
          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-accent-contrast)] transition-colors hover:bg-[var(--color-text)] disabled:opacity-50"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}
