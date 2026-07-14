import { useCallback, useEffect, useState } from 'react';

export interface ScoreEntry {
  date: string;
  score: number;
  correct: number;
  total: number;
  mode: string;
  subject?: string;
}

const MAX_ENTRIES = 30;

export function useScoreHistory(childKey: string = 'linda') {
  const storageKey = `${childKey}_quiz_scores`;
  const [history, setHistory] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      setHistory(stored ? JSON.parse(stored) : []);
    } catch {
      setHistory([]);
    }
  }, [storageKey]);

  const addScore = useCallback((entry: Omit<ScoreEntry, 'date'>) => {
    setHistory(prev => {
      const newEntry: ScoreEntry = {
        ...entry,
        date: new Date().toISOString(),
      };
      const updated = [newEntry, ...prev].slice(0, MAX_ENTRIES);
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {
        // Keep the in-memory history even when browser storage is unavailable.
      }
      return updated;
    });
  }, [storageKey]);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(storageKey);
    setHistory([]);
  }, [storageKey]);

  const bestScore = history.length > 0 ? Math.max(...history.map(entry => entry.score)) : 0;
  const averageScore = history.length > 0
    ? Math.round(history.reduce((sum, entry) => sum + entry.score, 0) / history.length)
    : 0;
  const totalQuizzes = history.length;

  const streak = (() => {
    if (history.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = new Set(
      history.map(entry => {
        const date = new Date(entry.date);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      })
    );

    const oneDay = 86_400_000;
    let count = days.has(today.getTime()) ? 1 : 0;
    let cursor = today.getTime();

    while (days.has(cursor - oneDay)) {
      count += 1;
      cursor -= oneDay;
    }

    return count;
  })();

  return {
    history,
    addScore,
    clearHistory,
    bestScore,
    averageScore,
    totalQuizzes,
    streak,
  };
}
