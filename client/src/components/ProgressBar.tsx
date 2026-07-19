import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  correctCount?: number;
}

export default function ProgressBar({
  current,
  total,
  correctCount = 0,
}: ProgressBarProps) {
  const percentage = (current / total) * 100;
  const segments = Array.from({ length: total }, (_, i) => i < current);

  return (
    <div className="w-full space-y-2.5">
      {/* Top row: counter + correct badge */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-gray-800 arabic-text">
            سؤال {current}
          </span>
          <span className="text-xs text-gray-400 arabic-text">من {total}</span>
        </div>
        {correctCount > 0 && (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full arabic-text"
          >
            ✓ {correctCount} صحيحة
          </motion.span>
        )}
      </div>

      {/* Segmented progress */}
      <div className="flex gap-1.5">
        {segments.map((filled, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0.6, opacity: 0.5 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ delay: i * 0.03, duration: 0.3 }}
            className={`flex-1 h-2.5 rounded-full transition-all duration-300 ${filled
                ? 'bg-gradient-to-r from-violet-500 to-pink-500'
                : 'bg-gray-200'
              }`
            }
          />
        ))}
      </div>

      {/* Smooth percentage bar */}
      <div className="relative h-1 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-400 via-pink-400 to-rose-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
