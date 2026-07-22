import React from 'react';
import { JournalEntry as JournalEntryType } from '@/types';
import { JournalEntry } from './JournalEntry';
import { Card } from '@/components/ui/Card';

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
      <Card className="p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
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