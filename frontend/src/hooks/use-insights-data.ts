import { useState, useCallback } from 'react';
import { getActivityHistory, DailyActivityDTO, getPendingStepsSave } from '@/src/api/walk';

type InsightsState = {
  history: DailyActivityDTO[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useInsightsData(): InsightsState {
  const [history, setHistory] = useState<DailyActivityDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Wait for any pending steps save to land before fetching history
      const pending = getPendingStepsSave();
      if (pending) {
        try {
          await pending;
        } catch {
          // If pending save fails, continue anyway — history fetch is independent
        }
      }

      const data = await getActivityHistory(30);
      setHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load activity history');
    } finally {
      setLoading(false);
    }
  }, []);

  return { history, loading, error, refresh };
}
