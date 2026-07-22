import { useEffect, useState } from 'react';
import { useAI } from '@/hooks/useAI';
import { JournalEntry, AIInsight } from '@/types';
import { Card } from '@/components/ui/Card';
import { Brain, AlertCircle, Lightbulb, TrendingUp, Loader2 } from 'lucide-react';

interface AIInsightsProps {
  entries: JournalEntry[];
  onRefresh?: () => void;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ entries, onRefresh }) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const { getInsights, isProcessing, error } = useAI();

  useEffect(() => {
    if (entries.length > 0) {
      void loadInsights();
    } else {
      setInsights([]);
    }
  }, [entries, onRefresh]);

  const loadInsights = async () => {
    const results = await getInsights(entries);
    setInsights(results);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'pattern':
        return <TrendingUp className="text-blue-500" size={20} />;
      case 'recommendation':
        return <Lightbulb className="text-yellow-500" size={20} />;
      case 'alert':
        return <AlertCircle className="text-red-500" size={20} />;
      default:
        return <Brain className="text-purple-500" size={20} />;
    }
  };

  const getPriorityColor = (priority: string = 'medium') => {
    switch (priority) {
      case 'high':
        return 'border-red-200/80 bg-red-50/80 dark:border-red-900/70 dark:bg-red-950/70';
      case 'medium':
        return 'border-amber-200/80 bg-amber-50/80 dark:border-amber-900/70 dark:bg-amber-950/70';
      default:
        return 'border-sky-200/80 bg-sky-50/80 dark:border-sky-900/70 dark:bg-sky-950/70';
    }
  };

  if (isProcessing) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="mx-auto mb-3 animate-spin text-violet-500" size={32} />
        <p className="text-slate-600 dark:text-slate-300">Generating AI insights...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200/80 bg-red-50/80 p-4">
        <p className="text-red-700">Error: {error}</p>
      </Card>
    );
  }

  if (insights.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Brain className="mx-auto mb-3 text-slate-400" size={32} />
        <p className="text-slate-600 dark:text-slate-300">No insights yet. Keep journaling!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {insights.map((insight) => (
        <Card key={insight.id} className={`animate-fade-in border ${getPriorityColor(insight.priority)} p-4`}>
          <div className="flex items-start gap-3">
            {getIcon(insight.type)}
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {insight.type}
                </span>
                {insight.priority === 'high' && (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/70 dark:text-red-300">
                    Important
                  </span>
                )}
              </div>
              <p className="text-slate-800 dark:text-slate-200">{insight.content}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};