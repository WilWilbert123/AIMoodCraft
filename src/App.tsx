import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Journal } from './pages/Journal';
import { Insights } from './pages/Insights';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
 
import { useJournalStore } from './store/journalStore';
import { useMoodStore } from './store/moodStore';
import { supabase } from './lib/supabase';
import { JournalEntry, Mood } from './types';

const moodValueMap: Record<Mood, number> = {
  excited: 7,
  happy: 6,
  calm: 5,
  neutral: 4,
  anxious: 3,
  sad: 2,
  tired: 1,
  angry: 0,
};

type SupabaseJournalRow = {
  id: string;
  title: string;
  content: string;
  mood: Mood;
  created_at?: string;
  updated_at?: string;
  sentiment_score?: number;
  sentiment_label?: 'positive' | 'negative' | 'neutral';
  sentiment_confidence?: number;
};

const mapRowToEntry = (row: SupabaseJournalRow): JournalEntry => ({
  id: row.id,
  title: row.title,
  content: row.content,
  mood: row.mood,
  createdAt: row.created_at ? new Date(row.created_at) : new Date(),
  updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
  sentiment: row.sentiment_label
    ? {
        score: row.sentiment_score ?? 0,
        label: row.sentiment_label,
        confidence: row.sentiment_confidence ?? 0,
      }
    : undefined,
});

function App() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const storedTheme = window.localStorage.getItem('theme');
    if (storedTheme) return storedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const setEntries = useJournalStore((state) => state.setEntries);
  const clearMoodHistory = useMoodStore((state) => state.clearMoodHistory);
  const addMoodData = useMoodStore((state) => state.addMoodData);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    window.localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Load journal entries from Supabase on app startup
  useEffect(() => {
    const loadEntries = async () => {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const entries = (data as SupabaseJournalRow[]).map(mapRowToEntry);
        setEntries(entries);

        clearMoodHistory();
        entries.forEach((entry) => {
          const moodScore = moodValueMap[entry.mood] ?? 0;
          addMoodData(entry.mood, `Journal entry: ${entry.title}`, Math.max(1, moodScore));
        });
      }
    };

    loadEntries();
  }, [setEntries, clearMoodHistory, addMoodData]);

  return (
    <Router>
      <div className="relative flex min-h-screen flex-col overflow-hidden bg-transparent transition-colors duration-300 dark:bg-slate-950">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-8%] top-[-10%] h-72 w-72 rounded-full bg-violet-400/20 blur-3xl" />
          <div className="absolute bottom-[-5%] right-[-6%] h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        </div>
        <Header isDark={isDark} onToggleTheme={() => setIsDark((value) => !value)} />
        <main className="relative z-10 flex-1 container-custom py-8 sm:py-10">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;