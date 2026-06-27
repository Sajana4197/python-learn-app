import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, type ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkTheme, lightTheme, type ThemeColors } from './tokens';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  mode: ThemeMode;
  resolvedScheme: 'light' | 'dark';
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
}

const THEME_STORAGE_KEY = 'indent.theme.mode';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function resolveScheme(
  mode: ThemeMode,
  systemScheme: ColorSchemeName | null | undefined
): 'light' | 'dark' {
  if (mode === 'system') {
    return systemScheme === 'dark' ? 'dark' : 'light';
  }
  return mode;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName | null | undefined>(
    Appearance.getColorScheme()
  );
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((stored) => {
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setModeState(stored);
        }
      })
      .finally(() => setIsHydrated(true));
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    AsyncStorage.setItem(THEME_STORAGE_KEY, next).catch(() => {
      // Non-fatal: theme preference simply won't persist this session.
    });
  };

  const resolvedScheme = resolveScheme(mode, systemScheme);
  const colors = resolvedScheme === 'dark' ? darkTheme : lightTheme;

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, resolvedScheme, colors, setMode }),
    [mode, resolvedScheme, colors]
  );

  // Avoid a flash of the wrong theme before AsyncStorage hydrates.
  if (!isHydrated) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
