import { StyleSheet } from "react-native";

import { theme as defaultTheme, Theme } from "@/constants/theme";

/**
 * Wrapper for `StyleSheet.create()`, allowing easy access to the theme
 * @param fn {(theme: Theme) => T} A function to passes in the theme
 * @param theme {Theme} A theme object
 * @returns {object} A styles object
 */
const createThemedStyleSheet = <T extends StyleSheet.NamedStyles<T>>(
  fn: (theme: Theme) => T,
  theme: Theme = defaultTheme
): T => {
  return StyleSheet.create(fn(theme));
};

export { createThemedStyleSheet };
