/**
 * useSpeech.ts
 * ─────────────────────────────────────────────────────────────────
 * Web Speech API wrapper — reads text aloud in Arabic or English.
 * Falls back silently if browser doesn't support it.
 */

import { useCallback, useEffect, useRef } from 'react';

export interface SpeakOptions {
  lang?: 'ar' | 'en';
  rate?: number;   // 0.5–2.0 (default 0.9 for kids)
  pitch?: number;  // 0–2   (default 1.1 — slightly warm)
  volume?: number; // 0–1
}

export function useSpeech() {
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
  }, []);

  // Stop on unmount
  useEffect(() => () => stop(), [stop]);

  const speak = useCallback((text: string, opts: SpeakOptions = {}) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    stop();

    const utter = new SpeechSynthesisUtterance(text);
    const isAr = (opts.lang ?? 'ar') === 'ar';
    utter.lang  = isAr ? 'ar-SA' : 'en-US';
    utter.rate  = opts.rate   ?? (isAr ? 0.85 : 0.9);
    utter.pitch = opts.pitch  ?? 1.1;
    utter.volume = opts.volume ?? 1;

    // Pick best available voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      isAr
        ? v.lang.startsWith('ar') && v.localService
        : v.lang.startsWith('en') && v.localService
    ) ?? voices.find(v => isAr ? v.lang.startsWith('ar') : v.lang.startsWith('en'));
    if (preferred) utter.voice = preferred;

    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
  }, [stop]);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  return { speak, stop, isSupported };
}
