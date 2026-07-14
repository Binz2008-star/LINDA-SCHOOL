import { QuizQuestion } from '@/lib/quizData';
import { useCallback, useRef, useState } from 'react';

interface TutorState {
  explanation: string;
  loading: boolean;
  error: string | null;
}

interface ExplainOptions {
  weakTopics?: string[];   // e.g. ['Science — Plants', 'Math — Fractions']
  accuracy?: number | null; // 0-100, Linda's accuracy on this topic
}

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY as string;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

// ── Persistent system role (sent once per session via messages array) ──────
const SYSTEM_ROLE_AR = `أنت "بابا المعلم" — أبٌ ذكي يحب ابنته لينيدا حبًّا عميقًا ويعلّمها بصبرٍ وحنان.
شخصيتك:
• تتكلم بعربية فصحى مبسطة ودافئة
• تُشجّع دائمًا ولا تُحبط أبدًا — الخطأ عندك درس وليس فشلاً
• تستخدم أمثلة من الحياة اليومية للأطفال
• تُعبّر عن فخرك بلينيدا في كل فرصة
• ردودك قصيرة: 4-5 جمل فقط، تبدأ بإيموجي`;

const SYSTEM_ROLE_EN = `You are "Dad the Tutor" — a loving, patient father teaching his daughter Linda with genuine warmth.
Your personality:
• Speak in simple, warm English — never cold or academic
• Always encourage — mistakes are lessons, never failures
• Use everyday real-life examples a child can picture
• Express pride in Linda at every opportunity
• Keep responses short: exactly 4-5 sentences, starting with an emoji`;

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
    const weakHintAr = options.weakTopics?.length
      ? `\nملاحظة: لينيدا تجد صعوبة في هذه المواضيع: ${options.weakTopics.join('، ')}. إذا كانت المادة الحالية منها فاشرح بتفصيل أكثر.`
      : '';
    const weakHintEn = options.weakTopics?.length
      ? `\nNote: Linda struggles with: ${options.weakTopics.join(', ')}. If this topic overlaps, give extra detail.`
      : '';

    const accuracyHintAr = options.accuracy !== null && options.accuracy !== undefined
      ? `\nدقة لينيدا في هذا الموضوع حتى الآن: ${options.accuracy}%.${options.accuracy < 50 ? ' تحتاج دعمًا إضافيًا.' : ''}`
      : '';
    const accuracyHintEn = options.accuracy !== null && options.accuracy !== undefined
      ? `\nLinda's accuracy on this topic so far: ${options.accuracy}%.${options.accuracy < 50 ? ' She needs extra support.' : ''}`
      : '';

    // ── 5. Build user prompt ───────────────────────────────────────────────
    const userPrompt = isArabic
      ? `السؤال: ${question.question}
المادة: ${question.subject}${question.lesson ? ` — ${question.lesson}` : ''}
إجابة لينيدا: ${selectedOption}
الإجابة الصحيحة: ${correctOption}
النتيجة: ${isCorrect ? '✅ صحيحة' : '❌ خاطئة'}${weakHintAr}${accuracyHintAr}

${isCorrect
        ? 'اكتب رسالة فخر أبوي تشرح فيها سبب صحة الإجابة بمثال يومي.'
        : 'اكتب رسالة أبوية حنونة: طمّنها، اشرح الصواب بمثال يومي، أعطها نصيحة لتتذكر، واختم بتشجيع.'}`
      : `Question: ${question.question}
Subject: ${question.subject}${question.lesson ? ` — ${question.lesson}` : ''}
Linda's answer: ${selectedOption}
Correct answer: ${correctOption}
Result: ${isCorrect ? '✅ Correct' : '❌ Wrong'}${weakHintEn}${accuracyHintEn}

${isCorrect
        ? 'Write a proud fatherly message explaining why her answer is correct using a real-life example.'
        : 'Write a gentle fatherly message: reassure her, explain the correct answer with a real-life example, give a memory tip, end with encouragement.'}`;

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
            { role: 'system', content: isArabic ? SYSTEM_ROLE_AR : SYSTEM_ROLE_EN },
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
