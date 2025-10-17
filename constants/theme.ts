// import { DMSans_400Regular } from '@expo-google-fonts/dm-sans/400Regular';
// import { DMSans_500Medium } from '@expo-google-fonts/dm-sans/500Medium';
// import { DMSans_600SemiBold } from '@expo-google-fonts/dm-sans/600SemiBold';
// import { DMSans_700Bold } from '@expo-google-fonts/dm-sans/700Bold';
// import { DMSans_400Regular_Italic } from '@expo-google-fonts/dm-sans/400Regular_Italic';
// import { DMSans_500Medium_Italic } from '@expo-google-fonts/dm-sans/500Medium_Italic';
// import { DMSans_600SemiBold_Italic } from '@expo-google-fonts/dm-sans/600SemiBold_Italic';
// import { DMSans_700Bold_Italic } from '@expo-google-fonts/dm-sans/700Bold_Italic';
// import { DMSans_800ExtraBold_Italic } from '@expo-google-fonts/dm-sans/800ExtraBold_Italic';
// import { DMSans_900Black_Italic } from '@expo-google-fonts/dm-sans/900Black_Italic';

/**
 * Define spacing before the rest of the theme to allow its values
 * to be referenced elsewhere within the theme object
 */
const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  13: 52,
  14: 56,
  15: 60,
  16: 64,
  17: 68,
  18: 72,
  19: 76,
  20: 80,
  21: 84,
  22: 88,
  23: 92,
  24: 96,
  25: 100,
};

const theme = {
  spacing,
  color: {
    transparent: "transparent",
    white: "#fff",
    violet: {
      50: "#f0effe",
      100: "#e2e0fd",
      200: "#c5c0fb",
      400: "#514df2",
      700: "#2c28ab",
      950: "#18065e",
    },
    yellow: {
      100: "#fff5d4",
      400: "#f3bc16",
      700: "#bb9112",
    },
    green: {
      100: "#c5fae8",
      400: "#02bab1",
      700: "#048c62",
    },
    red: {
      100: "#ffd5d8",
      400: "#f25e6b",
      700: "#a32d38",
    },
  },
  fontFamily: {
    sans: {
      normal: "DMSans_400Regular",
      contrast: "DMSans_500Medium",
      bold: "DMSans_600SemiBold",
    },
  },
};

export type Theme = typeof theme;

// const globalStyles = {
//   shadow: {
//     sm: {
//       shadowColor: theme.color.violet[800],
//       shadowOffset: { width: 0, height: 1 },
//       shadowOpacity: 0.18,
//       shadowRadius: 1.0,
//       elevation: 1,
//     },
//     DEFAULT: {
//       shadowColor: theme.color.violet[800],
//       shadowOffset: { width: 0, height: 1 },
//       shadowOpacity: 0.2,
//       shadowRadius: 1.41,
//       elevation: 2,
//     },
//     md: {
//       shadowColor: theme.color.violet[800],
//       shadowOffset: { width: 0, height: 3 },
//       shadowOpacity: 0.27,
//       shadowRadius: 4.65,
//       elevation: 4,
//     },
//     lg: {
//       shadowColor: theme.color.violet[800],
//       shadowOffset: { width: 0, height: 4 },
//       shadowOpacity: 0.3,
//       shadowRadius: 4.65,
//       elevation: 6,
//     },
//     xl: {
//       shadowColor: theme.color.violet[800],
//       shadowOffset: { width: 0, height: 6 },
//       shadowOpacity: 0.37,
//       shadowRadius: 7.49,
//       elevation: 8,
//     },
//     "2xl": {
//       shadowColor: theme.color.violet[800],
//       shadowOffset: { width: 0, height: 12 },
//       shadowOpacity: 0.58,
//       shadowRadius: 16.0,
//       elevation: 12,
//     },
//   },
// } as const;

// export type GlobalStyles = typeof globalStyles;

// export const Fonts = Platform.select({
//   ios: {
//     /** iOS `UIFontDescriptorSystemDesignDefault` */
//     sans: 'system-ui',
//     /** iOS `UIFontDescriptorSystemDesignSerif` */
//     serif: 'ui-serif',
//     /** iOS `UIFontDescriptorSystemDesignRounded` */
//     rounded: 'ui-rounded',
//     /** iOS `UIFontDescriptorSystemDesignMonospaced` */
//     mono: 'ui-monospace',
//   },
//   default: {
//     sans: 'normal',
//     serif: 'serif',
//     rounded: 'normal',
//     mono: 'monospace',
//   },
//   web: {
//     sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
//     serif: "Georgia, 'Times New Roman', serif",
//     rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
//     mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
//   },
// });

export { theme };
