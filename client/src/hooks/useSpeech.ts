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
    if (sentence.length <= maximum) {
      current = sentence;
      continue;
    }

    const words = sentence.split(' ');
    current = '';
    for (const word of words) {
      if (`${current} ${word}`.trim().length > maximum && current) {
        chunks.push(current);
        current = word;
      } else {
        current = `${current} ${word}`.trim();
      }
    }
  }

  if (current) chunks.push(current);
  return chunks;
}

function voiceScore(voice: SpeechSynthesisVoice, language: 'ar' | 'en'): number {
  const lang = voice.lang.toLowerCase();
  const name = voice.name.toLowerCase();
  let score = 0;

  if (language === 'ar') {
    if (lang === 'ar-ae') score += 100;
    else if (lang === 'ar-sa') score += 95;
    else if (lang.startsWith('ar')) score += 80;
    if (/hamed|naayf|maged|laila|salma|tarik|arabic/.test(name)) score += 20;
  } else {
    if (lang === 'en-us') score += 100;
    else if (lang.startsWith('en')) score += 80;
  }

  if (voice.localService) score += 10;
  if (voice.default) score += 5;
  return score;
}

export function useSpeech() {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const runIdRef = useRef(0);
  const resumeTimerRef = useRef<number | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voiceName, setVoiceName] = useState<string | null>(null);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current !== null) {
      window.clearInterval(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    runIdRef.current += 1;
    clearResumeTimer();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    setIsSpeaking(false);
  }, [clearResumeTimer]);

  useEffect(() => {
    if (!isSupported) return;
    const synthesis = window.speechSynthesis;
    const loadVoices = () => setVoices(synthesis.getVoices());

    loadVoices();
    synthesis.addEventListener?.('voiceschanged', loadVoices);
    const delayedLoad = window.setTimeout(loadVoices, 350);

    return () => {
      window.clearTimeout(delayedLoad);
      synthesis.removeEventListener?.('voiceschanged', loadVoices);
      stop();
    };
  }, [isSupported, stop]);

  const speak = useCallback((text: string, options: SpeakOptions = {}) => {
    if (!isSupported) {
      setError('الصوت غير مدعوم في هذا المتصفح. جرّب Chrome أو Edge على جهاز يحتوي أصواتاً عربية.');
      return;
    }

    const chunks = splitText(text);
    if (!chunks.length) return;

    stop();
    setError(null);

    const synthesis = window.speechSynthesis;
    const language = options.lang ?? 'ar';
    const selectedVoice = [...voices]
      .sort((first, second) => voiceScore(second, language) - voiceScore(first, language))[0];
    setVoiceName(selectedVoice?.name ?? null);

    const currentRun = runIdRef.current;
    let chunkIndex = 0;

    const finish = () => {
      clearResumeTimer();
      utteranceRef.current = null;
      setIsSpeaking(false);
    };

    const playNext = () => {
      if (currentRun !== runIdRef.current) return;
      if (chunkIndex >= chunks.length) {
        finish();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunks[chunkIndex]);
      utterance.lang = language === 'ar' ? (selectedVoice?.lang.startsWith('ar') ? selectedVoice.lang : 'ar-AE') : (selectedVoice?.lang.startsWith('en') ? selectedVoice.lang : 'en-US');
      utterance.rate = options.rate ?? (language === 'ar' ? 0.8 : 0.88);
      utterance.pitch = options.pitch ?? 1;
      utterance.volume = options.volume ?? 1;
      if (selectedVoice) utterance.voice = selectedVoice;

      utterance.onstart = () => {
        if (currentRun !== runIdRef.current) return;
        setIsSpeaking(true);
        setError(null);
      };
      utterance.onend = () => {
        if (currentRun !== runIdRef.current) return;
        chunkIndex += 1;
        window.setTimeout(playNext, 60);
      };
      utterance.onerror = event => {
        if (currentRun !== runIdRef.current) return;
        const ignored = ['canceled', 'interrupted'];
        if (!ignored.includes(event.error)) {
          setError(event.error === 'not-allowed'
            ? 'المتصفح منع التشغيل التلقائي. اضغط زر الصوت مرة أخرى بعد التفاعل مع الصفحة.'
            : 'تعذّر تشغيل الصوت. تأكد أن صوت الجهاز مرتفع وأن هناك صوتاً عربياً مثبتاً.');
        }
        finish();
      };

      utteranceRef.current = utterance;
      synthesis.resume();
      synthesis.speak(utterance);
    };

    resumeTimerRef.current = window.setInterval(() => {
      if (currentRun !== runIdRef.current) return;
      if (synthesis.paused) synthesis.resume();
    }, 3000);

    window.setTimeout(playNext, 40);
  }, [clearResumeTimer, isSupported, stop, voices]);

  return {
    speak,
    stop,
    isSupported,
    isSpeaking,
    error,
    voiceName,
  };
}
