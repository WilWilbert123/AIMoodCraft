import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';

/** Displays the total number of recorded browser sessions for this site. */
export const VisitCounter = () => {
  const [visitCount, setVisitCount] = useState<number | null>(null);

  useEffect(() => {
    const recordVisit = async () => {
      if (!supabase) return;

      // A single browser tab session counts once, not every route change.
      const visitRecordedKey = 'moodcraft_visit_recorded';
      if (!window.sessionStorage.getItem(visitRecordedKey)) {
        const { error } = await supabase.from('site_visits').insert({});
        if (!error) window.sessionStorage.setItem(visitRecordedKey, 'true');
      }

      const { count, error } = await supabase
        .from('site_visits')
        .select('*', { count: 'exact', head: true });

      if (!error && count !== null) setVisitCount(count);
    };

    recordVisit();
  }, []);

  if (visitCount === null) return null;

  return (
    <span
      className="inline-flex min-h-9 w-9 items-center justify-center gap-1.5 rounded-full border border-black/10 bg-white px-2 text-xs font-semibold tabular-nums text-neutral-950 shadow-sm dark:border-white/10 dark:bg-neutral-950 dark:text-white min-[390px]:w-auto min-[390px]:px-3"
      title={`${visitCount.toLocaleString()} total site visits`}
      aria-label={`${visitCount.toLocaleString()} total site visits`}
    >
      <Eye size={15} aria-hidden="true" />
      <span className="hidden min-[390px]:inline">{visitCount.toLocaleString()}</span>
    </span>
  );
};
