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
  const correctPercentage = correctCount > 0 ? (correctCount / current) * 100 : 0;

  return (
    <div className="w-full space-y-3">
      {/* Question Counter */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-700 arabic-text">
          سؤال {current} من {total}
        </span>
        {correctCount > 0 && (
          <span className="text-sm font-semibold text-green-600 arabic-text">
            ✓ {correctCount} صحيحة
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-teal-500 via-purple-500 to-pink-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Correct Answers Indicator */}
      {correctCount > 0 && (
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-green-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${correctPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      )}
    </div>
  );
}
