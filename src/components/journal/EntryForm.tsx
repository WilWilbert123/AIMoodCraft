import React, { useState, useEffect } from 'react';
import { Mood } from '@/types';
import { MoodSelector } from '@/components/mood/MoodSelector';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';
import { MOOD_CONFIG } from '@/utils/constants';

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
  const MOOD_PROMPTS: Record<string, { title: string, suggestions: string[] }> = {
    happy: {
      title: 'What brought a little brightness to your day?',
      suggestions: ["A small win I had was...", "I really enjoyed...", "Someone who made me smile was..."]
    },
    sad: {
      title: 'What feels heavy right now, and what might help?',
      suggestions: ["Right now, I'm struggling with...", "One thing that might comfort me is...", "I just need to let out that..."]
    },
    angry: {
      title: 'What happened, and what do you need in this moment?',
      suggestions: ["I am so frustrated because...", "To cool down, I could...", "What triggered me was..."]
    },
    anxious: {
      title: 'What is within your control today?',
      suggestions: ["One small thing I can control is...", "My mind is racing about...", "I need to remind myself that..."]
    },
    calm: {
      title: 'What helped you find this moment of calm?',
      suggestions: ["I feel grounded because...", "My favorite part of today was...", "I want to remember this feeling of..."]
    },
    neutral: {
      title: 'What is one detail you want to remember today?',
      suggestions: ["A random thought I had:", "Today was mostly...", "One thing I noticed was..."]
    },
    excited: {
      title: 'What are you looking forward to most?',
      suggestions: ["I can't wait for...", "My energy is high because...", "The best thing about this is..."]
    },
    tired: {
      title: 'What would help you recharge gently?',
      suggestions: ["My body is telling me to...", "Tonight, I will...", "I feel drained from..."]
    }
  };

  const defaultPrompt = {
    title: 'Choose a feeling, or pick a prompt below to get started:',
    suggestions: [
      "What's been on your mind lately?",
      "Describe a small win or moment of joy today.",
      "What is something you're grateful for right now?",
      "If today was a chapter in a book, what would it be called?"
    ]
  };

  const currentPrompt = selectedMood ? MOOD_PROMPTS[selectedMood] : defaultPrompt;

  const defaultTitles = [
    "Morning Thoughts",
    "Midday Check-in",
    "Evening Reflection",
    "Just venting"
  ];

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
    <div className="relative mb-8 overflow-hidden rounded-[32px] border border-black/5 bg-white/70 p-6 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-neutral-900/70 sm:p-10">
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute -left-10 -top-10 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/15" />
      <div className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/15" />

      <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Give this moment a title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="A few words are enough..."
            className="w-full rounded-2xl border-none bg-black/5 px-5 py-4 text-lg font-medium text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:bg-white/5 dark:text-white dark:placeholder:text-neutral-600 dark:focus:bg-neutral-950"
          />
          {!title && (
            <div className="mt-3 flex flex-wrap gap-2">
              {defaultTitles.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTitle(t)}
                  className="rounded-lg bg-black/5 px-2.5 py-1 text-xs font-medium text-neutral-600 transition hover:bg-black/10 hover:text-neutral-900 dark:bg-white/5 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="mt-6">
            <X size={18} />
          </Button>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
          How are you feeling right now?
        </label>
        <MoodSelector selectedMood={selectedMood} onSelectMood={setSelectedMood} />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Your reflection <span className="font-normal text-neutral-400">(optional)</span>
          </label>
          {selectedMood && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
              {MOOD_CONFIG[selectedMood].emoji} {MOOD_CONFIG[selectedMood].label}
            </span>
          )}
        </div>
        
        {/* Pulsing AI Prompt Box */}
        <div className="group relative mb-4 overflow-hidden rounded-2xl bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10 p-1">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-cyan-500/20 opacity-0 blur transition-opacity duration-1000 group-hover:opacity-100" />
          <div className="relative flex flex-col gap-3 rounded-xl bg-white/80 px-4 py-3 backdrop-blur-md dark:bg-neutral-950/80">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-sm">
                ✨
              </span>
              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                {currentPrompt.title}
              </p>
            </div>
            
            <div className="mt-2 flex flex-wrap gap-2">
              {currentPrompt.suggestions.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (!content) setContent(prompt + '\n');
                  }}
                  className="rounded-lg border border-violet-200 bg-violet-50/50 px-3 py-1.5 text-xs font-medium text-violet-700 transition hover:bg-violet-100 hover:text-violet-800 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300 dark:hover:bg-violet-500/20"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write freely — this space is yours."
          className="min-h-[220px] w-full resize-y rounded-[24px] border border-black/5 bg-white/50 px-6 py-5 text-base leading-relaxed text-neutral-900 placeholder:text-neutral-400 shadow-inner backdrop-blur-md transition-all duration-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:border-white/5 dark:bg-neutral-950/50 dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus:bg-neutral-900"
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
    </div>
  );
};
