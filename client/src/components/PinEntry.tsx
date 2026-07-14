/**
 * PinEntry.tsx
 * ─────────────────────────────────────────────────────────
 * 4-digit PIN screen per child.  Wrong PIN shakes + shows error.
 * Correct PIN calls onSuccess immediately.
 */

import { ChildProfile } from '@/lib/children';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Delete } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PinEntryProps {
  child: ChildProfile;
  onSuccess: () => void;
  onBack: () => void;
}

const DIGITS = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

export default function PinEntry({ child, onSuccess, onBack }: PinEntryProps) {
  const [entered, setEntered] = useState('');
  const [shake, setShake]   = useState(false);
  const [error, setError]   = useState(false);
  const [tries, setTries]   = useState(0);

  const handleDigit = (d: string) => {
    if (d === '⌫') {
      setEntered(p => p.slice(0, -1));
      setError(false);
      return;
    }
    if (entered.length >= 4) return;
    const next = entered + d;
    setEntered(next);

    if (next.length === 4) {
      if (next === child.pin) {
        onSuccess();
      } else {
        setTries(t => t + 1);
        setShake(true);
        setError(true);
        setTimeout(() => {
          setShake(false);
          setEntered('');
        }, 600);
      }
    }
  };

  // Auto-clear error message after 2s
  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(false), 2000);
    return () => clearTimeout(t);
  }, [error]);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-6
        bg-gradient-to-br ${child.color.replace('from-', 'from-').replace('to-', 'to-')} opacity-95`}
      style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xs"
      >
        {/* Back */}
        <button
          onClick={onBack}
          className={`mb-6 text-sm font-medium ${child.colorText} flex items-center gap-1`}
          dir="rtl"
        >
          ← رجوع
        </button>

        {/* Child avatar + name */}
        <div className="text-center mb-8" dir="rtl">
          <div className={`w-20 h-20 rounded-full mx-auto mb-3 bg-gradient-to-br ${child.color}
            flex items-center justify-center text-4xl shadow-lg ring-4 ${child.colorRing}`}>
            {child.emoji}
          </div>
          <h2 className={`text-2xl font-bold arabic-text ${child.colorText}`}>
            أهلاً {child.nameAr} 👋
          </h2>
          <p className="text-sm text-gray-500 arabic-text mt-1 flex items-center justify-center gap-1">
            <Lock className="w-3.5 h-3.5" />
            أدخل رقمك السري
          </p>
        </div>

        {/* PIN dots */}
        <motion.div
          animate={shake ? { x: [-8, 8, -8, 8, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center gap-4 mb-4"
        >
          {[0,1,2,3].map(i => (
            <div
              key={i}
              className={`w-5 h-5 rounded-full border-2 transition-all duration-200
                ${entered.length > i
                  ? `bg-gradient-to-br ${child.color} border-transparent scale-110`
                  : `bg-white ${child.colorBorder}`}`}
            />
          ))}
        </motion.div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.p
              key="err"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-red-500 text-sm arabic-text mb-3 font-medium"
              dir="rtl"
            >
              {tries >= 3
                ? '❌ رقم خاطئ مرة أخرى! فقط أنت تعرف رقمك 🔒'
                : '❌ رقم خاطئ — حاول مرة أخرى'}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {DIGITS.map((d, i) => (
            d === '' ? <div key={i} /> :
            <button
              key={i}
              onClick={() => d !== '' && handleDigit(d)}
              disabled={d === ''}
              className={`h-14 rounded-2xl text-xl font-bold transition-all active:scale-95
                ${d === '⌫'
                  ? `bg-gray-100 ${child.colorText} border border-gray-200 flex items-center justify-center`
                  : `bg-white shadow-sm border-2 ${child.colorBorder} ${child.colorText} hover:${child.colorLight}`}`}
            >
              {d === '⌫' ? <Delete className="w-5 h-5 mx-auto" /> : d}
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6 arabic-text" dir="rtl">
          🔒 رقمك السري يحمي تقدمك ومكافآتك
        </p>
      </motion.div>
    </div>
  );
}
