import React, { useState, useEffect } from 'react';
import { Mood } from '@/types';
import { MoodSelector } from '@/components/mood/MoodSelector';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X } from 'lucide-react';

interface EntryFormProps {
  initialTitle?: string;
  initialContent?: string;
  initialMood?: Mood;
  onSubmit: (title: string, content: string, mood: Mood) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export const EntryForm: React.FC<EntryFormProps> = ({
  initialTitle = '',
  initialContent = '',
  initialMood,
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(initialMood || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
    setSelectedMood(initialMood || null);
  }, [initialTitle, initialContent, initialMood]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) {
      alert('Please select a mood');
      return;
    }
    if (!content.trim()) {
      alert('Please write some content');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(title || 'Untitled', content, selectedMood);
      if (!isEditing) {
        setTitle('');
        setContent('');
        setSelectedMood(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's on your mind?"
            fullWidth
          />
        </div>
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="mt-6"
          >
            <X size={20} />
          </Button>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-200">
          How are you feeling?
        </label>
        <MoodSelector
          selectedMood={selectedMood}
          onSelectMood={setSelectedMood}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-200">
          Journal Entry
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your thoughts here..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 min-h-[150px] resize-y dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 dark:placeholder-gray-500"
        />
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          fullWidth
        >
          {isEditing ? 'Update Entry' : 'Save Entry'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};