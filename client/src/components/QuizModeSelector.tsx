import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { BookOpen, CalendarDays, Globe, Languages, Shapes } from 'lucide-react';

interface QuizModeSelectorProps {
  onSelectMode: (mode: 'mixed' | 'arabic' | 'english' | 'subject' | 'daily') => void;
}

const modes = [
  {
    id: 'daily' as const,
    label: 'درس اليوم',
    description: 'شرح قصير ثم تدريب مناسب',
    icon: CalendarDays,
    color: 'from-yellow-500 to-orange-500',
    background: 'from-yellow-50 to-orange-50',
    badge: 'ابدأ من هنا',
  },
  {
    id: 'mixed' as const,
    label: 'درس متنوع',
    description: 'قراءة وحساب وعلوم بخطوات صغيرة',
    icon: Shapes,
    color: 'from-blue-500 to-purple-500',
    background: 'from-blue-50 to-purple-50',
  },
  {
    id: 'arabic' as const,
    label: 'اللغة العربية',
    description: 'قراءة وفهم وكلمات وقواعد أساسية',
    icon: Languages,
    color: 'from-teal-500 to-green-500',
    background: 'from-teal-50 to-green-50',
  },
  {
    id: 'english' as const,
    label: 'English lesson',
    description: 'Words, reading and simple grammar',
    icon: Globe,
    color: 'from-orange-500 to-pink-500',
    background: 'from-orange-50 to-pink-50',
  },
  {
    id: 'subject' as const,
    label: 'اختر مادة',
    description: 'درس مركز في مادة واحدة',
    icon: BookOpen,
    color: 'from-indigo-500 to-violet-500',
    background: 'from-indigo-50 to-violet-50',
  },
];

export default function QuizModeSelector({ onSelectMode }: QuizModeSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-4xl mx-auto"
      dir="rtl"
    >
      <div className="text-center mb-9">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 arabic-text">
          ماذا سنتعلم اليوم؟
        </h2>
        <p className="text-gray-600 arabic-text">
          كل خيار يبدأ بشرح ومثال، ثم تدريب قصير مع توضيح كل إجابة.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {modes.map((mode, index) => {
          const Icon = mode.icon;
          return (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -5 }}
              className={mode.id === 'daily' ? 'col-span-2 md:col-span-1' : ''}
            >
              <button
                onClick={() => onSelectMode(mode.id)}
                className={`relative w-full h-full p-5 md:p-7 rounded-2xl bg-gradient-to-br ${mode.background} border-2 border-transparent hover:border-gray-300 transition-all group`}
              >
                {mode.badge && (
                  <span className="absolute top-3 right-3 text-xs font-bold bg-yellow-400 text-yellow-950 px-2 py-1 rounded-full">
                    {mode.badge}
                  </span>
                )}
                <div className="flex flex-col items-center text-center">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${mode.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 arabic-text">
                    {mode.label}
                  </h3>
                  <p className="text-xs text-gray-600 mb-4 min-h-8 arabic-text">
                    {mode.description}
                  </p>
                  <Button
                    className={`w-full bg-gradient-to-r ${mode.color} text-white font-semibold rounded-lg min-h-[42px] arabic-text`}
                    onClick={event => {
                      event.stopPropagation();
                      onSelectMode(mode.id);
                    }}
                  >
                    افتح الدرس
                  </Button>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 p-5 bg-white border border-gray-200 rounded-xl text-center">
        <p className="text-gray-700 text-sm arabic-text">
          🌱 لا توجد مقارنة بين الإخوة. كل طفل يبدأ من مستواه الحقيقي ويتقدم بطريقته.
        </p>
      </div>
    </motion.div>
  );
}
