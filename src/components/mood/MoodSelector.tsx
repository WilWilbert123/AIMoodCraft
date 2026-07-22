import React from 'react';
import { Mood } from '@/types';
import { MOOD_CONFIG } from '@/utils/constants';

interface MoodSelectorProps {
  selectedMood: Mood | null;
  onSelectMood: (mood: Mood) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onSelectMood,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-14 h-14 text-2xl',
    lg: 'w-20 h-20 text-4xl'
  };

  const moodOptions = Object.entries(MOOD_CONFIG);

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {moodOptions.map(([key, config]) => {
        const isSelected = selectedMood === key;
        return (
          <button
            key={key}
            onClick={() => onSelectMood(key as Mood)}
            className={`
              ${sizeClasses[size]}
              rounded-full flex items-center justify-center
              transition-all duration-200 transform
              ${isSelected 
                ? 'scale-110 ring-4 ring-primary-500 ring-offset-2 shadow-lg' 
                : 'hover:scale-105 hover:shadow-md'
              }
              bg-white border-2 ${isSelected ? 'border-primary-500' : 'border-gray-200'} dark:bg-gray-900 dark:border-gray-700
            `}
            title={config.label}
          >
            <span>{config.emoji}</span>
          </button>
        );
      })}
    </div>
  );
};