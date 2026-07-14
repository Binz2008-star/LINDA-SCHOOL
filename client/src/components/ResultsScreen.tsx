import { Achievement } from '@/hooks/useXPSystem';
import { ChildProfile } from '@/lib/children';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, MessageCircle, RotateCcw, Trophy, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ResultsScreenProps {
  child: ChildProfile;
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
}

function getDadMessage(child: ChildProfile, percentage: number): { ar: string; en: string } {
  const male = ['adam', 'noah'].includes(child.id);
  const effortAr = male ? 'أكملتَ الدرس وحاولتَ حتى النهاية' : 'أكملتِ الدرس وحاولتِ حتى النهاية';
  const reviewAr = male ? 'سنراجع ما لم يتضح بعد' : 'سنراجع ما لم يتضح بعد';

  if (percentage === 100) {
    return {
      ar: `💙 ${child.dadToneAr}، فهمك اليوم ممتاز. الأهم أنك لم تكتفِ بالاختيار، بل قرأت الشرح وتعلمت سبب الإجابة. بابا فخور بك جداً.`,
      en: `💙 ${child.nameEn}, your understanding today was excellent. You did more than choose answers—you learned why they were correct. Dad is very proud of you.`,
    };
  }

  if (percentage >= 70) {
    return {
      ar: `🌟 ${child.dadToneAr}، هذا تقدم حقيقي. ${effortAr}، وهذا أهم من الرقم نفسه. سنراجع النقاط القليلة المتبقية بهدوء.`,
      en: `🌟 ${child.nameEn}, this is real progress. Finishing the lesson and learning from the explanations matters more than the number alone.`,
    };
  }

  return {
    ar: `🌱 ${child.dadToneAr}، هذه ليست نتيجة فشل. هي خريطة تخبرنا ماذا نعلّم بعد ذلك. ${reviewAr} خطوة خطوة، من دون مقارنة أو استعجال.`,
    en: `🌱 ${child.nameEn}, this is not failure. It is a map showing what we should learn next. We will review it step by step, without comparison or pressure.`,
  };
}

function ScoreCircle({ percentage }: { percentage: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setOffset(circumference - (percentage / 100) * circumference);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [percentage, circumference]);

  const color = percentage >= 80 ? '#14b8a6' : percentage >= 55 ? '#a855f7' : '#f59e0b';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-4xl font-bold text-gray-900">{percentage}%</div>
        <div className="text-xs text-gray-500 arabic-text">تدريب اليوم</div>
      </div>
    </div>
  );
}

export default function ResultsScreen({
  child,
  correctCount,
  totalCount,
  xpEarned,
  newLevel,
  levelTitleAr,
  xpInCurrentLevel,
  xpForNextLevel,
  newlyUnlocked,
  onRestart,
  onShare,
}: ResultsScreenProps) {
  const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const message = getDadMessage(child, percentage);
  const [showAchievements, setShowAchievements] = useState(false);

  useEffect(() => {
    if (newlyUnlocked.length === 0) return;
    const timer = window.setTimeout(() => setShowAchievements(true), 900);
    return () => window.clearTimeout(timer);
  }, [newlyUnlocked]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto space-y-4"
      dir="rtl"
    >
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className={`h-2 w-full bg-gradient-to-r ${child.color}`} />
        <div className="p-7 md:p-10 text-center">
          <div className="text-5xl mb-3">{percentage >= 80 ? '🌟' : percentage >= 55 ? '🌱' : '📚'}</div>
          <h2 className="text-2xl font-bold text-gray-900 arabic-text mb-2">
            أكمل {child.nameAr} الدرس والتدريب
          </h2>
          <p className="text-gray-500 arabic-text mb-5">
            هذه النتيجة لتحديد المراجعة القادمة، وليست للحكم أو المقارنة.
          </p>

          <div className="flex justify-center mb-6">
            <ScoreCircle percentage={percentage} />
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { value: correctCount, label: 'فهمها ✅', className: 'text-emerald-600' },
              { value: totalCount - correctCount, label: 'سنراجعها 📖', className: 'text-amber-600' },
              { value: totalCount, label: 'إجمالي التدريب 📝', className: 'text-teal-600' },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 rounded-2xl py-4 px-2">
                <div className={`text-3xl font-bold ${item.className}`}>{item.value}</div>
                <div className="text-xs text-gray-500 mt-1 arabic-text">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-100 text-amber-800 rounded-full font-bold text-sm mb-6">
            <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
            +{xpEarned} نقطة تعلّم
            {newLevel && (
              <span className="mr-2 text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">
                مستوى {newLevel} جديد
              </span>
            )}
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-1 arabic-text">
              <span>{levelTitleAr}</span>
              <span>{xpInCurrentLevel}/{xpForNextLevel} XP</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(xpInCurrentLevel / xpForNextLevel) * 100}%` }}
                transition={{ duration: 1 }}
                className={`h-full bg-gradient-to-r ${child.color} rounded-full`}
              />
            </div>
          </div>

          <div className={`rounded-2xl border-2 ${child.colorBorder} ${child.colorLight} p-5 text-right mb-6`}>
            <div className="flex items-center gap-2 mb-2">
              <Heart className={`w-4 h-4 ${child.colorText} fill-current`} />
              <span className={`text-xs font-semibold ${child.colorText} arabic-text`}>رسالة من بابا</span>
            </div>
            <p className="text-sm leading-loose text-gray-800 arabic-text">{message.ar}</p>
            <p className="text-xs leading-relaxed text-gray-500 mt-2 text-left" dir="ltr">{message.en}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onRestart}
              className={`flex items-center justify-center gap-2 bg-gradient-to-r ${child.color} text-white font-semibold py-3 px-7 rounded-xl min-h-[48px] arabic-text active:scale-95 transition-transform`}
            >
              <RotateCcw className="w-5 h-5" />
              درس جديد
            </button>
            {onShare && (
              <button
                onClick={onShare}
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-7 rounded-xl min-h-[48px] arabic-text"
              >
                <MessageCircle className="w-5 h-5" />
                مشاركة التقدم
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showAchievements && newlyUnlocked.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-yellow-50 border-2 border-yellow-200 rounded-3xl p-6"
          >
            <div className="flex items-center gap-2 mb-4 justify-center">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <h3 className="font-bold text-yellow-800 arabic-text">إنجازات جديدة</h3>
            </div>
            <div className="space-y-3">
              {newlyUnlocked.map(achievement => (
                <div key={achievement.id} className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm">
                  <span className="text-3xl">{achievement.emoji}</span>
                  <div className="flex-1 text-right">
                    <div className="font-bold text-gray-900 arabic-text">{achievement.titleAr}</div>
                    <div className="text-xs text-gray-500 arabic-text">{achievement.descAr}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
