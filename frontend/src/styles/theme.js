import { createTheme } from '@mui/material/styles';

export const createAppTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#3949ab' : '#7986cb',
    },
    secondary: {
      main: mode === 'light' ? '#f50057' : '#ff4081',
    },
    background: {
      default: mode === 'light' ? '#f5f5f5' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
    text: {
      primary: mode === 'light' ? '#333333' : '#ffffff',
      secondary: mode === 'light' ? '#666666' : '#b3b3b3',
    },
  },
  typography: {
    fontFamily: "'Nunito Sans', 'Roboto', sans-serif",
    h1: {
      fontSize: '2rem',
      fontWeight: 800,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
    body1: {
      fontSize: '0.95rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: mode === 'light' 
            ? '0 2px 10px rgba(0,0,0,0.1)' 
            : '0 2px 10px rgba(0,0,0,0.5)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 16px',
        },
        contained: {
          boxShadow: mode === 'light' 
            ? '0 2px 5px rgba(0,0,0,0.2)' 
            : '0 2px 5px rgba(0,0,0,0.4)',
          '&:hover': {
            boxShadow: mode === 'light' 
              ? '0 4px 8px rgba(0,0,0,0.3)' 
              : '0 4px 8px rgba(0,0,0,0.6)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: mode === 'light' 
            ? '0 4px 12px rgba(0,0,0,0.1)' 
            : '0 4px 12px rgba(0,0,0,0.4)',
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '16px',
          '&:last-child': {
            paddingBottom: '16px',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        outlined: {
          borderRadius: '8px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          transition: 'all 0.3s ease',
        },
      },
    },
  },
});

// Default theme export for backward compatibility
export const theme = createAppTheme('light');