import { ChildProfile } from '@/lib/children';

export interface LessonPlan {
  title: string;
  subtitle: string;
  goals: string[];
  explanation: string;
  exampleTitle: string;
  example: string;
  remember: string;
  practicePrompt: string;
}

function interestExample(child: ChildProfile, subject: string): string {
  const name = child.nameAr;

  if (child.id === 'adam') {
    if (subject === 'math') return `${name} يريد صنع آلة فيها 4 عجلات. إذا صنع آلتين، فهو يحتاج 4 + 4 = 8 عجلات.`;
    if (subject === 'science') return `عندما يدفع ${name} سيارة لعبة، تتحرك بسبب القوة. وعندما يحتك إطارها بالأرض تقل سرعتها.`;
    return `يمكن لـ${name} أن يكتب اسم اختراعه، يصف فائدته، ثم يرسم أجزاءه خطوة خطوة.`;
  }

  if (child.id === 'judy') {
    if (subject === 'math') return `${name} سجلت 3 أهداف في المباراة الأولى وهدفين في الثانية: 3 + 2 = 5 أهداف.`;
    if (subject === 'science') return `عندما تركض ${name} ينبض قلبها أسرع ليحمل الدم والأكسجين إلى العضلات.`;
    return `يمكن لـ${name} قراءة تعليمات تمرين قصير، ثم ترتيب خطواته وشرحها بكلماتها.`;
  }

  if (child.id === 'noah') {
    if (subject === 'math') return `لدى ${name} سيارتان حمراوان وثلاث سيارات زرقاء: 2 + 3 = 5 سيارات.`;
    if (subject === 'science') return `السيارة تتحرك عندما تدفعها قوة، وتتوقف أسرع عندما يكون الاحتكاك كبيراً.`;
    return `يتعلم ${name} حرف س من كلمة سيارة، وحرف ط من كلمة طريق.`;
  }

  if (subject === 'math') return `${name} رتبت أسبوعها: يومان للقراءة وثلاثة أيام للأنشطة، فيكون المجموع 2 + 3 = 5 أيام.`;
  if (subject === 'science') return `${name} تلاحظ أن النبات يميل نحو الضوء؛ هذه ملاحظة علمية يمكن وصفها ثم تفسيرها.`;
  return `تستطيع ${name} وصف موقف من حياتها بجملة واضحة، ثم إضافة سبب أو شعور أو نتيجة.`;
}

function normalizeSubject(subject?: string | null): string {
  const value = (subject ?? '').toLowerCase();
  if (value.includes('رياض') || value.includes('math')) return 'math';
  if (value.includes('علوم') || value.includes('science')) return 'science';
  if (value.includes('عرب')) return 'arabic';
  if (value.includes('english')) return 'english';
  if (value.includes('جغراف') || value.includes('geography')) return 'geography';
  if (value.includes('تاريخ') || value.includes('history')) return 'history';
  if (value.includes('إسلام') || value.includes('islamic')) return 'islamic';
  return 'mixed';
}

export function getLessonPlan(subject: string | null | undefined, child: ChildProfile): LessonPlan {
  const key = normalizeSubject(subject);
  const example = interestExample(child, key);

  const plans: Record<string, Omit<LessonPlan, 'example'>> = {
    math: {
      title: 'الرياضيات من الحياة اليومية',
      subtitle: 'نفهم العدد أولاً، ثم نستخدمه لحل مشكلة حقيقية.',
      goals: ['قراءة المسألة بهدوء', 'تحديد الأعداد المطلوبة', 'اختيار العملية المناسبة', 'مراجعة الإجابة'],
      explanation: 'الرياضيات ليست حفظاً فقط. نبدأ بسؤال: ماذا نعرف؟ ماذا نريد؟ ثم نختار الجمع أو الطرح أو الضرب أو القسمة. يمكن استخدام الأصابع أو الرسم أو الأشياء الحقيقية في البداية، وهذا جزء صحيح من التعلّم.',
      exampleTitle: 'مثال مرتبط باهتمامك',
      remember: 'افهم القصة قبل أن تحسب. وارسم المسألة عندما تكون غير واضحة.',
      practicePrompt: 'بعد هذا الشرح ستتدرب على أسئلة قصيرة. لا تنتقل قبل أن تفهم سبب الإجابة.',
    },
    science: {
      title: 'كيف نفكر مثل العلماء؟',
      subtitle: 'نلاحظ، نسأل، نتوقع، ثم نختبر الفكرة.',
      goals: ['وصف ما نراه', 'طرح سؤال واضح', 'التفريق بين الملاحظة والتخمين', 'ربط السبب بالنتيجة'],
      explanation: 'العلم يبدأ بالملاحظة. نقول ما حدث فعلاً، ثم نسأل لماذا حدث. بعد ذلك نقترح تفسيراً ونبحث عن دليل. ليس ضرورياً أن تكون الإجابة الأولى صحيحة؛ المهم أن نغيّر رأينا عندما يظهر دليل أفضل.',
      exampleTitle: 'مثال مرتبط باهتمامك',
      remember: 'الملاحظة شيء رأيناه أو قسناه، أما التفسير فهو سبب نقترحه.',
      practicePrompt: 'في التدريب اقرأ السؤال وحدد أولاً: هل يسأل عن ملاحظة، سبب، وظيفة، أم نتيجة؟',
    },
    arabic: {
      title: 'قراءة العربية وفهم المعنى',
      subtitle: 'نقرأ كلمة كلمة، ثم نبني معنى الجملة كاملة.',
      goals: ['تمييز الحروف والأصوات', 'فهم معنى الكلمة من الجملة', 'تحديد من قام بالفعل', 'التعبير بجملة واضحة'],
      explanation: 'لا نقرأ بسرعة قبل الفهم. نجزئ الكلمة إلى أصوات، ثم نقرأ الجملة ونسأل: من؟ ماذا فعل؟ أين؟ ولماذا؟ عند الكتابة نبدأ بجملة قصيرة صحيحة، ثم نضيف وصفاً أو سبباً.',
      exampleTitle: 'مثال من حياتك',
      remember: 'الجملة الجيدة تحمل فكرة كاملة، وتبدأ بكلمة واضحة وتنتهي بعلامة مناسبة.',
      practicePrompt: 'اقرأ كل سؤال بصوت مسموع، وحدد الكلمة المهمة قبل اختيار الإجابة.',
    },
    english: {
      title: 'English step by step',
      subtitle: 'Listen, understand, say, read, then write.',
      goals: ['Recognise common words', 'Understand a short sentence', 'Use simple grammar', 'Answer with confidence'],
      explanation: 'English grows through small repeated steps. First understand the key word, then notice its place in the sentence. Say the answer aloud before choosing it. Mistakes help your brain remember the correct pattern.',
      exampleTitle: 'Simple example',
      remember: 'Do not translate every word. Find the main word and the action first.',
      practicePrompt: 'Read each option aloud. Choose the one that makes the whole sentence meaningful.',
    },
    geography: {
      title: 'المكان والاتجاه والخريطة',
      subtitle: 'الجغرافيا تساعدنا على فهم أين نعيش وكيف ترتبط الأماكن.',
      goals: ['معرفة الاتجاهات الأساسية', 'قراءة اسم المكان', 'التفريق بين دولة وقارة ومدينة', 'ربط البيئة بحياة الناس'],
      explanation: 'الخريطة صورة مبسطة للمكان. نستخدم الشمال والجنوب والشرق والغرب لتحديد الاتجاه، ونميز بين المدينة والدولة والقارة. كما ندرس المناخ والماء والجبال لأنها تؤثر في طريقة حياة الناس.',
      exampleTitle: 'مثال قريب',
      remember: 'المدينة جزء من دولة، والدولة تقع داخل قارة.',
      practicePrompt: 'عند كل سؤال اسأل: هل المطلوب مكان، اتجاه، مناخ، أم نوع من سطح الأرض؟',
    },
    history: {
      title: 'فهم الماضي بترتيب الأحداث',
      subtitle: 'التاريخ قصة أسباب ونتائج، وليس قائمة تواريخ فقط.',
      goals: ['ترتيب الأحداث', 'معرفة السبب والنتيجة', 'تمييز الماضي عن الحاضر', 'استخدام الدليل'],
      explanation: 'لفهم التاريخ نسأل: ماذا حدث؟ من شارك؟ لماذا حدث؟ وما النتيجة؟ نرتب الأحداث على خط زمني، ونستخدم المصادر والآثار والوثائق لمعرفة ما يمكن إثباته.',
      exampleTitle: 'مثال بسيط',
      remember: 'كل حدث له وقت، وأسباب، ونتائج قد تظهر بعده.',
      practicePrompt: 'لا تحفظ الاسم وحده؛ اربطه بما حدث قبله وما حدث بعده.',
    },
    islamic: {
      title: 'التربية الإسلامية في السلوك اليومي',
      subtitle: 'نتعلم المعنى ثم نطبقه في البيت ومع الناس.',
      goals: ['فهم العبادة والأخلاق', 'معرفة السلوك الصحيح', 'ربط المعرفة بالعمل', 'احترام الآخرين والأمانة'],
      explanation: 'التربية الإسلامية ليست معلومات فقط؛ تظهر في الصدق والأمانة والرحمة والنظافة والصلاة واحترام الحقوق. عند دراسة مفهوم ديني نسأل: ماذا يعني؟ وكيف أطبقه اليوم؟',
      exampleTitle: 'مثال من الحياة',
      remember: 'أفضل دليل على الفهم هو السلوك الصحيح، لا ترديد الكلمات فقط.',
      practicePrompt: 'اختر الإجابة التي تجمع بين المعنى الصحيح والتصرف الصحيح.',
    },
    mixed: {
      title: 'درس اليوم: كيف نتعلم؟',
      subtitle: 'نقرأ، نفهم، نجرب، نشرح، ثم نراجع.',
      goals: ['التركيز على سؤال واحد', 'عدم التخمين بسرعة', 'شرح سبب الإجابة', 'التعلم من الخطأ'],
      explanation: 'التعلم الحقيقي لا يعني اختيار الجواب الصحيح بالصدفة. بعد كل سؤال سنعرف لماذا الإجابة صحيحة، ولماذا الاختيار الآخر لا يناسب. خذ وقتك، واستخدم الرسم أو العد أو القراءة بصوت مرتفع عندما تحتاج.',
      exampleTitle: 'مثال مرتبط باهتمامك',
      remember: 'لا تضغط التالي حتى تستطيع شرح الفكرة بكلماتك.',
      practicePrompt: 'الأسئلة القادمة تدريب على الفهم، وليست امتحان نجاح أو رسوب.',
    },
  };

  return { ...plans[key], example };
}
