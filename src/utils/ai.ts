import { JournalEntry, Sentiment, AIInsight } from '@/types';

// Simulated AI analysis - In production, replace with actual AI API
export const analyzeSentiment = async (text: string): Promise<Sentiment> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const words = text.toLowerCase().split(/\s+/);
  const positiveWords = ['good', 'great', 'awesome', 'happy', 'love', 'excellent', 'wonderful', 'amazing', 'best', 'joy'];
  const negativeWords = ['bad', 'terrible', 'awful', 'sad', 'hate', 'horrible', 'worst', 'angry', 'anxious', 'fear'];
  
  let score = 0;
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    const cleanWord = word.replace(/[^a-zA-Z]/g, '');
    if (positiveWords.includes(cleanWord)) {
      score += 0.15;
      positiveCount++;
    }
    if (negativeWords.includes(cleanWord)) {
      score -= 0.15;
      negativeCount++;
    }
  });
  
  // Normalize score between -1 and 1
  score = Math.max(-1, Math.min(1, score));
  
  let label: 'positive' | 'negative' | 'neutral' = 'neutral';
  if (score > 0.2) label = 'positive';
  else if (score < -0.2) label = 'negative';
  
  const confidence = Math.min(0.95, Math.abs(score) + 0.2);
  
  return {
    score,
    label,
    confidence
  };
};

export const generateInsights = async (entries: JournalEntry[]): Promise<AIInsight[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const insights: AIInsight[] = [];
  
  if (entries.length === 0) {
    return [{
      id: '1',
      type: 'summary',
      content: 'Start your journaling journey! Write your first entry to get personalized insights.',
      date: new Date(),
      priority: 'medium'
    }];
  }
  
  // Analyze mood patterns
  const moods = entries.map(e => e.mood);
  const moodCount: Record<string, number> = {};
  moods.forEach(mood => {
    moodCount[mood] = (moodCount[mood] || 0) + 1;
  });
  
  const sortedMoods = Object.entries(moodCount).sort((a, b) => b[1] - a[1]);
  const mostCommonMood = sortedMoods[0];
  
  if (mostCommonMood && mostCommonMood[1] > entries.length / 3) {
    insights.push({
      id: '2',
      type: 'pattern',
      content: `You've been feeling "${mostCommonMood[0]}" frequently. ${getMoodSuggestion(mostCommonMood[0] as any)}`,
      date: new Date(),
      priority: 'high'
    });
  }
  
  // Analyze sentiment trends
  const recentEntries = entries.slice(0, 5);
  const positiveEntries = recentEntries.filter(e => e.sentiment?.label === 'positive');
  const negativeEntries = recentEntries.filter(e => e.sentiment?.label === 'negative');
  
  if (negativeEntries.length > positiveEntries.length && negativeEntries.length > 2) {
    insights.push({
      id: '3',
      type: 'alert',
      content: 'I notice you\'ve been feeling down lately. Remember to take care of yourself. Would you like some relaxation suggestions?',
      date: new Date(),
      priority: 'high'
    });
  }
  
  // Check for writing consistency
  if (entries.length >= 7) {
    const dates = entries.map(e => new Date(e.createdAt).toDateString());
    const uniqueDates = new Set(dates);
    
    if (uniqueDates.size >= 5) {
      insights.push({
        id: '4',
        type: 'recommendation',
        content: `Great consistency! You've written ${entries.length} entries. Keep up the good work! 🌟`,
        date: new Date(),
        priority: 'low'
      });
    }
  }
  
  // Add a general insight if we have few insights
  if (insights.length < 2 && entries.length > 0) {
    const averageMoodScore = getAverageMoodScore(entries);
    const averageMoodLabel = getAverageMoodLabel(averageMoodScore);
    insights.push({
      id: '5',
      type: 'summary',
      content: `You have ${entries.length} journal entries. Your average mood is ${averageMoodScore.toFixed(1)}/7 (${averageMoodLabel}). Keep writing!`,
      date: new Date(),
      priority: 'medium'
    });
  }
  
  return insights;
};

const getMoodSuggestion = (mood: string): string => {
  const suggestions: Record<string, string> = {
    'happy': 'Consider what\'s making you happy and how you can incorporate more of those activities into your daily life.',
    'sad': 'It\'s okay to feel sad. Try some self-care activities or talk to someone you trust.',
    'angry': 'Take a deep breath. Consider journaling about what\'s bothering you or going for a walk.',
    'anxious': 'Try some mindfulness exercises or deep breathing. Remember that anxiety is temporary.',
    'calm': 'Great! You\'re in a good place. Consider practicing gratitude or meditation.',
    'neutral': 'Neutral days are normal. Maybe try something new to spark some excitement.',
    'excited': 'Channel that excitement into something productive or creative!',
    'tired': 'Make sure to get enough rest. Your mental health is important.'
  };
  return suggestions[mood] || 'Keep journaling and taking care of yourself.';
};

const getAverageMoodScore = (entries: JournalEntry[]): number => {
  const moodValues: Record<string, number> = {
    excited: 7,
    happy: 6,
    calm: 5,
    neutral: 4,
    anxious: 3,
    sad: 2,
    tired: 1,
    angry: 0
  };

  const sum = entries.reduce((acc, e) => acc + (moodValues[e.mood] || 0), 0);
  return Number((sum / entries.length).toFixed(1));
};

const getAverageMoodLabel = (avg: number): string => {
  if (avg >= 5.5) return 'positive';
  if (avg >= 4) return 'neutral';
  return 'needs attention';
};