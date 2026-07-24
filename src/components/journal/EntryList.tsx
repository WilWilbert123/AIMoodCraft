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
      <Card className="p-8 text-center sm:p-12">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300"><PenLine size={24} /></span>
        <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Your journal is waiting</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">{emptyMessage}</p>
      </Card>
    );
  }

  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:gap-5">
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
