/**
 * api/tts.js — Vercel Serverless Function
 * ─────────────────────────────────────────────────────────────────
 * Proxy for FreeTTS API (freetts.org) — no API key required.
 * Returns: { audioUrl: string } pointing to the MP3 download URL.
 * Arabic voice: ar-SA-ZariyahNeural (female, MSA, neural quality)
 * English voice: en-US-JennyNeural (female, friendly)
 * ─────────────────────────────────────────────────────────────────
 */

const FREETTS_BASE = 'https://freetts.org/api';

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(JSON.stringify(payload));
}

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const text = String(body.text || '').trim().slice(0, 900); // stay under 1000 char free limit
    const lang = body.lang === 'en' ? 'en' : 'ar';

    if (!text) return send(res, 400, { error: 'text is required' });

    const voice = lang === 'ar' ? 'ar-SA-ZariyahNeural' : 'en-US-JennyNeural';
    const rate  = body.rate  ?? (lang === 'ar' ? '-10%' : '+0%');  // slightly slower for kids
    const pitch = body.pitch ?? '+2Hz';                              // slightly warm/bright

    // Step 1: POST to FreeTTS to generate audio, get file_id
    const genRes = await fetch(`${FREETTS_BASE}/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice, rate, pitch }),
      signal: AbortSignal.timeout(10000),
    });

    if (!genRes.ok) {
      const err = await genRes.text();
      console.error('FreeTTS generate error', genRes.status, err.slice(0, 200));
      return send(res, 502, { error: 'TTS service failed' });
    }

    const genData = await genRes.json();
    const fileId = genData?.file_id;
    if (!fileId) return send(res, 502, { error: 'No file_id from TTS service' });

    // Return the download URL — client fetches the MP3 blob directly
    const audioUrl = `${FREETTS_BASE}/tts/${fileId}`;
    return send(res, 200, { audioUrl, fileId });

  } catch (error) {
    if (error?.name === 'TimeoutError' || error?.name === 'AbortError') {
      return send(res, 504, { error: 'TTS request timed out' });
    }
    console.error('TTS endpoint error', error);
    return send(res, 500, { error: 'TTS request failed' });
  }
}
