import React, { useState } from 'react';
import { format } from 'date-fns';
import { JournalEntry as JournalEntryType } from '@/types';
import { MOOD_CONFIG } from '@/utils/constants';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
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

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-[0_20px_60px_-24px_rgba(15,23,42,0.24)]" hover>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-3">
            <span className="rounded-2xl bg-slate-100/80 p-2 text-2xl shadow-sm dark:bg-slate-800/70">{moodConfig.emoji}</span>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{entry.title}</h3>
            <span className="rounded-full bg-slate-100/80 px-2.5 py-1 text-xs font-medium capitalize text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
              {entry.mood}
            </span>
          </div>

          <p className="whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300">
            {displayContent}
          </p>

          {shouldTruncate && (
            <button onClick={() => setIsExpanded(!isExpanded)} className="mt-2 text-sm font-medium text-violet-500 transition-colors hover:text-violet-600">
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {format(new Date(entry.createdAt), 'MMM d, yyyy')}
            </span>
            {entry.sentiment && (
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${entry.sentiment.label === 'positive' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : entry.sentiment.label === 'negative' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                {entry.sentiment.label}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-shrink-0 gap-2">
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={() => onEdit(entry.id)} className="text-slate-500 hover:text-violet-500">
              <Pencil size={16} />
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="sm" onClick={() => onDelete(entry.id)} className="text-slate-500 hover:text-rose-500">
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};