import PinEntry from '@/components/PinEntry';
import { useRewards } from '@/hooks/useRewards';
import { ChildId, ChildProfile, CHILDREN, CHILDREN_ORDER } from '@/lib/children';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useState } from 'react';

interface ChildSelectorProps {
  onSelect: (id: ChildId) => void;
}

function ChildAvatar({ child, size = 24 }: { child: ChildProfile; size?: number }) {
  const [imgError, setImgError] = useState(false);
  const sizeClass = `w-${size} h-${size}`;
  const textSize = size >= 24 ? 'text-5xl' : 'text-2xl';

  if (!imgError) {
    return <img src={child.photo} alt={child.nameAr} onError={() => setImgError(true)} className={`${sizeClass} rounded-full object-cover shadow-md ring-4 ${child.colorRing}`} />;
  }

  return <div className={`${sizeClass} rounded-full flex items-center justify-center ${textSize} bg-gradient-to-br ${child.color} shadow-md ring-4 ${child.colorRing}`}>{child.emoji}</div>;
}

function CoinsPreview({ storageKey, colorText }: { storageKey: string; colorText: string }) {
  const { availableCoins } = useRewards(storageKey);
  if (availableCoins === 0) return null;
  return <span className={`text-xs font-bold ${colorText}`}>🪙 {availableCoins}</span>;
}

function ChildCard({ child, index, onClick }: { child: ChildProfile; index: number; onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative w-full rounded-3xl p-5 text-center shadow-lg border-2 ${child.colorBorder} ${child.colorLight} transition-all duration-200 cursor-pointer`}
    >
      <div className={`absolute top-2 left-2 p-1 rounded-full bg-white/80 shadow-sm ${child.colorText}`}><Lock className="w-3 h-3" /></div>
      <div className="absolute top-2 right-2"><CoinsPreview storageKey={child.storageKey} colorText={child.colorText} /></div>

      <div className="relative mx-auto w-24 h-24 mb-3">
        <ChildAvatar child={child} size={24} />
        <span className={`absolute -bottom-1 -right-1 text-xs font-bold px-2 py-0.5 rounded-full bg-white shadow ${child.colorText} border ${child.colorBorder}`}>{child.age} سنة</span>
      </div>

      <h3 className={`text-2xl font-bold mb-1 arabic-text ${child.colorText}`} dir="rtl">{child.nameAr}</h3>
      <div className="flex items-center justify-center gap-1.5 mt-1" dir="rtl">
        <span className="text-lg">{child.interestEmoji}</span>
        <span className={`text-sm font-medium arabic-text ${child.colorText} opacity-80`}>{child.interest}</span>
      </div>

      <div className={`mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/70 ${child.colorText} border ${child.colorBorder}`}>
        {'⭐'.repeat(Math.min(child.gradeLevel, 5))}
        <span className="mr-1 arabic-text">الصف {child.gradeLevel}</span>
      </div>
    </motion.button>
  );
}

export default function ChildSelector({ onSelect }: ChildSelectorProps) {
  const [pinChild, setPinChild] = useState<ChildId | null>(null);

  if (pinChild) {
    return <PinEntry child={CHILDREN[pinChild]} onSuccess={() => { onSelect(pinChild); setPinChild(null); }} onBack={() => setPinChild(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col items-center justify-center px-4 py-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8" dir="rtl">
        <div className="text-5xl mb-3">👨‍👧‍👦</div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 arabic-text mb-2">مرحباً بكم في مدرستنا!</h1>
        <p className="text-gray-500 arabic-text text-base">اختر اسمك وأدخل رقمك السري 🔐</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {CHILDREN_ORDER.map((id, index) => <ChildCard key={id} child={CHILDREN[id]} index={index} onClick={() => setPinChild(id)} />)}
      </div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-8 text-xs text-gray-400 arabic-text text-center" dir="rtl">
        🔒 كل طفل له رقم سري خاص به — بابا فخور بكم 💙
      </motion.p>
    </div>
  );
}
