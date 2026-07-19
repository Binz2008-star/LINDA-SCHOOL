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

  const gradientId = 'scoreGradient';
  const colors = percentage >= 80 ? ['#14b8a6', '#10b981'] : percentage >= 55 ? ['#a855f7', '#8b5cf6'] : ['#f59e0b', '#f97316'];

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="100%" stopColor={colors[1]} />
          </linearGradient>
        </defs>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius} fill="none"
          stroke={`url(#${gradientId})`} strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div className="absolute text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="text-4xl font-black bg-gradient-to-br bg-clip-text text-transparent"
          style={{ backgroundImage: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
        >
          {percentage}%
        </motion.div>
        <div className="text-xs text-gray-400 arabic-text mt-0.5">النتيجة</div>
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

  const stripeGradient = percentage === 100 ? 'from-yellow-400 via-amber-400 to-orange-400' :
    percentage >= 80 ? 'from-teal-400 via-emerald-400 to-green-500' :
      percentage >= 55 ? 'from-violet-400 via-purple-400 to-fuchsia-500' :
        'from-orange-400 via-rose-400 to-pink-500';

  return (
    <motion.div variants={container} initial="hidden" animate="show"
      className="w-full max-w-2xl mx-auto space-y-4">

      {/* Main card */}
      <motion.div variants={item}
        className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

        {/* Coloured top stripe */}
        <div className={`h-2.5 w-full bg-gradient-to-r ${stripeGradient}`} />

        <div className="p-6 md:p-10 text-center">
          {/* Big emoji with glow */}
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="text-6xl mb-3"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}
          >
            {percentage === 100 ? '👑' : percentage >= 80 ? '🌟' : percentage >= 55 ? '💜' : '💪'}
          </motion.div>

          {/* Score circle */}
          <div className="flex justify-center mb-6">
            <ScoreCircle percentage={percentage} />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2.5 mb-6">
            {[
              { value: correctCount, label: 'صحيحة', emoji: '✅', color: 'text-emerald-600', bg: 'from-emerald-50 to-green-50' },
              { value: totalCount - correctCount, label: 'للمراجعة', emoji: '📖', color: 'text-amber-500', bg: 'from-amber-50 to-orange-50' },
              { value: totalCount, label: 'إجمالي', emoji: '📝', color: 'text-violet-600', bg: 'from-violet-50 to-purple-50' },
            ].map(({ value, label, emoji, color, bg }) => (
              <div key={label} className={`bg-gradient-to-br ${bg} rounded-2xl py-4 px-2 border border-gray-100`}>
                <div className="text-xl mb-1">{emoji}</div>
                <div className={`text-2xl font-black ${color}`}>{value}</div>
                <div className="text-[11px] text-gray-500 mt-0.5 arabic-text leading-tight">{label}</div>
              </div>
            ))}
          </div>

          {/* XP earned */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.8 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 rounded-full font-bold text-sm mb-5"
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
            <div className="flex justify-between text-xs text-gray-400 mb-1.5 arabic-text" dir="rtl">
              <span>{levelTitleAr}</span>
              <span>{xpInCurrentLevel}/{xpForNextLevel} XP</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(xpInCurrentLevel / xpForNextLevel) * 100}%` }}
                transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-violet-500 via-pink-500 to-rose-500 rounded-full"
              />
            </div>
          </div>

          {/* Dad message */}
          <motion.div
            variants={item}
            className="relative rounded-2xl border-2 border-rose-100 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 p-5 text-right mb-6 overflow-hidden"
            dir="rtl"
          >
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-rose-200/20 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2 justify-end">
                <span className="text-xs font-bold text-rose-600 arabic-text">رسالة من بابا</span>
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              </div>
              <p className="text-sm leading-loose text-gray-800 arabic-text">{msg.ar}</p>
              <p className="text-xs leading-relaxed text-gray-500 mt-2 text-left" dir="ltr">{msg.en}</p>
            </div>
          </motion.div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onRestart}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-bold py-3.5 px-7 rounded-2xl min-h-[48px] arabic-text transition-all active:scale-95 shadow-lg shadow-violet-200"
            >
              <RotateCcw className="w-5 h-5" />
              اختبار جديد
            </button>
            {onShare && (
              <button
                onClick={onShare}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3.5 px-7 rounded-2xl min-h-[48px] arabic-text transition-all active:scale-95 shadow-lg shadow-green-200"
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
            className="relative bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 border-2 border-yellow-200 rounded-3xl p-6 overflow-hidden"
          >
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-200/30 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4 justify-center">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <h3 className="font-black text-yellow-800 arabic-text text-lg">إنجازات جديدة مفتوحة! 🎉</h3>
              </div>
              <div className="space-y-3">
                {newlyUnlocked.map((ach, i) => (
                  <motion.div
                    key={ach.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm border border-yellow-100"
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
