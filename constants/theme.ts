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

export { theme };
