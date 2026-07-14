/**
 * InteractiveTools.tsx
 * ─────────────────────────────────────────────────────────────────
 * Per-child interactive learning tools:
 *  • Noah  (7)  – LetterTrace: trace dotted Arabic letters with finger/mouse
 *  • Judy  (9)  – DrawCanvas:  free drawing board + color picker
 *  • Adam  (11) – WordScramble: unscramble Arabic/English words
 *  • Linda (13) – MindMap:     build a mind map by adding branches
 * ─────────────────────────────────────────────────────────────────
 */

import { ChildProfile } from '@/lib/children';
import { useSpeech } from '@/hooks/useSpeech';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight, Check, Eraser, Pen, RefreshCw, Shuffle, X, Plus, Minus
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  child: ChildProfile;
  onBack: () => void;
}

// ─── Router ──────────────────────────────────────────────────────
export default function InteractiveTools({ child, onBack }: Props) {
  if (child.id === 'noah') return <LetterTrace child={child} onBack={onBack} />;
  if (child.id === 'judy') return <DrawCanvas child={child} onBack={onBack} />;
  if (child.id === 'adam') return <WordScramble child={child} onBack={onBack} />;
  return <MindMap child={child} onBack={onBack} />;
}

// ═════════════════════════════════════════════════════════════════
// 1. LETTER TRACE — Noah (7)
//    Dotted letter shown → child traces it on canvas
// ═════════════════════════════════════════════════════════════════
const TRACE_LETTERS = [
  { ar: 'أ', name: 'ألف', example: 'أسد 🦁' },
  { ar: 'ب', name: 'باء', example: 'بيت 🏠' },
  { ar: 'ت', name: 'تاء', example: 'تفاح 🍎' },
  { ar: 'ج', name: 'جيم', example: 'جمل 🐪' },
  { ar: 'د', name: 'دال', example: 'دجاجة 🐔' },
  { ar: 'ر', name: 'راء', example: 'رمان 🍇' },
  { ar: 'س', name: 'سين', example: 'سمكة 🐟' },
  { ar: 'ن', name: 'نون', example: 'نجمة ⭐' },
];

function LetterTrace({ child, onBack }: { child: ChildProfile; onBack: () => void }) {
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const { speak } = useSpeech();

  const letter = TRACE_LETTERS[idx];

  useEffect(() => {
    speak(`اكتب حرف ${letter.name}، مثل كلمة ${letter.example.split(' ')[0]}`, { lang: 'ar', rate: 0.78 });
    clearCanvas();
  }, [idx]);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawing.current = true;
    const ctx = canvas.getContext('2d')!;
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#f97316';
    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDraw = () => { drawing.current = false; };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const markDone = () => {
    if (!completed.includes(idx)) setCompleted(p => [...p, idx]);
    speak('أحسنت! 🎉', { lang: 'ar', rate: 0.85 });
    setDone(true);
    setTimeout(() => {
      setDone(false);
      if (idx < TRACE_LETTERS.length - 1) setIdx(i => i + 1);
    }, 1200);
  };

  const progress = ((completed.length) / TRACE_LETTERS.length) * 100;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowRight className="w-5 h-5 text-gray-500" />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-black text-gray-900 arabic-text">✍️ تتبع الحروف</h2>
          <div className="h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
            <motion.div className={`h-full bg-gradient-to-r ${child.color} rounded-full`}
              animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>
        <span className="text-sm font-bold text-gray-400">{completed.length}/{TRACE_LETTERS.length}</span>
      </div>

      {/* Letter card */}
      <div className={`bg-gradient-to-br ${child.color} rounded-3xl p-5 text-center mb-4 shadow-xl`}>
        <p className="text-white/80 text-sm arabic-text mb-1">اكتب هذا الحرف 👇</p>
        {/* Dotted guide letter */}
        <div className="text-[120px] leading-none font-black mb-1 relative inline-block"
          style={{ WebkitTextStroke: '3px rgba(255,255,255,0.4)', color: 'transparent' }}>
          {letter.ar}
        </div>
        <p className="text-white text-lg font-bold arabic-text">{letter.name}</p>
        <p className="text-white/70 text-sm arabic-text mt-1">{letter.example}</p>
      </div>

      {/* Canvas */}
      <div className="bg-white rounded-2xl shadow-inner border-4 border-dashed border-orange-200 overflow-hidden mb-4">
        <canvas
          ref={canvasRef}
          width={360}
          height={200}
          className="w-full touch-none"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button onClick={clearCanvas}
          className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
          <Eraser className="w-4 h-4" />
          <span className="arabic-text">امسح</span>
        </button>
        <AnimatePresence>
          {done ? (
            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="flex-1 py-3 rounded-xl font-bold text-white bg-green-500 flex items-center justify-center gap-2">
              <Check className="w-5 h-5" />
              <span className="arabic-text">أحسنت! 🎉</span>
            </motion.div>
          ) : (
            <button onClick={markDone}
              className={`flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r ${child.color} shadow-md active:scale-95 transition-all flex items-center justify-center gap-2`}>
              <Check className="w-4 h-4" />
              <span className="arabic-text">انتهيت ✓</span>
            </button>
          )}
        </AnimatePresence>
      </div>

      {/* Letter dots */}
      <div className="flex justify-center gap-2 mt-4 flex-wrap">
        {TRACE_LETTERS.map((l, i) => (
          <button key={i} onClick={() => { setIdx(i); setDone(false); }}
            className={`w-9 h-9 rounded-lg text-base font-black transition-all
              ${i === idx ? `bg-gradient-to-br ${child.color} text-white shadow-md scale-110` :
              completed.includes(i) ? 'bg-green-100 text-green-700 border-2 border-green-400' :
              'bg-gray-100 text-gray-500'}`}>
            {l.ar}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════════
// 2. DRAW CANVAS — Judy (9)
//    Full-featured drawing board: colors, brush sizes, eraser, clear
// ═════════════════════════════════════════════════════════════════
const DRAW_COLORS = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#a855f7','#ec4899','#000000','#ffffff'];
const PROMPTS_JUDY = ['ارسم رياضيك المفضل 🏃','ارسم ملعب كرة القدم ⚽','ارسم بطلتك الرياضية 🏅','ارسم سباقاً سريعاً 🏁','ارسم شيئاً جميلاً اليوم 🎨'];

function DrawCanvas({ child, onBack }: { child: ChildProfile; onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const [color, setColor] = useState('#22c55e');
  const [size, setSize] = useState(6);
  const [erasing, setErasing] = useState(false);
  const [prompt] = useState(() => PROMPTS_JUDY[Math.floor(Math.random() * PROMPTS_JUDY.length)]);
  const { speak } = useSpeech();

  useEffect(() => {
    speak(prompt, { lang: 'ar', rate: 0.82 });
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    drawing.current = true;
    const canvas = canvasRef.current; if (!canvas) return;
    lastPos.current = getPos(e, canvas);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!drawing.current) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.lineWidth = erasing ? size * 4 : size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = erasing ? '#ffffff' : color;
    if (lastPos.current) { ctx.moveTo(lastPos.current.x, lastPos.current.y); }
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  };

  const stopDraw = () => { drawing.current = false; lastPos.current = null; };

  const clearCanvas = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Fill white on mount
  useEffect(() => { clearCanvas(); }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowRight className="w-5 h-5 text-gray-500" />
        </button>
        <h2 className="text-xl font-black text-gray-900 arabic-text">🎨 لوحة الرسم</h2>
      </div>

      {/* Prompt */}
      <div className={`bg-gradient-to-r ${child.color} rounded-2xl p-3 text-center text-white font-bold arabic-text mb-3 shadow-md`}>
        {prompt}
      </div>

      {/* Canvas */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100 mb-3">
        <canvas
          ref={canvasRef}
          width={480}
          height={300}
          className="w-full touch-none"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
        {/* Colors */}
        <div className="flex gap-2 flex-wrap justify-center mb-3">
          {DRAW_COLORS.map(c => (
            <button key={c} onClick={() => { setColor(c); setErasing(false); }}
              className={`w-8 h-8 rounded-full border-2 transition-all active:scale-90
                ${color === c && !erasing ? 'border-gray-800 scale-125 shadow-md' : 'border-gray-200'}`}
              style={{ backgroundColor: c }} />
          ))}
        </div>
        {/* Size + eraser + clear */}
        <div className="flex items-center gap-3">
          <button onClick={() => setSize(s => Math.max(2, s - 2))}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all">
            <Minus className="w-4 h-4" />
          </button>
          <div className="flex-1 flex items-center justify-center">
            <div className="rounded-full bg-gray-800 transition-all"
              style={{ width: size * 3, height: size * 3 }} />
          </div>
          <button onClick={() => setSize(s => Math.min(24, s + 2))}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all">
            <Plus className="w-4 h-4" />
          </button>
          <button onClick={() => setErasing(e => !e)}
            className={`p-2 rounded-lg transition-all ${erasing ? `bg-gradient-to-br ${child.color} text-white shadow-md` : 'bg-gray-100 hover:bg-gray-200'}`}>
            <Eraser className="w-4 h-4" />
          </button>
          <button onClick={clearCanvas}
            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════════
// 3. WORD SCRAMBLE — Adam (11)
//    Scrambled Arabic/English word → tap letters in correct order
// ═════════════════════════════════════════════════════════════════
const SCRAMBLE_WORDS = [
  { ar: 'اختراع',   en: 'Invention',   emoji: '💡', hint: 'شيء جديد يُصنع لأول مرة' },
  { ar: 'برمجة',    en: 'Coding',      emoji: '💻', hint: 'لغة التحدث مع الحاسوب' },
  { ar: 'روبوت',    en: 'Robot',       emoji: '🤖', hint: 'آلة تعمل وحدها' },
  { ar: 'مغناطيس',  en: 'Magnet',      emoji: '🧲', hint: 'يجذب المعادن' },
  { ar: 'كهرباء',   en: 'Electricity', emoji: '⚡', hint: 'تضيء المصابيح' },
  { ar: 'تلسكوب',   en: 'Telescope',   emoji: '🔭', hint: 'ينظر للنجوم' },
  { ar: 'مجهر',     en: 'Microscope',  emoji: '🔬', hint: 'يكبّر الصغير جداً' },
  { ar: 'غواصة',    en: 'Submarine',   emoji: '🤿', hint: 'تسبح تحت الماء' },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function WordScramble({ child, onBack }: { child: ChildProfile; onBack: () => void }) {
  const [wordIdx, setWordIdx] = useState(0);
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const { speak } = useSpeech();

  const word = SCRAMBLE_WORDS[wordIdx];
  const target = lang === 'ar' ? word.ar : word.en;

  const [tiles, setTiles] = useState<{ letter: string; id: number }[]>(() =>
    shuffle(target.split('').map((letter, i) => ({ letter, id: i })))
  );
  const [chosen, setChosen] = useState<{ letter: string; id: number }[]>([]);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const reset = useCallback((newTarget: string) => {
    setTiles(shuffle(newTarget.split('').map((letter, i) => ({ letter, id: i }))));
    setChosen([]);
    setStatus('idle');
  }, []);

  useEffect(() => {
    const t = lang === 'ar' ? word.ar : word.en;
    reset(t);
    speak(word.hint, { lang: 'ar', rate: 0.82 });
  }, [wordIdx, lang]);

  const pickTile = (tile: { letter: string; id: number }) => {
    if (status !== 'idle') return;
    setTiles(t => t.filter(t => t.id !== tile.id));
    const next = [...chosen, tile];
    setChosen(next);
    const built = next.map(t => t.letter).join('');
    if (built === target) {
      setStatus('correct');
      setScore(s => s + 1);
      speak('ممتاز! 🎉', { lang: 'ar', rate: 0.9 });
      setTimeout(() => {
        if (wordIdx < SCRAMBLE_WORDS.length - 1) { setWordIdx(i => i + 1); }
        else { setFinished(true); }
      }, 1000);
    } else if (built.length === target.length) {
      setStatus('wrong');
      speak('حاول مرة أخرى', { lang: 'ar', rate: 0.85 });
      setTimeout(() => {
        const t = lang === 'ar' ? word.ar : word.en;
        reset(t);
      }, 700);
    }
  };

  const removeLast = () => {
    if (chosen.length === 0 || status !== 'idle') return;
    const last = chosen[chosen.length - 1];
    setChosen(c => c.slice(0, -1));
    setTiles(t => [...t, last]);
  };

  if (finished) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm mx-auto text-center" dir="rtl">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-7xl mb-3">🏆</div>
          <h3 className="text-2xl font-black arabic-text text-gray-900 mb-2">أحسنت يا {child.nameAr}!</h3>
          <p className="text-gray-500 arabic-text mb-6">رتّبت {score} / {SCRAMBLE_WORDS.length} كلمة</p>
          <button onClick={() => { setWordIdx(0); setScore(0); setFinished(false); }}
            className={`w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r ${child.color} shadow-md`}>
            العب مجدداً ↺
          </button>
          <button onClick={onBack} className="w-full py-3 mt-2 rounded-xl font-semibold text-gray-500 hover:text-gray-700 arabic-text">
            العودة
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowRight className="w-5 h-5 text-gray-500" />
        </button>
        <h2 className="text-xl font-black text-gray-900 arabic-text">🔀 رتّب الكلمة</h2>
        <div className="mr-auto flex gap-2">
          {(['ar', 'en'] as const).map(l => (
            <button key={l} onClick={() => setLang(l)}
              className={`px-3 py-1 rounded-lg text-sm font-bold transition-all
                ${lang === l ? `bg-gradient-to-r ${child.color} text-white shadow` : 'bg-gray-100 text-gray-500'}`}>
              {l === 'ar' ? 'عربي' : 'English'}
            </button>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="flex justify-between text-xs text-gray-400 mb-1 arabic-text">
        <span>كلمة {wordIdx + 1} من {SCRAMBLE_WORDS.length}</span>
        <span>✅ {score} صحيحة</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
        <motion.div className={`h-full bg-gradient-to-r ${child.color} rounded-full`}
          animate={{ width: `${((wordIdx) / SCRAMBLE_WORDS.length) * 100}%` }} />
      </div>

      {/* Word card */}
      <div className={`bg-gradient-to-br ${child.color} rounded-3xl p-5 text-center mb-4 shadow-xl`}>
        <div className="text-6xl mb-2">{word.emoji}</div>
        <p className="text-white/80 text-sm arabic-text">{word.hint}</p>
      </div>

      {/* Answer slots */}
      <div className={`min-h-[56px] bg-white rounded-2xl border-2 p-3 flex gap-2 flex-wrap justify-center mb-3 shadow-inner transition-all
        ${status === 'correct' ? 'border-green-400 bg-green-50' : status === 'wrong' ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
        {chosen.map((t, i) => (
          <motion.button key={`c-${t.id}`}
            initial={{ scale: 0.5 }} animate={{ scale: 1 }}
            onClick={removeLast}
            className={`w-10 h-10 rounded-xl text-xl font-black flex items-center justify-center shadow-sm transition-all
              ${status === 'correct' ? 'bg-green-500 text-white' : status === 'wrong' ? 'bg-red-400 text-white' : `bg-gradient-to-br ${child.color} text-white`}`}>
            {t.letter}
          </motion.button>
        ))}
        {chosen.length === 0 && (
          <span className="text-gray-300 arabic-text text-sm self-center">اضغط على الأحرف بالترتيب الصحيح</span>
        )}
      </div>

      {/* Tile bank */}
      <div className="flex gap-2 flex-wrap justify-center">
        {tiles.map(t => (
          <motion.button key={`t-${t.id}`}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            whileTap={{ scale: 0.85 }}
            onClick={() => pickTile(t)}
            className="w-12 h-12 rounded-xl bg-white border-2 border-gray-200 text-xl font-black text-gray-800 shadow-sm hover:border-blue-300 hover:bg-blue-50 transition-all">
            {t.letter}
          </motion.button>
        ))}
      </div>

      {chosen.length > 0 && status === 'idle' && (
        <button onClick={removeLast}
          className="mt-3 w-full py-2 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 flex items-center justify-center gap-2">
          <X className="w-4 h-4" />
          <span className="arabic-text">احذف آخر حرف</span>
        </button>
      )}
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════════
// 4. MIND MAP — Linda (13)
//    Start with a central topic → add branches → add sub-branches
// ═════════════════════════════════════════════════════════════════
const MINDMAP_TOPICS = [
  'الضوء الشمسي', 'دورة المياه', 'الخلية الحية', 'النظام الشمسي', 'التطور والتكيّف',
];

interface MapNode {
  id: string;
  text: string;
  parentId: string | null;
  color: string;
}

const BRANCH_COLORS = [
  'bg-rose-100 border-rose-400 text-rose-800',
  'bg-blue-100 border-blue-400 text-blue-800',
  'bg-green-100 border-green-400 text-green-800',
  'bg-amber-100 border-amber-400 text-amber-800',
  'bg-purple-100 border-purple-400 text-purple-800',
  'bg-teal-100 border-teal-400 text-teal-800',
];

function MindMap({ child, onBack }: { child: ChildProfile; onBack: () => void }) {
  const [topic] = useState(() => MINDMAP_TOPICS[Math.floor(Math.random() * MINDMAP_TOPICS.length)]);
  const [nodes, setNodes] = useState<MapNode[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const { speak } = useSpeech();

  useEffect(() => {
    speak(`ابني خريطة ذهنية عن ${topic}، أضيفي أفكارك`, { lang: 'ar', rate: 0.82 });
  }, []);

  const rootNodes = nodes.filter(n => n.parentId === null);
  const childrenOf = (id: string) => nodes.filter(n => n.parentId === id);

  const addNode = (parentId: string | null) => {
    if (!draft.trim()) return;
    const colorIdx = parentId === null ? rootNodes.length % BRANCH_COLORS.length
      : nodes.findIndex(n => n.id === parentId) % BRANCH_COLORS.length;
    const node: MapNode = {
      id: Date.now().toString(),
      text: draft.trim(),
      parentId,
      color: BRANCH_COLORS[colorIdx],
    };
    setNodes(n => [...n, node]);
    setDraft('');
    setAddingTo(null);
  };

  const deleteNode = (id: string) => {
    // also remove all children recursively
    const toRemove = new Set<string>();
    const collect = (nid: string) => {
      toRemove.add(nid);
      nodes.filter(n => n.parentId === nid).forEach(n => collect(n.id));
    };
    collect(id);
    setNodes(n => n.filter(n => !toRemove.has(n.id)));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowRight className="w-5 h-5 text-gray-500" />
        </button>
        <h2 className="text-xl font-black text-gray-900 arabic-text">🧠 خريطة ذهنية</h2>
        <span className="text-sm text-gray-400 arabic-text mr-auto">{nodes.length} فكرة</span>
      </div>

      {/* Central topic */}
      <div className={`bg-gradient-to-br ${child.color} rounded-3xl p-5 text-center text-white mb-4 shadow-xl`}>
        <div className="text-3xl font-black arabic-text">{topic}</div>
        <p className="text-white/70 text-sm mt-1 arabic-text">الفكرة الرئيسية</p>
      </div>

      {/* Branches */}
      <div className="space-y-3 mb-4">
        <AnimatePresence>
          {rootNodes.map(node => (
            <motion.div key={node.id}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              {/* Branch */}
              <div className={`rounded-2xl border-2 p-3 ${node.color}`}>
                <div className="flex items-center gap-2">
                  <span className="flex-1 font-bold arabic-text">{node.text}</span>
                  <button onClick={() => setAddingTo(addingTo === node.id ? null : node.id)}
                    className="p-1 rounded-lg hover:bg-black/10 transition-all">
                    <Plus className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteNode(node.id)}
                    className="p-1 rounded-lg hover:bg-red-200 transition-all text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {/* Sub-branches */}
                {childrenOf(node.id).length > 0 && (
                  <div className="mt-2 mr-4 space-y-1">
                    {childrenOf(node.id).map(sub => (
                      <motion.div key={sub.id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="flex items-center gap-2 bg-white/60 rounded-xl px-3 py-1.5">
                        <span className="text-sm arabic-text flex-1">← {sub.text}</span>
                        <button onClick={() => deleteNode(sub.id)}
                          className="text-red-400 hover:text-red-600 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
                {/* Add sub-branch input */}
                {addingTo === node.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 flex gap-2">
                    <input
                      autoFocus
                      value={draft}
                      onChange={e => setDraft(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addNode(node.id)}
                      placeholder="أضيفي فكرة فرعية..."
                      className="flex-1 px-3 py-1.5 rounded-xl border border-gray-300 text-sm arabic-text outline-none focus:border-rose-400"
                    />
                    <button onClick={() => addNode(node.id)}
                      className="px-3 py-1.5 rounded-xl bg-rose-500 text-white text-sm font-bold">
                      <Check className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add main branch */}
      {addingTo === 'root' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
          <input
            autoFocus
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addNode(null)}
            placeholder="أضيفي فكرة رئيسية..."
            className="flex-1 px-4 py-3 rounded-xl border-2 border-rose-300 arabic-text outline-none focus:border-rose-500 text-base"
          />
          <button onClick={() => addNode(null)}
            className={`px-4 rounded-xl font-bold text-white bg-gradient-to-r ${child.color} shadow-md`}>
            <Check className="w-5 h-5" />
          </button>
          <button onClick={() => { setAddingTo(null); setDraft(''); }}
            className="px-3 rounded-xl bg-gray-100 hover:bg-gray-200">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </motion.div>
      ) : (
        <button onClick={() => { setAddingTo('root'); setDraft(''); }}
          className={`w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r ${child.color} shadow-md active:scale-95 transition-all flex items-center justify-center gap-2`}>
          <Plus className="w-5 h-5" />
          <span className="arabic-text">أضيفي فكرة جديدة</span>
        </button>
      )}

      {nodes.length > 0 && (
        <button onClick={() => setNodes([])}
          className="mt-3 w-full py-2 rounded-xl text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center gap-1">
          <RefreshCw className="w-4 h-4" />
          <span className="arabic-text">ابدأ من جديد</span>
        </button>
      )}
    </motion.div>
  );
}
