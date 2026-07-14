/**
 * LessonScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * Full-screen lesson viewer, automatically adapts to each child:
 *  • Noah  (7)  – picture cards + big emoji + playful UI
 *  • Judy  (9)  – interactive quiz after body text
 *  • Adam  (11) – rich lesson body + challenge questions
 *  • Linda (13) – deep science text + analytical questions
 * ─────────────────────────────────────────────────────────────────
 */

import InteractiveTools from '@/components/InteractiveTools';
import { useSpeech } from '@/hooks/useSpeech';
import { getLessonsForChild, Lesson, LessonQuestion, TapRound } from '@/lib/childLessons';
import { ChildProfile } from '@/lib/children';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, BookOpen, CheckCircle2,
  ChevronRight, Lightbulb, RotateCcw, Star, Volume2, XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
  child: ChildProfile;
  onBack: () => void;
}

export default function LessonScreen({ child, onBack }: Props) {
  const lessons = getLessonsForChild(child.id);
  const [lessonIdx, setLessonIdx] = useState<number | null>(null);
  const [showTool, setShowTool] = useState(false);
  const isRTL = true; // App is primarily Arabic

  const isNoah = child.id === 'noah';

  if (showTool) return <InteractiveTools child={child} onBack={() => setShowTool(false)} />;

  // ── Lesson list ───────────────────────────────────────────────
  if (lessonIdx === null) {
    // Noah gets big emoji buttons, no text counts
    if (isNoah) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg mx-auto"
          dir="rtl"
        >
          <div className="flex items-center gap-3 mb-4">
            <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <ArrowRight className="w-5 h-5 text-gray-500" />
            </button>
            <h2 className="text-2xl font-black text-gray-900">{child.emoji} العاب نوح</h2>
          </div>
          {/* Interactive tool button */}
          <button
            onClick={() => setShowTool(true)}
            className={`w-full mb-4 py-3 rounded-2xl font-bold text-white bg-gradient-to-r ${child.color} shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2`}
          >
            <span className="text-xl">✍️</span>
            <span className="arabic-text">تتبع الحروف</span>
          </button>
          <div className="grid grid-cols-2 gap-4">
            {lessons.map((lesson, idx) => (
              <motion.button
                key={lesson.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setLessonIdx(idx)}
                className={`aspect-square rounded-3xl flex flex-col items-center justify-center gap-3
                  bg-gradient-to-br ${child.color} text-white shadow-lg
                  active:scale-95 transition-all hover:shadow-xl`}
              >
                <span className="text-6xl">{lesson.emoji.slice(0, 4)}</span>
                <span className="text-lg font-black arabic-text px-2 text-center leading-tight">
                  {lesson.subject}
                </span>
                <span className="text-xs text-white/80">{lesson.tapRounds?.length ?? 0} 🎮</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto space-y-4"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ArrowRight className="w-5 h-5 text-gray-500" />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 arabic-text">
              {child.emoji} دروس {child.nameAr}
            </h2>
            <p className="text-sm text-gray-500 arabic-text">
              اختر درساً لتبدأ التعلم
            </p>
          </div>
          <button
            onClick={() => setShowTool(true)}
            className={`px-4 py-2 rounded-xl font-bold text-white bg-gradient-to-r ${child.color} shadow-md active:scale-95 transition-all text-sm flex items-center gap-1.5`}
          >
            <span>{child.id === 'judy' ? '🎨' : child.id === 'adam' ? '🔀' : '🧠'}</span>
            <span className="arabic-text">{child.id === 'judy' ? 'ارسم' : child.id === 'adam' ? 'رتّب' : 'خريطة'}</span>
          </button>
        </div>

        {/* Lesson cards */}
        <div className="space-y-3">
          {lessons.map((lesson, idx) => (
            <motion.button
              key={lesson.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.07 }}
              onClick={() => setLessonIdx(idx)}
              className="w-full text-right bg-white rounded-2xl shadow-sm border-2 border-gray-100
                hover:border-teal-300 hover:shadow-md transition-all p-4 flex items-center gap-4 group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0
                bg-gradient-to-br ${child.color}`}>
                {lesson.emoji}
              </div>
              <div className="flex-1 text-right">
                <p className="font-bold text-gray-900 text-base arabic-text">{lesson.title}</p>
                <div className="flex items-center gap-2 mt-1 justify-end">
                  <span className="text-xs text-gray-500 arabic-text">{lesson.subject}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${child.colorLight} ${child.colorText} border ${child.colorBorder}`}>
                    {lesson.questions?.length ?? 0} أسئلة
                  </span>
                  {lesson.mode === 'picture_card' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 font-medium">
                      بطاقات تعليمية
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-teal-500 transition-colors flex-shrink-0 rotate-180" />
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  }

  // ── Lesson detail ─────────────────────────────────────────────
  const lesson = lessons[lessonIdx];
  return (
    <LessonDetail
      lesson={lesson}
      child={child}
      onBack={() => setLessonIdx(null)}
      onNext={lessonIdx < lessons.length - 1 ? () => setLessonIdx(lessonIdx + 1) : undefined}
    />
  );
}

// ─────────────────────────────────────────────────────────────────
// LessonDetail — renders based on lesson.mode
// ─────────────────────────────────────────────────────────────────
function LessonDetail({
  lesson, child, onBack, onNext,
}: {
  lesson: Lesson;
  child: ChildProfile;
  onBack: () => void;
  onNext?: () => void;
}) {
  const [phase, setPhase] = useState<'intro' | 'cards' | 'quiz' | 'done'>(
    lesson.mode === 'tap_picture' ? 'quiz' : 'intro'
  );
  const [cardIdx, setCardIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const questions = lesson.questions ?? [];
  const cards = lesson.pictureCards ?? [];
  const letters = lesson.letters ?? [];

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === questions[qIdx].correctAnswer) setScore(s => s + 1);
  };

  const handleNextQ = () => {
    if (qIdx < questions.length - 1) {
      setQIdx(q => q + 1);
      setSelected(null);
    } else {
      setPhase('done');
    }
  };

  // ── Intro phase ───────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto"
        dir="rtl"
      >
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Lesson header */}
          <div className={`bg-gradient-to-br ${child.color} p-6 text-white`}>
            <button onClick={onBack} className="mb-4 flex items-center gap-2 text-white/80 hover:text-white text-sm">
              <ArrowRight className="w-4 h-4" />
              <span className="arabic-text">العودة للدروس</span>
            </button>
            <div className="text-5xl mb-3">{lesson.emoji}</div>
            <h2 className="text-2xl font-bold arabic-text">{lesson.title}</h2>
            <p className="text-white/80 text-sm mt-1 arabic-text">{lesson.subject}</p>
          </div>

          {/* Lesson body */}
          {lesson.lessonBody && (
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <span className="font-bold text-gray-700 arabic-text">درس اليوم</span>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                <p className="text-gray-800 leading-loose text-base arabic-text whitespace-pre-line">
                  {lesson.lessonBody}
                </p>
              </div>
            </div>
          )}

          {/* Picture cards preview for Noah */}
          {lesson.mode === 'picture_card' && cards.length > 0 && (
            <div className="px-6 pb-4">
              <p className="text-sm text-gray-500 mb-3 arabic-text">👁️ ستتعلم هذه الصور:</p>
              <div className="flex gap-2 flex-wrap">
                {cards.map((c, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-2 text-center border border-gray-100 min-w-[64px]">
                    <div className="text-2xl">{c.emoji.split('').slice(0, 2).join('')}</div>
                    <p className="text-xs text-gray-600 mt-1 arabic-text">{c.wordAr.split(' ')[0]}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Letter cards preview for Noah */}
          {lesson.mode === 'letter_trace' && letters.length > 0 && (
            <div className="px-6 pb-4">
              <p className="text-sm text-gray-500 mb-3 arabic-text">📝 حروف اليوم:</p>
              <div className="flex gap-2 flex-wrap">
                {letters.map((l, i) => (
                  <div key={i} className={`w-10 h-10 rounded-xl flex items-center justify-center
                    text-xl font-bold bg-gradient-to-br ${child.color} text-white shadow-sm`}>
                    {l}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Start buttons */}
          <div className="p-6 pt-2 space-y-3">
            {(lesson.mode === 'picture_card' || lesson.mode === 'letter_trace' || lesson.mode === 'word_match') && cards.length > 0 && (
              <button
                onClick={() => setPhase('cards')}
                className={`w-full py-4 rounded-xl font-bold text-white text-base
                  bg-gradient-to-r ${child.color} shadow-md active:scale-95 transition-all
                  flex items-center justify-center gap-2`}
              >
                <BookOpen className="w-5 h-5" />
                <span className="arabic-text">
                  {lesson.mode === 'picture_card' ? '🖼️ ابدأ بطاقات الصور' :
                    lesson.mode === 'letter_trace' ? '📝 تعلّم الحروف' :
                      '🔤 تعلّم الكلمات'}
                </span>
              </button>
            )}
            {questions.length > 0 && (
              <button
                onClick={() => setPhase('quiz')}
                className="w-full py-4 rounded-xl font-bold text-base
                  bg-gradient-to-r from-violet-500 to-purple-600 text-white
                  shadow-md active:scale-95 transition-all
                  flex items-center justify-center gap-2"
              >
                <Star className="w-5 h-5" />
                <span className="arabic-text">
                  {(lesson.mode === 'picture_card' || lesson.mode === 'letter_trace')
                    ? '✅ انتقل مباشرة للأسئلة'
                    : `🎯 ابدأ الأسئلة (${questions.length} سؤال)`}
                </span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // ── Picture / Letter cards phase ──────────────────────────────
  if (phase === 'cards') {
    const allItems = lesson.mode === 'letter_trace'
      ? letters.map(l => ({ emoji: l, wordAr: `حرف ${l}`, wordEn: `Letter ${l}`, soundHint: l }))
      : cards;

    const item = allItems[cardIdx];
    const progress = ((cardIdx + 1) / allItems.length) * 100;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm mx-auto"
        dir="rtl"
      >
        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1 arabic-text">
            <span>{cardIdx + 1} / {allItems.length}</span>
            <span>{lesson.title}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${child.color} rounded-full`}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={cardIdx}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-xl p-8 text-center border-4 border-gray-100"
          >
            {/* Big emoji / letter */}
            <div className={`text-8xl mb-4 ${lesson.mode === 'letter_trace'
              ? `bg-gradient-to-br ${child.color} bg-clip-text text-transparent font-black`
              : ''}`}>
              {item.emoji}
            </div>
            {item.soundHint && lesson.mode !== 'letter_trace' && (
              <div className="text-4xl font-black text-gray-700 mb-2">{item.soundHint}</div>
            )}
            <h3 className="text-2xl font-black text-gray-900 arabic-text mt-2">{item.wordAr}</h3>
            {item.wordEn && (
              <p className="text-sm text-gray-400 mt-1">{item.wordEn}</p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3 mt-5">
          {cardIdx > 0 && (
            <button
              onClick={() => setCardIdx(i => i - 1)}
              className="flex-1 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100
                hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-5 h-5" />
              <span className="arabic-text">السابق</span>
            </button>
          )}
          {cardIdx < allItems.length - 1 ? (
            <button
              onClick={() => setCardIdx(i => i + 1)}
              className={`flex-1 py-3 rounded-xl font-semibold text-white
                bg-gradient-to-r ${child.color} shadow-md active:scale-95 transition-all
                flex items-center justify-center gap-2`}
            >
              <span className="arabic-text">التالي</span>
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => {
                if (questions.length > 0) setPhase('quiz');
                else setPhase('done');
              }}
              className="flex-1 py-3 rounded-xl font-bold text-white
                bg-gradient-to-r from-violet-500 to-purple-600 shadow-md active:scale-95 transition-all
                flex items-center justify-center gap-2"
            >
              <span className="arabic-text">{questions.length > 0 ? '🎯 الأسئلة' : '🏆 تم!'}</span>
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  // ── Tap Picture phase (Noah) ──────────────────────────────────
  if (phase === 'quiz' && lesson.mode === 'tap_picture') {
    const rounds: TapRound[] = lesson.tapRounds ?? [];
    return (
      <TapPictureGame
        rounds={rounds}
        child={child}
        lesson={lesson}
        onDone={(sc: number) => { setScore(sc); setPhase('done'); }}
        onBack={onBack}
      />
    );
  }

  // ── Quiz phase ────────────────────────────────────────────────
  if (phase === 'quiz') {
    const q: LessonQuestion = questions[qIdx];
    const answered = selected !== null;
    const isCorrect = selected === q.correctAnswer;

    return (
      <QuizPhase
        q={q}
        qIdx={qIdx}
        questions={questions}
        answered={answered}
        isCorrect={isCorrect}
        selected={selected}
        child={child}
        lesson={lesson}
        handleAnswer={handleAnswer}
        handleNextQ={handleNextQ}
      />
    );
  }

  // ── Done phase ────────────────────────────────────────────────
  const pct = questions.length ? Math.round((score / questions.length) * 100) : 100;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-sm mx-auto text-center"
      dir="rtl"
    >
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <div className="text-7xl mb-4">
          {pct === 100 ? '🏆' : pct >= 60 ? '🌟' : '💪'}
        </div>
        <h3 className="text-2xl font-black text-gray-900 arabic-text mb-2">
          {pct === 100 ? `أحسنت يا ${child.nameAr}!` :
            pct >= 60 ? `عمل رائع يا ${child.nameAr}!` :
              `لا بأس يا ${child.nameAr}، حاول مرة أخرى!`}
        </h3>
        <p className="text-gray-500 arabic-text mb-6">
          {score} / {questions.length} إجابة صحيحة
        </p>
        <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center
            bg-gradient-to-br ${child.color} text-white text-3xl font-black shadow-lg mb-6`}>
          {pct}%
        </div>
        <div className="space-y-3">
          <button
            onClick={() => { setPhase('intro'); setQIdx(0); setSelected(null); setScore(0); setCardIdx(0); }}
            className="w-full py-3 rounded-xl font-bold text-gray-700 bg-gray-100
                hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="arabic-text">أعد الدرس</span>
          </button>
          {onNext && (
            <button
              onClick={() => { onNext(); setPhase('intro'); setQIdx(0); setSelected(null); setScore(0); setCardIdx(0); }}
              className={`w-full py-3 rounded-xl font-bold text-white
                  bg-gradient-to-r ${child.color} shadow-md active:scale-95 transition-all
                  flex items-center justify-center gap-2`}
            >
              <span className="arabic-text">الدرس التالي →</span>
            </button>
          )}
          <button
            onClick={onBack}
            className="w-full py-3 rounded-xl font-semibold text-gray-500
                hover:text-gray-700 transition-colors arabic-text"
          >
            العودة لقائمة الدروس
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// QuizPhase — extracted so we can use hooks (useEffect for speech)
// ─────────────────────────────────────────────────────────────────
function QuizPhase({
  q, qIdx, questions, answered, isCorrect, selected,
  child, lesson, handleAnswer, handleNextQ,
}: {
  q: LessonQuestion;
  qIdx: number;
  questions: LessonQuestion[];
  answered: boolean;
  isCorrect: boolean;
  selected: number | null;
  child: ChildProfile;
  lesson: Lesson;
  handleAnswer: (i: number) => void;
  handleNextQ: () => void;
}) {
  const { speak, isSupported } = useSpeech();

  // Auto-read question when it changes
  useEffect(() => {
    speak(q.question, { lang: 'ar', rate: 0.82 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.question]);

  const readQuestion = () => speak(q.question, { lang: 'ar', rate: 0.82 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
      dir="rtl"
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100">
          <motion.div
            className={`h-full bg-gradient-to-r ${child.color}`}
            animate={{ width: `${((qIdx + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <div className="p-6">
          {/* Counter */}
          <div className="flex justify-between items-center mb-4">
            <span className={`text-sm font-semibold ${child.colorText} arabic-text`}>
              سؤال {qIdx + 1} من {questions.length}
            </span>
            <span className="text-lg">{q.emoji || lesson.emoji}</span>
          </div>

          {/* Question + speak button */}
          <div className="flex items-start gap-3 mb-5">
            <h3 className="flex-1 text-xl font-bold text-gray-900 arabic-text leading-relaxed">
              {q.question}
            </h3>
            {isSupported && (
              <button
                onClick={readQuestion}
                title="اقرأ السؤال"
                className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center
                    bg-gradient-to-br ${child.color} text-white shadow-md
                    active:scale-90 transition-all hover:opacity-90`}
              >
                <Volume2 className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {q.options.map((opt, i) => {
              const isCorrectOpt = i === q.correctAnswer;
              const isSelected = selected === i;
              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => handleAnswer(i)}
                  disabled={answered}
                  className={`w-full p-4 rounded-xl text-right font-medium text-base
                      flex items-center gap-3 transition-all
                      ${answered && isCorrectOpt
                      ? 'bg-green-50 border-2 border-green-500 text-green-900'
                      : answered && isSelected && !isCorrectOpt
                        ? 'bg-red-50 border-2 border-red-500 text-red-900'
                        : answered
                          ? 'bg-gray-50 border-2 border-gray-200 text-gray-400 cursor-default'
                          : 'bg-gray-50 border-2 border-gray-200 text-gray-700 hover:border-teal-300 hover:bg-teal-50 cursor-pointer'}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                      ${answered && isCorrectOpt ? 'bg-green-500 text-white' :
                      answered && isSelected ? 'bg-red-500 text-white' :
                        'bg-gray-200 text-gray-600'}`}>
                    {answered && isCorrectOpt ? <CheckCircle2 className="w-4 h-4" /> :
                      answered && isSelected ? <XCircle className="w-4 h-4" /> :
                        ['أ', 'ب', 'ج', 'د'][i]}
                  </div>
                  <span className="arabic-text flex-1">{opt}</span>
                  {answered && isCorrectOpt && (
                    <span className="text-xs text-green-600 font-bold arabic-text">✓ صحيح</span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-5 space-y-3"
              >
                <div className={`p-4 rounded-xl arabic-text leading-relaxed text-sm
                    ${isCorrect ? 'bg-green-50 border border-green-200 text-green-900'
                    : 'bg-violet-50 border border-violet-200 text-violet-900'}`}>
                  <div className="flex items-start gap-2">
                    <span className="text-xl flex-shrink-0 mt-0.5">{isCorrect ? '🎉' : '💡'}</span>
                    <p>{q.explanation}</p>
                  </div>
                </div>

                <button
                  onClick={handleNextQ}
                  className={`w-full py-4 rounded-xl font-bold text-white text-base
                      flex items-center justify-center gap-2
                      ${isCorrect
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-200'
                      : 'bg-gradient-to-r from-violet-500 to-purple-600 shadow-violet-200'}
                      shadow-md active:scale-95 transition-all`}
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="arabic-text">
                    {qIdx < questions.length - 1 ? 'فهمت ✓ التالي' : '🏆 عرض النتيجة'}
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// TapPictureGame — Noah's visual-only game (no reading required)
// Shows a big emoji prompt → child taps the matching picture
// ─────────────────────────────────────────────────────────────────
function TapPictureGame({
  rounds, child, lesson, onDone, onBack,
}: {
  rounds: TapRound[];
  child: ChildProfile;
  lesson: Lesson;
  onDone: (score: number) => void;
  onBack: () => void;
}) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [tapped, setTapped] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const { speak, isSupported } = useSpeech();

  const round = rounds[roundIdx];

  // Auto-read the prompt label on every new round
  useEffect(() => {
    speak(`أين هو ${round.promptLabel}؟`, { lang: 'ar', rate: 0.78 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIdx, round.promptLabel]);
  const isCorrectTap = tapped !== null && round.choices[tapped]?.correct;

  const handleTap = (i: number) => {
    if (tapped !== null) return;
    setTapped(i);
    const correct = round.choices[i].correct;
    if (correct) {
      setScore(s => {
        const next = s + 1;
        setTimeout(() => {
          setShowCelebration(false);
          if (roundIdx < rounds.length - 1) {
            setRoundIdx(r => r + 1);
            setTapped(null);
          } else {
            onDone(next);
          }
        }, 1200);
        return next;
      });
      setShowCelebration(true);
    }
  };

  const handleWrongNext = () => {
    if (roundIdx < rounds.length - 1) {
      setRoundIdx(r => r + 1);
      setTapped(null);
    } else {
      onDone(score);
    }
  };

  const progress = ((roundIdx + 1) / rounds.length) * 100;

  return (
    <motion.div
      key={roundIdx}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-sm mx-auto"
      dir="rtl"
    >
      {/* Back + progress */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowRight className="w-5 h-5 text-gray-500" />
        </button>
        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${child.color} rounded-full`}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <span className="text-sm font-bold text-gray-500">{roundIdx + 1}/{rounds.length}</span>
      </div>

      {/* Prompt card */}
      <div className={`bg-gradient-to-br ${child.color} rounded-3xl p-6 text-center mb-5 shadow-xl`}>
        <p className="text-white/80 text-base font-semibold arabic-text mb-2">أيّ واحد هو؟</p>
        <div className="text-9xl leading-none mb-3">{round.promptEmoji}</div>
        <div className="flex items-center justify-center gap-3">
          <div className="bg-white/25 rounded-2xl py-2 px-6">
            <span className="text-white text-2xl font-black arabic-text">{round.promptLabel}</span>
          </div>
          {isSupported && (
            <button
              onClick={() => speak(`أين هو ${round.promptLabel}؟`, { lang: 'ar', rate: 0.78 })}
              className="w-12 h-12 rounded-2xl bg-white/30 hover:bg-white/50 flex items-center justify-center active:scale-90 transition-all"
            >
              <Volume2 className="w-6 h-6 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="text-center">
              <div className="text-8xl mb-4">{round.celebrationEmoji}</div>
              <div className="text-4xl font-black text-green-600 arabic-text">أحسنت! 🎉</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Choices grid */}
      <div className="grid grid-cols-2 gap-4">
        {round.choices.map((choice: { emoji: string; label: string; correct: boolean }, i: number) => {
          const isSelected = tapped === i;
          const isRight = choice.correct;
          const revealedCorrect = tapped !== null && isRight;
          const revealedWrong = isSelected && !isRight;
          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTap(i)}
              disabled={tapped !== null}
              className={`rounded-3xl p-4 flex flex-col items-center justify-center gap-2 min-h-[120px]
                border-4 transition-all shadow-md
                ${revealedCorrect
                  ? 'bg-green-50 border-green-500 shadow-green-200'
                  : revealedWrong
                    ? 'bg-red-50 border-red-400 shadow-red-100'
                    : tapped !== null
                      ? 'bg-gray-50 border-gray-200 opacity-50'
                      : 'bg-white border-gray-200 hover:border-teal-300 hover:bg-teal-50 cursor-pointer'}`}
            >
              <span className="text-6xl">{choice.emoji}</span>
              <span className={`text-base font-black arabic-text
                ${revealedCorrect ? 'text-green-700' : revealedWrong ? 'text-red-600' : 'text-gray-700'}`}>
                {choice.label}
              </span>
              {revealedCorrect && <CheckCircle2 className="w-6 h-6 text-green-500" />}
              {revealedWrong && <XCircle className="w-6 h-6 text-red-400" />}
            </motion.button>
          );
        })}
      </div>

      {/* Wrong answer — try next button */}
      <AnimatePresence>
        {tapped !== null && !isCorrectTap && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5"
          >
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-center mb-3">
              <span className="text-2xl">😊</span>
              <p className="text-orange-800 font-bold arabic-text mt-1">حاول مرة ثانية في المرة القادمة!</p>
            </div>
            <button
              onClick={handleWrongNext}
              className={`w-full py-4 rounded-2xl font-bold text-white text-lg
                bg-gradient-to-r ${child.color} shadow-md active:scale-95 transition-all arabic-text`}
            >
              التالي →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
