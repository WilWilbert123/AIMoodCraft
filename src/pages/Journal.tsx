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
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setEditingEntry(null);
      setShowForm(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true);
      setDbError(null);

      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
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
    if (editingEntry) {
      const { data, error } = await supabase
        .from('journal_entries')
        .update({ title, content, mood, updated_at: new Date().toISOString() })
        .eq('id', editingEntry.id)
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

    const { error } = await supabase.from('journal_entries').delete().eq('id', id);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Journal</h1>
        <Button onClick={() => {
          setEditingEntry(null);
          setShowForm(!showForm);
        }}>
          <Plus size={20} />
          {showForm ? 'Cancel' : 'New Entry'}
        </Button>
      </div>

      {dbError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-950 dark:text-red-200">
          {dbError}
        </div>
      )}

      {showForm && (
        <Card className="border-primary-200">
          <EntryForm
            initialTitle={editingEntry?.title}
            initialContent={editingEntry?.content}
            initialMood={editingEntry?.mood}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingEntry(null);
            }}
            isEditing={!!editingEntry}
          />
        </Card>
      )}

      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 dark:placeholder-gray-500"
          />
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">{filteredEntries.length} entries</span>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
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