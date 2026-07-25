import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useJournalStore } from '@/store/journalStore';
import { useMoodStore } from '@/store/moodStore';
import { Card } from '@/components/ui/Card';
import { AIInsights } from '@/components/ai/AIInsights';
import { SentimentAnalysis } from '@/components/ai/SentimentAnalysis';
import { MoodTimeline } from '@/components/mood/MoodTimeline';
import { getUserStats, getMoodDistribution } from '@/utils/moodCalculator';
import { MOOD_CONFIG } from '@/utils/constants';
import { Mood } from '@/types';
import { format, subDays } from 'date-fns';
import { BarChart3, Brain, CalendarDays, TrendingUp, ArrowUpRight, ArrowDownRight, Minus, CalendarRange } from 'lucide-react';

export const Insights: React.FC = () => {
  const navigate = useNavigate();
  const { entries } = useJournalStore();
  const { moodHistory } = useMoodStore();
  const stats = getUserStats(moodHistory, entries);
  const distribution = getMoodDistribution(moodHistory);
  const maxCount = Math.max(...Object.values(distribution), 1);
  const commonMood = stats.mostCommonMood ? MOOD_CONFIG[stats.mostCommonMood] : null;
  const moodValues: Record<Mood, number> = { excited: 7, happy: 6, calm: 5, neutral: 4, anxious: 3, sad: 2, tired: 1, angry: 0 };
  const now = new Date();
  const sevenDaysAgo = subDays(now, 7);
  const fourteenDaysAgo = subDays(now, 14);
  const currentWeekEntries = entries.filter((entry) => new Date(entry.createdAt) >= sevenDaysAgo);
  const previousWeekEntries = entries.filter((entry) => {
    const date = new Date(entry.createdAt);
    return date >= fourteenDaysAgo && date < sevenDaysAgo;
  });
  const getAverage = (items: typeof entries) => items.length === 0 ? null : items.reduce((total, entry) => total + moodValues[entry.mood], 0) / items.length;
  const currentAverage = getAverage(currentWeekEntries);
  const previousAverage = getAverage(previousWeekEntries);
  const weekDifference = currentAverage !== null && previousAverage !== null ? Number((currentAverage - previousAverage).toFixed(1)) : null;
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekdayPatterns = weekdays.map((day) => {
    const dayEntries = entries.filter((entry) => format(new Date(entry.createdAt), 'EEE') === day);
    const average = getAverage(dayEntries);
    const common = dayEntries.length === 0
      ? null
      : dayEntries.reduce<Record<Mood, number>>((counts, entry) => ({ ...counts, [entry.mood]: (counts[entry.mood] ?? 0) + 1 }), {} as Record<Mood, number>);
    const mood = common ? Object.entries(common).sort(([, first], [, second]) => second - first)[0]?.[0] as Mood | undefined : undefined;
    return { day, count: dayEntries.length, average, mood };
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="overflow-hidden rounded-[32px] border border-white/70 bg-white/75 p-6 shadow-[0_24px_70px_-30px_rgba(15,23,42,0.28)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/70 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-500">Your mood story</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Patterns worth noticing.</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">A calm overview of the reflections you’ve captured so far.</p>
          </div>
          <div className="rounded-2xl bg-violet-50 px-4 py-3 text-sm text-violet-800 dark:bg-violet-500/10 dark:text-violet-200">
            <span className="font-semibold">{entries.length}</span> {entries.length === 1 ? 'entry' : 'entries'} analyzed
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Entries', value: stats.totalEntries, icon: <Brain size={18} />, color: 'text-violet-600 bg-violet-100 dark:bg-violet-500/15 dark:text-violet-300' },
          { label: 'Average mood', value: stats.averageMood > 0 ? `${stats.averageMood}/7` : '—', icon: <TrendingUp size={18} />, color: 'text-cyan-600 bg-cyan-100 dark:bg-cyan-500/15 dark:text-cyan-300' },
          { label: 'Streak', value: `${stats.streakDays} days`, icon: <CalendarDays size={18} />, color: 'text-amber-600 bg-amber-100 dark:bg-amber-500/15 dark:text-amber-300' },
          { label: 'Most common', value: commonMood ? `${commonMood.emoji} ${commonMood.label}` : '—', icon: <BarChart3 size={18} />, color: 'text-rose-600 bg-rose-100 dark:bg-rose-500/15 dark:text-rose-300' },
        ].map((stat) => (
          <Card key={stat.label} className="p-4" hover>
            <span className={`mb-3 grid h-10 w-10 place-items-center rounded-xl ${stat.color}`}>{stat.icon}</span>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="mt-1 truncate text-lg font-semibold tracking-tight text-slate-900 dark:text-white">{stat.value}</p>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2" padding="lg">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-600 dark:text-neutral-300">Week over week</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-neutral-950 dark:text-white">Your mood trend</h2>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-white"><TrendingUp size={19} /></span>
          </div>
          <div className="mt-6 rounded-2xl border border-black/10 bg-neutral-50 p-4 dark:border-white/10 dark:bg-neutral-900">
            {weekDifference === null ? (
              <div>
                <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">Write entries across two weeks to unlock your comparison.</p>
                <button type="button" onClick={() => navigate('/journal?new=1')} className="mt-3 inline-flex min-h-10 items-center rounded-xl border border-black/10 bg-white px-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 dark:border-white/10 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-800 dark:focus:ring-white dark:focus:ring-offset-neutral-900">
                  Write an entry
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-neutral-950 shadow-sm dark:bg-black dark:text-white">
                  {weekDifference > 0 ? <ArrowUpRight size={20} /> : weekDifference < 0 ? <ArrowDownRight size={20} /> : <Minus size={20} />}
                </span>
                <div>
                  <p className="text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white">{weekDifference > 0 ? '+' : ''}{weekDifference}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">points compared with last week</p>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm"><span className="text-neutral-600 dark:text-neutral-300">This week</span><strong className="text-neutral-950 dark:text-white">{currentAverage === null ? '—' : `${currentAverage.toFixed(1)}/7`}</strong></div>
          <div className="mt-2 flex items-center justify-between text-sm"><span className="text-neutral-600 dark:text-neutral-300">Last week</span><strong className="text-neutral-950 dark:text-white">{previousAverage === null ? '—' : `${previousAverage.toFixed(1)}/7`}</strong></div>
        </Card>

        <Card className="lg:col-span-3" padding="lg">
          <div className="flex items-start justify-between gap-3">
            <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-600 dark:text-neutral-300">Your rhythm</p><h2 className="mt-1 text-xl font-semibold tracking-tight text-neutral-950 dark:text-white">Day-of-week patterns</h2></div>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-white"><CalendarRange size={19} /></span>
          </div>
          <div className="mt-6 grid grid-cols-7 gap-2 sm:gap-3">
            {weekdayPatterns.map((pattern) => (
              <div key={pattern.day} className="min-w-0 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500 dark:text-neutral-400">{pattern.day}</p>
                <div className="mx-auto mt-2 grid h-10 w-10 place-items-center rounded-2xl border border-black/10 bg-neutral-50 text-lg dark:border-white/10 dark:bg-neutral-900 sm:h-12 sm:w-12 sm:text-xl" title={pattern.count ? `${pattern.count} entries, average mood ${pattern.average?.toFixed(1)}/7` : 'No entries yet'}>
                  {pattern.mood ? MOOD_CONFIG[pattern.mood].emoji : '—'}
                </div>
                <p className="mt-2 text-[11px] font-medium text-neutral-600 dark:text-neutral-300">{pattern.count ? `${pattern.average?.toFixed(1)}/7` : '—'}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-neutral-600 dark:text-neutral-300">Each day shows your most common mood and average score based on all entries written on that weekday.</p>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3" padding="lg">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300"><BarChart3 size={19} /></span>
            <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-500">At a glance</p><h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">Mood distribution</h2></div>
          </div>
          <div className="space-y-4">
            {Object.entries(distribution).map(([mood, count]) => {
              const config = MOOD_CONFIG[mood as keyof typeof MOOD_CONFIG];
              if (!config) return null;
              return (
                <div key={mood}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-200"><span className="grid h-7 w-7 place-items-center rounded-lg bg-slate-100 dark:bg-slate-800">{config.emoji}</span>{config.label}</span>
                    <span className="font-semibold tabular-nums text-slate-500 dark:text-slate-400">{count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${count === 0 ? 0 : Math.max((count / maxCount) * 100, 8)}%`, backgroundColor: config.color }} /></div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="lg:col-span-2" padding="lg">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-600 dark:text-cyan-300">Reflect & reset</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">Personal guidance</h2>
          <div className="mt-5"><AIInsights entries={entries} /></div>
        </Card>
      </section>

      <Card padding="lg">
        <div className="mb-5 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-100 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-300"><TrendingUp size={19} /></span><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-600 dark:text-cyan-300">Over time</p><h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">Mood timeline</h2></div></div>
        <MoodTimeline moodData={moodHistory.slice(0, 15)} />
      </Card>

      <Card padding="lg"><SentimentAnalysis /></Card>
    </div>
  );
};
