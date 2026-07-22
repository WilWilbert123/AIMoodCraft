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
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  if (isProcessing) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="animate-spin mx-auto mb-3 text-primary-500" size={32} />
        <p className="text-gray-600 dark:text-gray-300">Generating AI insights...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 border-red-200 bg-red-50">
        <p className="text-red-700">Error: {error}</p>
      </Card>
    );
  }

  if (insights.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Brain className="mx-auto mb-3 text-gray-400" size={32} />
        <p className="text-gray-600 dark:text-gray-300">No insights yet. Keep journaling!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {insights.map((insight) => (
        <Card
          key={insight.id}
          className={`p-4 border ${getPriorityColor(insight.priority)} animate-fade-in`}
        >
          <div className="flex items-start gap-3">
            {getIcon(insight.type)}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  {insight.type}
                </span>
                {insight.priority === 'high' && (
                  <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                    Important
                  </span>
                )}
              </div>
              <p className="text-gray-800 dark:text-gray-200">{insight.content}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};