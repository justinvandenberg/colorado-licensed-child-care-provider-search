import { createContext, PropsWithChildren, useContext } from "react";

import { theme, Theme } from "@/constants/theme";

const ThemeContext = createContext<Theme | undefined>(undefined);

const ThemeProvider = ({ children }: PropsWithChildren) => {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

export { ThemeProvider, useTheme };
