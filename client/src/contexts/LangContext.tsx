import { createContext, ReactNode, useContext, useState } from 'react';

export type Lang = 'ar' | 'en';

interface LangContextValue {
  lang: Lang;
  toggle: () => void;
  t: (ar: string, en: string) => string;
  dir: 'rtl' | 'ltr';
}

const LangContext = createContext<LangContextValue>({
  lang: 'ar',
  toggle: () => {},
  t: (ar) => ar,
  dir: 'rtl',
});

const STORAGE_KEY = 'family-school-lang';

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try { return (localStorage.getItem(STORAGE_KEY) as Lang) ?? 'ar'; } catch { return 'ar'; }
  });

  const toggle = () => {
    setLang(l => {
      const next: Lang = l === 'ar' ? 'en' : 'ar';
      try { localStorage.setItem(STORAGE_KEY, next); } catch {}
      return next;
    });
  };

  const t = (ar: string, en: string) => lang === 'ar' ? ar : en;

  return (
    <LangContext.Provider value={{ lang, toggle, t, dir: lang === 'ar' ? 'rtl' : 'ltr' }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  return useContext(LangContext);
}
