import { useState, useEffect, useCallback } from 'react';

const EVENT = 'portfolio-theme-change';

function readDarkFromStorage(): boolean {
  try {
    const saved = localStorage.getItem('workspace-section-configs');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed?.global?.themeMode === 'dark';
    }
  } catch {}
  return true; // default: dark
}

function applyDark(dark: boolean) {
  if (dark) document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
}

export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => readDarkFromStorage());

  useEffect(() => {
    applyDark(isDark);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handler = () => {
      const next = readDarkFromStorage();
      setIsDark(next);
      applyDark(next);
    };
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, []);

  const toggle = useCallback(() => {
    const next = !isDark;
    applyDark(next);
    setIsDark(next);
    try {
      const saved = localStorage.getItem('workspace-section-configs');
      const parsed = saved ? JSON.parse(saved) : {};
      if (!parsed.global) parsed.global = {};
      parsed.global.themeMode = next ? 'dark' : 'light';
      localStorage.setItem('workspace-section-configs', JSON.stringify(parsed));
    } catch {}
    window.dispatchEvent(new Event(EVENT));
  }, [isDark]);

  return { isDark, toggle };
}
