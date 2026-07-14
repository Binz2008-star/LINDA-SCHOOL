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

export type LessonMode = 'picture_card' | 'letter_trace' | 'word_match' | 'quiz' | 'reading' | 'fill_blank';

export interface PictureCard {
  emoji: string;
  wordAr: string;
  wordEn: string;
  soundHint?: string; // phonetic hint for reading
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

// ── Noah (7) — Early Learner ─────────────────────────────────────
const noahLessons: Lesson[] = [
  {
    id: 'noah-letters-ar',
    childId: 'noah',
    subject: 'القراءة والكتابة',
    title: 'الحروف الأبجدية',
    titleEn: 'Arabic Alphabet',
    emoji: '🔤',
    mode: 'letter_trace',
    ageGroup: 'early',
    letters: ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر'],
    lessonBody: 'هيا يا نوح نتعلم الحروف! كل حرف له شكل خاص وصوت مميز 🎵',
    lessonBodyEn: 'Let\'s learn the letters together Noah!',
    questions: [
      {
        id: 'noah-l-1',
        question: 'أيُّ حرفٍ هذا؟ → أ',
        questionEn: 'Which letter is this? → أ',
        options: ['أ', 'ب', 'ج', 'د'],
        correctAnswer: 0,
        explanation: '🌟 هذا هو الحرف "أ" — هو أوّل حرف في الأبجدية! مثل "أسد" 🦁',
        emoji: '🅰️',
      },
      {
        id: 'noah-l-2',
        question: 'أيُّ حرفٍ يبدأ بصوت "ب"؟',
        options: ['أ', 'ب', 'ت', 'ج'],
        correctAnswer: 1,
        explanation: '🎉 الحرف "ب" — مثل كلمة "بيت" 🏠 و"بطّة" 🦆!',
        emoji: '🏠',
      },
      {
        id: 'noah-l-3',
        question: 'ما هو الحرف الذي يبدأ به اسمك "نوح"؟',
        options: ['م', 'ن', 'ه', 'و'],
        correctAnswer: 1,
        explanation: '😄 اسمك "نوح" يبدأ بحرف "ن" — مثل "نجمة" ⭐ و"نهر" 🌊!',
        emoji: '⭐',
      },
    ],
  },
  {
    id: 'noah-numbers',
    childId: 'noah',
    subject: 'الرياضيات',
    title: 'الأرقام 1 إلى 10',
    titleEn: 'Numbers 1 to 10',
    emoji: '🔢',
    mode: 'picture_card',
    ageGroup: 'early',
    pictureCards: [
      { emoji: '🚗', wordAr: 'سيارة واحدة', wordEn: 'One car', soundHint: '١' },
      { emoji: '🚗🚗', wordAr: 'سيارتان', wordEn: 'Two cars', soundHint: '٢' },
      { emoji: '🚗🚗🚗', wordAr: 'ثلاث سيارات', wordEn: 'Three cars', soundHint: '٣' },
      { emoji: '🏎️🏎️🏎️🏎️', wordAr: 'أربع سيارات', wordEn: 'Four cars', soundHint: '٤' },
      { emoji: '🚕🚕🚕🚕🚕', wordAr: 'خمس سيارات', wordEn: 'Five cars', soundHint: '٥' },
    ],
    lessonBody: 'هيا يا نوح نعدّ السيارات! 🚗🚗🚗',
    questions: [
      {
        id: 'noah-n-1',
        question: 'كم سيارة تشاهد؟ 🚗🚗🚗',
        options: ['٢', '٣', '٤', '٥'],
        correctAnswer: 1,
        explanation: '🎊 صحيح! ثلاث سيارات — نعدّ معاً: واحدة، اثنتان، ثلاثة! 🚗🚗🚗',
        emoji: '🚗',
      },
      {
        id: 'noah-n-2',
        question: 'ما هو الرقم الذي يأتي بعد ٤؟',
        options: ['٣', '٦', '٥', '٢'],
        correctAnswer: 2,
        explanation: '⭐ بعد أربعة يأتي خمسة! نعدّ: ١ ٢ ٣ ٤ ٥',
        emoji: '🖐️',
      },
      {
        id: 'noah-n-3',
        question: 'عندك ٣ سيارات وأعطاك بابا ٢ — كم صارت معك؟',
        options: ['٤', '٦', '٥', '٣'],
        correctAnswer: 2,
        explanation: '🚀 ٣ + ٢ = ٥ سيارات! بابا فخور فيك يا نوح!',
        emoji: '🏆',
      },
    ],
  },
  {
    id: 'noah-cars',
    childId: 'noah',
    subject: 'السيارات والمركبات',
    title: 'أنواع السيارات',
    titleEn: 'Types of Vehicles',
    emoji: '🚙',
    mode: 'picture_card',
    ageGroup: 'early',
    pictureCards: [
      { emoji: '🚗', wordAr: 'سيارة', wordEn: 'Car' },
      { emoji: '🚌', wordAr: 'باص', wordEn: 'Bus' },
      { emoji: '🚒', wordAr: 'سيارة إطفاء', wordEn: 'Fire truck' },
      { emoji: '🚑', wordAr: 'إسعاف', wordEn: 'Ambulance' },
      { emoji: '🚛', wordAr: 'شاحنة', wordEn: 'Truck' },
      { emoji: '🏎️', wordAr: 'سيارة سباق', wordEn: 'Race car' },
    ],
    lessonBody: 'يا نوح حبيب بابا! هيا نتعلم أسماء السيارات المختلفة 🚗🚌🚒',
    questions: [
      {
        id: 'noah-c-1',
        question: 'أيُّ مركبة تُستخدم لإطفاء الحرائق؟ 🔥',
        options: ['🚗 سيارة', '🚒 سيارة إطفاء', '🚌 باص', '🚑 إسعاف'],
        correctAnswer: 1,
        explanation: '🚒 سيارة الإطفاء حمراء اللون وتحمل خرطوم الماء! هي تُطفئ النار وتحمي الناس.',
        emoji: '🚒',
      },
      {
        id: 'noah-c-2',
        question: 'ما اسم السيارة التي تنقل المرضى إلى المستشفى؟',
        options: ['🚛 شاحنة', '🏎️ سيارة سباق', '🚑 إسعاف', '🚌 باص'],
        correctAnswer: 2,
        explanation: '🚑 الإسعاف يساعد المرضى ويوصلهم للمستشفى بسرعة — له صوت خاص "يو يو يو"!',
        emoji: '🚑',
      },
      {
        id: 'noah-c-3',
        question: 'السيارة الأسرع في السباقات هي؟',
        options: ['🚌 الباص', '🚛 الشاحنة', '🏎️ سيارة السباق', '🚒 الإطفاء'],
        correctAnswer: 2,
        explanation: '🏎️ سيارة السباق هي الأسرع! محركها قوي جداً ويمكنها الوصول لسرعات هائلة!',
        emoji: '🏁',
      },
    ],
  },
  {
    id: 'noah-words',
    childId: 'noah',
    subject: 'القراءة',
    title: 'كلمات بسيطة',
    titleEn: 'Simple Words',
    emoji: '📖',
    mode: 'word_match',
    ageGroup: 'early',
    words: ['بيت', 'باب', 'نور', 'كتاب', 'قلم', 'ماء'],
    lessonBody: 'هيا نقرأ كلمات بسيطة يا نوح! كل كلمة لها معنى جميل 📖',
    questions: [
      {
        id: 'noah-w-1',
        question: 'أيُّ صورة تناسب كلمة "بيت"؟',
        options: ['🏠', '📚', '✏️', '💧'],
        correctAnswer: 0,
        explanation: '🏠 البيت هو المكان الذي تعيش فيه مع عائلتك الحلوة!',
        emoji: '🏠',
      },
      {
        id: 'noah-w-2',
        question: 'كيف نكتب الرقم ٣ بالحروف؟',
        options: ['اثنان', 'أربعة', 'ثلاثة', 'خمسة'],
        correctAnswer: 2,
        explanation: '🌟 الرقم ٣ يُكتب "ثلاثة" — تبدأ بحرف الثاء!',
        emoji: '3️⃣',
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
  noah:  noahLessons,
  judy:  judyLessons,
  adam:  adamLessons,
  linda: lindaLessons,
};

export function getLessonsForChild(childId: ChildId): Lesson[] {
  return CHILD_LESSONS[childId] ?? [];
}
