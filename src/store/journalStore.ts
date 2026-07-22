import { create } from 'zustand';
import { JournalEntry, Mood, Sentiment } from '../types';

interface JournalStore {
  entries: JournalEntry[];
  setEntries: (entries: JournalEntry[]) => void;
  addEntry: (title: string, content: string, mood: Mood, sentiment?: Sentiment) => JournalEntry;
  addEntryObject: (entry: JournalEntry) => void;
  updateEntry: (id: string, entry: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
  getEntryById: (id: string) => JournalEntry | undefined;
}

export const useJournalStore = create<JournalStore>((set, get) => ({
  entries: [],
  setEntries: (entries) => set({ entries }),
  addEntry: (title, content, mood, sentiment) => {
    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      title,
      content,
      mood,
      createdAt: new Date(),
      updatedAt: new Date(),
      sentiment,
    };

    set((state) => ({
      entries: [entry, ...state.entries],
    }));

    return entry;
  },
  addEntryObject: (entry) => set((state) => ({
    entries: [entry, ...state.entries],
  })),
  updateEntry: (id, updatedEntry) => set((state) => ({
    entries: state.entries.map((entry) =>
      entry.id === id ? { ...entry, ...updatedEntry, updatedAt: new Date() } : entry
    ),
  })),
  deleteEntry: (id) => set((state) => ({
    entries: state.entries.filter((entry) => entry.id !== id),
  })),
  getEntryById: (id) => get().entries.find((entry) => entry.id === id),
}));