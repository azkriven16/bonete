import { useState, useEffect, useCallback } from 'react';

function readDark(): boolean {
  try {
    return localStorage.getItem('theme') !== 'light';
  } catch {}
  return true; // default: dark
}

function applyDark(dark: boolean) {
  if (dark) document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
}

export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => readDark());

  useEffect(() => {
    applyDark(isDark);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = useCallback(() => {
    const next = !isDark;
    applyDark(next);
    setIsDark(next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {}
  }, [isDark]);

  return { isDark, toggle };
}
