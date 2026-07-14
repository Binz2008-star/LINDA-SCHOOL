const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 20;
const buckets = new Map();

function clientKey(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

function isRateLimited(key) {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || now - current.startedAt >= WINDOW_MS) {
    buckets.set(key, { startedAt: now, count: 1 });
    return false;
  }

  current.count += 1;
  buckets.set(key, current);
  return current.count > MAX_REQUESTS_PER_WINDOW;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (isRateLimited(clientKey(req))) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'Tutor is not configured' });
  }

  const { system, user } = req.body || {};
  if (
    typeof system !== 'string'
    || typeof user !== 'string'
    || system.length < 10
    || user.length < 10
    || system.length > 5_000
    || user.length > 8_000
  ) {
    return res.status(400).json({ error: 'Invalid tutor request' });
  }

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        max_tokens: 360,
        temperature: 0.45,
        top_p: 0.85,
        frequency_penalty: 0.2,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      console.error('DeepSeek tutor error', response.status, details.slice(0, 500));
      return res.status(502).json({ error: 'Tutor provider unavailable' });
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    if (!text) {
      return res.status(502).json({ error: 'Tutor returned no explanation' });
    }

    return res.status(200).json({ text });
  } catch (error) {
    console.error('Tutor function failed', error);
    return res.status(500).json({ error: 'Tutor request failed' });
  }
}
