/**
 * useRewards.ts
 * ─────────────────────────────────────────────────────────
 * Converts quiz XP into reward points per child (isolated storage).
 * Every 100 XP = 1 reward coin.  Coins accumulate and never reset
 * unless redeemed.
 *
 * Reward catalogue:
 *  - robux  → Roblox gift card hint
 *  - vbucks → Fortnite V-Bucks hint
 *  - noon   → Noon.com coupon hint
 *  - coins  → Generic coins
 */

import { useCallback, useEffect, useState } from 'react';

export interface RewardRecord {
  totalCoins: number;          // lifetime coins earned
  redeemedCoins: number;       // coins already redeemed
  lastEarnedAt?: string;       // ISO date
  milestones: number[];        // which coin milestones were celebrated
}

const XP_PER_COIN = 100;

export const REWARD_CATALOGUE = [
  { coins: 5,  labelAr: 'بطاقة Noon بقيمة 10 ريال 🛍️',   labelEn: 'Noon 10 SAR coupon 🛍️',      type: 'noon'   },
  { coins: 10, labelAr: '80 V-Bucks فورت نايت 🎮',         labelEn: '80 Fortnite V-Bucks 🎮',       type: 'vbucks' },
  { coins: 10, labelAr: '80 Robux روبلكس 🎲',              labelEn: '80 Roblox Robux 🎲',           type: 'robux'  },
  { coins: 20, labelAr: 'بطاقة Noon بقيمة 25 ريال 🛍️',   labelEn: 'Noon 25 SAR coupon 🛍️',      type: 'noon'   },
  { coins: 25, labelAr: '400 V-Bucks فورت نايت 🎮',        labelEn: '400 Fortnite V-Bucks 🎮',      type: 'vbucks' },
  { coins: 25, labelAr: '400 Robux روبلكس 🎲',             labelEn: '400 Roblox Robux 🎲',          type: 'robux'  },
  { coins: 50, labelAr: '800 Robux + هدية مفاجأة 🎁',      labelEn: '800 Robux + surprise gift 🎁', type: 'robux'  },
  { coins: 50, labelAr: '800 V-Bucks + هدية مفاجأة 🎁',   labelEn: '800 V-Bucks + surprise 🎁',   type: 'vbucks' },
  { coins: 50, labelAr: 'بطاقة Noon 50 ريال 🛍️',          labelEn: 'Noon 50 SAR coupon 🛍️',      type: 'noon'   },
];

function storageKey(childKey: string) {
  return `${childKey}_rewards`;
}

function loadRecord(childKey: string): RewardRecord {
  try {
    const raw = localStorage.getItem(storageKey(childKey));
    if (raw) return JSON.parse(raw) as RewardRecord;
  } catch { /* ignore */ }
  return { totalCoins: 0, redeemedCoins: 0, milestones: [] };
}

function saveRecord(childKey: string, rec: RewardRecord) {
  localStorage.setItem(storageKey(childKey), JSON.stringify(rec));
}

export function useRewards(childStorageKey: string) {
  const [record, setRecord] = useState<RewardRecord>(() => loadRecord(childStorageKey));

  useEffect(() => {
    setRecord(loadRecord(childStorageKey));
  }, [childStorageKey]);

  /** Call this after each quiz with XP earned */
  const addXP = useCallback((xp: number) => {
    setRecord(prev => {
      const newCoins = Math.floor((prev.totalCoins * XP_PER_COIN + xp) / XP_PER_COIN);
      const updated: RewardRecord = {
        ...prev,
        totalCoins: newCoins,
        lastEarnedAt: new Date().toISOString(),
      };
      saveRecord(childStorageKey, updated);
      return updated;
    });
  }, [childStorageKey]);

  const availableCoins = record.totalCoins - record.redeemedCoins;

  /** Mark coins as redeemed (dad approves a reward) */
  const redeem = useCallback((coins: number) => {
    setRecord(prev => {
      const updated = { ...prev, redeemedCoins: prev.redeemedCoins + coins };
      saveRecord(childStorageKey, updated);
      return updated;
    });
  }, [childStorageKey]);

  return { record, availableCoins, addXP, redeem, catalogue: REWARD_CATALOGUE };
}
