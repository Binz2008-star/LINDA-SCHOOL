import InteractiveTools from '@/components/InteractiveTools';
import { LessonView } from '@/components/LessonView';
import NoahGames from '@/components/NoahGames';
import { ChildProfile } from '@/lib/children';
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
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Gamepad2,
  Gift,
  Home,
  Lock,
  LogOut,
  Settings,
  ShieldCheck,
  Sparkles,
  Trophy
} from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';

// Adapts LearnerProfile (familyCurriculum) → ChildProfile (InteractiveTools / children.ts)
function learnerToChildProfile(learner: LearnerProfile): ChildProfile {
  return {
    id: learner.id as ChildProfile['id'],
    nameAr: learner.nameAr,
    nameEn: learner.nameEn,
    age: learner.age,
    photo: learner.photo,
    emoji: learner.emoji,
    interest: learner.interestAr,
    interestEn: learner.interestEn,
    interestEmoji: learner.interestEmoji,
    color: learner.theme.gradient,
    colorLight: learner.theme.light,
    colorBorder: learner.theme.border,
    colorText: learner.theme.text,
    colorRing: learner.theme.ring,
    gradeLevel: learner.id === 'linda' ? 6 : learner.id === 'adam' ? 4 : learner.id === 'judy' ? 3 : 1,
    difficulty: learner.id === 'linda' ? 'hard' : learner.id === 'adam' ? 'medium' : 'easy',
    dadToneAr: '',
    dadToneEn: '',
    storageKey: learner.id,
    pin: '',
    rewardType: 'coins',
  };
}

interface LessonResult {
  correct: number;
  total: number;
  completedAt: string;
}

interface ProgressState {
  completed: Record<string, LessonResult>;
  lastStudied?: string;
  bonusXP?: number;
  bonusCoins?: number;
}

interface SecurityConfig {
  version: 1;
  salt: string;
  parentHash: string;
  childHashes: Record<LearnerId, string>;
}

type RewardStatus = 'pending' | 'approved' | 'declined';

interface RewardRequest {
  id: string;
  learnerId: LearnerId;
  rewardId: string;
  label: string;
  cost: number;
  status: RewardStatus;
  createdAt: string;
  decidedAt?: string;
}

interface RewardItem {
  id: string;
  label: string;
  description: string;
  cost: number;
  emoji: string;
}

const SUBJECT_ORDER: SubjectId[] = ['arabic', 'english', 'math', 'science', 'life', 'interest'];
const SECURITY_KEY = 'family_school_security_v1';
const REWARDS_KEY = 'family_school_reward_requests_v1';
const LOCK_PREFIX = 'family_school_lock_v1_';
const EMPTY_PROGRESS: ProgressState = { completed: {} };
const EMPTY_PINS: Record<LearnerId, string> = { linda: '', adam: '', judy: '', noah: '' };

const REWARD_CATALOGUE: RewardItem[] = [
  {
    id: 'family-choice',
    label: 'اختيار فيلم أو نشاط عائلي',
    description: 'مكافأة منزلية بسيطة يوافق عليها بابا.',
    cost: 200,
    emoji: '🎬',
  },
  {
    id: 'small-coupon',
    label: 'طلب كوبون Noon أو SHEIN بقيمة صغيرة',
    description: 'طلب بقيمة يحددها بابا حسب الميزانية.',
    cost: 450,
    emoji: '🛍️',
  },
  {
    id: 'game-card',
    label: 'طلب بطاقة Robux أو V-Bucks صغيرة',
    description: 'بابا يختار النوع والقيمة بعد الموافقة.',
    cost: 700,
    emoji: '🎮',
  },
  {
    id: 'special-coupon',
    label: 'طلب كوبون تسوق مميز',
    description: 'مكافأة أكبر بعد استمرار حقيقي في التعلم.',
    cost: 1100,
    emoji: '🎁',
  },
];

function progressKey(learnerId: LearnerId): string {
  return `${learnerId}_family_school_v2`;
}

function loadProgress(learnerId: LearnerId): ProgressState {
  try {
    const raw = localStorage.getItem(progressKey(learnerId));
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return { completed: parsed.completed ?? {}, lastStudied: parsed.lastStudied };
  } catch {
    return EMPTY_PROGRESS;
  }
}

function saveProgress(learnerId: LearnerId, progress: ProgressState): void {
  try {
    localStorage.setItem(progressKey(learnerId), JSON.stringify(progress));
  } catch {
    // The school remains usable if storage is temporarily unavailable.
  }
}

function loadSecurity(): SecurityConfig | null {
  try {
    const raw = localStorage.getItem(SECURITY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SecurityConfig;
    if (!parsed.parentHash || !parsed.salt || !parsed.childHashes) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveSecurity(config: SecurityConfig): void {
  localStorage.setItem(SECURITY_KEY, JSON.stringify(config));
}

function loadRequests(): RewardRequest[] {
  try {
    const raw = localStorage.getItem(REWARDS_KEY);
    return raw ? (JSON.parse(raw) as RewardRequest[]) : [];
  } catch {
    return [];
  }
}

function saveRequests(requests: RewardRequest[]): void {
  localStorage.setItem(REWARDS_KEY, JSON.stringify(requests));
}

function createSalt(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

async function hashPin(pin: string, salt: string, scope: string): Promise<string> {
  const value = `${salt}:${scope}:${pin}`;
  if (crypto.subtle) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
    return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
  }

  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fallback-${(hash >>> 0).toString(16)}`;
}

async function verifyPin(config: SecurityConfig, scope: 'parent' | LearnerId, pin: string): Promise<boolean> {
  const expected = scope === 'parent' ? config.parentHash : config.childHashes[scope];
  return (await hashPin(pin, config.salt, scope)) === expected;
}

function getLockUntil(learnerId: LearnerId): number {
  const value = Number(localStorage.getItem(`${LOCK_PREFIX}${learnerId}`) ?? 0);
  return Number.isFinite(value) ? value : 0;
}

function setLockUntil(learnerId: LearnerId, value: number): void {
  localStorage.setItem(`${LOCK_PREFIX}${learnerId}`, String(value));
}

function calculateStats(progress: ProgressState) {
  const results = Object.values(progress.completed);
  const completedLessons = results.length;
  const correctAnswers = results.reduce((sum, result) => sum + result.correct, 0);
  const perfectLessons = results.filter(result => result.total > 0 && result.correct === result.total).length;
  const xp = completedLessons * 100 + correctAnswers * 25 + (progress.bonusXP ?? 0);
  const level = 1 + Math.floor(xp / 300);
  const earnedCoins = completedLessons * 20 + perfectLessons * 5 + (progress.bonusCoins ?? 0);
  return { completedLessons, correctAnswers, perfectLessons, xp, level, earnedCoins };
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
          event.currentTarget.style.display = 'none';
          const fallback = event.currentTarget.nextElementSibling as HTMLElement | null;
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

function SetupScreen({ onComplete }: { onComplete: (config: SecurityConfig) => void }) {
  const [parentPin, setParentPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [childPins, setChildPins] = useState<Record<LearnerId, string>>(EMPTY_PINS);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!/^\d{6}$/.test(parentPin)) return setError('رمز الأب يجب أن يكون 6 أرقام.');
    if (parentPin !== confirmPin) return setError('تأكيد رمز الأب غير مطابق.');
    if (LEARNER_ORDER.some(id => !/^\d{4}$/.test(childPins[id]))) {
      return setError('كل طفل يحتاج رمزاً مختلفاً من 4 أرقام.');
    }
    if (new Set(Object.values(childPins)).size !== LEARNER_ORDER.length) {
      return setError('استخدم رمزاً مختلفاً لكل طفل حتى لا يعرفوا رموز بعضهم.');
    }

    setSaving(true);
    const salt = createSalt();
    const childHashes = {} as Record<LearnerId, string>;
    for (const id of LEARNER_ORDER) childHashes[id] = await hashPin(childPins[id], salt, id);
    const config: SecurityConfig = {
      version: 1,
      salt,
      parentHash: await hashPin(parentPin, salt, 'parent'),
      childHashes,
    };
    saveSecurity(config);
    setSaving(false);
    onComplete(config);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 px-4 py-10" dir="rtl">
      <form onSubmit={submit} className="max-w-2xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-xl p-6 md:p-9">
        <div className="text-center mb-7">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-3"><ShieldCheck className="w-9 h-9" /></div>
          <h1 className="text-3xl font-black text-gray-900 arabic-text">حماية حسابات الأطفال</h1>
          <p className="text-gray-600 mt-3 leading-relaxed arabic-text">
            هذه الخطوة يقوم بها الأب مرة واحدة على هذا الجهاز. الرموز لا تُحفظ كنص واضح داخل الموقع أو GitHub.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <label className="block">
            <span className="text-sm font-bold text-gray-700 arabic-text">رمز الأب — 6 أرقام</span>
            <input value={parentPin} onChange={event => setParentPin(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" type="password" className="mt-2 w-full rounded-xl border-2 border-gray-200 p-3 text-center text-xl tracking-[0.4em] focus:border-blue-400 outline-none" />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-gray-700 arabic-text">تأكيد رمز الأب</span>
            <input value={confirmPin} onChange={event => setConfirmPin(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" type="password" className="mt-2 w-full rounded-xl border-2 border-gray-200 p-3 text-center text-xl tracking-[0.4em] focus:border-blue-400 outline-none" />
          </label>
        </div>

        <h2 className="font-black text-gray-900 arabic-text mb-3">رمز مختلف لكل طفل</h2>
        <div className="grid grid-cols-2 gap-4">
          {LEARNER_ORDER.map(id => {
            const learner = LEARNERS[id];
            return (
              <label key={id} className={`rounded-2xl border-2 ${learner.theme.border} ${learner.theme.light} p-4`}>
                <div className="flex items-center gap-2 mb-3"><span className="text-2xl">{learner.emoji}</span><span className={`font-black ${learner.theme.text} arabic-text`}>{learner.nameAr}</span></div>
                <input value={childPins[id]} onChange={event => setChildPins(current => ({ ...current, [id]: event.target.value.replace(/\D/g, '').slice(0, 4) }))} inputMode="numeric" type="password" placeholder="••••" className="w-full rounded-xl border-2 border-white bg-white/90 p-3 text-center text-xl tracking-[0.45em] outline-none" />
              </label>
            );
          })}
        </div>

        {error && <p className="mt-5 rounded-xl bg-red-50 border border-red-200 p-3 text-red-700 text-sm arabic-text">{error}</p>}
        <button disabled={saving} className="mt-6 w-full min-h-[52px] rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black arabic-text disabled:opacity-60">
          {saving ? 'يتم حفظ الحماية...' : 'حفظ الرموز وفتح المدرسة'}
        </button>
        <p className="text-xs text-gray-500 text-center mt-3 arabic-text">الحماية الحالية خاصة بهذا المتصفح والجهاز لأن تقدم الأطفال محفوظ محلياً.</p>
      </form>
    </div>
  );
}

function PinPad({
  title,
  subtitle,
  length,
  onSubmit,
  onBack,
}: {
  title: string;
  subtitle: string;
  length: number;
  onSubmit: (pin: string) => Promise<{ ok: boolean; message?: string }>;
  onBack: () => void;
}) {
  const [pin, setPin] = useState('');
  const [message, setMessage] = useState('');
  const [checking, setChecking] = useState(false);
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

  const press = async (digit: string) => {
    if (checking) return;
    if (digit === '⌫') {
      setPin(value => value.slice(0, -1));
      setMessage('');
      return;
    }
    if (!digit || pin.length >= length) return;
    const next = `${pin}${digit}`;
    setPin(next);
    if (next.length !== length) return;
    setChecking(true);
    const result = await onSubmit(next);
    setChecking(false);
    if (!result.ok) {
      setMessage(result.message ?? 'الرمز غير صحيح.');
      setTimeout(() => setPin(''), 350);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-10 flex items-center justify-center" dir="rtl">
      <div className="w-full max-w-xs">
        <button onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-gray-600 arabic-text"><ArrowRight className="w-5 h-5" /> رجوع</button>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4"><Lock className="w-8 h-8" /></div>
          <h1 className="text-2xl font-black text-gray-900 arabic-text">{title}</h1>
          <p className="text-sm text-gray-500 mt-2 arabic-text">{subtitle}</p>
          <div className="flex justify-center gap-3 my-6">
            {Array.from({ length }).map((_, index) => <span key={index} className={`w-4 h-4 rounded-full border-2 ${pin.length > index ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`} />)}
          </div>
          {message && <p className="text-sm text-red-600 mb-3 arabic-text">{message}</p>}
          <div className="grid grid-cols-3 gap-3">
            {digits.map((digit, index) => digit ? (
              <button key={`${digit}-${index}`} type="button" onClick={() => press(digit)} className="h-14 rounded-2xl bg-gray-50 border-2 border-gray-200 text-xl font-black text-gray-800 active:scale-95 transition-transform">
                {digit}
              </button>
            ) : <div key={index} />)}
          </div>
          {checking && <p className="text-xs text-blue-600 mt-4 arabic-text">يتم التحقق...</p>}
        </div>
      </div>
    </div>
  );
}

function AccessGate({
  config,
  onChild,
  onParent,
}: {
  config: SecurityConfig;
  onChild: (id: LearnerId) => void;
  onParent: () => void;
}) {
  const [selected, setSelected] = useState<LearnerId | null>(null);
  const [parentMode, setParentMode] = useState(false);
  const [attempts, setAttempts] = useState<Record<LearnerId, number>>({ linda: 0, adam: 0, judy: 0, noah: 0 });

  if (parentMode) {
    return <PinPad title="لوحة الأب" subtitle="أدخل رمز الأب لإدارة الرموز والمكافآت" length={6} onBack={() => setParentMode(false)} onSubmit={async pin => {
      const ok = await verifyPin(config, 'parent', pin);
      if (ok) onParent();
      return { ok, message: 'رمز الأب غير صحيح.' };
    }} />;
  }

  if (selected) {
    const learner = LEARNERS[selected];
    return <PinPad title={`أهلاً يا ${learner.nameAr}`} subtitle="أدخل رمزك الخاص لحماية تقدمك ومكافآتك" length={4} onBack={() => setSelected(null)} onSubmit={async pin => {
      const lockUntil = getLockUntil(selected);
      if (lockUntil > Date.now()) {
        const seconds = Math.ceil((lockUntil - Date.now()) / 1000);
        return { ok: false, message: `الحساب مقفل مؤقتاً. حاول بعد ${seconds} ثانية.` };
      }
      const ok = await verifyPin(config, selected, pin);
      if (ok) {
        setLockUntil(selected, 0);
        onChild(selected);
        return { ok: true };
      }
      const next = attempts[selected] + 1;
      setAttempts(current => ({ ...current, [selected]: next }));
      if (next >= 4) {
        setLockUntil(selected, Date.now() + 2 * 60 * 1000);
        setAttempts(current => ({ ...current, [selected]: 0 }));
        return { ok: false, message: 'محاولات كثيرة. تم قفل الحساب لدقيقتين.' };
      }
      return { ok: false, message: `رمز غير صحيح. بقيت ${4 - next} محاولات.` };
    }} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4 py-10 flex items-center justify-center" dir="rtl">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏠📚</div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 arabic-text">مدرستنا العائلية</h1>
          <p className="mt-3 text-gray-600 arabic-text">اختر حسابك، ثم أدخل رمزك الخاص. لا يستطيع أي طفل تغيير تقدم طفل آخر.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:gap-5">
          {LEARNER_ORDER.map((id, index) => {
            const learner = LEARNERS[id];
            const stats = calculateStats(loadProgress(id));
            return (
              <motion.button key={id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }} onClick={() => setSelected(id)} className={`relative rounded-3xl border-2 ${learner.theme.border} ${learner.theme.light} p-5 text-center shadow-sm hover:shadow-lg transition-all`}>
                <Lock className={`absolute top-3 left-3 w-4 h-4 ${learner.theme.text}`} />
                <div className="flex justify-center mb-3"><ChildAvatar learner={learner} /></div>
                <h2 className={`text-2xl font-black ${learner.theme.text} arabic-text`}>{learner.nameAr}</h2>
                <p className="text-xs text-gray-500 mt-1 arabic-text">المستوى {stats.level} • {stats.earnedCoins} عملة</p>
              </motion.button>
            );
          })}
        </div>
        <button onClick={() => setParentMode(true)} className="mt-7 mx-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 shadow-sm arabic-text"><Settings className="w-4 h-4" /> لوحة الأب</button>
      </div>
    </div>
  );
}

function ParentPanel({
  config,
  onConfig,
  requests,
  onRequests,
  onClose,
}: {
  config: SecurityConfig;
  onConfig: (config: SecurityConfig) => void;
  requests: RewardRequest[];
  onRequests: (requests: RewardRequest[]) => void;
  onClose: () => void;
}) {
  const [newPins, setNewPins] = useState<Record<LearnerId, string>>(EMPTY_PINS);
  const [message, setMessage] = useState('');
  const pending = requests.filter(request => request.status === 'pending');

  const decide = (id: string, status: 'approved' | 'declined') => {
    const next = requests.map(request => request.id === id ? { ...request, status, decidedAt: new Date().toISOString() } : request);
    saveRequests(next);
    onRequests(next);
  };

  const changePin = async (id: LearnerId) => {
    const pin = newPins[id];
    if (!/^\d{4}$/.test(pin)) return setMessage(`رمز ${LEARNERS[id].nameAr} يجب أن يكون 4 أرقام.`);
    const next = { ...config, childHashes: { ...config.childHashes, [id]: await hashPin(pin, config.salt, id) } };
    saveSecurity(next);
    onConfig(next);
    setNewPins(current => ({ ...current, [id]: '' }));
    setMessage(`تم تغيير رمز ${LEARNERS[id].nameAr}.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <button onClick={onClose} className="mb-5 flex items-center gap-2 text-gray-600 arabic-text"><ArrowRight className="w-5 h-5" /> إغلاق لوحة الأب</button>
        <div className="rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-6 md:p-8 shadow-xl mb-6">
          <div className="flex items-center gap-4"><ShieldCheck className="w-10 h-10" /><div><h1 className="text-3xl font-black arabic-text">لوحة الأب</h1><p className="text-white/80 mt-1 arabic-text">إدارة الرموز والموافقة على المكافآت الحقيقية</p></div></div>
        </div>

        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="text-xl font-black text-gray-900 arabic-text mb-4">طلبات المكافآت المعلقة</h2>
          {pending.length === 0 ? <p className="text-gray-500 arabic-text">لا توجد طلبات معلقة.</p> : <div className="space-y-3">{pending.map(request => {
            const learner = LEARNERS[request.learnerId];
            return <div key={request.id} className={`rounded-2xl border ${learner.theme.border} ${learner.theme.light} p-4 flex flex-col sm:flex-row sm:items-center gap-3`}>
              <div className="flex-1"><p className={`font-black ${learner.theme.text} arabic-text`}>{learner.nameAr}: {request.label}</p><p className="text-xs text-gray-500 mt-1 arabic-text">التكلفة: {request.cost} عملة تعليمية</p></div>
              <div className="flex gap-2"><button onClick={() => decide(request.id, 'approved')} className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-bold arabic-text">موافقة</button><button onClick={() => decide(request.id, 'declined')} className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 text-sm font-bold arabic-text">رفض</button></div>
            </div>;
          })}</div>}
          <p className="mt-4 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3 arabic-text">الموافقة داخل التطبيق لا تشتري شيئاً تلقائياً. أنت تشتري البطاقة أو الكوبون بنفسك عندما يناسبك.</p>
        </section>

        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="text-xl font-black text-gray-900 arabic-text mb-4 flex items-center gap-2">🪙 منح عملات إضافية لطفل</h2>
          <p className="text-sm text-gray-500 arabic-text mb-4">استخدم هذا لتعويض عملات مفقودة أو منح مكافأة خاصة. العملات تُضاف للرصيد الحالي.</p>
          <div className="grid sm:grid-cols-2 gap-4">{LEARNER_ORDER.map(id => {
            const learner = LEARNERS[id];
            const prog = loadProgress(id);
            const stats = calculateStats(prog);
            return <div key={id} className={`rounded-2xl border ${learner.theme.border} ${learner.theme.light} p-4`}>
              <p className={`font-black ${learner.theme.text} arabic-text mb-1`}>{learner.emoji} {learner.nameAr}</p>
              <p className="text-xs text-gray-500 arabic-text mb-3">رصيده الحالي: {stats.earnedCoins} عملة</p>
              {[50, 100, 200].map(amount => (
                <button key={amount} onClick={() => {
                  const current = loadProgress(id);
                  const updated: ProgressState = { ...current, bonusCoins: (current.bonusCoins ?? 0) + amount };
                  saveProgress(id, updated);
                  setMessage(`✅ تم منح ${learner.nameAr} ${amount} عملة إضافية.`);
                }} className={`ml-2 mb-2 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-sm font-bold arabic-text hover:border-amber-400`}>+{amount}</button>
              ))}
            </div>;
          })}</div>
          {message && <p className="mt-3 text-sm text-green-700 bg-green-50 rounded-xl p-3 arabic-text">{message}</p>}
        </section>

        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-xl font-black text-gray-900 arabic-text mb-4">تغيير رمز طفل</h2>
          <div className="grid sm:grid-cols-2 gap-4">{LEARNER_ORDER.map(id => {
            const learner = LEARNERS[id];
            return <div key={id} className={`rounded-2xl border ${learner.theme.border} ${learner.theme.light} p-4`}><p className={`font-black ${learner.theme.text} arabic-text mb-3`}>{learner.emoji} {learner.nameAr}</p><div className="flex gap-2"><input value={newPins[id]} onChange={event => setNewPins(current => ({ ...current, [id]: event.target.value.replace(/\D/g, '').slice(0, 4) }))} inputMode="numeric" type="password" placeholder="رمز جديد" className="min-w-0 flex-1 rounded-xl border-2 border-white bg-white p-2.5 text-center outline-none" /><button onClick={() => changePin(id)} className="px-3 rounded-xl bg-white border border-gray-200 text-sm font-bold arabic-text">حفظ</button></div></div>;
          })}</div>
          {message && <p className="mt-4 text-sm text-blue-700 arabic-text">{message}</p>}
        </section>
      </div>
    </div>
  );
}

function RewardsView({
  learner,
  progress,
  requests,
  onRequests,
  onBack,
}: {
  learner: LearnerProfile;
  progress: ProgressState;
  requests: RewardRequest[];
  onRequests: (requests: RewardRequest[]) => void;
  onBack: () => void;
}) {
  const stats = calculateStats(progress);
  const learnerRequests = requests.filter(request => request.learnerId === learner.id);
  const reserved = learnerRequests.filter(request => request.status !== 'declined').reduce((sum, request) => sum + request.cost, 0);
  const available = Math.max(0, stats.earnedCoins - reserved);
  const [message, setMessage] = useState('');

  const requestReward = (item: RewardItem) => {
    if (available < item.cost) return;
    const next: RewardRequest[] = [{ id: `${learner.id}-${Date.now()}`, learnerId: learner.id, rewardId: item.id, label: item.label, cost: item.cost, status: 'pending', createdAt: new Date().toISOString() }, ...requests];
    saveRequests(next);
    onRequests(next);
    setMessage('تم إرسال الطلب إلى بابا. العملات محجوزة حتى يوافق أو يرفض.');
  };

  return (
    <div className="max-w-3xl mx-auto" dir="rtl">
      <button onClick={onBack} className="mb-5 flex items-center gap-2 text-gray-600 arabic-text"><ArrowRight className="w-5 h-5" /> العودة للمدرسة</button>
      <div className={`rounded-3xl bg-gradient-to-r ${learner.theme.gradient} text-white p-7 shadow-xl mb-6`}><div className="flex items-center gap-4"><Gift className="w-10 h-10" /><div><h1 className="text-3xl font-black arabic-text">مكافآت {learner.nameAr}</h1><p className="text-white/85 mt-1 arabic-text">متاح الآن: {available} عملة • المستوى {stats.level}</p></div></div></div>
      {message && <p className="mb-4 rounded-xl bg-blue-50 border border-blue-200 p-3 text-blue-800 arabic-text">{message}</p>}
      <div className="grid sm:grid-cols-2 gap-4">{REWARD_CATALOGUE.map(item => <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"><div className="text-4xl mb-3">{item.emoji}</div><h2 className="font-black text-gray-900 arabic-text">{item.label}</h2><p className="text-sm text-gray-500 mt-2 leading-relaxed arabic-text">{item.description}</p><div className="flex items-center justify-between mt-5"><span className="font-black text-amber-600">🪙 {item.cost}</span><button disabled={available < item.cost} onClick={() => requestReward(item)} className={`px-4 py-2 rounded-xl text-sm font-bold arabic-text ${available >= item.cost ? `bg-gradient-to-r ${learner.theme.gradient} text-white` : 'bg-gray-100 text-gray-400'}`}>اطلب من بابا</button></div></div>)}</div>
      <section className="mt-6 bg-white rounded-2xl border border-gray-100 p-5"><h2 className="font-black text-gray-900 arabic-text mb-3">حالة طلباتك</h2>{learnerRequests.length === 0 ? <p className="text-sm text-gray-500 arabic-text">لم تطلب مكافأة بعد.</p> : <div className="space-y-2">{learnerRequests.slice(0, 6).map(request => <div key={request.id} className="flex items-center justify-between rounded-xl bg-gray-50 p-3"><span className="text-sm arabic-text">{request.label}</span><span className={`text-xs font-bold arabic-text ${request.status === 'approved' ? 'text-green-600' : request.status === 'declined' ? 'text-red-500' : 'text-amber-600'}`}>{request.status === 'approved' ? 'وافق بابا ✓' : request.status === 'declined' ? 'مرفوض — عادت العملات' : 'بانتظار بابا'}</span></div>)}</div>}</section>
    </div>
  );
}

export default function SecureFamilySchool() {
  const [config, setConfig] = useState<SecurityConfig | null>(() => loadSecurity());
  const [activeLearnerId, setActiveLearnerId] = useState<LearnerId | null>(null);
  const [parentOpen, setParentOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [showRewards, setShowRewards] = useState(false);
  const [showTool, setShowTool] = useState(false);
  const [showNoahGames, setShowNoahGames] = useState(false);
  const [progress, setProgress] = useState<ProgressState>(EMPTY_PROGRESS);
  const [requests, setRequests] = useState<RewardRequest[]>(() => loadRequests());

  const learner = activeLearnerId ? LEARNERS[activeLearnerId] : null;
  const curriculum = useMemo(() => learner ? getCurriculum(learner) : [], [learner]);
  const activeLesson = curriculum.find(lesson => lesson.id === activeLessonId);

  useEffect(() => {
    if (!activeLearnerId) return setProgress(EMPTY_PROGRESS);
    setProgress(loadProgress(activeLearnerId));
  }, [activeLearnerId]);

  useEffect(() => {
    if (!activeLearnerId) return;
    let timer = window.setTimeout(() => setActiveLearnerId(null), 10 * 60 * 1000);
    const reset = () => { window.clearTimeout(timer); timer = window.setTimeout(() => setActiveLearnerId(null), 10 * 60 * 1000); };
    const events = ['click', 'keydown', 'touchstart'];
    events.forEach(event => window.addEventListener(event, reset));
    return () => { window.clearTimeout(timer); events.forEach(event => window.removeEventListener(event, reset)); };
  }, [activeLearnerId]);

  const logout = () => {
    setActiveLearnerId(null);
    setSelectedSubject(null);
    setActiveLessonId(null);
    setShowRewards(false);
    setShowTool(false);
    setShowNoahGames(false);
  };

  if (!config) return <SetupScreen onComplete={setConfig} />;
  if (parentOpen) return <ParentPanel config={config} onConfig={setConfig} requests={requests} onRequests={setRequests} onClose={() => setParentOpen(false)} />;
  if (!learner) return <AccessGate config={config} onChild={id => { setActiveLearnerId(id); setSelectedSubject(null); setActiveLessonId(null); setShowRewards(false); }} onParent={() => setParentOpen(true)} />;

  const stats = calculateStats(progress);
  const usedCoins = requests.filter(request => request.learnerId === learner.id && request.status !== 'declined').reduce((sum, request) => sum + request.cost, 0);
  const availableCoins = Math.max(0, stats.earnedCoins - usedCoins);
  const subjectLessons = selectedSubject ? getLessonsBySubject(learner, selectedSubject) : [];
  const dailyPlan = SUBJECT_ORDER.map(subject => curriculum.find(lesson => lesson.subject === subject && !progress.completed[lesson.id])).filter((lesson): lesson is SchoolLesson => Boolean(lesson)).slice(0, 4);

  const completeLesson = (lessonId: string, correct: number, total: number) => {
    const previous = progress.completed[lessonId];
    const bestCorrect = Math.max(previous?.correct ?? 0, correct);
    const next: ProgressState = { completed: { ...progress.completed, [lessonId]: { correct: bestCorrect, total, completedAt: new Date().toISOString() } }, lastStudied: new Date().toISOString() };
    setProgress(next);
    saveProgress(learner.id, next);
  };

  if (activeLesson) return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 px-4 py-7"><LessonView learner={learner} lesson={activeLesson} previous={progress.completed[activeLesson.id]} onComplete={(correct, total) => completeLesson(activeLesson.id, correct, total)} onBack={() => setActiveLessonId(null)} /></div>;
  if (showNoahGames && learner.id === 'noah') return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 px-4 py-7">
      <NoahGames learner={learner} onBack={() => setShowNoahGames(false)} onXP={(amount) => {
        const next: ProgressState = { ...progress, lastStudied: new Date().toISOString(), bonusXP: (progress.bonusXP ?? 0) + amount };
        setProgress(next);
        saveProgress(learner.id, next);
      }} />
    </div>
  );
  if (showRewards) return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4 py-7"><RewardsView learner={learner} progress={progress} requests={requests} onRequests={setRequests} onBack={() => setShowRewards(false)} /></div>;
  if (showTool) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 px-4 py-7" dir="rtl">
      <InteractiveTools child={learnerToChildProfile(learner)} onBack={() => setShowTool(false)} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50" dir="rtl">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-gray-200"><div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between"><div className="flex items-center gap-3"><ChildAvatar learner={learner} size="small" /><div><h1 className={`font-black ${learner.theme.text} arabic-text`}>مدرسة {learner.nameAr}</h1><p className="text-xs text-gray-500 arabic-text">المستوى {stats.level} • {stats.xp} XP • 🪙 {availableCoins}</p></div></div><div className="flex items-center gap-1"><button onClick={() => setShowTool(true)} className={`p-2.5 rounded-xl hover:bg-opacity-80 ${learner.theme.text}`} title="الأداة التفاعلية"><Sparkles className="w-5 h-5" /></button>{learner.id === 'noah' && <button onClick={() => setShowNoahGames(true)} className="p-2.5 rounded-xl hover:bg-orange-50 text-orange-600" title="ألعاب نوح"><Gamepad2 className="w-5 h-5" /></button>}<button onClick={() => setShowRewards(true)} className="p-2.5 rounded-xl hover:bg-amber-50 text-amber-600" title="المكافآت"><Gift className="w-5 h-5" /></button>{selectedSubject && <button onClick={() => setSelectedSubject(null)} className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-600"><Home className="w-5 h-5" /></button>}<button onClick={logout} className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500" title="قفل الحساب"><LogOut className="w-5 h-5" /></button></div></div></header>
      <main className="max-w-6xl mx-auto px-4 py-7 md:py-10">
        {selectedSubject ? <div><button onClick={() => setSelectedSubject(null)} className="mb-5 flex items-center gap-2 text-gray-600 arabic-text"><ArrowRight className="w-5 h-5" /> كل المواد</button><div className={`rounded-3xl ${learner.theme.light} ${learner.theme.border} border p-6 mb-6`}><h1 className={`text-2xl font-black ${learner.theme.text} arabic-text`}>{SUBJECTS[selectedSubject].emoji} {SUBJECTS[selectedSubject].label}</h1><p className="text-gray-600 mt-2 arabic-text">{SUBJECTS[selectedSubject].description}</p></div><div className="grid md:grid-cols-2 gap-4">{subjectLessons.map(lesson => <button key={lesson.id} onClick={() => setActiveLessonId(lesson.id)} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md p-5 text-right"><div className="flex gap-4"><span className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${learner.theme.gradient} text-white text-2xl flex items-center justify-center`}>{lesson.emoji}</span><div className="flex-1"><div className="flex items-center justify-between"><h2 className="font-black text-gray-900 arabic-text">{lesson.title}</h2>{progress.completed[lesson.id] && <CheckCircle2 className="w-5 h-5 text-green-500" />}</div><p className="text-sm text-gray-500 mt-2 arabic-text">{lesson.subtitle}</p></div><ChevronLeft className="w-5 h-5 text-gray-300 mt-4" /></div></button>)}</div></div> : <><section className={`rounded-3xl bg-gradient-to-r ${learner.theme.gradient} text-white p-6 md:p-8 shadow-xl mb-7`}><div className="flex flex-col md:flex-row items-center gap-5"><ChildAvatar learner={learner} /><div className="text-center md:text-right flex-1"><p className="text-white/80 arabic-text">أهلاً بعودتك</p><h1 className="text-4xl font-black arabic-text">يا {learner.nameAr}</h1><p className="mt-3 text-white/90 arabic-text">حسابك محمي الآن. تعلّم الدرس، استمع لشرح بابا المعلم، وارفع مستواك من عملك الحقيقي.</p><div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4"><span className="bg-white/15 rounded-full px-3 py-1.5 text-xs">⭐ المستوى {stats.level}</span><span className="bg-white/15 rounded-full px-3 py-1.5 text-xs">⚡ {stats.xp} XP</span><span className="bg-white/15 rounded-full px-3 py-1.5 text-xs">🪙 {availableCoins} متاحة</span></div></div></div></section><section className="grid grid-cols-3 gap-3 mb-8"><div className="bg-white rounded-2xl border border-gray-100 p-4 text-center"><div className={`text-3xl font-black ${learner.theme.text}`}>{stats.completedLessons}</div><p className="text-xs text-gray-500 arabic-text">دروس مكتملة</p></div><div className="bg-white rounded-2xl border border-gray-100 p-4 text-center"><div className="text-3xl font-black text-blue-600">{stats.xp}</div><p className="text-xs text-gray-500">XP</p></div><button onClick={() => setShowRewards(true)} className="bg-white rounded-2xl border border-amber-200 p-4 text-center"><div className="text-3xl font-black text-amber-600">{availableCoins}</div><p className="text-xs text-gray-500 arabic-text">عملات المكافآت</p></button></section><section className="mb-8"><h2 className="text-2xl font-black text-gray-900 arabic-text mb-4">خطة اليوم</h2><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{dailyPlan.length ? dailyPlan.map(lesson => <button key={lesson.id} onClick={() => setActiveLessonId(lesson.id)} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md p-5 text-right"><span className={`w-12 h-12 rounded-xl bg-gradient-to-br ${learner.theme.gradient} text-white text-2xl flex items-center justify-center mb-4`}>{lesson.emoji}</span><h3 className="font-black text-gray-900 arabic-text">{lesson.title}</h3><p className="text-xs text-gray-500 mt-2 arabic-text">{SUBJECTS[lesson.subject].label}</p></button>) : <div className="sm:col-span-2 lg:col-span-4 rounded-2xl bg-green-50 border border-green-200 p-6 text-center"><Trophy className="w-8 h-8 text-green-600 mx-auto" /><p className="font-black text-green-900 arabic-text mt-2">أكملت جميع الدروس الحالية</p></div>}</div></section>{learner.id === 'noah' && <section className="mb-8"><h2 className="text-2xl font-black text-gray-900 arabic-text mb-4">🎮 ألعاب نوح</h2><div className="rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 shadow-xl flex items-center justify-between gap-4"><div><p className="text-white/80 arabic-text text-sm mb-1">⚡ XP مضاعف على كل لعبة!</p><h3 className="text-xl font-black arabic-text">سباق سيارات • بطاقات • ترتيب • ركن السيارة</h3><p className="text-white/70 text-xs mt-2 arabic-text">4 ألعاب تفاعلية خاصة بنوح</p></div><button onClick={() => setShowNoahGames(true)} className="flex-shrink-0 bg-white text-orange-600 font-black arabic-text px-5 py-3 rounded-2xl shadow-md hover:bg-orange-50 active:scale-95 transition-transform flex items-center gap-2"><Gamepad2 className="w-5 h-5" /> العب الآن</button></div></section>}<section><h2 className="text-2xl font-black text-gray-900 arabic-text mb-4">المواد والمسارات</h2><div className="grid grid-cols-2 md:grid-cols-3 gap-4">{SUBJECT_ORDER.map(subject => { const lessons = curriculum.filter(lesson => lesson.subject === subject); const done = lessons.filter(lesson => progress.completed[lesson.id]).length; return <button key={subject} onClick={() => setSelectedSubject(subject)} className={`rounded-2xl border-2 ${subject === 'interest' ? learner.theme.border : 'border-gray-100'} ${subject === 'interest' ? learner.theme.light : 'bg-white'} p-5 text-right shadow-sm`}><div className="flex items-center justify-between"><span className="text-3xl">{subject === 'interest' ? learner.interestEmoji : SUBJECTS[subject].emoji}</span><span className="text-xs text-gray-500">{done}/{lessons.length}</span></div><h3 className={`font-black mt-4 arabic-text ${subject === 'interest' ? learner.theme.text : 'text-gray-900'}`}>{subject === 'interest' ? `مسار ${learner.interestAr}` : SUBJECTS[subject].label}</h3><div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-4"><div className={`h-full bg-gradient-to-r ${learner.theme.gradient}`} style={{ width: `${lessons.length ? (done / lessons.length) * 100 : 0}%` }} /></div></button>; })}</div></section></>}
      </main>
      <footer className="border-t border-gray-200 bg-gray-50 mt-12"><div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500 arabic-text">مدرسة ليندا وآدم وجودي ونوح — حساب محمي، تعليم حقيقي، ومكافآت بموافقة الأب.</div></footer>
    </div>
  );
}
