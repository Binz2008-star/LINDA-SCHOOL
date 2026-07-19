import { motion } from 'framer-motion';
import { BookOpen, CalendarDays, Globe, Languages, Sparkles, Zap } from 'lucide-react';

interface QuizModeSelectorProps {
  onSelectMode: (mode: 'mixed' | 'arabic' | 'english' | 'subject' | 'daily') => void;
}

export default function QuizModeSelector({
  onSelectMode,
}: QuizModeSelectorProps) {
  const today = new Date();
  const dayStr = today.toLocaleDateString('ar-SA', { weekday: 'long' });
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const modes = [
    {
      id: 'daily',
      label: 'اختبار اليوم',
      description: dayStr,
      icon: CalendarDays,
      gradient: 'from-amber-400 via-orange-400 to-rose-400',
      glow: 'shadow-orange-200/60',
      badge: 'جديد يومياً',
      featured: true,
    },
    {
      id: 'mixed',
      label: 'تحدي مختلط',
      description: 'أسئلة عربية وإنجليزية',
      icon: Globe,
      gradient: 'from-blue-500 via-indigo-500 to-purple-500',
      glow: 'shadow-indigo-200/60',
      badge: null,
      featured: false,
    },
    {
      id: 'arabic',
      label: 'عربي فقط',
      description: 'تدرّب على الأسئلة العربية',
      icon: Languages,
      gradient: 'from-teal-400 via-emerald-400 to-green-500',
      glow: 'shadow-emerald-200/60',
      badge: null,
      featured: false,
    },
    {
      id: 'english',
      label: 'English Only',
      description: 'Practice English questions',
      icon: Globe,
      gradient: 'from-pink-400 via-rose-400 to-orange-400',
      glow: 'shadow-rose-200/60',
      badge: null,
      featured: false,
    },
    {
      id: 'subject',
      label: 'حسب المادة',
      description: 'اختر مادة محددة',
      icon: BookOpen,
      gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
      glow: 'shadow-purple-200/60',
      badge: null,
      featured: false,
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-4xl mx-auto"
      dir="rtl"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-gradient-to-r from-violet-100 to-pink-100 border border-violet-200">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <span className="text-sm font-bold text-violet-700 arabic-text">وضع جديد · Remix 2026</span>
        </motion.div>
        <motion.h2
          variants={itemVariants}
          className="text-3xl md:text-5xl font-black text-gray-900 mb-3 arabic-text"
        >
          اختاري تحدي اليوم 🎯
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="text-base text-gray-500 arabic-text"
        >
          كل وضع له نكهة خاصة — جرّبيها كلها! 🚀
        </motion.p>
      </div>

      {/* Featured Daily Card */}
      <motion.div variants={itemVariants} className="mb-5">
        <button
          onClick={() => onSelectMode('daily')}
          className="w-full group relative overflow-hidden rounded-3xl p-[2px] bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 shadow-xl shadow-orange-200/50 hover:shadow-2xl hover:shadow-orange-200/60 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="relative rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6 md:p-8 overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-orange-200/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-rose-200/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

            <div className="relative flex items-center gap-5">
              {/* Icon */}
              <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <CalendarDays className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>

              {/* Text */}
              <div className="flex-1 text-right">
                <div className="flex items-center gap-2 mb-1 justify-end">
                  <span className="text-xs font-black bg-gradient-to-r from-amber-500 to-rose-500 text-white px-2.5 py-0.5 rounded-full">
                    ✨ {dayStr}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 arabic-text">اختبار اليوم</h3>
                </div>
                <p className="text-sm text-gray-500 arabic-text mb-2">أسئلة جديدة مختارة بعناية كل يوم — لا تفوّتيها!</p>
                <div className="flex items-center gap-2 justify-end">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                    <Zap className="w-3 h-3" />
                    ابدأ الآن
                  </span>
                  <span className="text-xs font-bold bg-yellow-300 text-yellow-900 px-2.5 py-1 rounded-full">
                    🔥 جديد يومياً
                  </span>
                </div>
              </div>
            </div>
          </div>
        </button>
      </motion.div>

      {/* Other modes grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {modes.filter(m => !m.featured).map((mode) => {
          const Icon = mode.icon;
          return (
            <motion.button
              key={mode.id}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectMode(mode.id as 'mixed' | 'arabic' | 'english' | 'subject' | 'daily')}
              className="group relative overflow-hidden rounded-2xl p-[2px] bg-gradient-to-br opacity-90 hover:opacity-100 transition-all duration-300"
              style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${mode.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} />
              <div className={`relative rounded-2xl bg-white p-4 md:p-5 h-full flex flex-col items-center text-center shadow-md ${mode.glow} group-hover:shadow-lg transition-all duration-300`}>
                {/* Icon */}
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${mode.gradient} flex items-center justify-center mb-3 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                {/* Label */}
                <h3 className="text-sm md:text-base font-black text-gray-900 mb-1 arabic-text">
                  {mode.label}
                </h3>
                {/* Description */}
                <p className="text-[11px] md:text-xs text-gray-400 leading-snug mb-3 arabic-text">
                  {mode.description}
                </p>
                {/* CTA pill */}
                <span className={`mt-auto inline-flex items-center gap-1 text-xs font-bold bg-gradient-to-r ${mode.gradient} bg-clip-text text-transparent group-hover:bg-clip-border group-hover:text-white transition-all`}>
                  ابدأ ←
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Tip */}
      <motion.div
        variants={itemVariants}
        className="mt-6 p-4 bg-gradient-to-r from-violet-50 to-pink-50 rounded-2xl border border-violet-100"
      >
        <p className="text-gray-600 font-semibold text-sm arabic-text text-center">
          💡 نصيحة بابا: ابدئي بـ«اختبار اليوم» ثم جرّبي الأوضاع الأخرى لتوسيع معرفتك! 🌟
        </p>
      </motion.div>
    </motion.div>
  );
}
