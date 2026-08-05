import React, { useState } from 'react';
import { format } from 'date-fns';
import { JournalEntry as JournalEntryType } from '@/types';
import { MOOD_CONFIG } from '@/utils/constants';
import { Pencil, Trash2, Calendar } from 'lucide-react';

interface JournalEntryProps {
  entry: JournalEntryType;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const JournalEntry: React.FC<JournalEntryProps> = ({ entry, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const moodConfig = MOOD_CONFIG[entry.mood];

  const shouldTruncate = entry.content.length > 200;
  const displayContent = isExpanded || !shouldTruncate
    ? entry.content 
    : `${entry.content.slice(0, 200)}...`;

  // Helper function to map mood to tailwind gradient border
  const getBorderColor = (moodId: string) => {
    switch (moodId) {
      case 'happy':
      case 'excited': return 'hover:border-amber-400/60 dark:hover:border-amber-500/60 hover:shadow-amber-500/20';
      case 'calm':
      case 'neutral': return 'hover:border-emerald-400/60 dark:hover:border-emerald-500/60 hover:shadow-emerald-500/20';
      case 'sad':
      case 'tired': return 'hover:border-blue-400/60 dark:hover:border-blue-500/60 hover:shadow-blue-500/20';
      case 'angry':
      case 'anxious': return 'hover:border-rose-400/60 dark:hover:border-rose-500/60 hover:shadow-rose-500/20';
      default: return 'hover:border-violet-400/60 dark:hover:border-violet-500/60 hover:shadow-violet-500/20';
    }
  };

  const borderClass = getBorderColor(entry.mood);

  return (
    <div className={`group relative h-full w-full min-w-0 overflow-hidden rounded-[24px] border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/5 dark:bg-neutral-900/40 ${borderClass}`}>
      <div className="flex h-full flex-col">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-neutral-800 text-2xl">
              {moodConfig.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-semibold tracking-tight text-neutral-950 dark:text-white">
                {entry.title}
              </h3>
              <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                {moodConfig.label}
              </p>
            </div>
          </div>
          
          <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            {onEdit && (
              <button onClick={() => onEdit(entry.id)} className="rounded-xl p-2 text-neutral-400 transition hover:bg-black/5 hover:text-neutral-900 dark:hover:bg-white/10 dark:hover:text-white">
                <Pencil size={14} />
              </button>
            )}
            {onDelete && (
              <button onClick={() => onDelete(entry.id)} className="rounded-xl p-2 text-neutral-400 transition hover:bg-rose-500/10 hover:text-rose-600 dark:hover:bg-rose-500/20 dark:hover:text-rose-400">
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1">
          {entry.content ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
              {displayContent}
            </p>
          ) : (
            <p className="italic text-sm leading-relaxed text-neutral-400 dark:text-neutral-500">
              A quiet mood check-in.
            </p>
          )}

          {shouldTruncate && (
            <button type="button" onClick={() => setIsExpanded(!isExpanded)} className="mt-2 text-xs font-semibold text-violet-600 transition-colors hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300">
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-black/5 pt-4 dark:border-white/5">
          <span className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
            <Calendar size={13} />
            {format(new Date(entry.createdAt), 'MMM d, yyyy')}
          </span>
          {entry.sentiment && (
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
              entry.sentiment.label === 'positive' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 
              entry.sentiment.label === 'negative' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' : 
              'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400'
            }`}>
              {entry.sentiment.label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
