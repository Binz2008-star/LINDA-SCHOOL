import { ChildId, ChildProfile, CHILDREN_ORDER, CHILDREN } from '@/lib/children';
import { motion } from 'framer-motion';

interface ChildSelectorProps {
  onSelect: (id: ChildId) => void;
}

function ChildCard({ child, index, onSelect }: { child: ChildProfile; index: number; onSelect: (id: ChildId) => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(child.id)}
      className={`relative w-full rounded-3xl p-5 text-center shadow-lg border-2 ${child.colorBorder} ${child.colorLight} transition-all duration-200 cursor-pointer`}
    >
      {/* Photo or emoji avatar */}
      <div className="relative mx-auto w-24 h-24 mb-3">
        <img
          src={child.photo}
          alt={child.nameAr}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            const next = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
            if (next) next.style.display = 'flex';
          }}
          className={`w-24 h-24 rounded-full object-cover shadow-md ring-4 ${child.colorRing}`}
        />
        {/* Fallback emoji avatar shown if image fails */}
        <div
          style={{ display: 'none' }}
          className={`w-24 h-24 rounded-full items-center justify-center text-5xl bg-gradient-to-br ${child.color} shadow-md ring-4 ${child.colorRing}`}
        >
          {child.emoji}
        </div>
        {/* Age badge */}
        <span className={`absolute -bottom-1 -right-1 text-xs font-bold px-2 py-0.5 rounded-full bg-white shadow ${child.colorText} border ${child.colorBorder}`}>
          {child.age} سنة
        </span>
      </div>

      {/* Name */}
      <h3 className={`text-2xl font-bold mb-1 arabic-text ${child.colorText}`} dir="rtl">
        {child.nameAr}
      </h3>

      {/* Interest */}
      <div className="flex items-center justify-center gap-1.5 mt-1" dir="rtl">
        <span className="text-lg">{child.interestEmoji}</span>
        <span className={`text-sm font-medium arabic-text ${child.colorText} opacity-80`}>
          {child.interest}
        </span>
      </div>

      {/* Level indicator */}
      <div className={`mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/70 ${child.colorText} border ${child.colorBorder}`}>
        {'⭐'.repeat(Math.min(child.gradeLevel, 5))}
        <span className="mr-1 arabic-text">المستوى {child.gradeLevel}</span>
      </div>
    </motion.button>
  );
}

export default function ChildSelector({ onSelect }: ChildSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col items-center justify-center px-4 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
        dir="rtl"
      >
        <div className="text-5xl mb-3">👨‍👧‍👦</div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 arabic-text mb-2">
          مرحباً بكم في مدرستنا!
        </h1>
        <p className="text-gray-500 arabic-text text-base">
          اختر اسمك لتبدأ رحلة التعلم 📚
        </p>
      </motion.div>

      {/* Children grid */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {CHILDREN_ORDER.map((id, index) => (
          <ChildCard
            key={id}
            child={CHILDREN[id]}
            index={index}
            onSelect={onSelect}
          />
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-xs text-gray-400 arabic-text text-center"
        dir="rtl"
      >
        بابا فخور بكم جميعاً 💙
      </motion.p>
    </div>
  );
}
