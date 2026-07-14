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
  child?: ChildProfile;  // personalise per child
}

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY as string;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

// ── Build dynamic system role per child ─────────────────────────────────────
function buildSystemRole(isArabic: boolean, child?: ChildProfile): string {
  const name = child ? (isArabic ? child.nameAr : child.nameEn) : (isArabic ? 'لينيدا' : 'Linda');
  const age = child?.age ?? 13;
  const interest = child ? (isArabic ? child.interest : child.interestEn) : (isArabic ? 'الحياة والطبيعة' : 'Life & Nature');
  const tone = child ? (isArabic ? child.dadToneAr : child.dadToneEn) : (isArabic ? 'يا لينيدا حبيبتي' : 'my dear Linda');
  const isMale = child ? ['adam', 'noah'].includes(child.id) : false;
  const genderNote = isArabic
    ? (isMale ? 'ولد' : 'بنت')
    : (isMale ? 'boy' : 'girl');

  if (isArabic) {
    return `أنت "بابا المعلم" — أبٌ ذكي يحب ${genderNote === 'بنت' ? 'ابنته' : 'ابنه'} ${name} (${age} سنة) ويعلّم${genderNote === 'بنت' ? 'ها' : 'ه'} بصبرٍ وحنان.
نادِ${genderNote === 'بنت' ? 'ها' : 'ه'} دائماً: "${tone}"
شخصيتك:
• عربية فصحى مبسطة ودافئة مناسبة لعمر ${age} سنة
• تُشجّع دائماً — الخطأ درس وليس فشلاً
• أمثلة من حياة الأطفال وربط ${genderNote === 'بنت' ? 'اهتمامها' : 'اهتمامه'} بـ "${interest}" كلما أمكن
• 4-5 جمل فقط، تبدأ بإيموجي`;
  } else {
    return `You are "Dad the Tutor" — a loving, patient father teaching his ${genderNote} ${name} (age ${age}) with warmth and care.
Always address them: "${tone}"
Your style:
• Simple, warm English suitable for age ${age}
• Always encourage — mistakes are how we grow
• Relate examples to their love of "${interest}" when possible
• Exactly 4-5 sentences, starting with an emoji`;
  }
}

// ── In-memory cache: key = questionId + selectedIndex ─────────────────────
const explanationCache = new Map<string, string>();

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
    options: ExplainOptions = {},
  ) => {
    const isCorrect = selectedIndex === question.correctAnswer;
    const isArabic = question.language === 'ar';
    const cacheKey = `${question.id}-${selectedIndex}`;

    // ── 1. Serve from cache instantly ──────────────────────────────────────
    if (explanationCache.has(cacheKey)) {
      setState({ explanation: explanationCache.get(cacheKey)!, loading: false, error: null });
      return;
    }

    // ── 2. Cancel any in-flight request ───────────────────────────────────
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setState({ explanation: '', loading: true, error: null });

    // ── 3. No API key → static fallback ───────────────────────────────────
    if (!DEEPSEEK_API_KEY) {
      setState({
        explanation: question.explanation || (isArabic ? 'لا يوجد شرح متاح.' : 'No explanation available.'),
        loading: false,
        error: null,
      });
      return;
    }

    const selectedOption = question.options[selectedIndex];
    const correctOption = question.options[question.correctAnswer];

    // ── 4. Build weak-topic context hint ──────────────────────────────────
    const childNameAr = options.child ? options.child.nameAr : 'لينيدا';
    const childNameEn = options.child ? options.child.nameEn : 'Linda';
    const weakHintAr = options.weakTopics?.length
      ? `\nملاحظة: ${childNameAr} يجد صعوبة في: ${options.weakTopics.join('، ')}. إذا كانت المادة منها فاشرح بتفصيل أكثر.`
      : '';
    const weakHintEn = options.weakTopics?.length
      ? `\nNote: ${childNameEn} struggles with: ${options.weakTopics.join(', ')}. If this topic overlaps, give extra detail.`
      : '';

    const accuracyHintAr = options.accuracy !== null && options.accuracy !== undefined
      ? `\nدقة ${options.child ? options.child.nameAr : 'لينيدا'} في هذا الموضوع حتى الآن: ${options.accuracy}%.${options.accuracy < 50 ? ' يحتاج دعمًا إضافيًا.' : ''}`
      : '';
    const accuracyHintEn = options.accuracy !== null && options.accuracy !== undefined
      ? `\n${options.child ? options.child.nameEn : 'Linda'}'s accuracy on this topic so far: ${options.accuracy}%.${options.accuracy < 50 ? ' Needs extra support.' : ''}`
      : '';

    // ── 5. Build user prompt ───────────────────────────────────────────────
    const userPrompt = isArabic
      ? `السؤال: ${question.question}
المادة: ${question.subject}${question.lesson ? ` — ${question.lesson}` : ''}
إجابة ${options.child ? options.child.nameAr : 'لينيدا'}: ${selectedOption}
الإجابة الصحيحة: ${correctOption}
النتيجة: ${isCorrect ? '✅ صحيحة' : '❌ خاطئة'}${weakHintAr}${accuracyHintAr}

${isCorrect
        ? `اكتب رسالة فخر أبوي تشرح سبب صحة الإجابة بمثال مناسب لعمر ${options.child?.age ?? 13} سنة.`
        : `اكتب رسالة أبوية حنونة: طمّن${['adam', 'noah'].includes(options.child?.id ?? '') ? 'ه' : 'ها'}، اشرح الصواب بمثال مناسب لعمر ${options.child?.age ?? 13} سنة، أعطِ نصيحة للتذكر، واختم بتشجيع.`}`
      : `Question: ${question.question}
Subject: ${question.subject}${question.lesson ? ` — ${question.lesson}` : ''}
${options.child ? options.child.nameEn : 'Linda'}'s answer: ${selectedOption}
Correct answer: ${correctOption}
Result: ${isCorrect ? '✅ Correct' : '❌ Wrong'}${weakHintEn}${accuracyHintEn}

${isCorrect
        ? `Write a proud fatherly message explaining why the answer is correct with an example suitable for age ${options.child?.age ?? 13}.`
        : `Write a gentle fatherly message: reassure them, explain with an example for age ${options.child?.age ?? 13}, give a memory tip, end with encouragement.`}`;

    try {
      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        signal: abortRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: buildSystemRole(isArabic, options.child) },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 280,
          temperature: isCorrect ? 0.75 : 0.65, // slightly more creative for praise
          top_p: 0.9,
          frequency_penalty: 0.3, // reduce repetition
        }),
      });

      if (!response.ok) throw new Error(`API ${response.status}`);

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content?.trim() ?? '';

      // ── Cache the result ─────────────────────────────────────────────────
      explanationCache.set(cacheKey, text);
      setState({ explanation: text, loading: false, error: null });

    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return; // cancelled — ignore
      const fallback = question.explanation || (isArabic ? 'حدث خطأ. تحقق من اتصالك.' : 'Could not load explanation.');
      explanationCache.set(cacheKey, fallback);
      setState({ explanation: fallback, loading: false, error: null });
    }
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState({ explanation: '', loading: false, error: null });
  }, []);

  return { ...state, explain, reset };
}
