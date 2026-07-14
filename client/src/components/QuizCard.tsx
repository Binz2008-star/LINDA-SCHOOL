import { useDeepSeekTutor } from '@/hooks/useDeepSeekTutor';
import { ChildProfile } from '@/lib/children';
import { QuizQuestion } from '@/lib/quizData';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Heart,
  Lightbulb,
  Loader2,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (selectedIndex: number, isCorrect: boolean) => void;
  isAnswered?: boolean;
  selectedAnswer?: number;
  showResult?: boolean;
  weakTopics?: string[];
  accuracyOnTopic?: number | null;
  childProfile?: ChildProfile;
}

export default function QuizCard({
  question,
  onAnswer,
  isAnswered = false,
  selectedAnswer,
  showResult = false,
  weakTopics = [],
  accuracyOnTopic = null,
  childProfile,
}: QuizCardProps) {
  const [tutorOpen, setTutorOpen] = useState(true);
  const [showBurst, setShowBurst] = useState(false);
  const { explanation, loading, explain, reset } = useDeepSeekTutor();

  const isRTL = question.language === 'ar';
  const isMale = childProfile ? ['adam', 'noah'].includes(childProfile.id) : false;
  const childNameAr = childProfile?.nameAr ?? 'ليندا';
  const childNameEn = childProfile?.nameEn ?? 'Linda';

  const isWeakTopic = weakTopics.some(topic =>
    topic.toLowerCase().includes((question.subject || '').toLowerCase())
    || topic.toLowerCase().includes((question.lesson || '').toLowerCase())
  );

  const handleSelectAnswer = (index: number) => {
    if (isAnswered) return;

    const isCorrect = index === question.correctAnswer;
    reset();
    setTutorOpen(true);
    setShowBurst(false);
    onAnswer(index, isCorrect);
    explain(question, index, {
      weakTopics,
      accuracy: accuracyOnTopic,
      child: childProfile,
    });

    if (isCorrect) {
      setShowBurst(true);
      window.setTimeout(() => setShowBurst(false), 1800);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`w-full max-w-2xl mx-auto ${isRTL ? 'arabic-text' : ''}`}
    >
      <div className="relative bg-white rounded-2xl shadow-lg p-6 md:p-10">
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
                {isRTL ? (isMale ? 'موضوع للمراجعة' : 'موضوع للمراجعة') : 'Review focus'}
              </span>
            )}
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-relaxed">
            {question.question}
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            {isRTL
              ? 'اقرأ السؤال كاملاً، وحدد ما الذي يطلبه، ثم اختر الإجابة وفسّرها في ذهنك.'
              : 'Read the whole question, identify what it asks, then choose and explain your reason.'}
          </p>
        </div>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectAnswer = index === question.correctAnswer;
            const showCorrect = showResult && isCorrectAnswer;
            const showIncorrect = showResult && isSelected && !isCorrectAnswer;
            const isDimmed = showResult && !showCorrect && !showIncorrect;

            return (
              <motion.button
                key={`${question.id}-${index}`}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: isDimmed ? 0.58 : 1, x: 0 }}
                transition={{ duration: 0.25, delay: index * 0.06 }}
                onClick={() => handleSelectAnswer(index)}
                disabled={isAnswered}
                className={`w-full p-4 rounded-xl font-medium text-base md:text-lg transition-all duration-200 border-2 min-h-[58px] ${
                  isRTL ? 'text-right' : 'text-left'
                } ${
                  showCorrect
                    ? 'bg-green-100 text-green-950 border-green-500'
                    : showIncorrect
                      ? 'bg-red-50 text-red-950 border-red-400'
                      : isSelected
                        ? 'bg-teal-50 text-gray-900 border-teal-400'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-teal-300 hover:bg-teal-50'
                } ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="flex-shrink-0">
                    {showCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : showIncorrect ? (
                      <XCircle className="w-6 h-6 text-red-500" />
                    ) : (
                      <div className={`w-6 h-6 rounded-full border-2 ${isSelected ? 'border-teal-500 bg-teal-500' : 'border-gray-300 bg-white'}`} />
                    )}
                  </div>
                  <span className="flex-1">{option}</span>
                </div>

                {showCorrect && (
                  <div className={`mt-2 text-xs font-normal text-green-800 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {isRTL ? 'هذه الإجابة تطابق المطلوب في السؤال.' : 'This answer matches what the question asks.'}
                  </div>
                )}
                {showIncorrect && (
                  <div className={`mt-2 text-xs font-normal text-red-800 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {isRTL
                      ? 'هذا الاختيار مفهوم، لكنه لا يجيب عن الجزء الأساسي من السؤال. اقرأ الشرح أدناه.'
                      : 'This choice is understandable, but it does not answer the key part. Read the explanation below.'}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {showBurst && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 0 }}
              animate={{ opacity: 1, scale: 1.2, y: -20 }}
              exit={{ opacity: 0, scale: 0.8, y: -40 }}
              transition={{ duration: 0.6 }}
              className="absolute left-1/2 -translate-x-1/2 top-1/2 pointer-events-none z-20 text-3xl"
            >
              ✨
            </motion.div>
          )}
        </AnimatePresence>

        {showResult && selectedAnswer !== undefined && (() => {
          const isCorrect = selectedAnswer === question.correctAnswer;
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-4"
            >
              <div className={`p-4 rounded-xl text-center font-bold text-lg ${
                isCorrect ? 'bg-green-100 text-green-900' : 'bg-amber-100 text-amber-950'
              }`}>
                {isRTL
                  ? isCorrect
                    ? `أحسنت يا ${childNameAr}. الآن تعلّم لماذا الإجابة صحيحة.`
                    : `لا بأس يا ${childNameAr}. الخطأ هنا خطوة لفهم الفكرة.`
                  : isCorrect
                    ? `Well done, ${childNameEn}. Now learn why it is correct.`
                    : `That is okay, ${childNameEn}. This mistake helps us learn.`}
              </div>

              {isWeakTopic && accuracyOnTopic !== null && accuracyOnTopic !== undefined && (
                <div className="text-xs text-center text-amber-800 bg-amber-50 rounded-lg py-2 px-3">
                  {isRTL
                    ? `هذا الموضوع يحتاج تدريباً إضافياً. الدقة الحالية: ${accuracyOnTopic}%. لا توجد مقارنة مع أي شخص آخر.`
                    : `This topic needs more practice. Current accuracy: ${accuracyOnTopic}%. There is no comparison with anyone else.`}
                </div>
              )}

              <div className="rounded-2xl border-2 border-violet-200 overflow-hidden shadow-sm">
                <button
                  onClick={() => setTutorOpen(open => !open)}
                  className={`w-full flex items-center gap-2 px-4 py-3 font-semibold text-sm bg-gradient-to-r from-violet-50 to-purple-50 text-violet-900 hover:from-violet-100 hover:to-purple-100 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <Lightbulb className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-start">
                    {loading
                      ? isRTL ? 'بابا المعلم يحضّر الشرح...' : 'Dad the Tutor is preparing the explanation...'
                      : isRTL ? 'الشرح التعليمي — اقرأه قبل الانتقال' : 'Learning explanation — read before continuing'}
                  </span>
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : tutorOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {tutorOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className={`px-5 py-5 text-sm leading-loose bg-white text-gray-800 ${isRTL ? 'text-right arabic-text' : 'text-left'}`}>
                        {loading ? (
                          <div className={`flex items-center gap-2 text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{isRTL ? 'جاري كتابة الشرح...' : 'Writing the explanation...'}</span>
                          </div>
                        ) : (
                          <p className="whitespace-pre-line">
                            {explanation || question.explanation || (isRTL ? 'راجع الفكرة وحاول شرحها بكلماتك.' : 'Review the idea and explain it in your own words.')}
                          </p>
                        )}
                      </div>
                      <div className={`px-5 pb-4 flex items-center gap-1 text-xs text-gray-500 ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
                        <Heart className="w-3 h-3 fill-rose-300 text-rose-300" />
                        <span>
                          {isRTL
                            ? `الشرح سيبقى هنا حتى تضغط «فهمت، التالي» يا ${childNameAr}.`
                            : `This explanation stays until you press “I understand, next”, ${childNameEn}.`}
                        </span>
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
