import {
  getCurriculum,
  getLessonsBySubject,
  LEARNER_ORDER,
  LearnerId,
  LearnerProfile,
  LEARNERS,
  SchoolLesson,
  SubjectId,
  SUBJECTS,
} from '@/lib/familyCurriculum';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  Home,
  Lightbulb,
  ListChecks,
  LogOut,
  Play,
  RotateCcw,
  Sparkles,
  Speaker,
  Star,
  Target,
  Trophy,
  XCircle,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface LessonResult {
  correct: number;
  total: number;
  completedAt: string;
}

interface ProgressState {
  completed: Record<string, LessonResult>;
  lastStudied?: string;
}

const EMPTY_PROGRESS: ProgressState = { completed: {} };
const SUBJECT_ORDER: SubjectId[] = ['arabic', 'english', 'math', 'science', 'life', 'interest'];

function storageKey(learnerId: LearnerId): string {
  return `${learnerId}_family_school_v2`;
}

function loadProgress(learnerId: LearnerId): ProgressState {
  try {
    const raw = localStorage.getItem(storageKey(learnerId));
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      completed: parsed.completed ?? {},
      lastStudied: parsed.lastStudied,
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

function saveProgress(learnerId: LearnerId, progress: ProgressState): void {
  try {
    localStorage.setItem(storageKey(learnerId), JSON.stringify(progress));
  } catch {
    // The lesson remains usable even when browser storage is unavailable.
  }
}

function readAloud(text: string): void {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-AE';
  utterance.rate = 0.86;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function ChildAvatar({ learner, size = 'large' }: { learner: LearnerProfile; size?: 'small' | 'large' }) {
  const sizeClass = size === 'large' ? 'w-24 h-24 text-5xl' : 'w-11 h-11 text-2xl';
  return (
    <div className={`relative ${sizeClass} flex-shrink-0`}>
      <img
        src={learner.photo}
        alt={learner.nameAr}
        className={`w-full h-full rounded-full object-cover ring-4 ${learner.theme.ring} shadow-md`}
        onError={event => {
          const image = event.currentTarget;
          image.style.display = 'none';
          const fallback = image.nextElementSibling as HTMLElement | null;
          if (fallback) fallback.style.display = 'flex';
        }}
      />
      <div
        style={{ display: 'none' }}
        className={`w-full h-full rounded-full items-center justify-center bg-gradient-to-br ${learner.theme.gradient} ring-4 ${learner.theme.ring} shadow-md`}
      >
        {learner.emoji}
      </div>
    </div>
  );
}

function LearnerSelector({ onSelect }: { onSelect: (learnerId: LearnerId) => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4 py-10 flex items-center justify-center" dir="rtl">
      <div className="w-full max-w-3xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="text-5xl mb-3">🏠📚</div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 arabic-text">مدرستنا العائلية</h1>
          <p className="mt-3 text-gray-600 max-w-xl mx-auto leading-relaxed arabic-text">
            اختر اسمك. لكل طفل حساب مستقل وخطة تبدأ من الأساس باحترام، ثم ترتفع حسب فهمه الحقيقي.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:gap-5">
          {LEARNER_ORDER.map((learnerId, index) => {
            const learner = LEARNERS[learnerId];
            return (
              <motion.button
                key={learner.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(learner.id)}
                className={`rounded-3xl border-2 ${learner.theme.border} ${learner.theme.light} p-5 text-center shadow-sm hover:shadow-lg transition-all`}
              >
                <div className="flex justify-center mb-3"><ChildAvatar learner={learner} /></div>
                <h2 className={`text-2xl font-black ${learner.theme.text} arabic-text`}>{learner.nameAr}</h2>
                <p className="text-xs text-gray-500 mt-1 arabic-text">{learner.age} سنة</p>
                <div className="mt-3 inline-flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full text-xs text-gray-700 arabic-text">
                  <span>{learner.interestEmoji}</span>
                  <span>{learner.interestAr}</span>
                </div>
                <p className="text-xs text-gray-500 mt-3 arabic-text">بداية أكاديمية: تأسيس محترم</p>
              </motion.button>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-500 mt-7 arabic-text">
          لا توجد مقارنة بين الإخوة، ولا نجاح أو رسوب. كل نتيجة تخبرنا ماذا نعلّم بعد ذلك.
        </p>
      </div>
    </div>
  );
}

function ProgressPanel({
  learner,
  curriculum,
  progress,
  onBack,
}: {
  learner: LearnerProfile;
  curriculum: SchoolLesson[];
  progress: ProgressState;
  onBack: () => void;
}) {
  const completedCount = Object.keys(progress.completed).length;
  const totalAnswers = Object.values(progress.completed).reduce((sum, result) => sum + result.total, 0);
  const correctAnswers = Object.values(progress.completed).reduce((sum, result) => sum + result.correct, 0);

  return (
    <div className="max-w-4xl mx-auto" dir="rtl">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-5 arabic-text">
        <ArrowRight className="w-5 h-5" /> العودة
      </button>

      <div className={`rounded-3xl bg-gradient-to-r ${learner.theme.gradient} text-white p-6 md:p-8 shadow-lg mb-6`}>
        <div className="flex items-center gap-4">
          <ChildAvatar learner={learner} size="small" />
          <div>
            <h2 className="text-2xl font-black arabic-text">تقدم {learner.nameAr}</h2>
            <p className="text-white/80 text-sm mt-1 arabic-text">متابعة خاصة بهذا الحساب فقط</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-7">
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
          <div className={`text-3xl font-black ${learner.theme.text}`}>{completedCount}</div>
          <div className="text-xs text-gray-500 mt-1 arabic-text">دروس مكتملة</div>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
          <div className="text-3xl font-black text-teal-600">{curriculum.length}</div>
          <div className="text-xs text-gray-500 mt-1 arabic-text">إجمالي الدروس</div>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
          <div className="text-3xl font-black text-amber-600">{totalAnswers ? Math.round((correctAnswers / totalAnswers) * 100) : 0}%</div>
          <div className="text-xs text-gray-500 mt-1 arabic-text">فهم التدريب</div>
        </div>
      </div>

      <div className="space-y-4">
        {SUBJECT_ORDER.map(subjectId => {
          const subject = SUBJECTS[subjectId];
          const lessons = curriculum.filter(lesson => lesson.subject === subjectId);
          const done = lessons.filter(lesson => progress.completed[lesson.id]).length;
          const percentage = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
          return (
            <div key={subjectId} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{subject.emoji}</span>
                  <div>
                    <h3 className="font-bold text-gray-900 arabic-text">{subject.label}</h3>
                    <p className="text-xs text-gray-500 arabic-text">{done} من {lessons.length} دروس</p>
                  </div>
                </div>
                <span className={`font-black ${learner.theme.text}`}>{percentage}%</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${learner.theme.gradient} rounded-full transition-all`} style={{ width: `${percentage}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LessonPlayer({
  lesson,
  learner,
  completed,
  onBack,
  onComplete,
}: {
  lesson: SchoolLesson;
  learner: LearnerProfile;
  completed?: LessonResult;
  onBack: () => void;
  onComplete: (correct: number, total: number) => void;
}) {
  const [phase, setPhase] = useState<'teach' | 'practice' | 'done'>('teach');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const question = lesson.questions[questionIndex];
  const answered = selectedAnswer !== null;
  const isCorrect = answered && selectedAnswer === question.correctAnswer;

  const restartLesson = () => {
    setPhase('teach');
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setCorrectCount(0);
  };

  const selectAnswer = (index: number) => {
    if (answered) return;
    setSelectedAnswer(index);
    if (index === question.correctAnswer) setCorrectCount(count => count + 1);
  };

  const continuePractice = () => {
    if (!answered) return;
    if (questionIndex < lesson.questions.length - 1) {
      setQuestionIndex(index => index + 1);
      setSelectedAnswer(null);
      return;
    }

    const finalCorrect = correctCount;
    onComplete(finalCorrect, lesson.questions.length);
    setPhase('done');
  };

  const lessonText = [
    lesson.title,
    lesson.subtitle,
    ...lesson.objectives,
    ...lesson.explanation,
    lesson.example,
    lesson.activity,
    lesson.remember,
  ].join('. ');

  if (phase === 'teach') {
    return (
      <div className="max-w-3xl mx-auto" dir="rtl">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-5 arabic-text">
          <ArrowRight className="w-5 h-5" /> العودة إلى الدروس
        </button>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className={`h-2 bg-gradient-to-r ${learner.theme.gradient}`} />
          <div className="p-6 md:p-9">
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${learner.theme.gradient} text-white text-3xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                {lesson.emoji}
              </div>
              <div className="flex-1">
                <div className={`text-sm font-semibold ${learner.theme.text} arabic-text`}>{SUBJECTS[lesson.subject].label}</div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 arabic-text mt-1">{lesson.title}</h1>
                <p className="text-gray-500 mt-2 arabic-text leading-relaxed">{lesson.subtitle}</p>
                {completed && (
                  <span className="inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold arabic-text">
                    <CheckCircle2 className="w-3.5 h-3.5" /> تمت دراسته سابقاً
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => readAloud(lessonText)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-semibold mb-6 arabic-text"
            >
              <Speaker className="w-4 h-4" /> اقرأ الدرس لي
            </button>

            <section className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Target className={`w-5 h-5 ${learner.theme.text}`} />
                <h2 className="font-bold text-gray-900 arabic-text">ماذا سنتعلم؟</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {lesson.objectives.map(objective => (
                  <div key={objective} className="flex items-start gap-2 rounded-xl bg-gray-50 p-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 arabic-text">{objective}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl bg-blue-50 border border-blue-100 p-5 mb-5">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-blue-700" />
                <h2 className="font-bold text-blue-950 arabic-text">الشرح</h2>
              </div>
              <div className="space-y-3">
                {lesson.explanation.map(paragraph => (
                  <p key={paragraph} className="text-blue-950/80 leading-loose arabic-text">{paragraph}</p>
                ))}
              </div>
            </section>

            {lesson.visuals && (
              <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {lesson.visuals.map(visual => (
                  <div key={visual.label} className={`rounded-2xl ${learner.theme.light} border ${learner.theme.border} p-4 text-center`}>
                    <div className="text-4xl mb-2">{visual.emoji}</div>
                    <div className={`font-bold text-sm ${learner.theme.text} arabic-text`}>{visual.label}</div>
                  </div>
                ))}
              </section>
            )}

            <section className={`rounded-2xl ${learner.theme.light} border ${learner.theme.border} p-5 mb-5`}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className={`w-5 h-5 ${learner.theme.text}`} />
                <h2 className={`font-bold ${learner.theme.text} arabic-text`}>مثال مرتبط بك</h2>
              </div>
              <p className="text-gray-800 leading-loose arabic-text">{lesson.example}</p>
            </section>

            <section className="rounded-2xl bg-violet-50 border border-violet-100 p-5 mb-5">
              <div className="flex items-center gap-2 mb-2">
                <ListChecks className="w-5 h-5 text-violet-700" />
                <h2 className="font-bold text-violet-950 arabic-text">نشاط عملي</h2>
              </div>
              <p className="text-violet-950/80 leading-loose arabic-text">{lesson.activity}</p>
            </section>

            <section className="rounded-2xl bg-amber-50 border border-amber-200 p-5 mb-7">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="font-bold text-amber-950 arabic-text mb-1">تذكّر</h2>
                  <p className="text-amber-950/80 arabic-text leading-relaxed">{lesson.remember}</p>
                </div>
              </div>
            </section>

            <button
              onClick={() => setPhase('practice')}
              className={`w-full min-h-[52px] rounded-xl bg-gradient-to-r ${learner.theme.gradient} text-white font-bold flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform arabic-text`}
            >
              فهمت الدرس — ابدأ التدريب
              <Play className="w-5 h-5" />
            </button>
            <p className="text-center text-xs text-gray-500 mt-3 arabic-text">
              التدريب للتأكد من الفهم، وليس امتحان نجاح أو رسوب.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (phase === 'practice') {
    return (
      <div className="max-w-2xl mx-auto" dir="rtl">
        <button onClick={() => setPhase('teach')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-5 arabic-text">
          <ArrowRight className="w-5 h-5" /> مراجعة الشرح
        </button>

        <motion.div key={questionIndex} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="h-2 bg-gray-100">
            <div className={`h-full bg-gradient-to-r ${learner.theme.gradient} transition-all`} style={{ width: `${((questionIndex + 1) / lesson.questions.length) * 100}%` }} />
          </div>
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-5">
              <span className={`text-sm font-semibold ${learner.theme.text} arabic-text`}>سؤال {questionIndex + 1} من {lesson.questions.length}</span>
              <span className="text-2xl">{lesson.emoji}</span>
            </div>

            <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-relaxed arabic-text mb-6">{question.question}</h2>

            <div className="space-y-3">
              {question.options.map((option, index) => {
                const correctOption = index === question.correctAnswer;
                const selected = index === selectedAnswer;
                const correctStyle = answered && correctOption;
                const wrongStyle = answered && selected && !correctOption;
                return (
                  <button
                    key={option}
                    disabled={answered}
                    onClick={() => selectAnswer(index)}
                    className={`w-full min-h-[58px] rounded-xl p-4 border-2 text-right flex items-center gap-3 transition-all arabic-text ${
                      correctStyle
                        ? 'bg-green-50 border-green-500 text-green-950'
                        : wrongStyle
                          ? 'bg-red-50 border-red-400 text-red-950'
                          : answered
                            ? 'bg-gray-50 border-gray-200 text-gray-400'
                            : 'bg-gray-50 border-gray-200 text-gray-800 hover:border-teal-300 hover:bg-teal-50'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold ${
                      correctStyle ? 'bg-green-500 text-white' : wrongStyle ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {correctStyle ? <CheckCircle2 className="w-5 h-5" /> : wrongStyle ? <XCircle className="w-5 h-5" /> : ['أ', 'ب', 'ج', 'د'][index]}
                    </span>
                    <span className="flex-1">{option}</span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {answered && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                  <div className={`rounded-2xl p-5 border ${isCorrect ? 'bg-green-50 border-green-200 text-green-950' : 'bg-violet-50 border-violet-200 text-violet-950'}`}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{isCorrect ? '🌟' : '💡'}</span>
                      <div>
                        <h3 className="font-bold arabic-text mb-2">{isCorrect ? 'أحسنت — تعلّم لماذا' : 'لا بأس — الخطأ أصبح درساً'}</h3>
                        <p className="leading-loose arabic-text">{question.explanation}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={continuePractice}
                    className={`w-full mt-4 min-h-[52px] rounded-xl bg-gradient-to-r ${learner.theme.gradient} text-white font-bold flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform arabic-text`}
                  >
                    {questionIndex < lesson.questions.length - 1 ? 'فهمت الشرح — السؤال التالي' : 'فهمت — أكمل الدرس'}
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-2 arabic-text">لن تنتقل الشاشة قبل أن تضغط بنفسك.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    );
  }

  const percentage = lesson.questions.length ? Math.round((correctCount / lesson.questions.length) * 100) : 100;
  return (
    <div className="max-w-md mx-auto text-center" dir="rtl">
      <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="text-6xl mb-4">{percentage >= 80 ? '🏆' : percentage >= 50 ? '🌱' : '📚'}</div>
        <h2 className="text-2xl font-black text-gray-900 arabic-text">أكملت الدرس يا {learner.nameAr}</h2>
        <p className="text-gray-600 mt-3 leading-relaxed arabic-text">
          النتيجة تساعدنا على معرفة ما نراجعه. لا توجد مقارنة مع أحد، والمهم أنك قرأت الشرح وأكملت التدريب.
        </p>

        <div className={`w-28 h-28 mx-auto my-6 rounded-full bg-gradient-to-br ${learner.theme.gradient} text-white flex flex-col items-center justify-center shadow-lg`}>
          <span className="text-3xl font-black">{percentage}%</span>
          <span className="text-xs text-white/80 arabic-text">فهم التدريب</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="rounded-2xl bg-green-50 p-4">
            <div className="text-2xl font-black text-green-700">{correctCount}</div>
            <div className="text-xs text-green-800 arabic-text">فهمتها</div>
          </div>
          <div className="rounded-2xl bg-amber-50 p-4">
            <div className="text-2xl font-black text-amber-700">{lesson.questions.length - correctCount}</div>
            <div className="text-xs text-amber-800 arabic-text">سنراجعها</div>
          </div>
        </div>

        <div className="space-y-3">
          <button onClick={onBack} className={`w-full min-h-[50px] rounded-xl bg-gradient-to-r ${learner.theme.gradient} text-white font-bold flex items-center justify-center gap-2 arabic-text`}>
            <Home className="w-5 h-5" /> العودة للدروس
          </button>
          <button onClick={restartLesson} className="w-full min-h-[48px] rounded-xl bg-gray-100 text-gray-700 font-semibold flex items-center justify-center gap-2 arabic-text">
            <RotateCcw className="w-5 h-5" /> أعد الدرس
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function FamilySchool() {
  const [learnerId, setLearnerId] = useState<LearnerId | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState<ProgressState>(EMPTY_PROGRESS);

  const learner = learnerId ? LEARNERS[learnerId] : null;
  const curriculum = useMemo(() => learner ? getCurriculum(learner) : [], [learner]);
  const activeLesson = curriculum.find(lesson => lesson.id === activeLessonId);

  useEffect(() => {
    if (!learnerId) {
      setProgress(EMPTY_PROGRESS);
      return;
    }
    setProgress(loadProgress(learnerId));
  }, [learnerId]);

  if (!learner) {
    return <LearnerSelector onSelect={id => {
      setLearnerId(id);
      setSelectedSubject(null);
      setActiveLessonId(null);
      setShowProgress(false);
    }} />;
  }

  const completeLesson = (lessonId: string, correct: number, total: number) => {
    const next: ProgressState = {
      completed: {
        ...progress.completed,
        [lessonId]: { correct, total, completedAt: new Date().toISOString() },
      },
      lastStudied: new Date().toISOString(),
    };
    setProgress(next);
    saveProgress(learner.id, next);
  };

  if (activeLesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 px-4 py-7">
        <LessonPlayer
          key={`${learner.id}-${activeLesson.id}`}
          lesson={activeLesson}
          learner={learner}
          completed={progress.completed[activeLesson.id]}
          onBack={() => setActiveLessonId(null)}
          onComplete={(correct, total) => completeLesson(activeLesson.id, correct, total)}
        />
      </div>
    );
  }

  if (showProgress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 px-4 py-7">
        <ProgressPanel learner={learner} curriculum={curriculum} progress={progress} onBack={() => setShowProgress(false)} />
      </div>
    );
  }

  const completedCount = Object.keys(progress.completed).length;
  const subjectLessons = selectedSubject ? getLessonsBySubject(learner, selectedSubject) : [];
  const dailyPlan = SUBJECT_ORDER
    .map(subjectId => curriculum.find(lesson => lesson.subject === subjectId && !progress.completed[lesson.id]))
    .filter((lesson): lesson is SchoolLesson => Boolean(lesson))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50" dir="rtl">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChildAvatar learner={learner} size="small" />
            <div>
              <h1 className={`font-black ${learner.theme.text} arabic-text`}>مدرسة {learner.nameAr}</h1>
              <p className="text-xs text-gray-500 arabic-text">المرحلة التأسيسية • {learner.sessionMinutes} دقيقة للجلسة</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowProgress(true)} className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-600" title="التقدم">
              <BarChart3 className="w-5 h-5" />
            </button>
            {(selectedSubject || showProgress) && (
              <button onClick={() => { setSelectedSubject(null); setShowProgress(false); }} className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-600" title="الرئيسية">
                <Home className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => {
                setLearnerId(null);
                setSelectedSubject(null);
                setActiveLessonId(null);
                setShowProgress(false);
              }}
              className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500"
              title="تغيير الطفل"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-7 md:py-10">
        {selectedSubject ? (
          <div>
            <button onClick={() => setSelectedSubject(null)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-5 arabic-text">
              <ArrowRight className="w-5 h-5" /> كل المواد
            </button>
            <div className={`rounded-3xl ${learner.theme.light} border ${learner.theme.border} p-6 mb-6`}>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{SUBJECTS[selectedSubject].emoji}</span>
                <div>
                  <h2 className={`text-2xl font-black ${learner.theme.text} arabic-text`}>{SUBJECTS[selectedSubject].label}</h2>
                  <p className="text-gray-600 mt-1 arabic-text">{SUBJECTS[selectedSubject].description}</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {subjectLessons.map((lesson, index) => {
                const result = progress.completed[lesson.id];
                return (
                  <motion.button
                    key={lesson.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    onClick={() => setActiveLessonId(lesson.id)}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-teal-200 p-5 text-right transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${learner.theme.gradient} text-white text-2xl flex items-center justify-center flex-shrink-0`}>
                        {lesson.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-black text-gray-900 arabic-text">{lesson.title}</h3>
                          {result && <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />}
                        </div>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed arabic-text">{lesson.subtitle}</p>
                        <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                          <span className="inline-flex items-center gap-1 arabic-text"><Clock3 className="w-3.5 h-3.5" /> {learner.sessionMinutes} دقيقة</span>
                          <span className="inline-flex items-center gap-1 arabic-text"><ListChecks className="w-3.5 h-3.5" /> {lesson.questions.length} تدريب</span>
                        </div>
                      </div>
                      <ChevronLeft className="w-5 h-5 text-gray-300 flex-shrink-0 mt-4" />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            <section className={`rounded-3xl bg-gradient-to-r ${learner.theme.gradient} text-white p-6 md:p-8 shadow-xl mb-7 overflow-hidden relative`}>
              <div className="absolute -left-8 -bottom-12 text-[140px] opacity-10">{learner.interestEmoji}</div>
              <div className="relative flex flex-col md:flex-row items-center gap-5">
                <ChildAvatar learner={learner} />
                <div className="text-center md:text-right flex-1">
                  <p className="text-white/80 text-sm arabic-text">أهلاً بعودتك</p>
                  <h2 className="text-3xl md:text-4xl font-black arabic-text mt-1">يا {learner.nameAr}</h2>
                  <p className="text-white/90 mt-3 leading-relaxed arabic-text max-w-2xl">
                    سنتعلم الفكرة أولاً، نطبق نشاطاً، ثم نجيب عن تدريب قصير. تبدأ من الأساس من دون إحراج أو استعجال.
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                    <span className="bg-white/15 px-3 py-1.5 rounded-full text-xs arabic-text">🌱 تأسيس حقيقي</span>
                    <span className="bg-white/15 px-3 py-1.5 rounded-full text-xs arabic-text">⏱️ {learner.sessionMinutes} دقيقة</span>
                    <span className="bg-white/15 px-3 py-1.5 rounded-full text-xs arabic-text">{learner.interestEmoji} {learner.interestAr}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 arabic-text">خطة اليوم</h2>
                  <p className="text-sm text-gray-500 mt-1 arabic-text">ابدأ بدرس واحد أو اثنين، وليس ضرورياً إنهاء الجميع.</p>
                </div>
                <button onClick={() => setShowProgress(true)} className={`hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl ${learner.theme.light} ${learner.theme.text} font-semibold text-sm arabic-text`}>
                  <BarChart3 className="w-4 h-4" /> {completedCount}/{curriculum.length}
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {dailyPlan.length > 0 ? dailyPlan.map((lesson, index) => (
                  <motion.button
                    key={lesson.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    onClick={() => setActiveLessonId(lesson.id)}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all p-5 text-right"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className={`w-12 h-12 rounded-xl bg-gradient-to-br ${learner.theme.gradient} text-white text-2xl flex items-center justify-center`}>{lesson.emoji}</span>
                      <span className="text-xs text-gray-400 arabic-text">{SUBJECTS[lesson.subject].label}</span>
                    </div>
                    <h3 className="font-black text-gray-900 arabic-text">{lesson.title}</h3>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed arabic-text line-clamp-2">{lesson.subtitle}</p>
                    <div className={`mt-4 inline-flex items-center gap-1 text-xs font-semibold ${learner.theme.text} arabic-text`}>
                      افتح الدرس <ArrowLeft className="w-3.5 h-3.5" />
                    </div>
                  </motion.button>
                )) : (
                  <div className="sm:col-span-2 lg:col-span-4 rounded-2xl bg-green-50 border border-green-200 p-6 text-center">
                    <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-bold text-green-900 arabic-text">أكملت جميع الدروس الحالية</h3>
                    <p className="text-sm text-green-700 mt-1 arabic-text">يمكنك إعادة أي درس للمراجعة حتى نضيف المستوى التالي.</p>
                  </div>
                )}
              </div>
            </section>

            <section>
              <div className="mb-4">
                <h2 className="text-2xl font-black text-gray-900 arabic-text">المواد والمسارات</h2>
                <p className="text-sm text-gray-500 mt-1 arabic-text">اختر المادة، اقرأ الدرس، نفّذ النشاط، ثم تدرب.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {SUBJECT_ORDER.map((subjectId, index) => {
                  const subject = SUBJECTS[subjectId];
                  const lessons = curriculum.filter(lesson => lesson.subject === subjectId);
                  const done = lessons.filter(lesson => progress.completed[lesson.id]).length;
                  return (
                    <motion.button
                      key={subjectId}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedSubject(subjectId)}
                      className={`rounded-2xl border-2 ${subjectId === 'interest' ? learner.theme.border : 'border-gray-100'} ${subjectId === 'interest' ? learner.theme.light : 'bg-white'} p-5 text-right shadow-sm hover:shadow-md hover:-translate-y-1 transition-all`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl">{subjectId === 'interest' ? learner.interestEmoji : subject.emoji}</span>
                        <span className="text-xs text-gray-500 arabic-text">{done}/{lessons.length}</span>
                      </div>
                      <h3 className={`font-black arabic-text ${subjectId === 'interest' ? learner.theme.text : 'text-gray-900'}`}>
                        {subjectId === 'interest' ? `مسار ${learner.interestAr}` : subject.label}
                      </h3>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed arabic-text">{subject.description}</p>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-4">
                        <div className={`h-full bg-gradient-to-r ${learner.theme.gradient}`} style={{ width: `${lessons.length ? (done / lessons.length) * 100 : 0}%` }} />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </section>

            <section className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 p-5">
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-amber-950 arabic-text">ملاحظة للأب</h3>
                  <p className="text-sm text-amber-900/80 mt-1 leading-relaxed arabic-text">
                    العمر يحدد احترام الأسلوب وطول الجلسة وموضوع الأمثلة، لكنه لا يحدد المستوى الأكاديمي. يرفع التطبيق الصعوبة لاحقاً بعد ثبوت إتقان الأساسيات.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="border-t border-gray-200 bg-gray-50 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500 arabic-text">
          مدرسة ليندا وآدم وجودي ونوح — نفهم، نطبق، نتدرب، ثم نراجع.
        </div>
      </footer>
    </div>
  );
}
