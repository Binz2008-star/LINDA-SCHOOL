import { getAllSubjects, getQuestionsBySubject } from '@/lib/quizData';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';

interface SubjectSelectorProps {
  onSelectSubject: (subject: string) => void;
  onBack: () => void;
}

const subjectColors: Record<string, { bg: string; border: string; text: string; dot: string; icon: string }> = {
  'العلوم': { bg: 'from-blue-50 to-cyan-50', border: 'border-blue-200', text: 'text-blue-700', dot: 'bg-blue-400', icon: '🔬' },
  'الرياضيات': { bg: 'from-purple-50 to-indigo-50', border: 'border-purple-200', text: 'text-purple-700', dot: 'bg-purple-400', icon: '🔢' },
  'اللغة العربية': { bg: 'from-teal-50 to-emerald-50', border: 'border-teal-200', text: 'text-teal-700', dot: 'bg-teal-400', icon: '📖' },
  'التاريخ': { bg: 'from-amber-50 to-orange-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-400', icon: '🏛️' },
  'الجغرافيا': { bg: 'from-green-50 to-lime-50', border: 'border-green-200', text: 'text-green-700', dot: 'bg-green-400', icon: '🌍' },
  'التربية الإسلامية': { bg: 'from-rose-50 to-pink-50', border: 'border-rose-200', text: 'text-rose-700', dot: 'bg-rose-400', icon: '🕌' },
  'Science': { bg: 'from-blue-50 to-cyan-50', border: 'border-blue-200', text: 'text-blue-700', dot: 'bg-blue-400', icon: '🔬' },
  'Mathematics': { bg: 'from-purple-50 to-indigo-50', border: 'border-purple-200', text: 'text-purple-700', dot: 'bg-purple-400', icon: '🔢' },
  'English': { bg: 'from-teal-50 to-emerald-50', border: 'border-teal-200', text: 'text-teal-700', dot: 'bg-teal-400', icon: '📚' },
  'History': { bg: 'from-amber-50 to-orange-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-400', icon: '🏛️' },
  'Geography': { bg: 'from-green-50 to-lime-50', border: 'border-green-200', text: 'text-green-700', dot: 'bg-green-400', icon: '🌍' },
};

const fallbackColor = { bg: 'from-gray-50 to-slate-50', border: 'border-gray-200', text: 'text-gray-700', dot: 'bg-gray-400', icon: '📚' };

export default function SubjectSelector({ onSelectSubject, onBack }: SubjectSelectorProps) {
  const subjects = getAllSubjects();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-3xl mx-auto"
      dir="rtl"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-3 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200"
        >
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-bold text-indigo-700 arabic-text">اختر مادتك المفضلة</span>
        </motion.div>
        <h2 className="text-3xl font-black text-gray-900 mb-2 arabic-text">📚 اختر المادة</h2>
        <p className="text-gray-500 arabic-text">تدرّب على مادة محددة وعمّق معرفتك</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 mb-6">
        {subjects.map((subject, i) => {
          const color = subjectColors[subject] ?? fallbackColor;
          const count = getQuestionsBySubject(subject).length;
          return (
            <motion.button
              key={subject}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
              whileHover={{ y: -5, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectSubject(subject)}
              className={`relative p-5 rounded-2xl bg-gradient-to-br ${color.bg} border-2 ${color.border} transition-all duration-300 hover:shadow-lg group overflow-hidden`
              }
            >
              <div className={`absolute -top-6 -right-6 w-20 h-20 ${color.dot} opacity-10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500`} />

              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{color.icon}</span>
                  <span className={`text-[10px] font-bold ${color.text} bg-white/70 px-2 py-0.5 rounded-full`}>
                    {count} سؤال
                  </span>
                </div>
                <div className={`font-black text-sm ${color.text} mb-1 arabic-text`}>{subject}</div>
                <div className={`flex items-center gap-1 text-xs font-bold ${color.text} opacity-60 group-hover:opacity-100 transition-opacity`}>
                  <span className="arabic-text">ابدأ</span>
                  <ArrowRight className="w-3 h-3 rtl-flip" />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mx-auto transition-colors text-sm arabic-text"
      >
        <ArrowRight className="w-4 h-4 rtl-flip" />
        العودة لاختيار الوضع
      </button>
    </motion.div>
  );
}
