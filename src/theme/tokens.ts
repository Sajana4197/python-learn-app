/**
 * Design tokens for Indent.
 *
 * Brand identity: "Indent" — the one Python rule every beginner trips on
 * becomes the visual signature. Layouts favor a left-stepped, staircase
 * rhythm (see `indentSteps` below) instead of generic circular progress
 * rings or neon-terminal clichés common in coding-education apps.
 *
 * Palette is warm-neutral (not stark navy/black) paired with an amber +
 * indigo duo, nodding to Python's own blue/yellow brand lineage without
 * copying it directly.
 */

export const palette = {
  // Neutrals — warm, not cold-navy
  ink950: '#14171C',
  ink900: '#1B1F26',
  ink800: '#262B34',
  ink700: '#383E49',
  ink500: '#6B7280',
  mist200: '#E2E5EA',
  mist100: '#EDEFF2',
  paper50: '#F7F6F2',
  white: '#FFFFFF',

  // Brand duo
  amber500: '#E8A23D',
  amber600: '#CF8A28',
  amber100: '#FBE8C9',
  indigo500: '#5B6EE8',
  indigo600: '#4759C9',
  indigo100: '#E2E6FB',

  // Semantic
  success500: '#3DAA6E',
  success100: '#D9F0E3',
  coral500: '#E8614A',
  coral100: '#FBDED7',
  warning500: '#E8A23D',
} as const;

export const lightTheme = {
  background: palette.paper50,
  surface: palette.white,
  surfaceAlt: palette.mist100,
  border: palette.mist200,
  textPrimary: palette.ink950,
  textSecondary: palette.ink500,
  textInverse: palette.paper50,
  accentPrimary: palette.amber500,
  accentPrimaryPressed: palette.amber600,
  accentSecondary: palette.indigo500,
  accentSecondaryPressed: palette.indigo600,
  success: palette.success500,
  successSurface: palette.success100,
  danger: palette.coral500,
  dangerSurface: palette.coral100,
  codeBackground: palette.ink950,
  codeText: palette.mist100,
} as const;

export const darkTheme = {
  background: palette.ink950,
  surface: palette.ink900,
  surfaceAlt: palette.ink800,
  border: palette.ink700,
  textPrimary: palette.paper50,
  textSecondary: palette.mist200,
  textInverse: palette.ink950,
  accentPrimary: palette.amber500,
  accentPrimaryPressed: palette.amber600,
  accentSecondary: palette.indigo500,
  accentSecondaryPressed: palette.indigo600,
  success: palette.success500,
  successSurface: '#1C3829',
  danger: palette.coral500,
  dangerSurface: '#3A2420',
  codeBackground: '#0E1014',
  codeText: palette.mist100,
} as const;

export type ThemeColors = Record<keyof typeof lightTheme, string>;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

/**
 * The "indent step" rhythm: each step in a sequence (lesson tree, progress
 * trail, onboarding) is offset further from the left margin than the last,
 * echoing Python's indentation rule. Used by LessonTree and StepProgress.
 */
export const indentSteps = {
  baseOffset: 0,
  stepOffset: 18, // px added per nesting level
  maxVisibleLevels: 4,
} as const;

export const fontFamily = {
  display: 'Sora_700Bold',
  displaySemibold: 'Sora_600SemiBold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemibold: 'Inter_600SemiBold',
  mono: 'JetBrainsMono_400Regular',
  monoMedium: 'JetBrainsMono_500Medium',
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

export const lineHeight = {
  tight: 1.15,
  snug: 1.3,
  normal: 1.5,
  relaxed: 1.65,
} as const;
