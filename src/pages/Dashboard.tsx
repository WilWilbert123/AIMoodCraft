import React from 'react';
import { useJournalStore } from '@/store/journalStore';
import { useMoodStore } from '@/store/moodStore';
import { Card } from '@/components/ui/Card';
import { MoodTimeline } from '@/components/mood/MoodTimeline';
import { AIInsights } from '@/components/ai/AIInsights';
import { getUserStats } from '@/utils/moodCalculator';
import { BookOpen, TrendingUp, Calendar, Smile } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { entries } = useJournalStore();
  const { moodHistory } = useMoodStore();
  const stats = getUserStats(moodHistory, entries);

  const statCards = [
    {
      icon: <BookOpen className="text-blue-500" size={24} />,
      label: 'Total Entries',
      value: stats.totalEntries
    },
    {
      icon: <TrendingUp className="text-green-500" size={24} />,
      label: 'Average Mood',
      value: stats.averageMood > 0 ? `${stats.averageMood}/7` : 'N/A'
    },
    {
      icon: <Calendar className="text-purple-500" size={24} />,
      label: 'Streak',
      value: `${stats.streakDays} days`
    },
    {
      icon: <Smile className="text-yellow-500" size={24} />,
      label: 'Most Common Mood',
      value: stats.mostCommonMood || 'N/A'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Last entry: {stats.lastEntryDate ? new Date(stats.lastEntryDate).toLocaleDateString() : 'Never'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 rounded-lg dark:bg-gray-800">{stat.icon}</div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">Recent Mood Timeline</h2>
          <MoodTimeline moodData={moodHistory.slice(0, 10)} />
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">AI Insights</h2>
          <AIInsights entries={entries} />
        </Card>
      </div>
    </div>
  );
};