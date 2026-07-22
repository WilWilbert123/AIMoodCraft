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
    <Card className="hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{moodConfig.emoji}</span>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{entry.title}</h3>
            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600 capitalize dark:bg-gray-800 dark:text-gray-300">
              {entry.mood}
            </span>
          </div>

          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap dark:text-gray-300">
            {displayContent}
          </p>
          
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary-500 hover:text-primary-600 text-sm font-medium mt-2"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
          
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {format(new Date(entry.createdAt), 'MMM d, yyyy')}
            </span>
            {entry.sentiment && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                entry.sentiment.label === 'positive' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' :
                entry.sentiment.label === 'negative' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' :
                'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
              }`}>
                {entry.sentiment.label}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 flex-shrink-0">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(entry.id)}
              className="text-gray-500 hover:text-primary-500"
            >
              <Pencil size={16} />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(entry.id)}
              className="text-gray-500 hover:text-red-500"
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};