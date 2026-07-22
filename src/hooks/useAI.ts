import { useState } from 'react';
import { analyzeSentiment, generateInsights } from '../utils/ai';
import { AIInsight, JournalEntry, Sentiment } from '../types';

export const useAI = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeText = async (text: string): Promise<Sentiment | null> => {
    try {
      setIsProcessing(true);
      setError(null);
      const result = await analyzeSentiment(text);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze text');
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const getInsights = async (entries: JournalEntry[]): Promise<AIInsight[]> => {
    try {
      setIsProcessing(true);
      setError(null);
      return await generateInsights(entries);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate insights');
      return [];
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    analyzeText,
    getInsights,
    isProcessing,
    error,
  };
};