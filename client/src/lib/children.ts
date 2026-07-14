// Family learner configuration.
// Age controls tone and examples; academic content starts from a respectful
// foundation stage until the app has enough evidence to raise difficulty.

export type ChildId = 'linda' | 'adam' | 'judy' | 'noah';
export type LearningStage = 'foundation' | 'developing' | 'independent';

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
  learningStage: LearningStage;
  difficulty: 'easy' | 'medium' | 'hard';
  dadToneAr: string;
  dadToneEn: string;
  storageKey: string;
}

export const CHILDREN: Record<ChildId, ChildProfile> = {
  linda: {
    id: 'linda',
    nameAr: 'ليندا',
    nameEn: 'Linda',
    age: 13,
    photo: '/linda.png',
    emoji: '🌸',
    interest: 'الحياة والناس والطبيعة',
    interestEn: 'Life, People & Nature',
    interestEmoji: '🌿',
    color: 'from-rose-400 to-pink-500',
    colorLight: 'bg-rose-50',
    colorBorder: 'border-rose-300',
    colorText: 'text-rose-700',
    colorRing: 'ring-rose-300',
    learningStage: 'foundation',
    difficulty: 'easy',
    dadToneAr: 'يا ليندا حبيبتي',
    dadToneEn: 'my dear Linda',
    storageKey: 'linda',
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
    learningStage: 'foundation',
    difficulty: 'easy',
    dadToneAr: 'يا آدم يا مخترعي',
    dadToneEn: 'my inventor Adam',
    storageKey: 'adam',
  },
  judy: {
    id: 'judy',
    nameAr: 'جودي',
    nameEn: 'Judy',
    age: 9,
    photo: '/judy.png',
    emoji: '⚽',
    interest: 'الرياضة والحركة',
    interestEn: 'Sports & Movement',
    interestEmoji: '🏅',
    color: 'from-green-400 to-teal-500',
    colorLight: 'bg-green-50',
    colorBorder: 'border-green-300',
    colorText: 'text-green-700',
    colorRing: 'ring-green-300',
    learningStage: 'foundation',
    difficulty: 'easy',
    dadToneAr: 'يا جودي بطلتي',
    dadToneEn: 'my champion Judy',
    storageKey: 'judy',
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
    learningStage: 'foundation',
    difficulty: 'easy',
    dadToneAr: 'يا نوح حبيب بابا',
    dadToneEn: 'my dear Noah',
    storageKey: 'noah',
  },
};

export const CHILDREN_ORDER: ChildId[] = ['linda', 'adam', 'judy', 'noah'];

export function getChild(id: ChildId): ChildProfile {
  return CHILDREN[id];
}

export function getLearningStageLabel(stage: LearningStage): string {
  if (stage === 'independent') return 'مرحلة التعلّم المستقل';
  if (stage === 'developing') return 'مرحلة بناء المهارات';
  return 'المرحلة التأسيسية';
}
