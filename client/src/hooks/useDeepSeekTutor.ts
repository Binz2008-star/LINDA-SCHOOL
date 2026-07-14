import { ChildProfile } from '@/lib/children';
import { QuizQuestion } from '@/lib/quizData';
import { useCallback, useRef, useState } from 'react';

interface TutorState {
  explanation: string;
  loading: boolean;
  error: string | null;
}

interface ExplainOptions {
  weakTopics?: string[];
  accuracy?: number | null;
  child?: ChildProfile;
}

const explanationCache = new Map<string, string>();

function buildSystemRole(isArabic: boolean, child?: ChildProfile): string {
  const name = child ? (isArabic ? child.nameAr : child.nameEn) : (isArabic ? 'الطفل' : 'the learner');
  const age = child?.age ?? 10;
  const interest = child ? (isArabic ? child.interest : child.interestEn) : (isArabic ? 'الحياة اليومية' : 'daily life');
  const isMale = child ? ['adam', 'noah'].includes(child.id) : false;

  if (isArabic) {
    return `أنت "بابا المعلم"، معلم منزلي صبور يشرح لـ${name} بعمر ${age} سنة.
قواعدك:
- لا تفترض أن المستوى الدراسي يساوي العمر؛ ابدأ من الفكرة الأساسية باحترام ومن دون أسلوب طفولي مهين.
- اشرح لماذا الإجابة الصحيحة صحيحة، ولماذا الاختيار الخاطئ لا يطابق السؤال.
- استخدم مثالاً مرتبطاً بـ${interest} عندما يكون ذلك طبيعياً.
- خاطب ${isMale ? 'الطفل بصيغة المذكر' : 'الطفلة بصيغة المؤنث'}.
- لا تستخدم كلمات مثل فاشل أو ضعيف أو متأخر.
- اكتب 4 إلى 6 جمل عربية واضحة، ثم اختم بسؤال قصير يساعد على التأكد من الفهم.`;
  }

  return `You are “Dad the Tutor”, a patient home teacher explaining to ${name}, age ${age}.
Rules:
- Do not assume academic level equals age. Start from the foundation respectfully.
- Explain why the correct answer is correct and why the selected wrong option does not fit.
- Use a natural example related to ${interest} when helpful.
- Never label the learner as weak, behind, or a failure.
- Write 4–6 clear sentences and end with one short check-for-understanding question.`;
}

function buildUserPrompt(
  question: QuizQuestion,
  selectedIndex: number,
  options: ExplainOptions
): string {
  const isArabic = question.language === 'ar';
  const selectedOption = question.options[selectedIndex];
  const correctOption = question.options[question.correctAnswer];
  const isCorrect = selectedIndex === question.correctAnswer;
  const childName = options.child
    ? isArabic ? options.child.nameAr : options.child.nameEn
    : isArabic ? 'الطفل' : 'the learner';

  const weakContext = options.weakTopics?.length
    ? isArabic
      ? `الموضوع يحتاج مراجعة: ${options.weakTopics.join('، ')}.`
      : `Review focus: ${options.weakTopics.join(', ')}.`
    : '';

  const accuracyContext = options.accuracy !== null && options.accuracy !== undefined
    ? isArabic
      ? `الدقة السابقة في هذا الموضوع ${options.accuracy}%، استخدمها فقط لتحديد مقدار الشرح ولا تذكر مقارنة.`
      : `Previous accuracy is ${options.accuracy}%. Use it only to choose explanation depth and do not compare the learner.`
    : '';

  if (isArabic) {
    return `اسم المتعلم: ${childName}
السؤال: ${question.question}
المادة: ${question.subject}${question.lesson ? ` — ${question.lesson}` : ''}
الإجابة المختارة: ${selectedOption}
الإجابة الصحيحة: ${correctOption}
النتيجة: ${isCorrect ? 'صحيحة' : 'غير صحيحة'}
${weakContext}
${accuracyContext}
قدّم شرحاً تعليمياً يمكن للطفل قراءته قبل الضغط على «فهمت، التالي».`;
  }

  return `Learner: ${childName}
Question: ${question.question}
Subject: ${question.subject}${question.lesson ? ` — ${question.lesson}` : ''}
Selected answer: ${selectedOption}
Correct answer: ${correctOption}
Result: ${isCorrect ? 'correct' : 'incorrect'}
${weakContext}
${accuracyContext}
Give a teaching explanation the learner can read before pressing “I understand, next”.`;
}

export function useDeepSeekTutor() {
  const [state, setState] = useState<TutorState>({
    explanation: '',
    loading: false,
    error: null,
  });
  const abortRef = useRef<AbortController | null>(null);

  const explain = useCallback(async (
    question: QuizQuestion,
    selectedIndex: number,
    options: ExplainOptions = {}
  ) => {
    const isArabic = question.language === 'ar';
    const childKey = options.child?.id ?? 'default';
    const cacheKey = `${childKey}:${question.id}:${selectedIndex}`;
    const cached = explanationCache.get(cacheKey);

    if (cached) {
      setState({ explanation: cached, loading: false, error: null });
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setState({ explanation: '', loading: true, error: null });

    const fallback = question.explanation
      || (isArabic ? 'راجع الإجابة الصحيحة وحاول شرح السبب بكلماتك.' : 'Review the correct answer and explain the reason in your own words.');

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        signal: abortRef.current.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: buildSystemRole(isArabic, options.child),
          user: buildUserPrompt(question, selectedIndex, options),
        }),
      });

      if (!response.ok) throw new Error(`Tutor API ${response.status}`);

      const data = await response.json() as { text?: string };
      const text = data.text?.trim() || fallback;
      explanationCache.set(cacheKey, text);
      setState({ explanation: text, loading: false, error: null });
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') return;
      explanationCache.set(cacheKey, fallback);
      setState({
        explanation: fallback,
        loading: false,
        error: error instanceof Error ? error.message : 'Tutor unavailable',
      });
    }
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState({ explanation: '', loading: false, error: null });
  }, []);

  return { ...state, explain, reset };
}
