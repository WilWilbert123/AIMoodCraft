import React from 'react';
import { JournalEntry as JournalEntryType } from '@/types';
import { JournalEntry } from './JournalEntry';
import { Card } from '@/components/ui/Card';
import { PenLine } from 'lucide-react';

interface EntryListProps {
  entries: JournalEntryType[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  emptyMessage?: string;
}

export const EntryList: React.FC<EntryListProps> = ({
  entries,
  onEdit,
  onDelete,
  emptyMessage = 'No journal entries yet'
}) => {
  if (entries.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-[32px] border border-black/10 bg-white p-8 text-center shadow-[0_28px_80px_-28px_rgba(0,0,0,0.28)] dark:border-white/10 dark:bg-neutral-950 sm:p-16">
        <div className="pointer-events-none absolute -left-12 -top-16 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/20" />
        <div className="pointer-events-none absolute -bottom-20 right-1/4 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/15" />
        <div className="relative z-10 flex flex-col items-center justify-center">
          <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-neutral-100 text-neutral-400 dark:bg-neutral-900 dark:text-neutral-500"><PenLine size={28} /></span>
          <h2 className="text-xl font-semibold tracking-tight text-neutral-950 dark:text-white sm:text-2xl">Your journal is waiting</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-neutral-600 dark:text-neutral-400">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => (
        <JournalEntry
          key={entry.id}
          entry={entry}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
