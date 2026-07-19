export interface QuizQuestion {
  id: string;
  language: 'ar' | 'en';
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  category: string;
  subject: string;   // broad subject area
  lesson?: string;   // specific lesson/unit
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string; // Smart tutor explanation shown after answering
  optionExplanations?: string[]; // Per-option micro-explanation shown inline after answering
}

export const quizQuestions: QuizQuestion[] = [
  // Arabic Questions
  {
    id: 'ar-1',
    language: 'ar',
    question: 'أيُّ سببٍ هو الأكثرُ مباشرةً لحدوثِ كسوفِ الشمس؟',
    options: [
      'توقّفُ الأرضِ عن الدوران حولَ نفسِها',
      'وقوفُ الأرضِ بينَ الشمسِ والقمر',
      'ابتعادُ الشمسِ كثيرًا عن الأرض',
      'وقوفُ القمرِ بينَ الأرضِ والشمس'
    ],
    correctAnswer: 3,
    category: 'Science',
    subject: 'العلوم',
    lesson: 'الفضاء والكواكب',
    difficulty: 'medium',
    explanation: '🌑 كسوف الشمس يحدث عندما يمرّ القمر بيننا وبين الشمس فيحجب ضوءها عنّا. تخيّلي القمر كأنه يقف أمام مصباح كبير ويخفيه! أما عندما تقف الأرض بين الشمس والقمر، فذلك يُسمّى «خسوف القمر» وهو مختلف تمامًا.'
  },
  {
    id: 'ar-2',
    language: 'ar',
    question: 'أيُّ جملةٍ تُعبّرُ عن الفرقِ الأساس بين العددِ الأوليِّ والعددِ المركّب؟',
    options: [
      'العددُ الأوليُّ لهُ عاملانِ فقط، بينما المركّب لهُ أكثرُ من عاملين',
      'العددُ الأوليُّ يكونُ دائمًا عددًا زوجيًّا',
      'العددُ الأوليُّ لا يقبلُ القسمةَ على أيِّ عددٍ أبدًا',
      'العددُ المركّبُ يكونُ دائمًا أكبرَ من العددِ الأولي'
    ],
    correctAnswer: 0,
    category: 'Math',
    subject: 'الرياضيات',
    lesson: 'الأعداد الأولية',
    difficulty: 'medium',
    explanation: '🔢 العدد الأولي له عاملان فقط: 1 ونفسه. مثلاً: 7 = 1×7 فقط، لذا هو أولي. أما العدد المركّب مثل 6 = 1×6 = 2×3، له أكثر من عاملين. نصيحة سهلة: اسألي نفسك "هل يقبل القسمة على شيء غير 1 ونفسه؟" — إذا نعم فهو مركّب!'
  },
  {
    id: 'ar-3',
    language: 'ar',
    question: 'في النصوصِ الأدبيّة، ما الفرقُ الأساس بين «التشبيه» و«الاستعارة»؟',
    options: [
      'التشبيهُ لا يُستخدمُ في الشعرِ أبدًا، والاستعارة خاصّةٌ بالشعر',
      'الاستعارةُ تعني تكرارَ الكلمة، والتشبيه يعني حذفَها',
      'التشبيه يعتمدُ على مقارنةٍ ظاهرة، والاستعارة على تشبيهٍ مخفيّ دونَ أداةِ تشبيه',
      'لا يوجدُ فرق، فكلاهما يعني وصفَ شيءٍ بصفاتٍ جميلة'
    ],
    correctAnswer: 2,
    category: 'Arabic',
    subject: 'اللغة العربية',
    lesson: 'البلاغة',
    difficulty: 'hard',
    explanation: '✍️ التشبيه يقول «هذا كـذاك» بشكل واضح باستخدام أداة مثل الكاف أو «مثل» — كقولنا «هو شجاعٌ كالأسد». أما الاستعارة فتحذف أداة التشبيه وتقول مباشرة «هو أسد» كأن الشخص أصبح أسدًا فعلاً! الاستعارة أقوى تأثيرًا لأنها تندمج بالمعنى.'
  },
  {
    id: 'ar-4',
    language: 'ar',
    question: 'في العلومِ، أيُّ وصفٍ أدقُّ لخاصيّةِ الكثافة في المواد؟',
    options: [
      'هي نسبةُ كتلةِ الجسمِ إلى حجمِه',
      'هي قوّةُ جذبِ الجسمِ للأجسامِ الأخرى',
      'هي مقدارُ الحرارةِ داخلَ الجسم',
      'هي سرعةُ حركةِ الجسمِ عند سقوطِه'
    ],
    correctAnswer: 0,
    category: 'Science',
    subject: 'العلوم',
    lesson: 'خصائص المادة',
    difficulty: 'medium',
    explanation: '⚖️ الكثافة = الكتلة ÷ الحجم. تخيّلي كرة حديد وكرة إسفنج بنفس الحجم — الحديد أثقل لأن كثافته أعلى. لهذا يغوص الحديد في الماء ويطفو الخشب! كلما زادت الكتلة في نفس الحجم، زادت الكثافة.'
  },
  {
    id: 'ar-5',
    language: 'ar',
    question: 'في التاريخِ، أيُّ سببٍ كانَ الأهمَّ في بدايةِ الثورةِ الصناعيّة في أوروبا؟',
    options: [
      'تطوّرُ الزراعةِ وزيادةُ الإنتاجِ الغذائي',
      'اختراعُ الإنترنت',
      'اكتشافُ الكهرباءِ فقط',
      'انهيارُ جميعِ الممالكِ القديمة'
    ],
    correctAnswer: 0,
    category: 'History',
    subject: 'التاريخ',
    lesson: 'الثورة الصناعية',
    difficulty: 'hard',
    explanation: '🏭 الثورة الصناعية (1760-1840) بدأت حين تطوّرت الزراعة وأنتجت طعامًا أكثر، مما أتاح للناس الانتقال للمصانع. ثم جاء اختراع المحرك البخاري ليُحوّل العمل اليدوي إلى آلي. الإنترنت لم يُخترع إلا بعدها بأكثر من قرن ونصف!'
  },
  {
    id: 'ar-6',
    language: 'ar',
    question: 'في الجغرافيا، ما العاملُ الذي يؤثّرُ أكثرَ في اختلافِ الفصولِ الأربعة على الأرض؟',
    options: [
      'تغيّرُ حجمِ الشمسِ كلَّ سنة',
      'ميلُ محورِ دورانِ الأرض عن العمودِ على مدارِها',
      'تغيّرُ المسافةِ بين الأرضِ والشمس بشكلٍ كبير',
      'دورانُ القمرِ حولَ الأرض'
    ],
    correctAnswer: 1,
    category: 'Geography',
    subject: 'الجغرافيا',
    lesson: 'حركة الأرض',
    difficulty: 'hard',
    explanation: '🌍 محور الأرض مائل بزاوية 23.5 درجة. هذا الميل يجعل نصفَي الكرة يتلقّيان كميات مختلفة من ضوء الشمس في أوقات مختلفة من السنة — فيحدث الصيف والشتاء والربيع والخريف. لو كان المحور مستقيمًا لما كان لدينا فصول أربعة!'
  },
  {
    id: 'ar-7',
    language: 'ar',
    question: 'في اللغةِ العربية، ما الجملةُ التي تحتوي على «مفعولٍ لأجله»؟',
    options: [
      'يجلسُ الطفلُ قربَ النافذة',
      'ذهبتُ إلى المكتبةِ صباحًا',
      'الكتابُ جديدٌ ومفيد',
      'درسَ خالدٌ بجدٍّ رغبةً في التفوّق'
    ],
    correctAnswer: 3,
    category: 'Arabic',
    subject: 'اللغة العربية',
    lesson: 'النحو',
    difficulty: 'hard',
    explanation: '📖 المفعول لأجله هو اسم يُذكر لبيان سبب وقوع الفعل ويجيب على سؤال «لماذا؟». في «درسَ خالدٌ رغبةً في التفوّق» — لماذا درس؟ رغبةً! هذه هي المفعول لأجله. أما «صباحًا» فهي ظرف زمان، و«قربَ النافذة» ظرف مكان.'
  },
  {
    id: 'ar-8',
    language: 'ar',
    question: 'في التربيةِ الإسلاميّة، أيُّ تصرّفٍ يُعبّر عن مفهومِ «الأمانة» في الحياةِ اليوميّة؟',
    options: [
      'تجاهلُ تعليماتِ السلامةِ في المختبر',
      'الحديثُ بصوتٍ عالٍ في المكتبة',
      'إلقاءُ النفاياتِ في الطريق',
      'حفظُ السرِّ الذي ائتمنكَ عليه صديقُك'
    ],
    correctAnswer: 3,
    category: 'Islamic Studies',
    subject: 'التربية الإسلامية',
    lesson: 'الأخلاق الإسلامية',
    difficulty: 'easy',
    explanation: '🤝 الأمانة من أسمى الأخلاق الإسلامية — وهي أن تحافظ على ما ائتُمنتَ عليه سواء كان مالاً أو سرًّا أو مسؤولية. قال النبي ﷺ: «أدِّ الأمانةَ إلى مَن ائتمنك». حفظ السرّ هو من أجمل صور الأمانة في العلاقات الإنسانية.'
  },
  {
    id: 'ar-9',
    language: 'ar',
    question: 'في العلومِ، أيُّ تفسيرٍ أدقُّ لسببِ رؤيةِ البرقِ قبلَ سماعِ الرعدِ في العاصفةِ؟',
    options: [
      'لأنَّ الهواءَ يمنعُ الصوتَ من الوصولِ إلينا',
      'لأنّ الصوتَ ينتقلُ أسرعَ من الضوء',
      'لأنّ الضوءَ ينتقلُ أسرعَ من الصوت',
      'لأنَّ البرقَ يحدثُ قبلَ الرعدِ بزمنٍ طويل'
    ],
    correctAnswer: 2,
    category: 'Science',
    subject: 'العلوم',
    lesson: 'الضوء والصوت',
    difficulty: 'medium',
    explanation: '⚡ سرعة الضوء = 300,000 كم/ثانية، بينما سرعة الصوت = 340 م/ثانية فقط! الضوء أسرع بمليون مرة تقريبًا. لذا ترين البرق فورًا، لكن الرعد يصلك بعد ثوانٍ. يمكنك حساب المسافة: كل 3 ثوانٍ بين البرق والرعد ≈ كيلومتر واحد.'
  },
  {
    id: 'ar-10',
    language: 'ar',
    question: 'في الرياضيات، إذا كانتْ سرعةُ سيارةٍ ثابتةً تساوي 60 كم/ساعة، فكم تقطعُ تقريبًا خلالَ 2.5 ساعة؟',
    options: [
      '120 كم',
      '150 كم',
      '90 كم',
      '180 كم'
    ],
    correctAnswer: 1,
    category: 'Math',
    subject: 'الرياضيات',
    lesson: 'السرعة والمسافة',
    difficulty: 'easy',
    explanation: '🚗 المسافة = السرعة × الزمن. إذن: 60 × 2.5 = 150 كم. نصيحة: 2.5 ساعة = ساعتان ونصف. في ساعتين تقطع 120 كم، وفي نصف ساعة إضافية تقطع 30 كم، المجموع = 150 كم. سهل جداً بهذه الطريقة!'
  },
  {
    id: 'ar-11',
    language: 'ar',
    question: 'ما عاصمةُ المملكةِ العربيّةِ السعوديّة؟',
    options: ['جدّة', 'مكّة المكرّمة', 'الرياض', 'الدمام'],
    correctAnswer: 2,
    category: 'Geography',
    subject: 'الجغرافيا',
    lesson: 'دول العالم العربي',
    difficulty: 'easy',
    explanation: '🗺️ الرياض هي عاصمة المملكة العربية السعودية وأكبر مدنها. جدّة هي أكبر ميناء وبوابة الحرمين، ومكة المكرمة هي قبلة المسلمين، لكن العاصمة السياسية والإدارية هي الرياض حيث يقع مقر الحكومة.'
  },
  {
    id: 'ar-12',
    language: 'ar',
    question: 'كم عددُ ركائزِ الإسلامِ الخمسة؟',
    options: ['ثلاثة', 'أربعة', 'خمسة', 'ستة'],
    correctAnswer: 2,
    category: 'Islamic Studies',
    subject: 'التربية الإسلامية',
    lesson: 'أركان الإسلام',
    difficulty: 'easy',
    explanation: '☪️ أركان الإسلام الخمسة هي: 1) الشهادتان 2) الصلاة 3) الزكاة 4) الصوم 5) الحج. رقم السؤال يُخدعنا أحيانًا لأن الاسم «الخمسة» مذكور في السؤال، لكن الإجابة بالطبع خمسة! تذكّري: خمسة أركان كالأعمدة التي تُقيم البنيان.'
  },
  {
    id: 'ar-13',
    language: 'ar',
    question: 'ما نوعُ المثلّثِ الذي تكونُ فيه جميعُ أضلاعِه متساويةً؟',
    options: [
      'مثلّث قائم الزاوية',
      'مثلّث متساوي الساقين',
      'مثلّث متساوي الأضلاع',
      'مثلّث مختلف الأضلاع'
    ],
    correctAnswer: 2,
    category: 'Math',
    subject: 'الرياضيات',
    lesson: 'الأشكال الهندسية',
    difficulty: 'easy',
    explanation: '📐 المثلث متساوي الأضلاع = الثلاثة أضلاع متساوية والثلاث زوايا كل منها 60 درجة. أما متساوي الساقين فله ضلعان متساويان فقط. والقائم له زاوية قائمة 90 درجة. ومختلف الأضلاع كل أضلاعه مختلفة. تذكّري: «متساوي الأضلاع» = كل شيء متساوٍ!'
  },
  {
    id: 'ar-14',
    language: 'ar',
    question: 'أيُّ عضوٍ في جسمِ الإنسانِ يقومُ بتنقيةِ الدم؟',
    options: ['القلب', 'الكبد', 'الكلية', 'الرئة'],
    correctAnswer: 2,
    category: 'Science',
    subject: 'العلوم',
    lesson: 'جسم الإنسان',
    difficulty: 'medium',
    explanation: '🫘 الكلى هي مصنع تنقية الدم! لديكِ كليتان تُصفّيان الدم أكثر من 200 مرة يومياً وتُنتجان البول لإخراج السموم. أما القلب فيضخّ الدم، والكبد يُحلّل المواد الضارة، والرئتان تُنقّيان الهواء — لكن تنقية الدم مباشرةً هي وظيفة الكلى.'
  },

  // English Questions
  {
    id: 'en-1',
    language: 'en',
    question: 'What is the main function of the human heart?',
    options: [
      'To pump blood around the body',
      'To break down food into nutrients',
      'To help us breathe in oxygen',
      'To control thinking and memory'
    ],
    correctAnswer: 0,
    category: 'Science',
    subject: 'Science',
    lesson: 'Human Body',
    difficulty: 'easy',
    explanation: '❤️ Your heart is a powerful muscle that pumps blood continuously — about 100,000 times per day! It sends oxygen-rich blood to every cell in your body through arteries, and receives oxygen-poor blood back through veins. Your lungs handle breathing, your brain controls thinking, and your stomach breaks down food.'
  },
  {
    id: 'en-2',
    language: 'en',
    question: 'Which of these numbers is a prime number?',
    options: ['15', '21', '9', '11'],
    correctAnswer: 3,
    category: 'Math',
    subject: 'Mathematics',
    lesson: 'Prime Numbers',
    difficulty: 'easy',
    explanation: '🔢 A prime number has exactly 2 factors: 1 and itself. Check each option: 15 = 3×5 (not prime), 21 = 3×7 (not prime), 9 = 3×3 (not prime), but 11 = only 1×11 — prime! Quick trick: try dividing by 2, 3, 5, 7. If none divide evenly, it\'s prime!'
  },
  {
    id: 'en-3',
    language: 'en',
    question: 'In history, what do we call a long journey made for exploration or research?',
    options: ['Expedition', 'Expression', 'Exhibition', 'Explosion'],
    correctAnswer: 0,
    category: 'History',
    subject: 'History',
    lesson: 'Exploration',
    difficulty: 'easy',
    explanation: '🧭 An "expedition" is a purposeful journey for exploration, research, or a specific mission — like a scientific expedition to Antarctica. "Exhibition" is a display of art or objects. "Expression" means showing a feeling. "Explosion" is a burst. The prefix "ex-" in expedition means "out" — going out to discover!'
  },
  {
    id: 'en-4',
    language: 'en',
    question: 'Which of these is an example of renewable energy?',
    options: ['Petrol', 'Solar power', 'Natural gas', 'Coal'],
    correctAnswer: 1,
    category: 'Science',
    subject: 'Science',
    lesson: 'Energy Sources',
    difficulty: 'medium',
    explanation: '☀️ Renewable energy comes from sources that naturally replenish — the sun always shines, wind always blows, rivers always flow. Solar power converts sunlight into electricity using panels. Petrol, natural gas, and coal are fossil fuels — they took millions of years to form and will run out!'
  },
  {
    id: 'en-5',
    language: 'en',
    question: 'Which word is a synonym for "happy" in this sentence: "She felt very happy after the exam"?',
    options: ['Joyful', 'Angry', 'Nervous', 'Gloomy'],
    correctAnswer: 0,
    category: 'English',
    subject: 'English',
    lesson: 'Vocabulary & Synonyms',
    difficulty: 'easy',
    explanation: '📚 Synonyms are words with similar meanings. "Joyful" means full of joy/happiness — perfect synonym! "Angry" is the opposite (antonym). "Nervous" means anxious/worried. "Gloomy" means sad or dark. Tip: build your vocabulary by grouping synonyms — happy, joyful, cheerful, content, delighted all share similar meaning!'
  },
  {
    id: 'en-6',
    language: 'en',
    question: 'Which planet in our solar system is known for its large rings?',
    options: ['Jupiter', 'Venus', 'Saturn', 'Mars'],
    correctAnswer: 2,
    category: 'Science',
    subject: 'Science',
    lesson: 'Space & Planets',
    difficulty: 'easy',
    explanation: '🪐 Saturn has the most spectacular ring system in our solar system — made of ice and rock pieces ranging from tiny grains to huge chunks. Jupiter also has rings but they are much fainter. Saturn\'s rings can be seen with a basic telescope and span 282,000 km wide but are only about 1 km thick!'
  },
  {
    id: 'en-7',
    language: 'en',
    question: 'If a story is told from the "first-person" point of view, which word is most likely used by the narrator?',
    options: ['He', 'She', 'I', 'They'],
    correctAnswer: 2,
    category: 'English',
    subject: 'English',
    lesson: 'Reading Comprehension',
    difficulty: 'medium',
    explanation: '📖 Point of view determines who tells the story. First-person uses "I" and "me" — the narrator IS a character in the story. Second-person uses "you" (rare in fiction). Third-person uses "he", "she", or "they" — the narrator observes from outside. When you read "I walked into the room", you know it\'s first-person!'
  },
  {
    id: 'en-8',
    language: 'en',
    question: 'What is 15% of 200?',
    options: ['25', '30', '35', '40'],
    correctAnswer: 1,
    category: 'Math',
    subject: 'Mathematics',
    lesson: 'Percentages',
    difficulty: 'medium',
    explanation: '💯 15% of 200: Method 1: 10% of 200 = 20, then 5% = 10, so 15% = 20+10 = 30. Method 2: 200 × 0.15 = 30. Quick tip: always find 10% first (just move decimal point), then adjust. 10% of any number = divide by 10. Master this and percentages become easy!'
  },
  {
    id: 'en-9',
    language: 'en',
    question: 'Which continent is the largest by area?',
    options: ['Africa', 'North America', 'Asia', 'Europe'],
    correctAnswer: 2,
    category: 'Geography',
    subject: 'Geography',
    lesson: 'World Continents',
    difficulty: 'easy',
    explanation: '🌏 Asia is the largest continent — covering about 44.6 million km², nearly 30% of Earth\'s land area! It contains the world\'s most populous countries (China, India). Africa is 2nd largest. North America is 3rd. Europe is actually the 2nd smallest. Memory tip: Asia = Absolutely the largest!'
  },
  {
    id: 'en-10',
    language: 'en',
    question: 'What is the chemical symbol for water?',
    options: ['WA', 'H2O', 'HO2', 'W2O'],
    correctAnswer: 1,
    category: 'Science',
    subject: 'Science',
    lesson: 'Chemistry Basics',
    difficulty: 'easy',
    explanation: '💧 H₂O = 2 Hydrogen atoms + 1 Oxygen atom. The "H" stands for Hydrogen and "O" for Oxygen. The subscript "2" means two hydrogen atoms bonded to one oxygen. This simple molecule is life itself — water covers 71% of Earth and makes up about 60% of the human body!'
  },
  {
    id: 'en-11',
    language: 'en',
    question: 'Which of these is NOT a type of triangle?',
    options: ['Scalene', 'Isosceles', 'Equilateral', 'Quadratic'],
    correctAnswer: 3,
    category: 'Math',
    subject: 'Mathematics',
    lesson: 'Geometry',
    difficulty: 'easy',
    explanation: '📐 The three types of triangles by side length are: Scalene (all sides different), Isosceles (two sides equal), and Equilateral (all three sides equal). "Quadratic" is not a triangle type — it relates to quadratic equations (x²) in algebra! Triangles only have 3 sides, so "Quad-" (meaning 4) is a big clue it doesn\'t belong.'
  },
  {
    id: 'en-12',
    language: 'en',
    question: 'What is the past tense of "go"?',
    options: ['Goed', 'Went', 'Gone', 'Going'],
    correctAnswer: 1,
    category: 'English',
    subject: 'English',
    lesson: 'Grammar',
    difficulty: 'easy',
    explanation: '✏️ "Go" is an irregular verb — it doesn\'t follow the normal "-ed" rule. The past tense is "went" (simple past) and "gone" (past participle used with "have"). "Goed" and "going" are not past tenses. Other irregular verbs: go→went, come→came, see→saw, buy→bought. Learn these by heart — they\'re very common!'
  },

  // Arabic Questions - Extended Set
  {
    id: 'ar-15',
    language: 'ar',
    question: 'ما المقصودُ بـ«الضغطِ الجوي»؟',
    options: [
      'وزنُ الهواءِ المحيطِ الذي يضغطُ على سطحِ الأرض',
      'درجةُ حرارةِ الهواء',
      'سرعةُ الرياح',
      'نسبةُ الأكسجينِ في الهواء'
    ],
    correctAnswer: 0,
    category: 'Science',
    subject: 'العلوم',
    lesson: 'الغلاف الجوي',
    difficulty: 'medium',
    explanation: '🌬️ الضغط الجوي هو القوة التي يبذلها عمود الهواء فوق رأسك، تمامًا كأنكِ تحملين كيسًا هوائيّا ثقيلًا! عند الصعود لارتفاعات عالية يقل الضغط، وهذا يؤثّر على طائرات الطيران. يُستخدم لقياسه جهاز البارومتر — وارتفاع الضغط يعني طقسًا حارّاً وجافًّا، وانخفاضه يعني غيومًا ومطرًا.'
  },
  {
    id: 'ar-16',
    language: 'ar',
    question: 'في الرياضيات، ما ناتجُ (−3) × (−4)؟',
    options: ['−12', '7', '12', '−7'],
    correctAnswer: 2,
    category: 'Math',
    subject: 'الرياضيات',
    lesson: 'الأعداد الصحيحة',
    difficulty: 'easy',
    explanation: '➖ القاعدة الذهبية: سالب × سالب = موجب. (−٣) × (−٤) = ١٢ موجبة. تذكّري: فكّري فيها كأسهم السهم — إذا رفضتَ شيئًا (−) ورفضتَ رفضه (−) فأنتِ توافقين (+)، وهذا موجب! سالب × موجب = سالب، وموجب × موجب = موجب.'
  },
  {
    id: 'ar-17',
    language: 'ar',
    question: 'أيُّ دولةٍ تقعُ في قارةِ أستراليا؟',
    options: ['المكسيك', 'نيوزيلندا', 'كندا', 'الأرجنتين'],
    correctAnswer: 1,
    category: 'Geography',
    subject: 'الجغرافيا',
    lesson: 'قارات العالم',
    difficulty: 'easy',
    explanation: '🦘 نيوزيلندا تقع جنوب شرق أستراليا وتتكوّن من جزيرتين رئيسيتين. المكسيك في أمريكا الشمالية، وكندا في أمريكا الشمالية، والأرجنتين في أمريكا الجنوبية. في قارة أستراليا تقع أستراليا وبابوا غينيا ونيوزيلندا بحسب التعريف الجغرافي.'
  },
  {
    id: 'ar-18',
    language: 'ar',
    question: 'ما أبرزُ خصائصِ الحيواناتِ الثدييّة؟',
    options: [
      'تضعُ بيوضًا وتعيشُ في الماء',
      'ترضعُ صغارَها وجسمُها مكسوٌّ بالشعر',
      'تطيرُ وتبني أعشاشَها في الأشجار',
      'جلدُها متقشّرٌ وتتكاثرُ ببيوض'
    ],
    correctAnswer: 1,
    category: 'Science',
    subject: 'العلوم',
    lesson: 'تصنيف الكائنات',
    difficulty: 'easy',
    explanation: '🦎 الثدييات تتميّز بخصلتين رئيسيتين: تُرضع صغارها وجسمها مكسوّ بالشعر. من الأمثلة: الإنسان، الكلب، القطة، الحوت. الطيور تضع بيوضًا وتغطيها الريش. الزواحف جلدها متقشّر. الأسماك تملك خياشيم. الحوت ثدييٌّ مائي، ليس سمكة!'
  },
  {
    id: 'ar-19',
    language: 'ar',
    question: 'في اللغةِ العربية، ما «الفاعل» في جملة «كتبَ الطالبُ الدرسَ»؟',
    options: ['الدرسَ', 'كتبَ', 'الطالبُ', 'لا يوجد فاعل'],
    correctAnswer: 2,
    category: 'Arabic',
    subject: 'اللغة العربية',
    lesson: 'النحو',
    difficulty: 'easy',
    explanation: '✍️ الفاعل هو من قام بالفعل أو اتّصف به. في «كتبَ الطالبُ»: مَن كتب؟ الطالب! علامته الضمّة (الطالبُ). أما «الدرسَ» فهو مفعول به (من كتبَ الطالبُ ماذا؟). و«كتبَ» فعل ماضٍ. قاعدة سهلة: اسألي «مَن فَعَلَ؟» والجواب هو الفاعل.'
  },
  {
    id: 'ar-20',
    language: 'ar',
    question: 'مَن نزلَ عليهِ القرآنُ الكريم؟',
    options: ['سيدنا موسى', 'سيدنا عيسى', 'سيدنا إبراهيم', 'سيدنا محمد ﷺ'],
    correctAnswer: 3,
    category: 'Islamic Studies',
    subject: 'التربية الإسلامية',
    lesson: 'القرآن الكريم',
    difficulty: 'easy',
    explanation: '🌟 القرآن الكريم كلام الله أُنزل على سيدنا محمد صلى الله عليه وسلم عبر جبريل عليه السلام. بدأ نزوله بغار حراء سنة 610م. أما سيدنا موسى فأُنزلت عليه التوراة، وسيدنا عيسى الإنجيل، وسيدنا إبراهيم الصحف. القرآن خاتم الكتب السماوية.'
  },
  {
    id: 'ar-21',
    language: 'ar',
    question: 'في الفيزياء، ما وحدةُ قياسِ الشدةِ الكهربائية (التيار)؟',
    options: ['فولت', 'أمبير', 'واط', 'أوم'],
    correctAnswer: 1,
    category: 'Science',
    subject: 'العلوم',
    lesson: 'الكهرباء',
    difficulty: 'medium',
    explanation: '⚡ سهل التذكّر: V.A.W.O — فولت (V)، أمبير (A)، واط (W)، أوم (O). الفولت يقيس الجهد (tension)، الأمبير يقيس التيّار، الواط يقيس القدرة، والأوم يقيس المقاومة. مثال: في بيتكِ 220 فولت جهد وتيّار بأمبيرات متعدّدة.'
  },
  {
    id: 'ar-22',
    language: 'ar',
    question: 'ما عاصمةُ دولةِ الإمارات العربيّة المتحدة؟',
    options: ['دبي', 'الشارقة', 'أبوظبي', 'عجمان'],
    correctAnswer: 2,
    category: 'Geography',
    subject: 'الجغرافيا',
    lesson: 'دول العالم العربي',
    difficulty: 'easy',
    explanation: '🇦🇪 أبوظبي هي عاصمة الإمارات ومقر الحكومة ومكتب رئيس الدولة. دبي هي أكبر مدن الإمارات ومركزها التجاري والاقتصادي. مؤشر سهل: في معظم دول الخليج، العاصمة السياسية قد تختلف عن أكبر مدينة!'
  },
  {
    id: 'ar-23',
    language: 'ar',
    question: 'في الكيمياء، ما العنصرُ الذي رمزُه «O»؟',
    options: ['الذهب', 'الأكسجين', 'الأوزون', 'الأوزميوم'],
    correctAnswer: 1,
    category: 'Science',
    subject: 'العلوم',
    lesson: 'أساسيات الكيمياء',
    difficulty: 'easy',
    explanation: '🧐 رمز الأكسجين هو «O» من كلمة Oxygen. الرمز الذهب هو Au (من اللاتينية Aurum). الأوزون مكوّن من ثلاثة ذرات أكسجين (O₃) وليس عنصرًا مستقلّاً. الأكسجين ضروري للتنفس، يشكّل 21٪ من غلافنا الجوي.'
  },
  {
    id: 'ar-24',
    language: 'ar',
    question: 'ما الفرقُ بين «المساحة» و«المحيط» في الأشكالِ الهندسية؟',
    options: [
      'لا فرق بينهما',
      'المحيط هو مجموعُ أطوالِ الأضلاع، والمساحة هي مقدارُ السطحِ الداخلي',
      'المساحة هي مجموعُ أطوالِ الأضلاع',
      'المحيط يُقاسُ بالسنتيمتر المربع'
    ],
    correctAnswer: 1,
    category: 'Math',
    subject: 'الرياضيات',
    lesson: 'الأشكال الهندسية',
    difficulty: 'medium',
    explanation: '📏 سهل بفكرة عملية: المحيط هو السور حول الشكل (كسور الحديقة)، والمساحة هي الأرض داخله (كالعشب داخل الحديقة). محيط المستطيل = 2(ط+ع)، ومساحته = ط×ع. المحيط يُقاس بالمتر، والمساحة بالمتر المربّع.'
  },

  // English Questions - Extended Set
  {
    id: 'en-13',
    language: 'en',
    question: 'Which gas makes up most of Earth\'s atmosphere?',
    options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
    correctAnswer: 2,
    category: 'Science',
    subject: 'Science',
    lesson: 'Earth\'s Atmosphere',
    difficulty: 'medium',
    explanation: '🌬️ Earth\'s atmosphere is about 78% Nitrogen (N₂) and only 21% Oxygen! Many people think it\'s mostly oxygen because we breathe it, but nitrogen is actually dominant. Carbon dioxide is only 0.04% but plays a huge role in climate. Fun fact: Nitrogen is so stable it\'s used to preserve food and inflate tyres!'
  },
  {
    id: 'en-14',
    language: 'en',
    question: 'What does "photosynthesis" mean?',
    options: [
      'The process plants use to make food from sunlight',
      'The way animals digest food',
      'How rocks form underground',
      'The movement of water in rivers'
    ],
    correctAnswer: 0,
    category: 'Science',
    subject: 'Science',
    lesson: 'Plants & Biology',
    difficulty: 'easy',
    explanation: '🌿 Photo = light, synthesis = making. Plants take in sunlight + water + CO₂ and produce glucose (food) + oxygen. That\'s why plants need sunlight! The green pigment chlorophyll captures sunlight energy. Without photosynthesis, there would be no oxygen for us to breathe and no food chain at all.'
  },
  {
    id: 'en-15',
    language: 'en',
    question: 'Which of these words is an ADJECTIVE?',
    options: ['Running', 'Quickly', 'Beautiful', 'Explain'],
    correctAnswer: 2,
    category: 'English',
    subject: 'English',
    lesson: 'Grammar',
    difficulty: 'easy',
    explanation: '✨ Adjectives DESCRIBE nouns. "Beautiful" describes what something looks like. "Running" is a verb (action) or gerund. "Quickly" is an adverb (describes HOW something is done). "Explain" is a verb (action). Memory trick: adjectives answer "What kind? How many? Which one?" — Beautiful answers "what kind"!'
  },
  {
    id: 'en-16',
    language: 'en',
    question: 'What is the square root of 144?',
    options: ['11', '12', '13', '14'],
    correctAnswer: 1,
    category: 'Math',
    subject: 'Mathematics',
    lesson: 'Square Roots',
    difficulty: 'medium',
    explanation: '🔢 √144 = 12 because 12 × 12 = 144. Perfect squares to memorise: 1,4,9,16,25,36,49,64,81,100,121,144. Trick: 144 = 12² — think of a 12×12 grid. Also: 144 is called a "dozen dozens" or a gross. Knowing perfect squares by heart makes maths much faster!'
  },
  {
    id: 'en-17',
    language: 'en',
    question: 'Which country is the largest in the world by land area?',
    options: ['China', 'USA', 'Russia', 'Canada'],
    correctAnswer: 2,
    category: 'Geography',
    subject: 'Geography',
    lesson: 'World Countries',
    difficulty: 'easy',
    explanation: '🌍 Russia is by far the largest country — 17.1 million km², covering 11 time zones! That\'s almost twice the size of Canada (2nd largest) or the USA (3rd). China is 4th. Russia spans both Europe and Asia. Fun fact: Russia is so wide that when it\'s morning on one side, it\'s already evening on the other!'
  },
  {
    id: 'en-18',
    language: 'en',
    question: 'In the sentence "The dog barked loudly", what is "loudly"?',
    options: ['Noun', 'Verb', 'Adjective', 'Adverb'],
    correctAnswer: 3,
    category: 'English',
    subject: 'English',
    lesson: 'Grammar',
    difficulty: 'medium',
    explanation: '📝 Adverbs modify verbs, adjectives, or other adverbs — they tell HOW, WHEN, WHERE, or HOW MUCH. "Loudly" tells HOW the dog barked. Many adverbs end in "-ly". Adjectives describe nouns. Nouns are things/people. Verbs are actions. Quick test: can you put "very" before it? "Very loudly" ✓ — it\'s an adverb!'
  },
  {
    id: 'en-19',
    language: 'en',
    question: 'What is the value of π (pi) approximately?',
    options: ['2.14', '3.14', '4.14', '1.41'],
    correctAnswer: 1,
    category: 'Math',
    subject: 'Mathematics',
    lesson: 'Circles & Pi',
    difficulty: 'easy',
    explanation: '🔵 Pi (π) ≈ 3.14159... It\'s the ratio of a circle\'s circumference to its diameter — always the same for ANY circle! Circumference = π × diameter. Pi is an irrational number — its decimal goes on forever without repeating. Memory trick: "3.14" looks like "PIE" upside down in a mirror! 🥧'
  },
  {
    id: 'en-20',
    language: 'en',
    question: 'Which ocean is the largest?',
    options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
    correctAnswer: 3,
    category: 'Geography',
    subject: 'Geography',
    lesson: 'World Oceans',
    difficulty: 'easy',
    explanation: '🌊 The Pacific Ocean is enormous — covering more area than ALL of Earth\'s land combined! It spans from Asia to the Americas. Order by size: Pacific > Atlantic > Indian > Arctic. The Pacific also holds the deepest point on Earth: the Mariana Trench at about 11 km deep!'
  },
  {
    id: 'en-21',
    language: 'en',
    question: 'What force keeps planets in orbit around the Sun?',
    options: ['Magnetism', 'Friction', 'Gravity', 'Electricity'],
    correctAnswer: 2,
    category: 'Science',
    subject: 'Science',
    lesson: 'Space & Planets',
    difficulty: 'medium',
    explanation: '🌍 Gravity is the force of attraction between masses. The Sun\'s massive gravity pulls planets toward it, while planets move fast enough sideways to keep "falling around" the Sun in orbits — like spinning a ball on a string! Without gravity, planets would fly off in a straight line into space forever.'
  },
  {
    id: 'en-22',
    language: 'en',
    question: 'If you have 3/4 of a pizza and eat 1/4, how much is left?',
    options: ['1/4', '1/2', '3/8', '2/4'],
    correctAnswer: 1,
    category: 'Math',
    subject: 'Mathematics',
    lesson: 'Fractions',
    difficulty: 'easy',
    explanation: '🍕 3/4 − 1/4 = 2/4 = 1/2. When fractions have the same denominator (bottom number), just subtract the numerators (top numbers): 3−1 = 2, keep /4, so 2/4. Then simplify: 2/4 = 1/2 (divide both by 2). Visualise it: you had 3 slices out of 4, ate 1, now you have 2 out of 4 = half the pizza!'
  },

  // ── NEW BATCH: Arabic Questions — Remix 2026 ──────────────────
  {
    id: 'ar-25',
    language: 'ar',
    question: 'ما هو الكوكب الأقرب إلى الشمس في مجموعتنا الشمسية؟',
    options: ['الزهرة', 'عطارد', 'المريخ', 'الأرض'],
    correctAnswer: 1,
    category: 'Science',
    subject: 'العلوم',
    lesson: 'الفضاء والكواكب',
    difficulty: 'easy',
    explanation: '☀️ عطارد هو أقرب كوكب إلى الشمس، يبعد عنها حوالي 58 مليون كم فقط! بسبب قربه الشديد، درجة حرارته تصل إلى 430°م نهاراً وتنخفض إلى -180°م ليلاً. عطارد صغير الحجم — أصغر من الأرض بكثير، ولا يملك غلافاً جوياً يحميه.'
  },
  {
    id: 'ar-26',
    language: 'ar',
    question: 'في النحو، ما إعراب كلمة «السماءَ» في جملة «رفعْتُ رأسي نحوَ السماءَ»؟',
    options: ['فاعل مرفوع', 'مفعول به منصوب', 'مبتدأ مؤخر', 'بدل مطابق'],
    correctAnswer: 1,
    category: 'Arabic',
    subject: 'اللغة العربية',
    lesson: 'النحو',
    difficulty: 'medium',
    explanation: '📖 «السماءَ» مفعول به منصوب بالفتحة. السؤال: نحو ماذا؟ الجواب: السماء. علامة النصب في الأسماء الصريحة هي الفتحة. تذكّري: المفعول به دائماً منصوب لأنه يقع عليه الفعل.'
  },
  {
    id: 'ar-27',
    language: 'ar',
    question: 'ما ناتج 7 × 8؟',
    options: ['54', '56', '58', '64'],
    correctAnswer: 1,
    category: 'Math',
    subject: 'الرياضيات',
    lesson: 'جدول الضرب',
    difficulty: 'easy',
    explanation: '✖️ 7 × 8 = 56. حيلة سهلة: 7 × 8 = (7 × 4) × 2 = 28 × 2 = 56. أو فكّري فيها كـ 56 = 7 × 8، ترتيب الأرقام 5،6،7،8! هذه الحيلة تساعدك على تذكّرها دائماً.'
  },
  {
    id: 'ar-28',
    language: 'ar',
    question: 'ما أهمّ وظيفة للجذور في النبات؟',
    options: [
      'صنع الغذاء من ضوء الشمس',
      'تثبيت النبات وامتصاص الماء والأملاح',
      'إنتاج الأكسجين للتنفس',
      'حماية النبات من الحيوانات'
    ],
    correctAnswer: 1,
    category: 'Science',
    subject: 'العلوم',
    lesson: 'النباتات',
    difficulty: 'easy',
    explanation: '🌱 الجذور هي أساس النبات! تثبّته في التربة وتمتص الماء والأملاح المعدنية اللازمة للنمو. الأوراق هي التي تصنع الغذاء بعملية البناء الضوئي. بدون جذور قوية، يسقط النبات كالبيت بدون أساس!'
  },
  {
    id: 'ar-29',
    language: 'ar',
    question: 'ما عاصمة دولة اليابان؟',
    options: ['أوساكا', 'كيوتو', 'طوكيو', 'ناغويا'],
    correctAnswer: 2,
    category: 'Geography',
    subject: 'الجغرافيا',
    lesson: 'دول العالم',
    difficulty: 'easy',
    explanation: '🗾 طوكيو هي عاصمة اليابان وأكبر مدنها، وهي من أكبر مدن العالم بسكان يفوقون 37 مليون نسمة في منطقتها الحضرية! كيوتو كانت العاصمة القديمة لليابان لأكثر من 1000 سنة قبل انتقال العاصمة إلى طوكيو عام 1868.'
  },
  {
    id: 'ar-30',
    language: 'ar',
    question: 'كم عدد سور القرآن الكريم؟',
    options: ['100', '114', '120', '99'],
    correctAnswer: 1,
    category: 'Islamic Studies',
    subject: 'التربية الإسلامية',
    lesson: 'القرآن الكريم',
    difficulty: 'easy',
    explanation: '☪️ القرآن الكريم يحتوي على 114 سورة. تنقسم إلى سور مكية (86 سورة) نزلت قبل الهجرة، وسور مدنية (28 سورة) نزلت بعد الهجرة. أطول سورة هي البقرة (286 آية) وأقصر سورة هي الكوثر (3 آيات).'
  },
  {
    id: 'ar-31',
    language: 'ar',
    question: 'ما معنى كلمة «صديق» في جملة «كان أبو بكر رضي الله عنه يُلقّب بالصديق»؟',
    options: [
      'الذي يصادق الكثير من الناس',
      'الذي يُصدّق تصديقاً كاملاً بدون شك',
      'الذي يبيع الصدق',
      'الذي يحب الصداقة فقط'
    ],
    correctAnswer: 1,
    category: 'Islamic Studies',
    subject: 'التربية الإسلامية',
    lesson: 'السيرة النبوية',
    difficulty: 'medium',
    explanation: '🌟 لُقّب أبو بكر رضي الله عنه بـ«الصديق» لأنه صدّق النبي ﷺ فوراً في كل ما أخبره به، خصوصاً في ليلة الإسراء والمعراج حين قال الناس «إن صاحبك يزعم...» فقال أبو بكر: «إن قال فقد صدق». الصديق = المصدّق بلا تردد!'
  },
  {
    id: 'ar-32',
    language: 'ar',
    question: 'في الرياضيات، ما مساحة مربع طول ضلعه 9 سم؟',
    options: ['18 سم²', '36 سم²', '81 سم²', '90 سم²'],
    correctAnswer: 2,
    category: 'Math',
    subject: 'الرياضيات',
    lesson: 'المساحة والمحيط',
    difficulty: 'easy',
    explanation: '📐 مساحة المربع = الضلع × الضلع = 9 × 9 = 81 سم². تذكّري: المساحة تُقاس بوحدة مربعة (سم²) لأنها سطح. أما المحيط = 4 × الضلع = 36 سم. الفرق: المحيط خط حول الشكل، والمساحة ما بداخله!'
  },
  {
    id: 'ar-33',
    language: 'ar',
    question: 'ما الحيوان الذي يُعتبر أكبر حيوان ثديي يعيش على الأرض؟',
    options: ['الفيل الأفريقي', 'الحوت الأزرق', 'الزرافة', 'القرش الأبيض'],
    correctAnswer: 1,
    category: 'Science',
    subject: 'العلوم',
    lesson: 'تصنيف الكائنات',
    difficulty: 'medium',
    explanation: '🐋 الحوت الأزرق هو أكبر حيوان عاش على الأرض على الإطلاق — يصل طوله إلى 30 متراً ووزنه إلى 200 طن! أكبر من أي ديناصور. الفيل الأفريقي هو أكبر حيوان بري ثديي، لكن في البحر الحوت الأزرق يتفوق عليه بمراحل.'
  },
  {
    id: 'ar-34',
    language: 'ar',
    question: 'في التاريخ، من هو القائد المسلم الذي فتح القسطنطينية؟',
    options: ['صلاح الدين الأيوبي', 'محمد الفاتح', 'خالد بن الوليد', 'نور الدين زنكي'],
    correctAnswer: 1,
    category: 'History',
    subject: 'التاريخ',
    lesson: 'الفتوحات الإسلامية',
    difficulty: 'medium',
    explanation: '🏰 السلطان محمد الفاتح فتح القسطنطينية (إسطنبول حالياً) عام 1453م، وكان عمره 21 سنة فقط! أنهى بذلك الإمبراطورية البيزنطية التي دامت أكثر من 1000 سنة. بشّر النبي ﷺ بهذا الفتح قائلاً: «لَتُفتَحَنَّ القسطنطينية فلَنِعمَ الأميرُ أميرُها».'
  },
  {
    id: 'ar-35',
    language: 'ar',
    question: 'في البلاغة، ما نوع التشبيه في قولنا «الجنديُّ أسدٌ في الشجاعة»؟',
    options: [
      'تشبيه بليغ (حذف أداة التشبيه)',
      'استعارة مكنية',
      'تشبيه تمثيلي',
      'كناية عن صفة'
    ],
    correctAnswer: 0,
    category: 'Arabic',
    subject: 'اللغة العربية',
    lesson: 'البلاغة',
    difficulty: 'hard',
    explanation: '✍️ هذا تشبيه بليغ لأنه حذف أداة التشبيه (الكاف أو «مثل»). الأصل: «الجندي كالأسد». عند حذف الأداة يصبح التشبيه أقوى وأبلغ، وكأن المشبّه أصبح هو المشبّه به! التشبيه البليغ من أجمل أنواع التشبيه.'
  },
  {
    id: 'ar-36',
    language: 'ar',
    question: 'ما أكبر محيط في العالم من حيث المساحة؟',
    options: ['المحيط الأطلسي', 'المحيط الهندي', 'المحيط الهادئ', 'المحيط المتجمد الشمالي'],
    correctAnswer: 2,
    category: 'Geography',
    subject: 'الجغرافيا',
    lesson: 'المحيطات',
    difficulty: 'easy',
    explanation: '🌊 المحيط الهادئ (الباسيفيكي) هو أكبر محيط في العالم — يغطي حوالي 165 مليون كم²، أي أكبر من مساحة اليابسة كلها مجتمعة! يحتوي أيضاً على أعمق نقطة في الأرض: خندق ماريانا بعمق 11 كم. ترتيب المحيطات: الهادئ > الأطلسي > الهندي > المتجمد الشمالي.'
  },
  {
    id: 'ar-37',
    language: 'ar',
    question: 'ما عدد أيام السنة الكبيسة؟',
    options: ['364 يوم', '365 يوم', '366 يوم', '367 يوم'],
    correctAnswer: 2,
    category: 'Math',
    subject: 'الرياضيات',
    lesson: 'الزمن والحساب',
    difficulty: 'easy',
    explanation: '📅 السنة الكبيسة تحتوي على 366 يوماً بدلاً من 365. تأتي كل 4 سنوات (سنة قابلة للقسمة على 4). اليوم الإضافي هو 29 فبراير. السبب: الأرض تدور حول الشمس في 365.25 يوم تقريباً، فتتراكم الـ 0.25 يوم لتصبح يوماً كاملاً كل 4 سنوات!'
  },
  {
    id: 'ar-38',
    language: 'ar',
    question: 'ما العضو المسؤول عن تبادل الغازات (الأكسجين وثاني أكسيد الكربون) في جسم الإنسان؟',
    options: ['القلب', 'الرئتان', 'الكبد', 'الدماغ'],
    correctAnswer: 1,
    category: 'Science',
    subject: 'العلوم',
    lesson: 'جسم الإنسان',
    difficulty: 'easy',
    explanation: '🫁 الرئتان هما عضوا التنفس. تستنشقان الأكسجين من الهواء وتطلقان ثاني أكسيد الكربون. لديك رئة يمنى بثلاثة فصور ورئة يسرى بفصّين فقط (لتترك مكاناً للقلب!). مساحة أسناخ الرئتين لو فُردت = ملعب تنس كامل!'
  },
  {
    id: 'ar-39',
    language: 'ar',
    question: 'في اللغة العربية، ما جمع كلمة «قلم»؟',
    options: ['قلمات', 'أقلام', 'قلوم', 'قلمة'],
    correctAnswer: 1,
    category: 'Arabic',
    subject: 'اللغة العربية',
    lesson: 'الجمع',
    difficulty: 'easy',
    explanation: '✏️ جمع «قلم» على وزن «أفعال» هو «أقلام». القاعدة: الأسماء الثلاثية التي تدل على آلة أو أداة تُجمع غالباً على «أفعال» مثل: قلم→أقلام، كتاب→كتب، علم→أعلام. أما «قلمات» فجمع مؤنث سالم غير شائع هنا.'
  },
  {
    id: 'ar-40',
    language: 'ar',
    question: 'ما أكبر دولة عربية من حيث المساحة؟',
    options: ['السعودية', 'الجزائر', 'مصر', 'السودان'],
    correctAnswer: 1,
    category: 'Geography',
    subject: 'الجغرافيا',
    lesson: 'دول العالم العربي',
    difficulty: 'medium',
    explanation: '🇩🇿 الجزائر هي أكبر دولة عربية من حيث المساحة (2.38 مليون كم²) وأكبر دولة في أفريقيا! تأتي في المرتبة 10 عالمياً. السعودية ثانية عربياً (2.15 مليون كم²). معظم مساحة الجزائر صحراء كبرى، وعاصمتها الجزائر العاصمة.'
  },
  {
    id: 'ar-41',
    language: 'ar',
    question: 'كم عدد صلاة الفرض في اليوم والليلة؟',
    options: ['ثلاث', 'خمس', 'ست', 'سبع'],
    correctAnswer: 1,
    category: 'Islamic Studies',
    subject: 'التربية الإسلامية',
    lesson: 'الصلاة',
    difficulty: 'easy',
    explanation: '🕌 الصلوات الخمس المفروضة هي: الفجر (2 ركعة)، الظهر (4 ركعة)، العصر (4 ركعة)، المغرب (3 ركعة)، العشاء (4 ركعة). مجموع ركعات الفرض = 17 ركعة. الصلاة عمود الدين وفرض على كل مسلم بالغ عاقل.'
  },
  {
    id: 'ar-42',
    language: 'ar',
    question: 'ما العملية التي تقوم بها النباتات لصنع غذائها؟',
    options: [
      'التنفس الخلوي',
      'البناء الضوئي (التمثيل الضوئي)',
      'الترشيح',
      'التبخر'
    ],
    correctAnswer: 1,
    category: 'Science',
    subject: 'العلوم',
    lesson: 'النباتات',
    difficulty: 'medium',
    explanation: '🌿 البناء الضوئي (Photosynthesis) = النباتات تصنع غذاءها بنفسها! تأخذ ضوء الشمس + ثاني أكسيد الكربون + الماء → تنتج سكر الجلوكوز + أكسجين. الكلوروفيل (الصبغة الخضراء) يلتقط ضوء الشمس. بدون هذه العملية لا يوجد أكسجين ولا طعام على الأرض!'
  },
  {
    id: 'ar-43',
    language: 'ar',
    question: 'إذا كان عمر أحمد 12 سنة وعمر أخته 8 سنوات، فما الفرق بين عمريهما؟',
    options: ['3 سنوات', '4 سنوات', '5 سنوات', '6 سنوات'],
    correctAnswer: 1,
    category: 'Math',
    subject: 'الرياضيات',
    lesson: 'الجمع والطرح',
    difficulty: 'easy',
    explanation: '➗ الفرق = 12 − 8 = 4 سنوات. نصيحة: في مسائل الفرق، اطرح العمر الأصغر من الأكبر. الفرق بين العمرين يبقى ثابتاً دائماً — بعد 10 سنوات سيكون أحمد 22 وأخته 18، والفرق لا يزال 4!'
  },
  {
    id: 'ar-44',
    language: 'ar',
    question: 'في التاريخ، من بنى الأهرامات في مصر؟',
    options: [
      'الرومان',
      'الفراعنة (المصريون القدماء)',
      'الإغريق',
      'البابليون'
    ],
    correctAnswer: 1,
    category: 'History',
    subject: 'التاريخ',
    lesson: 'الحضارات القديمة',
    difficulty: 'easy',
    explanation: '🔺 الأهرامات بنيت في مصر القديمة منذ أكثر من 4500 سنة! هرم خوفو الأكبر هو الأعظم — ارتفاعه 146 متراً وبُني من 2.3 مليون كتلة حجرية. كان أطول مبنى في العالم لـ 3800 سنة! بُنيت لتكون مقابر للفراعنة.'
  },

  // ── NEW BATCH: English Questions — Remix 2026 ─────────────────
  {
    id: 'en-23',
    language: 'en',
    question: 'What is the chemical symbol for gold?',
    options: ['Go', 'Au', 'Gd', 'Ag'],
    correctAnswer: 1,
    category: 'Science',
    subject: 'Science',
    lesson: 'Chemistry Basics',
    difficulty: 'easy',
    explanation: '🥇 Gold\'s symbol is "Au" from the Latin word "Aurum" meaning "shining dawn." Many element symbols come from Latin: Fe (iron = ferrum), Cu (copper = cuprum), Na (sodium = natrium). "Ag" is silver (argentum), not gold! Learning Latin roots helps you remember element symbols.'
  },
  {
    id: 'en-24',
    language: 'en',
    question: 'Which word means "a person who studies stars and planets"?',
    options: ['Biologist', 'Astronomer', 'Geologist', 'Chemist'],
    correctAnswer: 1,
    category: 'English',
    subject: 'English',
    lesson: 'Vocabulary',
    difficulty: 'easy',
    explanation: '🔭 An "astronomer" studies space — stars, planets, galaxies. "Astro" = star, "nomy" = arrangement/law. A biologist studies life, a geologist studies rocks and Earth, a chemist studies chemicals. Fun fact: Galileo was one of the first modern astronomers!'
  },
  {
    id: 'en-25',
    language: 'en',
    question: 'What is 25 × 4?',
    options: ['90', '100', '110', '125'],
    correctAnswer: 1,
    category: 'Math',
    subject: 'Mathematics',
    lesson: 'Multiplication',
    difficulty: 'easy',
    explanation: '🔢 25 × 4 = 100. Quick trick: 25 × 4 = (25 × 2) × 2 = 50 × 2 = 100. Another way: 4 quarters make a whole dollar ($0.25 × 4 = $1.00). 25 and 4 are "math best friends" — they always make 100 together!'
  },
  {
    id: 'en-26',
    language: 'en',
    question: 'Which of these animals is a mammal that lives in the ocean?',
    options: ['Shark', 'Dolphin', 'Octopus', 'Sea Turtle'],
    correctAnswer: 1,
    category: 'Science',
    subject: 'Science',
    lesson: 'Animal Classification',
    difficulty: 'medium',
    explanation: '🐬 Dolphins are mammals, not fish! They breathe air with lungs (not gills), give birth to live babies (not eggs), and feed their young with milk. Sharks are fish with gills. Octopuses are mollusks. Sea turtles are reptiles. Whales and dolphins evolved from land mammals that returned to the sea!'
  },
  {
    id: 'en-27',
    language: 'en',
    question: 'What is the capital city of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 2,
    category: 'Geography',
    subject: 'Geography',
    lesson: 'World Capitals',
    difficulty: 'easy',
    explanation: '🗼 Paris is the capital of France, known as the "City of Light" (La Ville Lumière). It sits on the Seine River and is home to the Eiffel Tower, built in 1889. London is the UK\'s capital, Berlin is Germany\'s, and Madrid is Spain\'s. Paris has been France\'s capital since 987 CE!'
  },
  {
    id: 'en-28',
    language: 'en',
    question: 'Which sentence uses the correct form of "there/their/they\'re"?',
    options: [
      'Their going to the park.',
      'There going to the park.',
      'They\'re going to the park.',
      'Theyre going to the park.'
    ],
    correctAnswer: 2,
    category: 'English',
    subject: 'English',
    lesson: 'Grammar',
    difficulty: 'medium',
    explanation: '✏️ "They\'re" = "they are" (contraction). "Their" = possessive (their books). "There" = location (over there). In "They\'re going to the park" = "They are going to the park" ✓. Trick: expand the contraction — if "they are" fits, use "they\'re". If it shows ownership, use "their". If it shows place, use "there".'
  },
  {
    id: 'en-29',
    language: 'en',
    question: 'How many sides does a hexagon have?',
    options: ['5', '6', '7', '8'],
    correctAnswer: 1,
    category: 'Math',
    subject: 'Mathematics',
    lesson: 'Geometry',
    difficulty: 'easy',
    explanation: '⬡ A hexagon has 6 sides. "Hex" = 6 in Greek. Think of a honeycomb — each cell is a hexagon! Bees use hexagons because they\'re the most efficient shape: maximum space with minimum wax. Other shapes: pentagon (5), heptagon (7), octagon (8). A stop sign is an octagon!'
  },
  {
    id: 'en-30',
    language: 'en',
    question: 'What do we call the process of water turning into ice?',
    options: ['Melting', 'Freezing', 'Evaporating', 'Boiling'],
    correctAnswer: 1,
    category: 'Science',
    subject: 'Science',
    lesson: 'States of Matter',
    difficulty: 'easy',
    explanation: '🧊 Freezing is when a liquid turns into a solid. Water freezes at 0°C (32°F) to become ice. The molecules slow down and lock into a crystal pattern. Melting is the opposite (solid→liquid). Evaporating is liquid→gas. Boiling is fast evaporation at 100°C. Water is the only substance that expands when it freezes!'
  },
  {
    id: 'en-31',
    language: 'en',
    question: 'Who was the first person to walk on the Moon?',
    options: ['Buzz Aldrin', 'Yuri Gagarin', 'Neil Armstrong', 'Michael Collins'],
    correctAnswer: 2,
    category: 'History',
    subject: 'History',
    lesson: 'Space Exploration',
    difficulty: 'medium',
    explanation: '🌙 Neil Armstrong was the first human to walk on the Moon on July 20, 1969, during the Apollo 11 mission. His famous words: "That\'s one small step for man, one giant leap for mankind." Buzz Aldrin walked second. Yuri Gagarin was first in space (1961). Michael Collins orbited the Moon but never landed.'
  },
  {
    id: 'en-32',
    language: 'en',
    question: 'What is the past tense of the verb "eat"?',
    options: ['Eated', 'Ate', 'Eaten', 'Eating'],
    correctAnswer: 1,
    category: 'English',
    subject: 'English',
    lesson: 'Grammar',
    difficulty: 'easy',
    explanation: '🍽️ "Eat" is an irregular verb: eat (present) → ate (simple past) → eaten (past participle). "I ate pizza yesterday." "I have eaten pizza today." Irregular verbs don\'t follow the "-ed" rule. Other examples: run→ran, swim→swam, sing→sang, drink→drank. Memorize these — they\'re everywhere!'
  },
  {
    id: 'en-33',
    language: 'en',
    question: 'If a rectangle has length 8 cm and width 5 cm, what is its perimeter?',
    options: ['13 cm', '26 cm', '40 cm', '30 cm'],
    correctAnswer: 1,
    category: 'Math',
    subject: 'Mathematics',
    lesson: 'Geometry',
    difficulty: 'medium',
    explanation: '📐 Perimeter of a rectangle = 2 × (length + width) = 2 × (8 + 5) = 2 × 13 = 26 cm. Think of perimeter as walking around the shape: 8 + 5 + 8 + 5 = 26. Don\'t confuse with area = length × width = 40 cm². Perimeter is the fence, area is the grass inside!'
  },
  {
    id: 'en-34',
    language: 'en',
    question: 'Which of these is NOT a renewable resource?',
    options: ['Solar energy', 'Wind energy', 'Petrol (oil)', 'Hydroelectric power'],
    correctAnswer: 2,
    category: 'Science',
    subject: 'Science',
    lesson: 'Energy Sources',
    difficulty: 'medium',
    explanation: '⛽ Petrol (oil) is a fossil fuel — non-renewable because it takes millions of years to form and will run out. Solar, wind, and hydroelectric power are renewable: the sun keeps shining, wind keeps blowing, and water keeps flowing! Fossil fuels also pollute the air and cause climate change. That\'s why the world is switching to renewables.'
  },
  {
    id: 'en-35',
    language: 'en',
    question: 'What is the largest organ in the human body?',
    options: ['Brain', 'Liver', 'Skin', 'Heart'],
    correctAnswer: 2,
    category: 'Science',
    subject: 'Science',
    lesson: 'Human Body',
    difficulty: 'medium',
    explanation: '🧴 Your skin is the largest organ! It covers about 2 square meters and weighs 4-5 kg. Skin protects you from germs, regulates temperature, and lets you feel touch. The liver is the largest internal organ. The brain is the control center. The heart pumps blood. Skin is amazing — it regenerates every 28 days!'
  },
  {
    id: 'en-36',
    language: 'en',
    question: 'Which continent is the Sahara Desert located in?',
    options: ['Asia', 'Africa', 'Australia', 'South America'],
    correctAnswer: 1,
    category: 'Geography',
    subject: 'Geography',
    lesson: 'World Deserts',
    difficulty: 'easy',
    explanation: '🏜️ The Sahara is the largest hot desert in the world, covering most of North Africa — about 9 million km²! That\'s almost the size of the entire USA. Despite being a desert, the Sahara has oases where people live. Fun fact: the Sahara was once green and lush with lakes and rivers about 6,000 years ago!'
  },
  {
    id: 'en-37',
    language: 'en',
    question: 'What is 144 ÷ 12?',
    options: ['10', '11', '12', '14'],
    correctAnswer: 2,
    category: 'Math',
    subject: 'Mathematics',
    lesson: 'Division',
    difficulty: 'easy',
    explanation: '➗ 144 ÷ 12 = 12. This is the reverse of 12 × 12 = 144. Division and multiplication are opposites! If you know 12² = 144, then √144 = 12 and 144 ÷ 12 = 12. Tip: learn multiplication tables well — they make division automatic. 144 is also called a "gross" (a dozen dozens)!'
  },
  {
    id: 'en-38',
    language: 'en',
    question: 'Which of these is a complete sentence?',
    options: [
      'Running fast.',
      'The boy.',
      'The boy runs fast.',
      'Very fast indeed.'
    ],
    correctAnswer: 2,
    category: 'English',
    subject: 'English',
    lesson: 'Grammar',
    difficulty: 'easy',
    explanation: '📝 A complete sentence needs a subject (who?) and a predicate (does what?). "The boy runs fast" has subject (The boy) + verb (runs) + modifier (fast). "Running fast" has no subject. "The boy" has no verb. "Very fast indeed" has neither. Every sentence = Subject + Verb at minimum!'
  },
  {
    id: 'en-39',
    language: 'en',
    question: 'What causes day and night on Earth?',
    options: [
      'Earth orbiting the Sun',
      'Earth rotating on its axis',
      'The Moon moving around Earth',
      'The Sun moving around Earth'
    ],
    correctAnswer: 1,
    category: 'Science',
    subject: 'Science',
    lesson: 'Space & Planets',
    difficulty: 'medium',
    explanation: '🌍 Day and night happen because Earth spins (rotates) on its axis once every 24 hours. The side facing the Sun has day, the other side has night. Earth orbits the Sun once a year (causing seasons). The Moon orbits Earth monthly. The Sun doesn\'t move around Earth — we do the moving!'
  },
  {
    id: 'en-40',
    language: 'en',
    question: 'In the number 3,482, what does the digit 4 represent?',
    options: ['4 ones', '4 tens', '4 hundreds', '4 thousands'],
    correctAnswer: 2,
    category: 'Math',
    subject: 'Mathematics',
    lesson: 'Place Value',
    difficulty: 'easy',
    explanation: '🔢 In 3,482: 3=thousands, 4=hundreds, 8=tens, 2=ones. So 4 represents 4 hundreds = 400. Place value tells you how much each digit is worth based on its position. From right to left: ones, tens, hundreds, thousands, ten-thousands... Each position is 10× bigger than the one to its right!'
  },
  {
    id: 'en-41',
    language: 'en',
    question: 'Which of these materials is a good conductor of electricity?',
    options: ['Plastic', 'Rubber', 'Copper', 'Wood'],
    correctAnswer: 2,
    category: 'Science',
    subject: 'Science',
    lesson: 'Electricity',
    difficulty: 'medium',
    explanation: '⚡ Copper is an excellent conductor — that\'s why electrical wires are made of copper! Metals generally conduct electricity well because they have free electrons. Plastic, rubber, and wood are insulators — they block electricity. That\'s why plugs are plastic (safe to touch) with copper inside (carries current).'
  },
  {
    id: 'en-42',
    language: 'en',
    question: 'What is the boiling point of water in degrees Celsius?',
    options: ['50°C', '90°C', '100°C', '212°C'],
    correctAnswer: 2,
    category: 'Science',
    subject: 'Science',
    lesson: 'States of Matter',
    difficulty: 'easy',
    explanation: '💧 Water boils at 100°C (212°F) at sea level. At this temperature, liquid water turns into steam (gas). Freezing point is 0°C (32°F). Fun fact: on high mountains, water boils at a lower temperature because air pressure is lower — that\'s why cooking takes longer at high altitudes!'
  },
];

// Seeded pseudo-random number generator (deterministic per day)
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function getDaySeed(): number {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

export const getDailyQuestions = (count: number, language?: 'ar' | 'en'): QuizQuestion[] => {
  let pool = language ? quizQuestions.filter(q => q.language === language) : quizQuestions;
  const rand = seededRandom(getDaySeed() + (language === 'ar' ? 1 : language === 'en' ? 2 : 0));
  const shuffled = [...pool].sort(() => rand() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const getRandomQuestions = (count: number, language?: 'ar' | 'en'): QuizQuestion[] => {
  let filtered = quizQuestions;
  if (language) {
    filtered = quizQuestions.filter(q => q.language === language);
  }
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const getQuestionsBySubject = (subject: string): QuizQuestion[] =>
  quizQuestions.filter(q => q.subject === subject);

export const getAllSubjects = (): string[] =>
  Array.from(new Set(quizQuestions.map(q => q.subject))).sort();

export const getCategoriesCount = () => {
  const categories = new Set(quizQuestions.map(q => q.category));
  return categories.size;
};

export const getTotalQuestions = () => quizQuestions.length;
