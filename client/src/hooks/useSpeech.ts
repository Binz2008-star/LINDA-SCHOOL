import { useCallback, useEffect, useRef, useState } from 'react';

export interface SpeakOptions {
  lang?: 'ar' | 'en';
  rate?: number;
  pitch?: number;
  volume?: number;
}

function splitText(text: string, maximum = 170): string[] {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return [];

  const sentences = clean.split(/(?<=[.!؟،؛:])\s+/u);
  const chunks: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    if (`${current} ${sentence}`.trim().length <= maximum) {
      current = `${current} ${sentence}`.trim();
      continue;
    }
    if (current) chunks.push(current);
    current = sentence;
  }

  if (current) chunks.push(current);
  return chunks.flatMap(chunk => {
    if (chunk.length <= maximum) return [chunk];
    const parts: string[] = [];
    let part = '';
    for (const word of chunk.split(' ')) {
      if (`${part} ${word}`.trim().length > maximum && part) {
        parts.push(part);
        part = word;
      } else {
        part = `${part} ${word}`.trim();
      }
    }
    if (part) parts.push(part);
    return parts;
  });
}

function pickVoice(language: 'ar' | 'en'): SpeechSynthesisVoice | undefined {
  if (typeof window === 'undefined' || !window.speechSynthesis) return undefined;
  const voices = window.speechSynthesis.getVoices();
  const locale = language === 'ar' ? 'ar' : 'en';
  return voices.find(voice => voice.lang.toLowerCase() === (language === 'ar' ? 'ar-ae' : 'en-us'))
    ?? voices.find(voice => voice.lang.startsWith(locale) && /zariyah|layla|hala|salma|jenny|aria|sonia|female/i.test(voice.name))
    ?? voices.find(voice => voice.lang.startsWith(locale) && voice.localService)
    ?? voices.find(voice => voice.lang.startsWith(locale))
    ?? voices.find(voice => voice.default);
}

export function useSpeech() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const runIdRef = useRef(0);
  const resumeTimerRef = useRef<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voiceName, setVoiceName] = useState<string | null>(null);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current !== null) {
      window.clearInterval(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    runIdRef.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    clearResumeTimer();

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    setIsSpeaking(false);
  }, [clearResumeTimer]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const loadVoices = () => window.speechSynthesis.getVoices();
    loadVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', loadVoices);
  }, []);

  useEffect(() => () => stop(), [stop]);

  const speakWithBrowser = useCallback((text: string, options: SpeakOptions, runId: number) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') {
      setError('لا يوجد محرك صوت متاح على هذا الجهاز.');
      return;
    }

    const synthesis = window.speechSynthesis;
    const language = options.lang ?? 'ar';
    const chunks = splitText(text);
    const voice = pickVoice(language);
    setVoiceName(voice?.name ?? 'صوت الجهاز');
    let index = 0;

    const finish = () => {
      if (runId !== runIdRef.current) return;
      clearResumeTimer();
      setIsSpeaking(false);
      utteranceRef.current = null;
    };

    const playNext = () => {
      if (runId !== runIdRef.current) return;
      if (index >= chunks.length) return finish();

      const utterance = new SpeechSynthesisUtterance(chunks[index]);
      utterance.lang = language === 'ar' ? (voice?.lang.startsWith('ar') ? voice.lang : 'ar-AE') : (voice?.lang.startsWith('en') ? voice.lang : 'en-US');
      utterance.rate = options.rate ?? (language === 'ar' ? 0.8 : 0.88);
      utterance.pitch = options.pitch ?? 1;
      utterance.volume = options.volume ?? 1;
      if (voice) utterance.voice = voice;

      utterance.onstart = () => {
        if (runId !== runIdRef.current) return;
        setIsSpeaking(true);
        setError(null);
      };
      utterance.onend = () => {
        if (runId !== runIdRef.current) return;
        index += 1;
        window.setTimeout(playNext, 50);
      };
      utterance.onerror = event => {
        if (runId !== runIdRef.current) return;
        if (!['canceled', 'interrupted'].includes(event.error)) {
          setError(event.error === 'not-allowed'
            ? 'المتصفح منع الصوت. اضغط زر الصوت مرة أخرى بعد الضغط داخل الصفحة.'
            : 'تعذر تشغيل صوت الجهاز. تأكد من مستوى الصوت أو تثبيت صوت عربي.');
        }
        finish();
      };

      utteranceRef.current = utterance;
      synthesis.resume();
      synthesis.speak(utterance);
    };

    resumeTimerRef.current = window.setInterval(() => {
      if (runId === runIdRef.current && synthesis.paused) synthesis.resume();
    }, 3000);
    playNext();
  }, [clearResumeTimer]);

  const speak = useCallback(async (text: string, options: SpeakOptions = {}) => {
    const clean = text.trim();
    if (!clean) return;

    stop();
    setError(null);
    setVoiceName('الصوت العربي العصبي');
    const runId = runIdRef.current;
    const controller = new AbortController();
    abortRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 5500);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: clean.slice(0, 850), lang: options.lang ?? 'ar' }),
        signal: controller.signal,
      });

      if (runId !== runIdRef.current) return;
      if (!response.ok) throw new Error('neural speech unavailable');

      const blob = await response.blob();
      if (!blob.size) throw new Error('empty audio');
      const url = URL.createObjectURL(blob);
      audioUrlRef.current = url;
      const audio = new Audio(url);
      audio.volume = options.volume ?? 1;
      audioRef.current = audio;
      audio.onplay = () => {
        if (runId === runIdRef.current) setIsSpeaking(true);
      };
      audio.onended = () => {
        if (runId !== runIdRef.current) return;
        setIsSpeaking(false);
        if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
        audioRef.current = null;
      };
      audio.onerror = () => {
        if (runId === runIdRef.current) speakWithBrowser(clean, options, runId);
      };
      await audio.play();
    } catch {
      if (runId === runIdRef.current) speakWithBrowser(clean, options, runId);
    } finally {
      window.clearTimeout(timeout);
      if (runId === runIdRef.current) abortRef.current = null;
    }
  }, [speakWithBrowser, stop]);

  const isSupported = typeof window !== 'undefined' && ('fetch' in window || 'speechSynthesis' in window);

  return {
    speak,
    stop,
    isSupported,
    isSpeaking,
    error,
    voiceName,
  };
}
