const FREETTS_BASE = 'https://freetts.org/api';
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 60;

function sendJson(res, status, payload) {
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

function isRateLimited(req) {
  const store = globalThis.__familyTtsRateLimit || new Map();
  globalThis.__familyTtsRateLimit = store;
  const key = getClientIp(req);
  const now = Date.now();
  const current = store.get(key);

  if (!current || now - current.startedAt > WINDOW_MS) {
    store.set(key, { startedAt: now, count: 1 });
    return false;
  }

  current.count += 1;
  store.set(key, current);
  return current.count > MAX_REQUESTS_PER_WINDOW;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  if (isRateLimited(req)) {
    return sendJson(res, 429, { error: 'Too many speech requests. Please try again later.' });
  }

  const contentLength = Number(req.headers?.['content-length'] || 0);
  if (contentLength > 8_000) {
    return sendJson(res, 413, { error: 'Request too large' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const text = String(body.text || '')
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
      .trim()
      .slice(0, 850);
    const lang = body.lang === 'en' ? 'en' : 'ar';

    if (!text) return sendJson(res, 400, { error: 'text is required' });

    const voice = lang === 'ar' ? 'ar-SA-ZariyahNeural' : 'en-US-JennyNeural';
    const rate = lang === 'ar' ? '-10%' : '+0%';
    const pitch = '+2Hz';

    const generateResponse = await fetch(`${FREETTS_BASE}/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice, rate, pitch }),
      signal: AbortSignal.timeout(9000),
    });

    if (!generateResponse.ok) {
      console.error('FreeTTS generation failed', generateResponse.status);
      return sendJson(res, 502, { error: 'TTS service failed' });
    }

    const generated = await generateResponse.json();
    const fileId = String(generated?.file_id || '').replace(/[^a-zA-Z0-9_-]/g, '');
    if (!fileId) return sendJson(res, 502, { error: 'TTS service returned no audio id' });

    const audioResponse = await fetch(`${FREETTS_BASE}/tts/${fileId}`, {
      signal: AbortSignal.timeout(9000),
      redirect: 'follow',
    });

    if (!audioResponse.ok) {
      console.error('FreeTTS audio download failed', audioResponse.status);
      return sendJson(res, 502, { error: 'Audio download failed' });
    }

    const audio = Buffer.from(await audioResponse.arrayBuffer());
    if (!audio.length || audio.length > 5_000_000) {
      return sendJson(res, 502, { error: 'Invalid audio response' });
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', audioResponse.headers.get('content-type') || 'audio/mpeg');
    res.setHeader('Content-Length', String(audio.length));
    res.setHeader('Cache-Control', 'private, max-age=300');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.end(audio);
  } catch (error) {
    if (error?.name === 'TimeoutError' || error?.name === 'AbortError') {
      return sendJson(res, 504, { error: 'TTS request timed out' });
    }
    console.error('TTS endpoint error', error?.message || 'unknown');
    return sendJson(res, 500, { error: 'TTS request failed' });
  }
}
