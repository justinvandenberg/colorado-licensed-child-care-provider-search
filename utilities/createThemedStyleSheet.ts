import { StyleSheet } from "react-native";

import { theme as defaultTheme, Theme } from "@/constants/theme";

const createThemedStyleSheet = <T extends StyleSheet.NamedStyles<T>>(
  fn: (theme: Theme) => T,
  theme: Theme = defaultTheme
): T => {
  return StyleSheet.create(fn(theme));
};

export { createThemedStyleSheet };
