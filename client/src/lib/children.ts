// ── Family Children Configuration ────────────────────────────────────────────
// Each child has their own profile, school grade, interests, and isolated
// localStorage keys so progress never mixes between siblings.
// PIN values are intentionally never stored in source code. SecureFamilySchool
// creates salted hashes locally during the parent setup flow.

export type ChildId = 'linda' | 'adam' | 'judy' | 'noah';

export interface ChildProfile {
  id: ChildId;
  nameAr: string;
  nameEn: string;
  age: number;
  photo: string;
  emoji: string;
  interest: string;
  interestEn: string;
  interestEmoji: string;
  color: string;
  colorLight: string;
  colorBorder: string;
  colorText: string;
  colorRing: string;
  gradeLevel: 3 | 5 | 7;
  difficulty: 'easy' | 'medium' | 'hard';
  dadToneAr: string;
  dadToneEn: string;
  storageKey: string;
  pin: string;
  rewardType: 'robux' | 'vbucks' | 'noon' | 'coins';
}

export const CHILDREN: Record<ChildId, ChildProfile> = {
  linda: {
    id: 'linda', nameAr: 'ليندا', nameEn: 'Linda', age: 13,
    photo: '/linda.png', emoji: '🌸', interest: 'الحياة والطبيعة', interestEn: 'Life & Nature', interestEmoji: '🌿',
    color: 'from-rose-400 to-pink-500', colorLight: 'bg-rose-50', colorBorder: 'border-rose-300', colorText: 'text-rose-700', colorRing: 'ring-rose-300',
    gradeLevel: 7, difficulty: 'hard', dadToneAr: 'يا ليندا حبيبتي', dadToneEn: 'my dear Linda', storageKey: 'linda', pin: '', rewardType: 'noon',
  },
  adam: {
    id: 'adam', nameAr: 'آدم', nameEn: 'Adam', age: 11,
    photo: '/adam.png', emoji: '⚙️', interest: 'الاختراعات والتكنولوجيا', interestEn: 'Inventions & Technology', interestEmoji: '🔧',
    color: 'from-blue-400 to-cyan-500', colorLight: 'bg-blue-50', colorBorder: 'border-blue-300', colorText: 'text-blue-700', colorRing: 'ring-blue-300',
    gradeLevel: 5, difficulty: 'medium', dadToneAr: 'يا آدم يا مخترعي', dadToneEn: 'my little inventor Adam', storageKey: 'adam', pin: '', rewardType: 'robux',
  },
  judy: {
    id: 'judy', nameAr: 'جودي', nameEn: 'Judy', age: 9,
    photo: '/judy.png', emoji: '⚽', interest: 'الرياضة واللياقة', interestEn: 'Sports & Fitness', interestEmoji: '🏅',
    color: 'from-green-400 to-teal-500', colorLight: 'bg-green-50', colorBorder: 'border-green-300', colorText: 'text-green-700', colorRing: 'ring-green-300',
    gradeLevel: 5, difficulty: 'medium', dadToneAr: 'يا جودي بطلتي', dadToneEn: 'my little champion Judy', storageKey: 'judy', pin: '', rewardType: 'vbucks',
  },
  noah: {
    id: 'noah', nameAr: 'نوح', nameEn: 'Noah', age: 7,
    photo: '/noah.png', emoji: '🚗', interest: 'السيارات والمركبات', interestEn: 'Cars & Vehicles', interestEmoji: '🏎️',
    color: 'from-orange-400 to-yellow-500', colorLight: 'bg-orange-50', colorBorder: 'border-orange-300', colorText: 'text-orange-700', colorRing: 'ring-orange-300',
    gradeLevel: 3, difficulty: 'easy', dadToneAr: 'يا نوح حبيب بابا', dadToneEn: 'my little Noah', storageKey: 'noah', pin: '', rewardType: 'robux',
  },
};

export const CHILDREN_ORDER: ChildId[] = ['linda', 'adam', 'judy', 'noah'];

export function getChild(id: ChildId): ChildProfile {
  return CHILDREN[id];
}
