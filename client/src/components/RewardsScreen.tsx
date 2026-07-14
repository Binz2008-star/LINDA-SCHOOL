/**
 * RewardsScreen.tsx
 * ─────────────────────────────────────────────────────────
 * Shows the child's reward coins balance and what they can
 * redeem. Dad must approve each redemption.
 */

import { REWARD_CATALOGUE, useRewards } from '@/hooks/useRewards';
import { ChildProfile } from '@/lib/children';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Gift, Star, Trophy } from 'lucide-react';
import { useState } from 'react';

interface RewardsScreenProps {
  child: ChildProfile;
  onBack: () => void;
}

const REWARD_ICONS: Record<string, string> = {
  robux:  '🎲',
  vbucks: '🎮',
  noon:   '🛍️',
  coins:  '🪙',
};

export default function RewardsScreen({ child, onBack }: RewardsScreenProps) {
  const { availableCoins, record, redeem } = useRewards(child.storageKey);
  const [redeemed, setRedeemed] = useState<string | null>(null);

  // Filter catalogue to show child's preferred reward type first
  const sorted = [...REWARD_CATALOGUE].sort((a, b) =>
    a.type === child.rewardType ? -1 : b.type === child.rewardType ? 1 : 0
  );

  const handleRedeem = (item: typeof REWARD_CATALOGUE[0]) => {
    if (availableCoins < item.coins) return;
    redeem(item.coins);
    setRedeemed(item.labelAr);
    setTimeout(() => setRedeemed(null), 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 px-4 py-8">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
          dir="rtl"
        >
          <button
            onClick={onBack}
            className={`p-2 rounded-xl bg-white shadow-sm border ${child.colorBorder} ${child.colorText}`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className={`text-xl font-bold arabic-text ${child.colorText}`}>
              🎁 مكافآت {child.nameAr}
            </h1>
            <p className="text-xs text-gray-400 arabic-text">اجمع عملات واحصل على جوائز!</p>
          </div>
        </motion.div>

        {/* Coins balance card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className={`rounded-3xl p-6 mb-6 bg-gradient-to-br ${child.color} text-white shadow-xl`}
          dir="rtl"
        >
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-6 h-6" />
            <span className="text-sm font-semibold opacity-90 arabic-text">رصيدك الحالي</span>
          </div>
          <div className="text-5xl font-black mb-1">
            🪙 {availableCoins}
          </div>
          <p className="text-sm opacity-80 arabic-text">
            عملة متاحة · إجمالي مكتسبة: {record.totalCoins}
          </p>
          <div className="mt-3 text-xs opacity-70 arabic-text">
            كل 100 XP = 🪙 1 عملة
          </div>
        </motion.div>

        {/* How to earn */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-4 mb-5 border border-yellow-200 shadow-sm"
          dir="rtl"
        >
          <h3 className="font-bold text-gray-800 arabic-text mb-2 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
            كيف تكسب عملات؟
          </h3>
          <div className="space-y-1 text-sm text-gray-600 arabic-text">
            <div>✅ اجتياز اختبار = XP حسب الدرجة</div>
            <div>🏆 100% في اختبار = XP مضاعف</div>
            <div>🔥 سلسلة أيام متتالية = مكافأة إضافية</div>
            <div>🪙 كل 100 XP = عملة واحدة</div>
          </div>
        </motion.div>

        {/* Redemption success */}
        <AnimatePresence>
          {redeemed && (
            <motion.div
              key="redeem-ok"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-green-50 border-2 border-green-400 rounded-2xl p-4 mb-4 text-center"
              dir="rtl"
            >
              <div className="text-3xl mb-1">🎉</div>
              <p className="font-bold text-green-800 arabic-text text-sm">
                تم الطلب! أخبر بابا ليوافق على:
              </p>
              <p className="text-green-700 arabic-text text-base font-bold mt-1">{redeemed}</p>
              <p className="text-xs text-green-600 mt-1 arabic-text">بابا فخور فيك وسيكافئك قريباً! 💙</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Catalogue */}
        <h3 className="font-bold text-gray-700 arabic-text mb-3 flex items-center gap-2" dir="rtl">
          <Gift className="w-4 h-4 text-purple-500" />
          الجوائز المتاحة
        </h3>
        <div className="space-y-3">
          {sorted.map((item, i) => {
            const canAfford = availableCoins >= item.coins;
            const isPreferred = item.type === child.rewardType;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-3 rounded-2xl p-4 border-2 transition-all
                  ${isPreferred ? `${child.colorLight} ${child.colorBorder}` : 'bg-white border-gray-100'}
                  ${canAfford ? 'shadow-sm' : 'opacity-50'}`}
                dir="rtl"
              >
                <span className="text-3xl flex-shrink-0">{REWARD_ICONS[item.type]}</span>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-sm arabic-text ${isPreferred ? child.colorText : 'text-gray-800'}`}>
                    {item.labelAr}
                  </p>
                  <p className="text-xs text-gray-400 arabic-text">
                    تحتاج 🪙 {item.coins} عملة
                    {isPreferred && <span className={`mr-1 font-semibold ${child.colorText}`}> ⭐ مفضلتك</span>}
                  </p>
                </div>
                <button
                  onClick={() => handleRedeem(item)}
                  disabled={!canAfford}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95
                    ${canAfford
                      ? `bg-gradient-to-r ${child.color} text-white shadow-md`
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                  {canAfford ? 'اطلب 🎁' : `يحتاج ${item.coins - availableCoins} 🪙`}
                </button>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6 arabic-text" dir="rtl">
          💙 بابا سيوافق على الجائزة عند استلام الطلب
        </p>
      </div>
    </div>
  );
}
