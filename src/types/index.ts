export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: Mood;
  createdAt: Date;
  updatedAt: Date;
  sentiment?: Sentiment;
  tags?: string[];
}

export type Mood = 'happy' | 'sad' | 'angry' | 'anxious' | 'calm' | 'neutral' | 'excited' | 'tired';

export interface Sentiment {
  score: number;
  label: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

export interface MoodData {
  date: Date;
  mood: Mood;
  note?: string;
  intensity?: number;
}

export interface AIInsight {
  id: string;
  type: 'pattern' | 'recommendation' | 'summary' | 'alert';
  content: string;
  date: Date;
  priority?: 'low' | 'medium' | 'high';
}

export interface UserStats {
  totalEntries: number;
  averageMood: number;
  moodDistribution: Record<Mood, number>;
  mostCommonMood: Mood | null;
  streakDays: number;
  lastEntryDate: Date | null;
}