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
        <p className="text-gray-500 text-center py-4">No mood data yet</p>
      ) : (
        data.map((item, index) => {
          const config = MOOD_CONFIG[item.mood];
          return (
            <div
              key={index}
              className="flex items-center gap-4 p-3 bg-white rounded-lg shadow-sm border border-gray-100 animate-slide-up dark:bg-gray-900 dark:border-gray-800"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="text-2xl">{config.emoji}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium capitalize text-gray-900 dark:text-gray-100">{config.label}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(item.date), 'MMM d, h:mm a')}
                  </span>
                </div>
                {item.note && (
                  <p className="text-sm text-gray-600 mt-0.5 dark:text-gray-300">{item.note}</p>
                )}
                {item.intensity && (
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-primary-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${(item.intensity / 10) * 100}%` }}
                    />
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