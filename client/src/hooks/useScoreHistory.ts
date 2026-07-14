import { useCallback, useEffect, useState } from 'react';

export interface ScoreEntry {
  date: string;        // ISO date string
  score: number;       // percentage 0-100
  correct: number;
  total: number;
  mode: string;
  subject?: string;
}

const STORAGE_KEY = 'linda_quiz_scores';
const MAX_ENTRIES = 30;

export function useScoreHistory() {
  const [history, setHistory] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      setHistory([]);
    }
  }, []);

  const addScore = useCallback((entry: Omit<ScoreEntry, 'date'>) => {
    setHistory((prev) => {
      const newEntry: ScoreEntry = {
        ...entry,
        date: new Date().toISOString(),
      };
      const updated = [newEntry, ...prev].slice(0, MAX_ENTRIES);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  const bestScore = history.length > 0 ? Math.max(...history.map(e => e.score)) : 0;
  const averageScore = history.length > 0
    ? Math.round(history.reduce((s, e) => s + e.score, 0) / history.length)
    : 0;
  const totalQuizzes = history.length;
  const streak = (() => {
    if (history.length === 0) return 0;
    let s = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = new Set(
      history.map(e => {
        const d = new Date(e.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
    );
    const ONE_DAY = 86400000;
    let check = today.getTime();
    while (days.has(check - ONE_DAY)) {
      s++;
      check -= ONE_DAY;
    }
    return days.has(today.getTime()) ? s : 0;
  })();

  return { history, addScore, clearHistory, bestScore, averageScore, totalQuizzes, streak };
}
