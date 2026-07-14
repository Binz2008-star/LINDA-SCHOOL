import { useLang } from '@/contexts/LangContext';
import { useSpeech } from '@/hooks/useSpeech';
import {
  LearnerProfile,
  SchoolLesson,
  SUBJECTS,
} from '@/lib/familyCurriculum';
import { s } from '@/lib/ui-strings';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Home,
  Lightbulb,
  RotateCcw,
  Target,
  Volume2,
  XCircle,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────
interface LessonResult {
  correct: number;
  total: number;
  completedAt: string;
}

// ── Helpers ────────────────────────────────────────────────────────
function shuffleArr<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

async function getTutorExplanation(
  learner: LearnerProfile,
  lesson: SchoolLesson,
  selectedIndex: number,
  questionIndex: number,
  signal: AbortSignal,
): Promise<string> {
  const question = lesson.questions[questionIndex];
  try {
    const res = await fetch('/api/tutor', {
      method: 'POST',
      signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        learner: { nameAr: learner.nameAr, age: learner.age, gender: learner.gender, interestAr: learner.interestAr },
        lesson: { title: lesson.title, subject: SUBJECTS[lesson.subject].label },
        question,
        selectedIndex,
      }),
    });
    if (!res.ok) throw new Error('unavailable');
    const data = await res.json() as { explanation?: string };
    return data.explanation?.trim() || question.explanation;
  } catch {
    return question.explanation;
  }
}

// ── Activity sub-components ────────────────────────────────────────

function TapCardsActivity({ learner, lesson, onDone }: {
  learner: LearnerProfile; lesson: SchoolLesson; onDone: () => void;
}) {
  const { speak } = useSpeech();
  const { lang } = useLang();
  const [items] = useState(() => shuffleArr([...(lesson.visuals ?? [])]));
  const [tapped, setTapped] = useState<number[]>([]);
  const allTapped = tapped.length === items.length && items.length > 0;

  useEffect(() => { speak(lesson.activity, { lang: 'ar', rate: 0.8 }); }, []); // eslint-disable-line

  return (
    <div className="max-w-2xl mx-auto" dir="rtl">
      <div className={`rounded-2xl bg-gradient-to-r ${learner.theme.gradient} text-white p-5 mb-5 text-center`}>
        <p className="text-lg font-black arabic-text mb-1">{s('tapCardsTitle', lang)}</p>
        <p className="text-white/80 text-sm arabic-text">{lesson.activity}</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {items.map((item, i) => {
          const isTapped = tapped.includes(i);
          return (
            <button key={i}
              onClick={() => { if (!isTapped) { setTapped(p => [...p, i]); speak(item.label, { lang: 'ar', rate: 0.82 }); } }}
              className={`rounded-2xl p-4 text-center transition-all border-2 ${isTapped
                ? `bg-gradient-to-br ${learner.theme.gradient} text-white border-transparent shadow-lg scale-105`
                : 'bg-white border-gray-100 shadow-sm hover:shadow-md'}`}>
              <div className="text-4xl mb-2">{item.emoji}</div>
              <p className={`text-sm font-bold arabic-text ${isTapped ? 'text-white' : 'text-gray-700'}`}>{item.label}</p>
            </button>
          );
        })}
      </div>
      {allTapped
        ? <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={onDone}
          className={`w-full min-h-[52px] rounded-xl bg-gradient-to-r ${learner.theme.gradient} text-white font-black arabic-text shadow-lg flex items-center justify-center gap-2`}>
          <Zap className="w-4 h-4" /> {s('goToReview', lang)}
        </motion.button>
        : <button onClick={onDone} className="w-full mt-2 py-2 rounded-xl text-gray-400 text-sm arabic-text hover:text-gray-600">{s('skipActivity', lang)}</button>
      }
    </div>
  );
}

function MathCountActivity({ learner, lesson, onDone }: {
  learner: LearnerProfile; lesson: SchoolLesson; onDone: () => void;
}) {
  const { lang } = useLang();
  const [count, setCount] = useState(0);
  const TARGET = 5;
  return (
    <div className="max-w-md mx-auto" dir="rtl">
      <div className={`rounded-2xl bg-gradient-to-r ${learner.theme.gradient} text-white p-5 mb-5 text-center`}>
        <p className="text-lg font-black arabic-text mb-1">{s('mathCountTitle', lang)}</p>
        <p className="text-white/80 text-sm arabic-text">{lesson.activity}</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
        <p className="text-gray-600 arabic-text mb-4">{s('countInstruct', lang)} <span className="font-black">{TARGET}</span></p>
        <div className="flex flex-wrap justify-center gap-2 min-h-[60px] mb-4">
          {Array.from({ length: count }).map((_, i) => (
            <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-3xl">{lesson.emoji}</motion.span>
          ))}
        </div>
        <div className="flex justify-center gap-4 mb-3">
          <button onClick={() => setCount(c => Math.max(0, c - 1))} className="w-12 h-12 rounded-xl bg-gray-100 text-gray-700 text-2xl font-black hover:bg-gray-200">−</button>
          <span className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black bg-gradient-to-br ${learner.theme.gradient} text-white`}>{count}</span>
          <button onClick={() => setCount(c => Math.min(TARGET + 3, c + 1))} className="w-12 h-12 rounded-xl bg-gray-100 text-gray-700 text-2xl font-black hover:bg-gray-200">+</button>
        </div>
        {count === TARGET && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-600 font-black arabic-text mb-2">{s('wellDone', lang)}</motion.p>
        )}
      </div>
      <button onClick={onDone} className={`mt-4 w-full min-h-[52px] rounded-xl bg-gradient-to-r ${learner.theme.gradient} text-white font-black arabic-text shadow-lg flex items-center justify-center gap-2`}>
        <Zap className="w-4 h-4" /> {s('goToReview', lang)}
      </button>
    </div>
  );
}

function EnglishMatchActivity({ learner, lesson, onDone }: {
  learner: LearnerProfile; lesson: SchoolLesson; onDone: () => void;
}) {
  const { speak } = useSpeech();
  const { lang } = useLang();
  const PAIRS = [
    { emoji: '📚', en: 'book', ar: 'كتاب' },
    { emoji: '🚗', en: 'car', ar: 'سيارة' },
    { emoji: '💧', en: 'water', ar: 'ماء' },
    { emoji: '🏠', en: 'home', ar: 'بيت' },
  ];
  const [flipped, setFlipped] = useState<number[]>([]);
  return (
    <div className="max-w-md mx-auto" dir="rtl">
      <div className={`rounded-2xl bg-gradient-to-r ${learner.theme.gradient} text-white p-5 mb-5 text-center`}>
        <p className="text-lg font-black arabic-text mb-1">{s('englishMatchTitle', lang)}</p>
        <p className="text-white/80 text-sm arabic-text">{s('englishMatchHint', lang)}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-5">
        {PAIRS.map((p, i) => {
          const isFlipped = flipped.includes(i);
          return (
            <button key={i}
              onClick={() => { setFlipped(f => f.includes(i) ? f : [...f, i]); speak(`${p.en}. ${p.ar}`, { lang: 'en' }); }}
              className={`rounded-2xl p-4 text-center border-2 transition-all ${isFlipped
                ? `bg-gradient-to-br ${learner.theme.gradient} text-white border-transparent shadow-lg`
                : 'bg-white border-gray-100 shadow-sm hover:shadow-md'}`}>
              <div className="text-4xl mb-2">{p.emoji}</div>
              <p className={`font-black text-base ${isFlipped ? 'text-white' : 'text-gray-800'}`}>{p.en}</p>
              {isFlipped && <p className="text-white/80 text-sm arabic-text mt-1">{p.ar}</p>}
            </button>
          );
        })}
      </div>
      <button onClick={onDone} className={`w-full min-h-[52px] rounded-xl bg-gradient-to-r ${learner.theme.gradient} text-white font-black arabic-text shadow-lg flex items-center justify-center gap-2`}>
        <Zap className="w-4 h-4" /> {s('goToReview', lang)}
      </button>
    </div>
  );
}

function WordSortActivity({ learner, lesson, onDone }: {
  learner: LearnerProfile; lesson: SchoolLesson; onDone: () => void;
}) {
  const { lang } = useLang();
  const [tiles, setTiles] = useState<{ word: string; id: number }[]>(() =>
    shuffleArr(lesson.activity.split(' ').filter(w => w.length > 0).slice(0, 8).map((word, i) => ({ word, id: i })))
  );
  const [placed, setPlaced] = useState<{ word: string; id: number }[]>([]);

  const pickTile = (tile: { word: string; id: number }) => {
    setTiles(t => t.filter(x => x.id !== tile.id));
    setPlaced(p => [...p, tile]);
  };
  const removeLast = () => {
    if (!placed.length) return;
    const last = placed[placed.length - 1];
    setPlaced(p => p.slice(0, -1));
    setTiles(t => [...t, last]);
  };

  return (
    <div className="max-w-lg mx-auto" dir="rtl">
      <div className={`rounded-2xl bg-gradient-to-r ${learner.theme.gradient} text-white p-5 mb-5`}>
        <p className="text-lg font-black arabic-text mb-1">{s('wordSortTitle', lang)}</p>
        <p className="text-white/90 text-sm arabic-text leading-relaxed">{lesson.activity}</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-3">
        <p className="text-xs text-gray-400 arabic-text mb-2">{s('wordSortHint', lang)}</p>
        <div className="min-h-[44px] flex flex-wrap gap-2 p-2 bg-gray-50 rounded-xl mb-3 border-2 border-dashed border-gray-200">
          {placed.map(tile => (
            <motion.span key={tile.id} initial={{ scale: 0.8 }} animate={{ scale: 1 }} onClick={removeLast}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold arabic-text bg-gradient-to-r ${learner.theme.gradient} text-white cursor-pointer`}>
              {tile.word}
            </motion.span>
          ))}
          {placed.length === 0 && <span className="text-gray-300 text-sm arabic-text self-center">{s('wordSortPlaceholder', lang)}</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          {tiles.map(tile => (
            <button key={tile.id} onClick={() => pickTile(tile)}
              className="px-3 py-1.5 rounded-lg text-sm font-bold arabic-text bg-gray-100 hover:bg-gray-200 transition-all active:scale-95">
              {tile.word}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={removeLast} className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-bold arabic-text hover:bg-gray-200">{s('deleteLast', lang)}</button>
        <button onClick={onDone} className={`flex-1 min-h-[44px] rounded-xl bg-gradient-to-r ${learner.theme.gradient} text-white font-black arabic-text shadow-md flex items-center justify-center gap-2`}>
          <Zap className="w-4 h-4" /> {s('goToReview', lang)}
        </button>
      </div>
    </div>
  );
}

function ActivityPhase({ learner, lesson, onDone }: {
  learner: LearnerProfile; lesson: SchoolLesson; onDone: () => void;
}) {
  const { speak } = useSpeech();
  useEffect(() => { speak(lesson.activity, { lang: 'ar', rate: 0.8 }); }, []); // eslint-disable-line
  if (lesson.visuals && lesson.visuals.length > 0) return <TapCardsActivity learner={learner} lesson={lesson} onDone={onDone} />;
  if (lesson.subject === 'math') return <MathCountActivity learner={learner} lesson={lesson} onDone={onDone} />;
  if (lesson.subject === 'english') return <EnglishMatchActivity learner={learner} lesson={lesson} onDone={onDone} />;
  return <WordSortActivity learner={learner} lesson={lesson} onDone={onDone} />;
}

// ── LessonView ─────────────────────────────────────────────────────
export function LessonView({
  learner,
  lesson,
  previous,
  onComplete,
  onBack,
}: {
  learner: LearnerProfile;
  lesson: SchoolLesson;
  previous?: LessonResult;
  onComplete: (correct: number, total: number) => void;
  onBack: () => void;
}) {
  const [phase, setPhase] = useState<'teach' | 'activity' | 'quiz' | 'done'>('teach');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [tutorText, setTutorText] = useState('');
  const [tutorLoading, setTutorLoading] = useState(false);
  const correctCountRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const { speak, stop } = useSpeech();
  const { lang } = useLang();

  const totalQ = lesson.questions.length;
  const question = lesson.questions[questionIndex];
  const answered = selected !== null;
  const isCorrect = answered && selected === question.correctAnswer;

  useEffect(() => () => { stop(); abortRef.current?.abort(); }, [stop]);

  const selectAnswer = useCallback(async (index: number) => {
    if (answered) return;
    setSelected(index);
    if (index === question.correctAnswer) correctCountRef.current += 1;
    setTutorLoading(true);
    setTutorText('');
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const text = await getTutorExplanation(learner, lesson, index, questionIndex, ctrl.signal);
    if (!ctrl.signal.aborted) { setTutorText(text); setTutorLoading(false); }
  }, [answered, question.correctAnswer, learner, lesson, questionIndex]);

  const nextQuestion = useCallback(() => {
    stop();
    if (questionIndex < totalQ - 1) {
      setQuestionIndex(v => v + 1);
      setSelected(null);
      setTutorText('');
    } else {
      onComplete(correctCountRef.current, totalQ);
      setPhase('done');
    }
  }, [stop, questionIndex, totalQ, onComplete]);

  const resetLesson = useCallback(() => {
    correctCountRef.current = 0;
    setPhase('teach');
    setQuestionIndex(0);
    setSelected(null);
    setTutorText('');
  }, []);

  const lessonText = [lesson.title, lesson.subtitle, ...lesson.objectives, ...lesson.explanation, lesson.example, lesson.remember].join('. ');
  const questionText = `${question.question}. الخيارات: ${question.options.map((o, i) => `${['أ', 'ب', 'ج', 'د'][i]}، ${o}`).join('. ')}`;

  const STEPS = ['teach', 'activity', 'quiz'] as const;
  const stepIdx = STEPS.indexOf(phase as typeof STEPS[number]);

  const StepDots = () => (
    <div className="flex items-center gap-1.5">
      {STEPS.map((_, i) => (
        <div key={i} className={`h-2 rounded-full transition-all ${i < stepIdx ? `w-6 bg-gradient-to-r ${learner.theme.gradient} opacity-60` :
          i === stepIdx ? `w-8 bg-gradient-to-r ${learner.theme.gradient}` :
            'w-2 bg-gray-200'
          }`} />
      ))}
    </div>
  );

  // ── TEACH ──────────────────────────────────────────────────────
  if (phase === 'teach') return (
    <div className="max-w-3xl mx-auto" dir="rtl">
      <div className="flex items-center justify-between mb-5">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 arabic-text">
          <ArrowRight className="w-5 h-5" /> {s('backToLessons', lang)}
        </button>
        <StepDots />
      </div>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        <div className={`h-2 bg-gradient-to-r ${learner.theme.gradient}`} />
        <div className="p-6 md:p-9">
          <div className="flex items-start gap-4 mb-6">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${learner.theme.gradient} text-white text-3xl flex items-center justify-center flex-shrink-0`}>{lesson.emoji}</div>
            <div>
              <p className={`text-sm font-bold ${learner.theme.text} arabic-text`}>{SUBJECTS[lesson.subject].label}</p>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 arabic-text">{lesson.title}</h1>
              <p className="text-gray-500 mt-1 arabic-text">{lesson.subtitle}</p>
              {previous && <span className="inline-flex mt-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold arabic-text">{s('studiedBefore', lang)}</span>}
            </div>
          </div>

          <button onClick={() => speak(lessonText, { lang: 'ar', rate: 0.82 })}
            className="mb-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 font-bold arabic-text hover:bg-blue-100 transition-colors">
            <Volume2 className="w-4 h-4" /> {s('listenExplain', lang)}
          </button>

          <section className="mb-5">
            <h2 className={`font-black ${learner.theme.text} arabic-text mb-3 flex items-center gap-2`}>
              <Target className="w-5 h-5" /> {s('whatWeLearn', lang)}
            </h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {lesson.objectives.map(item => (
                <div key={item} className="rounded-xl bg-gray-50 p-3 flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm arabic-text">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-blue-50 p-5 mb-5">
            <h2 className="font-black text-blue-950 arabic-text mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> {s('explanation', lang)}
            </h2>
            {lesson.explanation.map((para, i) => (
              <p key={i} className="text-gray-800 leading-relaxed arabic-text mb-2 last:mb-0">{para}</p>
            ))}
          </section>

          {lesson.visuals && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {lesson.visuals.map(v => (
                <div key={v.label} className={`rounded-2xl ${learner.theme.light} p-3 text-center`}>
                  <div className="text-4xl mb-1">{v.emoji}</div>
                  <p className={`text-sm font-bold arabic-text ${learner.theme.text}`}>{v.label}</p>
                </div>
              ))}
            </div>
          )}

          <section className={`rounded-2xl ${learner.theme.light} p-4 mb-5`}>
            <p className={`text-xs font-bold ${learner.theme.text} arabic-text mb-1`}>{s('example', lang)}</p>
            <p className="text-sm arabic-text text-gray-700 leading-relaxed">{lesson.example}</p>
          </section>

          <section className="rounded-2xl bg-amber-50 border border-amber-100 p-4 mb-6">
            <p className="text-xs font-bold text-amber-700 arabic-text mb-0.5 flex items-center gap-1">
              <Lightbulb className="w-3 h-3" /> {s('remember', lang)}
            </p>
            <p className="text-sm text-amber-800 arabic-text">{lesson.remember}</p>
          </section>

          <button onClick={() => setPhase('activity')}
            className={`w-full min-h-[56px] rounded-2xl bg-gradient-to-r ${learner.theme.gradient} text-white font-black arabic-text text-lg shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-3`}>
            <Zap className="w-5 h-5" /> {s('goToActivity', lang)}
          </button>
        </div>
      </div>
    </div>
  );

  // ── ACTIVITY ───────────────────────────────────────────────────
  if (phase === 'activity') return (
    <div className="max-w-3xl mx-auto" dir="rtl">
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => setPhase('teach')} className="flex items-center gap-2 text-gray-600 arabic-text">
          <ArrowRight className="w-5 h-5" /> {s('backToExplain', lang)}
        </button>
        <StepDots />
      </div>
      <ActivityPhase learner={learner} lesson={lesson} onDone={() => setPhase('quiz')} />
    </div>
  );

  // ── QUIZ ───────────────────────────────────────────────────────
  if (phase === 'quiz') return (
    <div className="max-w-2xl mx-auto" dir="rtl">
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => setPhase('activity')} className="flex items-center gap-2 text-gray-600 arabic-text">
          <ArrowRight className="w-5 h-5" /> {s('backToActivity', lang)}
        </button>
        <StepDots />
        <span className={`text-sm font-bold ${learner.theme.text} arabic-text`}>{questionIndex + 1}/{totalQ}</span>
      </div>
      <motion.div key={questionIndex} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${learner.theme.light} ${learner.theme.text} arabic-text`}>{s('quickReview', lang)}</span>
          <button onClick={() => speak(questionText, { lang: 'ar', rate: 0.82 })}
            className="p-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors" title={s('listenQuestion', lang)}>
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
        <h1 className="text-xl md:text-2xl font-black text-gray-900 leading-relaxed arabic-text mb-6">{question.question}</h1>
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const correct = answered && index === question.correctAnswer;
            const wrong = answered && index === selected && !correct;
            return (
              <button key={option} disabled={answered} onClick={() => selectAnswer(index)}
                className={`w-full min-h-[54px] rounded-xl border-2 p-4 text-right flex gap-3 arabic-text transition-all ${correct ? 'bg-green-50 border-green-500 text-green-950' :
                  wrong ? 'bg-red-50 border-red-400 text-red-950' :
                    answered ? 'bg-gray-50 border-gray-200 text-gray-400' :
                      'bg-gray-50 border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black flex-shrink-0 ${correct ? 'bg-green-500 text-white' : wrong ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {correct ? <CheckCircle2 className="w-5 h-5" /> : wrong ? <XCircle className="w-5 h-5" /> : ['أ', 'ب', 'ج', 'د'][index]}
                </span>
                <span className="flex-1">{option}</span>
              </button>
            );
          })}
        </div>
        <AnimatePresence>
          {answered && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`mt-4 rounded-2xl p-4 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
              <p className={`text-sm font-black arabic-text mb-2 ${isCorrect ? 'text-green-800' : 'text-amber-800'}`}>
                {isCorrect ? s('correctAnswer', lang) : s('understandAnswer', lang)}
              </p>
              {tutorLoading
                ? <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} className={`w-2 h-2 rounded-full bg-gradient-to-r ${learner.theme.gradient}`}
                      animate={{ y: [0, -6, 0] }} transition={{ delay: i * 0.15, repeat: Infinity, duration: 0.7 }} />
                  ))}
                </div>
                : <p className="text-sm arabic-text text-gray-700 leading-relaxed">{tutorText}</p>
              }
              <button onClick={nextQuestion}
                className={`mt-3 w-full min-h-[44px] rounded-xl bg-gradient-to-r ${learner.theme.gradient} text-white font-black arabic-text flex items-center justify-center gap-2`}>
                {questionIndex < totalQ - 1 ? s('nextQuestion', lang) : s('finishLesson', lang)}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );

  // ── DONE ───────────────────────────────────────────────────────
  const pct = totalQ ? Math.round((correctCountRef.current / totalQ) * 100) : 100;
  return (
    <div className="max-w-md mx-auto text-center" dir="rtl">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8">
        <div className="text-6xl mb-4">{pct >= 80 ? '🏆' : pct >= 50 ? '🌱' : '📚'}</div>
        <h1 className="text-2xl font-black text-gray-900 arabic-text">{s('lessonComplete', lang)} {lang === 'ar' ? learner.nameAr : learner.nameEn}!</h1>
        <p className="text-gray-500 mt-2 text-sm arabic-text">{s('explainActivity', lang)}</p>
        <div className={`w-28 h-28 mx-auto my-6 rounded-full bg-gradient-to-br ${learner.theme.gradient} text-white flex items-center justify-center text-3xl font-black`}>
          {pct}%
        </div>
        <div className="flex flex-col gap-2">
          <button onClick={onBack}
            className={`w-full min-h-[50px] rounded-xl bg-gradient-to-r ${learner.theme.gradient} text-white font-black arabic-text flex items-center justify-center gap-2`}>
            <Home className="w-5 h-5" /> {s('backToDashboard', lang)}
          </button>
          <button onClick={resetLesson}
            className="w-full min-h-[48px] rounded-xl bg-gray-100 text-gray-700 font-bold arabic-text flex items-center justify-center gap-2 hover:bg-gray-200">
            <RotateCcw className="w-4 h-4" /> {s('repeatLesson', lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
