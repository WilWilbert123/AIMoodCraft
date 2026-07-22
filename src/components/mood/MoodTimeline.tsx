import React from 'react';
import { format } from 'date-fns';
import { MoodData } from '@/types';
import { MOOD_CONFIG } from '@/utils/constants';

interface MoodTimelineProps {
  moodData: MoodData[];
  limit?: number;
}

export const MoodTimeline: React.FC<MoodTimelineProps> = ({ moodData, limit = 10 }) => {
  const data = moodData.slice(0, limit);

  return (
    <div className="space-y-3">
      {data.length === 0 ? (
        <p className="py-4 text-center text-slate-500">No mood data yet</p>
      ) : (
        data.map((item, index) => {
          const config = MOOD_CONFIG[item.mood];
          return (
            <div
              key={index}
              className="flex items-center gap-4 rounded-[20px] border border-slate-200/80 bg-white/70 p-3 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.32)] animate-slide-up backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/70"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="rounded-2xl bg-slate-100/80 p-2 text-2xl dark:bg-slate-800/70">{config.emoji}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium capitalize text-slate-900 dark:text-slate-100">{config.label}</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {format(new Date(item.date), 'MMM d, h:mm a')}
                  </span>
                </div>
                {item.note && <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">{item.note}</p>}
                {item.intensity && (
                  <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200/80 dark:bg-slate-800/70">
                    <div className="h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-500" style={{ width: `${(item.intensity / 10) * 100}%` }} />
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};