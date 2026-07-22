import { Mood } from '@/types';

export const MOODS = {
  HAPPY: 'happy',
  SAD: 'sad',
  ANGRY: 'angry',
  ANXIOUS: 'anxious',
  CALM: 'calm',
  NEUTRAL: 'neutral',
  EXCITED: 'excited',
  TIRED: 'tired'
} as const;

export const MOOD_CONFIG: Record<Mood, { color: string; emoji: string; label: string }> = {
  happy: { color: '#4CAF50', emoji: '😊', label: 'Happy' },
  sad: { color: '#2196F3', emoji: '😢', label: 'Sad' },
  angry: { color: '#F44336', emoji: '😡', label: 'Angry' },
  anxious: { color: '#FF9800', emoji: '😰', label: 'Anxious' },
  calm: { color: '#9C27B0', emoji: '😌', label: 'Calm' },
  neutral: { color: '#9E9E9E', emoji: '😐', label: 'Neutral' },
  excited: { color: '#FF6B6B', emoji: '🤩', label: 'Excited' },
  tired: { color: '#795548', emoji: '😴', label: 'Tired' }
};

export const MOOD_OPTIONS = Object.entries(MOOD_CONFIG).map(([key, value]) => ({
  value: key as Mood,
  ...value
}));

export const STORAGE_KEYS = {
  JOURNAL_ENTRIES: 'moodcraft_entries',
  USER_PREFERENCES: 'moodcraft_preferences',
  MOOD_HISTORY: 'moodcraft_history'
};

export const APP_NAME = 'AI MoodCraft';
export const APP_DESCRIPTION = 'Smart journaling with AI-powered mood tracking';