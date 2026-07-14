// ── Family Children Configuration ────────────────────────────────────────────
// Each child has their own profile, learning level, interests, and isolated
// localStorage keys so progress never mixes between siblings.

export type ChildId = 'linda' | 'adam' | 'judy' | 'noah';

export interface ChildProfile {
  id: ChildId;
  nameAr: string;
  nameEn: string;
  age: number;
  photo: string;          // /public path
  emoji: string;
  interest: string;       // Arabic label
  interestEn: string;     // English label
  interestEmoji: string;
  color: string;          // Tailwind gradient from-X
  colorLight: string;     // Tailwind bg-X-50
  colorBorder: string;    // Tailwind border-X-300
  colorText: string;      // Tailwind text-X-700
  colorRing: string;      // Tailwind ring-X-300
  // Learning level
  gradeLevel: 1 | 2 | 3 | 4 | 5 | 6;  // approximate school grade equivalent
  difficulty: 'easy' | 'medium' | 'hard';
  // Personalized dad message tone
  dadToneAr: string;      // how dad addresses this child
  dadToneEn: string;
  // localStorage namespace
  storageKey: string;
  // 4-digit PIN to protect this child's account
  pin: string;
  // Preferred reward type
  rewardType: 'robux' | 'vbucks' | 'noon' | 'coins';
}

export const CHILDREN: Record<ChildId, ChildProfile> = {
  linda: {
    id: 'linda',
    nameAr: 'لينيدا',
    nameEn: 'Linda',
    age: 13,
    photo: '/linda.png',
    emoji: '🌸',
    interest: 'الحياة والطبيعة',
    interestEn: 'Life & Nature',
    interestEmoji: '🌿',
    color: 'from-rose-400 to-pink-500',
    colorLight: 'bg-rose-50',
    colorBorder: 'border-rose-300',
    colorText: 'text-rose-700',
    colorRing: 'ring-rose-300',
    gradeLevel: 6,
    difficulty: 'hard',
    dadToneAr: 'يا لينيدا حبيبتي',
    dadToneEn: 'my dear Linda',
    storageKey: 'linda',
    pin: '1234',
    rewardType: 'noon',
  },
  adam: {
    id: 'adam',
    nameAr: 'آدم',
    nameEn: 'Adam',
    age: 11,
    photo: '/adam.png',
    emoji: '⚙️',
    interest: 'الاختراعات والتكنولوجيا',
    interestEn: 'Inventions & Technology',
    interestEmoji: '🔧',
    color: 'from-blue-400 to-cyan-500',
    colorLight: 'bg-blue-50',
    colorBorder: 'border-blue-300',
    colorText: 'text-blue-700',
    colorRing: 'ring-blue-300',
    gradeLevel: 4,
    difficulty: 'medium',
    dadToneAr: 'يا آدم يا مخترعي',
    dadToneEn: 'my little inventor Adam',
    storageKey: 'adam',
    pin: '2345',
    rewardType: 'robux',
  },
  judy: {
    id: 'judy',
    nameAr: 'جودي',
    nameEn: 'Judy',
    age: 9,
    photo: '/judy.png',
    emoji: '⚽',
    interest: 'الرياضة واللياقة',
    interestEn: 'Sports & Fitness',
    interestEmoji: '🏅',
    color: 'from-green-400 to-teal-500',
    colorLight: 'bg-green-50',
    colorBorder: 'border-green-300',
    colorText: 'text-green-700',
    colorRing: 'ring-green-300',
    gradeLevel: 3,
    difficulty: 'easy',
    dadToneAr: 'يا جودي بطلتي',
    dadToneEn: 'my little champion Judy',
    storageKey: 'judy',
    pin: '3456',
    rewardType: 'vbucks',
  },
  noah: {
    id: 'noah',
    nameAr: 'نوح',
    nameEn: 'Noah',
    age: 7,
    photo: '/noah.png',
    emoji: '🚗',
    interest: 'السيارات والمركبات',
    interestEn: 'Cars & Vehicles',
    interestEmoji: '🏎️',
    color: 'from-orange-400 to-yellow-500',
    colorLight: 'bg-orange-50',
    colorBorder: 'border-orange-300',
    colorText: 'text-orange-700',
    colorRing: 'ring-orange-300',
    gradeLevel: 1,
    difficulty: 'easy',
    dadToneAr: 'يا نوح حبيب بابا',
    dadToneEn: 'my little Noah',
    storageKey: 'noah',
    pin: '4567',
    rewardType: 'robux',
  },
};

export const CHILDREN_ORDER: ChildId[] = ['linda', 'adam', 'judy', 'noah'];

export function getChild(id: ChildId): ChildProfile {
  return CHILDREN[id];
}
