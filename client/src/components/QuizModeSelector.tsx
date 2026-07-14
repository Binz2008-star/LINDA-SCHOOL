import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { BookOpen, CalendarDays, Globe, Languages } from 'lucide-react';

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
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const modes = [
    {
      id: 'daily',
      label: 'اختبار اليوم',
      description: dayStr,
      icon: CalendarDays,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50',
      badge: 'جديد يومياً',
    },
    {
      id: 'mixed',
      label: 'تحدي مختلط',
      description: 'أسئلة عربية وإنجليزية',
      icon: Globe,
      color: 'from-blue-500 to-purple-500',
      bgColor: 'from-blue-50 to-purple-50',
      badge: null,
    },
    {
      id: 'arabic',
      label: 'عربي فقط',
      description: 'تدرّب على الأسئلة العربية',
      icon: Languages,
      color: 'from-teal-500 to-green-500',
      bgColor: 'from-teal-50 to-green-50',
      badge: null,
    },
    {
      id: 'english',
      label: 'English Only',
      description: 'Practice English questions',
      icon: Globe,
      color: 'from-orange-500 to-pink-500',
      bgColor: 'from-orange-50 to-pink-50',
      badge: null,
    },
    {
      id: 'subject',
      label: 'حسب المادة',
      description: 'اختر مادة محددة',
      icon: BookOpen,
      color: 'from-indigo-500 to-violet-500',
      bgColor: 'from-indigo-50 to-violet-50',
      badge: null,
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-4xl mx-auto"
    >
      <div className="text-center mb-12">
        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
        >
          اختر وضع الاختبار
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="text-base text-gray-600 arabic-text"
        >
          اختاري الوضع المناسب وابدئي!
        </motion.p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <motion.div
              key={mode.id}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              onClick={() => onSelectMode(mode.id as 'mixed' | 'arabic' | 'english' | 'subject' | 'daily')}
              className={mode.id === 'daily' ? 'col-span-2 md:col-span-1' : ''}
            >
              <button
                className={`w-full h-full p-5 md:p-7 rounded-2xl bg-gradient-to-br ${mode.bgColor} border-2 border-transparent hover:border-gray-300 transition-all duration-300 cursor-pointer group relative`}
              >
                {mode.badge && (
                  <span className="absolute top-3 right-3 text-xs font-bold bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">
                    {mode.badge}
                  </span>
                )}
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${mode.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1">
                    {mode.label}
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    {mode.description}
                  </p>
                  <div className="w-full">
                    <Button
                      className={`w-full bg-gradient-to-r ${mode.color} hover:shadow-lg text-white font-semibold py-2 rounded-lg text-sm min-h-[40px]`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMode(mode.id as 'mixed' | 'arabic' | 'english' | 'subject' | 'daily');
                      }}
                    >
                      ابدأ
                    </Button>
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        variants={itemVariants}
        className="mt-8 p-5 bg-gradient-to-r from-teal-100 to-purple-100 rounded-xl border-r-4 border-teal-500"
      >
        <p className="text-gray-800 font-semibold text-sm">
          💡 نصيحة: ابدأ بـ «اختبار اليوم» للحصول على أسئلة جديدة كل يوم تلقائياً!
        </p>
      </motion.div>
    </motion.div>
  );
}
