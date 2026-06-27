const { palette } = require('./src/theme/tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        ink: {
          950: palette.ink950,
          900: palette.ink900,
          800: palette.ink800,
          700: palette.ink700,
          500: palette.ink500,
        },
        mist: {
          200: palette.mist200,
          100: palette.mist100,
        },
        paper: {
          50: palette.paper50,
        },
        amber: {
          100: palette.amber100,
          500: palette.amber500,
          600: palette.amber600,
        },
        indigo: {
          100: palette.indigo100,
          500: palette.indigo500,
          600: palette.indigo600,
        },
        success: {
          100: palette.success100,
          500: palette.success500,
        },
        coral: {
          100: palette.coral100,
          500: palette.coral500,
        },
      },
      fontFamily: {
        display: ['Sora_700Bold'],
        'display-semibold': ['Sora_600SemiBold'],
        body: ['Inter_400Regular'],
        'body-medium': ['Inter_500Medium'],
        'body-semibold': ['Inter_600SemiBold'],
        mono: ['JetBrainsMono_400Regular'],
        'mono-medium': ['JetBrainsMono_500Medium'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
    },
  },
  plugins: [],
};
