export type LearnerId = 'linda' | 'adam' | 'judy' | 'noah';
export type SubjectId = 'arabic' | 'english' | 'math' | 'science' | 'life' | 'interest' | 'technology';

export interface LearnerProfile {
  id: LearnerId;
  nameAr: string;
  nameEn: string;
  age: number;
  photo: string;
  emoji: string;
  gender: 'female' | 'male';
  interestAr: string;
  interestEn: string;
  interestEmoji: string;
  sessionMinutes: number;
  theme: {
    gradient: string;
    light: string;
    border: string;
    text: string;
    ring: string;
  };
}

export interface LessonQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface SchoolLesson {
  id: string;
  subject: SubjectId;
  title: string;
  subtitle: string;
  emoji: string;
  objectives: string[];
  explanation: string[];
  example: string;
  activity: string;
  remember: string;
  visuals?: { emoji: string; label: string }[];
  questions: LessonQuestion[];
  unlockAt?: string; // ISO date; lessons are locked until this date
}

export const LEARNERS: Record<LearnerId, LearnerProfile> = {
  linda: {
    id: 'linda',
    nameAr: 'ليندا',
    nameEn: 'Linda',
    age: 13,
    photo: '/linda.png',
    emoji: '🌸',
    gender: 'female',
    interestAr: 'الحياة والناس والطبيعة',
    interestEn: 'Life, people and nature',
    interestEmoji: '🌿',
    sessionMinutes: 25,
    theme: {
      gradient: 'from-rose-500 to-pink-500',
      light: 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-700',
      ring: 'ring-rose-300',
    },
  },
  adam: {
    id: 'adam',
    nameAr: 'آدم',
    nameEn: 'Adam',
    age: 11,
    photo: '/adam.png',
    emoji: '⚙️',
    gender: 'male',
    interestAr: 'الاختراعات والتكنولوجيا',
    interestEn: 'Inventions and technology',
    interestEmoji: '🔧',
    sessionMinutes: 20,
    theme: {
      gradient: 'from-blue-500 to-cyan-500',
      light: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      ring: 'ring-blue-300',
    },
  },
  judy: {
    id: 'judy',
    nameAr: 'جودي',
    nameEn: 'Judy',
    age: 9,
    photo: '/judy.png',
    emoji: '⚽',
    gender: 'female',
    interestAr: 'الرياضة والحركة',
    interestEn: 'Sports and movement',
    interestEmoji: '🏅',
    sessionMinutes: 15,
    theme: {
      gradient: 'from-green-500 to-teal-500',
      light: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      ring: 'ring-green-300',
    },
  },
  noah: {
    id: 'noah',
    nameAr: 'نوح',
    nameEn: 'Noah',
    age: 7,
    photo: '/noah.png',
    emoji: '🚗',
    gender: 'male',
    interestAr: 'السيارات والمركبات',
    interestEn: 'Cars and vehicles',
    interestEmoji: '🏎️',
    sessionMinutes: 10,
    theme: {
      gradient: 'from-orange-500 to-amber-500',
      light: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      ring: 'ring-orange-300',
    },
  },
};

export const LEARNER_ORDER: LearnerId[] = ['linda', 'adam', 'judy', 'noah'];

export const SUBJECTS: Record<SubjectId, { label: string; emoji: string; description: string }> = {
  arabic: { label: 'اللغة العربية', emoji: '📖', description: 'قراءة، كتابة، فهم وتعبير' },
  english: { label: 'اللغة الإنجليزية', emoji: '🔤', description: 'أصوات، كلمات وجمل يومية' },
  math: { label: 'الرياضيات', emoji: '➕', description: 'أعداد، عمليات وحل مشكلات' },
  science: { label: 'العلوم', emoji: '🔬', description: 'ملاحظة وتجربة وفهم العالم' },
  life: { label: 'مهارات الحياة', emoji: '🧭', description: 'وقت، مال، أمان ومسؤولية' },
  interest: { label: 'مسار الاهتمام', emoji: '✨', description: 'دروس مرتبطة بما يحبه الطفل' },
  technology: { label: 'تكنولوجيا', emoji: '💻', description: 'ابتكار، تصميم واكتشاف التقنية' },
};

function genderWord(learner: LearnerProfile, female: string, male: string): string {
  return learner.gender === 'female' ? female : male;
}

function interestExample(learner: LearnerProfile, kind: 'math' | 'arabic' | 'english' | 'science'): string {
  if (learner.id === 'adam') {
    if (kind === 'math') return 'يريد آدم صنع مركبتين، ولكل مركبة 4 عجلات. نكتب 4 + 4 = 8 عجلات.';
    if (kind === 'arabic') return 'كتب آدم: «صممتُ آلةً صغيرةً تساعد في حمل الأدوات». الجملة تخبرنا من فعل وماذا فعل.';
    if (kind === 'english') return 'Adam can say: “This is my invention.” ثم يحدد: this = هذا، invention = اختراع.';
    return 'عندما يدفع آدم سيارة لعبة، نلاحظ الحركة ثم نسأل: ما القوة التي جعلتها تتحرك؟';
  }

  if (learner.id === 'judy') {
    if (kind === 'math') return 'سجلت جودي 3 أهداف في مباراة وهدفين في مباراة أخرى: 3 + 2 = 5 أهداف.';
    if (kind === 'arabic') return 'كتبت جودي: «تدرّبتُ صباحاً لأنني أحب الرياضة». الجملة فيها فعل ووقت وسبب.';
    if (kind === 'english') return 'Judy can say: “I like sports.” كلمة like تعني أحب، وsports تعني الرياضة.';
    return 'بعد الجري يصبح النبض أسرع. هذه ملاحظة، ثم نسأل لماذا يحتاج الجسم إلى دم وأكسجين أكثر؟';
  }

  if (learner.id === 'noah') {
    if (kind === 'math') return 'لدى نوح سيارتان حمراوان وثلاث سيارات زرقاء: 2 + 3 = 5 سيارات.';
    if (kind === 'arabic') return 'كلمة «سيارة» تبدأ بصوت س، وكلمة «طريق» تبدأ بصوت ط.';
    if (kind === 'english') return 'Noah says: “red car”. red = أحمر، car = سيارة.';
    return 'السيارة تتحرك عندما ندفعها، وتتوقف أسرع عندما يكون الاحتكاك أكبر.';
  }

  if (kind === 'math') return 'نظمت ليندا أسبوعها: يومان للقراءة وثلاثة أيام للأنشطة، فيكون المجموع 2 + 3 = 5 أيام.';
  if (kind === 'arabic') return 'كتبت ليندا: «أحب مراقبة الطبيعة لأنها تجعلني أكثر هدوءاً». الجملة تحمل فكرة وسبباً.';
  if (kind === 'english') return 'Linda can say: “I enjoy nature.” كلمة enjoy تعني أستمتع، وnature تعني الطبيعة.';
  return 'لاحظت ليندا أن النبات يميل نحو الضوء. تصف ما رأته أولاً، ثم تبحث عن تفسير.';
}

function makeCoreLessons(learner: LearnerProfile): SchoolLesson[] {
  const tryWord = genderWord(learner, 'حاولي', 'حاول');
  const readWord = genderWord(learner, 'اقرئي', 'اقرأ');
  const writeWord = genderWord(learner, 'اكتبي', 'اكتب');

  return [
    {
      id: 'arabic-sounds',
      subject: 'arabic',
      title: 'تأسيس القراءة: الصوت والمقطع',
      subtitle: 'نربط شكل الحرف بصوته ثم نبني كلمة.',
      emoji: '🔡',
      objectives: ['تمييز صوت الحرف', 'تقسيم الكلمة إلى مقاطع', 'قراءة كلمات قصيرة', 'عدم التخمين من شكل الكلمة فقط'],
      explanation: [
        'هذا الدرس تأسيس سريع ومحترم، وليس حكماً على العمر أو الذكاء. القراءة تبدأ من معرفة الصوت الذي يمثله كل حرف.',
        'عندما تكون الكلمة صعبة، نقسمها إلى أجزاء صغيرة ثم نضم الأصوات معاً. السرعة تأتي بعد الدقة والفهم.',
      ],
      example: interestExample(learner, 'arabic'),
      activity: `${readWord} الكلمات بصوت مسموع، ثم ${writeWord} كلمتين على ورقة وحدد الحرف الأول في كل كلمة.`,
      remember: 'انطق الصوت، اجمع الأصوات، ثم اقرأ الكلمة كاملة.',
      visuals: learner.id === 'noah' ? [
        { emoji: '🚗', label: 'س — سيارة' },
        { emoji: '🚪', label: 'ب — باب' },
        { emoji: '🌙', label: 'ق — قمر' },
        { emoji: '⭐', label: 'ن — نجمة' },
      ] : undefined,
      questions: [
        {
          question: 'أي كلمة تبدأ بصوت «ب»؟',
          options: ['بيت', 'قلم', 'نور', 'ورد'],
          correctAnswer: 0,
          explanation: 'بيت تبدأ بحرف الباء وصوته «ب». قل الصوت أولاً ثم اقرأ بقية الكلمة.',
        },
        {
          question: 'ما أفضل طريقة لقراءة كلمة صعبة؟',
          options: ['التخمين بسرعة', 'تقسيمها إلى أصوات ومقاطع', 'تجاهلها', 'حفظ شكلها فقط'],
          correctAnswer: 1,
          explanation: 'تقسيم الكلمة يقلل الحمل على الذاكرة ويساعد على قراءة كلمات جديدة، لا الكلمات المحفوظة فقط.',
        },
        {
          question: 'كم مقطعاً في كلمة «مدرسة»؟',
          options: ['مقطع واحد', 'مقطعان', 'ثلاثة مقاطع', 'أربعة مقاطع'],
          correctAnswer: 2,
          explanation: 'مَد-رَ-سة: ثلاثة مقاطع. تقسيم الكلمة يسهل نطقها وقراءتها.',
        },
        {
          question: 'أي حرف يُنطق مثل صوت «ش» في كلمة «شمس»؟',
          options: ['س', 'ش', 'ص', 'ز'],
          correctAnswer: 1,
          explanation: 'حرف الشين صوته «ش» كما في شمس وشجرة وشارع.',
        },
      ],
    },
    {
      id: 'arabic-sentence',
      subject: 'arabic',
      title: 'بناء جملة واضحة',
      subtitle: 'من قام بالفعل؟ ماذا فعل؟ وأين أو لماذا؟',
      emoji: '✍️',
      objectives: ['فهم معنى الجملة', 'تحديد الفاعل والفعل بصورة عملية', 'كتابة فكرة كاملة', 'استخدام نقطة في النهاية'],
      explanation: [
        'الجملة الجيدة تحمل فكرة كاملة. نبدأ بمن أو ما نتحدث عنه، ثم نذكر الفعل، ويمكن أن نضيف المكان أو الوقت أو السبب.',
        'لا نحتاج إلى كلمات صعبة. الوضوح أهم من الطول، وبعد الجملة الأولى يمكن إضافة وصف أو سبب.',
      ],
      example: interestExample(learner, 'arabic'),
      activity: `${writeWord} ثلاث جمل عن يومك: ماذا فعلت، أين فعلته، ولماذا أحببته أو لم تحبه.`,
      remember: 'فكرة واحدة واضحة أفضل من كلمات كثيرة غير مترابطة.',
      questions: [
        {
          question: 'أي عبارة تمثل جملة كاملة؟',
          options: ['في الحديقة', 'لأن الجو جميل', 'قرأ آدم كتاباً', 'بعد الظهر'],
          correctAnswer: 2,
          explanation: '«قرأ آدم كتاباً» جملة كاملة؛ فيها من قام بالفعل، والفعل، والشيء الذي قرأه.',
        },
        {
          question: 'ما العلامة المناسبة في نهاية جملة خبرية؟',
          options: ['النقطة .', 'علامة السؤال ؟', 'الفاصلة فقط ،', 'لا علامة'],
          correctAnswer: 0,
          explanation: 'النقطة تدل على اكتمال الفكرة في الجملة الخبرية.',
        },
        {
          question: 'أي مما يلي يمثل فاعلاً في الجملة؟',
          options: ['بسرعة', 'في المدرسة', 'اللاعب', 'ركض'],
          correctAnswer: 2,
          explanation: 'الفاعل هو من قام بالفعل. «اللاعب» هو الذي يقوم بالعمل في الجملة.',
        },
        {
          question: 'أكمل الجملة: «ذهبت ليندا إلى ___».',
          options: ['تركض', 'السوق', 'بسعادة', 'كان'],
          correctAnswer: 1,
          explanation: 'المكان يكمل الجملة ويجعلها واضحة ومفيدة.',
        },
      ],
    },
    {
      id: 'english-sounds',
      subject: 'english',
      title: 'English foundations: letters and sounds',
      subtitle: 'نسمع الصوت، نراه في الكلمة، ثم ننطقه.',
      emoji: '🔤',
      objectives: ['تمييز بعض أصوات الحروف', 'قراءة كلمات يومية', 'عدم ترجمة كل كلمة منفردة', 'نطق الكلمة بصوت مسموع'],
      explanation: [
        'English reading begins with sounds. A letter can have a common sound that helps us read a new word.',
        'ابدأ بالكلمات المستخدمة يومياً، وكررها في جملة قصيرة. الاستماع والنطق مهمان مثل الكتابة.',
      ],
      example: interestExample(learner, 'english'),
      activity: `قل بصوت مسموع: car, book, water, home. ثم ${writeWord} كل كلمة مرة واحدة باللغة الإنجليزية فقط — لا تكتب الترجمة العربية هنا. مثال: c-a-r`,
      remember: 'Listen, say, read, then write.',
      visuals: learner.id === 'noah' ? [
        { emoji: '🚗', label: 'C — car' },
        { emoji: '🚌', label: 'B — bus' },
        { emoji: '🛣️', label: 'R — road' },
        { emoji: '🛞', label: 'W — wheel' },
      ] : undefined,
      questions: [
        {
          question: 'Which word means «كتاب»?',
          options: ['book', 'road', 'water', 'home'],
          correctAnswer: 0,
          explanation: 'book تعني كتاب. قل الجملة: This is a book.',
        },
        {
          question: 'Which sentence means «أنا أحب الرياضة»?',
          options: ['I like sports.', 'I see a car.', 'This is water.', 'My name is Adam.'],
          correctAnswer: 0,
          explanation: 'I = أنا، like = أحب، sports = الرياضة.',
        },
        {
          question: 'What sound does the letter B make?',
          options: ['"p" sound', '"b" sound like in book', '"d" sound', '"m" sound'],
          correctAnswer: 1,
          explanation: 'B makes the "b" sound — like in book, ball, bus.',
        },
        {
          question: 'Which word starts with the letter W?',
          options: ['home', 'road', 'water', 'book'],
          correctAnswer: 2,
          explanation: 'water starts with W. W sounds like the beginning of "wow".',
        },
      ],
    },
    {
      id: 'english-daily',
      subject: 'english',
      title: 'Everyday English sentences',
      subtitle: 'جمل بسيطة للتعريف والطلب والوصف.',
      emoji: '💬',
      objectives: ['التعريف بالنفس', 'وصف شيء بسيط', 'طلب المساعدة بأدب', 'فهم ترتيب الكلمات'],
      explanation: [
        'A simple English sentence often starts with a person or thing, followed by an action or description.',
        'نستخدم جُملاً قصيرة في البداية، ثم نغير كلمة واحدة لصنع جمل كثيرة.',
      ],
      example: `My name is ${learner.nameEn}. I am ${learner.age}. I like ${learner.interestEn.toLowerCase()}.`,
      activity: `قل ثلاث جمل بصوت مسموع: My name is ___. I am ___. I like ___. ثم ${writeWord} الجمل بالإنجليزية فقط — الكتابة تكون بالحروف الإنجليزية حصراً.`,
      remember: 'ابدأ بجملة صحيحة قصيرة، ثم أضف كلمة جديدة.',
      questions: [
        {
          question: 'How do you ask for help politely?',
          options: ['Help me now.', 'Can you help me, please?', 'You help.', 'No help.'],
          correctAnswer: 1,
          explanation: 'Can you help me, please? طلب مهذب وواضح.',
        },
        {
          question: 'Choose the correct order:',
          options: ['sports I like', 'I sports like', 'I like sports', 'like sports I'],
          correctAnswer: 2,
          explanation: 'الترتيب الصحيح: I + like + sports.',
        },
        {
          question: 'Which sentence introduces yourself correctly?',
          options: ['Name I am.', 'My name is Judy.', 'Is Judy name my.', 'Judy name.'],
          correctAnswer: 1,
          explanation: 'My name is ___ هي الطريقة الصحيحة للتعريف بالنفس.',
        },
        {
          question: 'What does "I am 9" mean?',
          options: ['اسمي 9', 'عمري 9 سنوات', 'لدي 9 أشياء', 'أنا رقم 9'],
          correctAnswer: 1,
          explanation: 'I am + رقم تعني العمر. مثال: I am 9 = عمري 9 سنوات.',
        },
      ],
    },
    {
      id: 'math-numbers',
      subject: 'math',
      title: 'الأعداد والقيمة المكانية',
      subtitle: 'نفهم قيمة الرقم قبل إجراء العمليات.',
      emoji: '🔢',
      objectives: ['قراءة الأعداد', 'فهم الآحاد والعشرات', 'مقارنة عددين', 'ترتيب الأعداد'],
      explanation: [
        'مكان الرقم يغير قيمته. في العدد 34، الرقم 3 يعني ثلاث عشرات، والرقم 4 يعني أربعة آحاد.',
        'يمكن استخدام مكعبات أو أقلام أو رسومات لتمثيل العدد. الأدوات ليست غشاً؛ هي طريقة صحيحة لبناء الفهم.',
      ],
      example: learner.id === 'noah' ? 'لدينا 12 سيارة: مجموعة من 10 سيارات وسيارتان منفصلتان. هذا يعني عشرة + اثنين.' : 'العدد 27 يعني عشرتين و7 آحاد. يمكن رسم مجموعتين كبيرتين وسبع نقاط.',
      activity: `${tryWord} تكوين الأعداد 14 و23 و31 باستخدام أشياء صغيرة أو رسومات، ثم اشرح عدد العشرات والآحاد.`,
      remember: 'انظر إلى مكان الرقم، لا إلى شكله فقط.',
      questions: [
        {
          question: 'في العدد 42، ما قيمة الرقم 4؟',
          options: ['4 آحاد', '4 عشرات', '2 عشرات', '42 مئة'],
          correctAnswer: 1,
          explanation: 'الرقم 4 في منزلة العشرات، لذلك قيمته 40.',
        },
        {
          question: 'أي عدد أكبر؟',
          options: ['18', '81', 'كلاهما متساوٍ', 'لا يمكن معرفة ذلك'],
          correctAnswer: 1,
          explanation: '81 فيه ثماني عشرات، أما 18 ففيه عشرة واحدة فقط.',
        },
        {
          question: 'العدد 56 يعني:',
          options: ['5 آحاد و6 عشرات', '5 عشرات و6 آحاد', '56 مئة', 'عشرة وستة'],
          correctAnswer: 1,
          explanation: '56 = خمس عشرات (50) + ستة آحاد (6).',
        },
        {
          question: 'رتّب من الأصغر إلى الأكبر: 73، 37، 70',
          options: ['70، 73، 37', '37، 70، 73', '73، 37، 70', '37، 73، 70'],
          correctAnswer: 1,
          explanation: '37 أصغر (3 عشرات)، ثم 70 (7 عشرات)، ثم 73 (7 عشرات + 3).',
        },
      ],
    },
    {
      id: 'math-add-subtract',
      subject: 'math',
      title: 'الجمع والطرح كقصة',
      subtitle: 'نفهم ما أُضيف وما أُخذ قبل الحساب.',
      emoji: '➕',
      objectives: ['تمييز الجمع من الطرح', 'تمثيل المسألة برسم', 'التحقق من الإجابة', 'شرح طريقة الحل'],
      explanation: [
        'الجمع يعني أن الكمية ازدادت أو اجتمعت، والطرح يعني أن كمية أُخذت أو أننا نبحث عن الفرق.',
        'قبل الحساب اسأل: ماذا كان لدينا؟ ماذا تغير؟ وما المطلوب؟',
      ],
      example: interestExample(learner, 'math'),
      activity: `${tryWord} حل المسألة باستخدام أشياء حقيقية أو رسم، ثم اشرح لماذا استخدمت الجمع أو الطرح.`,
      remember: 'افهم القصة أولاً، ثم اختر العملية.',
      questions: [
        {
          question: 'كان لديك 7 أقلام وأعطيت صديقك قلمين. ما العملية المناسبة؟',
          options: ['7 + 2', '7 - 2', '7 × 2', '7 ÷ 2'],
          correctAnswer: 1,
          explanation: 'الكمية نقصت لأنك أعطيت قلمين، لذلك نستخدم الطرح: 7 - 2 = 5.',
        },
        {
          question: 'في صندوق 6 كرات وأضفنا 3. كم أصبح العدد؟',
          options: ['3', '8', '9', '18'],
          correctAnswer: 2,
          explanation: 'أضفنا كمية جديدة، لذلك 6 + 3 = 9.',
        },
        {
          question: 'اشترت جودي 5 كرات ثم اشترت 3 أخرى. كم الآن؟',
          options: ['2', '7', '8', '15'],
          correctAnswer: 2,
          explanation: '5 + 3 = 8. الجمع يعني أن الكمية ازدادت.',
        },
        {
          question: 'أي جملة تصف عملية طرح؟',
          options: ['أضفنا لاعباً جديداً', 'تبقى لدينا 3 تفاحات بعد أن أكلنا 2', 'جمعنا عددين معاً', 'ضاعفنا الكمية'],
          correctAnswer: 1,
          explanation: 'الطرح يصف ما يتبقى بعد إزالة كمية. «تبقى 3 بعد أن أكلنا 2» = طرح.',
        },
      ],
    },
    {
      id: 'math-groups',
      subject: 'math',
      title: 'المجموعات والضرب',
      subtitle: 'الضرب طريقة مختصرة لجمع مجموعات متساوية.',
      emoji: '✖️',
      objectives: ['فهم معنى الضرب', 'رسم مجموعات متساوية', 'ربط الضرب بالجمع', 'فهم القسمة كتوزيع'],
      explanation: [
        '3 × 4 يمكن فهمها على أنها ثلاث مجموعات، في كل مجموعة أربعة أشياء. نكتب 4 + 4 + 4 = 12.',
        'القسمة تعني توزيع كمية بالتساوي أو معرفة عدد المجموعات.',
      ],
      example: learner.id === 'judy' ? 'ثلاثة فرق، في كل فريق 4 لاعبين: 4 + 4 + 4 = 12 لاعباً.' : learner.id === 'adam' ? 'ثلاث آلات، ولكل آلة بطاريتان: 2 + 2 + 2 = 6 بطاريات.' : learner.id === 'noah' ? 'صفّان من السيارات، في كل صف 3 سيارات: 3 + 3 = 6.' : 'أربع مجموعات قراءة، في كل مجموعة كتابان: 2 + 2 + 2 + 2 = 8 كتب.',
      activity: 'ارسم 3 مجموعات، وضع 4 نقاط في كل مجموعة، ثم عدّ المجموع واكتب عملية الضرب.',
      remember: 'الضرب = مجموعات متساوية، والقسمة = توزيع متساوٍ.',
      questions: [
        {
          question: 'ما معنى 3 × 2؟',
          options: ['3 + 2 فقط', 'ثلاث مجموعات في كل منها 2', 'طرح 2 من 3', 'تقسيم 3 على 2'],
          correctAnswer: 1,
          explanation: '3 × 2 تعني ثلاث مجموعات متساوية، في كل مجموعة عنصران: 2 + 2 + 2 = 6.',
        },
        {
          question: 'لدينا 12 قطعة نوزعها بالتساوي على 3 أشخاص. كم لكل شخص؟',
          options: ['3', '4', '6', '9'],
          correctAnswer: 1,
          explanation: '12 ÷ 3 = 4؛ لأن 4 + 4 + 4 = 12.',
        },
        {
          question: 'ما ناتج 4 × 5؟',
          options: ['9', '15', '20', '25'],
          correctAnswer: 2,
          explanation: '4 × 5 = أربع مجموعات كل منها 5: 5+5+5+5 = 20.',
        },
        {
          question: 'أي عملية تعني «توزيع 18 على 6»؟',
          options: ['18 + 6', '18 − 6', '18 × 6', '18 ÷ 6'],
          correctAnswer: 3,
          explanation: 'القسمة هي التوزيع المتساوي. 18 ÷ 6 = 3.',
        },
      ],
    },
    {
      id: 'science-method',
      subject: 'science',
      title: 'كيف نفكر مثل العلماء؟',
      subtitle: 'نلاحظ، نسأل، نتوقع، ثم نبحث عن دليل.',
      emoji: '🔍',
      objectives: ['التفريق بين الملاحظة والتفسير', 'طرح سؤال واضح', 'اقتراح تجربة آمنة', 'تغيير الرأي عند ظهور دليل'],
      explanation: [
        'الملاحظة هي شيء رأيناه أو سمعناه أو قسناه. التفسير هو السبب الذي نقترحه لشرح الملاحظة.',
        'العالم لا يخجل من أن يكون توقعه غير صحيح. النتيجة الجديدة تساعده على فهم أفضل.',
      ],
      example: interestExample(learner, 'science'),
      activity: 'اختر شيئاً في المنزل، اكتب ملاحظتين عنه، ثم اكتب سؤالاً واحداً يبدأ بـ«لماذا» أو «ماذا يحدث إذا».',
      remember: 'قل ما رأيته أولاً، ثم اقترح السبب.',
      questions: [
        {
          question: 'أي عبارة تمثل ملاحظة؟',
          options: ['النبات حزين', 'طول النبات 12 سم', 'النبات يحب الضوء', 'التربة سيئة'],
          correctAnswer: 1,
          explanation: '12 سم قياس يمكن التحقق منه، لذلك هو ملاحظة. أما بقية العبارات فتحتاج دليلاً أو تفسيراً.',
        },
        {
          question: 'ماذا نفعل عندما تخالف النتيجة توقعنا؟',
          options: ['نخفي النتيجة', 'نغيّر النتيجة', 'نراجع الفكرة ونتعلم من الدليل', 'نتوقف عن التجربة'],
          correctAnswer: 2,
          explanation: 'الدليل أهم من التوقع. نراجع الفكرة ونبحث عن تفسير أفضل.',
        },
        {
          question: 'أي سؤال يصلح لتجربة علمية؟',
          options: ['هل النبات جميل؟', 'هل ينمو النبات أسرع في الضوء أم الظلام؟', 'لماذا أحب النبات؟', 'من زرع النبات؟'],
          correctAnswer: 1,
          explanation: 'السؤال العلمي يقبل التحقق والقياس. «في الضوء أم الظلام» يمكن اختباره.',
        },
        {
          question: 'ما الفرق بين الملاحظة والتفسير؟',
          options: ['لا فرق بينهما', 'الملاحظة رأي، والتفسير حقيقة', 'الملاحظة ما نقيسه أو نراه، والتفسير السبب المقترح', 'التفسير دائماً صحيح'],
          correctAnswer: 2,
          explanation: 'الملاحظة: «الورقة اصفرّت». التفسير: «ربما لأن التربة جافة». الأول مؤكد، والثاني مقترح.',
        },
      ],
    },
    {
      id: 'life-time',
      subject: 'life',
      title: 'الوقت والخطة اليومية',
      subtitle: 'نقسم اليوم إلى مهام قصيرة مع وقت للراحة.',
      emoji: '⏰',
      objectives: ['قراءة الساعة الأساسية', 'ترتيب المهام', 'تقدير مدة النشاط', 'الموازنة بين الدراسة والراحة'],
      explanation: [
        `جلسة ${learner.nameAr} المناسبة الآن نحو ${learner.sessionMinutes} دقيقة، ثم استراحة قصيرة. الجلسات الصغيرة المنتظمة أفضل من جلسة طويلة مرهقة.`,
        'نضع أهم مهمة أولاً، ونقسم المهمة الكبيرة إلى خطوات يمكن إنجازها.',
      ],
      example: `خطة بسيطة: ${learner.sessionMinutes} دقيقة تعلّم، 5 دقائق حركة أو ماء، ثم نشاط عملي قصير.`,
      activity: 'اكتب خطة الغد بثلاثة أوقات: وقت للتعلّم، وقت للحركة، ووقت للراحة أو الأسرة.',
      remember: 'القليل المنتظم يبني مهارة قوية.',
      questions: [
        {
          question: 'ما الخطة الأفضل للتعلّم؟',
          options: ['ساعات طويلة بلا راحة', 'جلسات قصيرة منتظمة مع راحة', 'الدراسة فقط عند الامتحان', 'ترك كل المهام لآخر اليوم'],
          correctAnswer: 1,
          explanation: 'الانتظام والراحة يساعدان الدماغ على التركيز وتثبيت المعلومات.',
        },
        {
          question: 'عندما تكون المهمة كبيرة، ماذا نفعل؟',
          options: ['نتجاهلها', 'نقسمها إلى خطوات صغيرة', 'نبدأ أصعب جزء بلا خطة', 'نطلب من غيرنا فعلها'],
          correctAnswer: 1,
          explanation: 'تقسيم المهمة يجعل البداية واضحة ويقلل الشعور بالضغط.',
        },
        {
          question: 'كم دقيقة تعلّم تناسب جلسة مركّزة لطفل في سن المدرسة؟',
          options: ['5 دقائق فقط', '15-30 دقيقة ثم استراحة', 'ساعتان متواصلتان', 'يوم كامل'],
          correctAnswer: 1,
          explanation: 'الدماغ يحتاج استراحة لتثبيت المعلومات. 15-30 دقيقة مثالية ثم 5 دقائق حركة.',
        },
        {
          question: 'أي تصرف يدل على إدارة وقت جيدة؟',
          options: ['تأجيل كل شيء للغد', 'بدء المهمة الأهم أولاً', 'العمل بلا توقف حتى التعب', 'القيام بكل المهام معاً'],
          correctAnswer: 1,
          explanation: 'بدء الأهم أولاً يضمن إنجاز ما له قيمة حقيقية حتى لو ضاق الوقت.',
        },
      ],
    },
    {
      id: 'life-money-safety',
      subject: 'life',
      title: 'المال والأمان في الحياة اليومية',
      subtitle: 'نحسب ما نحتاجه ونتصرف بأمان ومسؤولية.',
      emoji: '🛡️',
      objectives: ['تمييز الحاجة من الرغبة', 'حساب مبلغ بسيط', 'اتباع قواعد الأمان', 'طلب المساعدة من شخص موثوق'],
      explanation: [
        'الحاجة شيء أساسي مثل الطعام والدواء، أما الرغبة فهي شيء نحبه لكن يمكن تأجيله. التخطيط للمال يبدأ بمعرفة الفرق.',
        'في الشارع والإنترنت والمنزل، نتوقف ونفكر قبل التصرف، ولا نشارك معلومات خاصة مع الغرباء.',
      ],
      example: 'إذا كان معك 20 درهماً واشتريت شيئاً بـ12 درهماً، يتبقى 8 دراهم. قبل الشراء نسأل: هل أحتاجه الآن؟',
      activity: 'اكتب ثلاث حاجات وثلاث رغبات. ثم اذكر قاعدة أمان واحدة في الطريق وقاعدة واحدة على الإنترنت.',
      remember: 'توقف، فكر، ثم اختر التصرف الآمن.',
      questions: [
        {
          question: 'أي مثال يمثل حاجة أساسية؟',
          options: ['لعبة جديدة', 'دواء وصفه الطبيب', 'زينة للهاتف', 'حلوى إضافية'],
          correctAnswer: 1,
          explanation: 'الدواء حاجة مرتبطة بالصحة، أما الخيارات الأخرى فيمكن تأجيلها.',
        },
        {
          question: 'ماذا تفعل إذا طلب شخص غريب عنوان المنزل عبر الإنترنت؟',
          options: ['أرسله بسرعة', 'أرسله إذا كان لطيفاً', 'لا أرسله وأخبر شخصاً بالغاً موثوقاً', 'أرسل صورة فقط'],
          correctAnswer: 2,
          explanation: 'العنوان معلومة خاصة. لا تشاركها، وأخبر الأب أو الأم أو شخصاً بالغاً موثوقاً.',
        },
        {
          question: 'معك 15 درهماً واشتريت غداءً بـ9 دراهم. كم تبقى معك؟',
          options: ['4', '6', '7', '24'],
          correctAnswer: 1,
          explanation: '15 − 9 = 6 دراهم. دائماً احسب الباقي قبل أن تقرر شراء شيء آخر.',
        },
        {
          question: 'أي من التالي يُعد «رغبة» وليس «حاجة»؟',
          options: ['الماء', 'الملابس الشتوية', 'لعبة فيديو جديدة', 'الطعام اليومي'],
          correctAnswer: 2,
          explanation: 'لعبة الفيديو شيء نحبه لكن يمكن تأجيله، بينما الحاجات أساسية للحياة.',
        },
      ],
    },
  ];
}

function makeInterestLessons(learner: LearnerProfile): SchoolLesson[] {
  if (learner.id === 'adam') {
    return [
      {
        id: 'interest-adam-machines',
        subject: 'interest',
        title: 'الآلات البسيطة والاختراع',
        subtitle: 'كيف تساعدنا الرافعة والعجلة والمنحدر؟',
        emoji: '🛠️',
        objectives: ['معرفة معنى الآلة البسيطة', 'ربط القوة بالحركة', 'اختيار أداة مناسبة', 'رسم فكرة اختراع'],
        explanation: [
          'الآلة البسيطة لا تصنع الطاقة، لكنها تجعل العمل أسهل بتغيير مقدار القوة أو اتجاهها.',
          'من أمثلتها الرافعة والعجلة والمحور والمنحدر. تجمع الاختراعات الكبيرة أكثر من آلة بسيطة.',
        ],
        example: 'عربة الأدوات تستخدم العجلات لتقليل الاحتكاك، والمقبض يعمل كرافعة تساعد على التحكم.',
        activity: 'صمم على ورقة أداة تساعد على نقل صندوق. ارسم الأجزاء واكتب وظيفة كل جزء.',
        remember: 'المخترع يبدأ بمشكلة واضحة، ثم يجرب حلاً ويعدله.',
        questions: [
          { question: 'ما فائدة المنحدر؟', options: ['يزيد وزن الجسم', 'يساعد على رفع الجسم بقوة أقل عبر مسافة أطول', 'يوقف الحركة دائماً', 'يصنع الكهرباء'], correctAnswer: 1, explanation: 'المنحدر يوزع العمل على مسافة أطول، فيقل مقدار القوة المطلوبة.' },
          { question: 'ما أول خطوة في الاختراع؟', options: ['شراء أدوات كثيرة', 'تحديد المشكلة التي نريد حلها', 'نسخ أي جهاز', 'رسم شكل جميل فقط'], correctAnswer: 1, explanation: 'الاختراع الجيد يبدأ بفهم المشكلة والمستخدم والحاجة.' },
        ],
      },
      {
        id: 'interest-adam-design',
        subject: 'interest',
        title: 'دورة التصميم الهندسي',
        subtitle: 'اسأل، تخيل، صمم، جرّب، ثم حسّن.',
        emoji: '💡',
        objectives: ['تحويل الفكرة إلى خطوات', 'اختبار نموذج بسيط', 'تسجيل ما نجح وما لم ينجح', 'تحسين التصميم'],
        explanation: ['المهندس لا ينتظر فكرة كاملة من المرة الأولى. يبني نموذجاً بسيطاً، يختبره، ثم يستخدم النتيجة لتحسينه.'],
        example: 'يمكن بناء جسر من الورق، وضع عملات فوقه، ثم تغيير شكل الطيّات ليحمل وزناً أكبر.',
        activity: 'اصنع جسراً من ورقة واحدة وشريط لاصق. اختبر كم قطعة صغيرة يحمل، ثم عدّل التصميم.',
        remember: 'فشل النموذج معلومة تساعد على التصميم التالي.',
        questions: [
          { question: 'بعد اختبار النموذج، ما الخطوة الصحيحة؟', options: ['رميه فوراً', 'تسجيل النتيجة وتحسين التصميم', 'ادعاء أنه نجح', 'عدم التجربة مرة أخرى'], correctAnswer: 1, explanation: 'الاختبار يعطي بيانات. نستخدمها لتعديل الجزء الضعيف.' },
          { question: 'ما هو النموذج الأولي؟', options: ['المنتج النهائي دائماً', 'نسخة بسيطة لاختبار الفكرة', 'إعلان للمنتج', 'قائمة أسعار'], correctAnswer: 1, explanation: 'النموذج الأولي نسخة مبكرة تساعد على التعلم قبل بناء المنتج النهائي.' },
        ],
      },
      {
        id: 'interest-adam-coding',
        subject: 'interest',
        title: 'التفكير البرمجي — أوامر وشروط',
        subtitle: 'كيف يفكر الكمبيوتر خطوة بخطوة؟',
        emoji: '💻',
        objectives: ['فهم التسلسل في البرمجة', 'استخدام شرط if/else', 'قراءة كود بسيط', 'كتابة خوارزمية بلغة عادية'],
        explanation: [
          'البرنامج قائمة من الأوامر تُنفَّذ بالترتيب. الكمبيوتر لا يخمن — يفعل بالضبط ما نقول.',
          'الشرط if/else يعني: إذا كان هذا صحيحاً افعل كذا، وإلا افعل شيئاً آخر.',
        ],
        example: 'if (درجة >= 90) قل "ممتاز"، else if (درجة >= 70) قل "جيد"، else قل "راجع الدرس".',
        activity: 'اكتب خوارزمية بسيطة لتحضير وجبة: اذكر الخطوات بالترتيب واستخدم شرطاً واحداً على الأقل (if / else).',
        remember: 'الكمبيوتر ذكي فقط لأنه ينفذ تعليماتنا بدقة — نحن من نفكر.',
        questions: [
          { question: 'ما معنى التسلسل في البرمجة؟', options: ['تنفيذ الأوامر بشكل عشوائي', 'تنفيذ الأوامر بالترتيب من الأعلى للأسفل', 'تجاهل بعض الأوامر', 'تنفيذ الأمر الأخير أولاً'], correctAnswer: 1, explanation: 'البرنامج ينفذ كل أمر بالترتيب تماماً كالوصفة.' },
          { question: 'ماذا يعني if (x > 10)?', options: ['x يساوي 10', 'إذا كان x أكبر من 10 نفذ الكتلة التالية', 'x أصغر من 10', 'افعل الأمر 10 مرات'], correctAnswer: 1, explanation: 'if يشترط: نفذ الكتلة فقط إذا كان الشرط صحيحاً.' },
          { question: 'ما الفرق بين if وelse؟', options: ['لا فرق بينهما', 'if ينفذ إذا كان الشرط صحيحاً، else ينفذ إذا كان خاطئاً', 'else دائماً يُنفَّذ أولاً', 'if يوقف البرنامج'], correctAnswer: 1, explanation: 'if/else يغطيان كلا الحالتين: شرط صحيح وشرط خاطئ.' },
          { question: 'أي مثال يشبه خوارزمية؟', options: ['رسم عشوائي', 'وصفة طبخ بخطوات مرتبة', 'قائمة أسماء', 'صورة ملونة'], correctAnswer: 1, explanation: 'الخوارزمية كالوصفة: خطوات مرتبة لتحقيق هدف محدد.' },
        ],
      },
      {
        id: 'interest-adam-space',
        subject: 'interest',
        title: 'الفضاء والتكنولوجيا',
        subtitle: 'كيف تساعد التكنولوجيا البشر في استكشاف الفضاء؟',
        emoji: '🚀',
        objectives: ['معرفة مراحل الصاروخ', 'فهم مفهوم القمر الصناعي', 'ربط الفيزياء بالفضاء', 'تسمية إنجازات بارزة'],
        explanation: [
          'الصاروخ يحتاج سرعة هائلة للتغلب على جاذبية الأرض. يحرق الوقود لينتج دفعاً يرفعه للأعلى.',
          'الأقمار الصناعية تدور حول الأرض وتستخدم في الإنترنت، والتنبؤ بالطقس، وتحديد المواقع GPS.',
        ],
        example: 'الصاروخ Falcon 9 من SpaceX يحمل أقماراً صناعية ثم تعود مرحلته الأولى للهبوط وتُعاد استخدامها.',
        activity: 'ارسم صاروخاً وسمّ أجزاءه الثلاثة الرئيسية: رأس الحمولة، الجسم، والمحركات. اكتب وظيفة كل جزء.',
        remember: 'كل تقنية في الفضاء بدأت بسؤال وفضول — مثلك تماماً.',
        questions: [
          { question: 'لماذا يحتاج الصاروخ سرعة كبيرة؟', options: ['ليكون جميل المظهر', 'للتغلب على جاذبية الأرض والخروج منها', 'لأن الهواء خفيف في الفضاء', 'لأن القمر بعيد فقط'], correctAnswer: 1, explanation: 'الجاذبية تشد الأجسام نحو الأرض — الصاروخ يحتاج سرعة تفوقها.' },
          { question: 'ما وظيفة القمر الصناعي GPS؟', options: ['إضاءة الطريق', 'تحديد موقعك على الأرض بدقة', 'التصوير الفوتوغرافي فقط', 'إرسال رسائل صوتية'], correctAnswer: 1, explanation: 'GPS يُحسب من إشارات أقمار صناعية يستقبلها هاتفك ليعرف موقعك.' },
          { question: 'ما ميزة صاروخ يمكن إعادة استخدامه؟', options: ['أسرع دائماً', 'أرخص لأن لا نصنع مرحلة جديدة في كل مرة', 'أثقل وزناً', 'لا يحتاج وقوداً'], correctAnswer: 1, explanation: 'بناء كل مرحلة يكلف ملايين — إعادة الاستخدام تخفض التكلفة بشكل كبير.' },
          { question: 'ما الذي يدفع الصاروخ للأعلى؟', options: ['المروحة', 'حرق الوقود الذي ينتج دفعاً للأسفل فيرتفع الصاروخ', 'الريح', 'المغناطيس'], correctAnswer: 1, explanation: 'قانون نيوتن الثالث: لكل فعل ردة فعل مساوية ومعاكسة — الدفع للأسفل يرفع الصاروخ للأعلى.' },
        ],
      },
    ];
  }

  if (learner.id === 'judy') {
    return [
      {
        id: 'interest-judy-english-sports',
        subject: 'interest',
        title: 'Sports English — talk about your game',
        subtitle: 'تعلمي الكلمات والجمل الإنجليزية للرياضة.',
        emoji: '🏅',
        objectives: ['قول اسم الرياضة بالإنجليزية', 'وصف الحركة بجملة', 'استخدام can/cannot', 'فهم أوامر الملعب'],
        explanation: [
          'Sports have special words in English. Learning them helps you describe what you do.',
          'نستخدم can لوصف ما نستطيع فعله: I can run fast. I can kick the ball.',
        ],
        example: 'Judy says: "I play football. I can run fast. My team scored 3 goals."',
        activity: 'قولي جملتين بالإنجليزية عن رياضتك المفضلة واكتبيهما بالإنجليزية فقط. مثال: I like football. I can jump high.',
        remember: 'I can + verb — تخبر الناس بما تستطيعين فعله.',
        questions: [
          {
            question: 'How do you say «أستطيع الجري» in English?',
            options: ['I running.', 'I can run.', 'Run I can.', 'Can running I.'],
            correctAnswer: 1,
            explanation: 'I can run. — can + فعل بدون to تعني الاستطاعة.',
          },
          {
            question: 'Which word means «كرة القدم»?',
            options: ['basketball', 'tennis', 'football', 'swimming'],
            correctAnswer: 2,
            explanation: 'football = كرة القدم. Basketball = كرة السلة.',
          },
          {
            question: 'Complete: "My team ___ 3 goals."',
            options: ['run', 'scored', 'jumped', 'swam'],
            correctAnswer: 1,
            explanation: 'scored تعني سجّل. My team scored 3 goals = سجّل فريقي 3 أهداف.',
          },
          {
            question: 'What does the coach say to stop the game?',
            options: ['Go!', 'Stop!', 'Jump!', 'Score!'],
            correctAnswer: 1,
            explanation: 'Stop! = قف/توقفي. أوامر الملعب قصيرة وواضحة.',
          },
        ],
      },
      {
        id: 'interest-judy-english-write',
        subject: 'interest',
        title: 'Write about your day in English',
        subtitle: 'كتابة يوميات رياضية قصيرة بالإنجليزية.',
        emoji: '✏️',
        objectives: ['كتابة جملة بداية', 'وصف نشاط بالماضي', 'استخدام because', 'كتابة نهاية مناسبة'],
        explanation: [
          'A diary entry starts with: Today I + فعل. ثم نضيف because لشرح السبب.',
          'الكتابة بالإنجليزية تبدأ بجملة واحدة صحيحة — لا نحتاج جملاً كثيرة.',
        ],
        example: 'Today I played football. I scored two goals. I was happy because my team won.',
        activity: 'اكتبي 3 جمل بالإنجليزية عن نشاط رياضي فعلتِه. ابدئي بـ Today I ... الكتابة تكون بالإنجليزية فقط.',
        remember: 'Today I + verb + because + reason — وصفة جملة كاملة.',
        questions: [
          {
            question: 'How do you start a diary entry?',
            options: ['Yesterday maybe I', 'Today I played football.', 'Football today playing.', 'I football today.'],
            correctAnswer: 1,
            explanation: 'Today I + verb in past tense هي البداية الصحيحة.',
          },
          {
            question: 'Choose the correct past tense sentence:',
            options: ['I play yesterday.', 'I played yesterday.', 'I plays yesterday.', 'Yesterday play I.'],
            correctAnswer: 1,
            explanation: 'الفعل في الماضي يأخذ -ed عادةً: play → played.',
          },
          {
            question: 'Complete: "I was happy ___ my team won."',
            options: ['and', 'but', 'because', 'or'],
            correctAnswer: 2,
            explanation: 'because تربط السبب بالنتيجة. I was happy because = كنت سعيدة لأن.',
          },
          {
            question: 'Which sentence correctly uses "because"?',
            options: ['I tired because.', 'Because I ran fast.', 'I was tired because I ran fast.', 'I ran because fast.'],
            correctAnswer: 2,
            explanation: 'الجملة الكاملة: سبب + because + نتيجة أو نتيجة + because + سبب.',
          },
        ],
      },
      {
        id: 'interest-judy-body',
        subject: 'interest',
        title: 'الجسم أثناء الحركة',
        subtitle: 'القلب والتنفس والعضلات في الرياضة.',
        emoji: '🏃‍♀️',
        objectives: ['ملاحظة النبض', 'فهم دور القلب والرئتين', 'معرفة أهمية الإحماء', 'الاستماع لإشارات الجسم'],
        explanation: ['أثناء الحركة تحتاج العضلات إلى أكسجين وطاقة أكثر، لذلك يزداد التنفس ويضخ القلب الدم بسرعة أكبر.'],
        example: 'قيسي نبضك قبل المشي وبعد دقيقة من الحركة، ثم قارني العددين بهدوء.',
        activity: 'نفذي إحماءً خفيفاً لمدة دقيقتين بإشراف بالغ، ثم سجلي كيف تغير التنفس والنبض.',
        remember: 'الإحماء يجهز الجسم، والماء والراحة جزء من التدريب.',
        questions: [
          { question: 'لماذا يزداد النبض عند الجري؟', options: ['لإيصال دم وأكسجين أكثر للعضلات', 'لأن القلب يتوقف', 'لأن الجسم لا يحتاج طاقة', 'لأن الهواء يصبح أثقل'], correctAnswer: 0, explanation: 'العضلات العاملة تحتاج أكسجين وغذاء أكثر، فيسرع القلب نقل الدم.' },
          { question: 'ما فائدة الإحماء؟', options: ['إرهاق الجسم قبل اللعب', 'تهيئة العضلات والمفاصل وتقليل الإصابات', 'منع شرب الماء', 'إلغاء الراحة'], correctAnswer: 1, explanation: 'الإحماء يرفع الحرارة وتدفق الدم تدريجياً ويهيئ الحركة.' },
        ],
      },
      {
        id: 'interest-judy-sports-math',
        subject: 'interest',
        title: 'الرياضيات في الرياضة',
        subtitle: 'الوقت والمسافة والنتيجة والمتوسط.',
        emoji: '⏱️',
        objectives: ['قراءة نتيجة', 'حساب مجموع النقاط', 'مقارنة زمنين', 'تسجيل التحسن الشخصي'],
        explanation: ['الرياضة مليئة بالرياضيات: نعد النقاط، نقيس الوقت والمسافة، ونقارن نتيجة الشخص بنفسه لا بالآخرين.'],
        example: 'إذا ركضت جودي 20 ثانية ثم 18 ثانية في المحاولة التالية، تحسن زمنها بمقدار ثانيتين.',
        activity: 'اختاري نشاطاً آمناً وعدّي عدد مرات أدائه في 30 ثانية. كرري لاحقاً وقارني نتيجتك السابقة فقط.',
        remember: 'نقارن تقدمك بنتيجتك السابقة، لا بإخوتك.',
        questions: [
          { question: 'كان الزمن 25 ثانية ثم أصبح 22 ثانية. مقدار التحسن؟', options: ['2', '3', '4', '47'], correctAnswer: 1, explanation: '25 - 22 = 3 ثوانٍ.' },
          { question: 'سجل فريق 4 نقاط ثم 3 نقاط. المجموع؟', options: ['1', '7', '12', '43'], correctAnswer: 1, explanation: '4 + 3 = 7 نقاط.' },
        ],
      },
      {
        id: 'interest-judy-cooking',
        subject: 'interest',
        title: 'English in the Kitchen 🍳',
        subtitle: 'تعلمي كلمات الطبخ والوصفات بالإنجليزية.',
        emoji: '🍽️',
        objectives: ['قراءة وصفة بسيطة', 'تسمية أدوات المطبخ', 'استخدام أفعال الطبخ', 'فهم الكميات بالإنجليزية'],
        explanation: [
          'Cooking has its own English words: mix, add, pour, cut, bake. Learning them helps you read any recipe.',
          'نقول: Add two cups of flour. Mix well. Bake for 20 minutes.',
        ],
        example: 'Simple smoothie recipe: Add one banana. Pour half a cup of milk. Mix well. Enjoy!',
        activity: 'اكتبي وصفة بسيطة بالإنجليزية (3-4 جمل). استخدمي: add, mix, put. مثال: First, add the banana.',
        remember: 'First, then, finally — كلمات تُرتّب خطوات الوصفة.',
        questions: [
          { question: 'What does "mix" mean?', options: ['يقطع', 'يخلط', 'يسكب', 'يطبخ في الفرن'], correctAnswer: 1, explanation: 'mix = يخلط. Mix the eggs and flour = اخلط البيض والدقيق.' },
          { question: 'Which tool do you use to pour?', options: ['knife', 'spoon', 'cup', 'oven'], correctAnswer: 2, explanation: 'We pour liquid from a cup or jug. نسكب السائل من الكوب أو الإبريق.' },
          { question: 'Complete: "___ one cup of milk."', options: ['Bake', 'Cut', 'Add', 'Wait'], correctAnswer: 2, explanation: 'Add = أضيف. Add one cup of milk = أضيفي كوباً واحداً من الحليب.' },
          { question: 'What does "bake" mean?', options: ['يسلق في الماء', 'يقلي بالزيت', 'يطبخ في الفرن', 'يقطع'], correctAnswer: 2, explanation: 'bake = يخبز أو يطبخ في الفرن. Bake for 20 minutes = ضعيه في الفرن 20 دقيقة.' },
        ],
      },
      {
        id: 'interest-judy-feelings',
        subject: 'interest',
        title: 'مشاعري وصداقاتي',
        subtitle: 'نفهم مشاعرنا ونتواصل مع الأصدقاء بشكل صحي.',
        emoji: '💛',
        objectives: ['تسمية المشاعر الأساسية', 'التعبير عن المشاعر بكلمات', 'فهم مشاعر الآخرين', 'التصرف الصحيح عند الخلاف'],
        explanation: [
          'المشاعر كلها طبيعية: الفرح، الحزن، الغضب، الخوف، الفخر. المشكلة ليست في المشعر بل في طريقة التصرف.',
          'عندما نسمي ما نشعر به نستطيع التحدث عنه. «أنا حزينة لأن...» أفضل من الصراخ أو الصمت.',
        ],
        example: 'قالت جودي لصديقتها: «حزنتُ عندما لعبتِ بدوني — هل يمكنني الانضمام إليكم؟» فهمت صديقتها وحلّا الأمر معاً.',
        activity: 'ارسمي وجه يعبر عن مشعر تشعرين به هذا الأسبوع. اكتبي جملة تصف سببه: «أشعر بـ... لأن...».',
        remember: 'من يعرف اسم مشعره يستطيع التحكم به بدل أن يتحكم المشعر فيه.',
        questions: [
          { question: 'ما أفضل تصرف عند الشعور بالغضب؟', options: ['الصراخ وإيذاء الآخرين', 'التوقف والتنفس ثم الكلام', 'تجاهل الغضب تماماً', 'الفرار دائماً'], correctAnswer: 1, explanation: 'التوقف والتنفس يهدئ الجهاز العصبي ويمنحنا وقتاً للتفكير قبل الكلام.' },
          { question: 'صديقتك تبدو حزينة. ماذا تفعلين؟', options: ['تجاهلها', 'تسخرين منها', 'تسألينها بهدوء: هل أنتِ بخير؟', 'تخبرين الجميع عنها'], correctAnswer: 2, explanation: 'سؤال هادئ يُشعرها أنك تهتمين — وهذا ما تحتاجه في تلك اللحظة.' },
          { question: 'أكملي: «أشعر بالفرح ___»', options: ['لأنني حزينة', 'لأن فريقي فاز اليوم', 'لكنني لا أعرف', 'لأن المدرسة صعبة'], correctAnswer: 1, explanation: 'ربط المشعر بسببه يساعدك على فهم نفسك وإيصال فكرتك للآخرين.' },
          { question: 'ما معنى التعاطف؟', options: ['الاتفاق مع الآخرين دائماً', 'محاولة فهم مشاعر الآخرين والتعامل معهم بلطف', 'تجنب كل خلاف', 'قول ما يريد الآخر سماعه فقط'], correctAnswer: 1, explanation: 'التعاطف لا يعني الموافقة — يعني تفهّم وجهة نظر الآخر وإحساسه.' },
        ],
      },
    ];
  }

  if (learner.id === 'noah') {
    return [
      {
        id: 'interest-noah-vehicles',
        subject: 'interest',
        title: 'أنواع المركبات ووظائفها',
        subtitle: 'ننظر إلى الصورة، نقرأ الاسم، ونعرف الوظيفة.',
        emoji: '🚙',
        objectives: ['تسمية مركبات شائعة', 'ربط المركبة بوظيفتها', 'قراءة كلمات قصيرة', 'العد باستخدام الصور'],
        explanation: ['لكل مركبة وظيفة: الإسعاف يساعد المرضى، وسيارة الإطفاء تطفئ الحرائق، والحافلة تنقل أشخاصاً كثيرين.'],
        example: '🚑 إسعاف — 🚒 إطفاء — 🚌 حافلة — 🚛 شاحنة',
        activity: 'ارسم مركبتك المفضلة، واكتب حرفها الأول وعدد عجلاتها.',
        remember: 'انظر إلى الشكل، قل الاسم، ثم قل الوظيفة.',
        visuals: [
          { emoji: '🚑', label: 'إسعاف' },
          { emoji: '🚒', label: 'إطفاء' },
          { emoji: '🚌', label: 'حافلة' },
          { emoji: '🚛', label: 'شاحنة' },
        ],
        questions: [
          { question: 'أي مركبة تساعد المرضى؟', options: ['🚒', '🚑', '🏎️', '🚜'], correctAnswer: 1, explanation: '🚑 سيارة الإسعاف تنقل المرضى وتساعد في الطوارئ.' },
          { question: 'كم عجلة في الصورة؟ 🛞🛞🛞🛞', options: ['2', '3', '4', '5'], correctAnswer: 2, explanation: 'نعد: واحدة، اثنتان، ثلاث، أربع.' },
        ],
      },
      {
        id: 'interest-noah-road-safety',
        subject: 'interest',
        title: 'السلامة على الطريق',
        subtitle: 'نتوقف، ننظر، نستمع، ثم نعبر مع بالغ.',
        emoji: '🚦',
        objectives: ['معرفة ألوان الإشارة', 'العبور مع شخص بالغ', 'استخدام حزام الأمان', 'تمييز الرصيف عن الطريق'],
        explanation: ['الأحمر يعني توقف، والأخضر يسمح بالمرور عندما يكون الطريق آمناً. الطفل يعبر مع شخص بالغ ومن مكان مخصص.'],
        example: '🔴 توقف — 🟡 انتبه — 🟢 تحرك عندما يكون الطريق آمناً.',
        activity: 'رتب ثلاث بطاقات بألوان الإشارة وقل معنى كل لون. تدرب مع الأب على النظر يميناً ويساراً في مكان آمن.',
        remember: 'توقف، انظر، استمع، واعبر مع بالغ.',
        visuals: [
          { emoji: '🔴', label: 'توقف' },
          { emoji: '🟡', label: 'انتبه' },
          { emoji: '🟢', label: 'تحرك بأمان' },
          { emoji: '🛡️', label: 'حزام الأمان' },
        ],
        questions: [
          { question: 'ماذا يعني الضوء الأحمر؟', options: ['تحرك بسرعة', 'توقف', 'العب في الطريق', 'اعبر وحدك'], correctAnswer: 1, explanation: 'الأحمر يعني توقف وانتظر.' },
          { question: 'كيف يعبر الطفل الطريق؟', options: ['وحده من أي مكان', 'مع شخص بالغ ومن مكان آمن', 'بالركض بين السيارات', 'من دون النظر'], correctAnswer: 1, explanation: 'نعبر مع بالغ، ونستخدم ممر المشاة عندما يتوفر.' },
        ],
      },
    ];
  }

  return [
    {
      id: 'interest-linda-nature',
      subject: 'interest',
      title: 'قراءة الطبيعة كمحقق علمي',
      subtitle: 'نلاحظ العلاقات بين الكائنات والبيئة.',
      emoji: '🌿',
      objectives: ['وصف نظام بسيط', 'تمييز المنتج والمستهلك', 'فهم الاعتماد المتبادل', 'اقتراح طريقة لحماية البيئة'],
      explanation: ['النظام البيئي مجموعة كائنات حية وعناصر غير حية تؤثر في بعضها. نبدأ بأمثلة بسيطة ثم نبني الفكرة الأكبر.'],
      example: 'النبات يستخدم الضوء والماء، والحشرة تتغذى على النبات، والطائر قد يتغذى على الحشرة. تغير جزء واحد يؤثر في البقية.',
      activity: 'راقبي مكاناً صغيراً قرب المنزل أو من نافذة: اكتبي ثلاثة أشياء حية وشيئين غير حيين وعلاقة واحدة بينها.',
      remember: 'في الطبيعة، التغيير في جزء قد يصل إلى أجزاء أخرى.',
      questions: [
        { question: 'أي كائن يصنع غذاءه باستخدام الضوء؟', options: ['النبات', 'القط', 'الإنسان', 'الفطر'], correctAnswer: 0, explanation: 'النباتات الخضراء تستخدم البناء الضوئي لصنع الغذاء.' },
        { question: 'ما أفضل وصف للنظام البيئي؟', options: ['حيوان واحد', 'كائنات وعناصر بيئية تتفاعل', 'نوع واحد من النباتات', 'مكان بلا حياة'], correctAnswer: 1, explanation: 'النظام البيئي يشمل الكائنات والماء والهواء والتربة والعلاقات بينها.' },
      ],
    },
    {
      id: 'interest-linda-life',
      subject: 'interest',
      title: 'مهارات التفكير واتخاذ القرار',
      subtitle: 'نفهم الخيارات والنتائج والقيم قبل القرار.',
      emoji: '🌱',
      objectives: ['تحديد المشكلة', 'جمع معلومات', 'توقع نتائج الخيارات', 'اختيار قرار قابل للمراجعة'],
      explanation: ['القرار الجيد لا يعني أن النتيجة مضمونة. يعني أننا فهمنا المعلومات، فكرنا في النتائج، واخترنا ما يناسب قيمنا وأماننا.'],
      example: 'عند تنظيم الأسبوع، توازن ليندا بين التعلّم والراحة والأسرة، وتعدل الخطة إذا كانت مرهقة.',
      activity: 'اختاري قراراً بسيطاً هذا الأسبوع. اكتبي خيارين، فائدة ومشكلة لكل خيار، ثم اختاري واذكري السبب.',
      remember: 'توقفي، اجمعي المعلومات، فكري في النتائج، ثم اختاري.',
      questions: [
        { question: 'ما أول خطوة في قرار مهم؟', options: ['التسرع', 'تحديد المشكلة والمعلومات المطلوبة', 'اتباع أي رأي', 'تجاهل النتائج'], correctAnswer: 1, explanation: 'عندما نحدد المشكلة، نعرف ما المعلومات التي نحتاجها.' },
        { question: 'متى نراجع القرار؟', options: ['لا نراجعه أبداً', 'عندما تظهر معلومات أو نتائج جديدة', 'فقط إذا انتقدنا أحد', 'بعد سنوات فقط'], correctAnswer: 1, explanation: 'المرونة تعني تعديل القرار عندما يظهر دليل جديد.' },
      ],
    },
  ];
}

function makeWeeklyLessons(learner: LearnerProfile): SchoolLesson[] {
  // الدرس المفاجئ الأسبوعي: يتغير كل أسبوع حسب التاريخ. ثابت مع التاريخ لكل متعلم.
  const now = new Date();
  const weekIndex = Math.floor(now.getTime() / (7 * 24 * 60 * 60 * 1000));
  const weekLabel = `w${weekIndex}`;

  const sharedChallenges: Record<string, SchoolLesson> = {
    'linda': {
      id: `weekly-${weekLabel}-linda`,
      subject: 'science',
      title: 'تحدي الأسبوع: اكتشاف في المطبخ',
      subtitle: 'تجربة علمية بسيطة بأدوات منزلية.',
      emoji: '🧪',
      objectives: ['مشاهدة تفاعل كيميائي بسيط', 'تسجيل النتائج', 'ربط الظاهرة بالسبب'],
      explanation: ['تغيير اللون أو تكون الفقاعات قد يعني تفاعلاً كيميائياً. نكتب ما نراه ثم نبحث عن السبب.'],
      example: 'عند إضافة الخل إلى صودا الخبز، تتكون فقاعات غاز ثاني أكسيد الكربون. لأن حمض الخل يتفاعل مع القاعدة.',
      activity: 'جهّزي كوباً من الماء وضعي فيه ملعقة صغيرة من صودا الخبز، ثم أضيفي القليل من الخل. اكتبي ما يحدث.',
      remember: 'العلم يبدأ بملاحظة، ثم سؤال، ثم تجربة.',
      questions: [
        { question: 'ما الغاز الذي يتكون في التجربة؟', options: ['ثاني أكسيد الكربون', 'أكسجين', 'هيدروجين', 'نيتروجين'], correctAnswer: 0, explanation: 'تتكون فقاعات من ثاني أكسيد الكربون عند تفاعل الخل (حمض) مع صودا الخبز (قاعدة).' },
        { question: 'لماذا نكتب الملاحظات أولاً؟', options: ['للحفظ فقط', 'لنسجل ما رأينا قبل معرفة السبب', 'لننسى التجربة', 'لنقلد الكتاب'], correctAnswer: 1, explanation: 'الملاحظة الدقيقة قبل التفسير تبني تفكيراً علمياً.' },
      ],
      unlockAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1).toISOString().slice(0, 10),
    },
    'adam': {
      id: `weekly-${weekLabel}-adam`,
      subject: 'technology',
      title: 'تحدي الأسبوع: اختراع من الخردة',
      subtitle: 'اصنع شيئاً مفيداً من مواد بسيطة.',
      emoji: '🔧',
      objectives: ['تحديد مشكلة', 'بناء نموذج أولي', 'اختباره وتحسينه'],
      explanation: ['المخترعون يبدأون بمشكلة صغيرة ويصنعون نماذج بسيطة من مواد متاحة. ليس المهم الجمال، المهم العمل.'],
      example: 'قارورة بلاستيكية كوبريان مقص شريط لاصق = قارورة ماء ذاتية الإغلاق بسيطة.',
      activity: 'ابحث في المنزل عن ثلاث قطع "خردة" (كرتون، زجاجة، أعواد) واصنع أداة صغيرة لحل مشكلة في غرفتك.',
      remember: 'كل اختراع كبير بدأ نموذجاً صغيراً وغير جميل.',
      questions: [
        { question: 'ما الهدف من النموذج الأولي؟', options: ['البيع مباشرة', 'اختبار الفكرة بسرعة', 'الزخرفة', 'تقليد الآخرين'], correctAnswer: 1, explanation: 'النموذج الأولي يختبر الفكرة قبل تكلفة كبيرة.' },
        { question: 'أي مادة مناسبة للتجربة السريعة؟', options: ['خرسانة', 'الكرتون والشريط', 'زجاج سميك', 'معدن ثقيل'], correctAnswer: 1, explanation: 'الكرتون والشريط سهلان التعديل والتصليح.' },
      ],
      unlockAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1).toISOString().slice(0, 10),
    },
    'judy': {
      id: `weekly-${weekLabel}-judy`,
      subject: 'english',
      title: 'تحدي الأسبوع: إنجليزي في الرياضة',
      subtitle: 'نتعلم كلمات جديدة حول الرياضة واللعب.',
      emoji: '⚽',
      objectives: ['حفظ 5 كلمات إنجليزية', 'استخدامها في جملة', 'ربطها برياضة تحبينها'],
      explanation: ['الرياضة تحتوي على كلمات إنجليزية بسيطة: kick, pass, run, team, score. نتعلمها باللعب.'],
      example: 'I pass the ball to my team, then I run fast to score a goal.',
      activity: 'اختر رياضة واحدة واكتب 5 كلمات إنجليزية لها. ردديها وأنت تمارسين الحركة.',
      remember: 'الكلمات تثبت في الذاكرة عندما نربطها بحركة أو شعور.',
      questions: [
        { question: 'ما معنى "score" في الرياضة؟', options: ['يجري', 'يسجل هدفاً', 'يمرر', 'يتسلق'], correctAnswer: 1, explanation: 'تعني "score" أن تسجل نقطة أو هدفاً.' },
        { question: 'أكمل: I ___ the ball to my friend.', options: ['kick', 'pass', 'run', 'score'], correctAnswer: 1, explanation: 'إذا أرسلت الكرة للصديق، فأنت "pass" (تمرر).' },
      ],
      unlockAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1).toISOString().slice(0, 10),
    },
    'noah': {
      id: `weekly-${weekLabel}-noah`,
      subject: 'math',
      title: 'تحدي الأسبوع: أرقام في الألعاب',
      subtitle: 'نجد الأرقام في ألعابنا المفضلة.',
      emoji: '🎲',
      objectives: ['إحصاء الأعداد في لعبة', 'مقارنة أرقام', 'حل مسألة بسيطة من لعبة'],
      explanation: ['الألعاب مليئة بالأرقام: النقاط، الوقت، العدادات. نستخدمها للتفكير الرياضي.'],
      example: 'إذا حصلت على 5 نقاط في الجولة الأولى و 3 في الثانية، فمجموعك 8 نقاط.',
      activity: 'العب لعبة واحدة مع عائلة أو أصدقاء وسجّل النقاط لكل جولة. من الأكثر؟ ما الفرق؟',
      remember: 'الأرقام حولنا، خاصة في اللعب.',
      questions: [
        { question: 'إذا كان لديك 5 نقاط وزدت 3، كم مجموعك؟', options: ['7', '8', '9', '6'], correctAnswer: 1, explanation: '5 + 3 = 8.' },
        { question: 'ما أفضل طريقة لحساب الفرق بين 10 و 6؟', options: ['نجمع', 'نطرح', 'نضرب', 'نقسم'], correctAnswer: 1, explanation: 'لإيجاد الفرق نطرح: 10 - 6 = 4.' },
      ],
      unlockAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1).toISOString().slice(0, 10),
    },
  };

  return learner.id in sharedChallenges ? [sharedChallenges[learner.id]] : [];
}

export function getCurriculum(learner: LearnerProfile): SchoolLesson[] {
  return [...makeCoreLessons(learner), ...makeInterestLessons(learner), ...makeWeeklyLessons(learner)];
}

export function getLessonsBySubject(learner: LearnerProfile, subject: SubjectId): SchoolLesson[] {
  return getCurriculum(learner).filter(lesson => lesson.subject === subject);
}

export function isLessonUnlocked(lesson: SchoolLesson): boolean {
  if (!lesson.unlockAt) return true;
  return new Date(lesson.unlockAt) <= new Date();
}

export function isLessonNew(lesson: SchoolLesson): boolean {
  if (!lesson.unlockAt) return false;
  const unlock = new Date(lesson.unlockAt);
  const now = new Date();
  const diffDays = (now.getTime() - unlock.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 7;
}
