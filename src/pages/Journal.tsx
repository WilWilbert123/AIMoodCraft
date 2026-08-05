import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useJournalStore } from '@/store/journalStore';
import { useMoodStore } from '@/store/moodStore';
import { EntryForm } from '@/components/journal/EntryForm';
import { EntryList } from '@/components/journal/EntryList';
import { JournalEntry, Mood } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getDeviceId } from '@/lib/deviceId';
import { MOOD_CONFIG } from '@/utils/constants';

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

export const Journal: React.FC = () => {
  const { entries, setEntries, addEntryObject, deleteEntry, updateEntry } = useJournalStore();
  const { addMoodData } = useMoodStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [newEntryMood, setNewEntryMood] = useState<Mood | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setEditingEntry(null);
      const requestedMood = searchParams.get('mood') as Mood | null;
      setNewEntryMood(requestedMood && requestedMood in MOOD_CONFIG ? requestedMood : undefined);
      setShowForm(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true);
      setDbError(null);

      if (!supabase) {
        setDbError('Supabase is not configured for persistence.');
        setIsLoading(false);
        return;
      }

      const deviceId = getDeviceId();
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('device_id', deviceId)
        .order('created_at', { ascending: false });

      if (error) {
        setDbError(error.message);
      } else if (data) {
        setEntries((data as SupabaseJournalRow[]).map(mapRowToEntry));
      }

      setIsLoading(false);
    };

    fetchEntries();
  }, [setEntries]);

  const handleSubmit = async (title: string, content: string, mood: JournalEntry['mood']) => {
    if (!supabase) {
      setDbError('Supabase is not configured for persistence.');
      return;
    }

    if (editingEntry) {
      const deviceId = getDeviceId();
      const { data, error } = await supabase
        .from('journal_entries')
        .update({ title, content, mood, updated_at: new Date().toISOString() })
        .eq('id', editingEntry.id)
        .eq('device_id', deviceId)
        .select()
        .single();

      if (error) {
        alert(`Failed to update entry: ${error.message}`);
        return;
      }

      const updateData = data as SupabaseJournalRow | null;
      if (updateData) {
        updateEntry(editingEntry.id, {
          title: updateData.title,
          content: updateData.content,
          mood: updateData.mood,
          updatedAt: new Date(updateData.updated_at || new Date()),
          sentiment: updateData.sentiment_label
            ? {
                score: updateData.sentiment_score ?? 0,
                label: updateData.sentiment_label,
                confidence: updateData.sentiment_confidence ?? 0,
              }
            : undefined,
        });
      }

      setEditingEntry(null);
    } else {
      setDbError(null);
      const payload = {
        title: title || 'Untitled',
        content,
        mood,
        device_id: getDeviceId(),
      };

      const { data, error } = await supabase
        .from('journal_entries')
        .insert(payload)
        .select()
        .single();

      if (error) {
        alert(`Failed to save entry: ${error.message}`);
        setDbError(error.message);
        return;
      }

      const insertedData = data as SupabaseJournalRow | null;
      if (insertedData) {
        const newEntry = mapRowToEntry(insertedData);
        addEntryObject(newEntry);
        addMoodData(mood, `Journal entry: ${title}`);
      }
    }

    setShowForm(false);
  };

  const handleEdit = (id: string) => {
    const entry = entries.find((e) => e.id === id);
    if (entry) {
      setEditingEntry(entry);
      setShowForm(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    if (!supabase) {
      setDbError('Supabase is not configured for persistence.');
      return;
    }

    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id)
      .eq('device_id', getDeviceId());
    if (error) {
      alert(`Failed to delete entry: ${error.message}`);
      return;
    }

    deleteEntry(id);
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Premium Hero Header */}
      <div className="relative flex flex-col items-start justify-center overflow-hidden rounded-[32px] border border-black/10 bg-white p-6 shadow-[0_28px_80px_-28px_rgba(0,0,0,0.28)] dark:border-white/10 dark:bg-neutral-950 sm:p-10">
        <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl dark:bg-violet-500/25" />
        <div className="pointer-events-none absolute -bottom-20 left-1/4 h-56 w-56 rounded-full bg-cyan-500/15 blur-3xl dark:bg-cyan-500/20" />
        
        <div className="relative z-10 flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-50/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300">
              Capture your mood
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 dark:text-white sm:text-5xl">
              Your Reflective Journal
            </h1>
            <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300 sm:text-base">
              A quiet place to untangle your thoughts, track your emotional rhythms, and find clarity.
            </p>
          </div>
          
          <Button 
            onClick={() => {
              setEditingEntry(null);
              setNewEntryMood(undefined);
              setShowForm(!showForm);
            }}
            className="group relative overflow-hidden shrink-0 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            <div className="relative z-10 flex items-center gap-2">
              <Plus size={18} className="transition-transform group-hover:rotate-90" />
              {showForm ? 'Cancel Entry' : 'Write New Entry'}
            </div>
          </Button>
        </div>
      </div>

      {dbError && (
        <div className="rounded-2xl border border-red-200/80 bg-red-50/80 px-4 py-3 text-sm text-red-700 backdrop-blur dark:border-red-700/70 dark:bg-red-950/70 dark:text-red-200">
          {dbError}
        </div>
      )}

      {showForm && (
        <Card className="border-white/70 p-5" hover>
          <EntryForm
            initialTitle={editingEntry?.title}
            initialContent={editingEntry?.content}
            initialMood={editingEntry?.mood ?? newEntryMood}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingEntry(null);
              setNewEntryMood(undefined);
            }}
            isEditing={!!editingEntry}
          />
        </Card>
      )}

      <div className="flex w-full items-center gap-3 rounded-2xl border border-black/5 bg-white/60 p-2 shadow-sm backdrop-blur-xl dark:border-white/5 dark:bg-neutral-900/40">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" size={18} />
          <input
            type="text"
            placeholder="Search through your thoughts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl bg-transparent py-2.5 pl-11 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-100 dark:placeholder:text-neutral-500"
          />
        </div>
        <div className="mr-2 hidden items-center gap-1.5 sm:flex">
          <span className="flex h-6 items-center justify-center rounded-md border border-black/10 bg-black/5 px-2 text-[10px] font-semibold text-neutral-500 dark:border-white/10 dark:bg-white/5 dark:text-neutral-400">
            {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/70 px-4 py-6 text-center text-sm text-slate-600 backdrop-blur dark:border-slate-700/70 dark:bg-slate-950/70 dark:text-slate-300">
          Loading entries...
        </div>
      ) : (
        <EntryList
          entries={filteredEntries}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No journal entries found. Start writing your first entry!"
        />
      )}
    </div>
  );
};
