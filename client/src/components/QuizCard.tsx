import { useDeepSeekTutor } from '@/hooks/useDeepSeekTutor';
import { ChildProfile } from '@/lib/children';
import { QuizQuestion } from '@/lib/quizData';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Heart, Loader2, Sparkles, XCircle } from 'lucide-react';
import { useState } from 'react';

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (selectedIndex: number, isCorrect: boolean) => void;
  onNext: () => void;           // caller controls navigation
  isAnswered?: boolean;
  selectedAnswer?: number;
  showResult?: boolean;
  isLast?: boolean;
  weakTopics?: string[];
  accuracyOnTopic?: number | null;
  childProfile?: ChildProfile;
}

const OPTION_LABELS = ['أ', 'ب', 'ج', 'د'];
const OPTION_LABELS_EN = ['A', 'B', 'C', 'D'];

export default function QuizCard({
  question,
  onAnswer,
  onNext,
  isAnswered = false,
  selectedAnswer,
  showResult = false,
  isLast = false,
  weakTopics = [],
  accuracyOnTopic = null,
  childProfile,
}: QuizCardProps) {
  const [showBurst, setShowBurst] = useState(false);
  const { explanation, loading, explain, reset } = useDeepSeekTutor();

  const isRTL = question.language === 'ar';
  const isMale = childProfile ? ['adam', 'noah'].includes(childProfile.id) : false;
  const childName = childProfile ? (isRTL ? childProfile.nameAr : childProfile.nameEn) : (isRTL ? 'لينيدا' : 'Linda');

  const isWeakTopic = weakTopics.some(t =>
    t.toLowerCase().includes((question.subject || '').toLowerCase()) ||
    t.toLowerCase().includes((question.lesson || '').toLowerCase())
  );

  const handleSelectAnswer = (index: number) => {
    if (isAnswered) return;
    const isCorrect = index === question.correctAnswer;
    reset();
    onAnswer(index, isCorrect);
    explain(question, index, { weakTopics, accuracy: accuracyOnTopic, child: childProfile });
    if (isCorrect) {
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 1800);
    }
  };

  const answered = showResult && selectedAnswer !== undefined;
  const isCorrectAnswer = answered && selectedAnswer === question.correctAnswer;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`w-full max-w-2xl mx-auto ${isRTL ? 'arabic-text' : ''}`}
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* ── Subject bar ─────────────────────────────────────────── */}
        <div className="flex items-center gap-2 px-5 pt-5 pb-3 flex-wrap">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-teal-100 to-purple-100 rounded-full text-sm font-semibold text-teal-700">
            <BookOpen className="w-3.5 h-3.5" />
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
              {isRTL ? 'موضوع يحتاج مراجعة' : 'Review focus'}
            </span>
          )}
          <span className="ms-auto text-xs font-medium text-gray-400 uppercase tracking-wide">
            {question.difficulty === 'easy' ? (isRTL ? 'سهل' : 'Easy') :
              question.difficulty === 'medium' ? (isRTL ? 'متوسط' : 'Medium') :
                (isRTL ? 'صعب' : 'Hard')}
          </span>
        </div>

        {/* ── Question text ────────────────────────────────────────── */}
        <div className="px-5 pb-5">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-relaxed">
            {question.question}
          </h2>
        </div>

        {/* ── Options ─────────────────────────────────────────────── */}
        <div className="px-5 pb-5 space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectOpt = index === question.correctAnswer;
            const showCorrect = answered && isCorrectOpt;
            const showWrong = answered && isSelected && !isCorrectOpt;
            const showNeutral = answered && !isCorrectOpt && !isSelected;
            const labels = isRTL ? OPTION_LABELS : OPTION_LABELS_EN;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
              >
                <button
                  onClick={() => handleSelectAnswer(index)}
                  disabled={isAnswered}
                  className={`w-full rounded-xl font-medium text-base transition-all duration-200
                    flex items-start gap-3 min-h-[56px] p-4
                    ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}
                    ${showCorrect ? 'bg-green-50 border-2 border-green-500 text-green-900' :
                      showWrong ? 'bg-red-50 border-2 border-red-500 text-red-900' :
                        showNeutral ? 'bg-gray-50 border-2 border-gray-200 text-gray-400' :
                          isSelected ? 'bg-teal-50 border-2 border-teal-400 text-gray-900' :
                            'bg-gray-50 border-2 border-gray-200 text-gray-700 hover:border-teal-300 hover:bg-teal-50'}
                    ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  {/* Label circle */}
                  <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold mt-0.5
                    ${showCorrect ? 'bg-green-500 text-white' :
                      showWrong ? 'bg-red-500 text-white' :
                        showNeutral ? 'bg-gray-200 text-gray-400' :
                          isSelected ? 'bg-teal-500 text-white' :
                            'bg-gray-200 text-gray-600'}`}>
                    {showCorrect ? <CheckCircle2 className="w-4 h-4" /> :
                      showWrong ? <XCircle className="w-4 h-4" /> :
                        labels[index]}
                  </div>

                  {/* Option text */}
                  <span className="flex-1 leading-snug">{option}</span>

                  {/* Inline mini-hint after answering */}
                  {answered && showCorrect && (
                    <span className={`flex-shrink-0 text-xs font-semibold text-green-600 ${isRTL ? 'me-auto' : 'ms-auto'}`}>
                      ✓ {isRTL ? 'الإجابة الصحيحة' : 'Correct'}
                    </span>
                  )}
                  {answered && showWrong && (
                    <span className={`flex-shrink-0 text-xs font-semibold text-red-500 ${isRTL ? 'me-auto' : 'ms-auto'}`}>
                      ✗ {isRTL ? 'اخترت هذا' : 'Your pick'}
                    </span>
                  )}
                </button>

                {/* Per-option explanation (shown after answering) */}
                {answered && (showCorrect || showWrong) && question.optionExplanations?.[index] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                    className={`mt-1 mx-1 px-4 py-2 rounded-lg text-sm leading-relaxed
                      ${showCorrect ? 'bg-green-50 text-green-800 border border-green-200' :
                        'bg-red-50 text-red-800 border border-red-200'}`}
                  >
                    {question.optionExplanations[index]}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* ── XP burst ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {showBurst && (
            <motion.div
              key="burst"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.3 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="text-center text-3xl pointer-events-none select-none py-1"
            >
              ✨ +XP
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Feedback section (stays visible until Next is pressed) ── */}
        <AnimatePresence>
          {answered && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="border-t border-gray-100"
            >
              {/* Result banner */}
              <div className={`px-5 py-4 flex items-center gap-3
                ${isRTL ? 'flex-row-reverse' : ''}
                ${isCorrectAnswer ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-xl
                  ${isCorrectAnswer ? 'bg-green-100' : 'bg-red-100'}`}>
                  {isCorrectAnswer ? '🎉' : '💪'}
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <p className={`font-bold text-base ${isCorrectAnswer ? 'text-green-800' : 'text-red-800'}`}>
                    {isCorrectAnswer
                      ? (isRTL ? `أحسنت يا ${childName}! إجابة صحيحة 💚` : `Well done ${childName}! Correct! �`)
                      : (isRTL ? `لا بأس يا ${childName}، الخطأ درس 💜` : `No worries ${childName}, mistakes teach us! �`)}
                  </p>
                  {!isCorrectAnswer && (
                    <p className={`text-sm mt-0.5 ${isRTL ? 'text-red-700' : 'text-red-700'}`}>
                      {isRTL
                        ? `الإجابة الصحيحة: ${question.options[question.correctAnswer]}`
                        : `Correct answer: ${question.options[question.correctAnswer]}`}
                    </p>
                  )}
                </div>
              </div>

              {/* Dad Tutor — always open, never collapsible */}
              <div className={`px-5 py-4 ${isCorrectAnswer ? 'bg-rose-50/60' : 'bg-violet-50/60'}`}>
                <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Heart className={`w-4 h-4 fill-current flex-shrink-0 ${isCorrectAnswer ? 'text-rose-500' : 'text-violet-500'}`} />
                  <span className={`font-semibold text-sm ${isCorrectAnswer ? 'text-rose-800' : 'text-violet-900'}`}>
                    {loading
                      ? (isRTL ? '💭 بابا يفكّر في الشرح...' : '💭 Dad is preparing...')
                      : isRTL
                        ? (isCorrectAnswer ? `💙 شرح بابا — لماذا هذه الإجابة صحيحة؟` : `💜 بابا يشرح لك يا ${childName}`)
                        : (isCorrectAnswer ? `💙 Dad explains — why is this correct?` : `💜 Dad explains for you, ${childName}`)}
                  </span>
                  {loading && <Loader2 className="w-4 h-4 animate-spin text-gray-400 flex-shrink-0" />}
                </div>

                <div
                  dir={isRTL ? 'rtl' : 'ltr'}
                  className={`text-sm leading-loose text-gray-800 min-h-[60px] ${isRTL ? 'arabic-text text-right' : 'text-left'}`}
                >
                  {loading ? (
                    <div className={`flex items-center gap-2 text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isRTL ? 'بابا يكتب لك...' : 'Dad is writing for you...'}</span>
                    </div>
                  ) : (
                    <p className="whitespace-pre-line">
                      {explanation || question.explanation || (isRTL ? 'اضغط زر التالي للمتابعة...' : 'Press Next to continue...')}
                    </p>
                  )}
                </div>

                {/* Accuracy hint */}
                {isWeakTopic && accuracyOnTopic !== null && accuracyOnTopic !== undefined && (
                  <div className="mt-3 text-xs text-amber-700 bg-amber-50 rounded-lg py-1.5 px-3" dir={isRTL ? 'rtl' : 'ltr'}>
                    {isRTL
                      ? `📊 دقتك في هذا الموضوع: ${accuracyOnTopic}% — ${isCorrectAnswer ? 'أنت تتحسن! 🌱' : 'التكرار يُرسّخ 💪'}`
                      : `📊 Accuracy on this topic: ${accuracyOnTopic}% — ${isCorrectAnswer ? "You're improving! 🌱" : 'Practice makes perfect! 💪'}`}
                  </div>
                )}
              </div>

              {/* ── Next / Finish button ─────────────────────────────── */}
              <div className="px-5 py-4 bg-white">
                <button
                  onClick={onNext}
                  className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all
                    shadow-md active:scale-95
                    ${isCorrectAnswer
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-green-200'
                      : 'bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-violet-200'}`}
                >
                  {isRTL ? (
                    <>
                      <ArrowLeft className="w-5 h-5" />
                      {isLast ? '🏆 عرض النتائج' : 'فهمت ✓ التالي'}
                    </>
                  ) : (
                    <>
                      {isLast ? '🏆 See Results' : 'Got it ✓ Next'}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
