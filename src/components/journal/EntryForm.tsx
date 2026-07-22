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
          <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="mt-6">
            <X size={18} />
          </Button>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
          How are you feeling?
        </label>
        <MoodSelector selectedMood={selectedMood} onSelectMood={setSelectedMood} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
          Journal Entry
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your thoughts here..."
          className="min-h-[160px] w-full resize-y rounded-[20px] border border-slate-200/80 bg-white/80 px-4 py-3 text-slate-900 placeholder:text-slate-400 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.32)] transition-all duration-200 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-violet-500/20"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" variant="primary" isLoading={isSubmitting} fullWidth>
          {isEditing ? 'Update Entry' : 'Save Entry'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};