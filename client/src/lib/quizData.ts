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
