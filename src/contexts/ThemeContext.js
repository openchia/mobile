import { createContext } from 'react';

const ThemeContext = createContext({
  toggleTheme: () => {},
  isThemeDark: false,
});

export const ThemeContextProvider = ThemeContext.Provider;

export default ThemeContext;
