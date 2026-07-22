import { Mood, MoodData, UserStats } from '@/types';

export const calculateAverageMood = (moods: MoodData[]): number => {
  if (moods.length === 0) return 0;
  
  const moodValues: Record<Mood, number> = {
    excited: 7,
    happy: 6,
    calm: 5,
    neutral: 4,
    anxious: 3,
    sad: 2,
    tired: 1,
    angry: 0
  };
  
  const total = moods.reduce((sum, data) => 
    sum + (moodValues[data.mood] || 0), 0
  );
  
  return Number((total / moods.length).toFixed(1));
};

export const getMoodDistribution = (moods: MoodData[]): Record<Mood, number> => {
  const distribution: Record<Mood, number> = {
    happy: 0,
    sad: 0,
    angry: 0,
    anxious: 0,
    calm: 0,
    neutral: 0,
    excited: 0,
    tired: 0
  };
  
  moods.forEach(data => {
    distribution[data.mood] = (distribution[data.mood] || 0) + 1;
  });
  
  return distribution;
};

export const getMoodTrend = (moods: MoodData[], days: number): MoodData[] => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return moods.filter(data => data.date >= cutoff);
};

export const calculateStreak = (moods: MoodData[]): number => {
  if (moods.length === 0) return 0;
  
  const sorted = [...moods].sort((a, b) => b.date.getTime() - a.date.getTime());
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (const mood of sorted) {
    const moodDate = new Date(mood.date);
    moodDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((currentDate.getTime() - moodDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === streak) {
      streak++;
    } else if (diffDays > streak) {
      break;
    }
  }
  
  return streak;
};

export const getMostCommonMood = (moods: MoodData[]): Mood | null => {
  if (moods.length === 0) return null;
  
  const distribution = getMoodDistribution(moods);
  const maxCount = Math.max(...Object.values(distribution));
  const mostCommon = Object.entries(distribution).find(([_, count]) => count === maxCount);
  
  return mostCommon ? mostCommon[0] as Mood : null;
};

export const getUserStats = (moods: MoodData[], entries: any[]): UserStats => {
  const distribution = getMoodDistribution(moods);
  const mostCommon = getMostCommonMood(moods);
  const streak = calculateStreak(moods);
  const averageMood = calculateAverageMood(moods);
  
  return {
    totalEntries: entries.length,
    averageMood,
    moodDistribution: distribution,
    mostCommonMood: mostCommon,
    streakDays: streak,
    lastEntryDate: moods.length > 0 ? moods[0].date : null
  };
};