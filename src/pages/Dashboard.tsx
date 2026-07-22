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
      icon: <BookOpen className="text-violet-500" size={22} />,
      label: 'Total Entries',
      value: stats.totalEntries
    },
    {
      icon: <TrendingUp className="text-emerald-500" size={22} />,
      label: 'Average Mood',
      value: stats.averageMood > 0 ? `${stats.averageMood}/7` : 'N/A'
    },
    {
      icon: <Calendar className="text-sky-500" size={22} />,
      label: 'Streak',
      value: `${stats.streakDays} days`
    },
    {
      icon: <Smile className="text-amber-500" size={22} />,
      label: 'Most Common Mood',
      value: stats.mostCommonMood || 'N/A'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 rounded-[32px] border border-white/60 bg-white/70 p-6 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.24)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/70 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-violet-500">Today’s pulse</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Dashboard</h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Last entry: {stats.lastEntryDate ? new Date(stats.lastEntryDate).toLocaleDateString() : 'Never'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="p-4" hover>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100/80 p-2.5 dark:bg-slate-800/70">{stat.icon}</div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5" hover>
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Mood Timeline</h2>
          <MoodTimeline moodData={moodHistory.slice(0, 10)} />
        </Card>

        <Card className="p-5" hover>
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">AI Insights</h2>
          <AIInsights entries={entries} />
        </Card>
      </div>
    </div>
  );
};