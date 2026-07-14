import { Achievement } from '@/hooks/useXPSystem';
import { ChildProfile } from '@/lib/children';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, MessageCircle, RotateCcw, Star, Trophy, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ResultsScreenProps {
  correctCount: number;
  totalCount: number;
  xpEarned: number;
  newLevel?: number;
  levelTitleAr?: string;
  levelTitleEn?: string;
  xpInCurrentLevel: number;
  xpForNextLevel: number;
  newlyUnlocked: Achievement[];
  onRestart: () => void;
  onShare?: () => void;
  childProfile?: ChildProfile;
}

function buildDadMessages(child?: ChildProfile) {
  const nameAr = child?.nameAr ?? 'حبيبي';
  const nameEn = child?.nameEn ?? 'my dear';
  const tone = child?.dadToneAr ?? `يا ${nameAr}`;
  const toneEn = child?.dadToneEn ?? nameEn;
  const isMale = child ? ['adam', 'noah'].includes(child.id) : false;
  const pronoun = isMale ? 'ه' : 'ها';
  const winner = isMale ? 'الفائز' : 'الفائزة';
  const smart = isMale ? 'أذكى' : 'أذكى';

  return {
    perfect: {
      ar: `💙 ${tone}، أنا أفخر بك أكثر من أي شيء في هذه الدنيا. 100%! هذا ليس حظًا، هذا دليل على ذكائك وجهدك الحقيقي. بابا يحبك ❤️`,
      en: `💙 ${toneEn}, I am more proud of you than anything in this world. 100%! That is not luck — that is proof of your real intelligence. Dad loves you ❤️`,
    },
    excellent: {
      ar: `🌟 ${tone}! هذه النتيجة تثبت ما أعرفه دائمًا — أنت ${smart} وأكثر قدرةً مما تظن. واصل يا نجمي، بابا يراك وهو فخور جدًا! 💛`,
      en: `🌟 ${toneEn}! This result proves what I always knew — you are smarter and more capable than you think. Keep going, Dad sees you and is so proud! 💛`,
    },
    good: {
      ar: `💜 ${tone}، هذا تقدم حقيقي وأنا سعيد جدًا بك. ما يهمني ليس فقط النتيجة، بل أنك لم تستسلم وأكملت حتى النهاية. هذه هي روح ${winner}! 🦋`,
      en: `💜 ${toneEn}, this is real progress and I am so happy with you. What matters is that you never gave up and finished to the end. That is the spirit of a winner! 🦋`,
    },
    tryAgain: {
      ar: `🤗 ${tone}، لا يوجد شيء اسمه فشل عند بابا — يوجد فقط تعلّم. كل سؤال أخطأت فيه الآن أصبح درسًا ستتذكر${pronoun} دائمًا. الخسارة الوحيدة هي التوقف، وأنت لن تتوقف! ❤️‍🔥`,
      en: `🤗 ${toneEn}, there is no such thing as failure with Dad — there is only learning. Every question you missed is now a lesson you will always remember. The only loss is stopping, and you will NOT stop! ❤️‍🔥`,
    },
  };
}

function getDadMessage(pct: number, child?: ChildProfile) {
  const msgs = buildDadMessages(child);
  if (pct === 100) return msgs.perfect;
  if (pct >= 80) return msgs.excellent;
  if (pct >= 55) return msgs.good;
  return msgs.tryAgain;
}

function ScoreCircle({ percentage }: { percentage: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - (percentage / 100) * circumference);
    }, 400);
    return () => clearTimeout(timer);
  }, [percentage, circumference]);

  const color = percentage >= 80 ? '#14b8a6' : percentage >= 55 ? '#a855f7' : '#f59e0b';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-4xl font-bold text-gray-900">{percentage}%</div>
        <div className="text-xs text-gray-500 arabic-text">النتيجة</div>
      </div>
    </div>
  );
}

export default function ResultsScreen({
  correctCount,
  totalCount,
  xpEarned,
  newLevel,
  levelTitleAr,
  levelTitleEn,
  xpInCurrentLevel,
  xpForNextLevel,
  newlyUnlocked,
  onRestart,
  onShare,
  childProfile,
}: ResultsScreenProps) {
  const percentage = Math.round((correctCount / totalCount) * 100);
  const msg = getDadMessage(percentage, childProfile);
  const [showAchievements, setShowAchievements] = useState(false);

  useEffect(() => {
    if (newlyUnlocked.length > 0) {
      const t = setTimeout(() => setShowAchievements(true), 1800);
      return () => clearTimeout(t);
    }
  }, [newlyUnlocked]);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show"
      className="w-full max-w-2xl mx-auto space-y-4">

      {/* Main card */}
      <motion.div variants={item}
        className="bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* Coloured top stripe */}
        <div className={`h-2 w-full ${percentage === 100 ? 'bg-gradient-to-r from-yellow-400 to-amber-400' :
          percentage >= 80 ? 'bg-gradient-to-r from-teal-500 to-emerald-500' :
            percentage >= 55 ? 'bg-gradient-to-r from-purple-500 to-violet-500' :
              'bg-gradient-to-r from-orange-400 to-rose-400'
          }`} />

        <div className="p-8 md:p-10 text-center">
          {/* Big emoji */}
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="text-6xl mb-4"
          >
            {percentage === 100 ? '👑' : percentage >= 80 ? '🌟' : percentage >= 55 ? '💜' : '💪'}
          </motion.div>

          {/* Score circle */}
          <div className="flex justify-center mb-6">
            <ScoreCircle percentage={percentage} />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { value: correctCount, label: 'صحيحة ✅', color: 'text-emerald-600' },
              { value: totalCount - correctCount, label: 'للمراجعة 📖', color: 'text-amber-500' },
              { value: totalCount, label: 'إجمالي 📝', color: 'text-teal-600' },
            ].map(({ value, label, color }) => (
              <div key={label} className="bg-gray-50 rounded-2xl py-4">
                <div className={`text-3xl font-bold ${color}`}>{value}</div>
                <div className="text-xs text-gray-500 mt-1 arabic-text leading-tight">{label}</div>
              </div>
            ))}
          </div>

          {/* XP earned */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.8 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 rounded-full font-bold text-sm mb-6"
          >
            <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
            +{xpEarned} XP مكسوبة
            {newLevel && (
              <span className="mr-2 text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">
                مستوى {newLevel} جديد! 🎉
              </span>
            )}
          </motion.div>

          {/* XP progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-400 mb-1 arabic-text" dir="rtl">
              <span>{levelTitleAr}</span>
              <span>{xpInCurrentLevel}/{xpForNextLevel} XP</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(xpInCurrentLevel / xpForNextLevel) * 100}%` }}
                transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-teal-500 to-purple-500 rounded-full"
              />
            </div>
          </div>

          {/* Dad message */}
          <motion.div
            variants={item}
            className="rounded-2xl border-2 border-rose-100 bg-gradient-to-br from-rose-50 to-pink-50 p-5 text-right mb-6"
            dir="rtl"
          >
            <div className="flex items-center gap-2 mb-2 justify-end">
              <span className="text-xs font-semibold text-rose-600 arabic-text">رسالة من بابا</span>
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            </div>
            <p className="text-sm leading-loose text-gray-800 arabic-text">{msg.ar}</p>
            <p className="text-xs leading-relaxed text-gray-500 mt-2 text-left" dir="ltr">{msg.en}</p>
          </motion.div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onRestart}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white font-semibold py-3 px-7 rounded-xl min-h-[48px] arabic-text transition-all active:scale-95 shadow-lg shadow-teal-200"
            >
              <RotateCcw className="w-5 h-5" />
              اختبار جديد
            </button>
            {onShare && (
              <button
                onClick={onShare}
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-7 rounded-xl min-h-[48px] arabic-text transition-all active:scale-95 shadow-lg shadow-green-200"
              >
                <MessageCircle className="w-5 h-5" />
                شارك على WhatsApp
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Newly unlocked achievements */}
      <AnimatePresence>
        {showAchievements && newlyUnlocked.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-3xl p-6"
          >
            <div className="flex items-center gap-2 mb-4 justify-center">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <h3 className="font-bold text-yellow-800 arabic-text text-lg">إنجازات جديدة مفتوحة! 🎉</h3>
            </div>
            <div className="space-y-3">
              {newlyUnlocked.map((ach, i) => (
                <motion.div
                  key={ach.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm"
                  dir="rtl"
                >
                  <span className="text-3xl">{ach.emoji}</span>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 arabic-text">{ach.titleAr}</div>
                    <div className="text-xs text-gray-500 arabic-text">{ach.descAr}</div>
                  </div>
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
