import React from 'react';
import { createTheme, CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { deepmerge } from '@mui/utils';

type ColorMode = 'light' | 'dark';

type ColorModeContextValue = {
  mode: ColorMode;
  toggle: () => void;
};

export const ColorModeContext = React.createContext<ColorModeContextValue>({
  mode: 'light',
  toggle: () => {},
});

const baseDesignTokens = (mode: ColorMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#6C5CE7' },
          secondary: { main: '#00D1FF' },
          background: { default: '#F7F8FC', paper: '#FFFFFF' },
        }
      : {
          primary: { main: '#8F7BFF' },
          secondary: { main: '#00E5FF' },
          background: { default: '#0E0F13', paper: '#12141A' },
        }),
    success: { main: '#2ecc71' },
    warning: { main: '#f1c40f' },
    error: { main: '#e74c3c' },
    info: { main: '#3498db' },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'saturate(140%) blur(8px)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: mode === 'light'
            ? 'linear-gradient(180deg, rgba(255,255,255,0.90) 0%, rgba(255,255,255,0.70) 100%)'
            : 'linear-gradient(180deg, rgba(18,20,26,0.80) 0%, rgba(18,20,26,0.60) 100%)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiButton: {
      defaultProps: { variant: 'contained' },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow:
            mode === 'light'
              ? '0 10px 30px rgba(108,92,231,0.08)'
              : '0 10px 30px rgba(0,0,0,0.45)',
        },
      },
    },
  },
});

const gradientBackground = (mode: ColorMode) =>
  mode === 'light'
    ? 'linear-gradient(135deg, #F7F8FC 0%, #EAF2FF 50%, #F8F1FF 100%)'
    : 'linear-gradient(135deg, #0E0F13 0%, #131523 50%, #151329 100%)';

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = React.useState<ColorMode>(prefersDark ? 'dark' : 'light');

  const colorMode = React.useMemo(
    () => ({ mode, toggle: () => setMode((m) => (m === 'light' ? 'dark' : 'light')) }),
    [mode]
  );

  const theme = React.useMemo(() => {
    const base = createTheme(baseDesignTokens(mode));
    return deepmerge(base, {
      cssVariables: true,
    });
  }, [mode]);

  React.useEffect(() => {
    document.body.style.background = gradientBackground(mode);
    document.body.style.minHeight = '100vh';
  }, [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export const useColorMode = () => React.useContext(ColorModeContext);