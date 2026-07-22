import { create } from 'zustand';
import { Mood, MoodData } from '../types';

interface MoodStore {
  moodHistory: MoodData[];
  addMoodData: (mood: Mood, note?: string, intensity?: number) => void;
  clearMoodHistory: () => void;
}

export const useMoodStore = create<MoodStore>((set) => ({
  moodHistory: [],
  addMoodData: (mood, note, intensity) =>
    set((state) => ({
      moodHistory: [
        {
          date: new Date(),
          mood,
          note,
          intensity,
        },
        ...state.moodHistory,
      ],
    })),
  clearMoodHistory: () => set({ moodHistory: [] }),
}));
