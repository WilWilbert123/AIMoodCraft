import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useJournalStore } from '@/store/journalStore';
import { useMoodStore } from '@/store/moodStore';
import { Card } from '@/components/ui/Card';
import { MoodTimeline } from '@/components/mood/MoodTimeline';
import { AIInsights } from '@/components/ai/AIInsights';
import { getUserStats } from '@/utils/moodCalculator';
import { MOOD_OPTIONS } from '@/utils/constants';
import { BookOpen, TrendingUp, CalendarDays, ArrowRight } from 'lucide-react';
import { format, isSameDay, subDays } from 'date-fns';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { entries } = useJournalStore();
  const { moodHistory } = useMoodStore();
  const stats = getUserStats(moodHistory, entries);
  const weekStart = subDays(new Date(), 6);
  const weekEntries = entries.filter((entry) => new Date(entry.createdAt) >= weekStart);
  const weekMoodCounts = weekEntries.reduce<Record<string, number>>((counts, entry) => {
    counts[entry.mood] = (counts[entry.mood] ?? 0) + 1;
    return counts;
  }, {});
  const weekMood = Object.entries(weekMoodCounts).sort(([, first], [, second]) => second - first)[0]?.[0];
  const weekMoodOption = MOOD_OPTIONS.find((mood) => mood.value === weekMood);
  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = subDays(new Date(), 6 - index);
    const entry = entries.find((item) => isSameDay(new Date(item.createdAt), date));
    return { date, entry };
  });

  const statCards = [
    { icon: <BookOpen size={18} />, label: 'Journal entries', value: stats.totalEntries, accent: 'text-violet-600 bg-violet-100/80 dark:bg-violet-500/15 dark:text-violet-300' },
    { icon: <TrendingUp size={18} />, label: 'Average mood', value: stats.averageMood > 0 ? `${stats.averageMood}/7` : '—', accent: 'text-cyan-600 bg-cyan-100/80 dark:bg-cyan-500/15 dark:text-cyan-300' },
    { icon: <CalendarDays size={18} />, label: 'Current streak', value: `${stats.streakDays} days`, accent: 'text-amber-600 bg-amber-100/80 dark:bg-amber-500/15 dark:text-amber-300' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="relative overflow-hidden rounded-[32px] border border-black/10 bg-white p-6 text-neutral-950 shadow-[0_28px_80px_-28px_rgba(0,0,0,0.28)] dark:border-white/10 dark:bg-neutral-950 dark:text-white sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-black/[0.035] blur-2xl dark:bg-white/[0.07]" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-black/[0.025] blur-3xl dark:bg-white/[0.04]" />
        <div className="relative max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.045] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] dark:border-white/15 dark:bg-white/10">
            Your private reflection space
          </div>
          <p className="text-sm font-medium text-neutral-700 dark:text-white/75">Today’s check-in</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-950 dark:text-white sm:text-4xl">How are you feeling today?</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-700 dark:text-white/75 sm:text-base">Choose a feeling to begin a thoughtful entry. Every small check-in helps reveal your bigger picture.</p>

          <div className="mt-6 grid grid-cols-4 gap-2 sm:flex sm:flex-wrap">
            {MOOD_OPTIONS.map((mood) => (
              <button
                key={mood.value}
                type="button"
                onClick={() => navigate(`/journal?new=1&mood=${mood.value}`)}
                className="group flex min-h-12 flex-col items-center justify-center rounded-2xl border border-black/10 bg-black/[0.045] px-2 py-2 text-neutral-950 transition duration-200 hover:-translate-y-0.5 hover:bg-black/[0.09] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:focus:ring-white dark:focus:ring-offset-neutral-950 sm:min-w-16"
                aria-label={`Start a ${mood.label.toLowerCase()} journal entry`}
              >
                <span className="text-xl transition-transform duration-200 group-hover:scale-110">{mood.emoji}</span>
                <span className="mt-1 hidden text-[11px] font-medium sm:block">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.label} className="p-4 sm:p-5" hover>
            <div className="flex items-center gap-3">
              <span className={`grid h-11 w-11 place-items-center rounded-2xl ${stat.accent}`}>{stat.icon}</span>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="mt-0.5 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3" padding="lg">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-500">Your rhythm</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">Recent mood check-ins</h2>
            </div>
            <button type="button" onClick={() => navigate('/insights')} className="inline-flex min-h-11 items-center gap-1 rounded-xl px-2 text-sm font-semibold text-violet-600 transition hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-500/10">
              Insights <ArrowRight size={16} />
            </button>
          </div>
          <MoodTimeline moodData={moodHistory.slice(0, 5)} limit={5} />
        </Card>

        <Card className="lg:col-span-2" padding="lg">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-300">Gentle guidance</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">A moment for you</h2>
          </div>
          <AIInsights entries={entries} />
        </Card>
      </section>

      <section className="overflow-hidden rounded-[32px] border border-black/10 bg-white p-5 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.22)] dark:border-white/10 dark:bg-neutral-950 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-600 dark:text-neutral-300">Your week in review</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white">Small moments, clearer patterns.</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              {weekEntries.length === 0
                ? 'Start with one check-in today and your weekly rhythm will begin to take shape.'
                : `You captured ${weekEntries.length} ${weekEntries.length === 1 ? 'moment' : 'moments'} this week${weekMoodOption ? `, with ${weekMoodOption.label.toLowerCase()} appearing most often` : ''}.`}
            </p>
          </div>
          <button type="button" onClick={() => navigate('/insights')} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-black/10 bg-neutral-950 px-4 text-sm font-semibold text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 dark:border-white/15 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 dark:focus:ring-white dark:focus:ring-offset-neutral-950">
            Explore insights <ArrowRight size={16} />
          </button>
        </div>

        <div className="mt-7 grid grid-cols-7 gap-2 border-t border-black/10 pt-5 dark:border-white/10 sm:gap-3">
          {weekDays.map(({ date, entry }) => (
            <div key={date.toISOString()} className="min-w-0 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500 dark:text-neutral-400">{format(date, 'EEE')}</p>
              <div className={`mx-auto mt-2 grid h-10 w-10 place-items-center rounded-2xl border text-lg sm:h-12 sm:w-12 sm:text-xl ${entry ? 'border-black/10 bg-neutral-100 dark:border-white/10 dark:bg-neutral-900' : 'border-dashed border-neutral-300 bg-neutral-50 text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900/40 dark:text-neutral-600'}`} title={entry ? `${entry.mood} entry` : 'No entry'}>
                {entry ? MOOD_OPTIONS.find((mood) => mood.value === entry.mood)?.emoji : '—'}
              </div>
              <p className="mt-2 truncate text-[11px] font-medium text-neutral-600 dark:text-neutral-300">{format(date, 'd')}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
