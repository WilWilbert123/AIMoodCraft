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
  happy: { color: '#171717', emoji: '😊', label: 'Happy' },
  sad: { color: '#404040', emoji: '😢', label: 'Sad' },
  angry: { color: '#262626', emoji: '😡', label: 'Angry' },
  anxious: { color: '#525252', emoji: '😰', label: 'Anxious' },
  calm: { color: '#737373', emoji: '😌', label: 'Calm' },
  neutral: { color: '#A3A3A3', emoji: '😐', label: 'Neutral' },
  excited: { color: '#0A0A0A', emoji: '🤩', label: 'Excited' },
  tired: { color: '#666666', emoji: '😴', label: 'Tired' }
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
