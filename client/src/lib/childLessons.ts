/**
 * childLessons.ts
 * ──────────────────────────────────────────────────────────────────
 * Each child gets a fully customised learning experience:
 *  • Noah  (7)  – game-mode: picture cards, letters, numbers, simple words
 *  • Judy  (9)  – interactive lessons: sports, science, basic maths
 *  • Adam  (11) – inventions, technology, intermediate maths/science
 *  • Linda (13) – nature, life sciences, languages, advanced topics
 * ──────────────────────────────────────────────────────────────────
 */

import { ChildId } from './children';

// ── Types ────────────────────────────────────────────────────────

export type LessonMode = 'picture_card' | 'letter_trace' | 'word_match' | 'quiz' | 'reading' | 'fill_blank' | 'tap_picture';

export interface PictureCard {
  emoji: string;
  wordAr: string;
  wordEn: string;
  soundHint?: string; // phonetic hint for reading
}

// For Noah's tap_picture mode — all visual, no reading
export interface TapRound {
  promptEmoji: string;   // the big emoji shown at top: "what is this?"
  promptLabel: string;   // single Arabic word label shown under prompt
  choices: { emoji: string; label: string; correct: boolean }[];
  celebrationEmoji: string; // shown on correct tap
}

export interface Lesson {
  id: string;
  childId: ChildId;
  subject: string;
  title: string;
  titleEn: string;
  emoji: string;
  mode: LessonMode;
  ageGroup: 'early' | 'primary' | 'middle' | 'upper';
  // Content per mode
  pictureCards?: PictureCard[];
  letters?: string[];             // for letter_trace
  words?: string[];               // for word_match
  readingText?: string;           // paragraph to read
  readingTextEn?: string;
  lessonBody?: string;            // explanatory text shown before quiz
  lessonBodyEn?: string;
  questions?: LessonQuestion[];
  // tap_picture mode — each round shows a prompt emoji + grid of choices
  tapRounds?: TapRound[];
}

export interface LessonQuestion {
  id: string;
  question: string;
  questionEn?: string;
  options: string[];
  optionsEn?: string[];
  correctAnswer: number;
  explanation: string;
  explanationEn?: string;
  emoji?: string;
}

// ── Noah (7) — Early Learner — ALL VISUAL, NO READING ────────────
// tap_picture mode: big emoji prompt → tap the matching picture
const noahLessons: Lesson[] = [
  {
    id: 'noah-vehicles',
    childId: 'noah',
    subject: 'المركبات',
    title: '🚗 السيارات',
    titleEn: 'Vehicles',
    emoji: '�',
    mode: 'tap_picture',
    ageGroup: 'early',
    tapRounds: [
      {
        promptEmoji: '🚒',
        promptLabel: 'سيارة إطفاء',
        celebrationEmoji: '🔥🚒🎉',
        choices: [
          { emoji: '🚒', label: 'إطفاء', correct: true },
          { emoji: '🚗', label: 'سيارة', correct: false },
          { emoji: '🚌', label: 'باص', correct: false },
          { emoji: '🚑', label: 'إسعاف', correct: false },
        ],
      },
      {
        promptEmoji: '🚑',
        promptLabel: 'إسعاف',
        celebrationEmoji: '🚑💙✨',
        choices: [
          { emoji: '🚛', label: 'شاحنة', correct: false },
          { emoji: '🏎️', label: 'سباق', correct: false },
          { emoji: '🚑', label: 'إسعاف', correct: true },
          { emoji: '🚌', label: 'باص', correct: false },
        ],
      },
      {
        promptEmoji: '🏎️',
        promptLabel: 'سيارة سباق',
        celebrationEmoji: '🏁🏎️💨',
        choices: [
          { emoji: '🚗', label: 'سيارة', correct: false },
          { emoji: '�️', label: 'سباق', correct: true },
          { emoji: '🚒', label: 'إطفاء', correct: false },
          { emoji: '🚛', label: 'شاحنة', correct: false },
        ],
      },
      {
        promptEmoji: '🚌',
        promptLabel: 'باص',
        celebrationEmoji: '🚌🎊🌟',
        choices: [
          { emoji: '🚑', label: 'إسعاف', correct: false },
          { emoji: '🚌', label: 'باص', correct: true },
          { emoji: '�️', label: 'سباق', correct: false },
          { emoji: '🚗', label: 'سيارة', correct: false },
        ],
      },
      {
        promptEmoji: '🚛',
        promptLabel: 'شاحنة',
        celebrationEmoji: '🚛💪🎉',
        choices: [
          { emoji: '🚛', label: 'شاحنة', correct: true },
          { emoji: '🚌', label: 'باص', correct: false },
          { emoji: '�', label: 'إطفاء', correct: false },
          { emoji: '🚑', label: 'إسعاف', correct: false },
        ],
      },
    ],
  },
  {
    id: 'noah-animals',
    childId: 'noah',
    subject: 'الحيوانات',
    title: '🦁 الحيوانات',
    titleEn: 'Animals',
    emoji: '🦁',
    mode: 'tap_picture',
    ageGroup: 'early',
    tapRounds: [
      {
        promptEmoji: '🦁',
        promptLabel: 'أسد',
        celebrationEmoji: '🦁👑🎉',
        choices: [
          { emoji: '�', label: 'فيل', correct: false },
          { emoji: '🦁', label: 'أسد', correct: true },
          { emoji: '�', label: 'نمر', correct: false },
          { emoji: '🦒', label: 'زرافة', correct: false },
        ],
      },
      {
        promptEmoji: '🐘',
        promptLabel: 'فيل',
        celebrationEmoji: '🐘💛✨',
        choices: [
          { emoji: '🦏', label: 'وحيد القرن', correct: false },
          { emoji: '�', label: 'تمساح', correct: false },
          { emoji: '🐘', label: 'فيل', correct: true },
          { emoji: '🦛', label: 'فرس النهر', correct: false },
        ],
      },
      {
        promptEmoji: '🦒',
        promptLabel: 'زرافة',
        celebrationEmoji: '🦒🌟🎊',
        choices: [
          { emoji: '🦒', label: 'زرافة', correct: true },
          { emoji: '🦓', label: 'حمار وحشي', correct: false },
          { emoji: '🐘', label: 'فيل', correct: false },
          { emoji: '🦁', label: 'أسد', correct: false },
        ],
      },
      {
        promptEmoji: '🐬',
        promptLabel: 'دولفين',
        celebrationEmoji: '🐬💙🌊',
        choices: [
          { emoji: '🐋', label: 'حوت', correct: false },
          { emoji: '🦈', label: 'قرش', correct: false },
          { emoji: '🐠', label: 'سمكة', correct: false },
          { emoji: '�', label: 'دولفين', correct: true },
        ],
      },
      {
        promptEmoji: '🦋',
        promptLabel: 'فراشة',
        celebrationEmoji: '🦋🌈🎉',
        choices: [
          { emoji: '🐝', label: 'نحلة', correct: false },
          { emoji: '🦋', label: 'فراشة', correct: true },
          { emoji: '�', label: 'دودة', correct: false },
          { emoji: '🐞', label: 'دعسوقة', correct: false },
        ],
      },
    ],
  },
  {
    id: 'noah-numbers',
    childId: 'noah',
    subject: 'الأرقام',
    title: '🔢 الأرقام',
    titleEn: 'Numbers',
    emoji: '�',
    mode: 'tap_picture',
    ageGroup: 'early',
    tapRounds: [
      {
        promptEmoji: '🚗🚗🚗',
        promptLabel: '٣',
        celebrationEmoji: '3️⃣🎉✨',
        choices: [
          { emoji: '1️⃣', label: '١', correct: false },
          { emoji: '2️⃣', label: '٢', correct: false },
          { emoji: '3️⃣', label: '٣', correct: true },
          { emoji: '4️⃣', label: '٤', correct: false },
        ],
      },
      {
        promptEmoji: '⭐⭐',
        promptLabel: '٢',
        celebrationEmoji: '2️⃣⭐🌟',
        choices: [
          { emoji: '2️⃣', label: '٢', correct: true },
          { emoji: '5️⃣', label: '٥', correct: false },
          { emoji: '1️⃣', label: '١', correct: false },
          { emoji: '4️⃣', label: '٤', correct: false },
        ],
      },
      {
        promptEmoji: '🍎🍎🍎🍎🍎',
        promptLabel: '٥',
        celebrationEmoji: '5️⃣🍎🎊',
        choices: [
          { emoji: '3️⃣', label: '٣', correct: false },
          { emoji: '4️⃣', label: '٤', correct: false },
          { emoji: '6️⃣', label: '٦', correct: false },
          { emoji: '5️⃣', label: '٥', correct: true },
        ],
      },
      {
        promptEmoji: '🏀🏀🏀🏀',
        promptLabel: '٤',
        celebrationEmoji: '4️⃣🏀🎉',
        choices: [
          { emoji: '4️⃣', label: '٤', correct: true },
          { emoji: '2️⃣', label: '٢', correct: false },
          { emoji: '7️⃣', label: '٧', correct: false },
          { emoji: '3️⃣', label: '٣', correct: false },
        ],
      },
    ],
  },
  {
    id: 'noah-fruits',
    childId: 'noah',
    subject: 'الفواكه',
    title: '🍎 الفواكه',
    titleEn: 'Fruits',
    emoji: '🍎',
    mode: 'tap_picture',
    ageGroup: 'early',
    tapRounds: [
      {
        promptEmoji: '🍌',
        promptLabel: 'موزة',
        celebrationEmoji: '🍌💛🎉',
        choices: [
          { emoji: '🍎', label: 'تفاحة', correct: false },
          { emoji: '�', label: 'برتقالة', correct: false },
          { emoji: '🍌', label: 'موزة', correct: true },
          { emoji: '🍇', label: 'عنب', correct: false },
        ],
      },
      {
        promptEmoji: '🍓',
        promptLabel: 'فراولة',
        celebrationEmoji: '🍓❤️✨',
        choices: [
          { emoji: '🍓', label: 'فراولة', correct: true },
          { emoji: '🍒', label: 'كرز', correct: false },
          { emoji: '🍎', label: 'تفاحة', correct: false },
          { emoji: '🍑', label: 'خوخ', correct: false },
        ],
      },
      {
        promptEmoji: '🍉',
        promptLabel: 'بطيخ',
        celebrationEmoji: '🍉💚🎊',
        choices: [
          { emoji: '🥝', label: 'كيوي', correct: false },
          { emoji: '🍉', label: 'بطيخ', correct: true },
          { emoji: '�', label: 'ليمون', correct: false },
          { emoji: '🍇', label: 'عنب', correct: false },
        ],
      },
      {
        promptEmoji: '🍇',
        promptLabel: 'عنب',
        celebrationEmoji: '�💜🌟',
        choices: [
          { emoji: '🍊', label: 'برتقالة', correct: false },
          { emoji: '�', label: 'موزة', correct: false },
          { emoji: '🍇', label: 'عنب', correct: true },
          { emoji: '🍓', label: 'فراولة', correct: false },
        ],
      },
    ],
  },
  {
    id: 'noah-colors',
    childId: 'noah',
    subject: 'الألوان',
    title: '🎨 الألوان',
    titleEn: 'Colors',
    emoji: '🎨',
    mode: 'tap_picture',
    ageGroup: 'early',
    tapRounds: [
      {
        promptEmoji: '❤️',
        promptLabel: 'أحمر',
        celebrationEmoji: '❤️🎉🌹',
        choices: [
          { emoji: '❤️', label: 'أحمر', correct: true },
          { emoji: '💙', label: 'أزرق', correct: false },
          { emoji: '�', label: 'أصفر', correct: false },
          { emoji: '💚', label: 'أخضر', correct: false },
        ],
      },
      {
        promptEmoji: '💙',
        promptLabel: 'أزرق',
        celebrationEmoji: '💙🌊✨',
        choices: [
          { emoji: '�', label: 'بنفسجي', correct: false },
          { emoji: '💙', label: 'أزرق', correct: true },
          { emoji: '🖤', label: 'أسود', correct: false },
          { emoji: '🤍', label: 'أبيض', correct: false },
        ],
      },
      {
        promptEmoji: '💛',
        promptLabel: 'أصفر',
        celebrationEmoji: '💛☀️🎊',
        choices: [
          { emoji: '🧡', label: 'برتقالي', correct: false },
          { emoji: '💚', label: 'أخضر', correct: false },
          { emoji: '💛', label: 'أصفر', correct: true },
          { emoji: '❤️', label: 'أحمر', correct: false },
        ],
      },
      {
        promptEmoji: '💚',
        promptLabel: 'أخضر',
        celebrationEmoji: '💚🌿🌟',
        choices: [
          { emoji: '💚', label: 'أخضر', correct: true },
          { emoji: '💙', label: 'أزرق', correct: false },
          { emoji: '💛', label: 'أصفر', correct: false },
          { emoji: '🤎', label: 'بني', correct: false },
        ],
      },
    ],
  },
];

// ── Judy (9) — Primary Learner ───────────────────────────────────
const judyLessons: Lesson[] = [
  {
    id: 'judy-body',
    childId: 'judy',
    subject: 'العلوم',
    title: 'جسم الإنسان',
    titleEn: 'The Human Body',
    emoji: '🏃‍♀️',
    mode: 'quiz',
    ageGroup: 'primary',
    lessonBody: `جسمنا آلة رائعة يا جودي! 💪
يتكوّن من أجهزة متعاونة:
• 🫀 القلب — يضخّ الدم لكل أجزاء الجسم (ينبض 100,000 مرة يومياً!)
• 🫁 الرئتان — تمتصّان الأكسجين الذي نتنفسه
• 🦴 206 عظمة — هيكلنا العظمي يحمينا
• 💪 العضلات — تتقوّى بالرياضة التي تحبينها!`,
    lessonBodyEn: `Your body is an amazing machine, Judy! 💪
It has many systems working together:
• 🫀 Heart — pumps blood 100,000 times a day!
• 🫁 Lungs — absorb the oxygen we breathe
• 🦴 206 bones — our skeleton protects us
• 💪 Muscles — get stronger with the sports you love!`,
    questions: [
      {
        id: 'judy-b-1',
        question: 'كم عظمة في جسم الإنسان البالغ؟',
        options: ['100', '206', '300', '150'],
        correctAnswer: 1,
        explanation: '🦴 206 عظمة! عند الولادة لدينا حوالي 270 عظمة، لكن بعضها يلتحم مع النمو. الرياضة تقوّي العظام!',
        emoji: '🦴',
      },
      {
        id: 'judy-b-2',
        question: 'أيّ عضو يضخّ الدم في جسمك؟',
        options: ['الرئة', 'الكبد', 'القلب', 'المعدة'],
        correctAnswer: 2,
        explanation: '🫀 القلب! يضخّ الدم الذي يحمل الأكسجين والغذاء لكل خلية. رياضتكِ تجعله أقوى!',
        emoji: '🫀',
      },
      {
        id: 'judy-b-3',
        question: 'ماذا يحدث لعضلاتكِ عند ممارسة الرياضة بانتظام؟',
        options: ['تصغر', 'تضعف', 'تتقوّى وتكبر', 'لا يتغير شيء'],
        correctAnswer: 2,
        explanation: '💪 العضلات تكبر وتقوى مع التمرين! هذا لأن الألياف العضلية تتمزق بشكل صغير ثم تُصلح نفسها أقوى!',
        emoji: '💪',
      },
    ],
  },
  {
    id: 'judy-sports-science',
    childId: 'judy',
    subject: 'الرياضة والعلوم',
    title: 'علم الرياضة',
    titleEn: 'Sports Science',
    emoji: '⚽',
    mode: 'quiz',
    ageGroup: 'primary',
    lessonBody: `الرياضة ليست مجرد لعب يا جودي — هي علم! 🔬⚽
• الجري السريع يحتاج عضلات الساق + قلب قوي
• كرة القدم تحتاج توازن + تنسيق + تفكير سريع
• السباحة تعمل على 98% من عضلات الجسم!
• الإحماء قبل الرياضة يمنع الإصابات`,
    questions: [
      {
        id: 'judy-s-1',
        question: 'لماذا يجب الإحماء قبل ممارسة الرياضة؟',
        options: [
          'لأنه قانون في المدرسة فقط',
          'لتسخين العضلات ومنع الإصابات',
          'لأنه يجعل الرياضة أطول',
          'لا فائدة منه',
        ],
        correctAnswer: 1,
        explanation: '🔥 الإحماء يزيد تدفق الدم للعضلات ويجعلها مرنة — هكذا تتجنبين التمزقات العضلية!',
        emoji: '🏃‍♀️',
      },
      {
        id: 'judy-s-2',
        question: 'أيّ رياضة تُحرّك معظم عضلات الجسم دفعة واحدة؟',
        options: ['الجري', 'السباحة', 'كرة القدم', 'القفز'],
        correctAnswer: 1,
        explanation: '🏊‍♀️ السباحة! تستخدم الذراعين والرجلين والظهر والبطن في نفس الوقت — لهذا هي رياضة كاملة!',
        emoji: '🏊‍♀️',
      },
    ],
  },
  {
    id: 'judy-maths',
    childId: 'judy',
    subject: 'الرياضيات',
    title: 'الضرب والقسمة',
    titleEn: 'Multiplication & Division',
    emoji: '✖️',
    mode: 'quiz',
    ageGroup: 'primary',
    lessonBody: `الضرب هو جمع متكرر يا جودي! 🌟
• 3 × 4 = جمع 3 أربع مرات = 3+3+3+3 = 12
• القسمة هي عكس الضرب تماماً
• مثال من الرياضة: فريق من 24 لاعب، كيف توزعينهم على 4 مجموعات متساوية؟ 24 ÷ 4 = 6 لاعبين في كل مجموعة!`,
    questions: [
      {
        id: 'judy-m-1',
        question: 'في مباراة كرة قدم: 7 × 3 = ؟',
        options: ['18', '21', '24', '28'],
        correctAnswer: 1,
        explanation: '⚽ 7 × 3 = 21! فكّري: 7+7+7 = 21. في الملعب: 7 لاعبين × 3 فرق = 21 لاعباً!',
        emoji: '⚽',
      },
      {
        id: 'judy-m-2',
        question: 'عندك 36 كرة توزّعينها على 6 فرق بالتساوي — كم كرة لكل فريق؟',
        options: ['4', '5', '6', '7'],
        correctAnswer: 2,
        explanation: '🎯 36 ÷ 6 = 6 كرات لكل فريق! القسمة تساعدنا على التوزيع العادل.',
        emoji: '🏆',
      },
    ],
  },
];

// ── Adam (11) — Middle Learner ───────────────────────────────────
const adamLessons: Lesson[] = [
  {
    id: 'adam-inventions',
    childId: 'adam',
    subject: 'الاختراعات',
    title: 'أعظم الاختراعات البشرية',
    titleEn: 'Greatest Human Inventions',
    emoji: '⚙️',
    mode: 'quiz',
    ageGroup: 'middle',
    lessonBody: `يا آدم المخترع! هذه أعظم الاختراعات التي غيّرت العالم: 🌍⚙️
• 🔌 الكهرباء (فاراداي/إديسون) — بدونها لا هاتف ولا ضوء
• 💻 الحاسوب (تورينج/فون نيومان 1940s) — أساس كل تكنولوجيا اليوم
• ✈️ الطيارة (أخوان رايت 1903) — أول رحلة كانت 12 ثانية فقط!
• 🌐 الإنترنت (تيم بيرنرز-لي 1989) — ربط العالم كله
• 🔭 المطبعة (غوتنبرغ 1440) — جعلت العلم للجميع`,
    questions: [
      {
        id: 'adam-i-1',
        question: 'من اخترع الإنترنت وفي أيّ عقد؟',
        options: [
          'إديسون — 1880s',
          'تيم بيرنرز-لي — 1989',
          'بيل غيتس — 1975',
          'إيلون ماسك — 2000s',
        ],
        correctAnswer: 1,
        explanation: '🌐 تيم بيرنرز-لي اخترع الـ World Wide Web عام 1989! كان يعمل في CERN وأراد مشاركة المعلومات بين العلماء.',
        emoji: '🌐',
      },
      {
        id: 'adam-i-2',
        question: 'كم دامت أولى رحلات الطائرة لأخوي رايت؟',
        options: ['12 ثانية', '5 دقائق', '30 ثانية', 'ساعة كاملة'],
        correctAnswer: 0,
        explanation: '✈️ 12 ثانية فقط! لكنها غيّرت التاريخ. بعدها بـ 66 سنة — وصلنا القمر! الاختراعات تتطور.',
        emoji: '✈️',
      },
      {
        id: 'adam-i-3',
        question: 'ما المبدأ الفيزيائي الذي يجعل الطائرة تطير؟',
        options: [
          'قوة المحرك فقط تدفعها',
          'فرق الضغط فوق وتحت الجناح (مبدأ برنولي)',
          'ثقل الطائرة أقل من الهواء',
          'المحرك يدفع الهواء للأسفل',
        ],
        correctAnswer: 1,
        explanation: '✈️ مبدأ برنولي! شكل الجناح يجعل الهواء أسرع فوقه من تحته — الهواء الأسرع ضغطه أقل، فيرفع الجناح!',
        emoji: '🔬',
      },
    ],
  },
  {
    id: 'adam-coding',
    childId: 'adam',
    subject: 'التكنولوجيا',
    title: 'كيف تفكّر الحواسيب؟',
    titleEn: 'How Do Computers Think?',
    emoji: '💻',
    mode: 'quiz',
    ageGroup: 'middle',
    lessonBody: `الحاسوب يفهم لغة واحدة فقط: 0 و 1 (ثنائي/Binary) يا آدم! 💻
• كل شيء داخله: صور، أصوات، كلمات — كلها 0 و 1
• 8 خانات = 1 Byte = حرف واحد
• هاتفك يحتوي مليارات من هذه الخانات!
• البرمجة = إعطاء الحاسوب تعليمات خطوة بخطوة`,
    questions: [
      {
        id: 'adam-c-1',
        question: 'ماذا تعني كلمة "Binary" في الحوسبة؟',
        options: [
          'نظام عد أساسه 10',
          'نظام عد أساسه 2 (أصفار وآحاد فقط)',
          'لغة برمجة',
          'نوع من المعالجات',
        ],
        correctAnswer: 1,
        explanation: '💻 Binary = ثنائي! الحاسوب يستخدم 0 و 1 لأن الدوائر الإلكترونية لها حالتان: تيار/لا تيار. بسيط لكنه قوي!',
        emoji: '0️⃣1️⃣',
      },
      {
        id: 'adam-c-2',
        question: 'أيّ من هذه لغات برمجة حقيقية؟',
        options: ['WordScript', 'Python', 'DrawCode', 'ImageLang'],
        correctAnswer: 1,
        explanation: '🐍 Python! لغة برمجة سهلة وقوية — تستخدمها شركات مثل Google وNASA. يمكنك تعلّمها الآن يا آدم!',
        emoji: '🐍',
      },
    ],
  },
  {
    id: 'adam-physics',
    childId: 'adam',
    subject: 'الفيزياء',
    title: 'قوانين نيوتن',
    titleEn: 'Newton\'s Laws',
    emoji: '🍎',
    mode: 'quiz',
    ageGroup: 'middle',
    lessonBody: `إسحاق نيوتن — العالم الذي وضع أسس الفيزياء الحديثة يا آدم! 🍎
القوانين الثلاثة:
1. الجسم الساكن يبقى ساكناً ما لم تؤثر عليه قوة
2. القوة = الكتلة × التسارع (F = ma)
3. لكل فعل ردّ فعل مساوٍ في المقدار ومعاكس في الاتجاه

💡 القانون 3 يفسّر: لماذا تنطلق الصاروخ! الغازات تندفع للخلف ← الصاروخ يطير للأمام`,
    questions: [
      {
        id: 'adam-p-1',
        question: 'بحسب نيوتن، إذا دفعت جداراً بقوة — ماذا يفعل الجدار؟',
        options: [
          'لا يفعل شيئاً',
          'يدفعك بنفس القوة في الاتجاه المعاكس',
          'ينكسر دائماً',
          'يمتص قوتك',
        ],
        correctAnswer: 1,
        explanation: '🧱 القانون الثالث! الجدار يدفعك بنفس قوتك. لهذا يؤلم يدك — الجدار لا يتحرك لأن كتلته أكبر!',
        emoji: '🧱',
      },
      {
        id: 'adam-p-2',
        question: 'لماذا تحتاج المركبة الفضائية محركات في الفضاء رغم أنه لا هواء؟',
        options: [
          'لأن الفضاء له تيارات هوائية',
          'لأن مبدأ رد الفعل لا يحتاج هواء — الغاز يندفع خلفاً والصاروخ أماماً',
          'لأن المركبة تحتاج هواءً للاشتعال',
          'تعمل بالجاذبية فقط',
        ],
        correctAnswer: 1,
        explanation: '🚀 القانون الثالث لا يحتاج وسطاً! الغاز يندفع للخلف بشدة → الصاروخ يندفع للأمام. هذا كيف تعمل كل صواريخ الفضاء!',
        emoji: '🚀',
      },
    ],
  },
];

// ── Linda (13) — Upper Learner ───────────────────────────────────
const lindaLessons: Lesson[] = [
  {
    id: 'linda-ecology',
    childId: 'linda',
    subject: 'علم البيئة',
    title: 'النظم البيئية وتوازن الطبيعة',
    titleEn: 'Ecosystems & Nature\'s Balance',
    emoji: '🌿',
    mode: 'quiz',
    ageGroup: 'upper',
    lessonBody: `النظام البيئي — شبكة حياة متكاملة يا لينيدا 🌿
• كل كائن له دور: منتج، مستهلك، محلّل
• سلسلة الغذاء: نبات → حشرة → ضفدع → ثعبان → نسر
• إزالة أي حلقة تدمّر السلسلة كلها
• المحيطات تنتج 70% من الأكسجين الذي نتنفسه — لا الغابات!
• الانقراض الجماعي السادس يحدث الآن بسبب البشر`,
    questions: [
      {
        id: 'linda-e-1',
        question: 'أيُّ الكائنات "المنتجة" في النظام البيئي؟',
        options: ['الأسد', 'الفطر', 'النباتات الخضراء', 'الديدان'],
        correctAnswer: 2,
        explanation: '🌱 النباتات هي المنتجة الوحيدة — تصنع غذاءها من ضوء الشمس عبر البناء الضوئي. كل الكائنات الأخرى تعتمد عليها!',
        emoji: '🌱',
      },
      {
        id: 'linda-e-2',
        question: 'ما الذي ينتج معظم الأكسجين على كوكبنا؟',
        options: ['غابات الأمازون', 'العشب البري', 'العوالق البحرية في المحيطات', 'الطحالب البرية'],
        correctAnswer: 2,
        explanation: '🌊 العوالق النباتية البحرية (Phytoplankton) تنتج 70% من الأكسجين! غابات الأمازون مهمة لكن المحيطات أكبر دور.',
        emoji: '🌊',
      },
      {
        id: 'linda-e-3',
        question: 'ماذا يحدث لو انقرض نوع واحد من النحل؟',
        options: [
          'لا يتغير شيء مهم',
          'سينقرض الورد فقط',
          'سينهار التلقيح وستختفي 1/3 محاصيل الطعام',
          'ستكثر الأزهار لأن لا شيء يأكلها',
        ],
        correctAnswer: 2,
        explanation: '🐝 النحل يلقّح ثلث طعامنا! بدونه: لا تفاح، لا لوز، لا كثير من الخضروات. انقراض نوع واحد يدمّر السلسلة كلها.',
        emoji: '🐝',
      },
    ],
  },
  {
    id: 'linda-cells',
    childId: 'linda',
    subject: 'علم الأحياء',
    title: 'الخلية — وحدة الحياة',
    titleEn: 'The Cell — Unit of Life',
    emoji: '🔬',
    mode: 'quiz',
    ageGroup: 'upper',
    lessonBody: `الخلية يا لينيدا — أصغر وحدة حية مكتملة! 🔬
• خلية واحدة تستطيع التنفس، التغذية، التكاثر
• جسمك: ~37 تريليون خلية!
• نوعان: خلية نباتية (لها جدار + بلاستيدات) وخلية حيوانية
• DNA = الكود الجيني — 3 مليار قاعدة في كل خلية من جسمك
• كل ثانية: جسمك يصنع 3.8 مليون خلية دم حمراء جديدة`,
    questions: [
      {
        id: 'linda-c-1',
        question: 'ما الفرق الرئيسي بين الخلية النباتية والحيوانية؟',
        options: [
          'الخلية النباتية أكبر دائماً',
          'الخلية النباتية لها جدار خلوي وبلاستيدات خضراء',
          'الخلية الحيوانية لها نواة والنباتية لا',
          'لا فرق بينهما',
        ],
        correctAnswer: 1,
        explanation: '🌿 الجدار الخلوي يعطي النبات صلابته، والبلاستيدات الخضراء (كلوروبلاست) هي مصنع الطاقة عبر التركيب الضوئي!',
        emoji: '🌿',
      },
      {
        id: 'linda-c-2',
        question: 'ما وظيفة الميتوكوندريا في الخلية؟',
        options: [
          'تخزين الماء',
          'صنع البروتينات',
          'إنتاج الطاقة (ATP) من الغذاء',
          'حماية الخلية من الجراثيم',
        ],
        correctAnswer: 2,
        explanation: '⚡ الميتوكوندريا هي "محطة الطاقة"! تحوّل الجلوكوز + الأكسجين إلى طاقة (ATP) يستخدمها الجسم في كل شيء.',
        emoji: '⚡',
      },
    ],
  },
  {
    id: 'linda-climate',
    childId: 'linda',
    subject: 'العلوم البيئية',
    title: 'التغير المناخي والحلول',
    titleEn: 'Climate Change & Solutions',
    emoji: '🌡️',
    mode: 'quiz',
    ageGroup: 'upper',
    lessonBody: `التغير المناخي — أكبر تحدي لجيلك يا لينيدا 🌡️🌍
• ثاني أكسيد الكربون CO₂ يحبس حرارة الشمس كـ"سقف زجاجي"
• منذ الثورة الصناعية: درجة الحرارة ارتفعت 1.1 درجة
• ذوبان الجليد → ارتفاع البحار → غرق المدن الساحلية
• الحلول: طاقة متجددة (شمس/رياح)، تشجير، تقليل النفايات
• جيلك هو الأخير الذي يمكنه إيقاف أسوأ التداعيات`,
    questions: [
      {
        id: 'linda-cl-1',
        question: 'ما هو "تأثير البيت الزجاجي"؟',
        options: [
          'زراعة النباتات داخل منازل زجاجية',
          'احتجاز غازات معينة للحرارة في الغلاف الجوي كالزجاج',
          'انعكاس ضوء الشمس عن الثلج',
          'تلوث الهواء بالمصانع',
        ],
        correctAnswer: 1,
        explanation: '🌡️ غازات كـCO₂ تسمح لضوء الشمس بالدخول لكنها تمنع الحرارة من الخروج — تماماً كالزجاج! هذا يرفع درجة حرارة الأرض.',
        emoji: '🌡️',
      },
      {
        id: 'linda-cl-2',
        question: 'أيّ مصدر طاقة لا يُنتج ثاني أكسيد الكربون؟',
        options: ['الفحم الحجري', 'النفط', 'الغاز الطبيعي', 'الطاقة الشمسية'],
        correctAnswer: 3,
        explanation: '☀️ الطاقة الشمسية نظيفة 100%! الشمس تعطينا في ساعة واحدة طاقة تكفي البشرية سنة كاملة — نحتاج فقط جمعها!',
        emoji: '☀️',
      },
    ],
  },
];

// ── Master map ───────────────────────────────────────────────────
export const CHILD_LESSONS: Record<ChildId, Lesson[]> = {
  noah: noahLessons,
  judy: judyLessons,
  adam: adamLessons,
  linda: lindaLessons,
};

export function getLessonsForChild(childId: ChildId): Lesson[] {
  return CHILD_LESSONS[childId] ?? [];
}
