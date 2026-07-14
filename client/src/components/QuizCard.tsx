import { useDeepSeekTutor } from '@/hooks/useDeepSeekTutor';
import { QuizQuestion } from '@/lib/quizData';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, ChevronDown, ChevronUp, Heart, Loader2, Sparkles, XCircle } from 'lucide-react';
import { useState } from 'react';

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (selectedIndex: number, isCorrect: boolean) => void;
  isAnswered?: boolean;
  selectedAnswer?: number;
  showResult?: boolean;
  weakTopics?: string[];
  accuracyOnTopic?: number | null;
}

export default function QuizCard({
  question,
  onAnswer,
  isAnswered = false,
  selectedAnswer,
  showResult = false,
  weakTopics = [],
  accuracyOnTopic = null,
}: QuizCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [tutorOpen, setTutorOpen] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const { explanation, loading, explain, reset } = useDeepSeekTutor();

  const isWeakTopic = weakTopics.some(t =>
    t.toLowerCase().includes((question.subject || '').toLowerCase()) ||
    t.toLowerCase().includes((question.lesson || '').toLowerCase())
  );

  const handleSelectAnswer = (index: number) => {
    if (isAnswered) return;

    setIsAnimating(true);
    const isCorrect = index === question.correctAnswer;
    reset();
    setTutorOpen(false);
    setShowBurst(false);

    setTimeout(() => {
      onAnswer(index, isCorrect);
      setIsAnimating(false);
      explain(question, index, { weakTopics, accuracy: accuracyOnTopic });
      if (!isCorrect) setTutorOpen(true);
      if (isCorrect) { setShowBurst(true); setTimeout(() => setShowBurst(false), 1800); }
    }, 300);
  };

  const isRTL = question.language === 'ar';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`w-full max-w-2xl mx-auto ${isRTL ? 'arabic-text' : ''}`}
    >
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
        {/* Question */}
        <div className="mb-6">
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-teal-100 to-purple-100 rounded-full text-sm font-semibold text-teal-700">
              {question.subject || question.category}
            </span>
            {question.lesson && (
              <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-500">
                {question.lesson}
              </span>
            )}
            {isWeakTopic && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                <Sparkles className="w-3 h-3" />
                {isRTL ? 'راجعي هذا الموضوع' : 'Review focus'}
              </span>
            )}
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-relaxed">
            {question.question}
          </h2>
          <div className={`flex items-center gap-2 mt-3 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
            <div className="h-1 w-10 bg-gradient-to-r from-teal-500 to-purple-500 rounded-full"></div>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              {question.difficulty === 'easy' ? (isRTL ? 'سهل' : 'Easy') :
                question.difficulty === 'medium' ? (isRTL ? 'متوسط' : 'Medium') :
                  (isRTL ? 'صعب' : 'Hard')}
            </span>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectAnswer = index === question.correctAnswer;
            const showCorrect = showResult && isCorrectAnswer;
            const showIncorrect = showResult && isSelected && !isCorrectAnswer;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <button
                  onClick={() => handleSelectAnswer(index)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-xl font-medium text-base md:text-lg transition-all duration-200 flex items-center gap-3 min-h-[56px] ${isRTL ? 'flex-row-reverse text-right' : 'text-left'
                    } ${isSelected
                      ? showCorrect
                        ? 'bg-green-100 text-green-900 border-2 border-green-500'
                        : showIncorrect
                          ? 'bg-red-100 text-red-900 border-2 border-red-500'
                          : 'bg-gradient-to-r from-teal-100 to-purple-100 text-gray-900 border-2 border-teal-400'
                      : isAnswered && showCorrect
                        ? 'bg-green-50 text-green-900 border-2 border-green-300'
                        : 'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-teal-300 hover:bg-teal-50'
                    } ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="flex-shrink-0">
                    {showCorrect && <CheckCircle2 className="w-6 h-6 text-green-600" />}
                    {showIncorrect && <XCircle className="w-6 h-6 text-red-600" />}
                    {!showCorrect && !showIncorrect && (
                      <div
                        className={`w-6 h-6 rounded-full border-2 transition-all ${isSelected
                          ? 'border-teal-500 bg-teal-500'
                          : 'border-gray-300 bg-white'
                          }`}
                      />
                    )}
                  </div>
                  <span className="flex-1">{option}</span>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Correct answer burst overlay */}
        <AnimatePresence>
          {showBurst && (
            <motion.div
              key="burst"
              initial={{ opacity: 0, scale: 0.5, y: 0 }}
              animate={{ opacity: 1, scale: 1.2, y: -20 }}
              exit={{ opacity: 0, scale: 0.8, y: -40 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute left-1/2 -translate-x-1/2 top-1/2 pointer-events-none z-20 text-3xl select-none"
            >
              ✨ +1
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback + Smart Tutor */}
        {showResult && selectedAnswer !== undefined && (() => {
          const isCorrect = selectedAnswer === question.correctAnswer;
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="mt-6 space-y-3"
            >
              {/* Result banner */}
              <div className={`p-4 rounded-xl text-center font-bold text-lg ${isCorrect
                ? 'bg-green-100 text-green-900'
                : 'bg-red-100 text-red-900'
                }`}>
                {isCorrect
                  ? (isRTL ? '🎉 ممتاز! إجابة صحيحة!' : '🎉 Excellent! That\'s correct!')
                  : (isRTL ? '💪 لا بأس! تعلّمي من الخطأ:' : '💪 Not quite! Here\'s why:')}
              </div>
              {/* Accuracy badge for weak topics */}
              {isWeakTopic && accuracyOnTopic !== null && accuracyOnTopic !== undefined && (
                <div
                  className="text-xs text-center text-amber-700 bg-amber-50 rounded-lg py-1.5 px-3 arabic-text"
                  dir={isRTL ? 'rtl' : 'ltr'}
                >
                  {isRTL
                    ? `📊 دقتكِ في هذا الموضوع: ${accuracyOnTopic}% — ${isCorrect ? 'ممتاز، أنتِ تتحسنين! 🌱' : 'لا تيأسي، التكرار يُرسّخ! 💪'}`
                    : `📊 Your accuracy on this topic: ${accuracyOnTopic}% — ${isCorrect ? "Great, you're improving! 🌱" : 'Keep going, practice makes perfect! 💪'}`}
                </div>
              )}

              {/* Dad Tutor Panel */}
              <div className={`rounded-2xl border-2 overflow-hidden shadow-sm ${isCorrect ? 'border-rose-200' : 'border-violet-200'}`}>
                {/* Panel header */}
                <button
                  onClick={() => setTutorOpen(o => !o)}
                  className={`w-full flex items-center gap-2 px-4 py-3 font-semibold text-sm transition-colors ${isCorrect
                      ? 'bg-gradient-to-r from-rose-50 to-pink-50 text-rose-800 hover:from-rose-100 hover:to-pink-100'
                      : 'bg-gradient-to-r from-violet-50 to-purple-50 text-violet-900 hover:from-violet-100 hover:to-purple-100'
                    } ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <Heart className="w-4 h-4 flex-shrink-0 fill-current" />
                  <span className="flex-1 text-start">
                    {loading
                      ? (isRTL ? '💭 بابا يفكّر في الشرح...' : '💭 Dad is preparing your explanation...')
                      : isRTL
                        ? (isCorrect ? '💙 كلام بابا — أنا فخور فيكِ!' : '💜 بابا يشرح لكِ...')
                        : (isCorrect ? "💙 Dad says — I'm so proud of you!" : '💜 Dad explains...')}
                  </span>
                  {loading
                    ? <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                    : tutorOpen
                      ? <ChevronUp className="w-4 h-4 flex-shrink-0" />
                      : <ChevronDown className="w-4 h-4 flex-shrink-0" />}
                </button>

                {/* Explanation body */}
                <AnimatePresence initial={false}>
                  {tutorOpen && (
                    <motion.div
                      key="tutor-body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div
                        dir={isRTL ? 'rtl' : 'ltr'}
                        className={`px-5 py-4 text-sm leading-loose bg-white text-gray-800 ${isRTL ? 'arabic-text text-right' : 'text-left'}`}
                      >
                        {loading ? (
                          <div className={`flex items-center gap-2 text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{isRTL ? 'بابا يكتب لكِ...' : 'Dad is writing for you...'}</span>
                          </div>
                        ) : (
                          <p className="whitespace-pre-line">
                            {explanation || (isRTL ? 'جاري تحضير الشرح...' : 'Preparing explanation...')}
                          </p>
                        )}
                      </div>
                      <div className={`px-5 pb-3 flex items-center gap-1 text-xs text-gray-400 ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
                        <Heart className="w-3 h-3 fill-rose-300 text-rose-300" />
                        <span>{isRTL ? 'بابا دايمًا معكِ يا لينيدا' : 'Dad is always with you, Linda'}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })()}
      </div>
    </motion.div>
  );
}
