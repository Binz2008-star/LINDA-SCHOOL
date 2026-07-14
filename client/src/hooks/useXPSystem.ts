import { useCallback, useEffect, useState } from 'react';

export interface Achievement {
  id: string;
  titleAr: string;
  titleEn: string;
  emoji: string;
  descAr: string;
  descEn: string;
  unlockedAt?: string;
}

export interface XPState {
  totalXP: number;
  level: number;
  xpInCurrentLevel: number;
  xpForNextLevel: number;
  achievements: Achievement[];
  newlyUnlocked: Achievement[];
}

const XP_PER_LEVEL = 100;

export const LEVEL_TITLES_AR_F = [
  'مبتدئة', 'متعلمة', 'متطورة', 'متميزة', 'نجمة',
  'بطلة', 'خبيرة', 'عبقرية', 'أسطورة', 'ملكة المعرفة',
];
export const LEVEL_TITLES_AR_M = [
  'مبتدئ', 'متعلم', 'متطور', 'متميز', 'نجم',
  'بطل', 'خبير', 'عبقري', 'أسطورة', 'ملك المعرفة',
];
export const LEVEL_TITLES_EN = [
  'Beginner', 'Learner', 'Rising Star', 'Achiever', 'Star',
  'Champion', 'Expert', 'Genius', 'Legend', 'Master of Knowledge',
];

const ALL_ACHIEVEMENTS: Omit<Achievement, 'unlockedAt'>[] = [
  { id: 'first_quiz', emoji: '🎯', titleAr: 'أول خطوة', titleEn: 'First Step', descAr: 'أكملتِ أول اختبار!', descEn: 'Completed your first quiz!' },
  { id: 'perfect_10', emoji: '💯', titleAr: 'مثالية', titleEn: 'Perfect Score', descAr: '100% في اختبار كامل!', descEn: '100% on a full quiz!' },
  { id: 'streak_3', emoji: '🔥', titleAr: '3 أيام متتالية', titleEn: '3-Day Streak', descAr: 'تعلّمتِ 3 أيام متواصلة!', descEn: 'Studied 3 days in a row!' },
  { id: 'streak_7', emoji: '⚡', titleAr: 'أسبوع كامل', titleEn: 'Full Week', descAr: '7 أيام من التعلم المتواصل!', descEn: '7 days of continuous learning!' },
  { id: 'xp_100', emoji: '⭐', titleAr: 'جامعة النقاط', titleEn: 'Point Collector', descAr: 'جمعتِ 100 نقطة XP!', descEn: 'Earned 100 XP!' },
  { id: 'xp_500', emoji: '🌟', titleAr: 'كنز المعرفة', titleEn: 'Knowledge Treasure', descAr: 'جمعتِ 500 نقطة XP!', descEn: 'Earned 500 XP!' },
  { id: 'quiz_5', emoji: '🏅', titleAr: '5 اختبارات', titleEn: '5 Quizzes Done', descAr: 'أكملتِ 5 اختبارات!', descEn: 'Completed 5 quizzes!' },
  { id: 'quiz_10', emoji: '🏆', titleAr: '10 اختبارات', titleEn: '10 Quizzes Done', descAr: 'أكملتِ 10 اختبارات!', descEn: 'Completed 10 quizzes!' },
  { id: 'level_3', emoji: '🚀', titleAr: 'وصلتِ المستوى 3', titleEn: 'Level 3 Reached', descAr: 'أنتِ في تطور مستمر!', descEn: "You're constantly improving!" },
  { id: 'level_5', emoji: '👑', titleAr: 'نجمة المعرفة', titleEn: 'Knowledge Star', descAr: 'وصلتِ المستوى 5، أنتِ نجمة!', descEn: 'Level 5 — you are a star!' },
  { id: 'above_80', emoji: '💎', titleAr: 'تفوقي دائم', titleEn: 'Consistent Excel', descAr: 'حصلتِ على أكثر من 80% مرتين!', descEn: 'Scored above 80% twice!' },
  { id: 'comeback', emoji: '💪', titleAr: 'روح المقاتلة', titleEn: 'Fighter Spirit', descAr: 'حاولتِ مرة أخرى بعد نتيجة ضعيفة!', descEn: 'Tried again after a low score!' },
];

function computeLevel(totalXP: number) {
  const level = Math.min(10, Math.floor(totalXP / XP_PER_LEVEL) + 1);
  const xpInCurrentLevel = totalXP % XP_PER_LEVEL;
  const xpForNextLevel = XP_PER_LEVEL;
  return { level, xpInCurrentLevel, xpForNextLevel };
}

interface StoredXP {
  totalXP: number;
  achievements: Achievement[];
  quizCount: number;
  above80Count: number;
  hadLowScore: boolean;
}

const DEFAULT_STORED: StoredXP = {
  totalXP: 0,
  achievements: [],
  quizCount: 0,
  above80Count: 0,
  hadLowScore: false,
};

function load(key: string): StoredXP {
  try {
    const raw = localStorage.getItem(`${key}_xp_data`);
    if (raw) return { ...DEFAULT_STORED, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { ...DEFAULT_STORED };
}

function save(key: string, data: StoredXP) {
  try { localStorage.setItem(`${key}_xp_data`, JSON.stringify(data)); } catch { /* ignore */ }
}

export function useXPSystem(childKey: string = 'linda', isMale: boolean = false) {
  const [stored, setStored] = useState<StoredXP>(DEFAULT_STORED);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);

  useEffect(() => {
    setStored(load(childKey));
  }, [childKey]);

  const addQuizXP = useCallback((score: number, streak: number) => {
    setStored(prev => {
      const baseXP = Math.round(score * 0.5);           // 0-50 XP based on score
      const streakBonus = Math.min(streak * 5, 20);     // up to 20 XP streak bonus
      const perfectBonus = score === 100 ? 25 : 0;
      const earnedXP = baseXP + streakBonus + perfectBonus;

      const newTotalXP = prev.totalXP + earnedXP;
      const newQuizCount = prev.quizCount + 1;
      const newAbove80 = prev.above80Count + (score >= 80 ? 1 : 0);
      const hadLowBefore = prev.hadLowScore;
      const newHadLow = prev.hadLowScore || score < 50;

      // Check achievements
      const alreadyUnlocked = new Set(prev.achievements.map(a => a.id));
      const toUnlock: Achievement[] = [];

      const check = (id: string, condition: boolean) => {
        if (condition && !alreadyUnlocked.has(id)) {
          const def = ALL_ACHIEVEMENTS.find(a => a.id === id);
          if (def) toUnlock.push({ ...def, unlockedAt: new Date().toISOString() });
        }
      };

      check('first_quiz', newQuizCount === 1);
      check('perfect_10', score === 100);
      check('xp_100', newTotalXP >= 100);
      check('xp_500', newTotalXP >= 500);
      check('quiz_5', newQuizCount >= 5);
      check('quiz_10', newQuizCount >= 10);
      check('level_3', computeLevel(newTotalXP).level >= 3);
      check('level_5', computeLevel(newTotalXP).level >= 5);
      check('above_80', newAbove80 >= 2);
      check('comeback', hadLowBefore && score >= 70);

      const updated: StoredXP = {
        totalXP: newTotalXP,
        achievements: [...prev.achievements, ...toUnlock],
        quizCount: newQuizCount,
        above80Count: newAbove80,
        hadLowScore: newHadLow,
      };
      save(childKey, updated);
      setNewlyUnlocked(toUnlock);
      return updated;
    });
  }, [childKey]);

  const addStreakAchievement = useCallback((streak: number) => {
    setStored(prev => {
      const alreadyUnlocked = new Set(prev.achievements.map(a => a.id));
      const toUnlock: Achievement[] = [];
      const check = (id: string, condition: boolean) => {
        if (condition && !alreadyUnlocked.has(id)) {
          const def = ALL_ACHIEVEMENTS.find(a => a.id === id);
          if (def) toUnlock.push({ ...def, unlockedAt: new Date().toISOString() });
        }
      };
      check('streak_3', streak >= 3);
      check('streak_7', streak >= 7);
      if (toUnlock.length === 0) return prev;
      const updated = { ...prev, achievements: [...prev.achievements, ...toUnlock] };
      save(childKey, updated);
      setNewlyUnlocked(prev2 => [...prev2, ...toUnlock]);
      return updated;
    });
  }, [childKey]);

  const clearNewlyUnlocked = useCallback(() => setNewlyUnlocked([]), []);

  const { level, xpInCurrentLevel, xpForNextLevel } = computeLevel(stored.totalXP);

  const LEVEL_TITLES_AR = isMale ? LEVEL_TITLES_AR_M : LEVEL_TITLES_AR_F;

  return {
    totalXP: stored.totalXP,
    level,
    xpInCurrentLevel,
    xpForNextLevel,
    levelTitleAr: LEVEL_TITLES_AR[level - 1],
    levelTitleEn: LEVEL_TITLES_EN[level - 1],
    achievements: stored.achievements,
    newlyUnlocked,
    addQuizXP,
    addStreakAchievement,
    clearNewlyUnlocked,
  };
}
