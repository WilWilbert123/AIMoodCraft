import { useState } from 'react';
import { useAI } from '@/hooks/useAI';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SentimentAnalysisProps {
  text?: string;
  onAnalyze?: (result: any) => void;
}

export const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ text = '', onAnalyze }) => {
  const [inputText, setInputText] = useState(text);
  const [result, setResult] = useState<any>(null);
  const { analyzeText, isProcessing, error } = useAI();

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      alert('Please enter some text to analyze');
      return;
    }

    const analysis = await analyzeText(inputText);
    if (analysis) {
      setResult(analysis);
      if (onAnalyze) onAnalyze(analysis);
    }
  };

  const getSentimentIcon = (label: string) => {
    switch (label) {
      case 'positive':
        return <TrendingUp className="text-green-500" size={24} />;
      case 'negative':
        return <TrendingDown className="text-red-500" size={24} />;
      default:
        return <Minus className="text-gray-500 dark:text-gray-400" size={24} />;
    }
  };

  const getSentimentColor = (label: string) => {
    switch (label) {
      case 'positive':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/40';
      case 'negative':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/40';
      default:
        return 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/60';
    }
  };

  return (
    <Card className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AI Sentiment Analysis</h3>
      
      <div className="space-y-3">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to analyze sentiment..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[100px] resize-y dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 dark:placeholder-gray-500"
        />
        
        <Button
          onClick={handleAnalyze}
          isLoading={isProcessing}
          disabled={!inputText.trim()}
        >
          Analyze Sentiment
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm dark:bg-red-950/50 dark:border-red-900 dark:text-red-300">
          {error}
        </div>
      )}

      {result && (
        <div className={`p-4 rounded-lg border ${getSentimentColor(result.label)} animate-fade-in`}>
          <div className="flex items-center gap-3">
            {getSentimentIcon(result.label)}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium capitalize text-gray-900 dark:text-gray-100">{result.label}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Confidence: {(result.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${(result.score + 1) / 2 * 100}%`,
                    backgroundColor: result.score > 0.2 ? '#4CAF50' : result.score < -0.2 ? '#F44336' : '#FF9800'
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1 dark:text-gray-400">
                <span>Negative</span>
                <span>Neutral</span>
                <span>Positive</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};