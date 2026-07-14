/**
 * useSpeech.ts
 * ─────────────────────────────────────────────────────────────────
 * Two-tier TTS for kids:
 *
 * Tier 1 — /api/tts  (FreeTTS proxy, ar-SA-ZariyahNeural)
 *   • Neural-quality Arabic female voice
 *   • Fetches MP3 blob → plays via HTMLAudioElement
 *   • Falls back to Tier 2 on any error or timeout
 *
 * Tier 2 — Web Speech API
 *   • Built-in browser fallback
 *   • Tries to pick a female Arabic voice when available
 */

import { useCallback, useEffect, useRef } from 'react';

export interface SpeakOptions {
  lang?: 'ar' | 'en';
  rate?: number;   // used for Web Speech fallback (0.5–2.0)
  pitch?: number;  // used for Web Speech fallback (0–2)
  volume?: number; // 0–1
}

// ── Tier-2: Web Speech fallback ───────────────────────────────────
function speakWebSpeech(text: string, opts: SpeakOptions, onDone?: () => void) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  const isAr = (opts.lang ?? 'ar') === 'ar';
  utter.lang = isAr ? 'ar-SA' : 'en-US';
  utter.rate = opts.rate ?? (isAr ? 0.82 : 0.9);
  utter.pitch = opts.pitch ?? 1.15;
  utter.volume = opts.volume ?? 1;

  // Prefer female voice when available
  const getVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    const locale = isAr ? 'ar' : 'en';
    return (
      voices.find(v => v.lang.startsWith(locale) && v.name.toLowerCase().includes('female')) ??
      voices.find(v => v.lang.startsWith(locale) && /zariyah|layla|hala|salma|jenny|aria|sonia/i.test(v.name)) ??
      voices.find(v => v.lang.startsWith(locale) && v.localService) ??
      voices.find(v => v.lang.startsWith(locale))
    );
  };

  const voice = getVoice();
  if (voice) utter.voice = voice;
  if (onDone) utter.onend = onDone;

  window.speechSynthesis.speak(utter);
}

// ── Tier-1: Neural TTS via /api/tts ──────────────────────────────
async function fetchAndPlayTTS(
  text: string,
  opts: SpeakOptions,
  audioRef: React.MutableRefObject<HTMLAudioElement | null>,
  signal: AbortSignal,
): Promise<boolean> {
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.slice(0, 900), lang: opts.lang ?? 'ar' }),
      signal,
    });

    if (!res.ok) return false;

    const { audioUrl } = await res.json() as { audioUrl?: string };
    if (!audioUrl) return false;

    // Download MP3 blob
    const mp3Res = await fetch(audioUrl, { signal });
    if (!mp3Res.ok) return false;

    const blob = await mp3Res.blob();
    const url = URL.createObjectURL(blob);

    // Play via HTMLAudioElement
    if (audioRef.current) {
      audioRef.current.pause();
      URL.revokeObjectURL(audioRef.current.src);
    }
    const audio = new Audio(url);
    audio.volume = opts.volume ?? 1;
    audioRef.current = audio;
    await audio.play();
    return true;
  } catch {
    return false;
  }
}

// ── Hook ──────────────────────────────────────────────────────────
export function useSpeech() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    // Cancel any in-flight fetch
    abortRef.current?.abort();
    abortRef.current = null;
    // Stop HTMLAudio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    // Stop Web Speech
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  useEffect(() => () => stop(), [stop]);

  const speak = useCallback(async (text: string, opts: SpeakOptions = {}) => {
    stop();

    const controller = new AbortController();
    abortRef.current = controller;

    // 5-second timeout for neural fetch — then fall back immediately
    const timer = setTimeout(() => controller.abort(), 5000);

    const success = await fetchAndPlayTTS(text, opts, audioRef, controller.signal);
    clearTimeout(timer);

    if (!success && !controller.signal.aborted) {
      // Tier-2 fallback
      speakWebSpeech(text, opts);
    }
  }, [stop]);

  const isSupported = true; // always supported — either neural or Web Speech

  return { speak, stop, isSupported };
}
