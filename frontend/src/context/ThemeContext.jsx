import React, { createContext, useState, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a context for the theme
export const ThemeContext = createContext({
  toggleColorMode: () => {},
  mode: 'light',
});

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  // Toggle between light and dark mode
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode]
  );

  // Create the theme based on the current mode
  const theme = useMemo(
    () => createTheme({
      palette: {
        mode,
      },
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;