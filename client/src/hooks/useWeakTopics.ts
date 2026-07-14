import { useCallback, useEffect, useState } from 'react';

export interface TopicStat {
  subject: string;
  lesson: string;
  correct: number;
  total: number;
  lastSeen: string;
}

const STORAGE_KEY = 'linda_weak_topics';

function load(): TopicStat[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function save(data: TopicStat[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

export function useWeakTopics() {
  const [topics, setTopics] = useState<TopicStat[]>([]);

  useEffect(() => { setTopics(load()); }, []);

  const recordAnswer = useCallback((subject: string, lesson: string, isCorrect: boolean) => {
    setTopics(prev => {
      const key = `${subject}||${lesson}`;
      const idx = prev.findIndex(t => `${t.subject}||${t.lesson}` === key);
      let updated: TopicStat[];
      if (idx >= 0) {
        updated = prev.map((t, i) => i === idx ? {
          ...t,
          correct: t.correct + (isCorrect ? 1 : 0),
          total: t.total + 1,
          lastSeen: new Date().toISOString(),
        } : t);
      } else {
        updated = [...prev, {
          subject, lesson,
          correct: isCorrect ? 1 : 0,
          total: 1,
          lastSeen: new Date().toISOString(),
        }];
      }
      save(updated);
      return updated;
    });
  }, []);

  // Topics with <60% accuracy and at least 2 attempts
  const weakTopics = topics
    .filter(t => t.total >= 2 && (t.correct / t.total) < 0.6)
    .sort((a, b) => (a.correct / a.total) - (b.correct / b.total))
    .slice(0, 3);

  // Topics not seen in 3+ days (spaced repetition)
  const reviewDue = topics.filter(t => {
    const daysSince = (Date.now() - new Date(t.lastSeen).getTime()) / 86400000;
    return daysSince >= 3 && t.total >= 1;
  }).slice(0, 2);

  const accuracyFor = useCallback((subject: string, lesson: string) => {
    const t = topics.find(x => x.subject === subject && x.lesson === lesson);
    if (!t || t.total === 0) return null;
    return Math.round((t.correct / t.total) * 100);
  }, [topics]);

  return { topics, weakTopics, reviewDue, recordAnswer, accuracyFor };
}
