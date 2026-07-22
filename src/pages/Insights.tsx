import React from 'react';
import { useJournalStore } from '@/store/journalStore';
import { useMoodStore } from '@/store/moodStore';
import { Card } from '@/components/ui/Card';
import { AIInsights } from '@/components/ai/AIInsights';
import { SentimentAnalysis } from '@/components/ai/SentimentAnalysis';
import { MoodTimeline } from '@/components/mood/MoodTimeline';
import { getUserStats, getMoodDistribution } from '@/utils/moodCalculator';
import { MOOD_CONFIG } from '@/utils/constants';
import { BarChart3, PieChart, TrendingUp, Brain } from 'lucide-react';

export const Insights: React.FC = () => {
  const { entries } = useJournalStore();
  const { moodHistory } = useMoodStore();
  const stats = getUserStats(moodHistory, entries);
  const distribution = getMoodDistribution(moodHistory);

  const maxCount = Math.max(...Object.values(distribution), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Insights</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {entries.length} entries analyzed
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="text-primary-500" size={20} />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Mood Distribution</h2>
          </div>
          <div className="space-y-3">
            {Object.entries(distribution).map(([mood, count]) => {
              const config = MOOD_CONFIG[mood as keyof typeof MOOD_CONFIG];
              if (!config) return null;
              const percentage = (count / maxCount) * 100;
              return (
                <div key={mood}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-2">
                      <span>{config.emoji}</span>
                      <span className="capitalize">{mood}</span>
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(percentage, 5)}%`,
                        backgroundColor: config.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="text-purple-500" size={20} />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Statistics</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg dark:bg-gray-800">
              <span className="text-gray-600 dark:text-gray-300">Total Entries</span>
              <span className="font-semibold dark:text-gray-100">{stats.totalEntries}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg dark:bg-gray-800">
              <span className="text-gray-600 dark:text-gray-300">Average Mood</span>
              <span className="font-semibold dark:text-gray-100">{stats.averageMood > 0 ? `${stats.averageMood}/7` : 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg dark:bg-gray-800">
              <span className="text-gray-600 dark:text-gray-300">Streak</span>
              <span className="font-semibold dark:text-gray-100">{stats.streakDays} days</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg dark:bg-gray-800">
              <span className="text-gray-600 dark:text-gray-300">Most Common Mood</span>
              <span className="font-semibold capitalize dark:text-gray-100">{stats.mostCommonMood || 'N/A'}</span>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-green-500" size={20} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Mood Timeline</h2>
        </div>
        <MoodTimeline moodData={moodHistory.slice(0, 15)} />
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Brain className="text-purple-500" size={20} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AI Insights</h2>
        </div>
        <AIInsights entries={entries} />
      </Card>

      <Card>
        <SentimentAnalysis />
      </Card>
    </div>
  );
};