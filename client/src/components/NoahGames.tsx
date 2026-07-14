import { LearnerProfile } from '@/lib/familyCurriculum';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Star, Trophy, Zap } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────
type GameId = 'race' | 'memory' | 'sort' | 'park';

interface NoahGamesProps {
  learner: LearnerProfile;
  onBack: () => void;
  onXP: (amount: number) => void;
}

// ── Helpers ────────────────────────────────────────────────────────
function shuffleArr<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ── 1. Car Race Quiz ───────────────────────────────────────────────
const RACE_QUESTIONS = [
  { q: 'كم عجلة في سيارة واحدة؟', options: ['2', '4', '6', '3'], correct: 1 },
  { q: 'ماذا تعني الإشارة الحمراء؟', options: ['امشِ', 'قف', 'اسرع', 'تحوّل'], correct: 1 },
  { q: 'أي لون إشارة المرور يعني "امشِ"؟', options: ['أحمر', 'أصفر', 'أخضر', 'أزرق'], correct: 2 },
  { q: 'ما اسم السيارة التي تنقذ المرضى؟', options: ['شاحنة', 'إسعاف', 'حافلة', 'سباق'], correct: 1 },
  { q: 'كم سيارة: 🚗🚗🚗 + 🚗🚗 ؟', options: ['4', '6', '5', '3'], correct: 2 },
  { q: 'ما اسم الوقود الذي تسير به السيارات؟', options: ['ماء', 'بنزين', 'حليب', 'هواء'], correct: 1 },
  { q: '🚗×3 = ؟ سيارات', options: ['6', '9', '12', '3'], correct: 1 },
  { q: 'أي مركبة تطير في السماء؟', options: ['قطار', 'سفينة', 'طائرة', 'حافلة'], correct: 2 },
];

function CarRaceGame({ learner, onEarn, onBack }: { learner: LearnerProfile; onEarn: (n: number) => void; onBack: () => void }) {
  const [qIdx, setQIdx] = useState(0);
  const [carPos, setCarPos] = useState(0); // 0-100
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const questions = useRef(shuffleArr(RACE_QUESTIONS).slice(0, 6)).current;

  const pick = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    const correct = i === questions[qIdx].correct;
    if (correct) {
      const newScore = score + 1;
      setScore(newScore);
      setCarPos(p => Math.min(100, p + Math.round(100 / questions.length)));
    }
    setTimeout(() => {
      if (qIdx + 1 >= questions.length) {
        setDone(true);
        onEarn(score + (correct ? 1 : 0));
      } else {
        setQIdx(v => v + 1);
        setSelected(null);
      }
    }, 900);
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-3">{pct >= 80 ? '🏆' : pct >= 50 ? '🥈' : '🚗'}</div>
        <h2 className="text-2xl font-black text-gray-900 arabic-text mb-1">انتهى السباق!</h2>
        <p className="text-orange-600 font-bold arabic-text mb-4">{score}/{questions.length} إجابة صحيحة</p>
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center text-3xl font-black mb-6">{pct}%</div>
        <div className="flex gap-3 justify-center">
          <button onClick={onBack} className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold arabic-text">← العودة</button>
          <button onClick={() => { setQIdx(0); setCarPos(0); setSelected(null); setScore(0); setDone(false); }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black arabic-text">🔄 العب مجدداً</button>
        </div>
      </div>
    );
  }

  const q = questions[qIdx];
  return (
    <div dir="rtl">
      {/* Race track */}
      <div className="relative h-16 bg-gray-800 rounded-2xl overflow-hidden mb-5">
        <div className="absolute inset-0 flex items-center px-4">
          <div className="flex-1 h-1 border-t-2 border-dashed border-white/30" />
        </div>
        <motion.div animate={{ left: `${carPos}%` }} transition={{ type: 'spring', stiffness: 80 }}
          className="absolute top-1/2 -translate-y-1/2 text-3xl" style={{ left: `${carPos}%` }}>🏎️</motion.div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl">🏁</div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold text-orange-600 arabic-text">سؤال {qIdx + 1}/{questions.length}</span>
        <span className="text-sm font-bold text-gray-500 arabic-text">⭐ {score} نقطة</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
        <p className="text-xl font-black text-gray-900 arabic-text text-center leading-relaxed">{q.q}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {q.options.map((opt, i) => {
          const isCorrect = selected !== null && i === q.correct;
          const isWrong = selected === i && i !== q.correct;
          return (
            <button key={i} onClick={() => pick(i)} disabled={selected !== null}
              className={`min-h-[52px] rounded-xl border-2 font-black arabic-text text-base transition-all ${
                isCorrect ? 'bg-green-50 border-green-500 text-green-900 scale-105' :
                isWrong   ? 'bg-red-50 border-red-400 text-red-900' :
                selected !== null ? 'bg-gray-50 border-gray-200 text-gray-400' :
                'bg-white border-gray-200 hover:border-orange-400 hover:bg-orange-50'}`}>
              {isCorrect ? '✅ ' : isWrong ? '❌ ' : ''}{opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── 2. Car Memory Match ────────────────────────────────────────────
const MEMORY_CARDS = ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑'];

function CarMemoryGame({ onEarn, onBack }: { onEarn: (n: number) => void; onBack: () => void }) {
  const [cards] = useState(() => shuffleArr([...MEMORY_CARDS, ...MEMORY_CARDS].map((c, i) => ({ id: i, emoji: c, flipped: false, matched: false }))));
  const [board, setBoard] = useState(cards);
  const [open, setOpen] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);

  const flip = useCallback((id: number) => {
    const card = board.find(c => c.id === id);
    if (!card || card.flipped || card.matched || open.length === 2) return;

    const newOpen = [...open, id];
    setBoard(b => b.map(c => c.id === id ? { ...c, flipped: true } : c));
    setOpen(newOpen);

    if (newOpen.length === 2) {
      setMoves(m => m + 1);
      const [a, b2] = newOpen.map(i => board.find(c => c.id === i)!);
      if (a.emoji === b2.emoji) {
        setBoard(b => b.map(c => newOpen.includes(c.id) ? { ...c, matched: true } : c));
        setOpen([]);
        if (board.filter(c => c.matched).length + 2 === board.length) {
          setDone(true);
          onEarn(Math.max(1, 8 - Math.floor(moves / 4)));
        }
      } else {
        setTimeout(() => {
          setBoard(b => b.map(c => newOpen.includes(c.id) ? { ...c, flipped: false } : c));
          setOpen([]);
        }, 900);
      }
    }
  }, [board, open, moves, onEarn]);

  if (done) return (
    <div className="text-center py-8">
      <div className="text-6xl mb-3">🏆</div>
      <h2 className="text-2xl font-black text-gray-900 arabic-text mb-1">أكملت البطاقات!</h2>
      <p className="text-orange-600 font-bold arabic-text mb-6">{moves} حركة</p>
      <button onClick={onBack} className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black arabic-text">← العودة</button>
    </div>
  );

  return (
    <div dir="rtl">
      <div className="flex justify-between mb-4">
        <span className="text-sm font-bold text-gray-500 arabic-text">حركات: {moves}</span>
        <span className="text-sm font-bold text-orange-600 arabic-text">جدت {board.filter(c => c.matched).length / 2}/{MEMORY_CARDS.length} أزواج</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {board.map(card => (
          <motion.button key={card.id} onClick={() => flip(card.id)}
            whileTap={{ scale: 0.9 }}
            className={`aspect-square rounded-xl text-3xl flex items-center justify-center border-2 transition-all ${
              card.matched ? 'bg-green-50 border-green-300' :
              card.flipped ? 'bg-orange-50 border-orange-400' :
              'bg-gradient-to-br from-orange-500 to-amber-500 border-transparent'}`}>
            {card.flipped || card.matched ? card.emoji : '🚗'}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ── 3. Car Sort by Number ──────────────────────────────────────────
function CarSortGame({ onEarn, onBack }: { onEarn: (n: number) => void; onBack: () => void }) {
  const ITEMS = [
    { val: 1, label: '1 🚗' }, { val: 3, label: '3 🚗🚗🚗' },
    { val: 2, label: '2 🚗🚗' }, { val: 5, label: '5 🚗🚗🚗🚗🚗' },
    { val: 4, label: '4 🚗🚗🚗🚗' }, { val: 6, label: '6 🚗×6' },
  ];
  const [shuffled] = useState(() => shuffleArr(ITEMS));
  const [order, setOrder] = useState<typeof ITEMS>([]);
  const [done, setDone] = useState(false);
  const [correct, setCorrect] = useState<boolean | null>(null);

  const pick = (item: typeof ITEMS[0]) => {
    if (order.find(x => x.val === item.val)) return;
    const newOrder = [...order, item];
    setOrder(newOrder);
    if (newOrder.length === ITEMS.length) {
      const sorted = [...newOrder].every((x, i) => i === 0 || x.val > newOrder[i - 1].val);
      setCorrect(sorted);
      setDone(true);
      onEarn(sorted ? 3 : 1);
    }
  };

  const remaining = shuffled.filter(x => !order.find(o => o.val === x.val));

  if (done) return (
    <div className="text-center py-6">
      <div className="text-5xl mb-3">{correct ? '🏆' : '💡'}</div>
      <h2 className="text-xl font-black text-gray-900 arabic-text mb-1">{correct ? 'ترتيب مثالي!' : 'حاول مرة أخرى!'}</h2>
      <p className="text-sm text-gray-500 arabic-text mb-4">الترتيب الصحيح: {[...ITEMS].sort((a, b) => a.val - b.val).map(x => x.label).join(' ← ')}</p>
      <div className="flex gap-3 justify-center">
        <button onClick={onBack} className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold arabic-text">← العودة</button>
        <button onClick={() => { setOrder([]); setDone(false); setCorrect(null); }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black arabic-text">🔄 مجدداً</button>
      </div>
    </div>
  );

  return (
    <div dir="rtl">
      <p className="text-center text-gray-600 arabic-text mb-4 font-bold">رتّب السيارات من الأقل للأكثر 👇</p>
      <div className="min-h-[56px] flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 mb-4">
        {order.map((item, i) => (
          <motion.span key={item.val} initial={{ scale: 0.8 }} animate={{ scale: 1 }}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-sm arabic-text">
            {i + 1}. {item.label}
          </motion.span>
        ))}
        {order.length === 0 && <span className="text-gray-400 text-sm arabic-text self-center">اضغط الأرقام بالترتيب…</span>}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {remaining.map(item => (
          <button key={item.val} onClick={() => pick(item)}
            className="py-3 rounded-xl bg-white border-2 border-gray-200 font-black arabic-text hover:border-orange-400 hover:bg-orange-50 transition-all active:scale-95">
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── 4. Park the Car (tap at right moment) ─────────────────────────
function ParkCarGame({ onEarn, onBack }: { onEarn: (n: number) => void; onBack: () => void }) {
  const [pos, setPos] = useState(0); // 0-100
  const [dir, setDir] = useState(1);
  const [parked, setParked] = useState<'perfect' | 'good' | 'miss' | null>(null);
  const [round, setRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const TOTAL_ROUNDS = 5;
  const SPEED = round <= 2 ? 0.8 : round <= 4 ? 1.4 : 2.0;

  useEffect(() => {
    if (parked) return;
    const id = setInterval(() => {
      setPos(p => {
        const next = p + dir * SPEED;
        if (next >= 100 || next <= 0) setDir(d => -d);
        return Math.min(100, Math.max(0, next));
      });
    }, 16);
    return () => clearInterval(id);
  }, [dir, parked, SPEED]);

  const tap = () => {
    if (parked) return;
    const dist = Math.abs(pos - 50);
    const result: 'perfect' | 'good' | 'miss' = dist <= 5 ? 'perfect' : dist <= 15 ? 'good' : 'miss';
    const earned = result === 'perfect' ? 3 : result === 'good' ? 1 : 0;
    setParked(result);
    setTotalScore(s => s + earned);

    setTimeout(() => {
      if (round >= TOTAL_ROUNDS) {
        onEarn(totalScore + earned);
      } else {
        setRound(r => r + 1);
        setPos(0);
        setDir(1);
        setParked(null);
      }
    }, 1000);
  };

  const isDone = parked !== null && round >= TOTAL_ROUNDS;

  if (isDone) return (
    <div className="text-center py-8">
      <div className="text-6xl mb-3">🅿️</div>
      <h2 className="text-2xl font-black text-gray-900 arabic-text mb-1">أحسنت يا سائق!</h2>
      <p className="text-orange-600 font-bold arabic-text mb-6">مجموع النقاط: {totalScore}/{TOTAL_ROUNDS * 3}</p>
      <button onClick={onBack} className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black arabic-text">← العودة</button>
    </div>
  );

  return (
    <div dir="rtl" className="text-center">
      <div className="flex justify-between mb-3">
        <span className="text-sm font-bold text-orange-600 arabic-text">جولة {round}/{TOTAL_ROUNDS}</span>
        <span className="text-sm font-bold text-gray-500 arabic-text">⭐ {totalScore} نقطة</span>
      </div>
      <p className="text-gray-600 arabic-text mb-4 font-bold">اضغط عندما تصل السيارة للمربع 🟩</p>

      {/* Track */}
      <div className="relative h-20 bg-gray-800 rounded-2xl overflow-hidden mb-4">
        <div className="absolute inset-0 flex items-center">
          <div className="flex-1 h-1 border-t-2 border-dashed border-white/20 mx-4" />
        </div>
        {/* Parking zone */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-12 border-2 border-green-400 rounded-lg bg-green-400/20 flex items-center justify-center">
          <span className="text-green-400 text-xs font-bold">P</span>
        </div>
        <motion.div animate={{ left: `${pos}%` }} transition={{ duration: 0 }}
          className="absolute top-1/2 -translate-y-1/2 text-3xl" style={{ left: `${pos}%`, transform: 'translate(-50%, -50%)' }}>
          🚗
        </motion.div>
      </div>

      <AnimatePresence>
        {parked && (
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className={`text-lg font-black arabic-text mb-3 ${parked === 'perfect' ? 'text-green-600' : parked === 'good' ? 'text-orange-600' : 'text-red-500'}`}>
            {parked === 'perfect' ? '🎯 مثالي! +3' : parked === 'good' ? '👍 جيد! +1' : '❌ حاول مجدداً'}
          </motion.p>
        )}
      </AnimatePresence>

      <button onClick={tap} disabled={!!parked}
        className="w-full min-h-[64px] rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-2xl font-black shadow-lg active:scale-95 transition-transform disabled:opacity-50">
        🅿️ اركن السيارة!
      </button>
    </div>
  );
}

// ── Main NoahGames ─────────────────────────────────────────────────
const GAMES: { id: GameId; title: string; desc: string; emoji: string; xp: string }[] = [
  { id: 'race',   title: 'سباق الأسئلة',    desc: 'أجب صح وسيارتك تتقدم!',   emoji: '🏎️', xp: '+2 XP لكل إجابة' },
  { id: 'memory', title: 'بطاقات السيارات',  desc: 'طابق كل سيارتين متشابهتين', emoji: '🃏', xp: '+5 XP عند الإكمال' },
  { id: 'sort',   title: 'رتّب السيارات',    desc: 'رتّبها من الأقل للأكثر',   emoji: '🔢', xp: '+3 XP للترتيب الصحيح' },
  { id: 'park',   title: 'اركن السيارة',     desc: 'اضغط في الوقت الصحيح!',   emoji: '🅿️', xp: '+3 XP للإيقاف المثالي' },
];

export default function NoahGames({ learner, onBack, onXP }: NoahGamesProps) {
  const [active, setActive] = useState<GameId | null>(null);
  const [totalEarned, setTotalEarned] = useState(0);
  const [flash, setFlash] = useState('');

  const earn = (n: number) => {
    const bonus = n * 2; // نوح يحصل على XP مضاعف!
    setTotalEarned(t => t + bonus);
    onXP(bonus);
    setFlash(`+${bonus} XP 🎉`);
    setTimeout(() => setFlash(''), 1800);
  };

  return (
    <div className="max-w-lg mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 arabic-text">
          <ArrowRight className="w-5 h-5" /> العودة
        </button>
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {flash && (
              <motion.span key={flash} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-orange-600 font-black text-sm arabic-text">{flash}</motion.span>
            )}
          </AnimatePresence>
          <span className="text-sm font-bold text-gray-500 arabic-text">
            <Star className="w-4 h-4 inline text-amber-500" /> {totalEarned} XP مكسوب
          </span>
        </div>
      </div>

      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 text-white p-5 mb-6 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🏎️</span>
          <div>
            <h1 className="text-xl font-black arabic-text">ألعاب نوح</h1>
            <p className="text-white/80 text-sm arabic-text">XP مضاعف لأنك بطل السيارات! ⚡×2</p>
          </div>
          <div className="mr-auto flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
            <Trophy className="w-4 h-4" />
            <span className="font-black text-sm">{totalEarned}</span>
          </div>
        </div>
      </div>

      {/* Game screen */}
      {active ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{GAMES.find(g => g.id === active)?.emoji}</span>
            <h2 className="text-lg font-black text-gray-900 arabic-text">{GAMES.find(g => g.id === active)?.title}</h2>
            <span className="mr-auto flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full arabic-text">
              <Zap className="w-3 h-3" /> {GAMES.find(g => g.id === active)?.xp}
            </span>
          </div>

          {active === 'race'   && <CarRaceGame   learner={learner} onEarn={earn} onBack={() => setActive(null)} />}
          {active === 'memory' && <CarMemoryGame onEarn={earn} onBack={() => setActive(null)} />}
          {active === 'sort'   && <CarSortGame   onEarn={earn} onBack={() => setActive(null)} />}
          {active === 'park'   && <ParkCarGame   onEarn={earn} onBack={() => setActive(null)} />}
        </div>
      ) : (
        /* Game selection grid */
        <div className="grid grid-cols-2 gap-3">
          {GAMES.map(game => (
            <motion.button key={game.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setActive(game.id)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md p-5 text-right flex flex-col gap-2">
              <div className="text-4xl">{game.emoji}</div>
              <h3 className="font-black text-gray-900 arabic-text text-sm">{game.title}</h3>
              <p className="text-xs text-gray-500 arabic-text leading-relaxed">{game.desc}</p>
              <span className="text-xs font-bold text-orange-600 arabic-text mt-auto">{game.xp}</span>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
