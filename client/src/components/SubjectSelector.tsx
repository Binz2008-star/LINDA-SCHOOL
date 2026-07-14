import { motion } from 'framer-motion';
import { BookOpen, ChevronRight } from 'lucide-react';
import { getAllSubjects, getQuestionsBySubject } from '@/lib/quizData';

interface SubjectSelectorProps {
  onSelectSubject: (subject: string) => void;
  onBack: () => void;
}

const subjectColors: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  'العلوم':              { bg: 'from-blue-50 to-cyan-50',    border: 'border-blue-200',   text: 'text-blue-700',   dot: 'bg-blue-400' },
  'الرياضيات':           { bg: 'from-purple-50 to-indigo-50',border: 'border-purple-200', text: 'text-purple-700', dot: 'bg-purple-400' },
  'اللغة العربية':       { bg: 'from-teal-50 to-emerald-50', border: 'border-teal-200',   text: 'text-teal-700',   dot: 'bg-teal-400' },
  'التاريخ':             { bg: 'from-amber-50 to-orange-50', border: 'border-amber-200',  text: 'text-amber-700',  dot: 'bg-amber-400' },
  'الجغرافيا':           { bg: 'from-green-50 to-lime-50',   border: 'border-green-200',  text: 'text-green-700',  dot: 'bg-green-400' },
  'التربية الإسلامية':   { bg: 'from-rose-50 to-pink-50',    border: 'border-rose-200',   text: 'text-rose-700',   dot: 'bg-rose-400' },
  'Science':    { bg: 'from-blue-50 to-cyan-50',    border: 'border-blue-200',   text: 'text-blue-700',   dot: 'bg-blue-400' },
  'Mathematics':{ bg: 'from-purple-50 to-indigo-50',border: 'border-purple-200', text: 'text-purple-700', dot: 'bg-purple-400' },
  'English':    { bg: 'from-teal-50 to-emerald-50', border: 'border-teal-200',   text: 'text-teal-700',   dot: 'bg-teal-400' },
  'History':    { bg: 'from-amber-50 to-orange-50', border: 'border-amber-200',  text: 'text-amber-700',  dot: 'bg-amber-400' },
  'Geography':  { bg: 'from-green-50 to-lime-50',   border: 'border-green-200',  text: 'text-green-700',  dot: 'bg-green-400' },
};

const fallbackColor = { bg: 'from-gray-50 to-slate-50', border: 'border-gray-200', text: 'text-gray-700', dot: 'bg-gray-400' };

export default function SubjectSelector({ onSelectSubject, onBack }: SubjectSelectorProps) {
  const subjects = getAllSubjects();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">اختر المادة</h2>
        <p className="text-gray-500">تدرّب على مادة محددة</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {subjects.map((subject, i) => {
          const color = subjectColors[subject] ?? fallbackColor;
          const count = getQuestionsBySubject(subject).length;
          return (
            <motion.button
              key={subject}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              onClick={() => onSelectSubject(subject)}
              className={`p-5 rounded-2xl bg-gradient-to-br ${color.bg} border-2 ${color.border} text-left transition-all duration-200 hover:shadow-md group`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-3 h-3 rounded-full ${color.dot} mt-1`} />
                <ChevronRight className={`w-4 h-4 ${color.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
              </div>
              <div className={`font-bold text-sm ${color.text} mb-1`}>{subject}</div>
              <div className="text-xs text-gray-400">{count} سؤال</div>
            </motion.button>
          );
        })}
      </div>

      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mx-auto transition-colors text-sm"
      >
        <BookOpen className="w-4 h-4" />
        العودة لاختيار الوضع
      </button>
    </motion.div>
  );
}
