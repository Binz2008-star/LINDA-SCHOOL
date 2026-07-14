const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 40;

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify(payload));
}

function getClientIp(req) {
  const forwarded = req.headers?.['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

function rateLimited(req) {
  const store = globalThis.__familyTutorRateLimit || new Map();
  globalThis.__familyTutorRateLimit = store;
  const now = Date.now();
  const key = getClientIp(req);
  const current = store.get(key);

  if (!current || now - current.startedAt > WINDOW_MS) {
    store.set(key, { startedAt: now, count: 1 });
    return false;
  }

  current.count += 1;
  store.set(key, current);
  return current.count > MAX_REQUESTS_PER_WINDOW;
}

function safeText(value, maximum) {
  return String(value || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, maximum);
}

async function callDeepSeek(apiKey, systemPrompt, userPrompt) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 320,
        temperature: 0.5,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      console.error('DeepSeek tutor error', response.status);
      return { error: 'Tutor service failed', status: 502 };
    }

    const data = await response.json();
    const explanation = data?.choices?.[0]?.message?.content?.trim();
    if (!explanation) return { error: 'Tutor returned no explanation', status: 502 };
    return { explanation };
  } finally {
    clearTimeout(timeout);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { error: 'Method not allowed' });
  }

  if (rateLimited(req)) {
    return send(res, 429, { error: 'Too many tutor requests. Please try again later.' });
  }

  const contentLength = Number(req.headers?.['content-length'] || 0);
  if (contentLength > 16_000) {
    return send(res, 413, { error: 'Request too large' });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return send(res, 503, { error: 'Tutor is not configured' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const mode = body.mode === 'writing-feedback' ? 'writing-feedback' : 'answer-explanation';
    const learner = body.learner || {};
    const lesson = body.lesson || {};
    const learnerName = safeText(learner.nameAr, 30);
    const lessonTitle = safeText(lesson.title, 120);

    if (!learnerName || !lessonTitle) {
      return send(res, 400, { error: 'Invalid tutor request' });
    }

    const gender = learner.gender === 'female' ? 'بنت' : 'ولد';
    const interest = safeText(learner.interestAr, 100);
    const subject = safeText(lesson.subject, 80);

    const commonRules = `أنت "بابا المعلم" داخل مدرسة منزلية آمنة. تساعد طفلاً عربياً على الفهم والتعبير بلغة فصحى مبسطة ودافئة.\n\nقواعد إلزامية:\n- لا توبخ الطفل ولا تقارنه بإخوته.\n- لا تفترض أن عمر الطفل يساوي مستواه الدراسي.\n- امدح المحاولة المحددة، لا تمدح بلا سبب.\n- اشرح الفكرة ولا تقدم كلاماً عاماً.\n- استخدم مثالاً واحداً مرتبطاً باهتمام الطفل عندما يكون مناسباً.\n- اكتب بين 3 و5 جمل قصيرة.\n- لا تطلب بيانات شخصية ولا تذكر أنك ذكاء اصطناعي.\n- لا تقدم روابط أو مشتريات أو وعوداً بمكافآت.\n- اختم بخطوة تحسين واحدة واضحة.`;

    if (mode === 'writing-feedback') {
      const responseText = safeText(body.response, 1800);
      if (responseText.length < 3) {
        return send(res, 400, { error: 'Writing response is too short' });
      }

      const userPrompt = `الطفل: ${learnerName}، العمر: ${Number(learner.age) || 0}، الجنس: ${gender}.\nالاهتمام: ${interest}.\nالمادة: ${subject}.\nعنوان الدرس: ${lessonTitle}.\n\nكتابة الطفل:\n${responseText}\n\nراجع الفهم لا الأسلوب فقط. ابدأ بذكر شيء صحيح أو محاولة جيدة موجودة فعلاً في الكتابة، ثم صحح فكرة واحدة فقط إن لزم، ثم اقترح مثالاً أو سؤالاً يساعد الطفل على توسيع الفكرة. لا تعِد كتابة النص كاملاً نيابة عنه.`;
      const result = await callDeepSeek(apiKey, commonRules, userPrompt);
      if (result.error) return send(res, result.status, { error: result.error });
      return send(res, 200, { explanation: result.explanation });
    }

    const question = body.question || {};
    const selectedIndex = Number(body.selectedIndex);
    if (
      !safeText(question.question, 500) ||
      !Array.isArray(question.options) ||
      question.options.length < 2 ||
      question.options.length > 6 ||
      !Number.isInteger(question.correctAnswer) ||
      !Number.isInteger(selectedIndex) ||
      selectedIndex < 0 ||
      selectedIndex >= question.options.length ||
      question.correctAnswer < 0 ||
      question.correctAnswer >= question.options.length
    ) {
      return send(res, 400, { error: 'Invalid tutor request' });
    }

    const selected = safeText(question.options[selectedIndex], 250);
    const correct = safeText(question.options[question.correctAnswer], 250);
    const isCorrect = selectedIndex === question.correctAnswer;
    const pronoun = learner.gender === 'female' ? 'ها' : 'ه';
    const userPrompt = `الطفل: ${learnerName}، العمر: ${Number(learner.age) || 0}، الجنس: ${gender}.\nالاهتمام: ${interest}.\nالمادة: ${subject}.\nعنوان الدرس: ${lessonTitle}.\nالسؤال: ${safeText(question.question, 500)}.\nإجابة الطفل: ${selected}.\nالإجابة الصحيحة: ${correct}.\nالنتيجة: ${isCorrect ? 'صحيحة' : 'غير صحيحة'}.\n\n${isCorrect
      ? `اشرح ل${pronoun} لماذا الإجابة صحيحة، ثم أعط مثالاً بسيطاً.`
      : `طمئن${pronoun} أولاً، ثم اشرح الفرق بين الإجابة المختارة والإجابة الصحيحة، وأعط طريقة سهلة للتذكر.`}`;

    const result = await callDeepSeek(apiKey, commonRules, userPrompt);
    if (result.error) return send(res, result.status, { error: result.error });
    return send(res, 200, { explanation: result.explanation });
  } catch (error) {
    if (error?.name === 'AbortError') {
      return send(res, 504, { error: 'Tutor timed out' });
    }
    console.error('Tutor endpoint error', error?.message || 'unknown');
    return send(res, 500, { error: 'Tutor request failed' });
  }
}
