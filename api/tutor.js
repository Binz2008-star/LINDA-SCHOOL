const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { error: 'Method not allowed' });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) {
    return send(res, 503, { error: 'Tutor is not configured' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const learner = body.learner || {};
    const lesson = body.lesson || {};
    const question = body.question || {};
    const selectedIndex = Number(body.selectedIndex);

    if (
      !learner.nameAr ||
      !lesson.title ||
      !question.question ||
      !Array.isArray(question.options) ||
      !Number.isInteger(question.correctAnswer) ||
      !Number.isInteger(selectedIndex)
    ) {
      return send(res, 400, { error: 'Invalid tutor request' });
    }

    const selected = String(question.options[selectedIndex] ?? '');
    const correct = String(question.options[question.correctAnswer] ?? '');
    const isCorrect = selectedIndex === question.correctAnswer;
    const gender = learner.gender === 'female' ? 'بنت' : 'ولد';
    const pronoun = learner.gender === 'female' ? 'ها' : 'ه';

    const systemPrompt = `أنت "بابا المعلم" داخل مدرسة منزلية آمنة. تشرح لطفل عربي بلغة فصحى مبسطة ودافئة، لكنك تحافظ على الجدية التعليمية.\n\nقواعدك:\n- لا توبخ الطفل ولا تقارنه بإخوته.\n- الخطأ فرصة للتعلم، وليس فشلاً.\n- اشرح الفكرة، لا تكتفِ بذكر الإجابة.\n- استخدم مثالاً واحداً مرتبطاً باهتمام الطفل عندما يكون مناسباً.\n- اكتب بين 3 و5 جمل قصيرة فقط.\n- لا تطلب أي بيانات شخصية، ولا تذكر أنك ذكاء اصطناعي.\n- اختم بجملة تشجيع قصيرة.`;

    const userPrompt = `الطفل: ${String(learner.nameAr).slice(0, 30)}، العمر: ${Number(learner.age) || 0}، الجنس: ${gender}.\nالاهتمام: ${String(learner.interestAr || '').slice(0, 100)}.\nالمادة: ${String(lesson.subject || '').slice(0, 80)}.\nعنوان الدرس: ${String(lesson.title).slice(0, 120)}.\nالسؤال: ${String(question.question).slice(0, 500)}.\nإجابة الطفل: ${selected.slice(0, 250)}.\nالإجابة الصحيحة: ${correct.slice(0, 250)}.\nالنتيجة: ${isCorrect ? 'صحيحة' : 'غير صحيحة'}.\n\n${isCorrect
      ? `اشرح ل${pronoun} لماذا الإجابة صحيحة، ثم أعط مثالاً بسيطاً.`
      : `طمئن${pronoun} أولاً، ثم اشرح الفرق بين الإجابة المختارة والإجابة الصحيحة، وأعط طريقة سهلة للتذكر.`}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

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
        max_tokens: 300,
        temperature: 0.55,
        top_p: 0.9,
      }),
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const details = await response.text();
      console.error('DeepSeek tutor error', response.status, details.slice(0, 300));
      return send(res, 502, { error: 'Tutor service failed' });
    }

    const data = await response.json();
    const explanation = data?.choices?.[0]?.message?.content?.trim();
    if (!explanation) {
      return send(res, 502, { error: 'Tutor returned no explanation' });
    }

    return send(res, 200, { explanation });
  } catch (error) {
    if (error?.name === 'AbortError') {
      return send(res, 504, { error: 'Tutor timed out' });
    }
    console.error('Tutor endpoint error', error);
    return send(res, 500, { error: 'Tutor request failed' });
  }
}
