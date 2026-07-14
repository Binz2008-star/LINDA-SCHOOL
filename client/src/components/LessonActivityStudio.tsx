import { useSpeech } from '@/hooks/useSpeech';
import { LearnerProfile, SchoolLesson, SubjectId } from '@/lib/familyCurriculum';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Eraser,
  Lightbulb,
  Loader2,
  Palette,
  PenLine,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { PointerEvent, useMemo, useRef, useState } from 'react';

interface Props {
  learner: LearnerProfile;
  lesson: SchoolLesson;
  onBack: () => void;
  onComplete: () => void;
}

type StudioStep = 'build' | 'write' | 'draw';

interface BuildTask {
  title: string;
  instruction: string;
  target: string[];
  direction: 'rtl' | 'ltr';
  hint: string;
}

interface WritingTask {
  title: string;
  prompt: string;
  placeholder: string;
  guide?: string;
  minimum: number;
}

const STEP_LABELS: Record<StudioStep, string> = {
  build: 'رتّب وابنِ',
  write: 'اكتب وفكّر',
  draw: 'ارسم واشرح',
};

const STEP_EMOJI: Record<StudioStep, string> = {
  build: '🧩',
  write: '✍️',
  draw: '🎨',
};

const SUBJECT_DRAW_PROMPTS: Record<SubjectId, string> = {
  arabic: 'ارسم المشهد الذي تتخيله من فكرة الدرس، ثم ضع كلمة أو حرفاً بجانبه.',
  english: 'ارسم معنى كلمة من الدرس، ثم اكتب الكلمة الإنجليزية بجانب الرسم.',
  math: 'مثّل فكرة الدرس بالرسم: مجموعات، أشكال، أعداد أو خط أعداد.',
  science: 'ارسم ما لاحظته أو ما تتوقع حدوثه في تجربة مرتبطة بالدرس.',
  life: 'ارسم موقفاً يومياً تطبق فيه المهارة التي تعلمتها.',
  interest: 'حوّل فكرة الدرس إلى تصميم أو مخطط من خيالك.',
};

function personalizedSentence(learner: LearnerProfile, language: 'ar' | 'en'): string[] {
  if (language === 'en') {
    if (learner.id === 'noah') return ['I', 'like', 'cars'];
    if (learner.id === 'judy') return ['I', 'like', 'sports'];
    if (learner.id === 'adam') return ['I', 'build', 'inventions'];
    return ['I', 'learn', 'from', 'nature'];
  }

  if (learner.id === 'noah') return ['أنا', 'أحب', 'السيارات'];
  if (learner.id === 'judy') return ['أنا', 'أحب', 'الرياضة'];
  if (learner.id === 'adam') return ['أنا', 'أصنع', 'اختراعاً'];
  return ['أنا', 'أتعلم', 'من', 'الحياة'];
}

function getBuildTask(learner: LearnerProfile, lesson: SchoolLesson): BuildTask {
  switch (lesson.subject) {
    case 'arabic':
      return {
        title: 'ابنِ جملة عربية',
        instruction: 'اضغط الكلمات بالترتيب لتكوين جملة مفيدة.',
        target: personalizedSentence(learner, 'ar'),
        direction: 'rtl',
        hint: 'ابدأ بمن قام بالفعل، ثم الفعل، ثم الشيء أو الفكرة.',
      };
    case 'english':
      return {
        title: 'Build an English sentence',
        instruction: 'اضغط الكلمات بالترتيب الصحيح من اليسار إلى اليمين.',
        target: personalizedSentence(learner, 'en'),
        direction: 'ltr',
        hint: 'ابدأ بـ I، ثم الفعل، ثم الشيء الذي تحبه أو تفعله.',
      };
    case 'math':
      return {
        title: 'ابنِ عملية حسابية',
        instruction: 'رتّب البطاقات لتكوين عملية صحيحة.',
        target: learner.id === 'noah' ? ['2', '+', '3', '=', '5'] : ['4', '+', '4', '=', '8'],
        direction: 'ltr',
        hint: 'ضع العدد الأول، ثم علامة الجمع، ثم العدد الثاني، ثم الناتج.',
      };
    case 'science':
      return {
        title: 'رتّب خطوات التفكير العلمي',
        instruction: 'ما الترتيب الذي يساعدنا على فهم العالم؟',
        target: ['ألاحظ', 'أسأل', 'أجرّب', 'أستنتج'],
        direction: 'rtl',
        hint: 'العالم يبدأ بالملاحظة، ولا يقفز إلى النتيجة.',
      };
    case 'life':
      return {
        title: 'رتّب قراراً ذكياً',
        instruction: 'رتّب الخطوات التي تساعدك على اتخاذ قرار جيد.',
        target: ['أتوقف', 'أفكر', 'أختار', 'أراجع'],
        direction: 'rtl',
        hint: 'لا نختار بسرعة؛ نفكر أولاً ثم نراجع النتيجة.',
      };
    default:
      if (learner.id === 'adam') {
        return {
          title: 'رتّب رحلة الاختراع',
          instruction: 'رتّب المراحل من المشكلة إلى التحسين.',
          target: ['مشكلة', 'فكرة', 'نموذج', 'تجربة', 'تحسين'],
          direction: 'rtl',
          hint: 'الاختراع الجيد يبدأ بمشكلة حقيقية.',
        };
      }
      if (learner.id === 'judy') {
        return {
          title: 'رتّب تدريباً آمناً',
          instruction: 'رتّب مراحل التدريب الرياضي الصحيح.',
          target: ['إحماء', 'تدريب', 'ماء', 'تهدئة'],
          direction: 'rtl',
          hint: 'الإحماء يأتي قبل الجهد، والتهدئة تأتي بعده.',
        };
      }
      if (learner.id === 'noah') {
        return {
          title: 'رتّب رحلة السيارة',
          instruction: 'اضغط الصور والكلمات بالترتيب.',
          target: ['🔑 تشغيل', '👀 أنظر', '🚗 أسير', '🛑 أتوقف'],
          direction: 'rtl',
          hint: 'ننظر للطريق قبل أن نتحرك، ونتوقف عند علامة الوقوف.',
        };
      }
      return {
        title: 'رتّب فكرة متكاملة',
        instruction: 'رتّب عناصر التفكير من الملاحظة إلى التعبير.',
        target: ['ألاحظ', 'أفهم', 'أربط', 'أعبّر'],
        direction: 'rtl',
        hint: 'الفكرة القوية تبدأ بالملاحظة وتنتهي بتعبير واضح.',
      };
  }
}

function getWritingTask(learner: LearnerProfile, lesson: SchoolLesson): WritingTask {
  if (learner.id === 'noah') {
    const guide = lesson.subject === 'english' ? 'A' : lesson.subject === 'math' ? '5' : lesson.subject === 'interest' ? 'س' : 'ب';
    return {
      title: 'تتبّع واكتب',
      prompt: `مرّر إصبعك أو الفأرة فوق الشكل، ثم حاول كتابته وحدك: ${guide}`,
      placeholder: '',
      guide,
      minimum: 0,
    };
  }

  const promptByLearner: Record<LearnerProfile['id'], string> = {
    linda: `اكتبي فكرتين: ماذا فهمتِ من «${lesson.title}»، وكيف يرتبط ذلك بالحياة؟`,
    adam: `اكتب شرحاً قصيراً للفكرة، ثم اقترح طريقة لاستخدامها في اختراع أو حل مشكلة.`,
    judy: `اكتبي جملة تشرح الفكرة، ثم مثالاً من الرياضة أو الحركة.`,
    noah: '',
  };

  return {
    title: 'دفتر التفكير',
    prompt: promptByLearner[learner.id],
    placeholder: 'اكتب هنا بطريقتك. لا نبحث عن كلام محفوظ؛ نريد فهمك أنت...',
    minimum: learner.id === 'linda' ? 20 : 10,
  };
}

function seededShuffle<T>(values: T[], seedText: string): T[] {
  let seed = Array.from(seedText).reduce((sum, char) => sum + char.charCodeAt(0), 0) || 1;
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    seed = (seed * 9301 + 49297) % 233280;
    const swapIndex = Math.floor((seed / 233280) * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

async function requestWritingFeedback(learner: LearnerProfile, lesson: SchoolLesson, response: string): Promise<string> {
  try {
    const apiResponse = await fetch('/api/tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'writing-feedback',
        learner: {
          nameAr: learner.nameAr,
          age: learner.age,
          gender: learner.gender,
          interestAr: learner.interestAr,
        },
        lesson: { title: lesson.title, subject: lesson.subject },
        response,
      }),
    });
    if (!apiResponse.ok) throw new Error('feedback unavailable');
    const data = await apiResponse.json() as { explanation?: string };
    return data.explanation?.trim() || 'كتابتك توضح أنك حاولت التعبير بطريقتك. راجع الفكرة وأضف مثالاً واحداً يجعلها أوضح.';
  } catch {
    return 'أحسنت لأنك عبّرت بطريقتك. اقرأ ما كتبت مرة أخرى، ثم أضف مثالاً صغيراً يوضح الفكرة أكثر.';
  }
}

function BuildActivity({ learner, lesson, onDone }: { learner: LearnerProfile; lesson: SchoolLesson; onDone: () => void }) {
  const task = useMemo(() => getBuildTask(learner, lesson), [learner, lesson]);
  const initialTiles = useMemo(
    () => seededShuffle(task.target.map((text, index) => ({ id: `${index}-${text}`, text, targetIndex: index })), `${learner.id}-${lesson.id}`),
    [learner.id, lesson.id, task.target],
  );
  const [available, setAvailable] = useState(initialTiles);
  const [chosen, setChosen] = useState<typeof initialTiles>([]);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const { speak, isSupported } = useSpeech();

  const choose = (tile: typeof initialTiles[number]) => {
    if (status !== 'idle') return;
    setAvailable(current => current.filter(item => item.id !== tile.id));
    setChosen(current => [...current, tile]);
  };

  const undo = () => {
    if (!chosen.length || status === 'correct') return;
    const tile = chosen[chosen.length - 1];
    setChosen(current => current.slice(0, -1));
    setAvailable(current => [...current, tile]);
    setStatus('idle');
  };

  const reset = () => {
    setAvailable(initialTiles);
    setChosen([]);
    setStatus('idle');
  };

  const check = () => {
    const answer = chosen.map(item => item.text);
    const correct = answer.length === task.target.length && answer.every((item, index) => item === task.target[index]);
    setStatus(correct ? 'correct' : 'wrong');
    speak(correct ? `أحسنت يا ${learner.nameAr}. بنيت الفكرة بالترتيب الصحيح.` : `قريب يا ${learner.nameAr}. استخدم التلميح وحاول ترتيبها مرة أخرى.`, { lang: 'ar', rate: 0.82 });
  };

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
      <section className="rounded-3xl bg-white border border-gray-100 shadow-sm p-5 md:p-7">
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            <h2 className="text-2xl font-black text-gray-900 arabic-text">{task.title}</h2>
            <p className="text-gray-600 mt-2 arabic-text">{task.instruction}</p>
          </div>
          {isSupported && (
            <button type="button" onClick={() => speak(`${task.title}. ${task.instruction}. ${task.hint}`, { lang: 'ar', rate: 0.8 })} className="p-3 rounded-2xl bg-blue-50 text-blue-700" title="اسمع التعليمات">
              <Volume2 className="w-5 h-5" />
            </button>
          )}
        </div>

        <div dir={task.direction} className="min-h-[92px] rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-4 flex flex-wrap gap-3 items-center justify-center">
          {chosen.length === 0 ? (
            <p className="text-gray-400 arabic-text">ابنِ إجابتك هنا</p>
          ) : chosen.map((tile, index) => (
            <motion.button layout key={tile.id} type="button" onClick={index === chosen.length - 1 ? undo : undefined} className={`min-h-[48px] px-4 rounded-xl border-2 font-black text-lg ${status === 'correct' ? 'bg-green-50 border-green-400 text-green-800' : status === 'wrong' ? 'bg-red-50 border-red-300 text-red-800' : 'bg-white border-blue-200 text-gray-900'}`}>
              {tile.text}
            </motion.button>
          ))}
        </div>

        <div dir={task.direction} className="mt-5 flex flex-wrap gap-3 justify-center">
          {available.map(tile => (
            <motion.button layout key={tile.id} type="button" onClick={() => choose(tile)} className="min-h-[48px] px-4 rounded-xl bg-white border-2 border-gray-200 hover:border-blue-400 shadow-sm font-bold text-lg active:scale-95">
              {tile.text}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {status !== 'idle' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`mt-6 rounded-2xl border p-4 ${status === 'correct' ? 'bg-green-50 border-green-200 text-green-900' : 'bg-amber-50 border-amber-200 text-amber-950'}`}>
              <p className="font-black arabic-text">{status === 'correct' ? 'ممتاز — أنت بنيت المعنى، ولم تحفظ جواباً فقط.' : 'الإجابة ليست مرتبة بعد. استخدم التلميح، ثم جرّب من جديد.'}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {status === 'correct' ? (
            <button type="button" onClick={onDone} className={`flex-1 min-h-[52px] rounded-xl bg-gradient-to-r ${learner.theme.gradient} text-white font-black arabic-text flex items-center justify-center gap-2`}>
              أكملت النشاط <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <button type="button" disabled={chosen.length !== task.target.length} onClick={check} className={`flex-1 min-h-[52px] rounded-xl bg-gradient-to-r ${learner.theme.gradient} text-white font-black arabic-text disabled:opacity-40`}>
              تحقق من الترتيب
            </button>
          )}
          <button type="button" onClick={reset} className="min-h-[52px] px-5 rounded-xl bg-gray-100 text-gray-700 font-bold arabic-text flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" /> ابدأ من جديد
          </button>
        </div>
      </section>

      <aside className={`rounded-3xl ${learner.theme.light} ${learner.theme.border} border p-5`}>
        <Lightbulb className={`w-7 h-7 ${learner.theme.text}`} />
        <h3 className={`font-black mt-3 ${learner.theme.text} arabic-text`}>تلميح للتفكير</h3>
        <p className="mt-2 leading-loose text-gray-700 arabic-text">{task.hint}</p>
        <p className="mt-4 text-sm text-gray-500 arabic-text">يمكنك الضغط على آخر بطاقة في إجابتك لإعادتها.</p>
      </aside>
    </div>
  );
}

interface CanvasBoardProps {
  guide?: string;
  onInkChange: (hasInk: boolean) => void;
}

function CanvasBoard({ guide, onInkChange }: CanvasBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [color, setColor] = useState('#2563eb');
  const [size, setSize] = useState(8);
  const [erasing, setErasing] = useState(false);

  const position = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const start = (event: PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drawingRef.current = true;
    lastPointRef.current = position(event);
  };

  const draw = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    event.preventDefault();
    const canvas = canvasRef.current;
    const previous = lastPointRef.current;
    if (!canvas || !previous) return;
    const next = position(event);
    const context = canvas.getContext('2d');
    if (!context) return;
    context.beginPath();
    context.moveTo(previous.x, previous.y);
    context.lineTo(next.x, next.y);
    context.lineWidth = erasing ? size * 3 : size;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = erasing ? '#ffffff' : color;
    context.stroke();
    lastPointRef.current = next;
    onInkChange(true);
  };

  const stop = (event: PointerEvent<HTMLCanvasElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    drawingRef.current = false;
    lastPointRef.current = null;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    onInkChange(false);
  };

  return (
    <div>
      <div className="relative rounded-2xl bg-white border-2 border-dashed border-gray-200 overflow-hidden shadow-inner">
        {guide && <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-[180px] md:text-[240px] font-black text-gray-100 select-none">{guide}</div>}
        <canvas
          ref={canvasRef}
          width={900}
          height={420}
          className="relative w-full h-[280px] md:h-[360px] touch-none cursor-crosshair"
          onPointerDown={start}
          onPointerMove={draw}
          onPointerUp={stop}
          onPointerCancel={stop}
          onPointerLeave={event => drawingRef.current && stop(event)}
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 rounded-2xl bg-white border border-gray-100 p-3">
        {['#2563eb', '#ef4444', '#16a34a', '#9333ea', '#f59e0b', '#111827'].map(item => (
          <button key={item} type="button" onClick={() => { setColor(item); setErasing(false); }} className={`w-9 h-9 rounded-full border-4 ${color === item && !erasing ? 'border-gray-900 scale-110' : 'border-white shadow'}`} style={{ backgroundColor: item }} aria-label={`لون ${item}`} />
        ))}
        <button type="button" onClick={() => setSize(current => current === 6 ? 12 : current === 12 ? 20 : 6)} className="h-10 px-3 rounded-xl bg-gray-100 font-bold text-sm arabic-text">حجم القلم: {size}</button>
        <button type="button" onClick={() => setErasing(current => !current)} className={`h-10 px-3 rounded-xl font-bold text-sm arabic-text flex items-center gap-2 ${erasing ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}><Eraser className="w-4 h-4" /> ممحاة</button>
        <button type="button" onClick={clear} className="h-10 px-3 rounded-xl bg-red-50 text-red-600 font-bold text-sm arabic-text flex items-center gap-2"><RefreshCw className="w-4 h-4" /> مسح الكل</button>
      </div>
    </div>
  );
}

function WritingActivity({ learner, lesson, onDone }: { learner: LearnerProfile; lesson: SchoolLesson; onDone: () => void }) {
  const task = useMemo(() => getWritingTask(learner, lesson), [learner, lesson]);
  const storageKey = `family_school_notebook_v1_${learner.id}_${lesson.id}`;
  const [text, setText] = useState(() => {
    try { return localStorage.getItem(storageKey) ?? ''; } catch { return ''; }
  });
  const [hasInk, setHasInk] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const { speak, isSupported } = useSpeech();
  const ready = learner.id === 'noah' ? hasInk : text.trim().length >= task.minimum;

  const submit = async () => {
    if (!ready) return;
    if (learner.id === 'noah') {
      speak(`أحسنت يا ${learner.nameAr}. حاولت الكتابة بيدك وهذا هو المهم.`, { lang: 'ar', rate: 0.82 });
      setFeedback('ممتاز — المحاولة باليد تبني الذاكرة الحركية للحرف أو الرقم.');
      return;
    }
    try { localStorage.setItem(storageKey, text.trim()); } catch { /* keep the lesson usable */ }
    setLoading(true);
    const result = await requestWritingFeedback(learner, lesson, text.trim());
    setFeedback(result);
    setLoading(false);
    speak(result, { lang: 'ar', rate: 0.8 });
  };

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
      <section className="rounded-3xl bg-white border border-gray-100 shadow-sm p-5 md:p-7">
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            <h2 className="text-2xl font-black text-gray-900 arabic-text">{task.title}</h2>
            <p className="text-gray-600 mt-2 leading-loose arabic-text">{task.prompt}</p>
          </div>
          {isSupported && <button type="button" onClick={() => speak(task.prompt, { lang: 'ar', rate: 0.8 })} className="p-3 rounded-2xl bg-blue-50 text-blue-700"><Volume2 className="w-5 h-5" /></button>}
        </div>

        {learner.id === 'noah' ? (
          <CanvasBoard guide={task.guide} onInkChange={setHasInk} />
        ) : (
          <div>
            <textarea value={text} onChange={event => setText(event.target.value)} rows={8} placeholder={task.placeholder} className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 p-5 text-lg leading-loose arabic-text outline-none focus:border-blue-400 focus:bg-white resize-y" />
            <div className="mt-2 flex justify-between text-xs text-gray-500 arabic-text"><span>تُحفظ الكتابة على هذا الجهاز فقط.</span><span>{text.trim().length} حرفاً</span></div>
          </div>
        )}

        {feedback && <div className={`mt-5 rounded-2xl ${learner.theme.light} ${learner.theme.border} border p-5`}><h3 className={`font-black ${learner.theme.text} arabic-text flex items-center gap-2`}><Sparkles className="w-5 h-5" /> ملاحظات بابا المعلم</h3><p className="mt-3 leading-loose text-gray-800 arabic-text">{feedback}</p></div>}

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {!feedback ? (
            <button type="button" disabled={!ready || loading} onClick={submit} className={`flex-1 min-h-[52px] rounded-xl bg-gradient-to-r ${learner.theme.gradient} text-white font-black arabic-text disabled:opacity-40 flex items-center justify-center gap-2`}>
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> بابا المعلم يقرأ كتابتك...</> : 'أنهيت — راجع عملي'}
            </button>
          ) : (
            <button type="button" onClick={onDone} className={`flex-1 min-h-[52px] rounded-xl bg-gradient-to-r ${learner.theme.gradient} text-white font-black arabic-text flex items-center justify-center gap-2`}>
              أكملت الكتابة <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>
      </section>

      <aside className="rounded-3xl bg-amber-50 border border-amber-200 p-5">
        <PenLine className="w-7 h-7 text-amber-700" />
        <h3 className="font-black mt-3 text-amber-950 arabic-text">لماذا نكتب؟</h3>
        <p className="mt-2 leading-loose text-amber-950/80 arabic-text">الكتابة تكشف ما فهمته فعلاً. لا بأس بالأخطاء الإملائية الآن؛ المهم أن تعبّر عن الفكرة، ثم نحسّن اللغة خطوة خطوة.</p>
      </aside>
    </div>
  );
}

function DrawingActivity({ learner, lesson, onDone }: { learner: LearnerProfile; lesson: SchoolLesson; onDone: () => void }) {
  const [hasInk, setHasInk] = useState(false);
  const [finished, setFinished] = useState(false);
  const prompt = learner.id === 'judy'
    ? `${SUBJECT_DRAW_PROMPTS[lesson.subject]} أضيفي حركة أو ملعباً أو جسماً متحركاً عندما يناسب الفكرة.`
    : learner.id === 'adam'
      ? `${SUBJECT_DRAW_PROMPTS[lesson.subject]} أضف أسهماً وأسماء للأجزاء كأنك تصمم نموذجاً أولياً.`
      : learner.id === 'linda'
        ? `${SUBJECT_DRAW_PROMPTS[lesson.subject]} أضيفي علاقة أو سبباً ونتيجة داخل الرسم.`
        : SUBJECT_DRAW_PROMPTS[lesson.subject];
  const { speak, isSupported } = useSpeech();

  const finish = () => {
    if (!hasInk) return;
    setFinished(true);
    speak(`عمل جميل يا ${learner.nameAr}. الرسم هنا وسيلة للتفكير وشرح الفكرة.`, { lang: 'ar', rate: 0.82 });
  };

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
      <section className="rounded-3xl bg-white border border-gray-100 shadow-sm p-5 md:p-7">
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            <h2 className="text-2xl font-black text-gray-900 arabic-text">ارسم ما فهمته</h2>
            <p className="text-gray-600 mt-2 leading-loose arabic-text">{prompt}</p>
          </div>
          {isSupported && <button type="button" onClick={() => speak(prompt, { lang: 'ar', rate: 0.8 })} className="p-3 rounded-2xl bg-blue-50 text-blue-700"><Volume2 className="w-5 h-5" /></button>}
        </div>

        <CanvasBoard onInkChange={setHasInk} />

        {finished && <div className="mt-5 rounded-2xl bg-green-50 border border-green-200 p-4 text-green-900"><p className="font-black arabic-text">أكملت لوحة الفهم. اشرح رسمك لشخص في البيت بجملة أو جملتين.</p></div>}

        <div className="mt-6">
          {!finished ? (
            <button type="button" disabled={!hasInk} onClick={finish} className={`w-full min-h-[52px] rounded-xl bg-gradient-to-r ${learner.theme.gradient} text-white font-black arabic-text disabled:opacity-40`}>أنهيت الرسم</button>
          ) : (
            <button type="button" onClick={onDone} className={`w-full min-h-[52px] rounded-xl bg-gradient-to-r ${learner.theme.gradient} text-white font-black arabic-text flex items-center justify-center gap-2`}>أكملت النشاط <ChevronLeft className="w-5 h-5" /></button>
          )}
        </div>
      </section>

      <aside className={`rounded-3xl ${learner.theme.light} ${learner.theme.border} border p-5`}>
        <Palette className={`w-7 h-7 ${learner.theme.text}`} />
        <h3 className={`font-black mt-3 ${learner.theme.text} arabic-text`}>الرسم ليس للزينة فقط</h3>
        <p className="mt-2 leading-loose text-gray-700 arabic-text">استخدم الأسهم، الكلمات، الألوان والأشكال لتوضيح العلاقات. الرسم العلمي أو الرياضي الجيد يساعد غيرك على فهم فكرتك.</p>
      </aside>
    </div>
  );
}

export default function LessonActivityStudio({ learner, lesson, onBack, onComplete }: Props) {
  const steps: StudioStep[] = ['build', 'write', 'draw'];
  const [stepIndex, setStepIndex] = useState(0);
  const completed = stepIndex;
  const step = steps[stepIndex];

  const finishStep = () => {
    if (stepIndex < steps.length - 1) setStepIndex(current => current + 1);
    else onComplete();
  };

  return (
    <div className="max-w-6xl mx-auto" dir="rtl">
      <button type="button" onClick={onBack} className="mb-5 flex items-center gap-2 text-gray-600 arabic-text"><ArrowRight className="w-5 h-5" /> العودة لشرح الدرس</button>

      <header className={`rounded-3xl bg-gradient-to-r ${learner.theme.gradient} text-white p-6 md:p-8 shadow-xl mb-6`}>
        <div className="flex flex-col md:flex-row md:items-center gap-5">
          <div className="text-5xl">{STEP_EMOJI[step]}</div>
          <div className="flex-1">
            <p className="text-white/80 arabic-text">مختبر الدرس: {lesson.title}</p>
            <h1 className="text-3xl md:text-4xl font-black arabic-text mt-1">نتعلّم باليد والعقل</h1>
            <p className="text-white/85 mt-2 arabic-text">سنرتب فكرة، ثم نكتبها بطريقتنا، ثم نحوّلها إلى رسم أو مخطط.</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-6">
          {steps.map((item, index) => (
            <div key={item} className={`rounded-xl px-3 py-2 text-center text-sm font-bold arabic-text ${index < stepIndex ? 'bg-green-400/30' : index === stepIndex ? 'bg-white text-gray-900' : 'bg-white/15 text-white/70'}`}>
              <span className="ml-1">{index < stepIndex ? '✓' : STEP_EMOJI[item]}</span>{STEP_LABELS[item]}
            </div>
          ))}
        </div>
      </header>

      <div className="mb-5 h-2 rounded-full bg-gray-100 overflow-hidden"><motion.div className={`h-full bg-gradient-to-r ${learner.theme.gradient}`} animate={{ width: `${((completed + 1) / steps.length) * 100}%` }} /></div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          {step === 'build' && <BuildActivity learner={learner} lesson={lesson} onDone={finishStep} />}
          {step === 'write' && <WritingActivity learner={learner} lesson={lesson} onDone={finishStep} />}
          {step === 'draw' && <DrawingActivity learner={learner} lesson={lesson} onDone={finishStep} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
